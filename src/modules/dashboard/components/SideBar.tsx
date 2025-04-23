// "use client";
// import { useState } from "react";
// import {
//   BsBriefcase,
//   BsPerson,
//   BsBuilding,
//   BsBookmark,
//   BsGear,
//   BsCreditCard,
// } from "react-icons/bs";
// import { FiPlus } from "react-icons/fi";
// import MenuIcon from "@component/components/icons/MenuIcon";
// import ButtonSlideBar from "@component/components/ui/ButtonSlideBar";

// export default function SideBar() {
//   const [selectedMenu, setSelectedMenu] = useState("Overview");
//   return (
//     <div className="w-64 mr-8">
//       <div className="bg-white rounded-md shadow-sm mb-4">
//         <div className="p-4 border-b border-gray-200 font-medium text-gray-500">
//           EMPLOYERS DASHBOARD
//         </div>
//         <nav className="p-2">
//           <ButtonSlideBar
//             icon={<MenuIcon />}
//             label="Overview"
//             isActive={selectedMenu === "Overview"}
//             onClick={() => setSelectedMenu("Overview")}
//           />

//           <ButtonSlideBar
//             icon={<BsPerson className="h-5 w-5 mr-3" />}
//             label="Employers Profile"
//             isActive={selectedMenu === "EmployersProfile"}
//             onClick={() => setSelectedMenu("EmployersProfile")}
//           />

//           <ButtonSlideBar
//             icon={<FiPlus className="h-5 w-5 mr-3" />}
//             label="Post A Job"
//             isActive={selectedMenu === "PostAJob"}
//             onClick={() => setSelectedMenu("PostAJob")}
//           />

//           <ButtonSlideBar
//             icon={<BsBriefcase className="h-5 w-5 mr-3" />}
//             label="My Jobs"
//             isActive={selectedMenu === "MyJobs"}
//             onClick={() => setSelectedMenu("MyJobs")}
//           />

//           <ButtonSlideBar
//             icon={<BsBookmark className="h-5 w-5 mr-3" />}
//             label="Saved Candidate"
//             isActive={selectedMenu === "SavedCandidate"}
//             onClick={() => setSelectedMenu("SavedCandidate")}
//           />

//           <ButtonSlideBar
//             icon={<BsCreditCard className="h-5 w-5 mr-3" />}
//             label="Plans & Billing"
//             isActive={selectedMenu === "Plans"}
//             onClick={() => setSelectedMenu("Plans")}
//           />

//           <ButtonSlideBar
//             icon={<BsBuilding className="h-5 w-5 mr-3" />}
//             label="All Companies"
//             isActive={selectedMenu === "AllCompanies"}
//             onClick={() => setSelectedMenu("AllCompanies")}
//           />

//           <ButtonSlideBar
//             icon={<BsGear className="h-5 w-5 mr-3" />}
//             label="Settings"
//             isActive={selectedMenu === "Settings"}
//             onClick={() => setSelectedMenu("Settings")}
//           />
//         </nav>
//       </div>
//     </div>
//   );
// }
"use client";
// import { useState } from "react";

import { useRouter } from "next/navigation";
import {
  BsBriefcase,
  BsPerson,
  BsBuilding,
  BsBookmark,
  BsGear,
  BsCreditCard,
} from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { Sheet, SheetTrigger, SheetContent } from "@component/ui/sheet";
import Button from "@component/ui/ButtonCustom";
import MenuIcon from "@component/icons/MenuIcon";
import ButtonSlideBar from "@component/ui/ButtonSlideBar";
import Paths from "@/constants/paths";

export default function SideBar() {
  const router = useRouter();

  const menuItems = [
    { icon: <MenuIcon />, label: "Overview", path: Paths.DASHBOARD_OVERVIEW },
    {
      icon: <BsPerson className="h-5 w-5 mr-3" />,
      label: "EmployersProfile",
      path: Paths.EMPLOYER_PROFILE,
    },
    {
      icon: <FiPlus className="h-5 w-5 mr-3" />,
      label: "PostAJob",
      path: Paths.POST_A_JOB,
    },
    {
      icon: <BsBriefcase className="h-5 w-5 mr-3" />,
      label: "MyJobs",
      path: Paths.MY_JOBS,
    },
    {
      icon: <BsBookmark className="h-5 w-5 mr-3" />,
      label: "SavedCandidate",
      path: Paths.SAVED_CANDIDATE,
    },
    {
      icon: <BsCreditCard className="h-5 w-5 mr-3" />,
      label: "Plans",
      path: Paths.PLANS,
    },
    {
      icon: <BsBuilding className="h-5 w-5 mr-3" />,
      label: "AllCompanies",
      path: Paths.ALL_COMPANIES,
    },
    {
      icon: <BsGear className="h-5 w-5 mr-3" />,
      label: "Settings",
      path: Paths.SETTINGS,
    },
  ];

  const SidebarNav = () => (
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200 font-medium text-gray-500">
        EMPLOYERS DASHBOARD
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <ButtonSlideBar
            key={item.label}
            icon={item.icon}
            label={item.label.replace(/([A-Z])/g, " $1").trim()}
            onClick={() => router.push(item.path)}
            href={item.path}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar - Sheet */}
      <div className="md:hidden px-4 pt-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Open Menu</Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            {SidebarNav()}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 mr-8">{SidebarNav()}</div>
    </>
  );
}

// export default function SideBar() {
//   const [selectedMenu, setSelectedMenu] = useState("Overview");
//   const router = useRouter();

//   const menuItems = [
//     { icon: <MenuIcon />, label: "Overview", path: Paths.EMPLOYERS_DASHBOARD },
//     {
//       icon: <BsPerson className="h-5 w-5 mr-3" />,
//       label: "EmployersProfile",
//       path: Paths.EMPLOYER_PROFILE,
//     },
//     {
//       icon: <FiPlus className="h-5 w-5 mr-3" />,
//       label: "PostAJob",
//       path: Paths.POST_A_JOB,
//     },
//     {
//       icon: <BsBriefcase className="h-5 w-5 mr-3" />,
//       label: "MyJobs",
//       path: Paths.MY_JOBS,
//     },
//     {
//       icon: <BsBookmark className="h-5 w-5 mr-3" />,
//       label: "SavedCandidate",
//       path: Paths.SAVED_CANDIDATE,
//     },
//     {
//       icon: <BsCreditCard className="h-5 w-5 mr-3" />,
//       label: "Plans",
//       path: Paths.PLANS,
//     },
//     {
//       icon: <BsBuilding className="h-5 w-5 mr-3" />,
//       label: "AllCompanies",
//       path: Paths.ALL_COMPANIES,
//     },
//     {
//       icon: <BsGear className="h-5 w-5 mr-3" />,
//       label: "Settings",
//       path: Paths.SETTINGS,
//     },
//   ];

//   const SidebarNav = () => (
//     <div className="w-64 bg-white shadow-md flex flex-col">
//       <div className="p-4 border-b border-gray-200 font-medium text-gray-500">
//         EMPLOYERS DASHBOARD
//       </div>
//       <nav className="p-2">
//         {menuItems.map((item) => (
//           <ButtonSlideBar
//             key={item.label}
//             icon={item.icon}
//             label={item.label.replace(/([A-Z])/g, " $1").trim()}
//             isActive={selectedMenu === item.label}
//             onClick={() => {
//               setSelectedMenu(item.label);
//               router.push(item.path);
//             }}
//           />
//         ))}
//       </nav>
//     </div>
//   );

//   return (
//     <>
//       {/* Mobile Sidebar - Sheet */}
//       <div className="md:hidden px-4 pt-4">
//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="secondary">Open Menu</Button>
//           </SheetTrigger>
//           <SheetContent side="left" className="p-0 w-64">
//             {SidebarNav()}
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Desktop Sidebar */}
//       <div className="hidden md:block w-64 mr-8">{SidebarNav()}</div>
//     </>
//   );
// }
