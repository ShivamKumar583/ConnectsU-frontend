import { AttachmentIcon } from "../../../../svg";
import Menu from "./menu/Menu";

export default function Attachments({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) {
  return (
    <li className="relative z-10">
      <button
        onClick={() => {
          setShowPicker(false);
          setShowAttachments((prev) => !prev);
        }}
        type="button"
        className="btn"
      >
        <AttachmentIcon className="dark:fill-purple-600 " />
      </button>
      {/*Menu*/}
      {showAttachments ? <Menu /> : null}
    </li>
  );
}
