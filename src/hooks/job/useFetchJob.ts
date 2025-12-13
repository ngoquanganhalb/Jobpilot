import { RootState } from "@redux/store";
import { db } from "@services/firebase/firebase";
import { Job } from "../../types/db";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

const fetchJobs = async (userId: number) => {
  const q = query(
    collection(db, "jobs"),
    where("employerId", "==", userId),
    where("paymentStatus", "in", ["SUCCESS"]),
    orderBy("createdAt", "desc")
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
      applicants: data.applicants,
      createdAt: data.createdAt?.toDate() || new Date(0),
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
  return jobs;
  // setMyJobs(jobs);
};

export const useFetchJob = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["FETCH_JOBS", user?.id],
    queryFn: () => fetchJobs(user!.id),
    enabled: Boolean(user?.id),
  });

  return { data, isLoading, isError };
};
