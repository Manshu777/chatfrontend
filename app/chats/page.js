'use client'

 
import Image from "next/image";
import React, { useState, useEffect,useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import sendicon from '../../public/images/sendicon.svg';
import { io } from 'socket.io-client';
import { FaSearch } from "react-icons/fa";

import { useRouter } from 'next/router';


import Contacts from '../components/Contacts';
import axios from 'axios';
import Welcom from '../components/Welcome';

import bg from '../../public/images/bg.png';

const Charts = () => {

  const host = "https://chatbackend-5pxo.onrender.com"
  const [messageInput,setMessageInput] = useState();
  const [slectuser,setselectuser] = useState(true);
  const [messages, setMessages] = useState([]);
 
  const socket = useRef();
  const scrollRef = useRef();
  const [setInp,setnewInp] = useState();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [currentUser, setCurrentUser] = useState(undefined);

  const [showEmojiPicker,setShowEmojiPicker] = useState();

  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [inputValue, setInputValue] = useState('');

  // Function to be called when Enter key is pressed
  const handleEnter = () => {
    handleSendMsg()
  };

  // Event handler for input field key press
  const handleKeyPress = (event) => {
 
    if (event.key === 'Enter') {
    
      handleEnter();
    }
  };


  const addEmoji = (e) => {
    const emoo = e.unified.split('_');
    const codeArray = emoo.map((element) => "0x" + element);
    let emoji = String.fromCodePoint(...codeArray);

    setMessageInput((prevMessage) => prevMessage + emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevShowEmojiPicker) => !prevShowEmojiPicker);
  };
  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem('usertoken');

    // Redirect to the login page or handle the redirection logic
    window.location.href = '/';
  };

  useEffect(() => {
    const scrollToBottom = () => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    scrollToBottom();
  }, [messages]);
 

   useEffect(()=>{
    const userTok = localStorage.getItem('usertoken');
    const noneuser = () => {
       if(!userTok) {
        window.location.href = '/';
       }

    }

    noneuser()
    
   })



  useEffect(() => {

   const checkuser = async () => {
   if (currentUser) {
     socket.current = io(host);
     socket.current.emit("add-user", currentUser._id);
   }
}
checkuser()
   
 });
 useEffect(() => {
   const fetchData = async () => {
 
     if (currentUser) {
       try {

         const response = await axios.get(`https://chatbackend-5pxo.onrender.com/alluser/${currentUser._id}`);
          console.log(currentUser._id);
         setContacts(response.data);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     }
   };
 
   fetchData();
 
 }, [currentUser]);

 const handleSendMsg = async (e) => {
 
   e.preventDefault();
    
  const data = await JSON.parse(
    localStorage.getItem("usertoken")
  );



  console.log(currentUser._id);


  socket.current.emit("send-msg", {
    to: currentChat._id,
    from: data._id,
    messageInput,
  });

   

  
  const res = await axios.post("https://chatbackend-5pxo.onrender.com/messages", {
    from: data._id,
    to: currentChat._id,
    message: messageInput,
  });

   

  const msgs = [...messages];
  msgs.push({ fromSelf: true, message: messageInput });
  setMessages(msgs);

  // Clear the input after sending the message
  setMessageInput("");
};


useEffect( () => {
  
  const getMesssages = async () => {
  const data = await JSON.parse(
    localStorage.getItem("usertoken")
  );
  //  (data._id)
  console.log(data);
  setCurrentUser(data)
  
  const response = await axios.post("https://chatbackend-5pxo.onrender.com/getmessages", {
    from: data._id,
    to: currentChat?._id,
  });
  //  (response.data)
  setMessages(response.data);
}
getMesssages()
}, [currentChat]);
 
 const handleChatChange = (chat) => {
 
   setCurrentChat(chat);
   setselectuser(false)

 };


 useEffect(() => {
  const getLivemesg = () => {
     if (socket.current) {
        socket.current.on("msg-recieve", (msg) => {
            
           setArrivalMessage({ fromSelf: false, message: msg });
        });    
     }
  }
  getLivemesg();
}, [socket.current]); 

useEffect(() => {
  const setMesag= ()=>{
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }
   setMesag()
}, [arrivalMessage]);

const handleInputChange = (event) => {
  const searchTerm = event.target.value;


  if (!searchTerm.trim()) {
    setContacts(contacts);
    return;
  }

  // Filtering the dataset based on the 'name' property
  setTimeout(() => {
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchTerm)

  );
  setContacts(filteredContacts);
}, 1000);
  // Updating the state with the filtered dataset
 
};
    
const backgroundImageStyle = {

   backgroundImage: `url(${bg.src})`,
 };

 
  return (

 
    <div className="flex flex-col h-screen bg-gray-100">
       {console.log(sendicon)}
      {/* Header */}
      <header className="flex flex-col bg-white p-4 text-white">
      <div className='w-full flex max-md:justify-around'>
      <div className='w-[24%] max-md:w-[98%] p-2 relative'> 
      <div className='top-[1.25rem]  left-[1.20rem] absolute text-xl  text-[#707991]'>
      <FaSearch />
      </div>
      <input
    type="text"
    placeholder="Search"
    
    onChange={(event) => handleInputChange(event)}
    className="w-[80%] text-gray-700 pl-8 border border-gray-300 p-2 rounded-full"
  />
      </div>

{ currentChat ?       <div className='flex p-1 border-l-4 '>
    <Image
       width={100}
       height={100}
      src={`https://chatbackend-5pxo.onrender.com/uploads/${currentChat?.profileImage}`}
      alt="User Image"
      className="w-10 h-10 rounded-full mr-2"
    />
    <span className="text-gray-800 font-semibold max-md:hidden">{currentChat?.username}</span>  {/* Replace with the actual user's name */}
  </div> : ""
}
</div>
      </header>
        {/* <button type="button" onClick={handleLogout}>
        Logout
      </button> */}

      <div className="flex flex-col md:flex-row justify-between flex-1 ">
        <div className="w-full bg-white md:w-1/3 max-md:flex max-md:overflow-scroll  mb-4 md:mb-0 h-[18vh] md:h-full">
     
        <Contacts contacts={contacts} changeChat={handleChatChange} />

        </div>
        <div className="w-full md:w-2/2 rounded-lg  h-[65vh] md:h-full">
             



        <div className='relative w-full h-[100%] bg-[#8BABD8] m-auto bg-cover bg-center p-5' style={backgroundImageStyle}>


       
        <div    className='w-full h-[80vh] max-md:h-[50vh] overflow-scroll p-2 pb-[2rem]'>
        
        {slectuser ? <Welcom/> : 

        <>
        {messages.map((message, index) => (
          <div ref={scrollRef
          
          }>
        <div  key={index} className={`flex ${message.fromSelf ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`message px-2 py-1 max-w-md m-2 ${
              message.fromSelf ? 'bg-[#78E378] text-black rounded-lg ml-auto' : 'bg-[#FFFFFF] text-black rounded-lg mr-auto'
            }`}
          >
            <div className="content">
              <p>{message.message}</p>
            </div>
          </div>
        </div>
        </div>
      ))}
      </>
        }
        </div>

       <div className='absolute bg-[#ffffff] md:w-[98%] w-[95%] bottom-[1%] left-2'> 
        <div className="flex items-center border rounded relative">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 pl-10 py-2 px-4 relative bg-transparent rounded-l focus:outline-none"
                />

                <div className="mx-2 font-bold text-cyan-900 absolute top-[9px] left-[6px]" onClick={toggleEmojiPicker}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.999C17.524 1.999 22.002 6.477 22.002 12.001C22.002 17.524 17.524 22.002 12 22.002C6.476 22.002 1.998 17.524 1.998 12.001C1.998 6.477 6.476 1.999 12 1.999ZM12 3.499C10.8758 3.48681 9.76036 3.6977 8.71822 4.11947C7.67608 4.54124 6.72793 5.16552 5.92866 5.95617C5.12939 6.74681 4.49487 7.68813 4.06182 8.72564C3.62877 9.76315 3.4058 10.8762 3.4058 12.0005C3.4058 13.1248 3.62877 14.2379 4.06182 15.2754C4.49487 16.3129 5.12939 17.2542 5.92866 18.0448C6.72793 18.8355 7.67608 19.4598 8.71822 19.8815C9.76036 20.3033 10.8758 20.5142 12 20.502C14.232 20.4678 16.361 19.5571 17.9274 17.9665C19.4937 16.376 20.3716 14.2333 20.3716 12.001C20.3716 9.76872 19.4937 7.62598 17.9274 6.03546C16.361 4.44494 14.232 3.53424 12 3.5V3.499ZM8.462 14.784C8.88275 15.32 9.41996 15.7532 10.0329 16.0509C10.6459 16.3486 11.3186 16.5028 12 16.502C12.6806 16.5028 13.3524 16.3489 13.9648 16.0519C14.5772 15.755 15.1141 15.3228 15.535 14.788C15.6583 14.6319 15.8386 14.5312 16.0362 14.5081C16.2337 14.4849 16.4324 14.5412 16.5885 14.6645C16.7446 14.7878 16.8453 14.9681 16.8684 15.1657C16.8916 15.3632 16.8353 15.5619 16.712 15.718C16.1507 16.4306 15.435 17.0064 14.6187 17.4021C13.8025 17.7977 12.9071 18.0028 12 18.002C11.0918 18.0027 10.1952 17.797 9.37821 17.4002C8.5612 17.0035 7.84508 16.4262 7.284 15.712C7.1662 15.5554 7.11439 15.3588 7.13968 15.1645C7.16497 14.9701 7.26533 14.7934 7.41929 14.6721C7.57326 14.5508 7.76858 14.4946 7.96346 14.5155C8.15834 14.5364 8.33729 14.6328 8.462 14.784ZM9 8.75C9.16706 8.74527 9.33337 8.7741 9.4891 8.83476C9.64483 8.89543 9.78681 8.98671 9.90665 9.10321C10.0265 9.2197 10.1217 9.35904 10.1868 9.51299C10.2518 9.66694 10.2854 9.83237 10.2854 9.9995C10.2854 10.1666 10.2518 10.3321 10.1868 10.486C10.1217 10.64 10.0265 10.7793 9.90665 10.8958C9.78681 11.0123 9.64483 11.1036 9.4891 11.1642C9.33337 11.2249 9.16706 11.2537 9 11.249C8.67473 11.2398 8.36587 11.1041 8.13906 10.8708C7.91224 10.6375 7.78535 10.3249 7.78535 9.9995C7.78535 9.6741 7.91224 9.36153 8.13906 9.12821C8.36587 8.89488 8.67473 8.7592 9 8.75ZM15 8.75C15.1671 8.74527 15.3334 8.7741 15.4891 8.83476C15.6448 8.89543 15.7868 8.98671 15.9066 9.10321C16.0265 9.2197 16.1217 9.35904 16.1868 9.51299C16.2518 9.66694 16.2854 9.83237 16.2854 9.9995C16.2854 10.1666 16.2518 10.3321 16.1868 10.486C16.1217 10.64 16.0265 10.7793 15.9066 10.8958C15.7868 11.0123 15.6448 11.1036 15.4891 11.1642C15.3334 11.2249 15.1671 11.2537 15 11.249C14.6747 11.2398 14.3659 11.1041 14.1391 10.8708C13.9122 10.6375 13.7854 10.3249 13.7854 9.9995C13.7854 9.6741 13.9122 9.36153 14.1391 9.12821C14.3659 8.89488 14.6747 8.7592 15 8.75Z" fill="#707991"/>
                </svg>

                </div>
                <form  id="yourFormId" method='post' onSubmit={(e)=>handleSendMsg(e)}>

                <button type="submit"  className="py-2 px-4 text-white rounded-r focus:outline-none" >
                <Image  src={sendicon} />
                  
                </button>
                </form>
            </div>
            {showEmojiPicker && (
                <div className="block absolute top-[-453px] left-[2%]">
                <EmojiPicker onEmojiClick={addEmoji}  />
                   
                </div>
            )}
        </div>
        </div>
        </div>
      </div>

     
    </div>
  );
};

export default Charts;
