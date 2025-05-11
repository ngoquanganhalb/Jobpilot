"use client";
import React from "react";
import { ApplicationWithJob, Status } from "@/types/db";
import {
  FaCheckCircle,
  FaRegClock,
  FaRegQuestionCircle,
  FaTimesCircle,
  FaUserCheck,
} from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@component/ui/tooltip";

type Props = {
  application: ApplicationWithJob;
  onDelete: (applicationId: string) => void;
};

const JobBoxCandidate: React.FC<Props> = ({ application, onDelete }) => {
  const renderJobTypeBadge = (jobType: string) => {
    const classes: Record<string, string> = {
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-green-100 text-green-800",
      internship: "bg-orange-100 text-orange-800",
      freelance: "bg-purple-100 text-purple-800",
    };
    return (
      <span
        className={`text-xs px-2 py-1 rounded-md ${
          classes[jobType] || "bg-gray-100 text-gray-800"
        }`}
      >
        {jobType}
      </span>
    );
  };

  const renderStatus = (status: Status) => {
    const baseClass =
      "flex items-center gap-2 px-3 py-1 rounded-md text-sm capitalize cursor-help";
    const statusClass = {
      pending: "bg-blue-100 text-blue-800",
      reviewed: "bg-purple-100 text-purple-800",
      interview: "bg-yellow-100 text-yellow-800",
      hired: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const icon = {
      pending: <FaRegClock />,
      reviewed: <FaCheckCircle />,
      interview: <FaRegQuestionCircle />,
      hired: <FaUserCheck />,
      rejected: <FaTimesCircle />,
    };

    return (
      <div
        className={`${baseClass} ${
          statusClass[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {icon[status]}
        {status}
      </div>
    );
  };

  return (
    <div
      key={application.id}
      className="border-b px-4 py-6 md:px-5 md:py-5 hover:bg-gray-50 transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-4">
        {/* Job Info */}
        <div className="md:col-span-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
            <img
              src={
                application.job?.avatarCompany || "/images/default-avatar.png"
              }
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-gray-800">
                {application.job?.jobTitle || "No Title"}
              </h3>
              {renderJobTypeBadge(application.job?.jobType || "Unknown")}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
              <span>📍 {application.job?.location?.province || "Unknown"}</span>
              <span>
                💰{" "}
                {application.job?.minSalary === 0 &&
                application.job?.maxSalary === 0
                  ? "Negotiate"
                  : `$${application.job?.minSalary} - $${application.job?.maxSalary}`}
              </span>
            </div>
          </div>
        </div>

        {/* Date Applied */}
        <div className="md:col-span-2 text-sm text-gray-600 flex flex-row gap-1">
          <div className="md:hidden font-semibold text-sm items-center flex">
            Date Applied:{" "}
          </div>
          {application.appliedAt
            ? application.appliedAt.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "N/A"}
        </div>

        {/* Status */}
        <div className="md:col-span-2 flex justify-start md:justify-center gap-1">
          <div className="md:hidden font-semibold text-sm items-center flex">
            Status:{" "}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {renderStatus(application.status)}
              </TooltipTrigger>
              {application.feedback && application.status !== "pending" && (
                <TooltipContent
                  className="bg-white text-black border border-gray-200 shadow-md rounded-lg p-4 text-sm max-w-sm"
                  side="top"
                >
                  {application.feedback}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Actions */}
        <div className="md:col-span-2 flex md:justify-center">
          <button
            className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition w-full md:w-auto cursor-pointer"
            onClick={() => onDelete(application.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobBoxCandidate;
