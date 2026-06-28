import { pgTable, text, timestamp, date, numeric, integer, boolean, uuid, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(), // Clerk User ID
  displayName: text("display_name"),
  sex: text("sex"),
  dateOfBirth: date("date_of_birth"),
  heightCm: numeric("height_cm"),
  weightKg: numeric("weight_kg"),
  bodyFatPct: numeric("body_fat_pct"),
  activityLevel: text("activity_level"),
  primaryGoal: text("primary_goal"),
  experienceLevel: text("experience_level"),
  dietaryPreference: text("dietary_preference"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const bodyMetricsHistory = pgTable("body_metrics_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id),
  logDate: date("log_date").notNull(),
  weightKg: numeric("weight_kg"),
  bodyFatPct: numeric("body_fat_pct"),
  notes: text("notes"),
}, (t) => ({
  unq: unique().on(t.userId, t.logDate),
}));

export const exerciseLibrary = pgTable("exercise_library", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  primaryMuscles: text("primary_muscles").array(),
  secondaryMuscles: text("secondary_muscles").array(),
  equipment: text("equipment"),
  level: text("level"),
  mechanic: text("mechanic"),
  instructions: text("instructions").array(),
  imageUrls: text("image_urls").array(),
});

export const programs = pgTable("programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id"), // null = system template, references Clerk ID
  name: text("name").notNull(),
  description: text("description"),
  goal: text("goal"),
  experienceLevel: text("experience_level"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const programDays = pgTable("program_days", {
  id: uuid("id").primaryKey().defaultRandom(),
  programId: uuid("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
  dayNumber: integer("day_number").notNull(),
  focus: text("focus").notNull(),
});

export const programExercises = pgTable("program_exercises", {
  id: uuid("id").primaryKey().defaultRandom(),
  programDayId: uuid("program_day_id").notNull().references(() => programDays.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").references(() => exerciseLibrary.id),
  sets: integer("sets"),
  reps: text("reps"),
  restSeconds: integer("rest_seconds"),
  sortOrder: integer("sort_order").default(0),
});

export const userPrograms = pgTable("user_programs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id),
  programId: uuid("program_id").notNull().references(() => programs.id),
  startedAt: date("started_at").default(sql`current_date`),
  active: boolean("active").default(true),
});

export const workoutLogs = pgTable("workout_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id),
  programDayId: uuid("program_day_id").references(() => programDays.id),
  logDate: date("log_date").notNull(),
  completed: boolean("completed").default(false),
  perceivedEffort: integer("perceived_effort"),
  notes: text("notes"),
}, (t) => ({
  unq: unique().on(t.userId, t.logDate),
}));

export const exerciseLogs = pgTable("exercise_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workoutLogId: uuid("workout_log_id").notNull().references(() => workoutLogs.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id").references(() => exerciseLibrary.id),
  actualSets: integer("actual_sets"),
  actualReps: text("actual_reps"),
  weightKg: numeric("weight_kg"),
});

export const nutritionTargets = pgTable("nutrition_targets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => profiles.id),
  calculatedAt: timestamp("calculated_at", { withTimezone: true }).defaultNow(),
  bmr: numeric("bmr"),
  tdee: numeric("tdee"),
  calorieTarget: numeric("calorie_target"),
  proteinG: numeric("protein_g"),
  fatG: numeric("fat_g"),
  carbsG: numeric("carbs_g"),
});

export const aiUsageCounters = pgTable("ai_usage_counters", {
  userId: text("user_id").notNull().references(() => profiles.id),
  usageDate: date("usage_date").notNull(),
  callCount: integer("call_count").default(0),
}, (t) => ({
  pk: unique().on(t.userId, t.usageDate),
}));
