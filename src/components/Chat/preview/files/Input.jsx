export default function Input({ message, setMessage }) {
  return (
    <div className="w-full max-w-[60%] dark:bg-slate-500 rounded-lg">
      {/*Message input*/}
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-transparent h-11 pl-2 focus:outline-none border-none dark:text-slate-300"
      />
    </div>
  );
}
