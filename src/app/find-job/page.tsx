"use client";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import Footer from "@component/Footer";
import Breadcrumb from "@component/Breadcrumb";
import FindJobModule from "../../modules/app/findjob/FindJobModule";
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
