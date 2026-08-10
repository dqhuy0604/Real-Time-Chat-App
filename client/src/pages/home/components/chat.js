import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {showLoader , hideLoader} from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import toast from "react-hot-toast";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import moment from "moment";
import store from './../../../redux/store';
import { setAllChats } from "../../../redux/usersSlice";
import EmojiPicker from "emoji-picker-react";



function ChatArea({socket}){
    const dispatch = useDispatch();
    const {selectedChat, user, allChats} = useSelector(state => state.userReducer);
    const selectedUser = selectedChat?.members?.find(u => u._id !== user._id); 
    const [message , setMessage] =useState('');
    const [allMessages , setAllMessages] = useState([]);
    const [isTyping , setIstyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);


    const sendMessage = async (image) => {
        try{
            const newMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
                image: image
            }

            socket.emit('send-message', {
                ...newMessage,
                members: selectedChat.members.map(m => m._id),
                read: false,
                createdAt: moment().format("YYYY-MM-DD HH:mm:ss")
            })

            const response = await createNewMessage(newMessage);                                                           
            if(response.success){
                setMessage('');
                setShowEmojiPicker(false);
            }
        }catch(error){
            toast.error(error.message);
        }
    }
    const getMessages = async () => {
        try{
            dispatch(showLoader())
            const response = await getAllMessages(selectedChat._id);
            dispatch(hideLoader())

            if(response.success){
                setAllMessages(response.data);
            }
        }catch(error){
            dispatch(hideLoader());
            toast.error(error.message);
        }
    }

    const clearUnreadMessages = async () => {
        try{
            socket.emit('clear-unread-messages' ,{
                chatId : selectedChat._id,
                members : selectedChat.members.map(m => m._id)
            })


            const response = await clearUnreadMessageCount(selectedChat._id);

            if(response.success){
                allChats.map(chat => {
                    if(chat._id === selectedChat._id){
                        return response.data;
                    }
                    return chat;
                })
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    const formatTime = (timestamp) => {
        const time = moment(timestamp);

        if (time.isSame(moment(), "day")) {
            return `Today ${time.format("hh:mm A")}`;
        }

        if (time.isSame(moment().subtract(1, "day"), "day")) {
            return `Yesterday ${time.format("hh:mm A")}`;
        }

        return time.format("MMM D, hh:mm A");
    };

    function formatName(user){
        let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
        let lname = user.lastname?.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
        return fname + ' ' + lname;
    }
    const sendImage = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader(file);
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
            sendMessage(reader.result);
        }
    }

    useEffect(() => {
        getMessages();
        if(selectedChat?.lastMessage?.sender !== user._id){
                clearUnreadMessages();
            }

        socket.on('receive-message',(message) => {
            const selectedChat = store.getState().userReducer.selectedChat;
            if(selectedChat._id === message.chatId){
                setAllMessages(prevmsg => [...prevmsg ,message])
            }
            if(selectedChat._id === message.chatId && message.sender !== user._id ){
                clearUnreadMessages();
            }
        })

        socket.on('message-count-cleared', data => {
            const selectedChat = store.getState().userReducer.selectedChat;
            const allChats = store.getState().userReducer.allChats;

            if(selectedChat._id === data.chatId){
                //UPDATING UNREAD MESSAGE COUNT IN CHAT OBJECT
                const updatedChats = allChats.map(chat => {
                    if(chat._id === data.chatId){
                        return { ...chat, unreadMessageCount: 0}
                    }
                    return chat;
                })
                dispatch(setAllChats(updatedChats));
                //UPDATING READ PROPRTY IN MESSAGE OBJECT

                setAllMessages(prevMsgs => {
                    return prevMsgs.map(msg => {
                        return {...msg, read: true}
                    })
                })
            }      
        })

        socket.on('started-typing', (data) => {
            if(selectedChat._id === data.chatId && data.sender !== user._id){
                setIstyping(true);
                setTimeout(() =>{
                    setIstyping(false);
                }, 2000);
            }
        })
    }, [selectedChat]);

    useEffect(() => {
        const msgContainer = document.getElementById('main-chat-area')
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, [allMessages , isTyping])

    return <>
            {selectedChat && <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {formatName(selectedUser)}
                    </div>
                    <div className="main-chat-area" id="main-chat-area">
                      {allMessages.map(msg =>{
                        const isCurrentUserSender = msg.sender === user._id;
                         return <div className="message-container" style ={isCurrentUserSender ? {justifyContent: 'end'} :{justifyContent: 'start'}} >
                           <div>
                                <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                                    <div>  { msg.text } </div>
                                    <div>  { msg.image && <img src = {msg.image} alt="image" height="120"></img>} </div>
                                </div>
                                <div className="message-timestamp" style={isCurrentUserSender ? {float: 'right'} : {float: 'left'}} >
                                { formatTime(msg.createdAt) } {isCurrentUserSender && msg.read && 
                                <i className="fa fa-check-circle" aria-hidden="true" style={{color: '#e74c3c'}}></i>}
                                </div>
                            </div>
                         </div>
                      })}  
                      <div className="typing-indicator">
                        {isTyping && <i>typing...</i>}
                      </div>
                       
                    </div>
                      {showEmojiPicker  && <div>
                        <EmojiPicker onEmojiClick={(e) => setMessage(message +e.emoji)} ></EmojiPicker></div>}

                    <div className="send-message-div">
                        <input type="text" 
                            className="send-message-input" 
                            placeholder="Type a message"
                            value={message}
                            onChange={ (e) => { 
                                setMessage(e.target.value)
                                socket.emit('user-typing', {
                                    chatId: selectedChat._id,
                                    members: selectedChat.members.map(m => m._id),
                                    sender: user._id
                                })
                            } 
                            }
                        />
                        <label for="file">
                            <i className="fa fa-picture-o send-image-btn"></i>
                            <input
                                type="file"
                                id="file"
                                style={{display: 'none'}}
                                accept="image/jpg,image/png,image/jpeg,image/gif"
                                onChange={sendImage}
                            >
                            </input>
                        </label>
                        <button 
                            className="fa fa-smile-o send-emoji-btn" 
                            aria-hidden="true"
                            onClick={ () => { setShowEmojiPicker(!showEmojiPicker)} }>
                        </button>
                        <button 
                            className="fa fa-paper-plane send-message-btn" 
                            aria-hidden="true"
                            onClick={ () => sendMessage('') }>
                        </button>
                    
                    </div>
                    
                    <div>

                    </div>
            </div>}
            </>
}

export default ChatArea;

