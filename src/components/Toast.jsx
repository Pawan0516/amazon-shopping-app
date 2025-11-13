import React, { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import '../styles/notifications.css';

const Toast = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="toast-container">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`toast ${notification.type}`}
        >
          <div className="toast-content">
            {notification.type === 'success' && <span className="toast-icon">✓</span>}
            {notification.type === 'error' && <span className="toast-icon">✕</span>}
            {notification.type === 'info' && <span className="toast-icon">ℹ</span>}
            {notification.type === 'warning' && <span className="toast-icon">⚠</span>}
            <span className="toast-message">{notification.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => removeNotification(notification.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
