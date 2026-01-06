"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, Cell } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";

import { RootState } from "@redux/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@component/ui/chart";
import { db } from "@lib/firebase.client";

interface ChartData {
  status: string;
  count: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#3b82f6", // blue
  reviewed: "#8b5cf6", // purple
  interview: "#eab308", // yellow
  rejected: "#ef4444", // red
  hired: "#22c55e", // green
};

const defaultStatuses: ChartData[] = [
  { status: "pending", count: 0 },
  { status: "reviewed", count: 0 },
  { status: "interview", count: 0 },
  { status: "rejected", count: 0 },
  { status: "hired", count: 0 },
];

export function OverviewChart() {
  const [chartData, setChartData] = useState<ChartData[]>(defaultStatuses);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const q = query(
        collection(db, "applications"),
        where("candidateId", "==", `${user.id}`),
        where("showCandidate", "==", true)
      );

      const snapshot = await getDocs(q);

      const statusCount: Record<string, number> = {
        pending: 0,
        reviewed: 0,
        interview: 0,
        rejected: 0,
        hired: 0,
      };

      snapshot.forEach((doc) => {
        const status = doc.data().status ?? "pending";
        if (status in statusCount) {
          statusCount[status]++;
        }
      });

      const formatted = defaultStatuses.map(({ status }) => ({
        status,
        count: statusCount[status],
      }));

      setChartData(formatted);
    };

    fetchData();
  }, [user?.id]);

  const totalApplications = chartData.reduce(
    (total, item) => total + item.count,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
        <CardDescription>
          Your applications: {totalApplications}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={{}}>
          <BarChart
            width={350}
            height={200}
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={6} barSize={30}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={STATUS_COLORS[entry.status] ?? "#a3a3a3"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
