import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTaskBoard } from "./useTaskBoard";

describe("useTaskBoard", () => {
  it("addTask で一意なIDを持つタスクが追加される", () => {
    const { result } = renderHook(() => useTaskBoard());
    act(() => {
      result.current.addTask("A", "説明A");
      result.current.addTask("B", "");
    });
    const [a, b] = result.current.tasks;
    expect(a).toMatchObject({ title: "A", description: "説明A", status: "todo" });
    expect(b.title).toBe("B");
    expect(a.id).not.toBe(b.id);
  });

  it("addTask で列を指定して追加できる", () => {
    const { result } = renderHook(() => useTaskBoard());
    act(() => result.current.addTask("A", "", "inProgress"));
    expect(result.current.tasks[0].status).toBe("inProgress");
  });

  it("moveTask でステータスが変わる", () => {
    const { result } = renderHook(() =>
      useTaskBoard([{ id: "1", title: "A", description: "", status: "todo" }]),
    );
    act(() => result.current.moveTask("1", "inProgress"));
    expect(result.current.tasks[0].status).toBe("inProgress");
  });
});
