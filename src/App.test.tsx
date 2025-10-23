import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// Simple test component
function TestComponent() {
  return <div>Hello World</div>;
}

describe("Basic Test", () => {
  it("renders a simple component", () => {
    render(<TestComponent />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("can perform basic assertions", () => {
    expect(1 + 1).toBe(2);
    expect("hello").toContain("hello");
  });
});
