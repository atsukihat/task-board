import { afterEach, describe, expect, it, vi } from "vitest";
import { createTaskId } from "./createTaskId";

describe("createTaskId", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("crypto.randomUUID が使えればそれを使う", () => {
    vi.stubGlobal("crypto", { randomUUID: () => "uuid-1" });
    expect(createTaskId()).toBe("uuid-1");
  });

  it("crypto.randomUUID が無い環境（非HTTPS）でも一意なIDを返す", () => {
    vi.stubGlobal("crypto", {});
    const ids = new Set(Array.from({ length: 100 }, () => createTaskId()));
    expect(ids.size).toBe(100);
  });
});
