"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@services/firebase/firebase";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { useEditUser } from "@hooks/user/useEditUser";
import { toast } from "react-toastify";
import { FaBookmark } from "react-icons/fa6";
import StepPagination from "@component/ui/StepPagination";
import { Button } from "@component/ui/Button";
import ArrowIcon from "@component/icons/ArrowIcon";
import Link from "next/link";
import Paths from "@/constants/paths";
import { JOB_STATUS } from "@/common/enum";
import { Job } from "../../../types/db";

const LIMIT = 10;

const FavoriteJob: React.FC = () => {
  // 🔹 Redux user (source of truth)
  const user = useSelector((state: RootState) => state.auth.user);
  const favoriteJobs: string[] = user?.favoriteJobs || [];

  const { editMutation } = useEditUser();

  // 🔹 Job detail state
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const today = Timestamp.fromDate(new Date());
  const totalSteps = Math.ceil(savedJobs.length / LIMIT);
  console.log("savedJob", savedJobs);
  // =========================
  // Fetch job detail
  // =========================
  const fetchJob = async (jobId: string): Promise<Job | null> => {
    try {
      const snap = await getDoc(doc(db, "jobs", jobId));
      if (!snap.exists()) return null;

      return {
        jobId,
        ...(snap.data() as Omit<Job, "jobId">),
      };
    } catch (err) {
      console.error("Fetch job error:", err);
      return null;
    }
  };

  // =========================
  // Sync job list when redux favoriteJobs changes
  // =========================
  useEffect(() => {
    if (!favoriteJobs.length) {
      setSavedJobs([]);
      return;
    }

    const fetchJobs = async () => {
      const jobs = await Promise.all(favoriteJobs.map((id) => fetchJob(id)));

      setSavedJobs(jobs.filter((j): j is Job => j !== null));
    };

    fetchJobs();
  }, [favoriteJobs]);

  // =========================
  // Toggle bookmark (REALTIME)
  // =========================
  const handleToggleBookmark = async (jobId: string) => {
    if (!user) {
      toast.info("Please log in to manage favorites");
      return;
    }

    const isSaved = favoriteJobs.includes(jobId);

    const updatedFavoriteJobs = isSaved
      ? favoriteJobs.filter((id) => id !== jobId)
      : [...favoriteJobs, jobId];

    // ✅ Optimistic UI (local job list)
    setSavedJobs((prev) =>
      isSaved ? prev.filter((job) => job.jobId !== jobId) : prev
    );

    try {
      // ✅ Update user via hook (API → Redux)
      await editMutation({
        favoriteJobs: updatedFavoriteJobs,
      });
    } catch {
      toast.error("Failed to update favorites");
    }
  };

  // =========================
  // Pagination
  // =========================
  const paginatedJobs = savedJobs.slice(
    (currentStep - 1) * LIMIT,
    currentStep * LIMIT
  );

  // =========================
  // Helpers
  // =========================
  const renderJobTypeBadge = (jobType: string) => {
    const map: Record<string, string> = {
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-green-100 text-green-800",
      internship: "bg-orange-100 text-orange-800",
      freelance: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-md ${
          map[jobType] || "bg-gray-100 text-gray-800"
        }`}
      >
        {jobType}
      </span>
    );
  };
  const renderRemainingTime = (job: Job) => {
    if (!job.expirationDate || job.status !== JOB_STATUS.ACTIVE) {
      return <span className="text-red-500">Not Available</span>;
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const expirationDate =
      job.expirationDate instanceof Date
        ? job.expirationDate
        : job.expirationDate.toDate();

    if (expirationDate <= now) {
      return <span className="text-red-500">Expired</span>;
    }

    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
      <span className="text-green-600">
        {diffDays} day{diffDays > 1 ? "s" : ""} remain
      </span>
    );
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Saved Jobs: <span className="text-blue-600">{savedJobs.length}</span>
      </h1>

      <div className="bg-white rounded-xl border shadow">
        {savedJobs.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No favorite jobs found.
          </div>
        ) : (
          paginatedJobs.map((job) => (
            <div
              key={job.jobId}
              className="grid md:grid-cols-[1fr_auto] gap-4 p-5 border-b last:border-none hover:bg-gray-50"
            >
              {/* LEFT */}
              <div className="flex gap-4">
                <img
                  src={job.avatarCompany || "/images/default-avatar.png"}
                  className="w-14 h-14 rounded-md object-cover border"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">
                      {job.jobTitle || "No title"}
                    </h3>
                    {renderJobTypeBadge(job.jobType || "unknown")}
                  </div>

                  <div className="text-sm text-gray-500 flex gap-4 flex-wrap mt-1">
                    <span>📍 {job.location?.province || "Unknown"}</span>
                    <span>
                      💰{" "}
                      {job.minSalary === 0 && job.maxSalary === 0
                        ? "Negotiate"
                        : `$${job.minSalary} - $${job.maxSalary}`}
                    </span>
                    <span>🗓️ {renderRemainingTime(job)}</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => handleToggleBookmark(job.jobId)}
                  className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center hover:scale-105 transition"
                >
                  <FaBookmark
                    className={
                      favoriteJobs.includes(job.jobId)
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }
                  />
                </button>

                {job.status === JOB_STATUS.ACTIVE &&
                job.expirationDate &&
                job.expirationDate > today ? (
                  <Link href={`${Paths.FIND_JOB}/${job.jobId}`}>
                    <Button className="bg-blue-600 text-white">
                      Apply <ArrowIcon />
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="bg-gray-300 text-gray-600">
                    Job Expired <ArrowIcon />
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {savedJobs.length > LIMIT && (
        <div className="mt-6">
          <StepPagination
            currentStep={currentStep}
            totalSteps={totalSteps}
            onNext={() => setCurrentStep((p) => p + 1)}
            onPrevious={() => setCurrentStep((p) => p - 1)}
            onStepClick={setCurrentStep}
          />
        </div>
      )}
    </div>
  );
};

export default FavoriteJob;
