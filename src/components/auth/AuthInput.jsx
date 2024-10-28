export default function AuthInput({
  name,
  type,
  placeholder,
  register,
  error,
}) {
  return (
    <div className="mt-8 content-center dark:text-purple-600 space-y-1">
      <label htmlFor={name} className="text-sm font-bold tracking-wide">
        {placeholder}
      </label>
      <input
        className="w-full dark:bg-slate-300 text-purple-600 py-2 px-4 rounded-lg outline-none"
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
