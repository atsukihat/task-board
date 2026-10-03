import { useCallback, useReducer } from "react";
import { createTaskId } from "@/lib/createTaskId";
import { taskReducer } from "@/lib/taskReducer";
import type { Task, TaskStatus } from "@/types/task";

export function useTaskBoard(initialTasks: Task[] = []) {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);

  const addTask = useCallback(
    (title: string, description: string, status: TaskStatus = "todo") => {
      dispatch({ type: "add", id: createTaskId(), title, description, status });
    },
    [],
  );

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    dispatch({ type: "move", id, status });
  }, []);

  return { tasks, addTask, moveTask };
}
