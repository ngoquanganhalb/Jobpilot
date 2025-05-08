/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@services/firebase/firebase";
import { getAuth } from "firebase/auth";
import JobBoxEmployer from "./JobBoxEmployer";
import Spinner from "@component/ui/Spinner";
import { Job } from "../../../../types/db";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setJobs } from "@redux/slices/jobSlice";
import StepPagination from "@component/ui/StepPagination";
import Link from "next/link";
import Paths from "@/constants/paths";
import { HiBriefcase } from "react-icons/hi";

export default function MyJobs() {
  const [jobActionDropdown, setJobActionDropdown] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  // const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  //pagnition
  const limit = 10;
  const [currentStep, setCurrentStep] = useState(1);

  //fetch job for only that employer account
  useEffect(() => {
    const fetchJobs = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "jobs"),
          where("employerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const jobs: Job[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            jobId: doc.id,
            employerId: data.employerId || "",
            jobTitle: data.jobTitle || "",
            companyName: data.companyName || "Unknown",
            title: data.jobTitle || "",
            type: data.jobType || "Unknown",
            expirationDate: data.expirationDate?.toDate() || null,
            urgent: data.isRemote || false,
            status: data.status || "Active",
            applicants: data.applicants,
            createdAt: data.createdAt?.toDate() || new Date(0),
            location: data.location,
            avatarCompany: data.avatarCompany,
            minSalary: data.minSalary,
            maxSalary: data.maxSalary,
            jobType: data.jobType,
            tags: data.tags,
            description: data.description,
            isRemote: data.isRemote,
          };
        });

        // setMyJobs(jobs);
        dispatch(setJobs(jobs));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleJobActionDropdown = (jobId: number) => {
    setJobActionDropdown(jobActionDropdown === jobId ? null : jobId);
  };

  // Pagination setup
  const totalJobs = jobs.length;
  const totalSteps = Math.ceil(totalJobs / limit);

  const sortedJobs = [...jobs].sort((a, b) => {
    const timeA = a.createdAt?.getTime() ?? 0;
    const timeB = b.createdAt?.getTime() ?? 0;
    return timeB - timeA;
  });

  const startIndex = (currentStep - 1) * limit;
  const endIndex = startIndex + limit;
  const currentJobs = sortedJobs.slice(startIndex, endIndex);

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <HiBriefcase className="text-blue-600 w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-800">
            My Posted Jobs
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({jobs.length})
            </span>
          </h2>
        </div>
      </div>
      <hr className="border-t border-gray-200 mb-4" />

      {jobs.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
          <p>You have not posted any jobs yet. Start posting now!</p>
        </div>
      ) : (
        <div>
          <div className="rounded-2xl shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)]">
            <div className="hidden md:grid grid-cols-12 bg-gray-100 py-4 px-6 text-sm font-medium text-gray-600 ">
              <div className="col-span-5">JOBS</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-3">APPLICATIONS</div>
              <div className="col-span-2">ACTIONS</div>
            </div>

            <ul className=" ">
              {currentJobs.map((job) => (
                <JobBoxEmployer
                  key={job.jobId}
                  job={job}
                  jobActionDropdown={jobActionDropdown}
                  toggleJobActionDropdown={toggleJobActionDropdown}
                />
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {totalJobs > limit && (
            <StepPagination
              currentStep={currentStep}
              totalSteps={totalSteps}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onStepClick={handleStepClick}
            />
          )}
        </div>
      )}
    </div>
  );
}
