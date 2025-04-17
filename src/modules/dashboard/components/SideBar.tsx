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
import { useState } from "react";
import {
  BsBriefcase,
  BsPerson,
  BsBuilding,
  BsBookmark,
  BsGear,
  BsCreditCard,
} from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import MenuIcon from "@component/components/icons/MenuIcon";
import ButtonSlideBar from "@component/components/ui/ButtonSlideBar";

export default function SideBar() {
  const [selectedMenu, setSelectedMenu] = useState("Overview");

  const menuItems = [
    { icon: <MenuIcon />, label: "Overview" },
    { icon: <BsPerson className="h-5 w-5 mr-3" />, label: "EmployersProfile" },
    { icon: <FiPlus className="h-5 w-5 mr-3" />, label: "PostAJob" },
    { icon: <BsBriefcase className="h-5 w-5 mr-3" />, label: "MyJobs" },
    { icon: <BsBookmark className="h-5 w-5 mr-3" />, label: "SavedCandidate" },
    { icon: <BsCreditCard className="h-5 w-5 mr-3" />, label: "Plans" },
    { icon: <BsBuilding className="h-5 w-5 mr-3" />, label: "AllCompanies" },
    { icon: <BsGear className="h-5 w-5 mr-3" />, label: "Settings" },
  ];

  const SidebarNav = () => (
    <div className="w-64 bg-white h-full shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200 font-medium text-gray-500">
        EMPLOYERS DASHBOARD
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <ButtonSlideBar
            key={item.label}
            icon={item.icon}
            label={item.label.replace(/([A-Z])/g, " $1").trim()}
            isActive={selectedMenu === item.label}
            onClick={() => setSelectedMenu(item.label)}
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
            <Button variant="outline">Open Menu</Button>
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
