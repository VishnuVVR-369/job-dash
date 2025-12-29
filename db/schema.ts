import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const applicationStatusEnum = pgEnum("application_status", [
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
]);

export const actionItemStatusEnum = pgEnum("action_item_status", [
  "PENDING",
  "COMPLETED",
  "ARCHIVED",
]);

export const actionItemCreatedByEnum = pgEnum("action_item_created_by", [
  "USER",
  "SYSTEM",
]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  companyName: text("company_name").notNull(),
  role: text("role").notNull(),
  location: text("location"),
  jobUrl: text("job_url"),
  source: text("source"),
  status: applicationStatusEnum("status").default("TO_APPLY").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const applicationHistory = pgTable("application_history", {
  id: text("id").primaryKey(),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  fromStatus: applicationStatusEnum("from_status").notNull(),
  toStatus: applicationStatusEnum("to_status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const referrals = pgTable("referrals", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  source: text("source"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const actionItems = pgTable("action_items", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  applicationId: text("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  referralId: text("referral_id"),
  title: text("title").notNull(),
  body: text("body"),
  dueDate: timestamp("due_date"),
  status: actionItemStatusEnum("status").default("PENDING").notNull(),
  createdBy: actionItemCreatedByEnum("created_by").default("SYSTEM").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    user: one(user, {
      fields: [applications.userId],
      references: [user.id],
    }),
    referrals: many(referrals),
    applicationHistory: many(applicationHistory),
    actionItems: many(actionItems),
  }),
);

export const referralsRelations = relations(referrals, ({ one }) => ({
  user: one(user, {
    fields: [referrals.userId],
    references: [user.id],
  }),
  application: one(applications, {
    fields: [referrals.applicationId],
    references: [applications.id],
  }),
}));

export const applicationHistoryRelations = relations(
  applicationHistory,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationHistory.applicationId],
      references: [applications.id],
    }),
  }),
);

export const actionItemsRelations = relations(actionItems, ({ one }) => ({
  user: one(user, {
    fields: [actionItems.userId],
    references: [user.id],
  }),
  application: one(applications, {
    fields: [actionItems.applicationId],
    references: [applications.id],
  }),
}));
