"use client";

import { useEffect, useRef, useTransition } from "react";
import {
  createApplication,
  updateApplication,
} from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { applicationStatusValues } from "@/lib/validations/application";
import type { Application } from "./columns";

interface ApplicationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: Application | null;
}

const statusLabels: Record<string, string> = {
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

export function ApplicationSheet({
  open,
  onOpenChange,
  application,
}: ApplicationSheetProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const isEditMode = !!application;

  // Reset form when sheet closes or application changes
  useEffect(() => {
    if (!open && formRef.current) {
      formRef.current.reset();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (isEditMode && application) {
          await updateApplication(application.id, formData);
        } else {
          await createApplication(formData);
        }
        onOpenChange(false);
      } catch (error) {
        console.error(
          `Failed to ${isEditMode ? "update" : "create"} application:`,
          error,
        );
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Application" : "Add Application"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update your job application details."
              : "Add a new job application to your tracker."}
          </SheetDescription>
        </SheetHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="e.g., Google"
              defaultValue={application?.companyName ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g., Software Engineer"
              defaultValue={application?.role ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              defaultValue={application?.status ?? "TO_APPLY"}
              key={application?.id ?? "new"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {applicationStatusValues.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g., San Francisco, CA"
              defaultValue={application?.location ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              name="jobUrl"
              type="url"
              placeholder="https://..."
              defaultValue={application?.jobUrl ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              name="source"
              placeholder="e.g., LinkedIn, Referral"
              defaultValue={application?.source ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={application?.notes ?? ""}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Application"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
