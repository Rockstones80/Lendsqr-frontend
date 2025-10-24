import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Users from "./Users";
import { api } from "../services/api";

// Mock the API
vi.mock("../services/api", () => ({
  api: {
    getUsers: vi.fn(),
    getUserStats: vi.fn(),
  },
}));

// Mock the utils
vi.mock("../utils", () => ({
  formatDate: vi.fn((date: string) => {
    return new Date(date).toLocaleDateString();
  }),
  getStatusColor: vi.fn((status: string) => {
    const colors: Record<string, string> = {
      active: "#39CD62",
      inactive: "#545F7D",
      pending: "#E9B200",
      blacklisted: "#E4033B",
    };
    return colors[status] || "#545F7D";
  }),
}));

const UsersWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("Users Component", () => {
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
    {
      id: "2",
      organization: "Irorun",
      username: "Jane Smith",
      email: "jane@example.com",
      phoneNumber: "08087654321",
      dateJoined: "2023-02-01T00:00:00Z",
      status: "inactive" as const,
      profile: {
        firstName: "Jane",
        lastName: "Smith",
        avatar: "avatar-url-2",
        bvn: "07087654321",
        gender: "female" as const,
        maritalStatus: "married" as const,
        children: "2",
        typeOfResidence: "Personal Apartment",
      },
      education: {
        level: "M.Sc",
        employmentStatus: "Employed",
        sector: "Banking",
        duration: "3 years",
        officeEmail: "jane@company.com",
        monthlyIncome: "₦300,000.00 - ₦600,000.00",
        loanRepayment: "75000",
      },
      socials: {
        twitter: "@janesmith",
        facebook: "Jane Smith",
        instagram: "@janesmith",
      },
      guarantor: [
        {
          fullName: "John Smith",
          phoneNumber: "08187654321",
          emailAddress: "john@email.com",
          relationship: "Brother",
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(api.getUsers).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );
    vi.mocked(api.getUserStats).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("renders users page with statistics and table", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    // Check statistics cards
    expect(screen.getByText("USERS")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE USERS")).toBeInTheDocument();
    expect(screen.getByText("750")).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText("ORGANIZATION")).toBeInTheDocument();
    expect(screen.getByText("USERNAME")).toBeInTheDocument();
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
    expect(screen.getByText("PHONE NUMBER")).toBeInTheDocument();
    expect(screen.getByText("DATE JOINED")).toBeInTheDocument();
    expect(screen.getByText("STATUS")).toBeInTheDocument();

    // Check user data
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("toggles filter panel", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);

    expect(screen.getByText("Organization")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
    expect(screen.getByText("Filter")).toBeInTheDocument();
  });

  it("applies filters correctly", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);

    const organizationSelect = screen.getByDisplayValue("Select");
    fireEvent.change(organizationSelect, { target: { value: "Lendsqr" } });

    await waitFor(() => {
      expect(api.getUsers).toHaveBeenCalledWith(1, 10, {
        organization: "Lendsqr",
      });
    });
  });

  it("resets filters correctly", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    const filterButton = screen.getByText("Filter");
    fireEvent.click(filterButton);

    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(api.getUsers).toHaveBeenCalledWith(1, 10, {});
    });
  });

  it("changes items per page", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    const itemsPerPageSelect = screen.getByDisplayValue("10");
    fireEvent.change(itemsPerPageSelect, { target: { value: "25" } });

    await waitFor(() => {
      expect(api.getUsers).toHaveBeenCalledWith(1, 25, {});
    });
  });

  it("handles pagination correctly", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Users")).toBeInTheDocument();
    });

    // Test pagination controls
    const paginationInfo = screen.getByText("out of 2");
    expect(paginationInfo).toBeInTheDocument();
  });

  it("displays user status badges correctly", async () => {
    vi.mocked(api.getUsers).mockResolvedValue({
      data: mockUsers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    vi.mocked(api.getUserStats).mockResolvedValue({
      data: mockStats,
      status: 200,
      message: "Success",
    });

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("ACTIVE")).toBeInTheDocument();
      expect(screen.getByText("INACTIVE")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    vi.mocked(api.getUsers).mockRejectedValue(new Error("API Error"));
    vi.mocked(api.getUserStats).mockRejectedValue(new Error("API Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <UsersWrapper>
        <Users />
      </UsersWrapper>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching users:",
        expect.any(Error)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching stats:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
