import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/validations/application";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  TO_APPLY: {
    label: "To Apply",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  REFERRAL_REQUESTED: {
    label: "Referral Requested",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  },
  APPLIED: {
    label: "Applied",
    className: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  },
  ONLINE_ASSESSMENT: {
    label: "Online Assessment",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  },
  TECHNICAL_INTERVIEW: {
    label: "Technical Interview",
    className: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
  },
  SYSTEM_DESIGN: {
    label: "System Design",
    className: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  },
  MANAGERIAL: {
    label: "Managerial",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  OFFER: {
    label: "Offer",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
  GHOSTED: {
    label: "Ghosted",
    className: "bg-slate-100 text-slate-800 hover:bg-slate-100",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  },
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "" };

  return (
    <Badge variant="secondary" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
