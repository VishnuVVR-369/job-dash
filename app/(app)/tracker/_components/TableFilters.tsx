"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  applicationStatusValues,
  type ApplicationStatus,
} from "@/lib/validations/application";

const statusLabels: Record<ApplicationStatus, string> = {
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

interface TableFiltersProps {
  companySearch: string;
  onCompanySearchChange: (value: string) => void;
  statusFilter: string | undefined;
  onStatusFilterChange: (value: string | undefined) => void;
}

export function TableFilters({
  companySearch,
  onCompanySearchChange,
  statusFilter,
  onStatusFilterChange,
}: TableFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search companies..."
          value={companySearch}
          onChange={(e) => onCompanySearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {companySearch && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
            onClick={() => onCompanySearchChange("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <Select
        value={statusFilter || "ALL"}
        onValueChange={(value) =>
          onStatusFilterChange(value === "ALL" ? undefined : value)
        }
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          {applicationStatusValues.map((status) => (
            <SelectItem key={status} value={status}>
              {statusLabels[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
