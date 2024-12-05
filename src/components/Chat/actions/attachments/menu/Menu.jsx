import { MdScheduleSend  } from "react-icons/md";

import DocumentAttachment from "./DocumentAttachment";
import PhotoAttachment from "./PhotoAttachment";

export default function Menu({setShowAttachments,handleScheduleMessageModal}) {
  
  return (
    <>
    <ul className="absolute bottom-14 openEmojiAnimation">
      
      <DocumentAttachment />
      
      <li>
        <button type="button" className="rounded-full flex justify-center items-center bg-purple-600 w-[53px] h-[53px] mb-2 text-slate-100  ">
          <MdScheduleSend size={30} onClick={() => handleScheduleMessageModal()} />
        </button>
      </li>
      <PhotoAttachment />
    </ul>

    </>
    
  );
}
