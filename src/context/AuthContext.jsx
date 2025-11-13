import React, { useState, useEffect } from "react";
import { AuthContext } from "./Auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("amazon_clone_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("amazon_clone_user");
      }
    }
  }, []);

  // Register new user
  const register = async (name, email, phone, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (!name || !email || !phone || !password || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }

      if (!/^\d{10}$/.test(phone)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("amazon_clone_users") || "[]");
      if (existingUsers.some(u => u.email === email || u.phone === phone)) {
        throw new Error("Email or phone already registered");
      }

      // Store new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password: btoa(password), // Simple encoding (not recommended for production)
        createdAt: new Date().toISOString(),
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,
      };

      existingUsers.push(newUser);
      localStorage.setItem("amazon_clone_users", JSON.stringify(existingUsers));

      setIsLoading(false);
      return { success: true, message: "Account created successfully! Please verify your email." };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Login user
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const users = JSON.parse(localStorage.getItem("amazon_clone_users") || "[]");
      const foundUser = users.find(u => (u.email === email || u.phone === email) && u.password === btoa(password));

      if (!foundUser) {
        throw new Error("Invalid email/phone or password");
      }

      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.name)}&background=ff9900&color=fff`,
        emailVerified: foundUser.emailVerified,
        phoneVerified: foundUser.phoneVerified,
        twoFactorEnabled: foundUser.twoFactorEnabled,
        loginAt: new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem("amazon_clone_user", JSON.stringify(userData));
      setIsLoading(false);

      return { success: true, message: "Logged in successfully!" };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Login with OTP
  const loginWithOtp = async (phone, otp, generatedOtp) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!phone || !otp) {
        throw new Error("Phone and OTP are required");
      }

      if (otp !== String(generatedOtp)) {
        throw new Error("Invalid OTP");
      }

      const users = JSON.parse(localStorage.getItem("amazon_clone_users") || "[]");
      let user = users.find(u => u.phone === phone);

      if (!user) {
        // Create user if doesn't exist (guest login)
        user = {
          id: Date.now(),
          name: "Amazon Customer",
          email: `customer_${phone}@amazon.com`,
          phone: phone,
          password: "",
          createdAt: new Date().toISOString(),
          emailVerified: false,
          phoneVerified: true,
          twoFactorEnabled: false,
        };
        users.push(user);
        localStorage.setItem("amazon_clone_users", JSON.stringify(users));
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff9900&color=fff`,
        emailVerified: user.emailVerified,
        phoneVerified: true,
        loginAt: new Date().toISOString(),
      };

      setUser(userData);
      localStorage.setItem("amazon_clone_user", JSON.stringify(userData));
      setIsLoading(false);

      return { success: true, message: "Logged in successfully with OTP!" };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem("amazon_clone_user");
  };

  // Reset password
  const resetPassword = async (email, newPassword, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!email || !newPassword || !confirmPassword) {
        throw new Error("All fields are required");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const users = JSON.parse(localStorage.getItem("amazon_clone_users") || "[]");
      const userIndex = users.findIndex(u => u.email === email);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      users[userIndex].password = btoa(newPassword);
      localStorage.setItem("amazon_clone_users", JSON.stringify(users));

      setIsLoading(false);
      return { success: true, message: "Password reset successfully!" };
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithOtp,
        register,
        logout,
        resetPassword,
        isLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
