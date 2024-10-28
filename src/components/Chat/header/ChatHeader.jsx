import { useSelector } from "react-redux";
import {
  CallIcon,
  DotsIcon,
  SearchLargeIcon,
  VideoCallIcon,
} from "../../../svg";
import { capitalize } from "../../../utils/string";
import { useEffect, useRef, useState } from "react";
import SocketContext from "../../../context/SocketContext";
import Peer from "simple-peer";
import {
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";
import { AiFillCaretLeft } from "react-icons/ai";
function ChatHeader({ online, callUser, setShowSidebar }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-[59px] dark:bg-slate-400 flex items-center p16 select-none">
      {/*Container*/}
      <div className="w-full flex items-center justify-between">

        {/*left*/}
        <div className="flex items-center gap-x-4">
          <button className=" block lg:hidden" onClick={() => setShowSidebar(true)}>
            <AiFillCaretLeft className=" text-purple-600"/>
          </button>
          {/*Conversation image*/}
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture
                  : getConversationPicture(user, activeConversation.users)
              }
              alt=""
              className=" border-2 border-slate-600 w-full h-full rounded-full object-cover"
            />
          </button>
          {/*Conversation name and online status*/}
          <div className="flex flex-col">
            <h1 className="dark:text-slate-600 text-md font-bold">
              {activeConversation.isGroup
                ? activeConversation.name
                : capitalize(
                    getConversationName(user, activeConversation.users).split(
                      " "
                    )[0]
                  )}
            </h1>
            <span className="text-xs dark:text-slate-600">
              {online ? "online" : ""}
            </span>
          </div>
        </div>
        {/*Right*/}
        <ul className="flex items-center gap-x-2.5">
          {1 == 1 ? (
            <li onClick={() => callUser()}>
              <button className="btn text-purple-600">
                <VideoCallIcon />
              </button>
            </li>
          ) : null}
          {1 == 1 ? (
            <li>
              <button className="btn">
                <CallIcon />
              </button>
            </li>
          ) : null}
          <li>
            <button className="btn">
              <SearchLargeIcon className="dark:fill-purple-600" />
            </button>
          </li>
          <li>
            <button className="btn">
              <DotsIcon className="dark:fill-purple-600" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatHeaderWithSocket;
