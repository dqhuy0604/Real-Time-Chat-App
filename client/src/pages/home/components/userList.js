import toast from "react-hot-toast";
import { useDispatch, useSelector   } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import {showLoader , hideLoader} from "../../../redux/loaderSlice";
import { setAllChats ,setSelectedChat } from "../../../redux/usersSlice";

function UsersList({searchKey}){
    const {allUsers, allChats , user: currentUser , selectedChat } = useSelector(state =>state.userReducer);
    const dispatch = useDispatch();

    const startNewChat = async (searchedUserId) => {
        let response = null;
        try{
            dispatch(showLoader());
            response =await createNewChat([currentUser._id, searchedUserId]);
            dispatch(hideLoader());

            if(response.success){
                toast.success(response.message);
                const newChat = response.data;
                const updatedChat = [...allChats, newChat]
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedChat(newChat));
            }
        }catch(error){
            toast.error(response.message);
            dispatch(hideLoader());
        }
    }
    const openChat = (selectedUserId) => {
        const chat = allChats.find(chat => 
            chat.members.map(m => m._id).includes(currentUser._id) && 
            chat.members.map(m => m._id).includes(selectedUserId)
        )

        if(chat){
            dispatch(setSelectedChat(chat));
        }
    }
    
    const IsSelectedChat = (user) => {
        if(selectedChat){
            return selectedChat.members.map(m => m._id).includes(user._id);
        }
        return false;
    }


    return(
        
        allUsers
        .filter(user => {
                    console.log("allChats:", allChats);
                    console.log("allUsers:", allUsers);     
                    return ((user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
                    user.lastname.toLowerCase().includes(searchKey.toLowerCase())) && searchKey
                ) || (allChats.some(chat => chat.members.map(m => m._id).includes(user._id)))})
        .map(user => {
            return <div className="user-search-filter" onClick={() => openChat(user._id)} key={user._id}>
                <div className={IsSelectedChat(user) ? "selected-user": "filtered-user"}>
                    <div className="filter-user-display">
                        {user.profilePic && <img src={user.profilePic} 
                                                alt="Profile Pic" 
                                                className="user-profile-image" 
                                                // style={onlineUser.includes(user._id) ? {border: '#82e0aa 3px solid'} : {}} 
                                            />}

                        {!user.profilePic &&<div 
                                                className={IsSelectedChat(user)? "user-selected-avatar" : "user-default-avatar"}
                                                // style={onlineUser.includes(user._id) ? {border: '#82e0aa 3px solid'} : {}}
                                            >
                            {
                                user.firstname.charAt(0).toUpperCase() + 
                                user.lastname.charAt(0).toUpperCase()
                            }
                        </div>}
                        <div className="filter-user-details">
                            <div className="user-display-name">{user.firstname + '' + user.lastname}</div>
                            <div className="user-display-email">{ user.email }</div>
                        </div>
                        <div>
                            {/* { getUnreadMessageCount(user._id) } */}
                            {/* <div className="last-message-timestamp">{ (user._id)}</div> */}
                        </div>
                        { !allChats.find(chat => chat.members.map(m => m._id).includes(user._id)) &&
                            <div className="user-start-chat">
                                <button className="user-start-chat-btn" onClick={() => startNewChat(user._id)}>
                                    Start Chat
                                </button>
                            </div>
                        }
                        </div>
                    </div>   
                </div>                        
            })
)}
export default UsersList;