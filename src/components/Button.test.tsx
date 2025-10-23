import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Example Button component for testing
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function Button({ onClick, disabled = false, children }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

describe("Button Component", () => {
  // POSITIVE SCENARIOS
  describe("Positive Scenarios", () => {
    it("renders button with text", () => {
      render(<Button onClick={() => {}}>Click me</Button>);
      expect(screen.getByText("Click me")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByText("Click me"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("is not disabled by default", () => {
      render(<Button onClick={() => {}}>Click me</Button>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  // NEGATIVE SCENARIOS
  describe("Negative Scenarios", () => {
    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click me
        </Button>
      );

      fireEvent.click(screen.getByText("Click me"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("is disabled when disabled prop is true", () => {
      render(
        <Button onClick={() => {}} disabled>
          Click me
        </Button>
      );
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("handles multiple rapid clicks correctly", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByText("Click me");
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });
  });
});
