import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "./Login";
import { api } from "../services/api";

// Mock the API
vi.mock("../services/api", () => ({
  api: {
    login: vi.fn(),
  },
}));

// Mock the utils
vi.mock("../utils", () => ({
  validateEmail: vi.fn((email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }),
}));

describe("Login Component", () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form correctly", () => {
    render(<Login onLogin={mockOnLogin} />);

    expect(screen.getByText("Welcome!")).toBeInTheDocument();
    expect(screen.getByText("Enter details to login.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LOG IN" })).toBeInTheDocument();
    expect(screen.getByText("FORGOT PASSWORD?")).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const submitButton = screen.getByRole("button", { name: "LOG IN" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters")
      ).toBeInTheDocument();
    });
  });

  it("clears errors when user starts typing", async () => {
    render(<Login onLogin={mockOnLogin} />);

    const submitButton = screen.getByRole("button", { name: "LOG IN" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    await waitFor(() => {
      expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
    });
  });

  it("toggles password visibility", () => {
    render(<Login onLogin={mockOnLogin} />);

    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: "SHOW" });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "HIDE" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "HIDE" }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("handles successful login", async () => {
    const mockUser = {
      id: "1",
      email: "admin@lendsqr.com",
      name: "Admin User",
      avatar: "avatar-url",
    };

    vi.mocked(api.login).mockResolvedValue({
      data: { user: mockUser, token: "mock-token" },
      status: 200,
      message: "Login successful",
    });

    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailInput, { target: { value: "admin@lendsqr.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith("admin@lendsqr.com", "password");
      expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
    });
  });

  it("handles login error", async () => {
    vi.mocked(api.login).mockRejectedValue(new Error("Invalid credentials"));

    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  it("shows loading state during login", async () => {
    vi.mocked(api.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailInput, { target: { value: "admin@lendsqr.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    expect(
      screen.getByRole("button", { name: "LOGGING IN..." })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "LOGGING IN..." })
    ).toBeDisabled();
  });

  it("disables form inputs during loading", async () => {
    vi.mocked(api.login).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<Login onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "LOG IN" });

    fireEvent.change(emailInput, { target: { value: "admin@lendsqr.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
  });
});
