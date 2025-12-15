"use client";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import Breadcrumb from "@component/Breadcrumb";
import VideoCallPage from "@modules/app/videocall/VideoCallPage";
export default function VideoCall() {
  return (
    <div>
      <Header />
      <SearchBar />
      <Breadcrumb />
      <VideoCallPage />
    </div>
  );
}
