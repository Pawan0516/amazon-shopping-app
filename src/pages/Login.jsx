import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import { AuthContext } from "../context/Auth";
import { NotificationContext } from "../context/NotificationContext";
import MockSMS from "../components/MockSMS";

const Login = () => {
  const { loginWithOtp, login, isLoading, error, setError } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const [loginMethod, setLoginMethod] = useState("otp"); // otp or password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [step, setStep] = useState(1);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showSmsInbox, setShowSmsInbox] = useState(false);
  const navigate = useNavigate();

  // Send OTP
  const sendOtp = () => {
    setError(null);
    
    if (!phone.trim()) {
      setError("Please enter a mobile number");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(otpCode);
    setStep(2);
    setResendTimer(30);
    // Persist mock SMS to localStorage (simulates OTP arriving on user's SIM)
    try {
      const key = `mock_sms_${phone}`;
      const payload = { type: 'otp', otp: otpCode, sentAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
      // ignore storage errors
    }
    // Notify user that OTP was sent to their mobile (show only masked number)
    addNotification(`OTP sent to +91-${phone.slice(-4)}`, 'info', 5000);
    // Open mock SMS inbox automatically so dev can verify without alert
    setShowSmsInbox(true);
  };

  // Verify OTP and Login
  const verifyOtp = async () => {
    setError(null);

    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    const result = await loginWithOtp(phone, otp, generatedOtp);

    if (result.success) {
      // After successful OTP login, send user to cart
      navigate("/cart");
    } else {
      setError(result.message);
    }
  };

  // Login with Email/Password
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem("amazon_clone_remember_email", email);
      }
      // If login via password succeeds, redirect to cart and save a mock SMS if phone available
      try {
        const users = JSON.parse(localStorage.getItem("amazon_clone_users") || "[]");
        const found = users.find(u => u.email === email || u.phone === email);
        if (found && found.phone) {
          const key = `mock_sms_${found.phone}`;
          const payload = { type: 'login_notice', message: `New sign-in on ${new Date().toLocaleString()}`, sentAt: Date.now() };
          localStorage.setItem(key, JSON.stringify(payload));
          addNotification(`Login SMS sent to +91-${String(found.phone).slice(-4)}`, 'info', 4000);
          // Optionally open the mock SMS inbox for that number (dev-only)
          setShowSmsInbox(true);
        }
      } catch (e) {
        // ignore parsing errors
      }
      navigate("/cart");
    } else {
      setError(result.message);
    }
  };

  // Resend OTP Timer
  React.useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Load remembered email
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("amazon_clone_remember_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

        {/* Login Method Toggle */}
        <div className="login-method-toggle">
          <button
            className={`toggle-btn ${loginMethod === "otp" ? "active" : ""}`}
            onClick={() => {
              setLoginMethod("otp");
              setStep(1);
              setError(null);
            }}
          >
            📱 OTP
          </button>
          <button
            className={`toggle-btn ${loginMethod === "password" ? "active" : ""}`}
            onClick={() => {
              setLoginMethod("password");
              setError(null);
            }}
          >
            🔐 Password
          </button>
        </div>

        {/* OTP Login Flow */}
        {loginMethod === "otp" && (
          <>
            {step === 1 ? (
              <>
                <h2>Sign In with OTP</h2>
                <label>Mobile number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength="10"
                  disabled={isLoading}
                />
                <button
                  onClick={sendOtp}
                  className="auth-btn"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <h2>Verify OTP</h2>
                <p className="otp-sent-msg">
                  OTP sent to <strong>{phone}</strong>
                </p>
                <label>Enter 4-digit OTP</label>
                <input
                  type="text"
                  placeholder="0000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength="4"
                  disabled={isLoading}
                />
                <button
                  onClick={verifyOtp}
                  className="auth-btn"
                  disabled={isLoading || otp.length !== 4}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </button>
                <p className="resend-msg">
                  Didn't receive OTP?{" "}
                  {resendTimer > 0 ? (
                    <span>Resend in {resendTimer}s</span>
                  ) : (
                    <span
                      className="link"
                      onClick={() => sendOtp()}
                      style={{ cursor: "pointer" }}
                    >
                      Resend OTP
                    </span>
                  )}
                </p>
                <button
                  className="back-btn"
                  onClick={() => {
                    setStep(1);
                    setPhone("");
                    setOtp("");
                    setGeneratedOtp(null);
                  }}
                >
                  ← Back
                </button>
              </>
            )}
          </>
        )}

        {/* Password Login Flow */}
        {loginMethod === "password" && (
          <form onSubmit={handlePasswordLogin}>
            <h2>Sign In</h2>
            <label>Email or Mobile Number</label>
            <input
              type="text"
              placeholder="Enter your email or 10-digit mobile"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="remember-forget">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="link">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}
      </div>

      <div className="new-box">
        <p>New to Amazon?</p>
        <button onClick={() => navigate("/register")} className="create-btn">
          Create your Amazon account
        </button>
      </div>
        {showSmsInbox && (
          <MockSMS phone={loginMethod === 'otp' ? phone : (() => {
            // try to find phone for email
            try {
              const users = JSON.parse(localStorage.getItem('amazon_clone_users') || '[]');
              const found = users.find(u => u.email === email || u.phone === email);
              return found ? found.phone : phone;
            } catch (e) { return phone; }
          })()} onClose={() => setShowSmsInbox(false)} />
        )}
    </div>
  );
};

export default Login;
