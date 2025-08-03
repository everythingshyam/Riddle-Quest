import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  teamName: varchar('team_name', { length: 100 }).notNull(),
  completionTime: integer('completion_time').notNull(), // Time in seconds
  riddlesSolved: integer('riddles_solved').notNull().default(3),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;