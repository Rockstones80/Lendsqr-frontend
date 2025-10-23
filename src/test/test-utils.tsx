import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Common test utilities
export const createMockUser = () => ({
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  status: "active",
  createdAt: "2023-01-01T00:00:00Z",
});

export const createMockApiResponse = <T,>(data: T) => ({
  data,
  status: 200,
  message: "Success",
});

export const createMockError = (message: string = "Something went wrong") => ({
  message,
  status: 500,
  error: "Internal Server Error",
});
