// /find-job/[id]/page.tsx
"use client";
import React from "react";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import Footer from "@component/Footer";
import Breadcrumb from "@component/Breadcrumb";
import JobDetails from "@modules/app/JobDetails";

const Page = () => {
  return (
    <div>
      <Header />
      <SearchBar />
      <Breadcrumb />
      <JobDetails />
      <Footer />
    </div>
  );
};

export default Page;
