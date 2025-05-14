/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@services/firebase/firebase";
import { Job } from "../../../../types/db";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BsBriefcase, BsArrowRight, BsClipboardData } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import JobBoxEmployer from "./JobBoxEmployer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { setJobs } from "@redux/slices/jobSlice";
import Spinner from "@component/ui/Spinner";
import Paths from "@/constants/paths";
export default function OverviewEmployer() {
  const [jobActionDropdown, setJobActionDropdown] = useState<number | null>(
    null
  );
  const user = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  //fetch job with timestamp
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
            createdAt: data.createdAt?.toDate() || new Date(0),
            applicants: data.applicants,
            location: data.location,
            avatarCompany: data.avatarCompany,
            minSalary: data.minSalary,
            maxSalary: data.maxSalary,
            jobType: data.jobType,
            tags: data.tags,
            description: data.description,
            isRemote: data.isRemote,
          };
        });

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
    <div className="flex-1 mt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-medium mb-1">
          Hello, {user.name || "my friend"}
        </h1>
        <p className="text-gray-600">
          Here is your daily activities and applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-[65%] ">
        <div className="bg-blue-50 rounded-lg p-6 flex justify-between items-center shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)]">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{jobs.length}</h2>
            <p className="text-gray-600">Jobs Posted</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <BsBriefcase className="text-blue-600 text-xl" />
          </div>
        </div>
        {/* <div className="bg-yellow-50 rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">21</h2>
            <p className="text-gray-600">Saved Candidates</p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <FiUser className="text-yellow-500 text-xl" />
          </div>
        </div> */}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_-6px_12px_rgba(0,0,0,0.06),_0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 ">
            <BsClipboardData className="text-blue-600" />
            Recently Posted Jobs
          </h2>
          <Link
            href={Paths.DASHBOARD_MYJOB}
            className="text-blue-600 flex items-center hover:underline text-sm"
          >
            View all <BsArrowRight className="ml-1" />
          </Link>
        </div>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 bg-gray-100 py-3 px-6 text-base font-semibold text-gray-600 border-b border-gray-300">
          <div className="col-span-5">Job</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Applications</div>
          <div className="col-span-2">Actions</div>
        </div>

        {loading ? (
          <Spinner />
        ) : jobs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
            <p>Looks like you have not posted any jobs yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {[...jobs]
              .sort((a, b) => {
                const timeA =
                  a.createdAt instanceof Date
                    ? a.createdAt.getTime()
                    : a.createdAt?.toDate().getTime() ?? 0;
                const timeB =
                  b.createdAt instanceof Date
                    ? b.createdAt.getTime()
                    : b.createdAt?.toDate().getTime() ?? 0;
                return timeB - timeA;
              })
              .slice(0, 5)
              .map((job) => (
                <JobBoxEmployer
                  key={job.jobId}
                  job={job}
                  jobActionDropdown={jobActionDropdown}
                  toggleJobActionDropdown={toggleJobActionDropdown}
                />
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
