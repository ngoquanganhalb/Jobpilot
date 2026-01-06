"use client";

import Breadcrumb from "@component/Breadcrumb";
import Footer from "@component/Footer";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import CvManagement from "@modules/client/cv-management/CvMangement";
export const dynamic = "force-dynamic";

export default function Cv() {
  return (
    <>
      <Header />
      <SearchBar />
      <Breadcrumb />
      <CvManagement />
      <Footer />
    </>
  );
}
