import { JobBoxType } from "@types";
import Image from "next/image";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useState } from "react";
import { Badge } from "@component/ui/badge";
import Paths from "@/constants/paths";
import Link from "next/link";

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
  // variant = "secondary",
  ...props
}: JobBoxType) {
  let variantStyles = "";
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Tránh click dính vào Link
    e.preventDefault();
    setIsBookmarked(!isBookmarked);
  };

  // if (variant === "primary") {
  //   variantStyles =
  //     "bg-[linear-gradient(90deg,_#FFF6E6_0%,_#FFF_100%)] shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  // } else {
  //   variantStyles = "bg-white shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  // }

  if (urgent == true) {
    variantStyles = "bg-urgent";
  } else {
    variantStyles = "bg-white shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  }

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
    <Link href={`${Paths.FIND_JOB}/${id}`}>
      <div
        className={`flex flex-col w-[390px] p-[24px] border-3 border-[#E4E5E8] shadow-md rounded-[8px] hover:scale-105 transition-all duration-100 cursor-pointer
    ${variantStyles} ${className}`}
        {...props}
      >
        <div className="text-[18px] font-bold leading-7">{title}</div>
        <div className="flex flex-row gap-2 pt-1">
          {/* <div className="flex items-center px-[8px] text-[12px] font-semibold leading-3 uppercase text-green-500 bg-green-50 border rounded-[3px] justify-center  ">
          {type}
          
        </div> */}
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
          {logo ? (
            <Image
              src={logo}
              alt="Company Logo"
              width={48}
              height={48}
              className="rounded-md object-fill w-[40px] h-[40px]"
              unoptimized //base64 dont need optimized
            />
          ) : (
            <Image
              src="/images/EmployersLogo.svg"
              alt="Default Logo"
              width={40}
              height={40}
              className="rounded-md  "
            />
          )}
          {/* <Image src={EmployersLogo} alt="logo" /> */}
          <div className="flex flex-col flex-1">
            <div className="text-[16px] font-semibold leading-6 ">
              {company}
            </div>
            <div className="flex flex-row ">
              <Image
                src="/images/AddressIconBox.svg"
                width={14}
                height={14}
                alt="icon"
              />
              <div className="text-[14px] font-normal leading-5 text-gray-500">
                {location}
              </div>

              <button
                onClick={handleBookmarkClick}
                className="ml-auto cursor-pointer group"
              >
                {isBookmarked ? (
                  <FaBookmark className="text-amber-400 hover:scale-110 transition-transform duration-200" />
                ) : (
                  <FaRegBookmark className=" text-gray-500 group-hover:text-amber-400 group-active:text-amber-500 group-hover:scale-110 transition-all duration-200 " />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
