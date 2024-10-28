import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Message from "./Message";
import Typing from "./Typing";
import FileMessage from "./files/FileMessage";
import SocketContext from "../../../context/SocketContext";

function ChatMessages({ typing ,socket,showSidebar}) {
  const { messages, activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const endRef = useRef();
  useEffect(() => {
    if(!showSidebar){
      scrollToBottom();
      socket.emit('mark messages as seen' , 
        {
          conversationId :activeConversation._id,
          userId:user._id
        }
      )
    }
    
  }, [messages, typing,activeConversation?._id ,showSidebar]);
  

  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div
      
      className="mb-[60px] bgImage
    bg-cover bg-no-repeat
    "
    >
      {/*Container*/}
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[5%]">
        {/*Messages*/}
        {messages &&
          messages.map((message) => (
            <>
              {/*Message files */}
              {message.files.length > 0
                ? message.files.map((file) => (
                    <FileMessage
                      FileMessage={file}
                      message={message} 
                      key={message._id}
                      me={user._id === message.sender._id}
                    />
                  ))
                : null}
              {/*Message text*/}
              {message.message.length > 0 ? (
                <Message
                  message={message}
                  key={message._id}
                  me={user._id === message.sender._id}
                />
              ) : null}
            </>
          ))}
        {typing === activeConversation._id ? <Typing /> : null}
        <div className="mt-2" ref={endRef}></div>
      </div>
    </div>
  );
}

const ChatMessagesWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatMessages {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatMessagesWithSocket;
