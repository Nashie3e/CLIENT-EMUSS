import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

function Admin() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const renderDashboard = () => (
    <div className="dashboard-section">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p className="dashboard-number">1,234</p>
          <span className="dashboard-change positive">+12% from last month</span>
        </div>
        <div className="dashboard-card">
          <h3>Active Bookings</h3>
          <p className="dashboard-number">89</p>
          <span className="dashboard-change positive">+5% from last week</span>
        </div>
        <div className="dashboard-card">
          <h3>Pending Approvals</h3>
          <p className="dashboard-number">23</p>
          <span className="dashboard-change negative">-3% from yesterday</span>
        </div>
        <div className="dashboard-card">
          <h3>Revenue</h3>
          <p className="dashboard-number">$45,678</p>
          <span className="dashboard-change positive">+8% from last month</span>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2 hours ago</span>
            <span className="activity-text">New booking created by John Doe</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">4 hours ago</span>
            <span className="activity-text">Account approved for Jane Smith</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">6 hours ago</span>
            <span className="activity-text">Payment received from Mike Johnson</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="calendar-section">
      <h2>Calendar</h2>
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="calendar-nav-btn">←</button>
          <h3>December 2024</h3>
          <button className="calendar-nav-btn">→</button>
        </div>
        
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          
          <div className="calendar-days">
            {Array.from({ length: 31 }, (_, i) => (
              <div key={i + 1} className={`calendar-day ${i + 1 === 15 ? 'has-event' : ''}`}>
                {i + 1}
                {i + 1 === 15 && <span className="event-indicator">3</span>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="upcoming-events">
          <h3>Upcoming Events</h3>
          <div className="event-list">
            <div className="event-item">
              <div className="event-date">Dec 15</div>
              <div className="event-details">
                <h4>Medical Consultation</h4>
                <p>Dr. Smith - 2:00 PM</p>
              </div>
            </div>
            <div className="event-item">
              <div className="event-date">Dec 18</div>
              <div className="event-details">
                <h4>Follow-up Appointment</h4>
                <p>Dr. Johnson - 10:30 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountCreation = () => (
    <div className="account-creation-section">
      <h2>Create New Account</h2>
      <form className="account-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" required>
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select id="department" name="department" required>
            <option value="">Select Department</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="general">General Medicine</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="create-account-btn">Create Account</button>
          <button type="button" className="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveSection('calendar')}
          >
            📅 Calendar
          </button>
          <button 
            className={`nav-item ${activeSection === 'account' ? 'active' : ''}`}
            onClick={() => setActiveSection('account')}
          >
            👤 Create Account
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>
      
      <div className="admin-main">
        <div className="main-header">
          <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
          <div className="user-info">
            <span>Welcome, {user?.name || 'Admin'}</span>
            <div className="user-avatar">👤</div>
          </div>
        </div>
        
        <div className="main-content">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'calendar' && renderCalendar()}
          {activeSection === 'account' && renderAccountCreation()}
        </div>
      </div>
    </div>
  );
}

export default Admin; 