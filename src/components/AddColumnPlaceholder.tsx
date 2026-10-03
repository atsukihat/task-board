import { PlusIcon } from "./icons";

// デザイン上の枠のみ表示する（カラム追加の機能は未実装）
export function AddColumnPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="hidden flex-col items-center justify-center gap-2 rounded-2xl bg-column text-sm text-muted md:flex"
    >
      <PlusIcon className="size-5" />
      カラムを追加
    </div>
  );
}
