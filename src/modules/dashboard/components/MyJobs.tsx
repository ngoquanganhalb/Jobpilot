/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@services/firebase/firebase";
import { getAuth } from "firebase/auth";
import JobBoxEmployer from "./JobBoxEmployer";
import { JobPosting } from "@types";
import Spinner from "@component/ui/Spinner";

export default function MyJobs() {
  const [jobActionDropdown, setJobActionDropdown] = useState<number | null>(
    null
  );
  const [myJobs, setMyJobs] = useState<JobPosting[]>([]);
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

        const jobs: JobPosting[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.jobTitle || "",
            type: data.jobType || "Unknown",
            expiryDate: data.expirationDate?.toDate() || null,
            urgent: data.isRemote || false,
            status: data.status || "Active",
            applications: Array.isArray(data.applicants)
              ? data.applicants.length
              : 0,
          };
        });

        setMyJobs(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [myJobs]);

  const toggleJobActionDropdown = (jobId: number) => {
    setJobActionDropdown(jobActionDropdown === jobId ? null : jobId);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">My Posted Jobs</h2>

      {loading ? (
        <Spinner />
      ) : myJobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <ul className="space-y-4">
          {myJobs.map((job) => (
            <JobBoxEmployer
              key={job.id}
              job={job}
              jobActionDropdown={jobActionDropdown}
              toggleJobActionDropdown={toggleJobActionDropdown}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
