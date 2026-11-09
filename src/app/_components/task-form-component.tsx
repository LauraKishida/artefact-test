"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { usePopupToken } from "@/app/_components/popup-token-component";
import type { Task } from "@/schemas/task_schema";

export type TaskFormComponentProps = {
  mode?: "create" | "edit";
  task?:
    Task | { id: string; title: string; description?: string | null } | null;
  initialData?: {
    id?: string;
    title?: string;
    description?: string | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
  submitButtonText?: string;
  submittingButtonText?: string;
  className?: string;
};

export function TaskFormComponent({
  mode,
  task,
  initialData,
  onSuccess,
  onCancel,
  submitButtonText,
  submittingButtonText,
  className = "",
}: TaskFormComponentProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const { showPopup, PopupComponent, setPopupToShow } = usePopupToken();

  const isEdit = mode ? mode === "edit" : Boolean(task?.id ?? initialData?.id);
  const taskId = task?.id ?? initialData?.id;

  const [title, setTitle] = useState(task?.title ?? initialData?.title ?? "");
  const [description, setDescription] = useState(
    task?.description ?? initialData?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
    } else if (initialData) {
      if (initialData.title !== undefined) setTitle(initialData.title);
      if (initialData.description !== undefined)
        setDescription(initialData.description ?? "");
    }
  }, [task, initialData]);

  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      setPopupToShow("Task created successfully!", "success");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    },
    onError: (err) => {
      showPopup(err.message, "error");
      setError(err.message);
    },
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      setPopupToShow("Task updated successfully!", "success");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    },
    onError: (err) => {
      showPopup(err.message, "error");
      setError(err.message);
    },
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      setPopupToShow("Task deleted successfully!", "success");
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    },
    onError: (err) => {
      showPopup(err.message, "error");
      setError(err.message);
    },
  });

  const handleDelete = () => {
    if (!taskId) return;
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate({ id: taskId });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      showPopup("Title is required.", "warning");
      setError("Title is required.");
      return;
    }

    const trimmedDescription = description.trim() ? description.trim() : null;

    if (isEdit) {
      if (!taskId) {
        setError("Cannot update task without an ID.");
        return;
      }
      updateTask.mutate({
        id: taskId,
        title: trimmedTitle,
        description: trimmedDescription,
      });
    } else {
      createTask.mutate({
        title: trimmedTitle,
        description: trimmedDescription,
      });
    }
  };

  const isPending =
    createTask.isPending || updateTask.isPending || deleteTask.isPending;
  const isSubmitting = isEdit ? updateTask.isPending : createTask.isPending;
  const isDeleting = deleteTask.isPending;

  const defaultSubmitText = isEdit ? "Save Changes" : "Create Task";
  const defaultSubmittingText = isEdit ? "Saving…" : "Creating…";

  return (
    <>
      {PopupComponent}
      <form
        onSubmit={handleSubmit}
        className={`mt-6 flex flex-col gap-5 ${className}`}
      >
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/20 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-white/90">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            maxLength={200}
            required
            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-white/40 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-white/90"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description (optional)"
            rows={4}
            maxLength={1000}
            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/30 focus:ring-2 focus:ring-white/40 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete Task"}
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                Cancel
              </button>
            ) : (
              <Link
                href="/"
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                Cancel
              </Link>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {isSubmitting
                ? (submittingButtonText ?? defaultSubmittingText)
                : (submitButtonText ?? defaultSubmitText)}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default TaskFormComponent;
