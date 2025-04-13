import { JobBoxType } from "@component/types/types";
import Image from "next/image";
import EmployersLogo from "../../assets/EmployersLogo.svg";
import AddressIconBox from "../../assets/AddressIconBox.svg";
import BookMark from "../../assets/BookMark.svg";
export default function JobBox({
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

  // if (variant === "primary") {
  //   variantStyles =
  //     "bg-[linear-gradient(90deg,_#FFF6E6_0%,_#FFF_100%)] shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  // } else {
  //   variantStyles = "bg-white shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  // }

  if (urgent == true) {
    variantStyles =
      "bg-[linear-gradient(90deg,_#FFF6E6_0%,_#FFF_100%)] shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  } else {
    variantStyles = "bg-white shadow-[0px_2px_18px_0px_rgba(24,25,28,0.03)]";
  }

  return (
    <div
      className={`flex flex-col w-[390px] p-[24px] border rounded-[8px]
    ${variantStyles} ${className}`}
      {...props}
    >
      <div className="text-[18px] font-medium leading-7">{title}</div>
      <div className="flex flex-row gap-2">
        <div className="flex items-center px-[8px] text-[12px] font-semibold leading-3 uppercase text-green-500 bg-green-50 border rounded-[3px] justify-center  ">
          {type}
        </div>
        <div className="text-[14px] font-normal leading-5 text-gray-500">
          {salary}
        </div>
      </div>

      <div className="flex flex-row gap-3 items-center">
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
            src={EmployersLogo}
            alt="Default Logo"
            width={40}
            height={40}
            className="rounded-md  "
          />
        )}
        {/* <Image src={EmployersLogo} alt="logo" /> */}
        <div className="flex flex-col flex-1">
          <div className="text-[16px] font-medium leading-6">{company}</div>
          <div className="flex flex-row ">
            <Image src={AddressIconBox} alt="icon" />
            <div className="text-[14px] font-normal leading-5 text-gray-500">
              {location}
            </div>

            <button
              onClick={() => console.log("Bookmark clicked")}
              className="ml-auto cursor-pointer"
            >
              <Image src={BookMark} alt="BookMark" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
