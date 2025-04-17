// app/dashboard/layout.tsx
"use client";
import Header from "@component/components/Header";
import SearchBar from "@component/components/SearchBar";
import { useSelector } from "react-redux";

export default function DashboardLayout({
  children,
  candidate,
  employer,
}: {
  children: React.ReactNode;
  candidate: React.ReactNode;
  employer: React.ReactNode;
}) {
  const accountType = useSelector((state: any) => state.user.accountType);

  return (
    <div>
      <Header />
      <SearchBar />
      {children}
      {accountType === "employer" && employer}
      {accountType === "candidate" && candidate}
    </div>
  );
}
