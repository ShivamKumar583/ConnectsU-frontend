import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages } from "../../features/chatSlice";
import { checkOnlineStatus, getConversationId } from "../../utils/chat";
import { ChatActions } from "./actions";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import FilesPreview from "./preview/files/FilesPreview";
import SocketContext from "../../context/SocketContext";

function ChatContainer({ onlineUsers, typing, callUser ,socket,setShowSidebar,showSidebar}) {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const values = {
    token,
    convo_id: activeConversation?._id,
  };
  useEffect(() => { 
    if (activeConversation?._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);


  useEffect(() => {

      socket.emit('mark messages as seen' , 
        {
          conversationId :activeConversation._id,
          userId:user._id
        }
      )
    

  },[])


  return (
    <div className="relative w-full h-full border-l dark:border-l-slate-500 select-none overflow-hidden  ">
      {/*Container*/}
      <div>
        {/*Chat header*/}
        <ChatHeader
        setShowSidebar={setShowSidebar}
          online={
            activeConversation.isGroup
              ? false
              : checkOnlineStatus(onlineUsers, user, activeConversation.users)
          }
          callUser={callUser}
        />
        {files.length > 0 ? (
          <FilesPreview />
        ) : (
          <>
            {/*Chat messages*/}
            <ChatMessages typing={typing} showSidebar={showSidebar} />
            {/* Chat Actions */}
            <ChatActions />
          </>
        )}
      </div>
    </div>
  );
}

const ChatContainerWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatContainer {...props} socket={socket} />}
  </SocketContext.Consumer>
);


export default ChatContainerWithSocket;