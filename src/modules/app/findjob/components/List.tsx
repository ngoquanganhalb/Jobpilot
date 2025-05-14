import JobBox from "@component/ui/JobBox";
import { useEffect, useState, useMemo } from "react";
import StepPagination from "@component/ui/StepPagination";
import { useFetchJobBox } from "@hooks/useFetchJobBox";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Job } from "../../../../types/db";
import { resetFilters, setFilters } from "@redux/slices/filterSlice";
import { useDispatch } from "react-redux";
import { useSearchParams } from "next/navigation";
import Spinner from "@component/ui/Spinner";
import {
  setKeyword as setKeywordRedux,
  setLocation as setLocationRedux,
} from "@redux/slices/searchSlice";

export default function List() {
  const limit = 12;
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const keyword = useSelector((state: RootState) => state.search.keyword);
  const location = useSelector((state: RootState) => state.search.location);
  const filter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();
  const { jobs } = useFetchJobBox();

  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const [queryTag, setQueryTag] = useState<string | undefined>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const tag = searchParams.get("tag");
      if (tag) {
        setQueryTag(tag);
      }
    }
  }, [isMounted, searchParams]);

  // Now you can safely use queryTag
  useEffect(() => {
    if (queryTag) {
      dispatch(
        setFilters({
          tags: [queryTag],
          jobTypes: [],
          minSalary: 0,
          maxSalary: 0,
          isRemote: null,
        })
      );
    }
  }, [queryTag]);

  useEffect(() => {
    const kw = searchParams.get("keyword") || "";
    const loc = searchParams.get("location") || "";

    dispatch(setKeywordRedux(kw));
    dispatch(setLocationRedux(loc));
  }, [searchParams, dispatch]);

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

  useEffect(() => {
    dispatch(resetFilters());
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keywordMatch =
        keyword === "" ||
        (job.jobTitle?.toLowerCase().includes(keyword.toLowerCase()) ??
          false) ||
        job.companyName.toLowerCase().includes(keyword.toLowerCase());

      const locationMatch =
        location === "" ||
        job.location?.province
          ?.toLowerCase()
          .includes(location.toLowerCase()) ||
        job.location?.district?.toLowerCase().includes(location.toLowerCase());

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

      // const remoteMatch =
      //   filter.isRemote === null || filter.isRemote === undefined
      //     ? true
      //     : job.isRemote === filter.isRemote;

      const jobMin = typeof job.minSalary === "number" ? job.minSalary : null;
      const jobMax = typeof job.maxSalary === "number" ? job.maxSalary : null;

      const min = filter.minSalary ?? 0;
      const max = filter.maxSalary ?? 0;

      const salaryMatch =
        (min === 0 || (jobMin !== null && jobMin >= min)) &&
        (max === 0 || (jobMax !== null && jobMax <= max));

      return (
        keywordMatch && locationMatch && tagMatch && jobTypeMatch && salaryMatch
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

  if (!isMounted) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-[50px] md:px-[100px] md:py-[50px] lg:px-[150px] ">
      <div className="flex items-center justify-center min-h-[200px]">
        {currentJobs.length === 0 ? (
          <p className="text-gray-500 text-lg font-semibold">No Job Found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 justify-items-center">
            {currentJobs.map((job) => (
              <JobBox
                key={job.jobId}
                id={job.jobId}
                company={job.companyName || "Unknown Company"}
                location={job.location?.province || "Unknown Location"}
                title={job.jobTitle || "Unknown Title"}
                type={job.jobType?.toUpperCase() || "FULL-TIME"}
                salary={
                  job.minSalary && job.maxSalary
                    ? `$${job.minSalary} - $${job.maxSalary}`
                    : "Negotiate"
                }
                urgent={job.isRemote} // fix sau
                logo={job.avatarCompany}
              />
            ))}
          </div>
        )}
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
