import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { User } from "../types";
import { api } from "../services/api";
import { storage } from "../utils";
import "./UserDetails.scss";

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;

      try {
        // Check localStorage first
        const storedUser = storage.get<User>(`user_${id}`);
        if (storedUser) {
          setUser(storedUser);
          setLoading(false);
          return;
        }

        // Fetch from API if not in localStorage
        const response = await api.getUserById(id);
        setUser(response.data);

        // Store in localStorage for future visits
        storage.set(`user_${id}`, response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  // const getStatusColor = (status: string) => {
  //   const colors: Record<string, string> = {
  //     active: '#39CD62',
  //     inactive: '#545F7D',
  //     pending: '#E9B200',
  //     blacklisted: '#E4033B',
  //   };
  //   return colors[status] || '#545F7D';
  // };

  const tabs = [
    { id: "general", label: "General Details" },
    { id: "documents", label: "Documents" },
    { id: "bank", label: "Bank Details" },
    { id: "loans", label: "Loans" },
    { id: "savings", label: "Savings" },
    { id: "app", label: "App and System" },
  ];

  if (loading) {
    return (
      <div className="user-details">
        <div className="loading">
          <div>Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-details">
        <div className="error">
          <h2>User not found</h2>
          <p>The user you're looking for doesn't exist.</p>
          <Link to="/users" className="back-btn">
            Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="user-details">
      {/* Header */}
      <div className="user-header">
        <Link to="/users" className="back-link">
          ← Back to Users
        </Link>
        <h1>User Details</h1>
        <div className="user-actions">
          <button className="blacklist-btn">BLACKLIST USER</button>
          <button className="activate-btn">ACTIVATE USER</button>
        </div>
      </div>

      {/* User Summary Card */}
      <div className="user-summary">
        <div className="user-avatar">
          <img src={user.profile.avatar} alt={user.username} />
        </div>
        <div className="user-info">
          <h2>{user.username}</h2>
          <p className="user-id">{user.id}</p>
        </div>
        <div className="user-stats">
          <div className="stat">
            <span className="stat-label">User's Tier</span>
            <div className="tier-stars">
              {[1, 2, 3].map((tier) => (
                <span
                  key={tier}
                  className={`star ${tier <= 1 ? "active" : ""}`}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <div className="stat">
            <span className="stat-label">₦200,000.00</span>
            <span className="stat-value">Balance</span>
          </div>
          <div className="stat">
            <span className="stat-label">9912345678/Providus Bank</span>
            <span className="stat-value">Bank Account</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "general" && (
          <div className="general-details">
            {/* Personal Information */}
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone Number</span>
                  <span className="detail-value">{user.phoneNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">BVN</span>
                  <span className="detail-value">{user.profile.bvn}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{user.profile.gender}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Marital Status</span>
                  <span className="detail-value">
                    {user.profile.maritalStatus}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Children</span>
                  <span className="detail-value">{user.profile.children}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type of Residence</span>
                  <span className="detail-value">
                    {user.profile.typeOfResidence}
                  </span>
                </div>
              </div>
            </div>

            {/* Education and Employment */}
            <div className="detail-section">
              <h3>Education and Employment</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Level of Education</span>
                  <span className="detail-value">{user.education.level}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Employment Status</span>
                  <span className="detail-value">
                    {user.education.employmentStatus}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Sector of Employment</span>
                  <span className="detail-value">{user.education.sector}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration of Employment</span>
                  <span className="detail-value">
                    {user.education.duration}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Office Email</span>
                  <span className="detail-value">
                    {user.education.officeEmail}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Monthly Income</span>
                  <span className="detail-value">
                    {user.education.monthlyIncome}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Loan Repayment</span>
                  <span className="detail-value">
                    {user.education.loanRepayment}
                  </span>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div className="detail-section">
              <h3>Socials</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Twitter</span>
                  <span className="detail-value">{user.socials.twitter}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Facebook</span>
                  <span className="detail-value">{user.socials.facebook}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Instagram</span>
                  <span className="detail-value">{user.socials.instagram}</span>
                </div>
              </div>
            </div>

            {/* Guarantor */}
            <div className="detail-section">
              <h3>Guarantor</h3>
              <div className="guarantor-list">
                {user.guarantor.map((guarantor, index) => (
                  <div key={index} className="guarantor-item">
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Full Name</span>
                        <span className="detail-value">
                          {guarantor.fullName}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Phone Number</span>
                        <span className="detail-value">
                          {guarantor.phoneNumber}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email Address</span>
                        <span className="detail-value">
                          {guarantor.emailAddress}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Relationship</span>
                        <span className="detail-value">
                          {guarantor.relationship}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="documents-tab">
            <p>Documents will be displayed here</p>
          </div>
        )}

        {activeTab === "bank" && (
          <div className="bank-tab">
            <p>Bank details will be displayed here</p>
          </div>
        )}

        {activeTab === "loans" && (
          <div className="loans-tab">
            <p>Loan information will be displayed here</p>
          </div>
        )}

        {activeTab === "savings" && (
          <div className="savings-tab">
            <p>Savings information will be displayed here</p>
          </div>
        )}

        {activeTab === "app" && (
          <div className="app-tab">
            <p>App and system information will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
