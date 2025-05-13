"use client";
import { useSelector } from "react-redux";
import Image from "next/image";
import NavLink from "./ui/NavLink";
import { Paths } from "@/constants/paths";

export default function Header() {
  // const accountType = useSelector((state: any) => state.user.accountType);
  return (
    <div className="bg-gray-200 flex flex-col md:flex-row md:justify-between items-center px-6 md:px-[150px] py-4 gap-4 md:gap-0 2xl:max-h-12">
      {/* Left nav */}
      <div className="text-sm text-gray-500 font-normal flex flex-wrap justify-center gap-4 md:gap-6">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/find-job">Find Job</NavLink>
        {/* <NavLink>Employers</NavLink>
        <NavLink>Candidates</NavLink> */}
        {/* <NavLink>Pricing Plans</NavLink> */}
        {/* <NavLink>Customer Supports</NavLink> */}
        {/* <NavLink href={Paths.DASHBOARD_OVERVIEW}>Dash Board</NavLink> */}
        <NavLink href={Paths.DASHBOARD_OVERVIEW}>Dashboard</NavLink>
        {/* {accountType === "candidate" && (
          <NavLink href={Paths.DASHBOARD_APPLIEDJOB}>Dashboard</NavLink>
        )}

        {accountType === "employer" && (
          <NavLink href={Paths.DASHBOARD_OVERVIEW}>Dashboard</NavLink>
        )} */}
      </div>

      {/* Right contact */}
      <div className="text-sm text-gray-500 font-normal flex flex-wrap justify-center items-center gap-4 md:gap-6">
        <div className="text-gray-900 font-medium flex items-center gap-2">
          <Image
            src="/images/PhoneCall.svg"
            alt="Phone"
            width={20}
            height={20}
          />
          <div>+1-202-555-0178</div>
        </div>

        {/* <div className="flex items-center gap-2">
          <Image
            src="/images/Country.png"
            alt="Country"
            width={20}
            height={20}
          />
          <span>English</span>
          <HeaderDownIcon />
        </div> */}
      </div>
    </div>
  );
}
