import { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
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
