/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { JobPosting } from "@types";
import { useState } from "react";
import Link from "next/link";
import { BsBriefcase, BsArrowRight } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { useSelector } from "react-redux";
import JobBoxEmployer from "./JobBoxEmployer";
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
        {recentJobs.map((job) => (
          <JobBoxEmployer
            key={job.id}
            job={job}
            jobActionDropdown={jobActionDropdown}
            toggleJobActionDropdown={toggleJobActionDropdown}
          />
        ))}
      </div>
    </div>
  );
}
