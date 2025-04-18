"use client";

import Head from "next/head";

import SideBar from "@modules/dashboard/components/SideBar";

import OverviewEmployer from "@app/dashboard/@employer/overview/page";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-[150px]">
      <Head>
        <title>Dashboard | Jobpilot</title>
        <meta name="description" content="Employer Dashboard" />
      </Head>

      <div className="container py-8 flex flex-col md:flex-row gap-6">
        <SideBar />
        <OverviewEmployer />
      </div>

      <div className="border-t border-gray-200 mt-12 py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-xs md:text-sm">
          © 2021 Jobpilot - Job Board. All rights Reserved
        </div>
      </div>
    </div>
  );
}
