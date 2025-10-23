import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import type { User, UserFilters, PaginatedResponse, UserStats } from "../types";
import { api } from "../services/api";
import { formatDate, getStatusColor } from "../utils";
import {
  ListFilter,
  MoreVertical,
  // Download,
  Eye,
  Users as UsersIcon,
  UserCheck,
  DollarSign,
  PiggyBank,
  UserX,
  UserPlus,
} from "lucide-react";
import "./Users.scss";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    limit: 10,
    totalPages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = useCallback(
    async (page: number = 1, newFilters: UserFilters = {}) => {
      setLoading(true);
      try {
        const response: PaginatedResponse<User> = await api.getUsers(
          page,
          pagination.limit,
          newFilters
        );
        setUsers(response.data);
        setPagination({
          current: response.page,
          total: response.total,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit]
  );

  const fetchStats = async () => {
    try {
      const response = await api.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [fetchUsers]);

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    // Use setTimeout for debouncing instead of the debounce utility
    setTimeout(() => {
      fetchUsers(1, newFilters);
    }, 500);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, filters);
  };

  const handleResetFilters = () => {
    setFilters({});
    fetchUsers(1, {});
  };

  const handleApplyFilters = () => {
    fetchUsers(1, filters);
    setShowFilters(false);
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, string> = {
      active: "success",
      inactive: "secondary",
      pending: "warning",
      blacklisted: "danger",
    };
    return variants[status] || "secondary";
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users</h1>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <UsersIcon size={20} />
          </div>
          <div className="stat-content">
            <h3>USERS</h3>
            <p className="stat-number">{stats?.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-users">
            <UserCheck size={20} />
          </div>
          <div className="stat-content">
            <h3>ACTIVE USERS</h3>
            <p className="stat-number">{stats?.activeUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon loans">
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <h3>USERS WITH LOANS</h3>
            <p className="stat-number">
              {stats?.usersWithLoans.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon savings">
            <PiggyBank size={20} />
          </div>
          <div className="stat-content">
            <h3>USERS WITH SAVINGS</h3>
            <p className="stat-number">
              {stats?.usersWithSavings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <button
        className="filter-toggle-btn"
        onClick={() => setShowFilters(!showFilters)}
      >
        <ListFilter size={16} />
        Filter
      </button>
      {/* Users Table */}
      <div className="table-container">
        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filters-content">
              <div className="filter-group">
                <label>Organization</label>
                <select
                  value={filters.organization || ""}
                  onChange={(e) =>
                    handleFilterChange("organization", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="Lendsqr">Lendsqr</option>
                  <option value="Irorun">Irorun</option>
                  <option value="Lendstar">Lendstar</option>
                  <option value="Lendly">Lendly</option>
                  <option value="Lendwise">Lendwise</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="User"
                  value={filters.username || ""}
                  onChange={(e) =>
                    handleFilterChange("username", e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={filters.email || ""}
                  onChange={(e) => handleFilterChange("email", e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Date</label>
                <input
                  type="date"
                  placeholder="Date"
                  value={filters.date || ""}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={filters.phoneNumber || ""}
                  onChange={(e) =>
                    handleFilterChange("phoneNumber", e.target.value)
                  }
                />
              </div>

              <div className="filter-group">
                <label>Status</label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </div>

              <div className="filter-actions">
                <button className="reset-btn" onClick={handleResetFilters}>
                  Reset
                </button>
                <button className="apply-btn" onClick={handleApplyFilters}>
                  Filter
                </button>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div className="loading">
            <div>Loading users...</div>
          </div>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    ORGANIZATION
                    <ListFilter size={12} />
                  </th>
                  <th>
                    USERNAME
                    <ListFilter size={12} />
                  </th>
                  <th>
                    EMAIL
                    <ListFilter size={12} />
                  </th>
                  <th>
                    PHONE NUMBER
                    <ListFilter size={12} />
                  </th>
                  <th>
                    DATE JOINED
                    <ListFilter size={12} />
                  </th>
                  <th>
                    STATUS
                    <ListFilter size={12} />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.organization}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{formatDate(user.dateJoined)}</td>
                    <td>
                      <span
                        className={`status-badge status-${getStatusVariant(
                          user.status
                        )}`}
                        style={{
                          backgroundColor: getStatusColor(user.status) + "20",
                          color: getStatusColor(user.status),
                          border: `1px solid ${getStatusColor(user.status)}40`,
                        }}
                      >
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <div className="actions-dropdown">
                        <button className="actions-btn">
                          <MoreVertical size={16} />
                        </button>
                        <div className="actions-menu">
                          <Link
                            to={`/users/${user.id}`}
                            className="action-link"
                          >
                            <Eye size={16} />
                            View Details
                          </Link>
                          <button className="action-link">
                            <UserX size={16} />
                            Blacklist User
                          </button>
                          <button className="action-link">
                            <UserPlus size={16} />
                            Activate User
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      {/* Pagination */}
      <div className="pagination">
        <div className="pagination-info">
          <span>Showing</span>
          <div className="items-per-page">
            <select
              value={pagination.limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setPagination((prev) => ({ ...prev, limit: newLimit }));
                fetchUsers(1, filters);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <span>out of {pagination.total}</span>
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-btn"
            disabled={pagination.current === 1}
            onClick={() => handlePageChange(pagination.current - 1)}
          >
            ‹
          </button>

          {Array.from(
            { length: Math.min(5, pagination.totalPages) },
            (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`pagination-btn ${
                    pagination.current === page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            }
          )}

          {pagination.totalPages > 5 && (
            <>
              <span>...</span>
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.totalPages)}
              >
                {pagination.totalPages}
              </button>
            </>
          )}

          <button
            className="pagination-btn"
            disabled={pagination.current === pagination.totalPages}
            onClick={() => handlePageChange(pagination.current + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
