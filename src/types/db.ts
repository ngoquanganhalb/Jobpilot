export type JobType = "full-time" | "part-time" | "intern" | "freelance";
export type JobStatus = "Active" | "Expire";
export type JobTag =
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Sales"
  | "Finance"
  | "Human Resources"
  | "Product"
  | "Customer Support"
  | "IT"
  | "Software Development"
  | "Web Development"
  | "Mobile Development"
  | "Backend Development"
  | "Frontend Development"
  | "Full Stack Development"
  | "DevOps"
  | "UI/UX Design"
  | "Data Science"
  | "Machine Learning"
  | "Artificial Intelligence"
  | "Cybersecurity"
  | "Cloud Computing"
  | "Database Administration"
  | "IT Support"
  | "Product Management"
  | "Technical Writing"
  | "IT Project Management"
  | "System Administration"
  | "Business Intelligence"
  | "Embedded Systems"
  | "Computer Vision"
  | "Operations"
  | "Education"
  | "Healthcare"
  | "Legal";

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
