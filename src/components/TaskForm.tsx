import { useState, type FormEvent, type KeyboardEvent } from "react";

type Props = {
  onAdd: (title: string, description: string) => void;
  onCancel: () => void;
};

export function TaskForm({ onAdd, onCancel }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const canSubmit = title.trim().length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    onAdd(title, description);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Escape") onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      aria-label="タスクを追加"
      className="flex flex-col gap-2 rounded-lg bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-line"
    >
      <label className="sr-only" htmlFor="task-title">
        タイトル
      </label>
      <input
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        autoFocus
        required
        className="bg-transparent text-[15px] font-semibold outline-none placeholder:font-normal placeholder:text-subtle"
      />
      <label className="sr-only" htmlFor="task-description">
        説明
      </label>
      <textarea
        id="task-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="説明（任意）"
        rows={2}
        className="resize-none bg-transparent text-[13px] leading-relaxed text-muted outline-none placeholder:text-subtle"
      />
      <div className="mt-1 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-3 py-1.5 text-sm text-muted hover:bg-column"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          追加
        </button>
      </div>
    </form>
  );
}
