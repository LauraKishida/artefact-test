import Link from "next/link";
import { TaskFormComponent } from "@/app/_components/task-form-component";

export default function NewTaskPage() {
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
            Create Task
          </h1>
          <p className="mt-1 text-xs text-white/50">
            Fill in the details below to add a new task.
          </p>

          <TaskFormComponent mode="create" />
        </div>
      </div>
    </main>
  );
}

