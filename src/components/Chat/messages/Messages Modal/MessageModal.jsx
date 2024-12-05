import React from 'react'
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineDeleteForever,MdTranslate  } from "react-icons/md";


const MessageModal = ({me,onClose,handleReaction,handleReactionRemoveModal,handleMessageTranslate}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark_bg_2 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4 text-slate-300">
            <EmojiPicker className=' w-[110%] -translate-x-[4%]'  reactionsDefaultOpen={true} onReactionClick={handleReaction} />
        </h2>
        <ul className="space-y-3 text-slate-300 ">
          <li className=' cursor-pointer flex items-center hover:text-slate-400 ' onClick={handleReactionRemoveModal}>
            Remove Reaction <MdOutlineDeleteForever className=' ml-1' />
          </li>
          <li className=' cursor-pointer flex items-center hover:text-slate-400' onClick={handleMessageTranslate}>
            Translate Message <MdTranslate className=' ml-1' />
          </li>
          

        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 dark:bg-dark_bg_3 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-red-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default MessageModal