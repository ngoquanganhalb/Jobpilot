// "use client";
// import { ReactNode } from "react";
// import Header from "@component/Header";
// import SearchBar from "@component/SearchBar";
// import SideBar from "@modules/employers/dashboard/components/SideBar";
// import { useSelector } from "react-redux";
// import Head from "next/head";
// import {
//   menuItemCandidate,
//   menuItemsEmployer,
// } from "@/constants/sidebarDashBoard";

// export default function DashboardLayout({
//   children,
//   employer,
//   candidate,
// }: {
//   children: ReactNode;
//   employer: ReactNode;
//   candidate: ReactNode;
// }) {
//   const accountType = useSelector((state: any) => state.user.accountType);

//   const renderSidebar = () => {
//     if (accountType === "employer") {
//       return <SideBar menuItems={menuItemsEmployer} title="Dashboard" />;
//     } else if (accountType === "candidate") {
//       return <SideBar menuItems={menuItemCandidate} title="Dashboard" />;
//     }
//     return null;
//   };

//   return (
//     <div>
//       <Header />
//       <SearchBar />

//       <div className="min-h-screen bg-gray-50 px-4 md:px-[150px]">
//         <Head>
//           <title>Dashboard | Jobpilot</title>
//           <meta name="description" content="Employer Dashboard" />
//         </Head>

//         <div className="container flex flex-col md:flex-row gap-0">
//           {renderSidebar()}

//           <div className="flex-1">
//             {accountType === "employer" && employer}
//             {accountType === "candidate" && candidate}

//             {accountType !== "employer" &&
//               accountType !== "candidate" &&
//               children}
//           </div>
//         </div>

//         <div className="border-t border-gray-200 mt-12 py-6 bg-white">
//           <div className="container mx-auto px-4 text-center text-gray-500 text-xs md:text-sm">
//             © 2025 Jobpilot - Job Board. All rights Reserved
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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

// Định nghĩa các type cho props
type LayoutProps = {
  children?: ReactNode;
};

type LayoutPropsExtended = {
  children?: ReactNode;
  employer?: ReactNode;
  candidate?: ReactNode;
};

export default function DashboardLayout(
  props: LayoutProps | LayoutPropsExtended
) {
  const { children, employer, candidate } = {
    ...props,
    employer: undefined,
    candidate: undefined,
  };

  const accountType = useSelector((state: any) => state.user.accountType);

  // Render sidebar tùy thuộc vào accountType
  const renderSidebar = () => {
    if (accountType === "employer") {
      return <SideBar menuItems={menuItemsEmployer} title="Dashboard" />;
    } else if (accountType === "candidate") {
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
            {accountType === "employer" && employer}
            {accountType === "candidate" && candidate}

            {accountType !== "employer" &&
              accountType !== "candidate" &&
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
