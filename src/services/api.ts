import type {
  User,
  UserFilters,
  UserStats,
  PaginatedResponse,
  ApiResponse,
} from "../types";

// Mock data generator
const generateMockUsers = (): User[] => {
  const organizations = ["Lendsqr", "Irorun", "Lendstar", "Lendly", "Lendwise"];
  const statuses: User["status"][] = [
    "active",
    "inactive",
    "pending",
    "blacklisted",
  ];
  const genders: User["profile"]["gender"][] = ["male", "female"];
  const maritalStatuses: User["profile"]["maritalStatus"][] = [
    "single",
    "married",
    "divorced",
    "widowed",
  ];
  const sectors = [
    "FinTech",
    "Banking",
    "Insurance",
    "Real Estate",
    "Healthcare",
    "Education",
  ];

  const users: User[] = [];

  for (let i = 1; i <= 500; i++) {
    const firstName = `User${i}`;
    const lastName = `LastName${i}`;
    const email = `user${i}@${organizations[
      i % organizations.length
    ].toLowerCase()}.com`;

    users.push({
      id: `user_${i}`,
      organization: organizations[i % organizations.length],
      username: `${firstName} ${lastName}`,
      email,
      phoneNumber: `080${String(i).padStart(8, "0")}`,
      dateJoined: new Date(
        2020,
        Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 28) + 1
      ).toISOString(),
      status: statuses[i % statuses.length],
      profile: {
        firstName,
        lastName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
        bvn: `070${String(i).padStart(8, "0")}`,
        gender: genders[i % genders.length],
        maritalStatus: maritalStatuses[i % maritalStatuses.length],
        children: i % 3 === 0 ? "None" : `${Math.floor(Math.random() * 3) + 1}`,
        typeOfResidence:
          i % 2 === 0 ? "Parent's Apartment" : "Personal Apartment",
      },
      education: {
        level: i % 3 === 0 ? "B.Sc" : i % 3 === 1 ? "M.Sc" : "Ph.D",
        employmentStatus: "Employed",
        sector: sectors[i % sectors.length],
        duration: `${Math.floor(Math.random() * 5) + 1} years`,
        officeEmail: `office${i}@company.com`,
        monthlyIncome: `₦${(
          Math.floor(Math.random() * 500000) + 100000
        ).toLocaleString()}.00 - ₦${(
          Math.floor(Math.random() * 1000000) + 500000
        ).toLocaleString()}.00`,
        loanRepayment: `${Math.floor(Math.random() * 100000) + 10000}`,
      },
      socials: {
        twitter: `@${firstName.toLowerCase()}`,
        facebook: `${firstName} ${lastName}`,
        instagram: `@${firstName.toLowerCase()}`,
      },
      guarantor: [
        {
          fullName: `Guarantor ${i}`,
          phoneNumber: `081${String(i).padStart(8, "0")}`,
          emailAddress: `guarantor${i}@email.com`,
          relationship: i % 2 === 0 ? "Sister" : "Brother",
        },
        {
          fullName: `Guarantor ${i + 1}`,
          phoneNumber: `082${String(i).padStart(8, "0")}`,
          emailAddress: `guarantor${i + 1}@email.com`,
          relationship: "Friend",
        },
      ],
    });
  }

  return users;
};

// Store mock data
const mockUsers: User[] = generateMockUsers();

// API functions
export const api = {
  // Get users with pagination and filtering
  getUsers: async (
    page: number = 1,
    limit: number = 10,
    filters: UserFilters = {}
  ): Promise<PaginatedResponse<User>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredUsers = [...mockUsers];

    // Apply filters
    if (filters.organization) {
      filteredUsers = filteredUsers.filter((user) =>
        user.organization
          .toLowerCase()
          .includes(filters.organization!.toLowerCase())
      );
    }

    if (filters.username) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(filters.username!.toLowerCase())
      );
    }

    if (filters.email) {
      filteredUsers = filteredUsers.filter((user) =>
        user.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }

    if (filters.phoneNumber) {
      filteredUsers = filteredUsers.filter((user) =>
        user.phoneNumber.includes(filters.phoneNumber!)
      );
    }

    if (filters.status) {
      filteredUsers = filteredUsers.filter(
        (user) => user.status === filters.status
      );
    }

    if (filters.date) {
      const filterDate = new Date(filters.date);
      filteredUsers = filteredUsers.filter((user) => {
        const userDate = new Date(user.dateJoined);
        return userDate.toDateString() === filterDate.toDateString();
      });
    }

    // Calculate pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages,
    };
  },

  // Get user by ID
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const user = mockUsers.find((u) => u.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      data: user,
      status: 200,
      message: "User retrieved successfully",
    };
  },

  // Get user statistics
  getUserStats: async (): Promise<ApiResponse<UserStats>> => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const stats: UserStats = {
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter((u) => u.status === "active").length,
      usersWithLoans: Math.floor(mockUsers.length * 0.7),
      usersWithSavings: Math.floor(mockUsers.length * 0.4),
    };

    return {
      data: stats,
      status: 200,
      message: "Statistics retrieved successfully",
    };
  },

  // Login
  login: async (
    email: string,
    password: string
  ): Promise<
    ApiResponse<{
      user: { id: string; email: string; name: string; avatar: string };
      token: string;
    }>
  > => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simple mock authentication
    if (email === "admin@lendsqr.com" && password === "password") {
      return {
        data: {
          user: {
            id: "1",
            email: "admin@lendsqr.com",
            name: "Admin User",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
          },
          token: "mock-jwt-token",
        },
        status: 200,
        message: "Login successful",
      };
    }

    throw new Error("Invalid credentials");
  },
};
