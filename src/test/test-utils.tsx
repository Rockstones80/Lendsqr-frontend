import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";

// Custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { ...options });

// Re-export specific functions
export {
  render as originalRender,
  screen,
  fireEvent,
  waitFor,
  act,
  cleanup,
  getByText,
  getByRole,
  getByTestId,
  queryByText,
  queryByRole,
  queryByTestId,
  findByText,
  findByRole,
  findByTestId,
} from "@testing-library/react";
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
