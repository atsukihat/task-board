import { describe, expect, it } from "vitest";
import type { Task } from "@/types/task";
import { taskReducer, tasksByStatus } from "./taskReducer";

const sample: Task[] = [
  { id: "1", title: "A", description: "", status: "todo" },
  { id: "2", title: "B", description: "", status: "inProgress" },
  { id: "3", title: "C", description: "", status: "todo" },
];

describe("taskReducer: add", () => {
  it("新しいタスクを指定した列の末尾に追加する", () => {
    const result = taskReducer([], {
      type: "add",
      id: "x",
      title: "買い物",
      description: "牛乳",
      status: "todo",
    });
    expect(result).toEqual([
      { id: "x", title: "買い物", description: "牛乳", status: "todo" },
    ]);
  });

  it("タイトルと説明の前後の空白を取り除く", () => {
    const [task] = taskReducer([], {
      type: "add",
      id: "x",
      title: "  買い物 ",
      description: " 牛乳  ",
      status: "todo",
    });
    expect(task.title).toBe("買い物");
    expect(task.description).toBe("牛乳");
  });

  it("タイトルが空白のみなら追加しない", () => {
    const state: Task[] = [];
    const result = taskReducer(state, {
      type: "add",
      id: "x",
      title: "   ",
      description: "説明",
      status: "todo",
    });
    expect(result).toBe(state);
  });
});

describe("taskReducer: add (列指定)", () => {
  it("未着手以外の列にも追加できる", () => {
    const [task] = taskReducer([], {
      type: "add",
      id: "x",
      title: "A",
      description: "",
      status: "done",
    });
    expect(task.status).toBe("done");
  });
});

describe("taskReducer: move", () => {
  it("タスクのステータスを変更し、末尾に移動する", () => {
    const result = taskReducer(sample, { type: "move", id: "1", status: "done" });
    expect(result.map((t) => t.id)).toEqual(["2", "3", "1"]);
    expect(result.find((t) => t.id === "1")?.status).toBe("done");
  });

  it("元の配列を変更しない", () => {
    const before = structuredClone(sample);
    taskReducer(sample, { type: "move", id: "1", status: "done" });
    expect(sample).toEqual(before);
  });

  it("同じ列への移動は状態を変えない", () => {
    const result = taskReducer(sample, { type: "move", id: "1", status: "todo" });
    expect(result).toBe(sample);
  });

  it("存在しないIDは無視する", () => {
    const result = taskReducer(sample, { type: "move", id: "zzz", status: "done" });
    expect(result).toBe(sample);
  });
});

describe("tasksByStatus", () => {
  it("指定したステータスのタスクだけを順序を保って返す", () => {
    expect(tasksByStatus(sample, "todo").map((t) => t.id)).toEqual(["1", "3"]);
    expect(tasksByStatus(sample, "done")).toEqual([]);
  });
});
