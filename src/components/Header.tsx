import CountryIcon from "../assets/Country.png";
import PhoneIcon from "../assets/PhoneCall.svg";
import HeaderDownIcon from "../components/icons/HeaderDownIcon";
import Image from "next/image";
import NavLink from "./ui/NavLink";

export default function Header() {
  return (
    <div className="bg-gray-200 flex flex-col md:flex-row md:justify-between items-center px-6 md:px-[150px] py-4 gap-4 md:gap-0 2xl:max-h-12">
      {/* Left nav */}
      <div className="text-sm text-gray-500 font-normal flex flex-wrap justify-center gap-4 md:gap-6">
        <NavLink href="/">Home</NavLink>
        <NavLink>Find Job</NavLink>
        <NavLink>Employers</NavLink>
        <NavLink>Candidates</NavLink>
        <NavLink>Pricing Plans</NavLink>
        <NavLink>Customer Supports</NavLink>
      </div>

      {/* Right contact */}
      <div className="text-sm text-gray-500 font-normal flex flex-wrap justify-center items-center gap-4 md:gap-6">
        <div className="text-gray-900 font-medium flex items-center gap-2">
          <Image src={PhoneIcon} alt="Phone" />
          <div>+1-202-555-0178</div>
        </div>

        <div className="flex items-center gap-2">
          <Image src={CountryIcon} alt="Country" className="w-5 h-3" />
          <span>English</span>
          <HeaderDownIcon />
        </div>
      </div>
    </div>
  );
}
