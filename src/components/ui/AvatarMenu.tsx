"use client";
import { Menu } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { clearUser } from "../../redux/slices/userSlice";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../../services/firebase/firebase";
import { deleteCookie } from "cookies-next";
import Paths from "@/constants/paths";

export default function AvatarMenu({ user }: { user: any }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase sign out
      deleteCookie("token");
      deleteCookie("accountType");
      dispatch(clearUser());
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error: any) {
      toast.error("Failed to sign out");
    }
  };
  return (
    <Menu as="div" className="relative ">
      <Menu.Button className="w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110">
        <Image
          src={user.avatarUrl || "/images/default-avatar.png"}
          alt="avatar"
          width={48}
          height={48}
          className="object-cover w-full h-full"
        />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
        <div className="p-2">
          <Link
            href={Paths.SETTINGS}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            href={Paths.SETTINGS}
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Settings
          </Link>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={() => handleSignOut()}
                className={`w-full text-left px-4 py-2 text-sm ${
                  active ? "bg-gray-100 text-red-500" : "text-red-500"
                }`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
