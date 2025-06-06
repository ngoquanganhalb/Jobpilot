"use client";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, firestore } from "@services/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import StepPagination from "@component/ui/StepPagination";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa6";

import { Job } from "../../../types/db";
import { Button } from "@component/ui/Button";
import ArrowIcon from "@component/icons/ArrowIcon";
import Link from "next/link";
import Paths from "@/constants/paths";

const FavoriteJob: React.FC = () => {
  const limit = 10;
  // const [currentApplications, setCurrentApplications] = useState<
  //   ApplicationWithJob[]
  // >([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const totalSteps = Math.ceil(savedJobs.length / limit);
  const today = Timestamp.fromDate(new Date());

  // Pagination handlers
  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  // Lấy danh sách jobs cho trang hiện tại
  const paginatedJobs = savedJobs.slice(
    (currentStep - 1) * limit,
    currentStep * limit
  );

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
  const fetchJob = async (jobId: string): Promise<Job | null> => {
    try {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      if (jobSnap.exists()) {
        const jobData = jobSnap.data() as Omit<Job, "jobId">;
        return {
          jobId,
          ...jobData,
        };
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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      try {
        const userSnap = await getDoc(doc(firestore, "users", currentUser.uid));
        if (userSnap.exists()) {
          const userDataFromFirestore = userSnap.data();
          const savedJobsId = userDataFromFirestore.savedJobs || [];

          // console.log("Saved job IDs: ", savedJobsId);

          const jobData = await Promise.all(
            savedJobsId.map((jobId: string) => fetchJob(jobId))
          );

          // Lọc null jobs nếu có job đã bị xóa
          const validJobs = jobData.filter((job): job is Job => job !== null);

          setSavedJobs(validJobs);
          console.log("Fetched saved jobs: ", validJobs);
        } else {
          console.error("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleToggleBookmark = async (jobId: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.info("Please log in to manage favorites.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const currentSavedJobs: string[] = userSnap.data()?.savedJobs || [];

      let updatedSavedJobs: string[] = [];
      let updatedSavedJobList: Job[] = [];

      if (currentSavedJobs.includes(jobId)) {
        // Remove
        updatedSavedJobs = currentSavedJobs.filter((id) => id !== jobId);
        updatedSavedJobList = savedJobs.filter((job) => job.jobId !== jobId);
        toast.info("Removed from favorites");
      } else {
        // Add
        updatedSavedJobs = [...currentSavedJobs, jobId];
        const newJob = await fetchJob(jobId);
        if (newJob) updatedSavedJobList = [...savedJobs, newJob];
        toast.success("Saved to favorites");
      }

      await updateDoc(userRef, { savedJobs: updatedSavedJobs });
      setSavedJobs(updatedSavedJobList);
    } catch (error) {
      console.error("Error updating saved jobs:", error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Saved Jobs: <span className="text-blue-600">{savedJobs.length}</span>
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)]">
        {savedJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-lg font-medium">
            No favorite jobs found.
          </div>
        ) : (
          paginatedJobs.map((job) => (
            <div
              key={job.jobId}
              className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center border-b last:border-none border-gray-200 p-5 hover:bg-gray-50 transition"
            >
              {/* Left side: Job info */}
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-300 shrink-0">
                  <img
                    src={job.avatarCompany || "/images/default-avatar.png"}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {job.jobTitle || "No Title"}
                    </h3>
                    {renderJobTypeBadge(job.jobType || "Unknown")}
                  </div>
                  <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1">
                    <span>📍 {job.location?.province || "Unknown"}</span>
                    <span>
                      💰{" "}
                      {job.minSalary === 0 && job.maxSalary === 0
                        ? "Negotiate"
                        : `$${job.minSalary} - $${job.maxSalary}`}
                    </span>
                    <span>
                      🗓️{" "}
                      {job.expirationDate && job.status === "Active" ? (
                        (() => {
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);

                          const expirationDate =
                            job.expirationDate instanceof Date
                              ? job.expirationDate
                              : job.expirationDate.toDate();

                          if (expirationDate > now) {
                            const diffTime =
                              expirationDate.getTime() - now.getTime();
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            return `${diffDays} day${
                              diffDays > 1 ? "s" : ""
                            } remain`;
                          } else {
                            return (
                              <span className="text-red-500">Expired</span>
                            );
                          }
                        })()
                      ) : (
                        <span className="text-red-500">Expired</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right side: Actions */}
              <div className="mt-4 md:mt-0 flex flex-row md:flex-row items-center gap-3 md:justify-end justify-center">
                <button
                  onClick={() => handleToggleBookmark(job.jobId)}
                  className="w-10 h-10 cursor-pointer bg-gray-100 rounded-md flex items-center justify-center text-xl hover:scale-105 transition"
                  title="Toggle Favorite"
                >
                  <FaBookmark
                    className={
                      savedJobs.some((j) => j.jobId === job.jobId)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }
                  />
                </button>
                {job.status === "Active" &&
                job.expirationDate &&
                job.expirationDate > today ? (
                  <Link href={`${Paths.FIND_JOB}/${job.jobId}`}>
                    <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 text-sm rounded-md flex items-center gap-2 cursor-pointer">
                      Apply Now <ArrowIcon />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled
                    className="bg-gray-300 text-gray-600 font-semibold px-4 py-2 text-sm rounded-md flex items-center gap-1 cursor-not-allowed"
                  >
                    Job Expired <ArrowIcon />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {savedJobs.length > limit && (
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

export default FavoriteJob;
