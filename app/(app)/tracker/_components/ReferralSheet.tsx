"use client";

import { format } from "date-fns";
import { Calendar, MessageSquare, Plus, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  createReferral,
  deleteReferral,
  getReferralsByApplicationId,
} from "@/app/actions/referrals";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { Application } from "./columns";

type Referral = {
  id: string;
  name: string;
  source: string | null;
  notes: string | null;
  requestedAt: Date;
  createdAt: Date;
};

interface ReferralSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: Application | null;
}

export function ReferralSheet({
  open,
  onOpenChange,
  application,
}: ReferralSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Fetch referrals when sheet opens
  useEffect(() => {
    if (open && application?.id) {
      setIsLoading(true);
      setShowForm(false);
      getReferralsByApplicationId(application.id)
        .then((data) => setReferrals(data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [open, application?.id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!application?.id) return;

    const formData = new FormData(e.currentTarget);
    formData.set("applicationId", application.id);

    startTransition(async () => {
      try {
        await createReferral(formData);
        // Refresh referrals list
        const data = await getReferralsByApplicationId(application.id);
        setReferrals(data);
        formRef.current?.reset();
        setShowForm(false);
      } catch (error) {
        console.error("Failed to create referral:", error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this referral?")) return;

    setIsDeleting(id);
    startTransition(async () => {
      try {
        await deleteReferral(id);
        setReferrals((prev) => prev.filter((r) => r.id !== id));
      } catch (error) {
        console.error("Failed to delete referral:", error);
      } finally {
        setIsDeleting(null);
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Referrals</SheetTitle>
          <SheetDescription>
            {application
              ? `Manage referrals for ${application.companyName} - ${application.role}`
              : "Manage referrals for this application"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Existing Referrals */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : referrals.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Existing Referrals ({referrals.length})
              </h3>
              {referrals.map((referral) => (
                <Card key={referral.id} className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{referral.name}</span>
                      </div>
                      {referral.source && (
                        <p className="text-sm text-muted-foreground">
                          {referral.source}
                        </p>
                      )}
                      {referral.notes && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
                          <span className="line-clamp-2">{referral.notes}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Added {format(referral.createdAt, "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(referral.id)}
                      disabled={isDeleting === referral.id}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No referrals yet. Add your first referral below.
            </p>
          )}

          <Separator />

          {/* Add Referral Form */}
          {showForm ? (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-sm font-medium">Add New Referral</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Referrer Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">How do you know them?</Label>
                <Input
                  id="source"
                  name="source"
                  placeholder="e.g., LinkedIn, College friend"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" name="notes" rows={3} />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Adding..." : "Add Referral"}
                </Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4" />
              Add Referral
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
