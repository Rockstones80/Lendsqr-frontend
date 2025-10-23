// Date formatting utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

// Status utilities
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: "#39CD62",
    inactive: "#545F7D",
    pending: "#E9B200",
    blacklisted: "#E4033B",
  };
  return statusColors[status] || "#545F7D";
};

export const getStatusVariant = (
  status: string
): "success" | "warning" | "danger" | "secondary" => {
  const statusVariants: Record<
    string,
    "success" | "warning" | "danger" | "secondary"
  > = {
    active: "success",
    inactive: "secondary",
    pending: "warning",
    blacklisted: "danger",
  };
  return statusVariants[status] || "secondary";
};

// Local storage utilities
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone);
};

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Pagination utilities
export const getPaginationInfo = (
  current: number,
  total: number,
  limit: number
) => {
  const totalPages = Math.ceil(total / limit);
  const startItem = (current - 1) * limit + 1;
  const endItem = Math.min(current * limit, total);

  return {
    totalPages,
    startItem,
    endItem,
    hasNext: current < totalPages,
    hasPrev: current > 1,
  };
};

// Generate pagination numbers
export const getPaginationNumbers = (
  current: number,
  totalPages: number
): (number | string)[] => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(totalPages - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, "...");
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < totalPages - 1) {
    rangeWithDots.push("...", totalPages);
  } else {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
};

// Search utilities
export const searchUsers = (
  users: Record<string, unknown>[],
  query: string,
  fields: string[]
): Record<string, unknown>[] => {
  if (!query.trim()) return users;

  const lowercaseQuery = query.toLowerCase();

  return users.filter((user) =>
    fields.some((field) => {
      const value = user[field];
      return value && value.toString().toLowerCase().includes(lowercaseQuery);
    })
  );
};

// Sort utilities
export const sortUsers = <T>(
  users: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...users].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};
