"use client";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

          console.log("Saved job IDs: ", savedJobsId);

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

  // return (
  //   <div className="w-full px-4 py-6">
  //     <h1 className="text-xl font-medium text-gray-800 mb-4">
  //       Saved Jobs: <span className="text-gray-500">{savedJobs.length}</span>
  //     </h1>

  //     <div className="bg-white rounded-md shadow-md border border-gray-300 ">
  //       {savedJobs.length === 0 ? (
  //         <div className="text-center py-6 text-gray-500 text-lg font-medium">
  //           No favorite jobs found.
  //         </div>
  //       ) : (
  //         paginatedJobs.map((job) => (
  //           <div
  //             key={job.jobId}
  //             className="flex flex-wrap md:flex-nowrap justify-between items-start border-b last:border-none border-gray-300 p-4 rounded-lg hover:ring-1 hover:ring-blue-500 transition duration-150 gap-1"
  //           >
  //             {/* Left - Avatar & Job Info */}
  //             <div className="flex flex-1 items-start gap-4 min-w-[250px]">
  //               <div className="w-12 h-12 rounded overflow-hidden border border-gray-300 shrink-0">
  //                 <img
  //                   src={job.avatarCompany || "/images/default-avatar.png"}
  //                   alt="Company Logo"
  //                   className="w-full h-full object-cover"
  //                 />
  //               </div>
  //               <div className="flex-1 min-w-0">
  //                 <div className="flex flex-row gap-3">
  //                   <h3 className="text-sm font-semibold text-gray-800 truncate">
  //                     {job.jobTitle || "No Title"}
  //                   </h3>
  //                   <span> {renderJobTypeBadge(job.jobType || "Unknown")}</span>
  //                 </div>
  //                 <div className="flex flex-wrap items-center text-xs text-gray-500 mt-2 gap-x-4 gap-y-1 whitespace-nowrap ">
  //                   <span>📍 {job.location?.province || "Unknown"}</span>
  //                   <span>
  //                     💰{" "}
  //                     {job.minSalary === 0 && job.maxSalary === 0
  //                       ? "Negotiate"
  //                       : `$${job.minSalary} - $${job.maxSalary}`}
  //                   </span>
  //                   <span>
  //                     🗓️{" "}
  //                     {job.expirationDate
  //                       ? new Date(job.expirationDate.seconds * 1000) >
  //                         new Date()
  //                         ? `Expired: ${new Date(
  //                             job.expirationDate.seconds * 1000
  //                           ).toLocaleDateString()}`
  //                         : "Expired"
  //                       : "No deadline"}
  //                   </span>
  //                 </div>
  //               </div>
  //             </div>

  //             {/* Middle - Job Type & Bookmark */}
  //             {/* <div className="flex items-center justify-center gap-4 md:flex-col md:items-start min-w-[120px]">
  //               {renderJobTypeBadge(job.jobType || "Unknown")}
  //             </div> */}

  //             {/* Right - Apply Now */}
  //             <div className=" flex flex-row w-full md:w-auto mt-2 md:mt-0 gap-3 items-center justify-center">
  //               <button
  //                 onClick={() => handleToggleBookmark(job.jobId)}
  //                 className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xl hover:scale-105 transition cursor-pointer"
  //               >
  //                 <FaBookmark
  //                   className={
  //                     savedJobs.some((j) => j.jobId === job.jobId)
  //                       ? "text-yellow-400"
  //                       : "text-gray-500"
  //                   }
  //                 />
  //               </button>
  //               <Link href={`${Paths.FIND_JOB}/${job.jobId}`}>
  //                 <Button className="w-full md:w-auto bg-[#0A65CC] text-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm cursor-pointer">
  //                   Apply Now
  //                   <ArrowIcon />
  //                 </Button>
  //               </Link>
  //             </div>
  //           </div>
  //         ))
  //       )}
  //     </div>

  //     {/* Pagination */}
  //     {savedJobs.length > limit && (
  //       <div className="mt-6">
  //         <StepPagination
  //           currentStep={currentStep}
  //           totalSteps={totalSteps}
  //           onNext={handleNext}
  //           onPrevious={handlePrevious}
  //           onStepClick={handleStepClick}
  //         />
  //       </div>
  //     )}
  //   </div>
  // );
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
                      {job.expirationDate
                        ? new Date(job.expirationDate.seconds * 1000) >
                          new Date()
                          ? `Until ${new Date(
                              job.expirationDate.seconds * 1000
                            ).toLocaleDateString()}`
                          : "Expired"
                        : "No deadline"}
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
                <Link href={`${Paths.FIND_JOB}/${job.jobId}`}>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-4 py-2 text-sm rounded-md flex items-center gap-2 cursor-pointer">
                    Apply Now <ArrowIcon />
                  </Button>
                </Link>
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
