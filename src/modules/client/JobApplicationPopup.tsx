import { useState, useRef, useEffect } from "react";
import { Upload, ArrowRight } from "lucide-react";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  where,
  query,
  doc,
  arrayUnion,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/services/firebase/firebase";
import { uploadToCloudinary } from "@utils/uploadToCloundinary";
import { toast } from "react-toastify";
import { Button } from "@component/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@component/ui/select";

interface JobApplicationFormProps {
  jobTitle: string;
  jobId: string;
  candidateId: string;
  isOpen: boolean;
  onClose: () => void;
  onApplied: () => void;
  onSubmit?: () => void;
}

type FormData = {
  resume: File | null;
  resumeName: string;
  coverLetter: string;
};

export default function JobApplicationPopup({
  jobTitle,
  jobId,
  candidateId,
  isOpen,
  onClose,
  onApplied,
}: JobApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    resume: null,
    resumeName: "",
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cvOptions, setCvOptions] = useState<any[]>([]);
  const [selectedCVUrl, setSelectedCVUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const userId = candidateId; // hoặc auth.currentUser?.uid
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCvOptions(data.cvs || []);
        }
      } catch (error) {
        console.error("Error fetching CVs:", error);
      }
    };

    if (isOpen) fetchCVs();
  }, [isOpen, candidateId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        resume: e.target.files[0],
        resumeName: e.target.files[0].name,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resume && !selectedCVUrl) {
      toast.error("Please upload your resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check application if had applied once
      const applicationsRef = collection(firestore, "applications");
      const checkQuery = query(
        applicationsRef,
        where("jobId", "==", jobId),
        where("candidateId", "==", candidateId)
      );
      const checkSnapshot = await getDocs(checkQuery);

      if (!checkSnapshot.empty) {
        toast.error("You have already applied for this job.");
        setIsSubmitting(false);
        return;
      }

      const resumeUrl = selectedCVUrl
        ? selectedCVUrl
        : await uploadToCloudinary(formData.resume!);
      // console.log(" 1. Upload resume lên Cloudinary:", resumeUrl);

      await addDoc(applicationsRef, {
        jobId,
        candidateId,
        appliedAt: Timestamp.now(),
        status: "pending",
        resumeUrl,
        note: formData.coverLetter,
        showCandidate: true,
        showEmployer: true,
        feedback: "",
      });

      // Update applicants[] in jobs
      const jobsRef = collection(firestore, "jobs");
      const jobQuery = query(jobsRef, where("jobId", "==", jobId));
      const jobSnapshot = await getDocs(jobQuery);

      if (!jobSnapshot.empty) {
        const jobDoc = jobSnapshot.docs[0];
        const jobDocRef = doc(firestore, "jobs", jobDoc.id);

        await updateDoc(jobDocRef, {
          applicants: arrayUnion(candidateId),
        });
      } else {
        console.error("Job not found!");
      }

      // console.log("2. Ghi vào Firestore");

      toast.success("Application submitted successfully!");
      onApplied();
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to apply. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="p-0 bg-white rounded-lg w-full max-w-md mx-auto">
        <DialogTitle> </DialogTitle>

        <Card className="border-0 shadow-none">
          <CardHeader className="pb-2 relative">
            <CardTitle className="text-xl font-semibold">
              Apply Job: {jobTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 ">
                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Choose Resume
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Upload size={16} />
                      Upload Resume
                    </Button>
                    {formData.resumeName && (
                      <span className="ml-2 text-sm text-gray-600 truncate max-w-xs">
                        {formData.resumeName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX
                  </p>
                </div>

                {cvOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      (Or Choose Existing Resume)
                    </label>
                    <Select
                      onValueChange={(selectedId) => {
                        const selected = cvOptions.find(
                          (cv) => cv.id === selectedId
                        );
                        if (selected) {
                          setFormData({
                            ...formData,
                            resume: null, // vì đang dùng URL chứ không phải File
                            resumeName: selected.name,
                          });
                          // Save URL để dùng submit
                          setSelectedCVUrl(selected.url);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full cursor-pointer">
                        <SelectValue placeholder="Select a saved CV" />
                      </SelectTrigger>
                      <SelectContent>
                        {cvOptions.map((cv) => (
                          <SelectItem key={cv.id} value={cv.id}>
                            {cv.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cover Letter
                  </label>
                  <Textarea
                    placeholder="Write down your biography here. Let the employers know who you are..."
                    className="resize-none min-h-32"
                    value={formData.coverLetter}
                    onChange={(e) =>
                      setFormData({ ...formData, coverLetter: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Apply Now"}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
