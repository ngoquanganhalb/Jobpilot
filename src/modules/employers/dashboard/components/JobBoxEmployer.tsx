"use client";
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
import { BiCheckCircle, BiXCircle } from "react-icons/bi";
import { MdGroups, MdCancel } from "react-icons/md";
import { BsThreeDots, BsFillEyeFill } from "react-icons/bs";
import { GrUpgrade } from "react-icons/gr";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { AiOutlineBell } from "react-icons/ai";
import { FaDollarSign } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Job } from "../../../../types/db";
import EditJobPopup from "./EditJobPopup";
import { useDispatch } from "react-redux";
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
  // count candidates with status"pending"
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
      dispatch(updateJob({ ...job, status: "Expire" })); // Cập nhật Redux
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to mark job as expired.");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this job?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));
      toast.success("Job deleted successfully!");
      dispatch(deleteJob(jobId)); // Update Redux state after deletion
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Swal.fire({
        title: "Deleted!",
        text: "Application has been deleted.",
        icon: "success",
      });
    } catch (error) {
      toast.error("Failed to delete job.");
    }
  };
  const handleViewDetail = (jobId: string) => {
    router.push(`${Paths.FIND_JOB}/${jobId}`);
  };
  const renderJobTypeBadge = (jobType: string) => {
    let badgeClass = "";

    switch (jobType) {
      case "full-time":
        badgeClass = "bg-blue-100 text-blue-800";
        break;
      case "part-time":
        badgeClass = "bg-green-100 text-green-800";
        break;
      case "internship":
        badgeClass = "bg-orange-100 text-orange-800";
        break;
      case "freelance":
        badgeClass = "bg-purple-100 text-purple-800";
        break;
      default:
        badgeClass = "bg-gray-100 text-gray-800";
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-md ${badgeClass}`}>
        {jobType}
      </span>
    );
  };
  return (
    <>
      <EditJobPopup
        open={isEditOpen}
        onClose={() => setEditOpen(false)}
        job={job}
      />

      {/* Desktop View */}
      <Card
        // className={`hidden md:grid grid-cols-12 items-center py-4 px-6 shadow-sm border transition-all hover:border-blue-500 rounded-none last:rounded-b-2xl
        //   ${job.urgent ? "bg-urgent" : ""        }
        //   `}
        className={`hidden md:grid grid-cols-12 items-center py-4 px-6 shadow-sm border transition-all hover:border-blue-500 rounded-none last:rounded-b-2xl 
            `}
      >
        {/* Job Info */}
        <div className="col-span-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded overflow-hidden flex items-center justify-center border">
            <img
              src={job.avatarCompany || "/images/default-avatar.png"}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-base flex items-center">
              {job.jobTitle || "No Title"}
              <span className="ml-2">
                {renderJobTypeBadge(job?.jobType || "unknow")}
              </span>
            </h3>
            <p className="text-gray-500 text-xs mt-1">To: {expiryText}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                📍 {job.location?.province || "Unknown location"}
              </span>
              <span className="flex items-center gap-1">
                💰{" "}
                {/* <FaDollarSign/>  */}
                {job.minSalary === 0 && job.maxSalary === 0
                  ? "Negotiate"
                  : `$${job.minSalary} - $${job.maxSalary}`}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2 text-sm">
          {job.status === "Active" ? (
            <div className="flex items-center text-green-600 font-normal text-base">
              <BiCheckCircle className="mr-1" /> Active
            </div>
          ) : (
            <div className="flex items-center text-red-500 font-medium">
              <BiXCircle className="mr-1" /> Expired
            </div>
          )}
        </div>

        {/* Applications */}
        <div className="col-span-3 flex items-center justify-start gap-5">
          <div className="text-gray-600 flex items-center text-sm">
            <MdGroups className="w-6 h-6 mr-1" /> {job.applicants?.length}
          </div>
          {pendingApplicationsCount > 0 && (
            <Link href={`${Paths.VIEW_APPLICATION}/${job.jobId}`}>
              <div className="flex items-center gap-2 bg-blue-100 rounded-xl px-3 py-1 hover:bg-blue-200 transition-all cursor-pointer">
                <AiOutlineBell className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-600 font-semibold">
                  {pendingApplicationsCount} new
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Actions */}
        <div
          className="col-span-2 flex justify-end items-center gap-2"
          ref={dropdownRef}
        >
          <Link href={`${Paths.VIEW_APPLICATION}/${job.jobId}`}>
            <Button
              variant="link"
              className="text-blue-600 px-0 text-sm cursor-pointer"
            >
              View Applications
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="cursor-pointer">
                <BsThreeDots className="h-5 w-5 text-gray-500 " />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {/* <DropdownMenuItem className="cursor-pointer">
                <GrUpgrade className="h-4 w-4 mr-2 text-blue-600" /> Promote Job
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleViewDetail(job.jobId)}
              >
                <BsFillEyeFill className="h-4 w-4 mr-2 text-green-500" /> View
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => markJobAsExpired(job.jobId)}
              >
                <MdCancel className="h-4 w-4 mr-2 text-red-500" /> Mark as
                expired
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleDeleteJob(job.jobId)}
              >
                <MdDeleteForever className="h-4 w-4 mr-2 text-red-500" /> Delete
                Job
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setEditOpen(true)}
              >
                <MdEdit className="h-4 w-4 mr-2 text-yellow-500" /> Edit Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Mobile */}
      <Card className="md:hidden p-4 shadow-sm rounded-xl border hover:border-blue-500 transition-all">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            <img
              src={job.avatarCompany || "/images/default-avatar.png"}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-800">
              {job.jobTitle || "No Title"}
            </h3>
            <div className="text-xs text-gray-500 flex items-center mt-1 space-x-1">
              <span>{job.jobType}</span>
              <span>•</span>
              <span>To: {expiryText}</span>
            </div>

            <div className="mt-2 flex flex-col space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="mr-1">📍</span>
                {job.location?.province || "Unknown location"}
              </div>
              <div className="flex items-center">
                <span className="mr-1">💰</span>
                {job.minSalary === 0 && job.maxSalary === 0
                  ? "Negotiate"
                  : `$${job?.minSalary} - $${job?.maxSalary}`}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    job.status === "Active" ? "text-green-600" : "text-red-500"
                  }
                >
                  {job.status}
                </span>
              </div>
              <div>
                <strong>Applications:</strong> {job.applicants?.length}
              </div>
            </div>

            {pendingApplicationsCount > 0 && (
              <Link href={`${Paths.VIEW_APPLICATION}/${job.jobId}`} passHref>
                <div className="mt-3 inline-flex items-center space-x-2 bg-blue-100 rounded-xl px-3 py-1 cursor-pointer hover:bg-blue-200 transition-all">
                  <AiOutlineBell className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 font-semibold text-sm">
                    {pendingApplicationsCount} new
                  </span>
                </div>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Button variant="link" className="text-blue-600 px-0 text-sm">
            <Link href={`${Paths.VIEW_APPLICATION}/${job.jobId}`}>
              View Applications
            </Link>
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
    </>
  );
}
