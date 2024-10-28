import { ArrowIcon, CloseIcon, NotificationIcon } from "../../../svg";

export default function Notifications() {
  return (
    <div className="h-[90px] dark:bg-slate-300 flex items-center p-[13px] border-t-2 border-slate-400">
      {/*container*/}
      <div className="w-full flex items-center justify-between">
        {/*Left */}
        <div className="flex items-center gap-x-4">
          <div className="cursor-pointer">
            <NotificationIcon className="dark:fill-purple-600 " />
          </div>
          <div className="flex flex-col">
            <span className="textPrimary text-slate-500">Get notified of new messages</span>
            <span className="textSecondary text-slate-500 mt-0.5 flex items-center gap-0.5">
              Turn on desktop notifications
              <ArrowIcon className="dark:fill-slate-500 mt-1" />
            </span>
          </div>
        </div>
        {/*Right */}
        <div className="cursor-pointer">
          <CloseIcon className="dark:fill-slate-500" />
        </div>
      </div>
    </div>
  );
}
