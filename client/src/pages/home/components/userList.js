import { useSelector } from "react-redux";

function UsersList({searchKey}){
    const {allUsers, allChats} = useSelector(state =>state.userReducer);
    return(
        
        allUsers
        .filter(user => {
                    return ((user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
                    user.lastname.toLowerCase().includes(searchKey.toLowerCase())) && searchKey
                ) || (allChats.some(chat => chat.members.includes(user._id)))

                
                })
        .map(user => {
            return <div className="user-search-filter"  
                // onClick={() => openChat(user._id)} key={user._id}
                >
                    <div className=
                    // {IsSelectedChat(user) ? "selected-user": 
                    "filtered-user"
                // }
                >
                        <div className="filter-user-display">
                            {user.profilePic && <img src={user.profilePic} 
                                                    alt="Profile Pic" 
                                                    className="user-profile-image" 
                                                    // style={onlineUser.includes(user._id) ? {border: '#82e0aa 3px solid'} : {}} 
                                                />}

                            <div 
                                                    className="user-default-avatar"
                                                    // style={onlineUser.includes(user._id) ? {border: '#82e0aa 3px solid'} : {}}
                                                >
                            <div class="user-default-profile-pic">
                                 {
                                    user.firstname.charAt(0).toUpperCase() + 
                                    user.lastname.charAt(0).toUpperCase()
                                }
                            </div>
                            </div>
                            <div className="filter-user-details">
                                <div className="user-display-name">{user.firstname +  '' +user.lastname}</div>
                                <div className="user-display-email">{user.email }</div>
                            </div>
                            {/* <div>
                                { getUnreadMessageCount(user._id) }
                                <div className="last-message-timestamp">{ getLastMessageTimeStamp(user._id)}</div>
                            </div> */}
                            { !allChats.find(chat => chat.members.includes(user._id)) &&
                                <div className="user-start-chat">
                                    <button className="user-start-chat-btn" 
                                    // onClick={() => startNewChat(user._id)}
                                    >
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