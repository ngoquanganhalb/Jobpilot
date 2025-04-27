//dung bth, dung o trong jobApplicationPopUp
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { collection, addDoc, Timestamp } from "firebase/firestore";
// import { storage, firestore } from "@/services/firebase/firebase";

// type FormDataApplyJob = {
//   jobId: string;
//   candidateId: string;
//   resume: File | null;
//   resumeName: string;
//   coverLetter: string;
// };

// const createApplication = async (formData: FormDataApplyJob) => {
//   try {
//     const userId = "CANDIDATE_ID";
//     const jobId = "JOB_ID";

//     let resumeUrl = "";

//     if (formData.resume) {
//       const storageRef = ref(
//         storage,
//         `resumes/${Date.now()}_${formData.resume.name}`
//       );
//       const snapshot = await uploadBytes(storageRef, formData.resume);
//       resumeUrl = await getDownloadURL(snapshot.ref);
//     }

//     await addDoc(collection(firestore, "applications"), {
//       jobId,
//       candidateId: userId,
//       appliedAt: Timestamp.now(),
//       status: "pending",
//       resumeUrl,
//       note: formData.coverLetter,
//       showCandidate: true,
//       showEmployer: true,
//     });

//     alert("Application submitted successfully!");
//   } catch (error) {
//     console.error("Error submitting application:", error);
//     alert("Failed to apply. Please try again.");
//   }
// };
