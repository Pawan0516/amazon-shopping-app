import React, { useEffect, useState } from 'react';
import '../styles/mock-sms.css';

const MockSMS = ({ phone, onClose }) => {
  const [message, setMessage] = useState(null);

  const readMessage = () => {
    try {
      const key = `mock_sms_${phone}`;
      const raw = localStorage.getItem(key);
      if (!raw) {
        setMessage(null);
        return;
      }
      const data = JSON.parse(raw);
      setMessage(data);
    } catch (e) {
      setMessage(null);
    }
  };

  useEffect(() => {
    readMessage();
    const t = setInterval(readMessage, 1500);
    return () => clearInterval(t);
  }, [phone]);

  const clearMessage = () => {
    try {
      const key = `mock_sms_${phone}`;
      localStorage.removeItem(key);
      setMessage(null);
    } catch (e) {}
  };

  const copyOtp = () => {
    if (message && message.otp) {
      navigator.clipboard?.writeText(String(message.otp));
    }
  };

  return (
    <div className="mock-sms-backdrop" onClick={onClose}>
      <div className="mock-sms" onClick={e => e.stopPropagation()}>
        <div className="mock-sms-header">
          <h3>Mock SMS Inbox</h3>
          <button className="close" onClick={onClose}>×</button>
        </div>

        <div className="mock-sms-body">
          <p><strong>Number:</strong> +91-{phone}</p>
          {message ? (
            <>
              <p><strong>Type:</strong> {message.type}</p>
              {message.otp && <p><strong>OTP:</strong> ****{String(message.otp).slice(-2)}</p>}
              {message.message && <p>{message.message}</p>}
              <p className="muted">Sent: {new Date(message.sentAt).toLocaleString()}</p>
            </>
          ) : (
            <p>No messages for this number yet.</p>
          )}
        </div>

        <div className="mock-sms-actions">
          <button onClick={readMessage} className="btn">Refresh</button>
          <button onClick={copyOtp} className="btn" disabled={!message || !message.otp}>Copy OTP</button>
          <button onClick={clearMessage} className="btn danger" disabled={!message}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default MockSMS;
