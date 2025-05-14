//badge for status interview,....

import { Status } from "../../types/db";


export const StatusBadge = ({ status }: { status: Status }) => {
  const statusConfig = {
    pending: { label: "New", bgColor: "bg-blue-100 text-blue-800" },
    reviewed: { label: "Reviewed", bgColor: "bg-purple-100 text-purple-800" },
    interview: {
      label: "Interview",
      bgColor: "bg-yellow-100 text-yellow-800",
    },
    rejected: { label: "Rejected", bgColor: "bg-red-100 text-red-800" },
    hired: { label: "Hired", bgColor: "bg-green-100 text-green-800" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor}`}
    >
      {config.label}
    </span>
  );
};
