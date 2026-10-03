export type TaskStatus = "todo" | "inProgress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
};

export const COLUMNS: ReadonlyArray<{ status: TaskStatus; title: string }> = [
  { status: "todo", title: "未着手" },
  { status: "inProgress", title: "進行中" },
  { status: "done", title: "完了" },
];
