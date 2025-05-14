import { JobBoxType } from "@types";
import Image from "next/image";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Badge } from "@component/ui/badge";
import Paths from "@/constants/paths";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "@services/firebase/firebase";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";

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
  const [isBookmarked, setIsBookmarked] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      if (!currentUser) return;
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const savedJobs: string[] = userSnap.data()?.savedJobs || [];
      setIsBookmarked(id ? savedJobs.includes(id) : false);
    };

    fetchBookmarkStatus();
  }, [id, currentUser]);

  const handleToggleBookmark = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    e.preventDefault(); //prevent click to link

    if (!currentUser) {
      toast.info("Please log in to save jobs");
      return;
    }

    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const savedJobs: string[] = userSnap.data()?.savedJobs || [];

      let updatedSavedJobs;
      if (id && savedJobs.includes(id)) {
        updatedSavedJobs = savedJobs.filter((jobId) => jobId !== id);
        toast.info("Removed from favorites");
        setIsBookmarked(false);
      } else {
        updatedSavedJobs = [...savedJobs, id];
        toast.success("Saved to favorites");
        setIsBookmarked(true);
      }

      await updateDoc(userRef, { savedJobs: updatedSavedJobs });
    } catch (error) {
      console.error("Error updating saved jobs:", error);
      toast.error("Something went wrong");
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
      {/* Bookmark button outside Link */}
      <button
        onClick={handleToggleBookmark}
        className="absolute top-4 right-4 z-10"
      >
        {isBookmarked ? (
          <FaBookmark className="text-amber-400 hover:scale-110 transition-transform duration-200 cursor-pointer" />
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
            <div className="text-[14px] font-normal leading-5 text-gray-500">
              {salary}
            </div>
          </div>

          <div className="flex flex-row gap-3 items-center pt-4">
            <Image
              src={logo || "/images/EmployersLogo.svg"}
              alt="Company Logo"
              width={40}
              height={40}
              className="rounded-md object-fill w-[40px] h-[40px]"
              unoptimized
            />
            <div className="flex flex-col flex-1">
              <div className="text-[16px] font-semibold leading-6">
                {company}
              </div>
              <div className="flex flex-row items-center gap-1">
                <Image
                  src="/images/AddressIconBox.svg"
                  width={14}
                  height={14}
                  alt="icon"
                />
                <div className="text-[14px] font-normal leading-5 text-gray-500">
                  {location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
