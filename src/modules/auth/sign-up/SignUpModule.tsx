"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { auth, db } from "../../../services/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Head from "next/head";
import Link from "next/link";
import { FaFacebookF, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsBriefcase } from "react-icons/bs";
import { MdPerson, MdBusiness } from "react-icons/md";
import Input from "@component/ui/InputCustom";
import ArrowIcon from "@component/icons/ArrowIcon";
import { AccountType, FormData } from "@types";
import Spinner from "@component/ui/Spinner";

const SignUpModule = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [accountType, setAccountType] = useState<AccountType>("candidate");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "fullName") {
      setFormData({
        ...formData,
        fullName: e.target.value,
      });
    }
    if (e.target.name === "username") {
      setFormData({
        ...formData,
        username: e.target.value,
      });
    }
    if (e.target.name === "email") {
      setFormData({
        ...formData,
        email: e.target.value,
      });
    }
    if (e.target.name === "password") {
      setFormData({
        ...formData,
        password: e.target.value,
      });
    }
    if (e.target.name === "confirmPassword") {
      setFormData({
        ...formData,
        confirmPassword: e.target.value,
      });
    }
    if (e.target.name === "agreeToTerms") {
      setFormData({
        ...formData,
        agreeToTerms: e.target.checked,
      });
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Prevent reload
    setIsLoading(true);
    // console.log(formData);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      // save info to firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.fullName,
        username: formData.username,
        isAdmin: false,
        accountType: accountType,
        email: formData.email,
        password: formData.password,
      });
      toast.success("Create account sucessfull");
      router.push("/sign-in");
    } catch (error) {
      // console.log(error.message);
      switch ((error as { code: string }).code) {
        case "auth/email-already-in-use":
          toast.error("Email is already in use.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address.");
          break;
        case "auth/weak-password":
          toast.error("Password should be at least 6 characters.");
          break;
        default:
          toast.error("Something went wrong. Please try again.");
          console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 ">
      {isLoading && <Spinner />}
      <Head>
        <title>Create Account | Jobpilot</title>
        <meta name="description" content="Create your Jobpilot account" />
      </Head>

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col">
        <div className="mb-8">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <BsBriefcase className="text-blue-600 text-3xl" />
              <span className="ml-2 text-2xl font-bold">Jobpilot</span>
            </div>
          </Link>
        </div>

        <div className="my-8">
          <h1 className="text-3xl font-bold">Create account.</h1>
          <p className="text-gray-600 mt-2">
            Already have account?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-md p-4 mb-6">
            <p className="text-center text-sm text-gray-500 mb-4">
              CREATE ACCOUNT AS A
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`flex items-center justify-center py-3 px-4 rounded-md border cursor-pointer ${
                  accountType === "candidate"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white border-gray-300 hover:bg-blue-900"
                }`}
                onClick={() => setAccountType("candidate")}
              >
                <MdPerson className="mr-2" />
                <span>Candidate</span>
              </button>
              <button
                type="button"
                className={`flex items-center justify-center py-3 px-4 rounded-md border cursor-pointer ${
                  accountType === "employer"
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white border-gray-300 hover:bg-blue-900"
                }`}
                onClick={() => setAccountType("employer")}
              >
                <MdBusiness className="mr-2" />
                <span>Employers</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-4 relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
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

            <div className="mb-6 relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="mb-6 flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                I`ve read and agree with your{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Services
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center cursor-pointer"
            >
              Create Account
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
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-300"
            >
              <FaFacebookF className="text-blue-600 mr-2" />
              <span className="text-sm">Sign up with Facebook</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-300"
            >
              <FcGoogle className="mr-2" />
              <span className="text-sm">Sign up with Google</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Image and Stats */}
      <div
        className="hidden lg:block lg:w-1/2 relative"
        style={{
          backgroundImage: "url('/images/backgroundsignin.png')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "right ",
          clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex flex-col justify-end  p-12 text-white">
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

export default SignUpModule;
