"use client";
import Footer from "@component/components/Footer";
import Header from "@component/components/Header";
import SearchBar from "@component/components/SearchBar";
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
