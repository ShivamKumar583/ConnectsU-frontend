import { Logo } from "../../../svg";
import { AiOutlineWechat } from "react-icons/ai";

export default function WhatsappHome() {
  return (
    <div className="h-full w-full dark:bg-slate-400 select-none border-l  dark:border-l-purple-600 border-b-[6px] border-b-purple-600">
      {/*Container*/}
      <div className="-mt-1.5 w-full h-full flex flex-col gap-y-8 items-center justify-center">
        <span>
          <AiOutlineWechat size={150} className=" text-purple-600" />
        </span>
        {/*Infos*/}
        <div className="-mt-8 text-center space-y-[12px]">
          <h1 className=" text-[32px] dark:text-purple-600 font-bold">
            ConnectsU
          </h1>
          <p className="text-sm dark:text-purple-600">
          Chat with ease on various devices using ConnectsU, without interruptions
            <br />
            Stay connected to your loved ones.
          </p>
        </div>
      </div>
    </div>
  );
}
