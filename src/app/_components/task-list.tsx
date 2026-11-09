"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { api } from "@/trpc/react";

export function TaskList() {
  const [ascending, setAscending] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [data] = api.task.list.useSuspenseQuery({ ascending, cursor });

  const changePage = (next: number) => {
    startTransition(() => setCursor(next));
  };

  const toggleSort = () => {
    startTransition(() => {
      setAscending((prev) => !prev);
      setCursor(0);
    });
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleReachEnd = useCallback(() => {
    changePage(cursor + 1);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
    if (atBottom) handleReachEnd?.();
  }, [handleReachEnd]);

  return (
    <div
      className={`w-full max-w-2xl space-y-4 transition-opacity ${isPending ? "opacity-50" : ""}`}
    >
      {/* Header + sort toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button
          onClick={toggleSort}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
        >
          {ascending ? "↑ Oldest first" : "↓ Newest first"}
        </button>
      </div>

      {/* Scrollable task list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-96 overflow-y-auto rounded-xl border border-white/10 p-2"
      >
        {!data.items.length ? (
          <p className="p-4 text-center text-white/60">No tasks yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.items.map((task) => (
              <li key={task.id} className="rounded-lg bg-white/10 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-sm text-white/70">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <time className="shrink-0 text-xs text-white/50">
                    {task.creationDate.toLocaleDateString()}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-white/50">
        <span>
          Page {cursor + 1} · {data.total} task{data.total !== 1 && "s"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => changePage(cursor - 1)}
            disabled={cursor === 0}
            className="rounded-lg bg-white/10 px-3 py-1 transition hover:bg-white/20 disabled:opacity-30"
          >
            ← Prev
          </button>
          <button
            onClick={() => changePage(cursor + 1)}
            disabled={data.nextCursor === null}
            className="rounded-lg bg-white/10 px-3 py-1 transition hover:bg-white/20 disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
