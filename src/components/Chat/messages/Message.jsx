import moment from "moment";
import TraingleIcon from "../../../svg/triangle";
import { useEffect, useState } from "react";

import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessageReaction, addReaction, scheduleMessage, translateMessage } from "../../../features/chatSlice";
import ReactionRemoveModal from "./Reaction Feature/ReactionRemoveModal";
import SocketContext from "../../../context/SocketContext";
import MessageModal from "./Messages Modal/MessageModal";

function Message({ message, me ,socket}) {
  const [showReactionRemoveModal , setShowReactionRemoveModal] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token, _id: currentUserId } = user;
  const reactionsOnMessage = message?.reactions?.[0]?.reaction;
  const reactionUserId = message?.reactions?.[0]?.user;
  const {activeConversation}  =useSelector((state) => state.chat);
  const [translatedMessage , setTranslatedMessage] = useState("");
  // message modal
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (reactionsOnMessage) {
      setSelectedEmoji(reactionsOnMessage);
    }
    else{
      setSelectedEmoji(null);
    }
  }, [reactionsOnMessage]);

  const handleMouseEnter = () => {
    setShowMessageModal(true);
  };

  const handleReactionRemoveModal = () => {
    setShowMessageModal(false);
    setShowReactionRemoveModal(true);
  };


  const handleMessageTranslate = async() => {
    const values = {
      token,
      message_id: message._id,
    };
    let res = await dispatch(translateMessage(values))

    setTranslatedMessage(res.payload.translation);
    setShowMessageModal(false);
    
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
    setShowMessageModal(false);
  };
  

  return (
    <div
  className={`w-full flex mt-2 space-x-3 max-w-xs ${
    me ? "ml-auto justify-end flex-row" : "flex-row"
  }`}
>
  {/* Message Container */}
  <div
    className={`relative ${selectedEmoji ? "mb-4" : ""}`}
    onDoubleClick={handleMouseEnter}
  >
    {/* Sender User Message */}
    {!me && message.conversation.isGroup && (
      <div className="absolute top-0.5 left-[-37px]">
        <img
          src={message.sender.picture}
          alt=""
          className="w-8 h-8 rounded-full"
        />
      </div>
    )}

    {/* Reaction Feature */}
    {selectedEmoji && (
      <div
        className={` ${me ? ' bg-slate-500':' bg-purple-700'} absolute bottom-[-8px] left-2  rounded-full z-10 flex items-center space-x-1 p-1`}
        onClick={() => setShowReactionRemoveModal(true)}
      >
        <p className="text-sm md:text-base">{selectedEmoji}</p>
      </div>
    )}

    <div
      className={`relative h-full dark:text-slate-200 p-2 rounded-lg ${
        me ? "bg-slate-500" : "dark:bg-purple-700"
      }`}
    >
      {/* Message */}
      <p className="text-sm pb-4 pr-8">
        {message.message}
        {translatedMessage && (
          <p className="mt-2 text-slate-800 font-bold text-xs md:text-sm">
            Translated Message - {translatedMessage}
          </p>
        )}
      </p>

      {/* Message Date */}
      <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_5 leading-none">
        {moment(message.createdAt).format("HH:mm")}
      </span>

      {/* Triangle */}
      {!me && (
        <span>
          <TraingleIcon className="dark:fill-purple-700 rotate-[60deg] absolute top-[-5px] -left-1.5" />
        </span>
      )}
    </div>
  </div>

  {showReactionRemoveModal && (
    <ReactionRemoveModal
      message={message}
      reactions={message?.reactions}
      messageId={message._id}
      currentUserId={currentUserId}
      setSelectedEmoji={setSelectedEmoji}
      onClose={() => setShowReactionRemoveModal(false)}
    />
  )}
  {showMessageModal && (
    <MessageModal 
      me={me}
      handleMessageTranslate={handleMessageTranslate}
      handleReactionRemoveModal={handleReactionRemoveModal}
      handleReaction={handleReaction}
      onClose={() => setShowMessageModal(false)}
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
