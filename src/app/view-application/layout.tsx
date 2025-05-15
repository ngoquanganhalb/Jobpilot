"use client";

import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import Head from "next/head";
import Breadcrumb from "@component/Breadcrumb";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <SearchBar />
      <div className="px-[-100px]">
        <Breadcrumb />
      </div>

      <div className="min-h-screen bg-gray-50 px-4 md:px-[100px] mt-7">
        <Head>
          <title>Dashboard | Jobpilot</title>
          <meta name="description" content="Employer Dashboard" />
        </Head>

        <div className="container flex flex-col md:flex-row gap-0">
          <div className="flex-1">{children}</div>
        </div>

        <div className="border-t border-gray-200 mt-12 py-6 bg-white">
          <div className="container mx-auto px-4 text-center text-gray-500 text-xs md:text-sm">
            © 2025 Jobpilot - Job Board. All rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
}
