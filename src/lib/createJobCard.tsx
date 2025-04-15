// JobCardUploader.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebase";
import { Timestamp } from "firebase/firestore";
export const createJobCard = async () => {
  const jobData = {
    company: "Alibaba Inc.",
    location: "Dhaka, Bangladesh",
    title: "Technical Support Specialist",
    type: "Part-time",
    salary: "Salary: $20,000 - $25,000",
    urgent: true,
    createdAt: Timestamp.now(),
  };
  try {
    const docRef = await addDoc(collection(db, "jobCards"), jobData);
    console.log("JobCard added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding jobCard: ", error);
  }
};
