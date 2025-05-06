"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, Cell } from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { TrendingUp } from "lucide-react";
import { db } from "@services/firebase/firebase";

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

const STATUS_COLORS: Record<string, string> = {
  pending: "blue",
  reviewed: "purple",
  interview: "yellow",
  rejected: "red",
  hired: "green",
};

const defaultStatuses: ChartData[] = [
  { status: "pending", count: 0 },
  { status: "reviewed", count: 0 },
  { status: "interview", count: 0 },
  { status: "rejected", count: 0 },
  { status: "hired", count: 0 },
];

interface ChartData {
  status: string;
  count: number;
}

export function OverviewChart() {
  const [chartData, setChartData] = useState<ChartData[]>(defaultStatuses);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return;

      const q = query(
        collection(db, "applications"),
        where("candidateId", "==", user.uid),
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

      snapshot.docs.forEach((doc) => {
        const status = doc.data().status || "pending";
        if (statusCount.hasOwnProperty(status)) {
          statusCount[status]++;
        }
      });

      const formatted = defaultStatuses.map(({ status }) => ({
        status,
        count: statusCount[status],
      }));

      setChartData(formatted);
    });

    return () => unsubscribe();
  }, []);

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
              {" "}
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.status}`}
                  fill={STATUS_COLORS[entry.status] || "#a3a3a3"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
