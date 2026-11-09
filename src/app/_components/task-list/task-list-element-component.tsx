import type { Task } from "@/schemas/task_schema";

type TaskListElementProps = {
  task: Task;
  onDelete?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
};

export const TaskListElement = ({
  task,
  onDelete,
  onEdit,
}: TaskListElementProps) => {
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
