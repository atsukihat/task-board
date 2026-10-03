import { PlusIcon } from "./icons";

type Props = {
  taskCount: number;
  onNewTask: () => void;
};

export function BoardHeader({ taskCount, onNewTask }: Props) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-baseline gap-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">TaskBoard</h1>
        <p className="text-subtle">{taskCount}件のタスク</p>
      </div>
      <button
        type="button"
        onClick={onNewTask}
        className="flex h-12 items-center gap-3 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:min-w-50"
      >
        <PlusIcon className="size-5" />
        新規タスク
      </button>
    </header>
  );
}
