import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

const db = drizzle(pool, { schema });

const USER_ID = process.env.USER_ID as string;

if (!USER_ID) {
  console.error("ERROR: USER_ID is not set in .env file");
  console.error("Please set USER_ID to a valid user ID before running seed");
  process.exit(1);
}

function generateId(): string {
  return crypto.randomUUID();
}

async function seed() {
  console.log("Seeding database...");

  // Application IDs for reference
  const applicationIds = {
    toApply: generateId(),
    referralRequested: generateId(),
    applied: generateId(),
    onlineAssessment: generateId(),
    technicalInterview: generateId(),
    systemDesign: generateId(),
    managerial: generateId(),
    offer: generateId(),
    rejected: generateId(),
    ghosted: generateId(),
    withdrawn: generateId(),
  };

  // Seed Applications - covering all statuses
  const applicationsData: (typeof schema.applications.$inferInsert)[] = [
    {
      id: applicationIds.toApply,
      userId: USER_ID,
      companyName: "Google",
      role: "Software Engineer L4",
      location: "Mountain View, CA",
      jobUrl: "https://careers.google.com/jobs/12345",
      source: "LinkedIn",
      status: "TO_APPLY",
      notes: "Need to prepare resume for this role",
    },
    {
      id: applicationIds.referralRequested,
      userId: USER_ID,
      companyName: "Meta",
      role: "Frontend Engineer E5",
      location: "Menlo Park, CA",
      jobUrl: "https://www.metacareers.com/jobs/67890",
      source: "Company Website",
      status: "REFERRAL_REQUESTED",
      notes: "Reached out to John for referral",
    },
    {
      id: applicationIds.applied,
      userId: USER_ID,
      companyName: "Amazon",
      role: "SDE II",
      location: "Seattle, WA",
      jobUrl: "https://amazon.jobs/en/jobs/123456",
      source: "Indeed",
      status: "APPLIED",
      notes: "Applied on Dec 15, 2024",
    },
    {
      id: applicationIds.onlineAssessment,
      userId: USER_ID,
      companyName: "Microsoft",
      role: "Software Engineer II",
      location: "Redmond, WA",
      jobUrl: "https://careers.microsoft.com/us/en/job/789012",
      source: "Referral",
      status: "ONLINE_ASSESSMENT",
      notes: "OA scheduled for next week - DSA focus",
    },
    {
      id: applicationIds.technicalInterview,
      userId: USER_ID,
      companyName: "Apple",
      role: "iOS Engineer",
      location: "Cupertino, CA",
      jobUrl: "https://jobs.apple.com/en-us/details/345678",
      source: "LinkedIn",
      status: "TECHNICAL_INTERVIEW",
      notes: "Technical round with 2 engineers - Swift & system design",
    },
    {
      id: applicationIds.systemDesign,
      userId: USER_ID,
      companyName: "Netflix",
      role: "Senior Software Engineer",
      location: "Los Gatos, CA",
      jobUrl: "https://jobs.netflix.com/jobs/901234",
      source: "Company Website",
      status: "SYSTEM_DESIGN",
      notes: "System design round - Design Netflix recommendation system",
    },
    {
      id: applicationIds.managerial,
      userId: USER_ID,
      companyName: "Stripe",
      role: "Backend Engineer",
      location: "San Francisco, CA",
      jobUrl: "https://stripe.com/jobs/567890",
      source: "AngelList",
      status: "MANAGERIAL",
      notes: "Final round with hiring manager",
    },
    {
      id: applicationIds.offer,
      userId: USER_ID,
      companyName: "Airbnb",
      role: "Full Stack Engineer",
      location: "San Francisco, CA",
      jobUrl: "https://careers.airbnb.com/positions/234567",
      source: "Referral",
      status: "OFFER",
      notes: "Received offer: $180k base + equity. Need to respond by Jan 5",
    },
    {
      id: applicationIds.rejected,
      userId: USER_ID,
      companyName: "Uber",
      role: "Software Engineer",
      location: "San Francisco, CA",
      jobUrl: "https://www.uber.com/careers/890123",
      source: "LinkedIn",
      status: "REJECTED",
      notes: "Rejected after technical round - feedback: need more system design practice",
    },
    {
      id: applicationIds.ghosted,
      userId: USER_ID,
      companyName: "Lyft",
      role: "Backend Engineer",
      location: "San Francisco, CA",
      jobUrl: "https://www.lyft.com/careers/456789",
      source: "Indeed",
      status: "GHOSTED",
      notes: "No response after 3 weeks post-application",
    },
    {
      id: applicationIds.withdrawn,
      userId: USER_ID,
      companyName: "DoorDash",
      role: "Software Engineer",
      location: "San Francisco, CA",
      jobUrl: "https://careers.doordash.com/012345",
      source: "Company Website",
      status: "WITHDRAWN",
      notes: "Withdrew - accepted another offer",
    },
  ];

  console.log("Inserting applications...");
  await db.insert(schema.applications).values(applicationsData);

  // Seed Application History - showing progression
  const applicationHistoryData: (typeof schema.applicationHistory.$inferInsert)[] = [
    // Applied application history
    {
      id: generateId(),
      applicationId: applicationIds.applied,
      fromStatus: "TO_APPLY",
      toStatus: "APPLIED",
      notes: "Submitted application through portal",
    },
    // Online Assessment history
    {
      id: generateId(),
      applicationId: applicationIds.onlineAssessment,
      fromStatus: "TO_APPLY",
      toStatus: "APPLIED",
      notes: "Referral submitted application",
    },
    {
      id: generateId(),
      applicationId: applicationIds.onlineAssessment,
      fromStatus: "APPLIED",
      toStatus: "ONLINE_ASSESSMENT",
      notes: "Received OA link",
    },
    // Technical Interview history
    {
      id: generateId(),
      applicationId: applicationIds.technicalInterview,
      fromStatus: "TO_APPLY",
      toStatus: "APPLIED",
      notes: "Applied via LinkedIn Easy Apply",
    },
    {
      id: generateId(),
      applicationId: applicationIds.technicalInterview,
      fromStatus: "APPLIED",
      toStatus: "ONLINE_ASSESSMENT",
      notes: "Completed HackerRank assessment",
    },
    {
      id: generateId(),
      applicationId: applicationIds.technicalInterview,
      fromStatus: "ONLINE_ASSESSMENT",
      toStatus: "TECHNICAL_INTERVIEW",
      notes: "Passed OA, scheduled technical interview",
    },
    // System Design history
    {
      id: generateId(),
      applicationId: applicationIds.systemDesign,
      fromStatus: "TO_APPLY",
      toStatus: "APPLIED",
    },
    {
      id: generateId(),
      applicationId: applicationIds.systemDesign,
      fromStatus: "APPLIED",
      toStatus: "TECHNICAL_INTERVIEW",
      notes: "Phone screen passed",
    },
    {
      id: generateId(),
      applicationId: applicationIds.systemDesign,
      fromStatus: "TECHNICAL_INTERVIEW",
      toStatus: "SYSTEM_DESIGN",
      notes: "Moving to system design round",
    },
    // Offer history (full journey)
    {
      id: generateId(),
      applicationId: applicationIds.offer,
      fromStatus: "TO_APPLY",
      toStatus: "REFERRAL_REQUESTED",
    },
    {
      id: generateId(),
      applicationId: applicationIds.offer,
      fromStatus: "REFERRAL_REQUESTED",
      toStatus: "APPLIED",
      notes: "Referral submitted",
    },
    {
      id: generateId(),
      applicationId: applicationIds.offer,
      fromStatus: "APPLIED",
      toStatus: "TECHNICAL_INTERVIEW",
    },
    {
      id: generateId(),
      applicationId: applicationIds.offer,
      fromStatus: "TECHNICAL_INTERVIEW",
      toStatus: "SYSTEM_DESIGN",
    },
    {
      id: generateId(),
      applicationId: applicationIds.offer,
      fromStatus: "SYSTEM_DESIGN",
      toStatus: "MANAGERIAL",
    },
    {
      id: generateId(),
      applicationId: applicationIds.offer,
      fromStatus: "MANAGERIAL",
      toStatus: "OFFER",
      notes: "Received verbal offer!",
    },
    // Rejected history
    {
      id: generateId(),
      applicationId: applicationIds.rejected,
      fromStatus: "TO_APPLY",
      toStatus: "APPLIED",
    },
    {
      id: generateId(),
      applicationId: applicationIds.rejected,
      fromStatus: "APPLIED",
      toStatus: "TECHNICAL_INTERVIEW",
    },
    {
      id: generateId(),
      applicationId: applicationIds.rejected,
      fromStatus: "TECHNICAL_INTERVIEW",
      toStatus: "REJECTED",
      notes: "Feedback: system design needs improvement",
    },
    // Withdrawn history
    {
      id: generateId(),
      applicationId: applicationIds.withdrawn,
      fromStatus: "TO_APPLY",
      toStatus: "APPLIED",
    },
    {
      id: generateId(),
      applicationId: applicationIds.withdrawn,
      fromStatus: "APPLIED",
      toStatus: "WITHDRAWN",
      notes: "Accepted Airbnb offer",
    },
  ];

  console.log("Inserting application history...");
  await db.insert(schema.applicationHistory).values(applicationHistoryData);

  // Referral IDs for reference
  const referralIds = {
    meta: generateId(),
    airbnb: generateId(),
    microsoft: generateId(),
  };

  // Seed Referrals
  const referralsData: (typeof schema.referrals.$inferInsert)[] = [
    {
      id: referralIds.meta,
      userId: USER_ID,
      applicationId: applicationIds.referralRequested,
      name: "John Smith",
      source: "LinkedIn",
      notes: "Ex-colleague from previous company",
    },
    {
      id: referralIds.airbnb,
      userId: USER_ID,
      applicationId: applicationIds.offer,
      name: "Sarah Johnson",
      source: "University Alumni Network",
      notes: "Met at alumni meetup",
    },
    {
      id: referralIds.microsoft,
      userId: USER_ID,
      applicationId: applicationIds.onlineAssessment,
      name: "Mike Chen",
      source: "Tech Meetup",
      notes: "Senior engineer at Microsoft",
    },
  ];

  console.log("Inserting referrals...");
  await db.insert(schema.referrals).values(referralsData);

  // Seed Action Items - covering all statuses and created by options
  const actionItemsData: (typeof schema.actionItems.$inferInsert)[] = [
    // PENDING action items
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.toApply,
      title: "Update resume for Google role",
      body: "Tailor resume to highlight distributed systems experience",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: "PENDING",
      createdBy: "USER",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.referralRequested,
      referralId: referralIds.meta,
      title: "Follow up with John for referral status",
      body: "Send a polite follow-up message if no response in 3 days",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: "PENDING",
      createdBy: "SYSTEM",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.onlineAssessment,
      title: "Complete Microsoft OA",
      body: "Practice LeetCode medium-hard problems before attempting",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: "PENDING",
      createdBy: "SYSTEM",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.technicalInterview,
      title: "Prepare for Apple technical interview",
      body: "Review Swift fundamentals and iOS architecture patterns",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "PENDING",
      createdBy: "USER",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.systemDesign,
      title: "Study recommendation system design",
      body: "Review collaborative filtering and content-based filtering approaches",
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      status: "PENDING",
      createdBy: "USER",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.offer,
      title: "Respond to Airbnb offer",
      body: "Review total compensation package and negotiate if needed",
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      status: "PENDING",
      createdBy: "USER",
    },
    // COMPLETED action items
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.applied,
      title: "Submit Amazon application",
      body: "Complete all sections and attach resume",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      status: "COMPLETED",
      createdBy: "USER",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.offer,
      title: "Complete Airbnb technical interview",
      body: "Review system design concepts and coding patterns",
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      status: "COMPLETED",
      createdBy: "SYSTEM",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.rejected,
      title: "Uber phone screen preparation",
      body: "Review company values and prepare STAR stories",
      dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      status: "COMPLETED",
      createdBy: "USER",
    },
    // ARCHIVED action items
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.withdrawn,
      title: "Prepare for DoorDash interview",
      body: "No longer needed - withdrew application",
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      status: "ARCHIVED",
      createdBy: "SYSTEM",
    },
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.ghosted,
      title: "Follow up on Lyft application",
      body: "Archived after multiple follow-ups with no response",
      dueDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      status: "ARCHIVED",
      createdBy: "USER",
    },
    // Action item without due date
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.managerial,
      title: "Research Stripe culture and values",
      body: "Review Glassdoor reviews and company blog",
      status: "PENDING",
      createdBy: "USER",
    },
    // Action item without body
    {
      id: generateId(),
      userId: USER_ID,
      applicationId: applicationIds.toApply,
      title: "Research Google team structure",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      status: "PENDING",
      createdBy: "SYSTEM",
    },
  ];

  console.log("Inserting action items...");
  await db.insert(schema.actionItems).values(actionItemsData);

  console.log("Seeding completed successfully!");
  console.log(`
Summary:
- Applications: ${applicationsData.length} (all status types covered)
- Application History: ${applicationHistoryData.length} entries
- Referrals: ${referralsData.length}
- Action Items: ${actionItemsData.length} (all status and createdBy types covered)
  `);
}

seed()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
