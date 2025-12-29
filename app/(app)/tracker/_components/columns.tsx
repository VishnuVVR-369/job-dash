"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import type { ApplicationStatus } from "@/lib/validations/application";
import { RowActions } from "./RowActions";
import { StatusBadge } from "./StatusBadge";

export type Application = {
  id: string;
  companyName: string;
  role: string;
  location: string | null;
  jobUrl: string | null;
  source: string | null;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TableMeta = {
  onAddReferral?: (applicationId: string) => void;
  onEdit?: (application: Application) => void;
};

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("companyName")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }) => format(row.getValue("createdAt"), "MMM d, yyyy"),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => row.getValue("location") || "-",
  },
  {
    accessorKey: "jobUrl",
    header: "Job URL",
    cell: ({ row }) => {
      const url = row.getValue("jobUrl") as string | null;
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4 hover:text-primary/80"
        >
          View
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => row.getValue("source") || "-",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | null;
      return notes ? (
        <div className="max-w-[200px] truncate" title={notes}>
          {notes}
        </div>
      ) : (
        "-"
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      return (
        <RowActions
          application={row.original}
          onAddReferral={meta?.onAddReferral}
          onEdit={meta?.onEdit}
        />
      );
    },
  },
];
