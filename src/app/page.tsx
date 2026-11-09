import { Suspense } from "react";
import { api, HydrateClient } from "@/trpc/server";
import { TaskList } from "@/app/_components/task-list";

export default async function Home() {
  void api.task.list.prefetch({ ascending: false, cursor: 0 });

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Artefact
          </h1>
          <Suspense fallback={<p className="text-white/60">Loading tasks…</p>}>
            <TaskList />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
