"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StatusCount } from "@/lib/queries/dashboard";

interface StatusDistributionChartProps {
  data: StatusCount[];
}

const STATUS_COLORS: Record<string, string> = {
  TO_APPLY: "hsl(215, 70%, 60%)",
  REFERRAL_REQUESTED: "hsl(215, 60%, 50%)",
  APPLIED: "hsl(200, 70%, 50%)",
  ONLINE_ASSESSMENT: "hsl(270, 60%, 60%)",
  TECHNICAL_INTERVIEW: "hsl(280, 60%, 55%)",
  SYSTEM_DESIGN: "hsl(290, 55%, 50%)",
  MANAGERIAL: "hsl(300, 50%, 55%)",
  OFFER: "hsl(142, 70%, 45%)",
  REJECTED: "hsl(0, 65%, 55%)",
  GHOSTED: "hsl(30, 70%, 55%)",
  WITHDRAWN: "hsl(45, 60%, 50%)",
};

const STATUS_LABELS: Record<string, string> = {
  TO_APPLY: "To Apply",
  REFERRAL_REQUESTED: "Referral Requested",
  APPLIED: "Applied",
  ONLINE_ASSESSMENT: "Online Assessment",
  TECHNICAL_INTERVIEW: "Technical Interview",
  SYSTEM_DESIGN: "System Design",
  MANAGERIAL: "Managerial",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

export function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_LABELS[d.status] ?? d.status,
      value: d.count,
      status: d.status,
    }));

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
          <CardDescription>Application status breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No applications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
        <CardDescription>{total} total applications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? "hsl(var(--muted))"}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const data = payload[0];
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-sm shadow-lg">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-muted-foreground">
                        {data.value} application
                        {Number(data.value) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
