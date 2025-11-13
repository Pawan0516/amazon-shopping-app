import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import { AuthContext } from '../context/Auth';
import { NotificationContext } from '../context/NotificationContext';

const ForgotPassword = () => {
  const { resetPassword, isLoading, setError } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    const result = await resetPassword(email, newPassword, confirmPassword);
    if (result.success) {
      addNotification(result.message || 'Password reset successful', 'success', 4000);
      navigate('/login');
    } else {
      addNotification(result.message || 'Unable to reset password', 'error', 5000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <Link to="/" className="auth-logo-link">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Logo" className="auth-logo" />
        </Link>
        <h2>Reset Password</h2>
        <form onSubmit={handleReset}>
          <label>Email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />

          <label>New password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />

          <label>Confirm password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

          <button className="auth-btn" type="submit" disabled={isLoading}>Reset password</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
