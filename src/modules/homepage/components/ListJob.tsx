import ArrowIcon from "@component/components/icons/ArrowIcon";
import Button from "@component/components/ui/Button";
import JobBox from "@component/components/ui/JobBox";
import { useEffect, useState } from "react";
import { firestore } from "../../../services/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { JobBoxType } from "@component/types/types";

export default function ListJob() {
  const [jobs, setJobs] = useState<JobBoxType[]>([]);

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

  return (
    <div className="flex flex-col gap-[50px]  md:px-[100px] md:py-[80px] lg:px-[150px] lg:py-[100px]">
      <div className="flex justify-center flex-wrap items-center gap-4">
        <div className="text-[28px] md:text-[40px] font-medium leading-[38px] md:leading-[48px]">
          Featured job
        </div>
        <Button className="ml-auto gap-3" variant="secondary">
          <div>See All</div>
          <ArrowIcon />
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 ">
          {jobs.map((job) => (
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
    </div>
  );
}
