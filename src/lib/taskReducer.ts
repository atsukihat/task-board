import type { Task, TaskStatus } from "@/types/task";

export type TaskAction =
  | { type: "add"; id: string; title: string; description: string; status: TaskStatus }
  | { type: "move"; id: string; status: TaskStatus };

export function taskReducer(tasks: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case "add": {
      const title = action.title.trim();
      if (!title) return tasks;
      return [
        ...tasks,
        {
          id: action.id,
          title,
          description: action.description.trim(),
          status: action.status,
        },
      ];
    }
    case "move": {
      const target = tasks.find((task) => task.id === action.id);
      if (!target || target.status === action.status) return tasks;
      // 移動したタスクは移動先の列の末尾に表示する
      return [
        ...tasks.filter((task) => task.id !== action.id),
        { ...target, status: action.status },
      ];
    }
  }
}

export function tasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}
