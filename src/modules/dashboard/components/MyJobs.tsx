/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@services/firebase/firebase";
import { getAuth } from "firebase/auth";
import JobBoxEmployer from "./JobBoxEmployer";
import Spinner from "@component/ui/Spinner";
import { Job } from "../../../types/db";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setJobs } from "@redux/slices/jobSlice";

export default function MyJobs() {
  const [jobActionDropdown, setJobActionDropdown] = useState<number | null>(
    null
  );
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  // const [myJobs, setMyJobs] = useState<Job[]>([]); //fetch cho mang job Job[]
  const [loading, setLoading] = useState(true);
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
            applications: Array.isArray(data.applicants)
              ? data.applicants.length
              : 0,
            createdAt: data.createdAt?.toDate() || new Date(0),
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

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">My Posted Jobs</h2>

      {loading ? (
        <Spinner />
      ) : (
        <ul className="space-y-4">
          {[...jobs] //tao ban copy do jobs.sort() anh huong redux state
            .sort((a, b) => {
              const timeA = a.createdAt?.getTime() ?? 0;
              const timeB = b.createdAt?.getTime() ?? 0;
              return timeB - timeA;
            })
            .map((job) => (
              <JobBoxEmployer
                key={job.jobId}
                job={job}
                jobActionDropdown={jobActionDropdown}
                toggleJobActionDropdown={toggleJobActionDropdown}
                // setMyJobs={setMyJobs} // cap nhat state cho jobbox de xu ly render
              />
            ))}
        </ul>
      )}
    </div>
  );
}
