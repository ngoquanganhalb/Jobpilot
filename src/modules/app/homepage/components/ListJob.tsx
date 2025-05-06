import Link from "next/link";
import { useFetchJobBox } from "@hooks/useFetchJobBox";
import ArrowIcon from "@component/icons/ArrowIcon";
import Button from "@component/ui/ButtonCustom";
import JobBox from "@component/ui/JobBox";
import Paths from "@/constants/paths";

export default function ListJob() {
  const { jobs } = useFetchJobBox(15);
  return (
    <div className="flex flex-col gap-[50px] py-12  md:px-[100px] lg:px-[150px] ">
      <div className="flex flex-wrap justify-between">
        <div className="text-2xl font-semibold text-gray-800 mb-1">
          Featured job
        </div>
        <Link href={Paths.FIND_JOB}>
          <Button className="ml-auto gap-3" variant="secondary">
            <div>See All</div>
            <ArrowIcon />
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 ">
          {jobs.map((job) => (
            <JobBox
              key={job.jobId}
              id={job.jobId}
              company={job.companyName ? job.companyName : "Unknowed Company"}
              location={job.location?.province || "Unknown Location"}
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
          ))}
        </div>
      </div>
    </div>
  );
}
