"use server";

import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import db from "@/db";
import { applications, referrals } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createReferralSchema } from "@/lib/validations/referral";

export async function getReferralsByApplicationId(applicationId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db.query.referrals.findMany({
    where: and(
      eq(referrals.applicationId, applicationId),
      eq(referrals.userId, session.user.id),
    ),
    orderBy: [desc(referrals.createdAt)],
  });
}

export async function deleteReferral(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(referrals)
    .where(and(eq(referrals.id, id), eq(referrals.userId, session.user.id)));

  revalidatePath("/tracker");
  return { success: true };
}

export async function createReferral(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const applicationId = formData.get("applicationId") as string;

  // Verify application belongs to user
  const application = await db.query.applications.findFirst({
    where: and(
      eq(applications.id, applicationId),
      eq(applications.userId, session.user.id),
    ),
  });

  if (!application) {
    throw new Error("Application not found");
  }

  const rawData = {
    applicationId,
    name: formData.get("name"),
    source: formData.get("source") || null,
    notes: formData.get("notes") || null,
  };

  const validatedData = createReferralSchema.parse(rawData);

  await db.insert(referrals).values({
    id: nanoid(),
    userId: session.user.id,
    applicationId: validatedData.applicationId,
    name: validatedData.name,
    source: validatedData.source ?? null,
    notes: validatedData.notes ?? null,
  });

  // Update application status to REFERRAL_REQUESTED if it's still TO_APPLY
  if (application.status === "TO_APPLY") {
    await db
      .update(applications)
      .set({ status: "REFERRAL_REQUESTED" })
      .where(eq(applications.id, applicationId));
  }

  revalidatePath("/tracker");
  return { success: true };
}
