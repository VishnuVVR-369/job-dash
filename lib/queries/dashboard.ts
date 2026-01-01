import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import db from "@/db";
import { actionItems, applications } from "@/db/schema";

export type DashboardMetrics = {
  total: number;
  interviewing: number;
  offers: number;
  rejections: number;
  responseRate: number;
  pendingTasks: number;
};

export type StatusCount = {
  status: string;
  count: number;
};

export type ApplicationOverTime = {
  date: string;
  applications: number;
};

export type RecentApplication = {
  id: string;
  companyName: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpcomingActionItem = {
  id: string;
  title: string;
  dueDate: Date | null;
  applicationId: string;
  companyName: string;
  role: string;
};

export async function getDashboardMetrics(
  userId: string,
): Promise<DashboardMetrics> {
  const [totalResult, statusCounts, pendingTasksResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(applications)
      .where(eq(applications.userId, userId)),

    db
      .select({
        status: applications.status,
        count: count(),
      })
      .from(applications)
      .where(eq(applications.userId, userId))
      .groupBy(applications.status),

    db
      .select({ count: count() })
      .from(actionItems)
      .where(
        and(eq(actionItems.userId, userId), eq(actionItems.status, "PENDING")),
      ),
  ]);

  const statusMap = new Map<string, number>(
    statusCounts.map((s) => [s.status, s.count]),
  );
  const total = totalResult[0]?.count ?? 0;

  const interviewingStatuses = [
    "TECHNICAL_INTERVIEW",
    "SYSTEM_DESIGN",
    "MANAGERIAL",
  ] as const;
  const interviewing = interviewingStatuses.reduce(
    (sum, status) => sum + (statusMap.get(status) ?? 0),
    0,
  );

  const offers = statusMap.get("OFFER") ?? 0;
  const rejections = statusMap.get("REJECTED") ?? 0;
  const toApply = statusMap.get("TO_APPLY") ?? 0;
  const ghosted = statusMap.get("GHOSTED") ?? 0;

  const responseRate =
    total > 0 ? Math.round(((total - toApply - ghosted) / total) * 100) : 0;

  return {
    total,
    interviewing,
    offers,
    rejections,
    responseRate,
    pendingTasks: pendingTasksResult[0]?.count ?? 0,
  };
}

export async function getApplicationsOverTime(
  userId: string,
  days: number = 30,
): Promise<ApplicationOverTime[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const data = await db
    .select({
      date: sql<string>`DATE(${applications.createdAt})`.as("date"),
      count: count(),
    })
    .from(applications)
    .where(
      and(
        eq(applications.userId, userId),
        gte(applications.createdAt, startDate),
      ),
    )
    .groupBy(sql`DATE(${applications.createdAt})`)
    .orderBy(sql`DATE(${applications.createdAt})`);

  return fillMissingDates(data, days);
}

export async function getStatusDistribution(
  userId: string,
): Promise<StatusCount[]> {
  const data = await db
    .select({
      status: applications.status,
      count: count(),
    })
    .from(applications)
    .where(eq(applications.userId, userId))
    .groupBy(applications.status);

  return data.map((d) => ({ status: d.status, count: d.count }));
}

export async function getRecentApplications(
  userId: string,
  limit: number = 5,
): Promise<RecentApplication[]> {
  return db
    .select({
      id: applications.id,
      companyName: applications.companyName,
      role: applications.role,
      status: applications.status,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
    })
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt))
    .limit(limit);
}

export async function getUpcomingActionItems(
  userId: string,
  limit: number = 5,
): Promise<UpcomingActionItem[]> {
  const result = await db
    .select({
      id: actionItems.id,
      title: actionItems.title,
      dueDate: actionItems.dueDate,
      applicationId: actionItems.applicationId,
      companyName: applications.companyName,
      role: applications.role,
    })
    .from(actionItems)
    .innerJoin(applications, eq(actionItems.applicationId, applications.id))
    .where(
      and(eq(actionItems.userId, userId), eq(actionItems.status, "PENDING")),
    )
    .orderBy(actionItems.dueDate)
    .limit(limit);

  return result;
}

function fillMissingDates(
  data: { date: string; count: number }[],
  days: number,
): ApplicationOverTime[] {
  const result: ApplicationOverTime[] = [];
  const dataMap = new Map(data.map((d) => [d.date, d.count]));

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      applications: dataMap.get(dateStr) ?? 0,
    });
  }

  return result;
}
