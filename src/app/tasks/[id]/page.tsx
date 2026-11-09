"use client";

import { use } from "react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { TaskFormComponent } from "@/app/_components/task-form-component";

type Props = {
  params: Promise<{ id: string }>;
};

export default function TaskEditPage({ params }: Props) {
  const { id } = use(params);

  const {
    data: task,
    isLoading,
    error: queryError,
  } = api.task.byId.useQuery(
    { id },
    {
      enabled: Boolean(id),
    },
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex max-w-xl flex-col items-center justify-center gap-8 px-4 py-16">
        <div className="w-full">
          <Link
            href="/"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
          >
            ← Back to Tasks
          </Link>
        </div>

        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Edit Task
          </h1>
          <p className="mt-1 text-xs text-white/50">ID: {id}</p>

          {isLoading ? (
            <div className="mt-8 flex justify-center py-8">
              <p className="text-white/60">Loading task details…</p>
            </div>
          ) : queryError ? (
            <div className="mt-6 rounded-lg border border-red-500/50 bg-red-500/20 p-4 text-sm text-red-200">
              <p className="font-semibold">Failed to load task</p>
              <p className="mt-1 text-xs text-red-300">{queryError.message}</p>
            </div>
          ) : (
            <TaskFormComponent mode="edit" task={task} />
          )}
        </div>
      </div>
    </main>
  );
}
