// 'use client'
import Logo from "./icons/Logo";
import SearchIcon from "./icons/SearchIcon";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase/firebase";
import NotificationButton from "./ui/NotificationButton";
import AvatarMenu from "./ui/AvatarMenu";

export default function SearchBar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex flex-col gap-2 xl:flex-row justify-between items-center py-5 md:px-[150px] bg-white  ">
      <div className="gap-8 flex flex-col md:flex-row items-center">
        <Link href="/" passHref>
          <div className="flex flex-row items-center text-2xl text-gray-900 font-semibold gap-[8px]">
            <Logo />
            <div>Jobpilot</div>
          </div>
        </Link>

        <div className="flex item-center md:px-6 py-[12px] md:gap-[12px] rounded-[5px]  ">
          <Input
            icon={<SearchIcon />}
            className="text-gray-900 text-[16px] px-6 w-full min-w-[400px] md:min-w-[500px] "
            placeholder="Job tittle, keyword, company"
          />
        </div>
      </div>

      <div className="flex gap-[12px] ">
        {user ? (
          <>
            <NotificationButton /> <AvatarMenu user={user} />
          </>
        ) : (
          <>
            <Link href="/sign-in" passHref>
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/post-job" passHref>
              <Button>Post A Job</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
