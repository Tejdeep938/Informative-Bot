import { Avatar, Box, Button, IconButton, Typography,} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import  red  from '@mui/material/colors/red';
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from 'react-icons/io';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { deleteUserChats, getUserChats, sendChatRequest, } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

/*const chatMessages = [
  { role: "user", content: "Hi there! Can you help me with something?" },
  { role: "assistant", content: "Of course! What do you need assistance with?" },
  { role: "user", content: "I'm having trouble with my computer. It keeps crashing." },
  { role: "assistant", content: "Hmm, that sounds frustrating. Have you tried restarting your computer?" },
  { role: "user", content: "Yes, I've tried that multiple times, but it doesn't seem to fix the issue." },
  { role: "assistant", content: "Okay, let's try some troubleshooting steps. Have you checked for any recent software updates?" },
  { role: "user", content: "No, I haven't. How do I do that?" },
  { role: "assistant", content: "You can check for updates in the settings menu. I can guide you through it if you'd like." },
  { role: "user", content: "Yes, please do." },
  { role: "assistant", content: "First, click on the Start menu, then select Settings. From there, go to Update & Security." },
  { role: "assistant", content: "In the Update & Security window, click on Check for updates to see if there are any available updates for your computer." },
  { role: "user", content: "Got it. Let me check." },
  { role: "assistant", content: "Take your time. I'll be here if you have any questions or need further assistance." }
];*/

// Example usage:


type Message = {
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
    //
  };

  const handleDeleteChats = async () => {
    try{
      toast.loading("Deleting Chats",{ id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" })

    }
    catch(error){
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };
  useLayoutEffect(() => {
    if(auth?.isLoggedIn && auth.user){
      toast.loading("Loading Chats", { id:"loadchats"});
      getUserChats().then((data) =>{
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats", { id: "loadchats" });
      }).catch((err) => {
        console.log(err);
        toast.error("Loading Failed",{id: "loadchats" })
      }
      );
    }
  }, [auth]);
  useEffect(() => {
     if(!auth?.user){
      return navigate("/login");
     }
  },[auth]);
  return <Box sx={{display:'flex',flex:1,width:"100%",height:"100%",mt:3,gap:3,}}>
    <Box sx={{display: { md:"flex",xs:"none",sm:"none"},flex:0.2,flexDirection: "column",}}>
      <Box sx={{display:"flex",width:"100%",height:"60vh",bgcolor:"rgb(17,29,39)",borderRadius:5,flexDirection: "column",mx: 3,
      }}>
        <Avatar sx={{mx: "auto",my:2,bgcolor:"white",color:"black",fontWeight:700,}}>{auth?.user?.name[0]} {auth?.user?.name.split(" ")[1][0]}</Avatar>
        <Typography sx={{mx:'auto',fontFamily:"work sans",}}>You are talking to a Informative Bot</Typography>
        <Typography sx={{mx:'auto',fontFamily:"work sans",my:4,p:3}}>You can ask some questions related to Knowledge,Business,Advices,Education,etc.But avoid sharing personal information</Typography>
        <Button onClick={handleDeleteChats} sx={{width:"200px",my:'auto',color:'white',fontWeight:"700",borderRadius:3,mx:"auto", bgcolor:red[300],":hover":{
          bgcolor:red.A400,
        },}}> Clear Conversation</Button>
      </Box>
    </Box>
    <Box sx={{display:"flex",flex:{md:0.8,xs:1,sm:1},flexDirection:'column',px:3}}>
      <Typography sx={{fontSize:"40px",color:"white",mb:2,mx:"auto",fontWeight:"600"}}>THE INFORMATIVE BOT</Typography>
      <Box sx={{width:"100%",height:"60vh",borderRadius:3,mx:'auto',display:'flex',flexDirection:"column",overflow:'scroll',overflowX:"hidden",overflowY:'auto',scrollBehavior:"smooth",}}>
        {chatMessages.map((chat, index)=>(
          //@ts-ignore
          <ChatItem content={chat.content} role={chat.role} key={index} />
        ))}
      </Box>
      <div style={{width:"100%",padding:"20px",borderRadius:8,backgroundColor:"rgb(17,27,39)",display:"flex",margin:"auto"}}> {" "}
      <input  ref={inputRef} type='text' style={{width:"100%",backgroundColor:"transparent",padding:'10px',border:"none",outline:"none",color:"white",fontSize:"20px",}}/>
      <IconButton onClick={handleSubmit} sx={{ml:'auto',color:"white",mx:1}}><IoMdSend /></IconButton>
      </div>
    </Box>
  </Box>
}

export default Chat;