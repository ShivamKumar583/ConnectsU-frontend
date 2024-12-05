import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/userSlice";
import { AiOutlineWechat } from "react-icons/ai";


export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const onSubmit = async (values) => {
    let res = await dispatch(loginUser({ ...values }));
    if (res?.payload?.user) {
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-slate-400 rounded-xl shadow-md shadow-purple-400">
        {/*Heading*/}
        <div className="text-center flex flex-col items-center  dark:text-purple-600">
        <AiOutlineWechat size={50} className=" text-purple-600 " />
          <h2 className=" text-3xl font-bold">
            Welcome back!
          </h2>
          <p className="mt-2 text-sm">Sign in</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="email"
            type="text"
            placeholder="Email address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />

          {/*if we have an error*/}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {/*Submit button*/}
          <button
            className="w-full flex justify-center bg-purple-600 text-gray-100 p-4 rounded-full tracking-wide
          font-semibold focus:outline-none hover:bg-purple-700 shadow-lg cursor-pointer transition ease-in duration-300
          "
            type="submit"
          >
            {status === "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Sign in"
            )}
          </button>
          {/* Sign in link */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-purple-600">
            <span>New User ?</span>
            <Link
              to="/register"
              className=" font-bold hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign up
            </Link>
          </p>

          <div className=" flex flex-col items-center text-purple-600">
            <p className=" font-bold">Demo Credentials </p>
              <p>Email address - sk@gmail.com</p>
              <p>Password - Sk123!</p>
          </div>
        </form>
      </div>
    </div>
  );
}
