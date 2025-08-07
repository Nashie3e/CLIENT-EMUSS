import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import '../styles/UserDashboard.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeSection, setActiveSection] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-01',
    gender: 'Male',
    address: '123 Main Street, City, State 12345',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    privacy: {
      shareData: false,
      publicProfile: false
    },
    language: 'English',
    timezone: 'UTC-5 (Eastern Time)'
  });

  const handleBackToDashboard = () => {
    navigate('/user-dashboard');
  };

  const handleDashboardClick = () => {
    setActiveTab('dashboard');
    navigate('/user-dashboard');
  };

  const handleAppointmentsClick = () => {
    setActiveTab('appointments');
    navigate('/appointments');
  };

  const handleMedicalHistoryClick = () => {
    setActiveTab('history');
    navigate('/medical-history');
  };

  const handleSavePersonalInfo = () => {
    // In a real app, this would make an API call
    alert('Personal information updated successfully!');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    // In a real app, this would make an API call
    alert('Password changed successfully!');
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call
    alert('Account deletion request submitted. You will receive a confirmation email.');
    setShowDeleteModal(false);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleInputChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setPersonalInfo(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  return (
    <div className="user-container">
      {/* Sidebar */}
      <div className="user-sidebar">
        <div className="sidebar-header">
          <h1>EMUSS</h1>
          <p>User Portal</p>
        </div>
        
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={handleDashboardClick}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={handleAppointmentsClick}
          >
            📅 Appointments
          </button>
          <button
            className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
            onClick={handleMedicalHistoryClick}
          >
            📋 Medical History
          </button>
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="user-main">
        <div className="main-header">
          <div className="header-left">
            <button
              onClick={handleBackToDashboard}
              className="back-btn"
            >
              ←
            </button>
            <div className="header-title">
              <h1>Profile Settings</h1>
              <p>Manage your account and preferences</p>
            </div>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name || 'User'}</span>
            <div className="user-avatar">👤</div>
          </div>
        </div>
        
        <div className="main-content">
          {/* Profile Overview */}
          <div className="profile-overview">
            <div className="profile-header">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {personalInfo.firstName.charAt(0)}{personalInfo.lastName.charAt(0)}
                </div>
                <button className="change-avatar-btn">📷 Change Photo</button>
              </div>
              <div className="profile-info">
                <h2>{personalInfo.firstName} {personalInfo.lastName}</h2>
                <p className="user-email">{personalInfo.email}</p>
                <p className="member-since">Member since January 2024</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              👤 Personal Information
            </button>
            <button
              className={`profile-tab ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              🔒 Security & Privacy
            </button>
            <button
              className={`profile-tab ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              ⚙️ Preferences
            </button>
            <button
              className={`profile-tab ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              🔔 Notifications
            </button>
          </div>

          {/* Content Sections */}
          <div className="profile-content">
            {/* Personal Information Section */}
            {activeSection === 'personal' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>Personal Information</h3>
                  {!isEditing && (
                    <button 
                      className="edit-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit
                    </button>
                  )}
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={personalInfo.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      value={personalInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      disabled={!isEditing}
                      className="form-control"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="emergency-contact-section">
                  <h4>Emergency Contact</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contact Name</label>
                      <input
                        type="text"
                        value={personalInfo.emergencyContact.name}
                        onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Relationship</label>
                      <input
                        type="text"
                        value={personalInfo.emergencyContact.relationship}
                        onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={personalInfo.emergencyContact.phone}
                        onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="action-buttons">
                    <button className="save-btn" onClick={handleSavePersonalInfo}>
                      💾 Save Changes
                    </button>
                    <button className="cancel-btn" onClick={handleCancelEdit}>
                      ❌ Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Security & Privacy Section */}
            {activeSection === 'security' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>Security & Privacy</h3>
                </div>
                
                <div className="security-options">
                  <div className="security-card">
                    <div className="security-info">
                      <h4>🔐 Change Password</h4>
                      <p>Update your account password for better security</p>
                    </div>
                    <button 
                      className="security-btn"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Change Password
                    </button>
                  </div>
                  
                  <div className="security-card">
                    <div className="security-info">
                      <h4>🔒 Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="security-btn disabled">
                      Coming Soon
                    </button>
                  </div>
                  
                  <div className="security-card">
                    <div className="security-info">
                      <h4>📱 Login Sessions</h4>
                      <p>View and manage your active login sessions</p>
                    </div>
                    <button className="security-btn disabled">
                      Coming Soon
                    </button>
                  </div>
                  
                  <div className="security-card danger">
                    <div className="security-info">
                      <h4>🗑️ Delete Account</h4>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button 
                      className="security-btn danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>Preferences</h3>
                </div>
                
                <div className="preferences-grid">
                  <div className="preference-group">
                    <h4>Language & Region</h4>
                    <div className="form-group">
                      <label>Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({...prev, language: e.target.value}))}
                        className="form-control"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Timezone</label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences(prev => ({...prev, timezone: e.target.value}))}
                        className="form-control"
                      >
                        <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                        <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                        <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
                        <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="preference-group">
                    <h4>Privacy Settings</h4>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.privacy.shareData}
                          onChange={(e) => handlePreferenceChange('privacy', 'shareData', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Allow data sharing for research purposes
                      </label>
                    </div>
                    
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.privacy.publicProfile}
                          onChange={(e) => handlePreferenceChange('privacy', 'publicProfile', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Make profile visible to other users
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="content-section">
                <div className="section-header">
                  <h3>Notification Preferences</h3>
                </div>
                
                <div className="notification-options">
                  <div className="notification-group">
                    <h4>Communication Channels</h4>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.notifications.email}
                          onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Email Notifications
                      </label>
                    </div>
                    
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.notifications.sms}
                          onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        SMS Notifications
                      </label>
                    </div>
                    
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={preferences.notifications.push}
                          onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Push Notifications
                      </label>
                    </div>
                  </div>
                  
                  <div className="notification-group">
                    <h4>Notification Types</h4>
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        Appointment Reminders
                      </label>
                    </div>
                    
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        Medical Results
                      </label>
                    </div>
                    
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmark"></span>
                        Health Tips & Updates
                      </label>
                    </div>
                    
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        Marketing Communications
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                  className="form-control"
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                  className="form-control"
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                  className="form-control"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handlePasswordChange}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal danger">
            <div className="modal-header">
              <h3>Delete Account</h3>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="warning-message">
                <h4>⚠️ Warning</h4>
                <p>This action cannot be undone. All your data, including medical records and appointment history, will be permanently deleted.</p>
                <p>Are you sure you want to delete your account?</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

