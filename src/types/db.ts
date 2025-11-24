import { APPLICATION_STATUS, JOB_STATUS, JOB_TYPE } from "@/common/enum";
import { Timestamp } from "firebase/firestore";

export type JobType = "full-time" | "part-time" | "freelance";
export const JOB_TYPE_OPTIONS: JOB_TYPE[] = [
  JOB_TYPE.FULL_TIME,
  JOB_TYPE.PART_TIME,
  JOB_TYPE.INTERNSHIP,
  JOB_TYPE.FREELANCE,
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
  employerId?: number;
  jobTitle?: string;
  tags?: string[];
  minSalary?: number | "";
  maxSalary?: number | "";
  description?: string;
  jobType?: JOB_TYPE;
  companyName: string;
  avatarCompany?: string;
  urgent?: boolean;
  location?: Location;
  isRemote?: boolean;
  expirationDate?: Date | Timestamp;
  applicants?: string[]; // userid
  status?: JOB_STATUS;
  createdAt?: Date | Timestamp;
};

export type Application = {
  id: string;
  jobId: string;
  candidateId: number;
  appliedAt: Date | Timestamp;
  status: APPLICATION_STATUS;
  resumeUrl?: string;
  note?: string;
  showCandidate?: boolean;
  showEmployer?: boolean;
  feedback?: string;

  name?: string;
  avatar?: string;
};

//type fetch for user applied job
export type ApplicationWithJob = Application & {
  job?: Job;
};

export interface Cv {
  id: number;
  userId?: number;
  image: string;
  title: string;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  isActive: boolean;
  rawText?: any;
  theme: number;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  duration: string;
}
