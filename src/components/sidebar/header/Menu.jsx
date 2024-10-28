import { useDispatch } from "react-redux";
import { logout } from "../../../features/userSlice";
import { useState } from "react";

export default function Menu({ setShowCreateGroup }) {
  const dispatch = useDispatch();
  return (
    <>
      <div className="absolute right-1 z-50 dark:bg-slate-300 dark:text-purple-600 shadow-md w-52">
        <ul>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-slate-400"
            onClick={() => setShowCreateGroup(true)}
          >
            <span>New group</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:bg-slate-400">
            <span>New community</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:bg-slate-400">
            <span>Starred messaged</span>
          </li>
          <li className="py-3 pl-5 cursor-pointer hover:bg-slate-400">
            <span>Settings</span>
          </li>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-slate-400"
            onClick={() => dispatch(logout())}
          >
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}
