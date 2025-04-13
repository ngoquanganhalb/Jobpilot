"use client";
import Footer from "@component/components/Footer";
import Header from "@component/components/Header";
// import { collection, query, orderBy, getDocs } from "firebase/firestore";
// import PageLayout from "../layout/PageLayout";
import HomePageModule from "@component/modules/homepage/HomePageModule";
export default function Jobs() {
  return (
    <div>
      {/* <PageLayout> */}
      <Header />
      <HomePageModule />
      <Footer />
      {/* </PageLayout> */}
    </div>
  );
}
