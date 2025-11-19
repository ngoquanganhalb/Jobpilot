"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import Link from "next/link";

import Logo from "./icons/Logo";
import SearchIcon from "./icons/SearchIcon";
import Button from "./ui/ButtonCustom";
import Input from "./ui/InputCustom";
import AvatarMenu from "./ui/AvatarMenu";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";

export default function SearchBar() {
  const [mounted, setMounted] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth);
  console.log("redux", user);
  useEffect(() => {
    // Cho phép client quyết định UI sau khi đã mount
    setMounted(true);
  }, []);
  useEffect(() => {}, []);
  const fetchSuggestions = useCallback(
    debounce(async (text: string) => {
      if (!text.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const today = Timestamp.fromDate(new Date());
        const q = query(
          collection(db, "jobs"),
          where("status", "==", "Active"),
          where("expirationDate", ">=", today)
        );
        const snapshot = await getDocs(q);
        const allJobs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            jobTitle: data.jobTitle || "",
            companyName: data.companyName || "",
            tags: data.tags || [],
            avatarCompany: data.avatarCompany || "images/default-avatar.png",
          };
        });

        // Filter by include same as useMemo
        const filtered = allJobs.filter((job) => {
          const lower = text.toLowerCase();
          const titleMatch = job.jobTitle.toLowerCase().includes(lower);
          const companyMatch = job.companyName.toLowerCase().includes(lower);
          const tagMatch = job.tags.some((tag: string) =>
            tag.toLowerCase().includes(lower)
          );

          return titleMatch || companyMatch || tagMatch;
        });

        setSuggestions(filtered);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(queryText);
  }, [queryText, fetchSuggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2 xl:flex-row justify-between items-center py-5 md:px-[150px] bg-white border">
      <div
        className="gap-8 flex flex-col md:flex-row items-center w-full relative"
        ref={wrapperRef}
      >
        <Link href="/" passHref>
          <div className="flex flex-row items-center text-2xl text-gray-900 font-semibold gap-[8px]">
            <Logo />
            <div>Jobpilot</div>
          </div>
        </Link>

        <div className="relative w-full px-4 md:max-w-[500px] ">
          <Input
            icon={<SearchIcon />}
            className="text-gray-900 text-[16px] px-6 w-full"
            placeholder="Job title, keyword, company"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onFocus={() => queryText && setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-60 overflow-auto shadow-lg">
              {suggestions.map((job) => (
                <li
                  key={job.id}
                  onClick={() => {
                    router.push(`/find-job/${job.id}`);
                    setShowSuggestions(false);
                    setQueryText("");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {job.avatarCompany && (
                      <img
                        src={job.avatarCompany}
                        alt="Company Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium text-sm">{job.jobTitle}</div>
                      <div className="text-xs text-gray-500">
                        {job.companyName}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-4 xl:mt-0">
        {!mounted ? (
          // Placeholder cố định để SSR & client khớp ở khung đầu
          <div className="w-[180px] h-10" />
        ) : user?.permissions?.length > 0 ? (
          <AvatarMenu user={user.user} />
        ) : (
          <>
            <Link href="/sign-in" passHref>
              <Button variant="secondary">Sign In</Button>
            </Link>
            <Link href="/sign-in" passHref>
              <Button>Post A Job</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
