import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { JobType } from "./db";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonSlideBarProps = {
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type InputProps = {
  className?: string;
  icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export type CountBoxProps = {
  count: number;
  title: string;
  img: React.ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type AccountType = "candidate" | "employer";
export type FormData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
};


//Only for JobBox.tsx useSearchJob
export type JobBoxType = {
  id?: string;
  title: string;
  type: string;
  salary: string;
  company: string;
  location: string;
  className?: string;
  urgent?: boolean;
  logo?: string;
  variant?: "primary" | "secondary";
};
//only for JobBoxEmployer.tsx
export type JobPosting = {
  id: string;
  title: string;
  type: string;
  timeRemaining?: string;
  expiryDate?: string|Date;
  status: "Active" | "Expire";
  applications: number;
  urgent?: boolean;
}

//for FilterSideBar va useFilterJob , filterSlice
export type FilterFormValues = {
  searchTerm?: string;
  location?: string;
  tags: string[];
  jobTypes: JobType[];
  minSalary: number;
  maxSalary: number;
  isRemote: boolean ;
}
//------------------------db---------------------------------
//users board
export type UserModel = {
  id?:string;
  name: string;
  username: string;
  email: string;
  accountType: AccountType;
  isAdmin: boolean;
  password?: string;
  avatarUrl?: string;
  savedJobs?: string[]
  createdAt: Date
  profile?: {
    resumeUrl?: string;
    bio?: string;
    skills?: string[];
    location?: string;
    phone?: string;
  }
  companyProfile?: {
    name?: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    address?: string;
    industry?: string;
  }

};
