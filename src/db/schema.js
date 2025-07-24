import { pgTable, uuid, varchar, text, timestamp, json } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'Active', 'Planning', 'On Hold'
  priority: varchar('priority', { length: 20 }).notNull().default('Unprioritized'), // 'Unprioritized', 'P1', 'P2', 'P3'
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const engineers = pgTable('engineers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const projectAssignments = pgTable('project_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  engineerId: uuid('engineer_id').references(() => engineers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});