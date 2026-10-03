import { useState, type DragEvent } from "react";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { TaskForm } from "./TaskForm";
import { TASK_DRAG_TYPE } from "./dragData";
import { MoreIcon, PlusIcon } from "./icons";

type Props = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  isAdding: boolean;
  onStartAdd: (status: TaskStatus) => void;
  onCancelAdd: () => void;
  onAddTask: (title: string, description: string, status: TaskStatus) => void;
  onDropTask: (id: string, status: TaskStatus) => void;
};

export function BoardColumn({
  status,
  title,
  tasks,
  isAdding,
  onStartAdd,
  onCancelAdd,
  onAddTask,
  onDropTask,
}: Props) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    // 列内の子要素へ移っただけなら強調表示を維持する
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsOver(false);
    const id = e.dataTransfer.getData(TASK_DRAG_TYPE);
    if (id) onDropTask(id, status);
  };

  return (
    <section
      aria-labelledby={`column-${status}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-over={isOver}
      className="flex min-h-80 flex-col rounded-2xl bg-column p-5 transition-shadow data-[over=true]:ring-2 data-[over=true]:ring-foreground/15 md:min-h-0"
    >
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-baseline gap-4">
          <h2 id={`column-${status}`} className="text-lg font-semibold">
            {title}
          </h2>
          <span className="text-sm text-subtle">#{tasks.length}</span>
        </div>
        {/* デザイン上の表示のみ（メニュー機能は未実装） */}
        <MoreIcon className="size-5 text-muted" />
      </div>

      <div className="mt-4 mb-3">
        {isAdding ? (
          <TaskForm
            onAdd={(taskTitle, description) => onAddTask(taskTitle, description, status)}
            onCancel={onCancelAdd}
          />
        ) : (
          <button
            type="button"
            onClick={() => onStartAdd(status)}
            className="flex items-center gap-2 rounded-md py-1 text-sm text-muted transition-colors hover:text-foreground"
          >
            <PlusIcon className="size-4" />
            タスクを追加
          </button>
        )}
      </div>

      <ul className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>
    </section>
  );
}
