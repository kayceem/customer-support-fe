import { useState } from 'react';
import icons from '../../assets/icons/Index';
import config from '../../config/api';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ setMessages, conversationData, setSubmittedState }: any) => {
    const { logout } = useAuth()
    const [activeConversation, setActiveConversation] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleConversationClick = async (conversationId: string, index: number) => {
        setActiveConversation(index);
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await fetch(`${config.baseUrl}/conversations/chat/${conversationId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMessages(data);
            navigate(`?conversation=${conversationId}`);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleNewChat = () => {
        setSubmittedState(false);
        setMessages([]);
        navigate("/home")       
    };
    const handleLogout = () => {
        logout()
    }

    return (
        <div className="flex justify-between flex-col h-full">
            <div className='px-2.5 py-3.5'>
                <Link to="/home">
                    <div className='flex gap-1'>
                        <img src={icons.LogoIcon} alt="logo" />
                        <h1 className='font-ubuntu text-gray-darker font-semibold  flex items-center md:text-2xl'>Customer Support</h1>
                    </div>
                </Link>
                <div className=''>
                    <button className='rounded-xl border border-blue-400 border-solid outline-1 bg-white px-4 py-3 mt-8 w-full flex gap-3 items-center text-blue cursor-pointer text-sm ml md:ml-0 md:text-lg' onClick={handleNewChat}><img src={icons.ChatIcon} alt="chat" className='object-cover h-[28px] w-[28px]' />New Chat</button>
                </div>

                <div className='mt-8 flex flex-col gap-3'>
                    <span className="text-[#C0C0C0]">Today</span>
                    {conversationData.map((conversation: any, index: number) => (
                        <div key={index}>
                            <button
                                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 mt bg-${activeConversation === index ? 'white' : 'blue-light'} text-gray-lightGray text-xl md:text-xl`}
                                onClick={() => handleConversationClick(conversation.id, index)} // Pass conversation.id and index
                            >
                                <div className='flex gap-2 items-center  overflow-hidden'>

                                    <img src={icons.MessageIcon} alt="chat" />

                                    <p className='w-full mb-2 text-sm text-start md:text-base line-clamp-1 lg:text-lg'>{conversation.title}</p>
                                </div>
                                {/* {activeConversation === index && (
                                        <span>
                                            <img src={icons.ThreeDotIcon} alt="chat" />
                                        </span>
                                    )} */}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='p-6 mt-10 md:mt-12'>
                {/* <div className='flex gap-4 items-center cursor-pointer'>
                    <img src={icons.SetIcon} alt='set' />
                    <p className='text-gray text-sm md:text-lg'>Set preferences</p>
                </div> */}
                <div className='flex gap-4 items-center cursor-pointer' onClick={handleLogout}>
                    <img src={icons.Loginicon} alt='login' />
                    <p className='text-gray text-sm md:text-lg'>Log Out</p>
                </div>
                {/* <div className='flex gap-4 items-center cursor-pointer'>
                    <img src={icons.HelpIcon} alt='help' />
                    <p className='text-gray text-sm md:text-lg'>Help</p>
                </div> */}
            </div>
        </div>
    )
}

export default Sidebar;