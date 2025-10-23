import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import type { AuthUser } from "../types";
import UnionLogo from "../assets/login/Union.png";
import UserAvatar from "../assets/login/IMG_7840 (1).jpg";
import {
  Home,
  Users,
  UserCheck,
  DollarSign,
  Settings as SettingsIcon,
  PiggyBank,
  FileText,
  CheckCircle,
  Star,
  Building,
  Receipt,
  ArrowLeftRight,
  Cog,
  User,
  Scale,
  BarChart3,
  Sliders,
  Percent,
  ClipboardList,
  Search,
  Bell,
  ChevronDown,
  Folder,
  LogOut,
} from "lucide-react";
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
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "CUSTOMERS",
      children: [
        { name: "Users", href: "/users", icon: Users },
        { name: "Guarantors", href: "#", icon: UserCheck },
        { name: "Loans", href: "#", icon: DollarSign },
        { name: "Decision Models", href: "#", icon: SettingsIcon },
        { name: "Savings", href: "#", icon: PiggyBank },
        { name: "Loan Requests", href: "#", icon: FileText },
        { name: "Whitelist", href: "#", icon: CheckCircle },
        { name: "Karma", href: "#", icon: Star },
      ],
    },
    {
      name: "BUSINESSES",
      children: [
        { name: "Organization", href: "#", icon: Building },
        { name: "Loan Products", href: "#", icon: DollarSign },
        { name: "Savings Products", href: "#", icon: PiggyBank },
        { name: "Fees and Charges", href: "#", icon: Receipt },
        { name: "Transactions", href: "#", icon: ArrowLeftRight },
        { name: "Services", href: "#", icon: Cog },
        { name: "Service Account", href: "#", icon: User },
        { name: "Settlements", href: "#", icon: Scale },
        { name: "Reports", href: "#", icon: BarChart3 },
      ],
    },
    {
      name: "SETTINGS",
      children: [
        { name: "Preferences", href: "#", icon: Sliders },
        { name: "Fees and Pricing", href: "#", icon: Percent },
        { name: "Audit Logs", href: "#", icon: ClipboardList },
      ],
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="layout">
      {/* Header - Full Width */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <img src={UnionLogo} alt="Lendsqr" className="union-logo-icon" />
            <span className="logo-text">lendsqr</span>
          </div>
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
            <button className="search-btn">
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="header-right">
          <a href="#" className="header-link">
            Docs
          </a>
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>
          <div className="user-menu">
            <img src={UserAvatar} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
            <span className="dropdown-arrow">
              <ChevronDown size={12} />
            </span>
          </div>
        </div>
      </header>

      {/* Content Area - Below Header */}
      <div className="content-area">
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
            <div className="switch-organization">
              <Folder size={16} />
              <span>Switch Organization</span>
              <ChevronDown size={12} />
            </div>
          </div>

          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <div key={item.name} className="nav-section">
                {item.children ? (
                  <>
                    <div className="nav-section-title">{item.name}</div>
                    {item.children.map((child) => {
                      const IconComponent = child.icon;
                      return (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`nav-link ${
                            isActive(child.href) ? "active" : ""
                          }`}
                        >
                          <span className="nav-icon">
                            <IconComponent size={20} />
                          </span>
                          <span className="nav-text">{child.name}</span>
                        </Link>
                      );
                    })}
                  </>
                ) : (
                  (() => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        to={item.href}
                        className={`nav-link ${
                          isActive(item.href) ? "active" : ""
                        }`}
                      >
                        <span className="nav-icon">
                          <IconComponent size={20} />
                        </span>
                        <span className="nav-text">{item.name}</span>
                      </Link>
                    );
                  })()
                )}
              </div>
            ))}

            {/* Logout option - positioned at the bottom */}
            <div className="nav-section logout-section">
              <button onClick={onLogout} className="nav-link logout-link">
                <span className="nav-icon">
                  <LogOut size={20} />
                </span>
                <span className="nav-text">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <div className="main-content">
          {/* Page content */}
          <main className="page-content">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
