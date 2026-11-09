"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { usePopupToken } from "@/app/_components/popup-token-component";
import { TaskListElement } from "./task-list-element-component";

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
  const [isLoading, setIsLoading] = useState(false);

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
  }).mutateAsync;

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsLoading(true);
      await deleteTask({ id: taskId });
      setIsLoading(false);
    }
  };

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
    setAscending((prev) => !prev);
    setCursor(0);
    scrollRef.current?.scrollTo({ top: 0 });
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

  const isBusy = isLoading || (isFetching && !isFetchingNextPage);

  return (
    <>
      {PopupComponent}
      <div
        className={`w-full max-w-2xl space-y-4 transition-opacity ${
          isBusy ? "pointer-events-none opacity-50 select-none" : ""
        }`}
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
              {isFetchingNextPage && (
                <p className="p-4 text-center text-white/60">
                  Loading more tasks…
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
