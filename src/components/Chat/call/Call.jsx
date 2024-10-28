import { useEffect, useState } from "react";
import CallAcions from "./CallAcions";
import CallArea from "./CallArea";
import Header from "./Header";
import Ringing from "./Ringing";
import { ArrowIcon } from "../../../svg";

export default function Call({
  // call,
  // setCall,
  receiveingCall,
  callEnded,
  callerName,
  callerPicture,
  setReceiveingCall,
  callAccepted,
  myVideo,
  stream,
  userVideo,
  answerCall,
  show,
  endCall,
  totalSecInCall,
  setTotalSecInCall,
}) {
  // const { receiveingCall, callEnded, name, picture } = call;
  const [showActions, setShowActions] = useState(false);
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] z-10 rounded-2xl overflow-hidden callbg
        ${receiveingCall && !callAccepted ? "hidden" : ""}
          shadow-purple-700 shadow-lg`}
        onMouseOver={() => setShowActions(true)}
        onMouseOut={() => setShowActions(false)}
      >
        {/*Container*/}
        <div>
          <div>
            {/*Header*/}
            <Header />
            {/*Call area*/}
            <CallArea
              callerName={callerName}
              totalSecInCall={totalSecInCall}
              setTotalSecInCall={setTotalSecInCall}
              callAccepted={callAccepted}
            />
            {/*Call actions*/}
            {showActions ? <CallAcions setShowActions={setShowActions} endCall={endCall} /> : null}
          </div>
          {/*Video streams*/}
          <div>
            {/*user video*/}
            {callAccepted && !callEnded ? (
              <div>
                <video
                  ref={userVideo}
                  playsInline
                  autoPlay
                  className={toggle ? "SmallVideoCall" : "largeVideoCall"}
                  onClick={() => setToggle((prev) => !prev)}
                ></video>
              </div>
            ) : null}
            {/*my video*/}
            {stream ?  (
              <div>
                <video
                  ref={myVideo}
                  playsInline
                  muted
                  autoPlay
                  className={`${toggle ? "largeVideoCall" : "SmallVideoCall"} ${
                    showActions ? "moveVideoCall" : ""
                  }`}
                  onClick={() => setToggle((prev) => !prev)}
                ></video>
              </div>
            ) : null}
          </div>

          <button className="rotate-90 font-bold block lg:hidden  scale-y-[300%] absolute bottom-5 left-1/2" onClick={() => setShowActions(true)}>
            <ArrowIcon className="fill-purple-600" />
        </button>
        </div>
      </div>
      {/*Ringing*/}
      {receiveingCall && !callAccepted ? (
        <Ringing
        setReceiveingCall={setReceiveingCall}
          receiveingCall={receiveingCall}
          callEnded={callEnded}
          callerName={callerName}
          callerPicture={callerPicture}
          answerCall={answerCall}
          endCall={endCall}
        />
      ) : null}
      {/*calling ringtone*/}
      {!callAccepted && show ? (
        <audio src="../../../../audio/ringing.mp3" autoPlay loop></audio>
      ) : null}
    </>
  );
}
