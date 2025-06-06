import { Timestamp } from "firebase/firestore";

export type JobType = "full-time" | "part-time" | "freelance";
export type JobStatus = "Active" | "Expire";
export const JOB_TYPE_OPTIONS: JobType[] = [
  "full-time",
  "part-time",
  "freelance",
];
export type JobTag =
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Sales"
  | "Finance"
  | "Human Resources"
  | "Customer Support"
  | "Software Development"
  | "Web Development"
  | "Mobile Development"
  | "UI/UX Design"
  | "Operations"
  | "Education"
  | "Healthcare"
  | "Retail"
  | "Hospitality"
  | "Manufacturing"
  | "Transportation"
  | "Entertainment"
  | "Finance & Accounting"
  | "Supply Chain & Logistics"
  | "Social Media"
  | "Sales & Business Development"
  | "Others";

export const JOB_TAG_OPTIONS: JobTag[] = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "Human Resources",
  "Customer Support",
  "Software Development",
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Operations",
  "Education",
  "Healthcare",
  "Retail",
  "Hospitality",
  "Manufacturing",
  "Transportation",
  "Entertainment",
  "Finance & Accounting",
  "Supply Chain & Logistics",
  "Social Media",
  "Sales & Business Development",
  "Others",
];
export type Location = {
  province: string;
  district: string;
  address: string;
};

export type Job = {
  jobId: string;
  employerId?: string;
  jobTitle?: string;
  tags?: string[];
  minSalary?: number | "";
  maxSalary?: number | "";
  description?: string;
  jobType?: JobType;
  companyName:string;
  avatarCompany?: string;
  urgent?: boolean;
  location?: Location;
  isRemote?: boolean;
  expirationDate?: Date | Timestamp;
  applicants?: string[]; // userid
  status?: JobStatus;
  createdAt?: Date | Timestamp
};


export type Application = {
  id:string
  jobId: string;
  candidateId: string;
  appliedAt: Date | Timestamp; 
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';
  resumeUrl?: string;
  note?: string;
  showCandidate?:boolean ,
  showEmployer?:boolean,
  feedback?: string

  name?: string;
  avatar?: string;
};

//type fetch for user applied job
export type ApplicationWithJob = Application & {
  job?: Job
};

export type Status = 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired'