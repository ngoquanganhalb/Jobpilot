import {
  MdEngineering,
  MdDesignServices,
  MdAccountBalance,
  MdPeople,
  MdSupportAgent,
  MdCode,
  MdWeb,
  MdPhoneIphone,
  MdOutlineDraw,
  MdWork,
  MdSchool,
  MdLocalHospital,
  MdStore,
  MdHotel,
  MdPrecisionManufacturing,
  MdLocalShipping,
  MdTheaterComedy,
  MdSocialDistance,
  MdBusinessCenter,
  MdMoreHoriz,
  MdOutlineCurrencyExchange,
} from "react-icons/md";
import Link from "next/link";
import { FcAdvertising } from "react-icons/fc";
import { JOB_TAG_OPTIONS, JobTag } from "../../../../types/db";
import ArrowIcon from "@component/icons/ArrowIcon";
import Paths from "@/constants/paths";
import Button from "@component/ui/ButtonCustom";
import { JSX } from "react";

const categoryIcons: Record<JobTag, JSX.Element> = {
  Engineering: <MdEngineering className="text-indigo-500 text-2xl" />,
  Design: <MdDesignServices className="text-blue-500 text-2xl" />,
  Marketing: <FcAdvertising className="text-green-500 text-2xl" />,
  Sales: <MdOutlineCurrencyExchange className="text-yellow-500 text-2xl" />,
  Finance: <MdAccountBalance className="text-purple-500 text-2xl" />,
  "Finance & Accounting": (
    <MdAccountBalance className="text-purple-500 text-2xl" />
  ),
  "Human Resources": <MdPeople className="text-pink-500 text-2xl" />,
  "Customer Support": <MdSupportAgent className="text-blue-400 text-2xl" />,
  "Software Development": <MdCode className="text-red-500 text-2xl" />,
  "Web Development": <MdWeb className="text-cyan-500 text-2xl" />,
  "Mobile Development": <MdPhoneIphone className="text-green-600 text-2xl" />,
  "UI/UX Design": <MdOutlineDraw className="text-orange-400 text-2xl" />,
  Operations: <MdWork className="text-gray-700 text-2xl" />,
  Education: <MdSchool className="text-indigo-600 text-2xl" />,
  Healthcare: <MdLocalHospital className="text-red-400 text-2xl" />,
  Retail: <MdStore className="text-yellow-600 text-2xl" />,
  Hospitality: <MdHotel className="text-purple-600 text-2xl" />,
  Manufacturing: (
    <MdPrecisionManufacturing className="text-blue-600 text-2xl" />
  ),
  Transportation: <MdLocalShipping className="text-emerald-500 text-2xl" />,
  Entertainment: <MdTheaterComedy className="text-pink-400 text-2xl" />,
  "Supply Chain & Logistics": (
    <MdLocalShipping className="text-emerald-600 text-2xl" />
  ),
  "Social Media": <MdSocialDistance className="text-blue-500 text-2xl" />,
  "Sales & Business Development": (
    <MdBusinessCenter className="text-teal-500 text-2xl" />
  ),
  Others: <MdMoreHoriz className="text-gray-400 text-2xl" />,
};

export const PopularCategory = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Popular category
          </h2>
          <Link href={Paths.FIND_JOB}>
            <Button className="ml-auto gap-3" variant="secondary">
              <div>See All</div>
              <ArrowIcon />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {JOB_TAG_OPTIONS.map((tag) => (
            <Link
              key={tag}
              href={{
                pathname: Paths.FIND_JOB,
                query: { tag: tag }, // push tag in URL
              }}
            >
              <div className="flex items-center space-x-1 p-3 rounded-md shadow-sm hover:shadow-md transition hover:scale-105 cursor-pointer bg-white">
                <div className="bg-gray-100 p-2 rounded-md">
                  {categoryIcons[tag]}
                </div>
                <p className="text-gray-700 text-sm flex-wrap">{tag}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
