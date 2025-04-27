// import { useState, useEffect } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { firestore } from "../services/firebase/firebase";
// import { JobBoxType } from "@types";

// export const useSearchJobs = (searchTerm: string) => {
//   const [jobs, setJobs] = useState<JobBoxType[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       setLoading(true);
//       const jobsRef = collection(firestore, "jobs");
//       const snapshot = await getDocs(jobsRef);
//       const allJobs = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           company: data.companyName || "",
//           location: data.location || "Viet Nam",
//           title: data.jobTitle || "",
//           type: data.type || "Full-time",
//           salary:
//             data.minSalary && data.maxSalary
//               ? `$${data.minSalary} - $${data.maxSalary}`
//               : "Negotiable",
//           urgent: data.isRemote || false,
//           logo: data.avatarCompany || "",
//         };
//       });

//       const filteredJobs = allJobs.filter((job) => {
//         const lowerTerm = searchTerm.toLowerCase();
//         return (
//           job.title.toLowerCase().includes(lowerTerm) ||
//           job.company.toLowerCase().includes(lowerTerm) ||
//           job.location.toLowerCase().includes(lowerTerm)
//         );
//       });

//       setJobs(filteredJobs);
//       setLoading(false);
//     };

//     if (searchTerm.trim() !== "") {
//       fetchJobs();
//     } else {
//       setJobs([]);
//     }
//   }, [searchTerm]);

//   return { jobs, loading };
// };
