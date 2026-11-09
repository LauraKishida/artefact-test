"use client";

import { useCallback, useRef, useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import type { Task } from "@/schemas/task_schema";
import { usePopupToken } from "@/app/_components/popup-token";

type TaskListElementProps = {
  task: Task;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

const TaskListElement = ({ task, onDelete, onEdit }: TaskListElementProps) => {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete?.(task.id);
  };
  const handleEdit = (e: React.MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    onEdit?.(task.id);
  };
  return (
    <li
      className="cursor-pointer rounded-lg bg-white/10 p-4 transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      role="button"
      onClick={handleEdit}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-bold">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-white/70">{task.description}</p>
          )}
        </div>
        <time className="shrink-0 self-center text-xs text-white/50">
          Created: {task.creationDate.toLocaleDateString()}
        </time>
        <button
          onClick={handleDelete}
          className="self-center rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/30 disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export type TaskListProps = {
  onEditTask?: (taskId: string) => void;
  onCreateTask?: () => void;
};

export const TaskList = ({ onEditTask, onCreateTask }: TaskListProps) => {
  const router = useRouter();
  const { showPopup, PopupComponent, shouldShowPopup, resetPopup } =
    usePopupToken();
  const [ascending, setAscending] = useState(false);
  const [, setCursor] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [{ pages }, query] = api.task.list.useSuspenseInfiniteQuery(
    { ascending },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const tasks = pages.flatMap((page) => page.items);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = query;

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void query.refetch();
      showPopup("Task deleted successfully!", "success");
    },
    onError: (err) => {
      showPopup(err.message, "error");
    },
  }).mutate;

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      if (confirm("Are you sure you want to delete this task?")) {
        deleteTask({ id: taskId });
      }
    },
    [deleteTask],
  );

  const handleEdit = (taskId: string) => {
    if (onEditTask) {
      onEditTask(taskId);
    } else {
      router.push(`/tasks/${taskId}`);
    }
  };

  const handleCreate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onCreateTask) {
      e.preventDefault();
      onCreateTask();
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleSort = () => {
    startTransition(() => {
      setAscending((prev) => !prev);
      setCursor(0);
      scrollRef.current?.scrollTo({ top: 0 });
    });
  };
  const handleReachEnd = useCallback(() => {
    fetchNextPage().catch((err) => {
      console.error("Failed to fetch next page of tasks:", err);
    });
  }, [fetchNextPage]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    if (atBottom) handleReachEnd?.();
  }, [handleReachEnd]);

  useEffect(() => {
    if (shouldShowPopup) {
      showPopup();
      resetPopup();
    }
  }, [shouldShowPopup, showPopup, resetPopup]);

  return (
    <>
      {PopupComponent}
      <div
        className={`w-full max-w-2xl space-y-4 transition-opacity ${isPending || isFetchingNextPage || isFetching ? "opacity-50" : ""}`}
      >
        {/* Header + actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <div className="flex items-center gap-3">
            <Link
              href="/tasks/new"
              onClick={handleCreate}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              + Create Task
            </Link>
            <button
              onClick={toggleSort}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
            >
              {ascending ? "↑ Oldest first" : "↓ Newest first"}
            </button>
          </div>
        </div>

        {/* Scrollable task list */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-96 overflow-y-auto rounded-xl border border-white/10 p-2"
        >
          {!tasks.length ? (
            <p className="p-4 text-center text-white/60">No tasks yet.</p>
          ) : (
            <>
              <ul className="space-y-2">
                {tasks.map((task) => (
                  <TaskListElement
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                    onEdit={handleEdit}
                  />
                ))}
              </ul>
              {!hasNextPage && (
                <p className="p-4 text-center text-white/60">
                  You&apos;ve reached the end of the list.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
