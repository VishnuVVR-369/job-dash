import { z } from "zod";

export const applicationStatusValues = [
  "TO_APPLY",
  "REFERRAL_REQUESTED",
  "APPLIED",
  "ONLINE_ASSESSMENT",
  "TECHNICAL_INTERVIEW",
  "SYSTEM_DESIGN",
  "MANAGERIAL",
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "WITHDRAWN",
] as const;

export type ApplicationStatus = (typeof applicationStatusValues)[number];

export const createApplicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional().nullable(),
  jobUrl: z.string().url("Invalid URL").optional().nullable().or(z.literal("")),
  source: z.string().optional().nullable(),
  status: z.enum(applicationStatusValues).default("TO_APPLY"),
  notes: z.string().optional().nullable(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
