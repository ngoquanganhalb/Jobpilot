import ArrowIcon from "@component/components/icons/ArrowIcon";
import Button from "@component/components/ui/Button";
import JobBox from "@component/components/ui/JobBox";
import { useEffect, useState, useRef } from "react";
import { firestore } from "../../../services/firebase/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { JobBoxType } from "@component/types/types";
import StepPagination from "@component/components/ui/StepPagination";

export default function List() {
  const limit = 6;
  const [jobs, setJobs] = useState<JobBoxType[]>([]);
  const [currentJobs, setCurrentJobs] = useState<JobBoxType[]>([]);
  const refSearch = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = Math.ceil(jobs.length / limit);
  //fetch alljob first
  useEffect(() => {
    const fetchJobs = async () => {
      const jobsRef = collection(firestore, "jobCards");
      const q = query(jobsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<JobBoxType, "id">),
      }));
      setJobs(jobsData);
    };

    fetchJobs();
  }, []);

  //Step current fetch
  useEffect(() => {
    const startIndex = (currentStep - 1) * limit;
    const endIndex = startIndex + limit;
    setCurrentJobs(jobs.slice(startIndex, endIndex));
  }, [jobs, currentStep]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="flex flex-col gap-[50px]  md:px-[100px] md:py-[50px] lg:px-[150px] ">
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 ">
          {currentJobs.map((job) => (
            <JobBox
              key={job.id}
              company={job.company}
              location={job.location}
              title={job.title}
              type={job.type}
              salary={job.salary}
              urgent={job.urgent}
              logo={job.logo}
              // variant="primary"
            />
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <StepPagination
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onStepClick={handleStepClick}
        />
      </div>
    </div>
  );
}
