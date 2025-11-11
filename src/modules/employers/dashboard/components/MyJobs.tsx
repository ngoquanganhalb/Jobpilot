/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import JobBoxEmployer from "./JobBoxEmployer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setJobs } from "@redux/slices/jobSlice";
import StepPagination from "@component/ui/StepPagination";
import { HiBriefcase } from "react-icons/hi";
import { useFetchJob } from "@hooks/job/useFetchJob";
import { usePagination } from "@hooks/usePagination";

export default function MyJobs() {
  const [jobActionDropdown, setJobActionDropdown] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();
  const { data } = useFetchJob();

  // Đưa dispatch vào useEffect để tránh gọi mỗi render
  useEffect(() => {
    if (data) dispatch(setJobs(data));
  }, [data, dispatch]);

  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const { page, totalPages, pageItems, next, prev, setPage } = usePagination(
    jobs,
    10
  );
  //pagnition
  // const limit = 10;
  // const [currentStep, setCurrentStep] = useState(1);
  const toggleJobActionDropdown = (jobId: number) => {
    setJobActionDropdown(jobActionDropdown === jobId ? null : jobId);
  };

  // Pagination setup
  // const totalJobs = jobs.length;
  // const totalSteps = Math.ceil(totalJobs / limit);

  // const startIndex = (currentStep - 1) * limit;
  // const endIndex = startIndex + limit;
  // const currentJobs = jobs.slice(startIndex, endIndex);

  // const handleNext = () => {
  //   if (currentStep < totalSteps) {
  //     setCurrentStep((prevStep) => prevStep + 1);
  //   }
  // };

  // const handlePrevious = () => {
  //   if (currentStep > 1) {
  //     setCurrentStep((prevStep) => prevStep - 1);
  //   }
  // };

  // const handleStepClick = (step: number) => {
  //   setCurrentStep(step);
  // };

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
              {pageItems.map((job) => (
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
          {jobs.length > 10 && (
            <StepPagination
              currentStep={page}
              totalSteps={totalPages}
              onNext={next}
              onPrevious={prev}
              onStepClick={setPage}
            />
          )}
        </div>
      )}
    </div>
  );
}
