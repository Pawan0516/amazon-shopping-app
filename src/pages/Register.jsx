import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { AuthContext } from "../context/Auth";
import { NotificationContext } from "../context/NotificationContext";

const Register = () => {
  const { register, isLoading, error, setError } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  // Check password strength
  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!agreeToTerms) {
      setError("Please agree to the Terms and Conditions");
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      addNotification(result.message || 'Account created', 'success', 4000);
      navigate("/login");
    } else {
      if (result && result.message) addNotification(result.message, 'error', 5000);
    }
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return "";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return "#ff4444";
      case 2:
        return "#ff9900";
      case 3:
        return "#ffbb33";
      case 4:
        return "#00C851";
      default:
        return "#ccc";
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-box">
        <Link to="/" className="auth-logo-link">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon Logo"
            className="auth-logo"
          />
        </Link>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleRegister}>
          <h2>Create your Amazon account</h2>

          {/* Name Field */}
          <label>Your name</label>
          <input
            type="text"
            name="name"
            placeholder="First and last name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />

          {/* Email Field */}
          <label>Email address</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />

          {/* Phone Field */}
          <label>Mobile number</label>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => {
              handleInputChange({
                target: {
                  name: "phone",
                  value: e.target.value.replace(/\D/g, "").slice(0, 10),
                },
              });
            }}
            maxLength="10"
            disabled={isLoading}
            required
          />

          {/* Password Field */}
          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getPasswordStrengthColor(),
                  }}
                ></div>
              </div>
              <span
                className="strength-label"
                style={{ color: getPasswordStrengthColor() }}
              >
                {getPasswordStrengthLabel()}
              </span>
            </div>
          )}

          {/* Password Requirements */}
          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li className={formData.password.length >= 8 ? "met" : ""}>
                ✓ At least 8 characters
              </li>
              <li className={/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? "met" : ""}>
                ✓ Uppercase and lowercase letters
              </li>
              <li className={/\d/.test(formData.password) ? "met" : ""}>
                ✓ At least one number
              </li>
              <li className={/[@$!%*?&]/.test(formData.password) ? "met" : ""}>
                ✓ At least one special character (@$!%*?&)
              </li>
            </ul>
          </div>

          {/* Confirm Password Field */}
          <label>Confirm password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />

          {/* Terms Checkbox */}
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="terms">
              I agree to the{" "}
              <span className="link">Conditions of Use</span> and{" "}
              <span className="link">Privacy Notice</span>
            </label>
          </div>

          <button type="submit" className="auth-btn" disabled={isLoading || !agreeToTerms}>
            {isLoading ? "Creating account..." : "Create your Amazon account"}
          </button>
        </form>
      </div>

      <div className="new-box">
        <p>Already have an account?</p>
        <button onClick={() => navigate("/login")} className="create-btn">
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Register;
