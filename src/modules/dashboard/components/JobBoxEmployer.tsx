"use client";

import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { MdGroups, MdCancel } from "react-icons/md";
import { BsThreeDots, BsFillEyeFill, BsFillCircleFill } from "react-icons/bs";
import { GrUpgrade } from "react-icons/gr";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { AiOutlineBell } from "react-icons/ai";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  doc,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
  collection,
  query,
} from "firebase/firestore";
import { db } from "@/services/firebase/firebase";
import { toast } from "react-toastify";
import { useState } from "react";

import { Job } from "../../../types/db";
import EditJobPopup from "./EditJobPopup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { updateJob, deleteJob } from "@redux/slices/jobSlice";
import { useRouter } from "next/navigation";
import Paths from "@/constants/paths";
import Link from "next/link";

type JobItemProps = {
  job: Job;
  jobActionDropdown: number | null;
  toggleJobActionDropdown: (jobId: number) => void;
};

export default function JobBoxEmployer({
  job,
  toggleJobActionDropdown,
}: JobItemProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);

  // const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const dispatch = useDispatch();

  const [isEditOpen, setEditOpen] = useState(false);

  const expiryText =
    job.expirationDate instanceof Date
      ? job.expirationDate.toLocaleDateString("en-GB")
      : typeof job.expirationDate === "string"
      ? job.expirationDate
      : "No expiry date";
  // Tính số lượng ứng viên với trạng thái "pending"
  useEffect(() => {
    const fetchPendingApplications = async () => {
      const applicationsRef = collection(db, "applications");
      const q = query(
        applicationsRef,
        where("jobId", "==", job.jobId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      setPendingApplicationsCount(querySnapshot.size);
    };

    fetchPendingApplications();
  }, [job.jobId]);

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
      dispatch(updateJob({ ...job, status: "Expire" })); // Cập nhật Redux state
    } catch (error) {
      toast.error("Failed to mark job as expired.");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));
      toast.success("Job deleted successfully!");
      // location.reload();
      dispatch(deleteJob(jobId)); // Update Redux state after deletion
    } catch (error) {
      toast.error("Failed to delete job.");
    }
  };
  const handleViewDetail = (jobId: string) => {
    router.push(`${Paths.FIND_JOB}/${jobId}`);
  };

  return (
    <>
      <EditJobPopup
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        job={job}
      />
      {/* Desktop */}
      <Card
        className={`hidden md:grid grid-cols-12 items-center py-4 px-6 transition-all duration-75 rounded-2xl shadow-sm border hover:border-blue-500 ${
          job.urgent ? "bg-urgent" : ""
        }`}
      >
        <div className="col-span-4">
          <h3 className="font-medium text-gray-800 text-lg">{job.jobTitle}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {job.jobType} • {expiryText}
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

        <div className="col-span-3 flex items-center gap-5">
          <div className="text-gray-500 text-sm flex items-center">
            <span>{job.applicants?.length}</span>
            <MdGroups className="w-6 h-6 ml-2 text-gray-500" />
          </div>

          <div className="flex items-center">
            {pendingApplicationsCount > 0 && (
              <Link href={`${Paths.VIEW_APPLICATION}/${job.jobId}`}>
                <div className="mt-1 flex items-center space-x-2 bg-blue-100 rounded-xl px-3 py-1 cursor-pointer hover:bg-blue-200 transition-all">
                  <AiOutlineBell className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-semibold text-sm">
                    {pendingApplicationsCount} new
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div
          className="col-span-2 flex justify-end gap-2 items-center"
          ref={dropdownRef}
        >
          <Button variant="link" className="text-blue-600 px-0 cursor-pointer">
            <Link href={`${Paths.VIEW_APPLICATION}/${job.jobId}`}>
              View Applications
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <Button variant="ghost" size="icon">
                <BsThreeDots className="h-5 w-5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem>
                <GrUpgrade className="h-4 w-4 mr-2 text-blue-600" /> Promote Job
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDetail(job.jobId)}>
                <BsFillEyeFill className="h-4 w-4 mr-2 text-green-500" /> View
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => markJobAsExpired(job.jobId)}>
                <MdCancel className="h-4 w-4 mr-2 text-red-500" /> Mark as
                expired
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleDeleteJob(job.jobId)}>
                <MdDeleteForever className="h-4 w-4 mr-2 text-red-500" /> Delete
                Job
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <MdEdit className="h-4 w-4 mr-2 text-yellow-500" /> Edit Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Mobile */}
      <Card className="md:hidden p-4 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {job.jobTitle}
        </h3>
        <p className="text-sm text-gray-500">
          {job.jobType} • {expiryText}
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
          <strong>Applications:</strong> {job.applicants?.length}
        </p>
        <div className="flex items-center">
          {pendingApplicationsCount > 0 && (
            <Link href={`/${Paths.VIEW_APPLICATION}/${job.jobId}`} passHref>
              <div className="mt-1 flex items-center space-x-2 bg-blue-100 rounded-xl px-3 py-1 cursor-pointer hover:bg-blue-200 transition-all">
                <AiOutlineBell className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold text-sm">
                  {pendingApplicationsCount} new
                </span>
              </div>
            </Link>
          )}
        </div>
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
