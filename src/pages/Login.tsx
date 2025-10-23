import { useState } from "react";
import type { AuthUser } from "../types";
import { api } from "../services/api";
import { validateEmail } from "../utils";
import UnionLogo from "../assets/login/Union.png";
import PabloIllustration from "../assets/login/pablo-sign-in 1.svg";
import "./Login.scss";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.login(formData.email, formData.password);
      onLogin(response.data.user);
    } catch (error) {
      setErrors({
        general:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">
            <img src={UnionLogo} alt="Lendsqr" className="union-logo-icon" />
            <span className="logo-text">lendsqr</span>
          </div>

          <div className="login-illustration">
            <img
              src={PabloIllustration}
              alt="Login Illustration"
              className="pablo-illustration"
            />
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-container">
            <div className="login-header">
              <h1>Welcome!</h1>
              <p>Enter details to login.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Email"
                  disabled={loading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-actions">
                <a href="#" className="forgot-password">
                  FORGOT PASSWORD?
                </a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "LOGGING IN..." : "LOG IN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
