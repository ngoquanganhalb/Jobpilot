/*eslint-disable*/
"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { getIdToken } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../services/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../redux/slices/userSlice";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSocialAuth } from "@hooks/useSocialAuth";

import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsBriefcase } from "react-icons/bs";
import { MdPerson, MdBusiness } from "react-icons/md";
import Input from "@component/ui/InputCustom";
import ArrowIcon from "@component/icons/ArrowIcon";
import Spinner from "@component/ui/Spinner";
import { url } from "inspector";
import { AccountType } from "@types";
import { LoginDto } from "@/dtos/auth/login.dto";
import { useLogin } from "./hooks/useLogin";
import { signIn } from "next-auth/react";

const SignInModule: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const { handleSocialSignIn } = useSocialAuth();
  const [form, setForm] = useState<LoginDto>({} as LoginDto);
  const { loginMutation } = useLogin();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // tránh reload trang khi bam submit
    try {
      await loginMutation(form);
      router.push("/");
    } catch {}
  };

  return (
    <div className="flex min-h-screen bg-gray-50 ">
      <Head>
        <title>SignIn | Jobpilot</title>
        <meta name="description" content="SignIn your Jobpilot account" />
      </Head>

      {/* Left side - Form */}
      <div className="w-full lg:w-[40%] p-6 md:p-12 flex flex-col">
        <div className="mb-8">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <BsBriefcase className="text-blue-600 text-3xl" />
              <span className="ml-2 text-2xl font-bold">Jobpilot</span>
            </div>
          </Link>
        </div>

        <div className="my-8">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-600 mt-2">
            Don't have account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Username"
              // onChange={(e) => setEmail(e.target.value)}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  username: e.target.value,
                }));
              }}
              required
            />
          </div>

          <div className="mb-4 relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              // onChange={(e) => {
              //   setPassword(e.target.value);
              // }}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
              }}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              // onChange={(e) => {
              //   setRemember(e.target.checked);
              // }}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, rememberMe: e.target.checked }));
              }}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 ml-2">
              Remember Me{" "}
            </label>
          </div>

          {/* <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              // checked={ask}
              // onChange={(e) => {
              //   setRemember(e.target.checked);
              // }}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  askChangPassword: e.target.checked,
                }));
              }}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 ml-2">
              Change password{" "}
            </label>
          </div> */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            Sign In
            <ArrowIcon className="text-white ml-5" />
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => signIn("facebook")}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-300"
          >
            <FaFacebookF className="text-blue-600 mr-2" />
            <span className="text-sm">Sign up with Facebook</span>
          </button>
          <button
            type="button"
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-300"
          >
            <FcGoogle className="mr-2" />
            <span className="text-sm">Sign up with Google</span>
          </button>
        </div>
      </div>

      {/* Right Side - img */}
      <div
        className="hidden lg:block lg:w-[60%] relative"
        style={{
          backgroundImage: "url('/images/backgroundsignin.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "right ",
          clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 pl-18">
            Over 1,75,324 candidates
            <br />
            waiting for good employees.
          </h2>

          <div className="grid grid-cols-3 gap-8 mt-8 mb-16 ">
            <div className="flex flex-col items-center">
              <div className="bg-cyan-600 bg-opacity-50 p-3 rounded-md mb-2">
                <BsBriefcase className="text-white text-xl" />
              </div>
              <p className="text-xl font-bold">1,75,324</p>
              <p className="text-sm opacity-75">Live Job</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-cyan-600  bg-opacity-50 p-3 rounded-md mb-2">
                <MdBusiness className="text-white text-xl" />
              </div>
              <p className="text-xl font-bold">97,354</p>
              <p className="text-sm opacity-75">Companies</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-cyan-600  bg-opacity-50 p-3 rounded-md mb-2">
                <BsBriefcase className="text-white text-xl" />
              </div>
              <p className="text-xl font-bold">7,532</p>
              <p className="text-sm opacity-75">New Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModule;
