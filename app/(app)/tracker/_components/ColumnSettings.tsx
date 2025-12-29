"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const columnLabels: Record<string, string> = {
  companyName: "Company",
  role: "Role",
  status: "Status",
  createdAt: "Date Added",
  location: "Location",
  jobUrl: "Job URL",
  source: "Source",
  notes: "Notes",
};

interface ColumnSettingsProps {
  columnVisibility: Record<string, boolean>;
  onColumnVisibilityChange: (visibility: Record<string, boolean>) => void;
}

export function ColumnSettings({
  columnVisibility,
  onColumnVisibilityChange,
}: ColumnSettingsProps) {
  const toggleColumn = (columnId: string) => {
    onColumnVisibilityChange({
      ...columnVisibility,
      [columnId]: !columnVisibility[columnId],
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Columns</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48">
        <div className="space-y-2">
          <p className="mb-3 text-sm font-medium">Toggle columns</p>
          {Object.entries(columnLabels).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={columnVisibility[key] !== false}
                onCheckedChange={() => toggleColumn(key)}
              />
              <Label
                htmlFor={key}
                className="cursor-pointer text-sm font-normal"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
