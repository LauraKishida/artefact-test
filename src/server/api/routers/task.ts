import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { CreateTaskInput } from "@/server/schemas/task_schema";
import type { Task } from "@/server/schemas/task_schema";
import { randomUUID } from "crypto";

const PAGE_SIZE = 10;

const randomPastDate = (daysBack = 30): Date =>
  new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000);

// Mock DB — Map keyed by task id
const tasks = new Map<string, Task>();

// Seed with sample tasks
const seedTasks: Omit<Task, "id">[] = [
  { title: "Have a blood test", creationDate: randomPastDate(), description: "Don't eat in the 8 hours prior to the test." },
  { title: "Buy groceries", creationDate: randomPastDate(), description: "Milk, eggs, bread, and fruit." },
  { title: "Fix leaking faucet", creationDate: randomPastDate(), description: null },
  { title: "Schedule dentist appointment", creationDate: randomPastDate(), description: "Call Dr. Silva's office." },
  { title: "Finish quarterly report", creationDate: randomPastDate(), description: "Due by end of month." },
  { title: "Renew car insurance", creationDate: randomPastDate(), description: "Policy expires next week." },
  { title: "Clean out garage", creationDate: randomPastDate(), description: null },
  { title: "Update resume", creationDate: randomPastDate(), description: "Add latest project experience." },
  { title: "Pay electricity bill", creationDate: randomPastDate(), description: "Due on the 15th." },
  { title: "Call plumber", creationDate: randomPastDate(), description: "Kitchen sink is clogged." },
  { title: "Read 'Clean Code'", creationDate: randomPastDate(), description: "Finish chapters 5-8." },
  { title: "Plan weekend trip", creationDate: randomPastDate(), description: "Check hotel availability." },
  { title: "Organise photo albums", creationDate: randomPastDate(), description: null },
  { title: "Set up home backup", creationDate: randomPastDate(), description: "Configure NAS backup schedule." },
  { title: "Water the plants", creationDate: randomPastDate(), description: "Especially the orchids." },
];

for (const seed of seedTasks) {
  const id = randomUUID();
  tasks.set(id, { id, ...seed });
}

export const taskRouter = createTRPCRouter({
  /**
   * Creates a new task.
   */
  create: publicProcedure.input(CreateTaskInput).mutation(({ input }) => {
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description,
      creationDate: new Date(),
    };
    tasks.set(task.id, task);
    return task;
  }),

  /**
   * Returns a paginated list of tasks sorted by creationDate.
   *
   * @param ascending - When true, oldest first; when false, newest first.
   * @param cursor    - The page number (0-based). Omit or pass 0 for the first page.
   */
  list: publicProcedure
    .input(
      z.object({
        ascending: z.boolean().default(false),
        cursor: z.number().int().nonnegative().default(0),
      }),
    )
    .query(({ input }) => {
          const sorted = [...tasks.values()].sort((a, b) => {
            const diff = a.creationDate.getTime() - b.creationDate.getTime();
            return input.ascending ? diff : -diff;
          });

          const start = input.cursor * PAGE_SIZE;
          const items = sorted.slice(start, start + PAGE_SIZE);
          const nextCursor =
            start + PAGE_SIZE < sorted.length ? input.cursor + 1 : null;

          return { items, nextCursor, total: sorted.length };
        }),

        /**
         * Updates an existing task. Only the provided fields are updated;
         * omitted (or null) fields keep their current values.
         */
        update: publicProcedure
          .input(
            z.object({
              id: z.string().uuid(),
              title: z.string().min(1).nullish(),
              description: z.string().nullish(),
            }),
          )
          .mutation(({ input }) => {
            const existing = tasks.get(input.id);

            if (!existing) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: `Task with id "${input.id}" not found.`,
              });
            }

            const updated: Task = {
              ...existing,
              ...(input.title != null && { title: input.title }),
              ...(input.description !== undefined && {
                description: input.description,
              }),
            };

            tasks.set(updated.id, updated);
            return updated;
          }),

        /**
         * Deletes a task by its GUID.
         */
        delete: publicProcedure
          .input(z.object({ id: z.string().uuid() }))
          .mutation(({ input }) => {
            const existed = tasks.delete(input.id);

            if (!existed) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: `Task with id "${input.id}" not found.`,
              });
            }

            return { success: true };
          }),
      });
