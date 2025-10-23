import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { UserStats, User } from "../types";
import { api } from "../services/api";
import { formatDate } from "../utils";
import "./Dashboard.scss";

const Dashboard = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, usersResponse] = await Promise.all([
          api.getUserStats(),
          api.getUsers(1, 5), // Get first 5 users
        ]);

        setStats(statsResponse.data);
        setRecentUsers(usersResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "#39CD62",
      inactive: "#545F7D",
      pending: "#E9B200",
      blacklisted: "#E4033B",
    };
    return colors[status] || "#545F7D";
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-content">
            <h3>USERS</h3>
            <p className="stat-number">{stats?.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active-users">👥</div>
          <div className="stat-content">
            <h3>ACTIVE USERS</h3>
            <p className="stat-number">{stats?.activeUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon loans">💰</div>
          <div className="stat-content">
            <h3>USERS WITH LOANS</h3>
            <p className="stat-number">
              {stats?.usersWithLoans.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon savings">🐷</div>
          <div className="stat-content">
            <h3>USERS WITH SAVINGS</h3>
            <p className="stat-number">
              {stats?.usersWithSavings.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="recent-users">
        <div className="section-header">
          <h2>Recent Users</h2>
          <Link to="/users" className="view-all-link">
            View All Users
          </Link>
        </div>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ORGANIZATION</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>PHONE NUMBER</th>
                <th>DATE JOINED</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.organization}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{formatDate(user.dateJoined)}</td>
                  <td>
                    <span
                      className="status-badge"
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
                    <Link to={`/users/${user.id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/users" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
          </Link>

          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Reports</h3>
            <p>Generate and view reports</p>
          </div>

          <div className="action-card">
            <div className="action-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure system settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
