import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import { ChatContainer, WhatsappHome } from "../components/Chat";
import { Sidebar } from "../components/sidebar";
import SocketContext from "../context/SocketContext";
import {
  addReaction,
  getConversations,
  markMessagesAsSeen,
  markSeenMessages,
  removeReaction,
  updateMessagesAndConversations,
  updateUnseenMessageCount,
} from "../features/chatSlice";
import Call from "../components/Chat/call/Call";
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat";

function Home({ socket }) {
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  const { activeConversation, unseenMessageCounts } = useSelector(
    (state) => state.chat
  );
  const [onlineUsers, setOnlineUsers] = useState([]);
  //call
  const [stream, setStream] = useState();
  const [show, setShow] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();


  // new way
  const [callSignal ,setCallSignal] = useState("");
  const [caller , setCaller] = useState("");
  const[receiveingCall , setReceiveingCall] = useState(false);
  const [callEnded , setCallEnded] = useState(true);
  const [callerName , setCallerName] = useState("");
  const [callerPicture , setCallerPicture] = useState("");
  const [yourId , setYourId] = useState("");

  //typing
  const [typing, setTyping] = useState(false);

  // sidebar
  const [showSidebar, setShowSidebar] = useState(true);
  useEffect(() => {
    if (activeConversation._id) {
      setShowSidebar(false);
    } else {
      setShowSidebar(true);
    }
  }, [activeConversation?._id]);

  //join user into the socket io
  useEffect(() => {
    socket.emit("join", user._id);
    //get online users
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  //call
  useEffect(() => {
    setupMedia();

    // new way
    socket.on("setup socket", (id) => {
      setYourId(id);
    });
    socket.on("call user", (data) => {

      setCaller(data.from); // caller ki id
      setCallSignal(data.signal);
      setCallerName(data.name);
      setCallerPicture(data.picture);
      setCallEnded(false);
      setReceiveingCall(true); 

    });

    socket.on("end call", () => {
      setReceiveingCall(false);
      setCallEnded(true);
      setCallSignal("");
      setCallerName("");
      setCallerPicture("");
      setCaller("");
      setShow(false);

      myVideo.current.srcObject = null;
      if (callAccepted) {
        connectionRef?.current?.destroy();
      }
      setCallAccepted(false);

    });
  }, []);

  //--call user funcion
  const callUser = () => {
    try {
      enableMedia();

      setCallerName( getConversationName(user, activeConversation.users))
      setCallerPicture( getConversationPicture(user, activeConversation.users))
      setCallEnded(false);
    
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (data) => {
        socket.emit("call user", {
          userToCall: getConversationId(user, activeConversation.users),
          signal: data,
          from: yourId,
          name: user.name,
          picture: user.picture,
        });

      });
      peer.on("stream", (stream) => {
        if(userVideo.current)
          userVideo.current.srcObject = stream;
      });
      socket.on("call accepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });

      peer.on('close' , () => {
        console.log('peer closed');
        socket.off('call accepted');
      })
      
      connectionRef.current = peer;
    } catch (err) {
      console.log(err);
    } 
  };
  //--answer call  funcion
  const answerCall = () => {
    try {
      enableMedia();
      setCallAccepted(true);
      const peer = new Peer({
        initiator: false, 
        trickle: false,
        stream: stream,
      });
      
      peer.on("signal", (data) => {
        socket.emit("answer call", { signal: data, to: caller });

      }); 
      peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;

      });
      
      peer.signal(callSignal);
      connectionRef.current = peer;
    } catch (err) {
      console.log(err);
    }
  };
  //--end call  funcion
  const endCall = () => {
    try {
      setReceiveingCall(false);
      setCallEnded(true);
      setCallSignal("");
      setCallerName("");
      setCallerPicture("");
      setCaller("");
      setShow(false);

      if(callAccepted) connectionRef.current.destroy();

      setCallAccepted(false)
      myVideo.current.srcObject = null;
      socket.emit("end call", yourId);
      
    } catch (err) {
      console.log("Error ending the call:", err);
    }
  };
  
  //--------------------------
  const setupMedia = () => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const enableMedia = () => {
    myVideo.current.srcObject = stream;
    setShow(true);
  };
  //get Conversations
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);
  useEffect(() => {
    //lsitening to receiving a message
    socket.on("receive message", (message) => {
      console.log('done');
      dispatch(updateMessagesAndConversations(message));
    });
  
    // seen feature
    socket.on("receive reaction", (message) => {
      const values = {
        messageId: message._id,
        userId: message.reactionSender._id,
        reaction: message.reactions[0].reaction,
      };
      dispatch(addReaction(values));
    });

    // seen feature
    socket.on('receive remove reaction' , (data) => {
      console.log(data);
      console.log('receive remove reaction')
      dispatch(removeReaction(data));
    })

    // seen feature
    socket.on("unseen message", (message) => {
      const { conversationId } = message;

      const unseenCount = unseenMessageCounts[conversationId] || 0;

      dispatch(
        updateUnseenMessageCount({
          conversationId,
          increment: unseenCount + 1,
        })
      );
    });

    // seen feature
    socket.on("messages seen", (data) => {
      const { conversationId, userId } = data;
      dispatch(markSeenMessages(conversationId));
      dispatch(markMessagesAsSeen({ token, conversationId }));
    });

    //listening when a user is typing
    socket.on("typing", (conversation) => setTyping(conversation));
    socket.on("stop typing", () => setTyping(false));
  }, []);
  

  return (
    <>
      <div className="h-screen dark:bg-slate-200 flex items-center justify-center overflow-hidden">
        {/*container*/}
        <div className=" w-full container h-screen flex py-[19px]">
          {/*Sidebar*/}
          <div
            className={`bg-slate-300 h-full select-none ${
              showSidebar ? "w-full lg:w-1/4" : "hidden lg:block"
            } `}
          >
            <Sidebar setShowSidebar={setShowSidebar} onlineUsers={onlineUsers} typing={typing} />
          </div>

          {activeConversation._id ? (
            <div
              className={`flex-grow h-full ${
                showSidebar ? "w-full hidden lg:block lg:w-3/4" : "w-full"
              }`}
            >
              <ChatContainer
                setShowSidebar={setShowSidebar}
                showSidebar={showSidebar}
                onlineUsers={onlineUsers}
                callUser={callUser}
                typing={typing}
              />
            </div>
          ) : (
            <div
              className={`flex-grow mt-[6px] h-full ${
                showSidebar ? "w-full hidden lg:block lg:w-3/4" : "w-full"
              }`}
            >
              <WhatsappHome />
            </div>
          )}
        </div>
      </div>
      {/*Call*/}

      <div className={(show || callSignal) && !callEnded ? "" : "hidden"}>
        <Call
         receiveingCall={receiveingCall}
         setReceiveingCall={setReceiveingCall}
          callEnded={callEnded}
          callerName={callerName}
          callerPicture={callerPicture}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          answerCall={answerCall}
          show={show}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default HomeWithSocket;
