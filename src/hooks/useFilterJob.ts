import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@services/firebase/firebase";
import { FilterFormValues, JobBoxType } from "@types";

export function useFilterJob(filters: FilterFormValues) {
  const [jobs, setJobs] = useState<JobBoxType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const jobRef = collection(db, "jobs");

        const constraints = [];

        if (filters.location)
          constraints.push(where("location", "==", filters.location));
        if (filters.isRemote)
          constraints.push(where("isRemote", "==", true));
        if (filters.minSalary !== undefined)
          constraints.push(where("salary", ">=", filters.minSalary));
        if (filters.maxSalary !== undefined)
          constraints.push(where("salary", "<=", filters.maxSalary));
        if (filters.jobTypes?.length)
          constraints.push(where("jobType", "in", filters.jobTypes));
        if (filters.tags?.length)
          constraints.push(where("tags", "array-contains-any", filters.tags));

        const q = query(jobRef, ...constraints);
        const snapshot = await getDocs(q);

        const allJobs = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            company: data.companyName || "",
            location: data.location || "Viet Nam",
            title: data.jobTitle || "",
            type: data.type || "Full-time",
            salary:
              data.minSalary && data.maxSalary
                ? `$${data.minSalary} - $${data.maxSalary}`
                : "Negotiable",
            urgent: data.isRemote || false,
            logo: data.avatarCompany || "",
          };
        });

        setJobs(allJobs);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [JSON.stringify(filters)]); // dùng string để tránh object ref issue

  return { jobs, loading };
}
