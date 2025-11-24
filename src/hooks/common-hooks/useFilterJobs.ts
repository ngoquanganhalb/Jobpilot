import { FilterState } from "@redux/slices/filterSlice";
import { Job } from "../../types/db";

type UseFilterJobsProp = {
  jobs: Job[];
  keyword: string;
  location: string;
  filter: FilterState;
};

export function useFilterJobs({
  jobs,
  keyword,
  location,
  filter,
}: UseFilterJobsProp) {
  return jobs.filter((job) => {
    const keywordMatch =
      keyword === "" ||
      (job.jobTitle?.toLowerCase().includes(keyword.toLowerCase()) ?? false) ||
      job.companyName.toLowerCase().includes(keyword.toLowerCase());

    const locationMatch =
      location === "" ||
      job.location?.province?.toLowerCase().includes(location.toLowerCase()) ||
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
}
