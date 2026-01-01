import { Briefcase, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecentApplication } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

const STATUS_VARIANTS: Record<
  string,
  {
    variant: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  }
> = {
  TO_APPLY: { variant: "secondary" },
  REFERRAL_REQUESTED: { variant: "secondary" },
  APPLIED: { variant: "outline", className: "border-blue-500 text-blue-600" },
  ONLINE_ASSESSMENT: {
    variant: "outline",
    className: "border-purple-500 text-purple-600",
  },
  TECHNICAL_INTERVIEW: {
    variant: "outline",
    className: "border-purple-500 text-purple-600",
  },
  SYSTEM_DESIGN: {
    variant: "outline",
    className: "border-purple-500 text-purple-600",
  },
  MANAGERIAL: {
    variant: "outline",
    className: "border-purple-500 text-purple-600",
  },
  OFFER: {
    variant: "default",
    className: "bg-emerald-600 hover:bg-emerald-700",
  },
  REJECTED: { variant: "destructive" },
  GHOSTED: {
    variant: "outline",
    className: "border-orange-500 text-orange-600",
  },
  WITHDRAWN: { variant: "secondary" },
};

const STATUS_LABELS: Record<string, string> = {
  TO_APPLY: "To Apply",
  REFERRAL_REQUESTED: "Referral",
  APPLIED: "Applied",
  ONLINE_ASSESSMENT: "OA",
  TECHNICAL_INTERVIEW: "Tech Interview",
  SYSTEM_DESIGN: "System Design",
  MANAGERIAL: "Managerial",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  if (applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your latest job applications</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No applications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Your latest job applications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {applications.map((app) => {
          const statusConfig = STATUS_VARIANTS[app.status] ?? {
            variant: "secondary" as const,
          };
          return (
            <div
              key={app.id}
              className="flex items-center justify-between gap-4 rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="truncate font-medium">{app.companyName}</p>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-3 w-3 shrink-0" />
                  <p className="truncate">{app.role}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Badge
                  variant={statusConfig.variant}
                  className={cn("text-xs", statusConfig.className)}
                >
                  {STATUS_LABELS[app.status] ?? app.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(app.updatedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
