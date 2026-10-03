import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { BoardHeader } from "./BoardHeader";

describe("BoardHeader", () => {
  it("タイトルとタスク件数を表示する", () => {
    render(<BoardHeader taskCount={6} onNewTask={vi.fn()} />);
    expect(screen.getByRole("heading", { level: 1, name: "TaskBoard" })).toBeInTheDocument();
    expect(screen.getByText("6件のタスク")).toBeInTheDocument();
  });

  it("新規タスクボタンで onNewTask を呼ぶ", async () => {
    const onNewTask = vi.fn();
    render(<BoardHeader taskCount={0} onNewTask={onNewTask} />);
    await userEvent.setup().click(screen.getByRole("button", { name: "新規タスク" }));
    expect(onNewTask).toHaveBeenCalledOnce();
  });
});
