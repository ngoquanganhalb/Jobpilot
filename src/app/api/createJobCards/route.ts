// JobCardUploader.ts
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../services/firebase";

type JobFormData = {
  company: string;
  location: string;
  title: string;
  type: string;
  salary: string;
  urgent: boolean;
  logo: string; // base64 string
};

export const createJobCard = async (jobData: JobFormData) => {
  const fullData = {
    ...jobData,
    createdAt: Timestamp.now(),
  };

  try {
    const docRef = await addDoc(collection(db, "jobCards"), fullData);
    console.log("JobCard added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding jobCard: ", error);
  }
};



// // JobCardUploader.js
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../../../services/firebase";
// import { Timestamp } from "firebase/firestore";
// export const createJobCard = async () => {
//   const jobData = {
//     company: "A Inc.",
//     location: "Dhaka, Bangladesh",
//     title: "Technical Support Specialist",
//     type: "Part-time",
//     salary: "Salary: $20,000 - $25,000",
//     urgent: true, 
//     logo:,
//     createdAt: Timestamp.now(),
//   };
//   try {
//     const docRef = await addDoc(collection(db, "jobCards"), jobData);
//     console.log("JobCard added with ID: ", docRef.id);
//     return docRef.id;
//   } catch (error) {
//     console.error("Error adding jobCard: ", error);
//   }
// };
