import { z } from "zod";

export const createReferralSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  name: z.string().min(1, "Referrer name is required"),
  source: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type CreateReferralInput = z.infer<typeof createReferralSchema>;
