import { Suspense } from "react";
import { api, HydrateClient } from "@/trpc/server";
import { TaskList } from "@/app/_components/task-list/task-list-component";

export default async function Home() {
  await api.task.list.prefetchInfinite({ ascending: false });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Task-Efact
          </h1>
          <h3 className="text-xl font-semibold">
            Developed as a test for Artefact: task management with TRPC,
            Next.js, and Zod.
          </h3>

          <Suspense fallback={<p className="text-white/60">Loading tasks…</p>}>
            <TaskList />
          </Suspense>
          <div className="text-lg">Created by Laura Kishida</div>
        </div>
      </main>
    </HydrateClient>
  );
}
