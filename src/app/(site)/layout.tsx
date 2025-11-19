"use client";
import { tokenManager } from "@/core/tokenManager";
import Footer from "@component/Footer";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("accessToken", tokenManager.getAccessToken());

  return (
    <div>
      <Header />
      <SearchBar />
      {children}
      <Footer />
    </div>
  );
}
