import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TaskForm } from "./TaskForm";

function renderForm() {
  const onAdd = vi.fn();
  const onCancel = vi.fn();
  render(<TaskForm onAdd={onAdd} onCancel={onCancel} />);
  return { onAdd, onCancel, user: userEvent.setup() };
}

describe("TaskForm", () => {
  it("開いた時点でタイトル欄にフォーカスする", () => {
    renderForm();
    expect(screen.getByLabelText("タイトル")).toHaveFocus();
  });

  it("入力したタイトルと説明で onAdd を呼ぶ", async () => {
    const { onAdd, user } = renderForm();
    await user.type(screen.getByLabelText("タイトル"), "買い物");
    await user.type(screen.getByLabelText("説明"), "牛乳を買う");
    await user.click(screen.getByRole("button", { name: "追加" }));
    expect(onAdd).toHaveBeenCalledWith("買い物", "牛乳を買う");
  });

  it("タイトルが空白のみなら追加ボタンは無効", async () => {
    const { user } = renderForm();
    const button = screen.getByRole("button", { name: "追加" });
    expect(button).toBeDisabled();
    await user.type(screen.getByLabelText("タイトル"), "   ");
    expect(button).toBeDisabled();
  });

  it("タイトル入力中に Enter で送信できる", async () => {
    const { onAdd, user } = renderForm();
    await user.type(screen.getByLabelText("タイトル"), "掃除{Enter}");
    expect(onAdd).toHaveBeenCalledWith("掃除", "");
  });

  it("キャンセルボタンと Escape キーで onCancel を呼ぶ", async () => {
    const { onAdd, onCancel, user } = renderForm();
    await user.click(screen.getByRole("button", { name: "キャンセル" }));
    await user.type(screen.getByLabelText("タイトル"), "{Escape}");
    expect(onCancel).toHaveBeenCalledTimes(2);
    expect(onAdd).not.toHaveBeenCalled();
  });
});
