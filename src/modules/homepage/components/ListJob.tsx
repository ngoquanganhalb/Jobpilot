import ArrowIcon from "@component/icons/ArrowIcon";
import Button from "@component/ui/Button";
import JobBox from "@component/ui/JobBox";
import { useEffect, useState } from "react";
import { firestore } from "../../../services/firebase/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { JobBoxType } from "@types";
import Link from "next/link";

export default function ListJob() {
  const [jobs, setJobs] = useState<JobBoxType[]>([]);
  const limit = 15;

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsRef = collection(firestore, "jobCards");
      const q = query(jobsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      let jobsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<JobBoxType, "id">),
      }));
      jobsData = jobsData.slice(0, limit);
      setJobs(jobsData);
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col gap-[50px]  md:px-[100px] md:py-[80px] lg:px-[150px] lg:py-[100px]">
      <div className="flex flex-wrap justify-between">
        <div className="text-[28px] md:text-[40px] font-medium leading-[38px] md:leading-[48px]">
          Featured job
        </div>
        <Link href="find-job">
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
