import moment from "moment";
import TraingleIcon from "../../../svg/triangle";
import { useEffect, useState } from "react";

import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageReaction, addReaction } from "../../../features/chatSlice";
import ReactionRemoveModal from "./Reaction Feature/ReactionRemoveModal";
import SocketContext from "../../../context/SocketContext";


function Message({ message, me ,socket}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showReactionRemoveModal , setShowReactionRemoveModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token, _id: currentUserId } = user;
  const reactionsOnMessage = message?.reactions?.[0]?.reaction;
  const reactionUserId = message?.reactions?.[0]?.user;
  const {activeConversation}  =useSelector((state) => state.chat);


  useEffect(() => {
    if (reactionsOnMessage) {
      setSelectedEmoji(reactionsOnMessage);
    }
    else{
      setSelectedEmoji(null);
    }
  }, [reactionsOnMessage]);

  const handleMouseEnter = () => {
    setShowEmoji(true);
  };

  const handleMouseLeave = () => {
    setShowEmoji(false);
  }
  
  
  const handleReaction = async (emojiObject) => {
    setSelectedEmoji(emojiObject.emoji);
    const values = {
      token,
      message_id: message._id,
      reaction: emojiObject.emoji
    };
      let response = await dispatch(addMessageReaction(values));

      const value2 = {
        messageId : message._id ,
         userId:user._id,
          reaction:emojiObject.emoji
      }
      dispatch(addReaction(value2));
  
    const updatedResponse = {
      ...response.payload,
      reactionSender: { _id: user._id } // Add reactionSender here
    };
  
    socket.emit('send reaction', updatedResponse);
  
  };
  

  return (
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs  ${
        me ? "ml-auto justify-end flex-row" : " flex-row"
      }`}
    >
      
      {me && showEmoji && (
        <div 
          className="h-9"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
         <EmojiPicker reactionsDefaultOpen={true} onReactionClick={handleReaction} />
          
        </div>
      )}

      {/*Message Container*/}
      <div
        className={`relative ${selectedEmoji ? ' mb-2' : ''}  `}
        onDoubleClick={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* sender user message */}
        {!me && message.conversation.isGroup && (
          <div className="absolute top-0.5 left-[-37px]">
            <img
              src={message.sender.picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />
          </div>
        )}

        {/* reaction feature */}
        {me && selectedEmoji && (
          <div className={`absolute  top-8 -left-4 bg-slate-500 rounded-full z-10 flex items-center space-x-1`} onClick={() => setShowReactionRemoveModal(true)} >
            <p>{selectedEmoji}</p>
          </div>
        )}

        <div
          className={`relative h-full dark:text-slate-200 p-2 rounded-lg
        ${me ? "bg-slate-500" : "dark:bg-purple-700"}
        `}
        >
          {/*Message*/}
          <p className="float-left h-full text-sm pb-4 pr-8">
            {message.message}
          </p>
          {/*Message Date*/}
          <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>
          {/*Traingle*/}
          {!me ? (
            <span>
              <TraingleIcon className="dark:fill-purple-700 rotate-[60deg] absolute top-[-5px] -left-1.5" />
            </span>
          ) : null}
        </div>

        {!me && selectedEmoji && (
          <div className={`absolute  top-8 right-[-8%] bg-purple-600 rounded-full z-10 flex items-center space-x-1`} onClick={() => setShowReactionRemoveModal(true)} >
            <p>{selectedEmoji}</p>
          </div>
        )}
      </div>
      {!me && showEmoji && (
        <div 
          className=" text-white h-9"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
         <EmojiPicker size={10} height={200} width={300} reactionsDefaultOpen={true} onReactionClick={handleReaction} />

          
        </div>
      )}
      {showReactionRemoveModal && (
        <ReactionRemoveModal
        message = {message}
          reactions={message?.reactions}
          messageId={message._id}
          currentUserId={currentUserId}
          setSelectedEmoji = {setSelectedEmoji}
          onClose={() => setShowReactionRemoveModal(false)}
        />
      )}
    </div>
  );
}

const MessageWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Message {...props} socket={socket} />}
  </SocketContext.Consumer>
);


export default MessageWithSocket;
