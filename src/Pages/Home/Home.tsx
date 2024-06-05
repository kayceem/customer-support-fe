import React, { useState, useEffect, useRef } from 'react';
import Sidebar from "../../components/Sidebar/Index";
import Icons from "../../assets/icons/Index";
import Image from "../../assets/images/index";
import useChat from "../../hooks/fetchData";
import axiosService from '../../utils/apiServices'
import { useAuth } from '../../context/AuthContext';
import { Navigate } from "react-router-dom";
import { Drawer } from "antd";
import VoiceModal from '../../components/VoiceModel';
import Markdown from "react-markdown";


// response loading
const SkeletonLoading = () => {
  return (
    <div className="animate-pulse flex flex-col gap-2 py-2">
      <div className="flex items-center space-x-4">
        <div className="w-full h-4 bg-gray-300 rounded"></div>
      </div>
      <div className="w-full h-4 bg-gray-300 rounded"></div>
      <div className="w-full h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [conversationData, setConversationData] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const streamStateRef = useRef<HTMLDivElement>(null);

// HERE
  const questions = [
    "What can you tell me?",
    "What kind of agricultural plans has been alleviated to make agriculture a desirable livelihood?",
    "What is the vision of congress in dairying and poultry in five years?",
    "How much financial assistance per year does Congress plan to provide to every poor Indian family under the Mahalakshmi scheme?"
  ];

  const getAllConversation = async () => {
    try {
      const response = await axiosService.get('/conversations/');
      if (!response.data) {
        throw new Error('No data received');
      }

      const data = response.data;
      const sortedData = data.sort((a: any, b: any) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      const recentConversations = sortedData.slice(0, 5);
      setConversationData(recentConversations);
    } catch (error) {
      console.error('Error fetching conversation data:', error);
    }
  };

  const handleQuestionClick = (questionText: string) => {
    setInputValue(questionText);
  };

  const { inputValue, setInputValue, streamState, messages, sendQuestion, setMessages, loading } = useChat(getAllConversation);


  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = mainContentRef.current.scrollHeight;
    }
    if (streamStateRef.current) {
      streamStateRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, streamState]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendQuestion(inputValue);
    setInputValue("");
    setSubmitted(true);
  };

  useEffect(() => {
    getAllConversation();
  }, []);


  const updateSubmittedState = (value: boolean) => {
    setSubmitted(value);
  };
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };

  const removeMarkers = (text : string) => {
    return text.replace(/\^\d+\^/g, '');
  }

  return (
    <>
      {isAuthenticated ? (
        <div className="flex h-screen relative">
          <div className="hidden bg-blue-light md:block lg:block w-1/5">
            <Sidebar inputValue={inputValue} setMessages={setMessages} conversationData={conversationData} setSubmittedState={updateSubmittedState} />
          </div>
          <Drawer
            placement={"left"}
            closable={false}
            onClose={onClose}
            open={open}
            style={{
              backgroundColor: "#EDF5FF",
            }}
          >
            <Sidebar inputValue={inputValue} setMessages={setMessages} conversationData={conversationData} setSubmittedState={updateSubmittedState} />
          </Drawer>
          <button className="absolute top-0 pt-2 pl-4 md:hidden" onClick={showDrawer}>
            <img
              src={Icons.HamburgerMenu}
              className="w-[34px] h-[34px]"
              alt="Hamburger"
            />
          </button>
          <div className="h-screen w-full md:w-4/5 flex justify-center overflow-auto" style={{ maxHeight: 'calc(100% - 90px)' }}>

            <div className={`my-8 flex flex-col items-center ${submitted ? 'w-[100%]' : 'w-4/5'} px-4`} ref={mainContentRef}>
              {!submitted && !Boolean(messages.length) ? (
                <>
                  <div className="flex flex-col gap-4 items-center justify-center mt-4">
                    <h3 className="text-xl font-semibold text-blue lg:text-3xl">Hi there!</h3>
                    <p className="text-base text-gray-light leading-5 lg:text-xl">What can I help you with?</p>
                  </div>
                  <div className="my-8 w-full flex items-center justify-center">
                    <img src={Image.BannerImage} alt="User-icon" className="object-cover h-full" />
                  </div>
                  {/* <div className="w-full flex gap-4">
                    <img className="flex" src={Icons.HrUserIcon} alt="logo" />
                    <div className="flex flex-col mt-8 gap-2">
                      <h3 className="text-darker font-semibold text-lg lg:text-lg">Customer Support</h3>
                      <p className="text-gray-dark text-sm lg:text-base">Hello, I can help you find the perfect answers for queries.</p>
                    </div>
                  </div> */}
                  {/* <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 p-2 md:p-0 w-full gap-5 mt-12 md:mt-20">
                    <div className="border border-gray-normal rounded-xl p-3 text-sm md:p-4 md:text-base">What amount does the congress propose to raise as a pension to senior citizen?</div>
                    <div className="border border-gray-normal rounded-xl p-3 text-sm md:p-4 md:text-base">What kind of agricultural plans has been alleviated to make agriculture a desirable livelihood?</div>
                    <div className="border border-gray-normal rounded-xl p-3 text-sm md:p-4 md:text-base">What is the vision of congress in dairying and poultry in five years?</div>
                    <div className="border border-gray-normal rounded-xl p-3 text-sm md:p-4 md:text-base"> How much financial assistance per year does Congress plan to provide to every  poor Indian family under the Mahalakshmi scheme?</div>
                  </div> */}
                  <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 p-2 md:p-0 w-full gap-5 mt-12 md:mt-20">
                    {questions.map((question, index) => (
                      <div 
                        key={index}
                        className="border border-gray-normal rounded-xl p-3 text-sm md:p-4 md:text-base cursor-pointer" 
                        onClick={() => handleQuestionClick(question)}
                      >
                        {question}
                      </div>
                    ))}
                  </div>
                </>
              ) :
                messages.map((msg: any, index: number) => {
                  const isSender = msg.type === "Send";
                  let content = null;
                  content = msg?.content

                  return (
                    <div key={index} className="w-full md:w-4/5 flex flex-col gap-2 py-2">
                      {content && (
                        <>
                          <div className="flex w-[100%] items-center space-x-4">
                            {
                              !isSender ? 
                              <img className="flex w-[34px] h-[32px]" src={Icons.HrUserIcon} alt="logo" /> :
                              <img className="flex w-[32px] h-[32px]" src={Icons.UserNameIcons} alt="logo" />
                            }
                            <h3 className="text-darker text-xl font-semibold">{!isSender ? "Customer Support" : "You"}</h3>
                          </div>
                          <div className="flex flex-col w-[100%]">
                            <p className="text-gray-dark text-sm pl-14 text-justify md:text-base">
                              {!isSender ? (<Markdown>{removeMarkers(content)}</Markdown>) : content}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              }
              {loading ? (
                <div className='w-4/5'>
                  <div className="flex items-center space-x-4">
                    <img className="flex w-[34px] h-[32px]" src={Icons.HrUserIcon} alt="logo" />
                    <h3 className="text-darker text-xl font-semibold">Customer Support</h3>
                  </div>
                  <p className='text-gray-dark w-[100%] text-sm pl-14 md:text-lg text-justify'>
                    <SkeletonLoading />
                  </p>
                </div>
              ) : null}
            </div>
            <div className='w-[65%] fixed bottom-0 mb-4'>
              <form className="border border-gray-normal rounded-xl flex justify-between items-center p-1 md:p-2 md:w-full mt-6 md:mt-8" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 outline-none placeholder-gray-dark text-base w-[50%]"
                  placeholder="Enter your message"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  required
                />
                <div className="flex gap-3 pr-2 md:p-0">
                {/* <button type="button" onClick={handleButtonClick}>
                    <img src={Icons.MicIcon} alt="VoiceIcon" className="object-cover" />
                  </button>
                  {isModalOpen && <VoiceModal closeModal={closeModal} setInputValue={setInputValue} />} */}
                  <button type="submit" className={`bg-blue p-2 rounded-md ${!inputValue && 'opacity-50 cursor-not-allowed'}`} disabled={!inputValue}>
                    <img src={Icons.ArrowIcon} alt="ArrowIcon" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Home;
