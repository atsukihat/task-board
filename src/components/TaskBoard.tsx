"use client";

import { useState } from "react";
import { useTaskBoard } from "@/hooks/useTaskBoard";
import { tasksByStatus } from "@/lib/taskReducer";
import { COLUMNS, type TaskStatus } from "@/types/task";
import { AddColumnPlaceholder } from "./AddColumnPlaceholder";
import { BoardColumn } from "./BoardColumn";
import { BoardHeader } from "./BoardHeader";

export function TaskBoard() {
  const { tasks, addTask, moveTask } = useTaskBoard();
  // 入力フォームを開いている列（同時に開くのは1列だけ）
  const [addingTo, setAddingTo] = useState<TaskStatus | null>(null);

  const handleAddTask = (title: string, description: string, status: TaskStatus) => {
    addTask(title, description, status);
    setAddingTo(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-10 md:gap-14">
      <BoardHeader taskCount={tasks.length} onNewTask={() => setAddingTo("todo")} />
      <div className="grid flex-1 gap-7 md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,0.88fr)]">
        {COLUMNS.map((column) => (
          <BoardColumn
            key={column.status}
            status={column.status}
            title={column.title}
            tasks={tasksByStatus(tasks, column.status)}
            isAdding={addingTo === column.status}
            onStartAdd={setAddingTo}
            onCancelAdd={() => setAddingTo(null)}
            onAddTask={handleAddTask}
            onDropTask={moveTask}
          />
        ))}
        <AddColumnPlaceholder />
      </div>
    </div>
  );
}
