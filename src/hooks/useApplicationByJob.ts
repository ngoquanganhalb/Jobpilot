// // hooks/useApplicationsByJob.ts
// import { useEffect, useState } from "react";
// import { db } from "@/services/firebase/firebase";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import { Application } from "@/types/Application";

// export function useApplicationsByJob(jobId: string) {
//   const [applications, setApplications] = useState<Application[]>([]);

//   useEffect(() => {
//     const q = query(collection(db, "applications"), where("jobId", "==", jobId));
//     const unsub = onSnapshot(q, (snapshot) => {
//       setApplications(snapshot.docs.map((doc) => ({ ...(doc.data() as Application), id: doc.id })));
//     });

//     return () => unsub();
//   }, [jobId]);

//   return applications;
// }
