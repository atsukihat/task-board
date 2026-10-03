import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createDataTransfer } from "@/test/dataTransfer";
import type { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { TASK_DRAG_TYPE } from "./dragData";

const task: Task = { id: "t1", title: "買い物", description: "牛乳", status: "todo" };

describe("TaskCard", () => {
  it("タイトルと説明を表示する", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByRole("heading", { name: "買い物" })).toBeInTheDocument();
    expect(screen.getByText("牛乳")).toBeInTheDocument();
  });

  it("説明が空なら説明欄を表示しない", () => {
    render(<TaskCard task={{ ...task, description: "" }} />);
    expect(screen.getByRole("listitem").querySelector("p")).toBeNull();
  });

  it("ドラッグ可能で、ドラッグ開始時にタスクIDを渡す", () => {
    render(<TaskCard task={task} />);
    const card = screen.getByRole("listitem");
    expect(card).toHaveAttribute("draggable", "true");

    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    expect(dataTransfer.getData(TASK_DRAG_TYPE)).toBe("t1");
  });
});
