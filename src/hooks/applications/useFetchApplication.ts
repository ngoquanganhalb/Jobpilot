import { db } from "@services/firebase/firebase";
import { Application } from "../../types/db";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";

const fetchApplications = async (jobId: string) => {
  const applicationsRef = collection(db, "applications");
  const q = query(
    applicationsRef,
    where("jobId", "==", jobId),
    where("showEmployer", "==", true)
  );
  const querySnapshot = await getDocs(q);

  const apps: Omit<Application, "name" | "avatar">[] = [];

  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();

    apps.push({
      id: docSnap.id,
      jobId: data.jobId,
      candidateId: data.candidateId,
      // name: candidateProfile.name,
      // avatar: candidateProfile.avatar,
      appliedAt: data.appliedAt.toDate(),
      status: data.status,
      resumeUrl: data.resumeUrl,
      note: data.note,
      showEmployer: data.showEmployer,
      showCandidate: data.showCandidate,
      feedback: data.feedback,
    });
  }
  return apps;
};

export const useFetchApplication = (
  jobId: string
): { data?: Omit<Application, "name" | "avatar">[]; isLoading: boolean } => {
  const { data, isLoading } = useQuery({
    queryKey: ["USE_FETCH_APPLICATION", jobId],
    queryFn: () => fetchApplications(jobId),
    enabled: Boolean(jobId),
  });
  return { data, isLoading };
};
