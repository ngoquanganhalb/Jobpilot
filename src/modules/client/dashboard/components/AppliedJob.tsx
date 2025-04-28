"use client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Application, ApplicationWithJob } from "../../../../types/db";
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
          where("showCandidate", "==", true)
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
              appliedAt: data.appliedAt?.toDate
                ? data.appliedAt.toDate()
                : null,
              candidateId: data.candidateId,
              job: jobData,
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
  }, [jobApplications]);

  const handleDelete = async (applicationId: string) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const applicationRef = doc(db, "applications", applicationId);
          await updateDoc(applicationRef, {
            showCandidate: false,
          });
          Swal.fire({
            title: "Deleted!",
            text: "Your application has been deleted.",
            icon: "success",
          });

          // render immediately
          SetJobApplication((prev) =>
            prev.map((app) =>
              app.id === applicationId ? { ...app, showCandidate: false } : app
            )
          );
        } catch (error) {
          console.error("Error updating application:", error);
          toast.error("Failed to delete application");
        }
      }
    });
  };

  // Pagination effect
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
      <h1 className="text-xl font-medium text-gray-800 mb-4">
        Applied Jobs:{" "}
        <span className="text-gray-500">{jobApplications.length}</span>
      </h1>

      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-50 py-3 px-4 rounded-t-md border-b border-gray-200">
          <div className="col-span-5 text-sm font-medium text-gray-600">
            JOBS
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-600">
            DATE APPLIED
          </div>
          <div className="col-span-2 text-sm font-medium text-gray-600 text-center">
            STATUS
          </div>
          <div className="col-span-3 text-sm font-medium text-gray-600 text-center">
            ACTION
          </div>
        </div>

        {/* Table Body */}
        {/* Table Body */}
        {totalApplications === 0 ? (
          <div className="col-span-12 text-center py-4 text-lg text-gray-500">
            No applications found.
          </div>
        ) : (
          currentApplications.map((applications) => (
            <div
              key={applications.id}
              className={`grid grid-cols-12 items-center py-4 px-4 border-b border-gray-100 hover:ring-2 hover:ring-blue-500 rounded-2xl`}
            >
              {/* Job Info */}
              <div className="col-span-5 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
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
                  <h3 className="font-medium text-gray-800">
                    {applications.job?.jobTitle || "No Title"}
                  </h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block mr-1">📍</span>
                      {applications.job?.location}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="inline-block mr-1">💰</span>
                      {applications.job?.minSalary === 0 &&
                      applications.job?.maxSalary === 0
                        ? "Negotiate"
                        : `$${applications.job?.minSalary} - $${applications.job?.maxSalary}`}
                    </div>
                  </div>
                </div>
                <div className="ml-2">
                  {renderJobTypeBadge(applications.job?.jobType || "Unknown")}
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
              <div className="col-span-2 ">
                <div
                  className={`flex items-center justify-center py-1 rounded-md text-sm
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
                  }
                  `}
                >
                  {applications.status === "pending" && (
                    <FaRegClock className="text-lg mr-2" />
                  )}
                  {applications.status === "reviewed" && (
                    <FaCheckCircle className="text-lg mr-2" />
                  )}
                  {applications.status === "interview" && (
                    <FaRegQuestionCircle className="text-lg mr-2" />
                  )}
                  {applications.status === "hired" && (
                    <FaUserCheck className="text-lg mr-2" />
                  )}
                  {applications.status === "rejected" && (
                    <FaTimesCircle className="text-lg mr-2" />
                  )}
                  {applications.status}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-3 flex justify-center space-x-3">
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded-md"
                  onClick={() => handleDelete(applications.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalApplications > limit && (
        <StepPagination
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
        />
      )}
    </div>
  );
};

export default AppliedJob;
