import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createDataTransfer } from "@/test/dataTransfer";
import { TaskBoard } from "./TaskBoard";

const column = (name: string) => screen.getByRole("region", { name });

describe("TaskBoard", () => {
  it("未着手・進行中・完了の3列を表示する", () => {
    render(<TaskBoard />);
    expect(screen.getAllByRole("region")).toHaveLength(3);
    for (const name of ["未着手", "進行中", "完了"]) {
      expect(column(name)).toBeInTheDocument();
    }
    expect(screen.getByText("0件のタスク")).toBeInTheDocument();
  });

  it("新規タスクボタンで未着手列にフォームが開き、追加すると閉じる", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(screen.getByRole("button", { name: "新規タスク" }));
    const todo = column("未着手");
    await user.type(within(todo).getByLabelText("タイトル"), "レビュー");
    await user.type(within(todo).getByLabelText("説明"), "PRを確認");
    await user.click(within(todo).getByRole("button", { name: "追加" }));

    const card = within(todo).getByRole("listitem");
    expect(card).toHaveTextContent("レビュー");
    expect(card).toHaveTextContent("PRを確認");
    expect(screen.queryByRole("form")).toBeNull();
    expect(screen.getByText("1件のタスク")).toBeInTheDocument();
  });

  it("各列の「タスクを追加」でその列に追加できる", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    const done = column("完了");
    await user.click(within(done).getByRole("button", { name: "タスクを追加" }));
    await user.type(within(done).getByLabelText("タイトル"), "リリース{Enter}");

    expect(within(done).getByRole("listitem")).toHaveTextContent("リリース");
    expect(within(column("未着手")).queryByRole("listitem")).toBeNull();
  });

  it("フォームは同時に1列だけ開く", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(within(column("未着手")).getByRole("button", { name: "タスクを追加" }));
    await user.click(within(column("進行中")).getByRole("button", { name: "タスクを追加" }));

    expect(screen.getAllByRole("form")).toHaveLength(1);
    expect(within(column("進行中")).getByRole("form")).toBeInTheDocument();
  });

  it("ドラッグでタスクを別の列へ移動できる", async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);

    await user.click(screen.getByRole("button", { name: "新規タスク" }));
    await user.type(screen.getByLabelText("タイトル"), "レビュー{Enter}");

    const card = within(column("未着手")).getByRole("listitem");
    const dataTransfer = createDataTransfer();
    fireEvent.dragStart(card, { dataTransfer });
    fireEvent.drop(column("進行中"), { dataTransfer });

    expect(within(column("未着手")).queryByRole("listitem")).toBeNull();
    expect(within(column("進行中")).getByRole("listitem")).toHaveTextContent("レビュー");
  });
});
