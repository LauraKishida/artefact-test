import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  creationDate: z.date(),
  description: z.string().optional().nullable(),
});

export const CreateTaskInput = TaskSchema.omit({
  id: true,
  creationDate: true,
});

export type Task = z.infer<typeof TaskSchema>;
