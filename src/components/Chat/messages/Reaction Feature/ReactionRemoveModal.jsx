import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessageReaction, removeReaction } from "../../../../features/chatSlice";
import SocketContext from "../../../../context/SocketContext";

function ReactionRemoveModal({
  reactions,
  messageId,
  currentUserId,
  setSelectedEmoji,
  onClose,
  message,
  socket
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);
  const { token } = user;
  const  allreactions = messages[message._id];

  const handleRemoveReaction = async(reactionUserId) => {
    
    if (reactionUserId === currentUserId) {
      const values = {
        token,
        message_id: messageId,
      };
      let res = await dispatch(removeMessageReaction(values));  //backend call
      dispatch(removeReaction({
        messageId:messageId,
        userId:currentUserId
      }))                                     // chat slice call
      setSelectedEmoji(null);
      
      const updatedResponse = {
        ...res.payload,
        reactionRemovedBy:currentUserId ,// Add reactionSender here
        messageId:messageId
      };
      console.log(updatedResponse);

      socket.emit('remove reaction' , updatedResponse );
      console.log('removeede call')
      onClose(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark_bg_2 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">Reactions</h2>
        <ul className="space-y-3">
          {reactions.map((reaction, index) => (
            <li key={index} className="flex   items-center">
              <span className="font-medium text-gray-800 dark:text-white">
                {reaction.user.name}
              </span>
              {/* my reaction */}
              {reaction.user === currentUserId && (
                <div className="flex gap-x-1">
                  <p>{reaction?.reaction} </p>
                  <p className=" mr-1 italic text-xs text-slate-300">
                    (Your reaction)
                  </p>
                  <button
                    onClick={() => handleRemoveReaction(reaction.user)}
                    className="text-red-500 ml-24 hover:text-red-700 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
              {/* other reactions */}
              {reaction.user !== currentUserId && (
                <div className="flex gap-x-1">
                  <p>{reaction?.reaction} </p>
                  <p className=" mr-1 italic text-xs text-slate-300">
                    (Others reaction)
                  </p>
                  
                </div>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 dark:bg-dark_bg_3 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-dark_bg_4 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
}

const ReactionRemoveModalWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ReactionRemoveModal {...props} socket={socket} />}
  </SocketContext.Consumer>
);


export default ReactionRemoveModalWithSocket;
