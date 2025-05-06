"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@services/firebase/firebase";
import { Application, Job, ApplicationWithJob } from "../../../../types/db";
import JobBoxCandidate from "@component/ui/JobBoxCandidate";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-toastify";
import Paths from "@/constants/paths";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";

export default function List() {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const MySwal = withReactContent(Swal);

  const handleDelete = async (applicationId: string) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const applicationRef = doc(db, "applications", applicationId);
          await updateDoc(applicationRef, {
            showCandidate: false,
          });
          Swal.fire({
            title: "Deleted!",
            text: "Your application has been deleted.",
            icon: "success",
          });

          // render immediately
          setApplications((prev) =>
            prev.filter((app) => app.id !== applicationId)
          );
        } catch (error) {
          console.error("Error updating application:", error);
          toast.error("Failed to delete application");
        }
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return;

      const q = query(
        collection(db, "applications"),
        where("candidateId", "==", user.uid),
        where("showCandidate", "==", true),
        orderBy("appliedAt", "desc")
      );

      const snapshot = await getDocs(q);

      const results: ApplicationWithJob[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as Application;

          const jobSnap = await getDoc(doc(db, "jobs", data.jobId));
          const jobData = jobSnap.exists()
            ? (jobSnap.data() as Job)
            : undefined;

          return {
            ...data,
            id: docSnap.id,
            appliedAt: data.appliedAt.toDate?.() ?? new Date(),
            job: jobData,
          };
        })
      );

      setApplications(results);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mt-6  ">
      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Your Recent Applications
        </h2>
        <Link
          href={Paths.DASHBOARD_APPLIEDJOB}
          className="text-blue-600 flex items-center"
        >
          View all <BsArrowRight className="ml-1" />
        </Link>
      </div>
      <div className="grid grid-cols-12 bg-gray-50 py-3 px-4 rounded-t-md border-b border-gray-200 mt-5">
        <div className="col-span-5 text-sm font-medium text-gray-600">JOBS</div>
        <div className="col-span-2 text-sm font-medium text-gray-600">
          DATE APPLIED
        </div>
        <div className="col-span-2 text-sm font-medium text-gray-600 text-center">
          STATUS
        </div>
        <div className="col-span-3 text-sm font-medium text-gray-600 text-center">
          ACTION
        </div>
      </div>

      <div className="space-y-3">
        {applications.slice(0, 5).map((app) => (
          <JobBoxCandidate
            key={app.id}
            application={app}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
