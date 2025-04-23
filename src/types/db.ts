export type JobType = "full-time" | "part-time" | "intern" | "freelance";
export type JobStatus = "Active" | "Expire";

export type Job = {
  jobId: string;
  employerId: string;
  jobTitle: string;
  tags?: string[];
  minSalary?: number | "";
  maxSalary?: number | "";
  description?: string;
  jobType?: JobType;
  companyName:string;
  avatarCompany?: string;
  urgent?: boolean;
  location?: string;
  isRemote?: boolean;
  expirationDate?: Date;
  applicants?: string[]; // userid
  status?: JobStatus;
};
