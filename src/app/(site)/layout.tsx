"use client";
import Footer from "@component/Footer";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <SearchBar />
      {children}
      <Footer />
    </div>
  );
}
