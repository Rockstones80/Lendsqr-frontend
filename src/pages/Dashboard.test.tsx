import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { api } from "../services/api";

// Mock the API
vi.mock("../services/api", () => ({
  api: {
    getUserStats: vi.fn(),
    getUsers: vi.fn(),
  },
}));

// Mock the utils
vi.mock("../utils", () => ({
  formatDate: vi.fn((date: string) => {
    return new Date(date).toLocaleDateString();
  }),
}));

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Dashboard Component", () => {
  const mockStats = {
    totalUsers: 1000,
    activeUsers: 750,
    usersWithLoans: 500,
    usersWithSavings: 300,
  };

  const mockUsers = [
    {
      id: "1",
      organization: "Lendsqr",
      username: "John Doe",
      email: "john@example.com",
      phoneNumber: "08012345678",
      dateJoined: "2023-01-01T00:00:00Z",
      status: "active" as const,
      profile: {
        firstName: "John",
        lastName: "Doe",
        avatar: "avatar-url",
        bvn: "07012345678",
        gender: "male" as const,
        maritalStatus: "single" as const,
        children: "None",
        typeOfResidence: "Personal Apartment",
      },
      education: {
        level: "B.Sc",
        employmentStatus: "Employed",
        sector: "FinTech",
        duration: "2 years",
        officeEmail: "john@company.com",
        monthlyIncome: "₦200,000.00 - ₦500,000.00",
        loanRepayment: "50000",
      },
      socials: {
        twitter: "@johndoe",
        facebook: "John Doe",
        instagram: "@johndoe",
      },
      guarantor: [
        {
          fullName: "Jane Doe",
          phoneNumber: "08123456789",
          emailAddress: "jane@email.com",
          relationship: "Sister",
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(api.getUserStats).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );
    vi.mocked(api.getUsers).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("renders dashboard with statistics and recent users", async () => {
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Welcome to your dashboard")).toBeInTheDocument();
    });

    // Check statistics cards
    expect(screen.getByText("USERS")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE USERS")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();
    expect(screen.getByText("USERS WITH LOANS")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("USERS WITH SAVINGS")).toBeInTheDocument();
    expect(screen.getByText("300")).toBeInTheDocument();

    // Check recent users section
    expect(screen.getByText("Recent Users")).toBeInTheDocument();
    expect(screen.getByText("View All Users")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("displays user status with correct styling", async () => {
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      const statusBadge = screen.getByText("ACTIVE");
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge).toHaveClass("status-badge");
    });
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(api.getUserStats).mockRejectedValue(new Error("API Error"));
    vi.mocked(api.getUsers).mockRejectedValue(new Error("API Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching dashboard data:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("calls API with correct parameters", async () => {
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(api.getUserStats).toHaveBeenCalledTimes(1);
      expect(api.getUsers).toHaveBeenCalledWith(1, 5);
    });
  });

  it("renders view details link for each user", async () => {
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 1,
      page: 1,
      limit: 5,
      totalPages: 1,
    });

    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      const viewDetailsLink = screen.getByText("View Details");
      expect(viewDetailsLink).toBeInTheDocument();
      expect(viewDetailsLink).toHaveAttribute("href", "/users/1");
    });
  });
});
