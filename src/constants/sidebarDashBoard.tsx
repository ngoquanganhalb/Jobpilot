import Paths from "./paths";
import {
  BsBriefcase,
  BsPerson,
  BsBuilding,
  BsBookmark,
  BsGear,
  BsCreditCard,
  BsBuildingFill,
} from "react-icons/bs";

import { FiPlus } from "react-icons/fi";
import MenuIcon from "@component/icons/MenuIcon";

export const menuItemCandidate = [
  { icon: <MenuIcon />, label: "Overview", path: Paths.DASHBOARD_OVERVIEW },
  {
    icon: <BsBuildingFill className="h-5 w-5 mr-3" />,
    label: "AppliedJobs",
    path: Paths.DASHBOARD_APPLIEDJOB,
  },
  {
    icon: <BsBookmark className="h-5 w-5 mr-3" />,
    label: "FavoriteJobs",
    path: Paths.FAVORITE_JOB,
  },
  {
    icon: <BsGear className="h-5 w-5 mr-3" />,
    label: "Settings",
    path: Paths.SETTINGS,
  },
];

export const menuItemsEmployer = [
  { icon: <MenuIcon />, label: "Overview", path: Paths.DASHBOARD_OVERVIEW },
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
  // {
  //   icon: <BsBookmark className="h-5 w-5 mr-3" />,
  //   label: "SavedCandidate",
  //   path: Paths.SAVED_CANDIDATE,
  // },
  // {
  //   icon: <BsCreditCard className="h-5 w-5 mr-3" />,
  //   label: "Plans",
  //   path: Paths.PLANS,
  // },
  // {
  //   icon: <BsBuilding className="h-5 w-5 mr-3" />,
  //   label: "AllCompanies",
  //   path: Paths.ALL_COMPANIES,
  // },
  {
    icon: <BsGear className="h-5 w-5 mr-3" />,
    label: "Settings",
    path: Paths.SETTINGS,
  },
];
