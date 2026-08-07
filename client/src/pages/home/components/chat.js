import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {showLoader , hideLoader} from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import toast from "react-hot-toast";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import moment from "moment";




function ChatArea(){
    const dispatch = useDispatch();
    const {selectedChat, user, allChats} = useSelector(state => state.userReducer);
    const selectedUser = selectedChat?.members?.find(u => u._id !== user._id); 
    const [message , setMessage] =useState('');
    const [allMessages , setAllMessages] = useState([]);


    const sendMessage = async () => {
        try{
            const newMessage = {
                chatId: selectedChat._id,
                sender: user._id,
                text: message,
                // image: image
            }
            dispatch(showLoader())
            const response = await createNewMessage(newMessage);
            dispatch(hideLoader())                                                              
            if(response.success){
                dispatch(hideLoader())   
                setMessage('');
            //     // setShowEmojiPicker(false);
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
            dispatch(showLoader());
            const response = await clearUnreadMessageCount(selectedChat._id);
            dispatch(hideLoader())

            if(response.success){
                allChats.map(chat => {
                    if(chat._id === selectedChat._id){
                        return response.data;
                    }
                    return chat;
                })
            }
        }catch(error){
            dispatch(hideLoader())
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

    useEffect(() => {
        if (selectedChat) {
            getMessages();
            if(selectedChat?.lastMessage?.sender !== user._id){
                clearUnreadMessages();
            }
        
        }
    }, [selectedChat]);


    return <>
            {selectedChat && <div className="app-chat-area">
                    <div className="app-chat-area-header">
                        {formatName(selectedUser)}
                    </div>
                    <div className="main-chat-area">
                      {allMessages.map(msg =>{
                        const isCurrentUserSender = msg.sender === user._id;
                         return <div className="message-container" style ={isCurrentUserSender ? {justifyContent: 'end'} :{justifyContent: 'start'}} >
                           <div>
                                <div className={isCurrentUserSender ? "send-message" : "received-message"}>{ msg.text }</div>
                                <div className="message-timestamp" style={isCurrentUserSender ? {float: 'right'} : {float: 'left'}} >
                                { formatTime(msg.createdAt) } {isCurrentUserSender && msg.read && 
                                <i className="fa fa-check-circle" aria-hidden="true" style={{color: '#e74c3c'}}></i>}
                                </div>
                            </div>
                         </div>
                      })}  
                       
                    </div>
                    <div className="send-message-div">
                        <input type="text" 
                            className="send-message-input" 
                            placeholder="Type a message"
                            value={message}
                            onChange={ (e) => { 
                                setMessage(e.target.value)
                                // socket.emit('user-typing', {
                                //     chatId: selectedChat._id,
                                //     members: selectedChat.members.map(m => m._id),
                                //     sender: user._id
                                // })
                            } 
                            }
                        />
                        
                        {/* <label for="file">
                            <i className="fa fa-picture-o send-image-btn"></i>
                            <input
                                // type="file"
                                // id="file"
                                // style={{display: 'none'}}
                                // accept="image/jpg,image/png,image/jpeg,image/gif"
                                // onChange={sendImage}
                            >
                            </input>
                        </label> */}
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

