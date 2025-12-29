"use client";

import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react";
import { useTransition } from "react";
import { deleteApplication } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Application } from "./columns";

interface RowActionsProps {
  application: Application;
  onAddReferral?: (applicationId: string) => void;
  onEdit?: (application: Application) => void;
}

export function RowActions({
  application,
  onAddReferral,
  onEdit,
}: RowActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    startTransition(async () => {
      try {
        await deleteApplication(application.id);
      } catch (error) {
        console.error("Failed to delete application:", error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" disabled={isPending}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAddReferral?.(application.id)}>
          <UserPlus className="h-4 w-4" />
          Add Referral
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(application)}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
