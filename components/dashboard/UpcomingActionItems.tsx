import { AlertCircle, Building2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UpcomingActionItem } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";

interface UpcomingActionItemsProps {
  items: UpcomingActionItem[];
}

function formatDueDate(date: Date | null): {
  text: string;
  isOverdue: boolean;
  isDueToday: boolean;
} {
  if (!date) {
    return { text: "No due date", isOverdue: false, isDueToday: false };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      isOverdue: true,
      isDueToday: false,
    };
  }
  if (diffDays === 0) {
    return { text: "Due today", isOverdue: false, isDueToday: true };
  }
  if (diffDays === 1) {
    return { text: "Due tomorrow", isOverdue: false, isDueToday: false };
  }
  if (diffDays < 7) {
    return { text: `Due in ${diffDays}d`, isOverdue: false, isDueToday: false };
  }
  return {
    text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isOverdue: false,
    isDueToday: false,
  };
}

export function UpcomingActionItems({ items }: UpcomingActionItemsProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Tasks</CardTitle>
          <CardDescription>Your pending action items</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-sm text-muted-foreground">No pending tasks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
        <CardDescription>Your pending action items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const {
            text: dueDateText,
            isOverdue,
            isDueToday,
          } = formatDueDate(item.dueDate);
          return (
            <div
              key={item.id}
              className={cn(
                "rounded-lg border p-3",
                isOverdue &&
                  "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
                isDueToday &&
                  "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isOverdue && (
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    )}
                    <p className="truncate font-medium">{item.title}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <p className="truncate">
                      {item.companyName} - {item.role}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    isOverdue
                      ? "destructive"
                      : isDueToday
                        ? "default"
                        : "secondary"
                  }
                  className={cn(
                    "shrink-0 text-xs",
                    isDueToday &&
                      !isOverdue &&
                      "bg-amber-600 hover:bg-amber-700",
                  )}
                >
                  <Calendar className="mr-1 h-3 w-3" />
                  {dueDateText}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
