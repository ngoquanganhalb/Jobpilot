"use client";
import Header from "@component/components/Header";
import SearchBar from "@component/components/SearchBar";
import Footer from "@component/components/Footer";
import Breadcrumb from "@component/components/Breadcrumb";
import FindJobModule from "../../modules/findjob/FindJobModule";
export default function Jobs() {
  // type Job = {
  //   id: string;
  //   title: string;
  //   description: string;
  //   imageUrl?: string;
  //   createdAt: any;
  // }
  return (
    <div>
      <Header />
      <SearchBar />
      <Breadcrumb />
      <FindJobModule />
      <Footer />
    </div>
  );
}
