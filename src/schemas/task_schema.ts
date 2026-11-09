import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid({ message: "Invalid task ID format" }),
  title: z
    .string()
    .trim()
    .min(1, { message: "Title cannot be empty" })
    .max(200, { message: "Title must be 200 characters or fewer" }),
  creationDate: z.date(),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be 1000 characters or fewer" })
    .nullable()
    .optional(),
});

export const CreateTaskInput = TaskSchema.omit({
  id: true,
  creationDate: true,
});

export const UpdateTaskInput = z.object({
  id: z.string().uuid({ message: "Invalid task ID format" }),
  title: z
    .string()
    .trim()
    .min(1, { message: "Title cannot be empty" })
    .max(200, { message: "Title must be 200 characters or fewer" })
    .optional(),
  description: z
    .string()
    .trim()
    .max(1000, { message: "Description must be 1000 characters or fewer" })
    .nullable()
    .optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskInput>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskInput>;
