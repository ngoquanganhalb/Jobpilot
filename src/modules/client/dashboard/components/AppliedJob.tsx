"use client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Application, ApplicationWithJob, Job } from "../../../../types/db";
import React, { useEffect, useState } from "react";
import { db } from "@services/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import StepPagination from "@component/ui/StepPagination";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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

const AppliedJob: React.FC = () => {
  const MySwal = withReactContent(Swal);
  const [jobApplications, SetJobApplication] = useState<ApplicationWithJob[]>(
    []
  );
  const limit = 10;
  const [currentApplications, setCurrentApplications] = useState<
    ApplicationWithJob[]
  >([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);
  const renderJobTypeBadge = (jobType: string) => {
    let badgeClass = "";

    switch (jobType) {
      case "full-time":
        badgeClass = "bg-blue-100 text-blue-800";
        break;
      case "part-time":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "internship":
        badgeClass = "bg-orange-100 text-orange-800";
        break;
      case "freelance":
        badgeClass = "bg-purple-100 text-purple-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-md ${badgeClass}`}>
        {jobType}
      </span>
    );
  };

  const fetchJobById = async (jobId: string) => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        return jobSnap.data();
      } else {
        console.warn(`Job with ID ${jobId} does not exist.`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "applications"),
          where("candidateId", "==", user.uid),
          where("showCandidate", "==", true),
          orderBy("appliedAt", "desc")
        );
        const querySnapshot = await getDocs(q);

        const jobApplications = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const jobData = await fetchJobById(data.jobId);

            return {
              id: docSnap.id,
              jobId: data.jobId,
              note: data.note,
              resumeUrl: data.resumeUrl,
              showCandidate: data.showCandidate,
              showEmployer: data.showEmployer,
              status: data.status,
              feedback: data.feedback,
              appliedAt: data.appliedAt?.toDate
                ? data.appliedAt.toDate()
                : null,
              candidateId: data.candidateId,
              job: jobData ? (jobData as Job) : undefined,
            };
          })
        );

        SetJobApplication(jobApplications);
        setTotalApplications(jobApplications.length);
        console.log(jobApplications);
      } catch (error) {
        console.log(error);
      }
    });

    // Cleanup auth khi component unmount
    return () => unsubscribe();
  }, []);

  const handleDelete = async (applicationId: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, "applications", applicationId), {
          showCandidate: false,
        });

        toast.success("Deleted successfully!");
        SetJobApplication((prev) =>
          prev.filter((app) => app.id !== applicationId)
        );
      } catch (error) {
        toast.error("Delete failed.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    const startIndex = (currentStep - 1) * limit;
    const endIndex = startIndex + limit;
    setCurrentApplications(jobApplications.slice(startIndex, endIndex));
  }, [jobApplications, currentStep]);

  const totalSteps = Math.ceil(totalApplications / limit);
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Applied Jobs:{" "}
        <span className="text-blue-500 font-semibold">
          {jobApplications.length}
        </span>
      </h1>

      <div className="bg-white rounded-xl  border border-gray-200 overflow-hidden shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)]">
        {/* Table Header (Desktop only) */}
        <div className="hidden md:grid grid-cols-12 bg-gray-100 py-4 px-5 font-semibold text-sm text-gray-600 border-b">
          <div className="col-span-5">Jobs</div>
          <div className="col-span-2">Date Applied</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-3 text-center">Action</div>
        </div>

        {/* Table Body */}
        {totalApplications === 0 ? (
          <div className="py-6 text-center text-gray-500 text-lg">
            No applications found.
          </div>
        ) : (
          currentApplications.map((applications) => (
            <div
              key={applications.id}
              className="border-b px-4 py-6 md:px-5 md:py-5 hover:bg-gray-50 transition-all"
            >
              {/* Desktop layout */}
              <div className="hidden md:grid grid-cols-12 items-center gap-4">
                {/* Job Info */}
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={
                        applications.job?.avatarCompany ||
                        "/images/default-avatar.png"
                      }
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800">
                        {applications.job?.jobTitle || "No Title"}
                      </h3>
                      {renderJobTypeBadge(
                        applications.job?.jobType || "Unknown"
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span>
                        📍 {applications.job?.location?.province || "Unknown"}
                      </span>
                      <span>
                        💰{" "}
                        {applications.job?.minSalary === 0 &&
                        applications.job?.maxSalary === 0
                          ? "Negotiate"
                          : `$${applications.job?.minSalary} - $${applications.job?.maxSalary}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Applied */}
                <div className="col-span-2 text-sm text-gray-600">
                  {applications.appliedAt
                    ? applications.appliedAt.toLocaleString("en-US", {
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
                <div className="col-span-2 flex justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm capitalize cursor-help
                          ${
                            applications.status === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : applications.status === "reviewed"
                              ? "bg-purple-100 text-purple-800"
                              : applications.status === "interview"
                              ? "bg-yellow-100 text-yellow-800"
                              : applications.status === "hired"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {applications.status === "pending" && <FaRegClock />}
                          {applications.status === "reviewed" && (
                            <FaCheckCircle />
                          )}
                          {applications.status === "interview" && (
                            <FaRegQuestionCircle />
                          )}
                          {applications.status === "hired" && <FaUserCheck />}
                          {applications.status === "rejected" && (
                            <FaTimesCircle />
                          )}
                          {applications.status}
                        </div>
                      </TooltipTrigger>
                      {applications.feedback &&
                        applications.status !== "pending" && (
                          <TooltipContent
                            className="bg-white text-black border border-gray-200 shadow-md rounded-lg p-4 text-sm max-w-sm"
                            side="top"
                          >
                            {applications.feedback}
                          </TooltipContent>
                        )}
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Actions */}
                <div className="col-span-3 flex justify-center">
                  <button
                    onClick={() => handleDelete(applications.id)}
                    className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Mobile layout */}
              <div className="md:hidden flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={
                        applications.job?.avatarCompany ||
                        "/images/default-avatar.png"
                      }
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      {applications.job?.jobTitle || "No Title"}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-1">
                      <span>
                        📍 {applications.job?.location?.province || "Unknown"}
                      </span>
                      <span>
                        💰{" "}
                        {applications.job?.minSalary === 0 &&
                        applications.job?.maxSalary === 0
                          ? "Negotiate"
                          : `$${applications.job?.minSalary} - $${applications.job?.maxSalary}`}
                      </span>
                    </div>
                    <div className="mt-1">
                      {renderJobTypeBadge(
                        applications.job?.jobType || "Unknown"
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <strong>Date Applied:</strong>{" "}
                  {applications.appliedAt
                    ? applications.appliedAt.toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })
                    : "N/A"}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <strong>Status:</strong>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm capitalize cursor-help
                          ${
                            applications.status === "pending"
                              ? "bg-blue-100 text-blue-800"
                              : applications.status === "reviewed"
                              ? "bg-purple-100 text-purple-800"
                              : applications.status === "interview"
                              ? "bg-yellow-100 text-yellow-800"
                              : applications.status === "hired"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {applications.status === "pending" && <FaRegClock />}
                          {applications.status === "reviewed" && (
                            <FaCheckCircle />
                          )}
                          {applications.status === "interview" && (
                            <FaRegQuestionCircle />
                          )}
                          {applications.status === "hired" && <FaUserCheck />}
                          {applications.status === "rejected" && (
                            <FaTimesCircle />
                          )}
                          {applications.status}
                        </div>
                      </TooltipTrigger>
                      {applications.feedback &&
                        applications.status !== "pending" && (
                          <TooltipContent
                            className="bg-white text-black border border-gray-200 shadow-md rounded-lg p-4 text-sm max-w-sm"
                            side="top"
                          >
                            {applications.feedback}
                          </TooltipContent>
                        )}
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div>
                  <button
                    onClick={() => handleDelete(applications.id)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalApplications > limit && (
        <div className="mt-6">
          <StepPagination
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onStepClick={handleStepClick}
          />
        </div>
      )}
    </div>
  );
};

export default AppliedJob;
