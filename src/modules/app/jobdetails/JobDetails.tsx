// app/jobs/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { db, firestore } from "@services/firebase/firebase";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Button } from "@component/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@component/ui/badge";
import { Separator } from "@component/ui/separator";
import JobApplicationPopup from "../../client/JobApplicationPopup";

import {
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Copy,
  Linkedin,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";
import { Job } from "../../../types/db";
import JobBox from "@component/ui/JobBox";
import Spinner from "@component/ui/Spinner";
import Link from "next/link";
import Paths from "@/constants/paths";

export default function JobDetails() {
  const params = useParams(); //take id url
  const jobId = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.user.id);
  const accountType = useSelector((state: RootState) => state.user.accountType);
  const [checkApplied, setCheckApplied] = useState<boolean | null>(null);
  const handlePopupForm = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const docRef = doc(db, "jobs", jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Convert Timestamp fields to Date
          const jobData: Job = {
            ...data,
            jobId: jobId,
            companyName: data.companyName || "Unknown Company",
            createdAt: (data.createdAt as Timestamp)?.toDate(),
            expirationDate: (data.expirationDate as Timestamp)?.toDate(),
          };

          setJob(jobData);
          //goi fetch related job khi fetch xong job
          if (jobData.tags && jobData.tags.length > 0) {
            fetchRelatedJobs(jobData.tags);
          }
        } else {
          console.warn("No such document!");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedJobs = async (tags: string[]) => {
      try {
        // take atleast 1 same tagtag
        const relatedQuery = query(
          collection(db, "jobs"),
          where("tags", "array-contains-any", tags)
        );

        const querySnapshot = await getDocs(relatedQuery);

        const jobs: Job[] = [];

        querySnapshot.forEach((docSnap) => {
          if (docSnap.id !== jobId) {
            const data = docSnap.data();

            const relatedJob: Job = {
              ...data,
              jobId: docSnap.id,
              createdAt: (data.createdAt as Timestamp)?.toDate(),
              expirationDate: (data.expirationDate as Timestamp)?.toDate(),
              companyName: data.companyName || "Unknown Company",
            };

            jobs.push(relatedJob);
          }
        });

        setRelatedJobs(jobs);
      } catch (err) {
        console.error("Error fetching related jobs:", err);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const checkNoApplied = async () => {
      // Check chi dang applicationapplication duoc 1 lan
      const applicationsRef = collection(firestore, "applications");
      const checkQuery = query(
        applicationsRef,
        where("jobId", "==", jobId),
        where("candidateId", "==", userId)
      );
      const checkSnapshot = await getDocs(checkQuery);

      if (!checkSnapshot.empty) {
        setCheckApplied(false);
      } else setCheckApplied(true);
    };
    checkNoApplied();
  }, []);

  const getJobTypeBadgeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "FULL-TIME":
        return "bg-blue-100 text-blue-800";
      case "PART-TIME":
        return "bg-green-100 text-green-800";
      case "INTERNSHIP":
        return "bg-orange-100 text-orange-800";
      case "FREELANCE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-screen">
        Job not found.
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0 max-w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 xl:px-0 md:px-[150px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* logo */}
            <div className="flex justify-between bg-white rounded-lg shadow-sm items-center mb-6 p-4 ">
              <div className="flex items-center gap-4 mb-4">
                <div className=" w-16 h-16 rounded-full flex items-center justify-center">
                  {job.avatarCompany ? (
                    <Image
                      src={job.avatarCompany}
                      alt={"Company Avatar"}
                      width={64}
                      height={64}
                      className="rounded-full object-cover w-16 h-16"
                    />
                  ) : (
                    <Image
                      src="/images/EmployersLogo.svg"
                      alt="Default Logo"
                      width={40}
                      height={40}
                      className="rounded-md  "
                    />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">{job.jobTitle}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>at {job.companyName}</span>
                    <div className="flex gap-2">
                      <Badge
                        className={`${getJobTypeBadgeColor(
                          job.jobType || "UNKNOWN"
                        )} font-medium`}
                      >
                        {job.jobType?.replace("-", " ") || "Unknown"}
                      </Badge>
                      {job.isRemote && (
                        <Badge
                          variant="outline"
                          className="bg-yellow-100 text-yellow-800 border-yellow-200"
                        >
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {accountType === "candidate" ? (
                checkApplied ? (
                  <Button
                    className="text-lg font-semibold px-6 py-6 bg-[#0A65CC] cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Apply Now
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="text-lg font-semibold px-6 py-6 bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    You have applied for this job
                  </Button>
                )
              ) : null}
            </div>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div
                  className={`prose max-w-none ${
                    !showFullDescription && "line-clamp-6"
                  }`}
                >
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
                {(job.description ?? "").length > 300 && (
                  <Button
                    variant="link"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 p-0 text-blue-600"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-sm">JOB POSTED</p>
                      {job.createdAt
                        ? (job.createdAt instanceof Date
                            ? job.createdAt
                            : job.createdAt.toDate()
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Undefined"}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-sm">JOB EXPIRES IN</p>

                      <p className="font-medium">
                        {job.expirationDate
                          ? (job.expirationDate instanceof Timestamp
                              ? job.expirationDate.toDate()
                              : job.expirationDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Undefined"}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-sm">JOB LEVEL</p> */}
                  {/* <p className="font-medium">{job.experienceLevel}</p> */}
                  {/* <p className="font-medium">Entry Level</p>
                    </div>
                  </div> */}
                  {/* <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-sm">EXPERIENCE</p>
                      <p className="font-medium">{job.experience}</p>
                    </div>
                  </div> */}
                  {/* <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="text-gray-500 text-sm">EDUCATION</p> */}
                  {/* <p className="font-medium">{job.education}</p> */}
                  {/* <p className="font-medium">Graduation</p>
                    </div>
                  </div> */}
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold mb-3">Share this job:</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" /> Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-500 hover:bg-blue-100 border-blue-200"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>

                <Separator className="my-6" />

                <h3 className="text-lg font-semibold mb-3">Job tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {(job.tags ?? []).length > 0 ? (
                    (job.tags ?? []).map((tag, index) => (
                      <Link
                        key={tag}
                        href={{
                          pathname: Paths.FIND_JOB,
                          query: { tag: tag }, // đẩy tag vào URL
                        }}
                      >
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1 hover:bg-gray-300"
                        >
                          {tag}
                        </Badge>
                      </Link>
                    ))
                  ) : (
                    <span className="text-gray-500">No job tag found</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Salary (USD)</h2>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {job.minSalary === 0 && job.maxSalary === 0
                    ? "Negotiate"
                    : `$${job.minSalary} - $${job.maxSalary}`}
                </div>
                <p className="text-gray-500 text-sm">Monthly salary</p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-6 h-6 text-blue-500" />
                  <div>
                    <h2 className="text-lg font-semibold">Company Location</h2>
                    <p className="text-gray-600">
                      {job.location?.province},{job.location?.district},{" "}
                      {job.location?.address}
                    </p>
                  </div>
                </div>
                {job.isRemote && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-blue-500" />
                    <div>
                      <h2 className="text-lg font-semibold">Remote Job</h2>
                      <p className="text-gray-600">Worldwide</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Job Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {jobBenefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 mb-2"
                    >
                      {benefit.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Related Jobs Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Jobs</h2>
          {relatedJobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedJobs.map((job) => (
                <JobBox
                  key={job.jobId}
                  id={job.jobId}
                  company={job.companyName || "Unknown Company"}
                  location={job.location?.province || "Unknown location"}
                  title={job.jobTitle || "Unknown Title"}
                  type={job.jobType?.toUpperCase() || "FULL-TIME"}
                  salary={
                    job.minSalary && job.maxSalary
                      ? job.minSalary != 0 && job.maxSalary != 0
                        ? `$${job.minSalary} - $${job.maxSalary}`
                        : "Negotiate"
                      : "Negotiate"
                  }
                  urgent={job.isRemote} // fix sau
                  logo={job.avatarCompany}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No related jobs found.</p>
          )}
        </div>
      </div>

      <JobApplicationPopup
        jobTitle={job.jobTitle || "Unknown Title"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePopupForm}
        jobId={jobId}
        candidateId={userId || ""}
        onApplied={() => setCheckApplied(false)} //render ui
      />
    </div>
  );
}
