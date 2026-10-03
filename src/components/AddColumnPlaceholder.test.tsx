import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AddColumnPlaceholder } from "./AddColumnPlaceholder";

describe("AddColumnPlaceholder", () => {
  it("表示のみで、操作できる要素を持たない", () => {
    const { container } = render(<AddColumnPlaceholder />);
    expect(container).toHaveTextContent("カラムを追加");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
