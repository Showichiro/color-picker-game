import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ColorPanel } from "./ColorPanel";

describe("ColorPanel", () => {
  it("should render with the correct color", () => {
    render(<ColorPanel color="#ff0000" onClick={() => {}} />);

    const panel = screen.getByRole("button");
    expect(panel).toHaveStyle({ backgroundColor: "#ff0000" });
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<ColorPanel color="#00ff00" onClick={handleClick} />);

    const panel = screen.getByRole("button");
    fireEvent.click(panel);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when isDisabled is true", () => {
    const handleClick = vi.fn();
    render(<ColorPanel color="#0000ff" onClick={handleClick} isDisabled />);

    const panel = screen.getByRole("button");
    expect(panel).toBeDisabled();

    fireEvent.click(panel);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should show success animation when isCorrect is true", () => {
    render(<ColorPanel color="#ff00ff" onClick={() => {}} isCorrect />);

    const panel = screen.getByRole("button");
    expect(panel).toHaveClass("correct");
  });

  it("should show error animation when isWrong is true", () => {
    render(<ColorPanel color="#ffff00" onClick={() => {}} isWrong />);

    const panel = screen.getByRole("button");
    expect(panel).toHaveClass("wrong");
  });
});
