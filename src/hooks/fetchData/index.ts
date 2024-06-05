import { useState, useEffect } from "react";
import config from "../../config/api";
import { useLocation } from "react-router";

interface Message {
  content: string;
  sender: string;
}



const useChat = (getAllConversation: () => void) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [streamState, setStreamState] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false); // State to track loading

  const controller = new AbortController();
  const [conid, setConId] = useState<string>("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const last_convId = params.get("conversation");

  useEffect(() => {
    setConId(last_convId || "");
  }, [last_convId]);
  useEffect(() => {
    const controller = new AbortController();
    return () => {
      controller.abort();
    };
  }, []);

  const handleStreamingResponse = (stream: any, newmessages: any[]) => {
    const reader = stream.getReader();
    let chunk = streamState;

    reader.read().then(function process({ done, value }: { done: boolean; value: AllowSharedBufferSource | undefined }) {
      chunk += new TextDecoder("utf-8").decode(value);
      const json_chunk = JSON.parse(chunk);
      const content = json_chunk?.formatted_answer;

      if (done) {
        getAllConversation();
        setLoading(false);
        setStreamState("");
        setMessages([...newmessages, { content: content, type: "Receive" }]);
        controller.abort();
        return;
      }
      setStreamState(chunk);
      reader.read().then(process).catch((err: any) => {
        if (err.name === "AbortError") {
          setLoading(false);
        }
      });
    });
  };

  const sendQuestion = async (text: string) => {
    setLoading(true); // Set loading to true when sending question

    const safeText = text.trim();
    if (safeText === "") {
      setLoading(false);
      return;
    }
    const newmessages: Message[] = [...messages, { content: safeText, type: "Send" }];
    setMessages(newmessages);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Access token not found");
      setLoading(false);
      return;
    }

    try {
      let currentConId = conid;
      
      if (!currentConId) {
        const response = await fetch(`${config.baseUrl}/conversations/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title: text, chat: config.chatBot }),
        });
        const data = await response.json();
        currentConId = data.id;
        setConId(currentConId);
      }

      const chatResponse = await fetch(`${config.baseUrl}/conversations/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ conversation: currentConId , content: text }),
        signal: new AbortController().signal,
      });
      console.log("first", chatResponse)
      console.log("body", chatResponse.body)
      console.log("body", JSON.stringify(chatResponse.body))
      await handleStreamingResponse(chatResponse.body, newmessages);

    } catch (error) {
      console.error("Failed to send question:", error);
      setLoading(false);
    }
  };

  return {
    inputValue,
    setInputValue,
    streamState,
    messages,
    setMessages,
    loading, // Return loading state
    sendQuestion,
  };
};

export default useChat;
