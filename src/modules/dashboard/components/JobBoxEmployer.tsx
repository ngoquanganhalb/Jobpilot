"use client";

import { JobPosting } from "@types";
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { MdGroups, MdCancel } from "react-icons/md";
import { BsThreeDots, BsFillEyeFill } from "react-icons/bs";
import { GrUpgrade } from "react-icons/gr";
import { MdDeleteForever } from "react-icons/md";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { toast } from "react-toastify";

type JobItemProps = {
  job: JobPosting;
  jobActionDropdown: number | null;
  toggleJobActionDropdown: (jobId: number) => void;
};

export default function JobBoxEmployer({
  job,
  toggleJobActionDropdown,
}: JobItemProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const expiryText =
    job.timeRemaining ??
    (job.expiryDate instanceof Date
      ? job.expiryDate.toLocaleDateString("en-GB")
      : typeof job.expiryDate === "string"
      ? job.expiryDate
      : "No expiry date");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        toggleJobActionDropdown(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [toggleJobActionDropdown]);

  const markJobAsExpired = async (jobId: string) => {
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        status: "Expire",
      });
      toast.success("Job marked as expired!");
      // location.reload();
    } catch (error) {
      toast.error("Failed to mark job as expired.");
    }
  };

  const deleteJob = async (jobId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));
      toast.success("Job deleted successfully!");
      // location.reload();
    } catch (error) {
      toast.error("Failed to delete job.");
    }
  };

  return (
    <>
      {/* Desktop */}
      <Card
        className={`hidden md:grid grid-cols-12 items-center py-4 px-6 transition-all duration-75 rounded-2xl shadow-sm border hover:border-blue-500 ${
          job.urgent ? "bg-urgent" : ""
        }`}
      >
        <div className="col-span-4">
          <h3 className="font-medium text-gray-800 text-lg">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {job.type} • {expiryText}
          </p>
        </div>

        <div className="col-span-3">
          {job.status === "Active" ? (
            <div className="flex items-center text-green-600">
              <BiCheckCircle className="mr-1" /> Active
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <BiXCircle className="mr-1" /> Expired
            </div>
          )}
        </div>

        <div className="col-span-3 flex items-center">
          <MdGroups className="w-6 h-6 mr-2 text-gray-500" />
          <span className="text-gray-500 text-sm">
            {job.applications} Applications
          </span>
        </div>

        <div
          className="col-span-2 flex justify-end gap-2 items-center"
          ref={dropdownRef}
        >
          <Button variant="link" className="text-blue-600 px-0">
            View Applications
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <BsThreeDots className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <GrUpgrade className="h-4 w-4 mr-2 text-blue-600" /> Promote Job
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BsFillEyeFill className="h-4 w-4 mr-2 text-green-500" /> View
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => markJobAsExpired(job.id)}>
                <MdCancel className="h-4 w-4 mr-2 text-red-500" /> Mark as
                expired
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => deleteJob(job.id)}>
                <MdDeleteForever className="h-4 w-4 mr-2 text-red-500" /> Delete
                Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Mobile */}
      <Card className="md:hidden p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {job.title}
        </h3>
        <p className="text-sm text-gray-500">
          {job.type} • {expiryText}
        </p>
        <p className="text-sm mt-2">
          <strong>Status:</strong>{" "}
          <span
            className={
              job.status === "Active" ? "text-green-600" : "text-red-500"
            }
          >
            {job.status}
          </span>
        </p>
        <p className="text-sm">
          <strong>Applications:</strong> {job.applications}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <Button variant="link" className="text-blue-600 px-0 text-sm">
            View Applications
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <BsThreeDots className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <GrUpgrade className="h-4 w-4 mr-2 text-blue-600" /> Promote Job
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BsFillEyeFill className="h-4 w-4 mr-2 text-green-500" /> View
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MdCancel className="h-4 w-4 mr-2 text-red-500" /> Mark as
                expired
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </>
  );
}
