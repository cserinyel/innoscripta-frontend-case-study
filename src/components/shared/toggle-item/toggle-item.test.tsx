import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ToggleItem from "./toggle-item";

describe("ToggleItem", () => {
  it("renders label and shows check when active", () => {
    render(
      <ToggleItem label="technology" active={true} onToggle={() => {}} />,
    );
    expect(screen.getByText("technology")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(
      <ToggleItem label="sports" active={false} onToggle={onToggle} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
