import type { DragEvent } from "react";
import type { Task } from "@/types/task";
import { TASK_DRAG_TYPE } from "./dragData";

type Props = {
  task: Task;
};

export function TaskCard({ task }: Props) {
  const handleDragStart = (e: DragEvent<HTMLLIElement>) => {
    e.dataTransfer.setData(TASK_DRAG_TYPE, task.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab rounded-lg bg-card px-5 pt-[18px] pb-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <h3 className="max-w-[23ch] text-[15px] leading-snug font-semibold break-words">
        {task.title}
      </h3>
      {task.description && (
        <p className="mt-2.5 max-w-[37ch] text-[13px] leading-[1.45] whitespace-pre-wrap break-words text-muted">
          {task.description}
        </p>
      )}
    </li>
  );
}
