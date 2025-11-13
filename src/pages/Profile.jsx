import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/Auth';
import '../styles/profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('info');
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', address: '123 Main St, City' }
  ]);
  const [payments, setPayments] = useState([
    { id: 1, type: 'Card', last4: '1234', name: 'Visa' }
  ]);

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Please login to view your profile</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h1>{user.name || 'User'}</h1>
          <p>Phone: {user.phone}</p>
          <p>Member since {new Date().getFullYear()}</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Personal Info
        </button>
        <button 
          className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          Saved Addresses
        </button>
        <button 
          className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          Payment Methods
        </button>
        <button 
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'info' && (
          <div className="tab-pane">
            <h2>Personal Information</h2>
            <div className="info-group">
              <label>Name</label>
              <input type="text" defaultValue={user.name} />
            </div>
            <div className="info-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" />
            </div>
            <div className="info-group">
              <label>Phone</label>
              <input type="tel" defaultValue={user.phone} />
            </div>
            <button className="save-btn">Save Changes</button>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="tab-pane">
            <h2>Saved Addresses</h2>
            <div className="address-list">
              {addresses.map(addr => (
                <div className="address-item" key={addr.id}>
                  <div className="address-type">{addr.type}</div>
                  <div className="address-text">{addr.address}</div>
                  <div className="address-actions">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="add-btn">+ Add New Address</button>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="tab-pane">
            <h2>Payment Methods</h2>
            <div className="payment-list">
              {payments.map(payment => (
                <div className="payment-item" key={payment.id}>
                  <div className="payment-icon">💳</div>
                  <div className="payment-info">
                    <p className="payment-name">{payment.name} ****{payment.last4}</p>
                    <p className="payment-type">{payment.type}</p>
                  </div>
                  <div className="payment-actions">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="add-btn">+ Add Payment Method</button>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="tab-pane">
            <h2>Preferences</h2>
            <div className="preference-item">
              <input type="checkbox" id="emails" defaultChecked />
              <label htmlFor="emails">Receive promotional emails</label>
            </div>
            <div className="preference-item">
              <input type="checkbox" id="notifications" defaultChecked />
              <label htmlFor="notifications">Enable push notifications</label>
            </div>
            <div className="preference-item">
              <input type="checkbox" id="offers" />
              <label htmlFor="offers">Receive special offers</label>
            </div>
            <button className="save-btn">Save Preferences</button>
          </div>
        )}
      </div>

      <div className="profile-actions">
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
