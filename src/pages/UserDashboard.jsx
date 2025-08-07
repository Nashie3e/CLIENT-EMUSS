import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleDentalClick = () => {
    navigate('/dental-consultation');
  };

  const handleMedicalClick = () => {
    navigate('/medical-consultation');
  };

  const handleAppointmentsClick = () => {
    setActiveTab('appointments');
    navigate('/appointments');
  };

  const handleMedicalHistoryClick = () => {
    setActiveTab('history');
    navigate('/medical-history');
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
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
            onClick={() => setActiveTab('dashboard')}
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
              onClick={handleProfileClick}
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
          <h2>Dashboard</h2>
          <div className="user-info">
            <span>Welcome, {user?.name || 'User'}</span>
            <div className="user-avatar">👤</div>
          </div>
        </div>
        
        <div className="main-content">
          {/* Consultation Cards */}
          <div className="dashboard-grid">
            {/* Dental Consultation Card */}
            <div 
              className="consultation-card dental"
              onClick={handleDentalClick}
            >
              <div className="card-header">
                <div className="card-icon dental">
                  🦷
                </div>
                <h3 className="card-title dental">Dental Consultation</h3>
              </div>
              <p className="card-description">
                Book appointments with our dental specialists, view your dental history, 
                and receive personalized oral health advice and treatment plans.
              </p>
              <div className="card-action dental">
                <span>Book Appointment</span>
                <span>→</span>
              </div>
            </div>

            {/* Medical Consultation Card */}
            <div 
              className="consultation-card medical"
              onClick={handleMedicalClick}
            >
              <div className="card-header">
                <div className="card-icon medical">
                  🏥
                </div>
                <h3 className="card-title medical">Medical Consultation</h3>
              </div>
              <p className="card-description">
                Schedule check-ups with our medical professionals, review past visits, 
                manage prescriptions, and get comprehensive health assessments.
              </p>
              <div className="card-action medical">
                <span>Book Appointment</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon upcoming">
                📅
              </div>
              <h3>Upcoming</h3>
              <p className="stat-number">3</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                ✅
              </div>
              <h3>Completed</h3>
              <p className="stat-number">12</p>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon monthly">
                📊
              </div>
              <h3>This Month</h3>
              <p className="stat-number">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
