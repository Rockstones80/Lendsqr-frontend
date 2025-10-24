import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import UserDetails from "./UserDetails";
import { api } from "../services/api";

// Mock the API
vi.mock("../services/api", () => ({
  api: {
    getUserById: vi.fn(),
  },
}));

// Mock the utils
vi.mock("../utils", () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

const UserDetailsWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe("UserDetails Component", () => {
  const mockUser = {
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
      {
        fullName: "Bob Smith",
        phoneNumber: "08234567890",
        emailAddress: "bob@email.com",
        relationship: "Friend",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.mocked(api.getUserById).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    expect(screen.getByText("Loading user details...")).toBeInTheDocument();
  });

  it("renders user details from localStorage if available", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("User Details")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });

    expect(api.getUserById).not.toHaveBeenCalled();
  });

  it("fetches user details from API if not in localStorage", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(null);
    vi.mocked(api.getUserById).mockResolvedValue({
      data: mockUser,
      status: 200,
      message: "Success",
    });

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("User Details")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(api.getUserById).toHaveBeenCalledWith("1");
    expect(storage.set).toHaveBeenCalledWith("user_1", mockUser);
  });

  it("renders user summary card correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("User's Tier")).toBeInTheDocument();
      expect(screen.getByText("₦200,000.00")).toBeInTheDocument();
      expect(screen.getByText("9912345678/Providus Bank")).toBeInTheDocument();
    });
  });

  it("renders tab navigation correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("General Details")).toBeInTheDocument();
      expect(screen.getByText("Documents")).toBeInTheDocument();
      expect(screen.getByText("Bank Details")).toBeInTheDocument();
      expect(screen.getByText("Loans")).toBeInTheDocument();
      expect(screen.getByText("Savings")).toBeInTheDocument();
      expect(screen.getByText("App and System")).toBeInTheDocument();
    });
  });

  it("switches between tabs correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("General Details")).toBeInTheDocument();
    });

    // Check that General Details tab is active by default
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Education and Employment")).toBeInTheDocument();
    expect(screen.getByText("Socials")).toBeInTheDocument();
    expect(screen.getByText("Guarantor")).toBeInTheDocument();

    // Click on Documents tab
    const documentsTab = screen.getByText("Documents");
    fireEvent.click(documentsTab);

    expect(
      screen.getByText("Documents will be displayed here")
    ).toBeInTheDocument();

    // Click on Bank Details tab
    const bankTab = screen.getByText("Bank Details");
    fireEvent.click(bankTab);

    expect(
      screen.getByText("Bank details will be displayed here")
    ).toBeInTheDocument();
  });

  it("displays personal information correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Personal Information")).toBeInTheDocument();
    });

    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByText("08012345678")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("BVN")).toBeInTheDocument();
    expect(screen.getByText("07012345678")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("male")).toBeInTheDocument();
    expect(screen.getByText("Marital Status")).toBeInTheDocument();
    expect(screen.getByText("single")).toBeInTheDocument();
  });

  it("displays education and employment information correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Education and Employment")).toBeInTheDocument();
    });

    expect(screen.getByText("Level of Education")).toBeInTheDocument();
    expect(screen.getByText("B.Sc")).toBeInTheDocument();
    expect(screen.getByText("Employment Status")).toBeInTheDocument();
    expect(screen.getByText("Employed")).toBeInTheDocument();
    expect(screen.getByText("Sector of Employment")).toBeInTheDocument();
    expect(screen.getByText("FinTech")).toBeInTheDocument();
    expect(screen.getByText("Duration of Employment")).toBeInTheDocument();
    expect(screen.getByText("2 years")).toBeInTheDocument();
    expect(screen.getByText("Office Email")).toBeInTheDocument();
    expect(screen.getByText("john@company.com")).toBeInTheDocument();
    expect(screen.getByText("Monthly Income")).toBeInTheDocument();
    expect(screen.getByText("₦200,000.00 - ₦500,000.00")).toBeInTheDocument();
    expect(screen.getByText("Loan Repayment")).toBeInTheDocument();
    expect(screen.getByText("50000")).toBeInTheDocument();
  });

  it("displays social information correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Socials")).toBeInTheDocument();
    });

    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
    expect(screen.getByText("Facebook")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("@johndoe")).toBeInTheDocument();
  });

  it("displays guarantor information correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Guarantor")).toBeInTheDocument();
    });

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("08123456789")).toBeInTheDocument();
    expect(screen.getByText("jane@email.com")).toBeInTheDocument();
    expect(screen.getByText("Sister")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("08234567890")).toBeInTheDocument();
    expect(screen.getByText("bob@email.com")).toBeInTheDocument();
    expect(screen.getByText("Friend")).toBeInTheDocument();
  });

  it("renders error state when user is not found", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(null);
    vi.mocked(api.getUserById).mockRejectedValue(new Error("User not found"));

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("User not found")).toBeInTheDocument();
      expect(
        screen.getByText("The user you're looking for doesn't exist.")
      ).toBeInTheDocument();
      expect(screen.getByText("Back to Users")).toBeInTheDocument();
    });
  });

  it("renders action buttons correctly", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(mockUser);

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("BLACKLIST USER")).toBeInTheDocument();
      expect(screen.getByText("ACTIVATE USER")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const { storage } = await import("../utils");
    vi.mocked(storage.get).mockReturnValue(null);
    vi.mocked(api.getUserById).mockRejectedValue(new Error("API Error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <UserDetailsWrapper>
        <UserDetails />
      </UserDetailsWrapper>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user details:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
