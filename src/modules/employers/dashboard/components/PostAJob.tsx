"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  collection,
  addDoc,
  Timestamp,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@services/firebase/firebase";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
// import { FaChevronDown } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { cn } from "@component/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { toBase64 } from "@lib/convertBase64";
import { Job, JobType, JOB_TAG_OPTIONS } from "../../../../types/db";

// function JobBenefitTag({
//   children,
//   active = false,
// }: {
//   children: React.ReactNode;
//   active?: boolean;
// }) {
//   return (
//     <div
//       className={cn(
//         "px-3 py-1.5 text-sm rounded-md border",
//         active
//           ? "bg-blue-50 border-blue-300 text-blue-600"
//           : "border-gray-200 text-gray-600"
//       )}
//     >
//       {children}
//     </div>
//   );
// }

// function SelectDropdown({ placeholder }: { placeholder: string }) {
//   return (
//     <Select>
//       <SelectTrigger className="w-full">
//         <SelectValue placeholder={placeholder} />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="option1">Option 1</SelectItem>
//         <SelectItem value="option2">Option 2</SelectItem>
//         <SelectItem value="option3">Option 3</SelectItem>
//       </SelectContent>
//     </Select>
//   );
// }

export default function PostAJob() {
  const initialJobState: Job = {
    jobId: "",
    employerId: "",
    jobTitle: "",
    tags: [],
    minSalary: 0,
    maxSalary: 0,
    description: "",
    jobType: "full-time",
    avatarCompany: "",
    companyName: "",
    urgent: false,
    location: "Viet Nam",
    isRemote: true,
    expirationDate: new Date(),
    applicants: [],
    status: "Active",
  };
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Job>(initialJobState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file); // lưu file để convert sau
      const previewURL = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        avatarCompany: previewURL, // hiển thị preview ảnh
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      { name: "jobTitle", label: "Job Title" },
      { name: "type", label: "Job Type" },
      { name: "minSalary", label: "Min Salary" },
      { name: "maxSalary", label: "Max Salary" },
      { name: "description", label: "Description" },
      { name: "expirationDate", label: "Expiration Date" },
    ];

    for (const field of requiredFields) {
      const value = formData[field.name as keyof typeof formData];
      if (
        value === "" ||
        value === null ||
        (typeof value === "object" &&
          value instanceof Date &&
          isNaN(value.getTime()))
      ) {
        toast.error(`${field.label} is required.`);
        return;
      }
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("You must be logged in to post a job.");
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        toast.error("User profile not found.");
        return;
      }

      const userData = userSnapshot.data();
      const name = userData.name || "Unknown Company";
      let base64Logo = "";
      if (logoFile) {
        base64Logo = await toBase64(logoFile);
      }

      const jobData: Job = {
        jobId: "",
        employerId: user.uid,
        jobTitle: formData.jobTitle,
        tags: formData.tags,
        minSalary: Number(formData.minSalary) || 0,
        maxSalary: Number(formData.maxSalary) || 0,
        description: formData.description,
        jobType: (formData.jobType || "full-time").toLowerCase() as JobType,
        avatarCompany: base64Logo,
        companyName: name,
        urgent: false, //cus
        location: "London",
        isRemote: formData.isRemote,
        expirationDate: formData.expirationDate,
        applicants: [],
        status: "Active",
      };

      const docRef = await addDoc(collection(db, "jobs"), {
        ...jobData,
        createdAt: Timestamp.now(),
      });

      // them jobid
      await updateDoc(doc(db, "jobs", docRef.id), {
        jobId: docRef.id,
      });

      // const docRef = await addDoc(collection(db, "jobs"), {
      //   ...jobData,
      //   createdAt: Timestamp.now(),
      // });

      // // update jobId = docRef.id
      // await addDoc(collection(db, "jobs"), {
      //   ...jobData,
      //   jobId: docRef.id,
      //   createdAt: Timestamp.now(),
      // });

      toast.success("Created job!");

      setFormData(initialJobState);
      setLogoFile(null);
    } catch (error) {
      console.error("Error uploading job:", error);
      toast.error("An error occurred while posting the job.");
    }
  };

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Post a Job</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-6 ">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Type
            </label>
            <Select
              value={formData.jobType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, jobType: value as JobType }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* avatar */}
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Company Avatar
            </label>
            {/* <Input
              type="file"
              name="avatarCompany"
              accept="image/*"
              onChange={handleFileChange}
              className="focus:ring-2 focus:ring-blue-500 border-gray-300 rounded-md"
            />
            <Upload size={16} /> */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Upload Image
              </Button>

              <input
                id="avatar-upload"
                type="file"
                name="avatarCompany"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {formData.avatarCompany && (
              <Image
                src={formData.avatarCompany}
                alt="Company Avatar Preview"
                width={80}
                height={80}
                className="mt-2 rounded-full border border-gray-300 shadow-sm object-cover"
              />
            )}
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Job Title
          </label>
          <Input
            className="focus:ring-2 focus:ring-blue-500 border-gray-300 rounded-md"
            name="jobTitle"
            placeholder="Add job title, role, vacancies etc."
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>

        {/* Tags*/}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tags
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                {(formData.tags ?? []).length > 0
                  ? (formData.tags ?? []).join(", ")
                  : "Select job tags"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-4 max-h-[300px] overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {JOB_TAG_OPTIONS.map((tag) => {
                  const isSelected = (formData.tags ?? []).includes(tag);
                  return (
                    <Button
                      key={tag}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tags: isSelected
                            ? (prev.tags ?? []).filter((t) => t !== tag)
                            : [...(prev.tags ?? []), tag],
                        }))
                      }
                      className="text-sm rounded-full"
                    >
                      {tag}
                    </Button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Salary */}
        <div>
          <h2 className="text-base font-medium text-gray-800 mb-2">Salary</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">
                Min Salary
              </label>
              <div className="flex">
                <Input
                  name="minSalary"
                  placeholder="Minimum salary"
                  value={formData.minSalary}
                  onChange={handleChange}
                  className="rounded-r-none"
                />
                <span className="px-3 py-2.5 pb-1.5 border border-l-0 border-gray-200 rounded-r-md text-gray-500 bg-gray-50 text-sm flex items-center">
                  USD
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs text-gray-500 mb-1">
                Max Salary
              </label>
              <div className="flex">
                <Input
                  name="maxSalary"
                  placeholder="Maximum salary"
                  value={formData.maxSalary}
                  onChange={handleChange}
                  className="rounded-r-none"
                />
                <span className="px-3 py-2.5 pb-1.5 border border-l-0 border-gray-200 rounded-r-md text-gray-500 bg-gray-50 text-sm flex items-center">
                  USD
                </span>
              </div>
            </div>
            {/* <div className="w-full md:w-1/3">
              <label className="block text-xs text-gray-500 mb-1">
                Salary Type
              </label>
              <SelectDropdown placeholder="Select Type" />
            </div> */}
          </div>
        </div>

        {/* Expiration Date */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Expiration Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between",
                  !formData.expirationDate && "text-muted-foreground"
                )}
              >
                {formData.expirationDate
                  ? format(formData.expirationDate, "PPP")
                  : "Pick a date"}
                <FaCalendarAlt className="ml-2 h-4 w-4 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.expirationDate}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    expirationDate: date || new Date(),
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Remote Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isRemote"
            checked={formData.isRemote}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isRemote: !!checked }))
            }
          />
          <label htmlFor="isRemote" className="text-sm text-gray-700">
            Fully Remote Position - Worldwide
          </label>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <Textarea
            name="description"
            placeholder="Add your job description..."
            className="min-h-[200px]"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Job Benefits */}
        {/* <div>
          <h2 className="text-base font-medium text-gray-800 mb-3">
            Job Benefits
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "401K Salary",
              "Distributed Team",
              "Vision Insurance",
              "Async",
              "Medical Insurance",
              "Company retreats",
              "Unlimited vacation",
            ].map((benefit, index) => (
              <JobBenefitTag key={index} active={index === 0}>
                {benefit}
              </JobBenefitTag>
            ))}
          </div>
        </div> */}

        {/* Submit */}
        <div className="flex justify-end">
          <Button className="cursor-pointer" type="submit">
            Post Job
          </Button>
        </div>
      </form>
    </div>
  );
}
