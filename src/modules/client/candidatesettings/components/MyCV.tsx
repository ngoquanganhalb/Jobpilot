"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@component/ui/Button";
import { Input } from "@component/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileIcon,
  UploadIcon,
  X,
  MoreVertical,
  Trash2,
  Eye,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

// Import the upload function
import { uploadToCloudinary } from "@utils/uploadToCloundinary";
import { db } from "@services/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface CV {
  id: string;
  name: string;
  url: string;
  size: number;
  fileType: string;
  uploadDate: Date;
}

export default function MyCV() {
  const [isOpen, setIsOpen] = useState(false);
  const [cvName, setCvName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  useEffect(() => {
    // Fetch  CVs
    const fetchCVs = async () => {
      if (!user?.uid) return;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists() && userDoc.data().cvs) {
        setCvs(userDoc.data().cvs);
      }
    };

    fetchCVs();
  }, [user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    // Check if file is PDF and size is less than 12MB
    if (file.type === "application/pdf" && file.size <= 12 * 1024 * 1024) {
      setSelectedFile(file);
      // Auto-set name from filename without extension
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setCvName(fileName);
    } else {
      alert("Please upload a PDF file less than 12MB");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user?.uid || !cvName) return;

    try {
      setIsUploading(true);

      const url = await uploadToCloudinary(selectedFile);

      // Create new CV object
      const newCV: CV = {
        id: Date.now().toString(),
        name: cvName,
        url,
        size: selectedFile.size,
        fileType: selectedFile.type,
        uploadDate: new Date(),
      };

      // Update db
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        cvs: arrayUnion(newCV),
      });

      setCvs((prevCvs) => [...prevCvs, newCV]);

      setSelectedFile(null);
      setCvName("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error uploading CV:", error);
      alert("Failed to upload CV. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!user?.uid) return;

    try {
      const filteredCvs = cvs.filter((cv) => cv.id !== cvId);

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        cvs: filteredCvs,
      });

      setCvs(filteredCvs);
    } catch (error) {
      console.error("Error deleting CV:", error);
      alert("Failed to delete CV. Please try again.");
    }
  };

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Your CV/Resume</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cvs.map((cv) => (
          <Card key={cv.id} className="bg-gray-50">
            <CardContent className="p-4 flex items-center">
              <div className="mr-2">
                <FileIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-sm truncate">{cv.name}</p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(cv.size)}
                </p>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-48 p-1 space-y-1 cursor-pointer">
                  <a
                    href={cv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View CV
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex justify-start text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={() => handleDelete(cv.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        ))}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 h-32 cursor-pointer hover:bg-gray-50">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UploadIcon className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 text-sm font-medium">Add CV/Resume</p>
              <p className="text-xs text-gray-500">
                Browse file or drop here, only pdf
              </p>
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add CV/Resume</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">CV/Resume Name</label>
                <Input
                  value={cvName}
                  onChange={(e) => setCvName(e.target.value)}
                  placeholder="Enter name for your CV/Resume"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">
                  Upload your CV/Resume
                </label>
                <div
                  className={`mt-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 h-32 cursor-pointer ${
                    dragActive ? "border-blue-500 bg-blue-50" : ""
                  } ${selectedFile ? "bg-blue-50" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />

                  {selectedFile ? (
                    <div className="flex items-center">
                      <FileIcon className="h-6 w-6 text-blue-500" />
                      <span className="ml-2 text-sm truncate max-w-xs">
                        {selectedFile.name}
                      </span>
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Browse File or drop here
                      </p>
                      <p className="text-xs text-gray-400">
                        Only PDF format available. Max file size 12 MB.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={!selectedFile || !cvName || isUploading}
              >
                {isUploading ? "Uploading..." : "Add CV/Resume"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
