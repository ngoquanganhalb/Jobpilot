import { useEffect, useState } from "react";
import { firestore } from "../services/firebase/firebase";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import { Job } from "../types/db";

export function useFetchJobBox(limit: number = 15) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsRef = collection(firestore, "jobs");

        // Fetch only jobs with status === "Active"
        const q = query(
          jobsRef,
          where("status", "==", "Active"),
          orderBy("createdAt", "desc")
        );
        

        const snapshot = await getDocs(q);

        const jobsData: Job[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            jobId: doc.id,
            employerId: data.employerId || "",
            jobTitle: data.jobTitle || "",
            companyName: data.companyName || "",
            location: data.location || "Viet Nam",
            jobType: data.jobType || "Full-time",
            minSalary: data.minSalary || 0,
            maxSalary: data.maxSalary || 0,
            description: data.description || "",
            urgent: typeof data.urgent === "boolean" ? data.urgent : false,
            avatarCompany: data.avatarCompany || "",
            isRemote: data.isRemote || false,
            expirationDate: data.expirationDate?.toDate?.() || null,
            applicants: data.applicants || [],
            status: data.status || "open",
            tags: data.tags
          };
        });

        setJobs(jobsData.slice(0, limit));
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  return { jobs, loading, error };
}
