"use client";

import { ReactNode } from "react";
import Header from "@component/Header";
import SearchBar from "@component/SearchBar";
import SideBar from "@modules/employers/dashboard/components/SideBar";
import { useSelector } from "react-redux";
import Head from "next/head";
import {
  menuItemCandidate,
  menuItemsEmployer,
} from "@/constants/sidebarDashBoard";
import { RootState } from "@redux/store";
import { USER_ROLE } from "@/common/enum";
import Spinner from "@component/ui/Spinner";

// Định nghĩa các type cho props
type LayoutProps = {
  children?: ReactNode;
  employer: ReactNode;
  candidate: ReactNode;
};

export default function DashboardLayout(props: LayoutProps) {
  const { children, employer, candidate } = props;

  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) return <Spinner />;

  const renderSidebar = () => {
    if (user?.client === USER_ROLE.EMPLOYER) {
      return <SideBar menuItems={menuItemsEmployer} title="Dashboard" />;
    } else if (user?.client === USER_ROLE.USER) {
      return <SideBar menuItems={menuItemCandidate} title="Dashboard" />;
    }
    return null;
  };

  return (
    <div>
      <Header />
      <SearchBar />

      <div className="min-h-screen bg-gray-50 px-4 md:px-[150px]">
        <Head>
          <title>Dashboard | Jobpilot</title>
          <meta name="description" content="Employer Dashboard" />
        </Head>

        <div className="container flex flex-col md:flex-row gap-0">
          {/* Render sidebar cho employer hoặc candidate */}
          {renderSidebar()}

          {/* Render nội dung chính */}
          <div className="flex-1">
            {user?.client === USER_ROLE.EMPLOYER && employer}
            {user?.client === USER_ROLE.USER && candidate}

            {user?.client !== USER_ROLE.EMPLOYER &&
              user?.client !== USER_ROLE.USER &&
              children}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-12 py-6 bg-white">
          <div className="container mx-auto px-4 text-center text-gray-500 text-xs md:text-sm">
            © 2025 Jobpilot - Job Board. All rights Reserved
          </div>
        </div>
      </div>
    </div>
  );
}
