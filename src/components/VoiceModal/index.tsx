import { useState } from "react";
import icons from "../../assets/icons/Index";

// interface recognitionType {
//   recognition: {
//     continuous: boolean;
//     interimResults: boolean;
//     onstart: () => void;
//     start: () => void;
//     stop: () => void;
//     onend: () => void;
//     onresult: (event: any) => void;
//   };
// }

const VoiceModal = ({ closeModal, setInputValue }: any) => {
  const [transcription, setTranscription] = useState("");
  const [listening, setListening] = useState(false);
  let recognition: any;
  const startListening = () => {
    recognition = new (window as any).webkitSpeechRecognition(); // Use window as any

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };


    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscription(finalTranscript);
      setInputValue(finalTranscript); // Update inputValue in the parent component
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleTryAgain = () => {
    setTranscription("");
    setInputValue("");
    startListening();
  };

  return (
    <>
      <div
        className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-50 backdrop-blur-sm p-12 md:p-0"
        onClick={handleBackgroundClick}
      >
        <div className="p-10 md:p-16 border-gray-300 rounded-lg shadow-md flex justify-between items-center bg-white relative">
          <div className="flex">
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-4xl">Listening...</h1>
              <p className="mt-2 text-lg">{transcription}</p>
              <button
                onClick={handleTryAgain}
                className="mt-4 text-red underline hover:text-red-600"
              >
                Try again
              </button>
            </div>
            <div className="md:p-8 flex items-center justify-center bg-[#D7E5FF] hover:w-32 hover:h-32 hover:p-4 rounded-full">
              {!listening ? (
                <button
                  onClick={startListening}
                  className="p-4 w-28 h-28 bg-blue hover:bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <img src={icons.VoiceIcons} alt="voice" />
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="p-4 w-28 h-28 bg-red hover:bg-red-600 rounded-full flex items-center justify-center"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoiceModal;