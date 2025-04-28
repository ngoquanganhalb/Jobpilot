export type JobType = "full-time" | "part-time" | "intern" | "freelance";
export type JobStatus = "Active" | "Expire";
export const JOB_TYPE_OPTIONS: JobType[] = [
  "full-time",
  "part-time",
  "intern",
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
  createdAt?: Date; 
};


export type Application = {
  id:string
  jobId: string;
  candidateId: string;
  appliedAt: Date; 
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired';
  resumeUrl?: string;
  note?: string;
  showCandidate?:boolean ,
  showEmployer?:boolean,

  name?: string;
  avatar?: string;
};

//type fetch cho user applied job
export type ApplicationWithJob = Application & {
  job?: Job
};