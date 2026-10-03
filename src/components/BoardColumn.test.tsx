import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createDataTransfer } from "@/test/dataTransfer";
import type { ComponentProps } from "react";
import type { Task } from "@/types/task";
import { BoardColumn } from "./BoardColumn";
import { TASK_DRAG_TYPE } from "./dragData";

const tasks: Task[] = [
  { id: "1", title: "A", description: "", status: "done" },
  { id: "2", title: "B", description: "", status: "done" },
];

// jsdom には DragEvent が無く relatedTarget が初期化されないため、直接設定する
function dragLeave(element: HTMLElement, relatedTarget: Element | null) {
  const event = createEvent.dragLeave(element, { dataTransfer: createDataTransfer() });
  Object.defineProperty(event, "relatedTarget", { value: relatedTarget });
  fireEvent(element, event);
}

function renderColumn(props: Partial<ComponentProps<typeof BoardColumn>> = {}) {
  const handlers = {
    onStartAdd: vi.fn(),
    onCancelAdd: vi.fn(),
    onAddTask: vi.fn(),
    onDropTask: vi.fn(),
  };
  render(
    <BoardColumn
      status="done"
      title="完了"
      tasks={tasks}
      isAdding={false}
      {...handlers}
      {...props}
    />,
  );
  return { column: screen.getByRole("region", { name: "完了" }), ...handlers };
}

describe("BoardColumn", () => {
  it("列名・件数・タスクを表示する", () => {
    const { column } = renderColumn();
    expect(screen.getByRole("heading", { name: "完了" })).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(column.querySelectorAll("li")).toHaveLength(2);
  });

  it("「タスクを追加」で自分のステータスを渡して onStartAdd を呼ぶ", async () => {
    const { onStartAdd } = renderColumn();
    await userEvent.setup().click(screen.getByRole("button", { name: "タスクを追加" }));
    expect(onStartAdd).toHaveBeenCalledWith("done");
  });

  it("追加中はフォームを表示し、送信内容に自分のステータスを付けて渡す", async () => {
    const user = userEvent.setup();
    const { onAddTask } = renderColumn({ isAdding: true });
    expect(screen.queryByRole("button", { name: "タスクを追加" })).toBeNull();

    await user.type(screen.getByLabelText("タイトル"), "振り返り{Enter}");
    expect(onAddTask).toHaveBeenCalledWith("振り返り", "", "done");
  });

  it("ドロップされたタスクIDと自分のステータスで onDropTask を呼ぶ", () => {
    const { column, onDropTask } = renderColumn();
    const dataTransfer = createDataTransfer();
    dataTransfer.setData(TASK_DRAG_TYPE, "abc");

    fireEvent.drop(column, { dataTransfer });
    expect(onDropTask).toHaveBeenCalledWith("abc", "done");
  });

  it("タスクID以外のドロップは無視する", () => {
    const { column, onDropTask } = renderColumn();
    fireEvent.drop(column, { dataTransfer: createDataTransfer() });
    expect(onDropTask).not.toHaveBeenCalled();
  });

  it("ドラッグ中は強調表示し、離れるかドロップで解除する", () => {
    const { column } = renderColumn();
    const dataTransfer = createDataTransfer();

    fireEvent.dragOver(column, { dataTransfer });
    expect(column).toHaveAttribute("data-over", "true");
    dragLeave(column, document.body);
    expect(column).toHaveAttribute("data-over", "false");

    fireEvent.dragOver(column, { dataTransfer });
    fireEvent.drop(column, { dataTransfer });
    expect(column).toHaveAttribute("data-over", "false");
  });

  it("列内の子要素へ移動しても強調表示を維持する", () => {
    const { column } = renderColumn();
    const dataTransfer = createDataTransfer();

    fireEvent.dragOver(column, { dataTransfer });
    dragLeave(column, column.querySelector("li"));
    expect(column).toHaveAttribute("data-over", "true");
  });
});
