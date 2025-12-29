"use server";

import { and, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import db from "@/db";
import { applicationHistory, applications } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createApplicationSchema,
  updateApplicationSchema,
} from "@/lib/validations/application";

export async function getApplications() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return db.query.applications.findMany({
    where: eq(applications.userId, session.user.id),
    orderBy: [desc(applications.createdAt)],
  });
}

export async function createApplication(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    companyName: formData.get("companyName"),
    role: formData.get("role"),
    location: formData.get("location") || null,
    jobUrl: formData.get("jobUrl") || null,
    source: formData.get("source") || null,
    status: formData.get("status") || "TO_APPLY",
    notes: formData.get("notes") || null,
  };

  const validatedData = createApplicationSchema.parse(rawData);

  await db.insert(applications).values({
    id: nanoid(),
    userId: session.user.id,
    companyName: validatedData.companyName,
    role: validatedData.role,
    location: validatedData.location ?? null,
    jobUrl: validatedData.jobUrl ?? null,
    source: validatedData.source ?? null,
    status: validatedData.status,
    notes: validatedData.notes ?? null,
  });

  revalidatePath("/tracker");
  return { success: true };
}

export async function updateApplication(id: string, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Fetch current application to check for status changes
  const currentApplication = await db.query.applications.findFirst({
    where: and(
      eq(applications.id, id),
      eq(applications.userId, session.user.id),
    ),
  });

  if (!currentApplication) {
    throw new Error("Application not found");
  }

  const rawData = {
    companyName: formData.get("companyName"),
    role: formData.get("role"),
    location: formData.get("location") || null,
    jobUrl: formData.get("jobUrl") || null,
    source: formData.get("source") || null,
    status: formData.get("status"),
    notes: formData.get("notes") || null,
  };

  const validatedData = updateApplicationSchema.parse(rawData);

  // If status changed, record in application_history
  if (
    validatedData.status &&
    validatedData.status !== currentApplication.status
  ) {
    await db.insert(applicationHistory).values({
      id: nanoid(),
      applicationId: id,
      fromStatus: currentApplication.status,
      toStatus: validatedData.status,
      notes: null,
    });
  }

  await db
    .update(applications)
    .set({
      ...validatedData,
      location: validatedData.location ?? null,
      jobUrl: validatedData.jobUrl ?? null,
      source: validatedData.source ?? null,
      notes: validatedData.notes ?? null,
    })
    .where(eq(applications.id, id));

  revalidatePath("/tracker");
  return { success: true };
}

export async function deleteApplication(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.delete(applications).where(eq(applications.id, id));

  revalidatePath("/tracker");
  return { success: true };
}
