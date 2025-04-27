"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@component/ui/dialog";
import { Input } from "@component/ui/Input";
import { Button } from "@component/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { Job, JOB_TAG_OPTIONS } from "../../../types/db";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { cn } from "@component/lib/utils";
import Image from "next/image";
import Spinner from "@component/ui/Spinner";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateJob } from "@redux/slices/jobSlice";
import { Upload } from "lucide-react";
type Props = {
  open: boolean;
  onClose: () => void;
  job: Job;
};

export default function EditJobPopup({ open, onClose, job }: Props) {
  const [formData, setFormData] = useState<Job | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (job) setFormData(job);
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !formData.jobId) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "jobs", formData.jobId), {
        jobTitle: formData.jobTitle ?? "",
        description: formData.description ?? "",
        minSalary: Number(formData.minSalary) || 0,
        maxSalary: Number(formData.maxSalary) || 0,
        jobType: formData.jobType ?? "full-time",
        expirationDate: formData.expirationDate ?? null,
        isRemote: formData.isRemote ?? false,
        avatarCompany: formData.avatarCompany ?? "",
        tags: formData.tags,
      });
      onClose();
      toast.success("Success update job");
      dispatch(updateJob(formData)); //luu vao state
    } catch (err) {
      console.log(err);
      toast.error("Error updating job:");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev!,
          avatarCompany: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>
        {formData && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex space-x-6 ">
              <div className="flex-1">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Type
                </label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev!, jobType: value as any }))
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
                /> */}
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

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Job Title
              </label>
              <Input
                name="jobTitle"
                placeholder="Add job title, role, vacancies etc."
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>

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
                <PopoverContent className="w-[300px] p-4">
                  <div className="flex flex-wrap gap-2">
                    {JOB_TAG_OPTIONS.map((tag) => {
                      const isSelected = (formData.tags ?? []).includes(tag);
                      return (
                        <Button
                          key={tag}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          onClick={() =>
                            setFormData((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                tags: isSelected
                                  ? (prev.tags ?? []).filter((t) => t !== tag)
                                  : [...(prev.tags ?? []), tag],
                              };
                            })
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

            <div>
              <h2 className="text-base font-medium text-gray-800 mb-2">
                Salary
              </h2>
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
              </div>
            </div>

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
                        ...prev!,
                        expirationDate: date || new Date(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRemote"
                checked={formData.isRemote}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev!, isRemote: !!checked }))
                }
              />
              <label htmlFor="isRemote" className="text-sm text-gray-700">
                Fully Remote Position - Worldwide
              </label>
            </div>

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

            <div className="flex justify-end">
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Submit"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
