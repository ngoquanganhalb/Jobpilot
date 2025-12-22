"use client";
import { JobBoxType } from "@types";
import Image from "next/image";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Badge } from "@component/ui/badge";
import Paths from "@/constants/paths";
import Link from "next/link";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useEditUser } from "@hooks/user/useEditUser";
import { useGetUserProfile } from "@hooks/business/useGetUserProfile";

export default function JobBox({
  id,
  title,
  type,
  salary,
  company,
  location,
  urgent,
  logo,
  className = "",
  ...props
}: JobBoxType) {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data, refetch } = useGetUserProfile();
  const favoriteJobs: string[] = data?.user?.favoriteJobs || [];

  const { editMutation } = useEditUser();

  const [isBookmarked, setIsBookmarked] = useState(false);

  // ✅ sync profile → UI
  useEffect(() => {
    if (!id) return;
    setIsBookmarked(favoriteJobs.includes(id));
  }, [favoriteJobs, id]);

  const handleToggleBookmark = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user || !id) {
      toast.info("Please log in to save jobs");
      return;
    }

    const nextValue = !isBookmarked;

    // 🟢 optimistic UI
    setIsBookmarked(nextValue);

    const updatedFavorites: string[] = nextValue
      ? [...favoriteJobs, id]
      : favoriteJobs.filter((jobId) => jobId !== id);

    try {
      await editMutation({
        favoriteJobs: updatedFavorites,
      });

      // ✅ đồng bộ lại profile
      await refetch();
    } catch {
      // 🔴 rollback UI
      setIsBookmarked(!nextValue);
      toast.error("Failed to update favorites");
    }
  };

  const variantStyles = urgent
    ? "bg-urgent"
    : "bg-white shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";

  const getJobTypeBadgeColor = (type: string) => {
    switch (type) {
      case "FULL-TIME":
        return "bg-blue-100 text-blue-800";
      case "PART-TIME":
        return "bg-green-100 text-green-800";
      case "INTERNSHIP":
        return "bg-orange-100 text-orange-800";
      case "FREELANCE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`relative flex flex-col w-[385px] p-[24px] border-3 border-[#E4E5E8] shadow-md rounded-[8px] hover:scale-105 transition-all duration-100 cursor-pointer ${variantStyles} ${className}`}
      {...props}
    >
      {/* Bookmark */}
      <button
        onClick={handleToggleBookmark}
        className="absolute top-4 right-4 z-10"
      >
        {isBookmarked ? (
          <FaBookmark className="text-amber-400 hover:scale-110 transition-transform duration-200" />
        ) : (
          <FaRegBookmark className="text-gray-500 hover:text-amber-400 hover:scale-110 transition-all duration-200" />
        )}
      </button>

      <Link href={`${Paths.FIND_JOB}/${id}`}>
        <div className="flex flex-col">
          <div className="text-[18px] font-bold leading-7">{title}</div>

          <div className="flex flex-row gap-2 pt-1">
            <Badge
              className={`uppercase font-medium w-fit ${getJobTypeBadgeColor(
                type
              )}`}
            >
              {type}
            </Badge>
            <div className="text-[14px] text-gray-500">{salary}</div>
          </div>

          <div className="flex flex-row gap-3 items-center pt-4">
            <Image
              src={logo || "/images/EmployersLogo.svg"}
              alt="Company Logo"
              width={40}
              height={40}
              className="rounded-md object-fill"
              unoptimized
            />
            <div className="flex flex-col flex-1">
              <div className="text-[16px] font-semibold">{company}</div>
              <div className="flex items-center gap-1">
                <Image
                  src="/images/AddressIconBox.svg"
                  width={14}
                  height={14}
                  alt="icon"
                />
                <div className="text-[14px] text-gray-500">{location}</div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
