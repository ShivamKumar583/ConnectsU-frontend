import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { scheduleMessage, sendMessage } from "../../../features/chatSlice";
import { SendIcon } from "../../../svg";
import { Attachments } from "./attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import SocketContext from "../../../context/SocketContext";
import ScheduleMessageModal from "../messages/Scheduled Message Modal/ScheduleMessageModal";
function ChatActions({ socket }) {
  const dispatch = useDispatch();
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const { activeConversation, status } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const [message, setMessage] = useState("");
  const textRef = useRef();
  const values = {
    message,
    convo_id: activeConversation._id,
    files: [],
    token,
  }

  // schedule message
  const [showScheduleMessageModal , setShowScheduleMessageModal ] = useState(false);
  const [scheduleDate , setScheduleDate] = useState(new Date()) 
  const handleScheduleMessageModal = () => {
    setShowAttachments(false);
    setShowScheduleMessageModal(true);
  };

  const handleDateChange = (date) => {
    setScheduleDate(date);
  };

  const handleScheduleMessage = async(e) => {
    e.preventDefault();
    console.log(message);
    console.log(activeConversation)
    const values ={
      token,
      sender:user._id ,
      message:message,
      conversation:activeConversation._id,
      scheduledAt:scheduleDate
    }

    let res = await dispatch(scheduleMessage(values));

    setShowScheduleMessageModal(false);
    setMessage("");
  }

  useEffect(() => {
    socket.on("schedule message", async(data) => {
      const values = {
        message:data.message,
        convo_id: data.conversation,
        files: [],
        token,
      } 

      let newMsg = await dispatch(sendMessage(values));
      socket.emit("send message", newMsg.payload);

    })
  },[])

  const SendMessageHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newMsg = await dispatch(sendMessage(values));
    
    
    socket.emit("send message", newMsg.payload);
    setMessage(""); 
    setLoading(false);
  };

  return (
    <>
          <form
      onSubmit={(e) => SendMessageHandler(e)}
      className="dark:bg-slate-400 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      {/*Container*/}
      <div className="w-full flex items-center gap-x-2">
        {/*Emojis and attachpments*/}
        <ul className="flex gap-x-2">
          <EmojiPickerApp
            textRef={textRef}
            message={message}
            setMessage={setMessage}
            showPicker={showPicker}
            setShowPicker={setShowPicker}
            setShowAttachments={setShowAttachments}
          />
          <Attachments
            showAttachments={showAttachments}
            setShowAttachments={setShowAttachments}
            setShowPicker={setShowPicker}
            handleScheduleMessageModal={handleScheduleMessageModal}
          />
        </ul>
        {/*Input*/}
        <Input message={message} setMessage={setMessage} textRef={textRef} />
        {/*Send button*/}
        <button type="submit" className="btn">
          {status === "loading" && loading ? (
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            <SendIcon className="dark:fill-purple-600" />
          )}
        </button>
      </div>
    </form>

    {
      showScheduleMessageModal && (
        <ScheduleMessageModal
          onClose={() => setShowScheduleMessageModal(false)} 
          scheduleDate={scheduleDate}
          handleDateChange={handleDateChange}
          handleScheduleMessage={handleScheduleMessage}
        />
      )
    }
    </>

  );
}

const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatActionsWithSocket;
