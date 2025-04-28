// dashboard/@candidate/page.tsx
"use client";
import { useSelector } from "react-redux";

export default function CandidateDashboard() {
  const user = useSelector((state: any) => state.user);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
      <p>Hello, {user.id || "Candidate"}!</p>
    </div>
  );
}
