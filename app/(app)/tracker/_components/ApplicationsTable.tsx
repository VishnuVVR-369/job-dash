"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplicationSheet } from "./ApplicationSheet";
import { ColumnSettings } from "./ColumnSettings";
import { type Application, columns } from "./columns";
import { DataTable } from "./DataTable";
import { ReferralSheet } from "./ReferralSheet";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={handleAddApplication}>
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
        <ColumnSettings
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>

      <DataTable
        columns={columns}
        data={data}
        columnVisibility={columnVisibility}
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
