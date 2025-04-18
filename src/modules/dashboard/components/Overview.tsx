import { JobPosting } from "@types";
import { useState } from "react";
import Link from "next/link";
import {
  BsBriefcase,
  BsThreeDots,
  BsArrowRight,
  BsFillEyeFill,
} from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { MdGroups } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { GrUpgrade } from "react-icons/gr";
import { useSelector } from "react-redux";
export default function OverviewEmployer() {
  const [jobActionDropdown, setJobActionDropdown] = useState<number | null>(
    null
  );
  const user = useSelector((state: any) => state.user);

  const recentJobs: JobPosting[] = [
    {
      id: 1,
      title: "UI/UX Designer",
      type: "Full Time",
      timeRemaining: "27 days remaining",
      status: "Active",
      applications: 798,
    },
    {
      id: 2,
      title: "Senior UX Designer",
      type: "Internship",
      timeRemaining: "8 days remaining",
      status: "Active",
      applications: 185,
    },
    {
      id: 3,
      title: "Technical Support Specialist",
      type: "Part Time",
      timeRemaining: "4 days remaining",
      status: "Active",
      applications: 556,
      urgent: true,
    },
    {
      id: 4,
      title: "Junior Graphic Designer",
      type: "Full Time",
      timeRemaining: "24 days remaining",
      status: "Active",
      applications: 583,
    },
    {
      id: 5,
      title: "Front End Developer",
      type: "Full Time",
      expiryDate: "Dec 7, 2019",
      status: "Expire",
      applications: 740,
    },
  ];

  const toggleJobActionDropdown = (jobId: number) => {
    setJobActionDropdown(jobActionDropdown === jobId ? null : jobId);
  };

  return (
    <div className="flex-1">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-1">
          Hello, {user.name || "my friend"}
        </h1>
        <p className="text-gray-600">
          Here is your daily activities and applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-[65%]">
        <div className="bg-blue-50 rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">589</h2>
            <p className="text-gray-600">Open Jobs</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <BsBriefcase className="text-blue-600 text-xl" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">2,517</h2>
            <p className="text-gray-600">Saved Candidates</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <FiUser className="text-yellow-500 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium">Recently Posted Jobs</h2>
          <Link href="/all-jobs" className="text-blue-600 flex items-center">
            View all <BsArrowRight className="ml-1" />
          </Link>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 bg-gray-100 py-3 px-6 text-sm font-medium text-gray-600">
          <div className="col-span-4">JOBS</div>
          <div className="col-span-3">STATUS</div>
          <div className="col-span-3">APPLICATIONS</div>
          <div className="col-span-2">ACTIONS</div>
        </div>

        {/* Desktop Table Rows */}
        <div className="hidden md:block divide-y divide-gray-200">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className={`grid grid-cols-12 py-4 px-6 hover:border hover:border-blue-500 rounded-[16px] transition-all duration-75  ${
                job.urgent ? "bg-urgent" : ""
              }`}
            >
              <div className="col-span-4">
                <h3 className="font-medium text-gray-800">{job.title}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <span>{job.type}</span>
                  <span className="mx-2">•</span>
                  <span>{job.timeRemaining || job.expiryDate}</span>
                </div>
              </div>
              <div className="col-span-3 flex items-center">
                {job.status === "Active" ? (
                  <div className="flex items-center text-green-600">
                    <BiCheckCircle className="mr-1" />
                    <span>Active</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <BiXCircle className="mr-1" />
                    <span>Expire</span>
                  </div>
                )}
              </div>
              <div className="col-span-3 flex items-center">
                <MdGroups className="w-8 h-7 mr-2 text-gray-500" />
                <span className="text-gray-500">
                  {job.applications} Applications
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-between">
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Applications
                </button>
                <div className="relative group">
                  <button
                    onClick={() => toggleJobActionDropdown(job.id)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <BsThreeDots className="h-5 w-5" />
                  </button>
                  {jobActionDropdown === job.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => console.log("click")}
                          className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                        >
                          <GrUpgrade className="h-4 w-4 mr-2 text-blue-600" />
                          Promote Job
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                          <BsFillEyeFill className="h-4 w-4 mr-2 text-green-500" />
                          View Detail
                        </button>
                        <button className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100">
                          <MdCancel className="h-4 w-4 mr-2 text-red-500" />
                          Mark as expired
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Friendly View */}
        <div className="md:hidden divide-y divide-gray-200">
          {recentJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-white rounded-md shadow-sm mb-4"
            >
              <h3 className="font-semibold text-gray-800">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.type} • {job.timeRemaining || job.expiryDate}
              </p>
              <p className="text-sm mt-2">
                <strong>Status:</strong>{" "}
                <span
                  className={
                    job.status === "Active" ? "text-green-600" : "text-red-500"
                  }
                >
                  {job.status}
                </span>
              </p>
              <p className="text-sm">
                <strong>Applications:</strong> {job.applications}
              </p>
              <div className="mt-2 flex justify-end">
                <button className="text-blue-600 text-sm">
                  View Applications
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
