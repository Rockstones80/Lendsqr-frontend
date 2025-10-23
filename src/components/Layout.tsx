import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { AuthUser } from "../types";
import "./Layout.scss";

interface LayoutProps {
  children: ReactNode;
  user: AuthUser;
  onLogout: () => void;
}

const Layout = ({ children, user, onLogout }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    {
      name: "CUSTOMERS",
      children: [
        { name: "Users", href: "/users", icon: "👥" },
        { name: "Guarantors", href: "#", icon: "🤝" },
        { name: "Loans", href: "#", icon: "💰" },
        { name: "Decision Models", href: "#", icon: "🧩" },
        { name: "Savings", href: "#", icon: "🐷" },
        { name: "Loan Requests", href: "#", icon: "📄" },
        { name: "Whitelist", href: "#", icon: "✅" },
        { name: "Karma", href: "#", icon: "⭐" },
      ],
    },
    {
      name: "BUSINESSES",
      children: [
        { name: "Organization", href: "#", icon: "🏢" },
        { name: "Loan Products", href: "#", icon: "💰" },
        { name: "Savings Products", href: "#", icon: "🐷" },
        { name: "Fees and Charges", href: "#", icon: "💲" },
        { name: "Transactions", href: "#", icon: "📊" },
        { name: "Services", href: "#", icon: "⚙️" },
        { name: "Service Account", href: "#", icon: "👤" },
        { name: "Settlements", href: "#", icon: "🏦" },
        { name: "Reports", href: "#", icon: "📈" },
      ],
    },
    {
      name: "SETTINGS",
      children: [
        { name: "Preferences", href: "#", icon: "⚙️" },
        { name: "Fees and Pricing", href: "#", icon: "💲" },
        { name: "Audit Logs", href: "#", icon: "📋" },
      ],
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">LS</span>
            <span className="logo-text">lendsqr</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <div key={item.name} className="nav-section">
              {item.children ? (
                <>
                  <div className="nav-section-title">{item.name}</div>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={`nav-link ${
                        isActive(child.href) ? "active" : ""
                      }`}
                    >
                      <span className="nav-icon">{child.icon}</span>
                      <span className="nav-text">{child.name}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  to={item.href}
                  className={`nav-link ${isActive(item.href) ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
          <div className="version">v1.2.0</div>
        </div>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for anything"
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          <div className="header-right">
            <a href="#" className="header-link">
              Docs
            </a>
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="user-menu">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <span className="user-name">{user.name}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
