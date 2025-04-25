import JobBox from "@component/ui/JobBox";
import { useEffect, useState, useMemo } from "react";
import StepPagination from "@component/ui/StepPagination";
import { useFetchJobBox } from "@hooks/useFetchJobBox";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Job, JobType } from "../../../types/db";

export default function List() {
  const limit = 12;
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const keyword = useSelector((state: RootState) => state.search.keyword);
  const location = useSelector((state: RootState) => state.search.location);
  const filter = useSelector((state: RootState) => state.filter);

  const { jobs } = useFetchJobBox();
  //only searchsearch
  // const searchedJobs = useMemo(() => {
  //   return jobs.filter((job) => {
  //     const keywordMatch =
  //       keyword === "" ||
  //       job.jobTitle.toLowerCase().includes(keyword.toLowerCase()) ||
  //       job.companyName.toLowerCase().includes(keyword.toLowerCase());
  //     const locationMatch =
  //       location === "VietNam" ||
  //       job.location?.toLowerCase().includes(location.toLowerCase());
  //     return keywordMatch && locationMatch;
  //   });
  // }, [jobs, keyword, location]);

  // const filterJobs = useMemo(() => {
  //   return jobs.filter((job) => {

  //     const locationMatch =
  //       location === "" ||
  //       job.location?.toLowerCase().includes(location.toLowerCase());

  //     const tagMatch =
  //       filter.tags.length === 0 ||
  //       filter.tags.some((tag) =>
  //         job.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  //       );

  //     const jobTypeMatch =
  //       filter.jobTypes.length === 0 ||
  //       filter.jobTypes.includes(job.jobType?.toUpperCase() as JobType);

  //     const salaryMatch =
  //       (!filter.minSalary ||
  //         (typeof job.minSalary === "number" &&
  //           job.minSalary >= filter.minSalary)) &&
  //       (!filter.maxSalary ||
  //         (typeof job.maxSalary === "number" &&
  //           job.maxSalary <= filter.maxSalary));

  //     const remoteMatch =
  //       filter.isRemote === false || job.isRemote === filter.isRemote;

  //     return (
  //       locationMatch &&
  //       tagMatch &&
  //       jobTypeMatch &&
  //       salaryMatch &&
  //       remoteMatch
  //     );
  //   });
  // }, [jobs, filter]);
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keywordMatch =
        keyword === "" ||
        job.jobTitle.toLowerCase().includes(keyword.toLowerCase()) ||
        job.companyName.toLowerCase().includes(keyword.toLowerCase());

      const locationMatch =
        location === "" ||
        job.location?.toLowerCase().includes(location.toLowerCase());

      const tagMatch =
        (filter.tags?.length ?? 0) === 0 ||
        (job.tags?.some((jobTag) =>
          (filter.tags ?? []).some(
            (filterTag) =>
              jobTag.trim().toLowerCase() === filterTag.trim().toLowerCase()
          )
        ) ??
          false);

      const jobTypeMatch =
        (filter.jobTypes?.length ?? 0) === 0 ||
        (filter.jobTypes?.some(
          (filterJobType) =>
            job.jobType?.toUpperCase() === filterJobType.toUpperCase()
        ) ??
          false);

      // const min = Number(filter.minSalary);
      // const max = Number(filter.maxSalary);

      // const jobMin =
      //   typeof job.minSalary === "number" ? job.minSalary : undefined;
      // const jobMax =
      //   typeof job.maxSalary === "number" ? job.maxSalary : undefined;

      // const salaryMatch =
      //   (!min || (jobMin !== undefined && jobMin >= min)) &&
      //   (!max || (jobMax !== undefined && jobMax <= max));

      // console.log(
      //   "Min",
      //   jobMin,
      //   "Max",
      //   jobMax,
      //   "Filter Min",
      //   min,
      //   "Filter Max",
      //   max,
      //   "Match",
      //   salaryMatch
      // );

      // const remoteMatch =
      //   filter.isRemote === null || filter.isRemote === undefined
      //     ? true
      //     : job.isRemote === filter.isRemote;

      return (
        keywordMatch && locationMatch && tagMatch && jobTypeMatch
        // remoteMatch
      );
    });
  }, [jobs, keyword, location, filter]);

  const totalSteps = Math.ceil(filteredJobs.length / limit);

  // Pagination effect
  useEffect(() => {
    const startIndex = (currentStep - 1) * limit;
    const endIndex = startIndex + limit;
    setCurrentJobs(filteredJobs.slice(startIndex, endIndex));
  }, [filteredJobs, currentStep]);

  // const totalSteps = Math.ceil(searchedJobs.length / limit);
  // //page paganition
  // useEffect(() => {
  //   const startIndex = (currentStep - 1) * limit;
  //   const endIndex = startIndex + limit;
  //   setCurrentJobs(searchedJobs.slice(startIndex, endIndex));
  // }, [searchedJobs, currentStep]);

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
    <div className="flex flex-col gap-[50px] md:px-[100px] md:py-[50px] lg:px-[150px]">
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {currentJobs.map((job) => {
            return (
              <JobBox
                key={job.jobId}
                id={job.jobId}
                company={job.companyName ? job.companyName : "Unknowed Company"}
                location={job.location || "Viet Nam"}
                title={job.jobTitle}
                type={job.jobType ? job.jobType.toUpperCase() : "FULL-TIME"}
                salary={
                  job.minSalary && job.maxSalary
                    ? `$${job.minSalary} - $${job.maxSalary}`
                    : "Negotiate"
                }
                urgent={job.isRemote} //fix sau
                logo={job.avatarCompany}
              />
            );
          })}
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
