import { createContext, useState, useCallback } from 'react';
import { AuthProvider } from "./AuthContext";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, [removeNotification]);

  return (
    <AuthProvider>
      <NotificationContext.Provider value={{ addNotification, removeNotification, notifications }}>
        {children}
      </NotificationContext.Provider>
    </AuthProvider>
  );
};
