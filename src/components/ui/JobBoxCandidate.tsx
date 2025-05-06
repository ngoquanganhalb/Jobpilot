"use client";
import React from "react";
import { ApplicationWithJob } from "@/types/db";
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

  const statusColor = {
    pending: "bg-blue-100 text-blue-800",
    reviewed: "bg-purple-100 text-purple-800",
    interview: "bg-yellow-100 text-yellow-800",
    hired: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusIcon = {
    pending: <FaRegClock className="text-lg mr-2" />,
    reviewed: <FaCheckCircle className="text-lg mr-2" />,
    interview: <FaRegQuestionCircle className="text-lg mr-2" />,
    hired: <FaUserCheck className="text-lg mr-2" />,
    rejected: <FaTimesCircle className="text-lg mr-2" />,
  };

  return (
    <div
      key={application.id}
      className="grid grid-cols-12 items-center py-4 px-4 border-b border-gray-300 hover:ring-2 hover:ring-blue-500 rounded-2xl"
    >
      {/* Job Info */}
      <div className="col-span-5 flex items-center space-x-3">
        <div className="w-12 h-12 rounded overflow-hidden flex items-center justify-center">
          <img
            src={application.job?.avatarCompany || "/images/default-avatar.png"}
            alt="Company Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="flex items-center">
            <h3 className="font-medium text-gray-800">
              {application.job?.jobTitle || "No Title"}
            </h3>
            <div className="ml-2">
              {renderJobTypeBadge(application.job?.jobType || "Unknown")}
            </div>
          </div>
          <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
            <div className="flex items-center">
              <span className="inline-block mr-1">📍</span>
              {application.job?.location?.province || "Unknown"}
            </div>
            <div className="flex items-center">
              <span className="inline-block mr-1">💰</span>
              {application.job?.minSalary === 0 &&
              application.job?.maxSalary === 0
                ? "Negotiate"
                : `$${application.job?.minSalary} - $${application.job?.maxSalary}`}
            </div>
          </div>
        </div>
      </div>

      {/* Date Applied */}
      <div className="col-span-2 text-sm text-gray-600">
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
      <div className="col-span-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center justify-center py-1 rounded-md text-sm cursor-help ${
                  statusColor[application.status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {statusIcon[application.status]}
                {application.status}
              </div>
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
      <div className="col-span-3 flex justify-center space-x-3">
        <button
          className="py-2 px-4 bg-red-500 text-white rounded-md"
          onClick={() => onDelete(application.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobBoxCandidate;
