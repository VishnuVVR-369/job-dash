"use client";

import type { ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplicationSheet } from "./ApplicationSheet";
import { ColumnSettings } from "./ColumnSettings";
import { type Application, columns } from "./columns";
import { DataTable } from "./DataTable";
import { ReferralSheet } from "./ReferralSheet";
import { TableFilters } from "./TableFilters";

const COLUMN_VISIBILITY_KEY = "tracker-column-visibility";

// Default visible columns (essential only)
const DEFAULT_VISIBLE_COLUMNS: Record<string, boolean> = {
  companyName: true,
  role: true,
  status: true,
  createdAt: true,
  location: false,
  jobUrl: false,
  source: false,
  notes: false,
  actions: true,
};

interface ApplicationsTableProps {
  data: Application[];
}

export function ApplicationsTable({ data }: ApplicationsTableProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [referralApplication, setReferralApplication] =
    useState<Application | null>(null);
  const [columnVisibility, setColumnVisibility] = useState(
    DEFAULT_VISIBLE_COLUMNS,
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  // Track if we've loaded from localStorage to avoid overwriting on first render
  const isInitialized = useRef(false);

  // Load column visibility from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLUMN_VISIBILITY_KEY);
      if (stored) {
        setColumnVisibility({ ...DEFAULT_VISIBLE_COLUMNS, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore parse errors
    }
    isInitialized.current = true;
  }, []);

  // Persist column visibility to localStorage (only after initial load)
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
    }
  }, [columnVisibility]);

  // Derived values for filters
  const companySearch =
    (columnFilters.find((f) => f.id === "companyName")?.value as string) ?? "";
  const statusFilter = columnFilters.find((f) => f.id === "status")
    ?.value as string | undefined;

  // Filter handlers
  const handleCompanySearch = (value: string) => {
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== "companyName");
      return value ? [...others, { id: "companyName", value }] : others;
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleStatusFilter = (value: string | undefined) => {
    setColumnFilters((prev) => {
      const others = prev.filter((f) => f.id !== "status");
      return value ? [...others, { id: "status", value }] : others;
    });
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleAddApplication = () => {
    setSelectedApplication(null);
    setSheetOpen(true);
  };

  const handleEdit = (application: Application) => {
    setSelectedApplication(application);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedApplication(null);
    }
  };

  const handleAddReferral = (applicationId: string) => {
    const app = data.find((a) => a.id === applicationId);
    setReferralApplication(app ?? null);
    setReferralOpen(true);
  };

  const handleReferralClose = (open: boolean) => {
    setReferralOpen(open);
    if (!open) {
      setReferralApplication(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TableFilters
          companySearch={companySearch}
          onCompanySearchChange={handleCompanySearch}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilter}
        />
        <div className="flex items-center gap-2">
          <Button onClick={handleAddApplication}>
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
          <ColumnSettings
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        columnVisibility={columnVisibility}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        pagination={pagination}
        onPaginationChange={setPagination}
        meta={{
          onAddReferral: handleAddReferral,
          onEdit: handleEdit,
        }}
      />

      <ApplicationSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        application={selectedApplication}
      />
      <ReferralSheet
        open={referralOpen}
        onOpenChange={handleReferralClose}
        application={referralApplication}
      />
    </div>
  );
}
