import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Appointments.css';
import '../styles/UserDashboard.css';

const Appointments = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('appointments');

  // Mock appointment data - in a real app, this would come from an API
  const appointments = [
    {
      id: 1,
      type: 'dental',
      service: 'Regular Checkup',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-12-20',
      time: '10:00 AM',
      status: 'upcoming',
      cost: '$50',
      location: 'Dental Clinic - Floor 2',
      notes: 'Please arrive 10 minutes early for paperwork'
    },
    {
      id: 2,
      type: 'medical',
      service: 'General Checkup',
      doctor: 'Dr. Michael Smith',
      date: '2024-12-22',
      time: '02:30 PM',
      status: 'upcoming',
      cost: '$80',
      location: 'Medical Clinic - Floor 1',
      notes: 'Fasting required for blood work'
    },
    {
      id: 3,
      type: 'dental',
      service: 'Teeth Cleaning',
      doctor: 'Dr. Emily Davis',
      date: '2024-12-15',
      time: '09:00 AM',
      status: 'completed',
      cost: '$80',
      location: 'Dental Clinic - Floor 2',
      notes: 'Appointment completed successfully'
    },
    {
      id: 4,
      type: 'medical',
      service: 'Specialist Consultation',
      doctor: 'Dr. Robert Wilson',
      date: '2024-12-10',
      time: '11:00 AM',
      status: 'completed',
      cost: '$120',
      location: 'Specialist Clinic - Floor 3',
      notes: 'Follow-up scheduled for next month'
    },
    {
      id: 5,
      type: 'dental',
      service: 'Emergency Consultation',
      doctor: 'Dr. Lisa Chen',
      date: '2024-12-25',
      time: '03:00 PM',
      status: 'upcoming',
      cost: '$75',
      location: 'Emergency Dental - Floor 1',
      notes: 'Emergency appointment for tooth pain'
    }
  ];

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

  const handleReschedule = (appointmentId) => {
    alert(`Rescheduling appointment ${appointmentId}`);
  };

  const handleCancel = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      alert(`Appointment ${appointmentId} cancelled`);
    }
  };

  const handleViewDetails = (appointmentId) => {
    alert(`Viewing details for appointment ${appointmentId}`);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') return appointment.status === 'upcoming';
    if (activeFilter === 'completed') return appointment.status === 'completed';
    if (activeFilter === 'dental') return appointment.type === 'dental';
    if (activeFilter === 'medical') return appointment.type === 'medical';
    return true;
  });

  const getStatusColor = (status) => {
    return status === 'upcoming' ? '#3498db' : '#27ae60';
  };

  const getTypeIcon = (type) => {
    return type === 'dental' ? '🦷' : '🏥';
  };

  const getTypeColor = (type) => {
    return type === 'dental' ? '#3498db' : '#27ae60';
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
            onClick={() => setActiveTab('history')}
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
              <h1>My Appointments</h1>
              <p>Manage your scheduled appointments</p>
            </div>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name || 'User'}</span>
            <div className="user-avatar">👤</div>
          </div>
        </div>
        
        <div className="main-content">
          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon upcoming">
                📅
              </div>
              <div className="stat-info">
                <h3>Upcoming</h3>
                <p className="stat-number">{appointments.filter(a => a.status === 'upcoming').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                ✅
              </div>
              <div className="stat-info">
                <h3>Completed</h3>
                <p className="stat-number">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon dental">
                🦷
              </div>
              <div className="stat-info">
                <h3>Dental</h3>
                <p className="stat-number">{appointments.filter(a => a.type === 'dental').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon medical">
                🏥
              </div>
              <div className="stat-info">
                <h3>Medical</h3>
                <p className="stat-number">{appointments.filter(a => a.type === 'medical').length}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Appointments
              </button>
              <button
                className={`filter-btn ${activeFilter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`filter-btn ${activeFilter === 'dental' ? 'active' : ''}`}
                onClick={() => setActiveFilter('dental')}
              >
                Dental
              </button>
              <button
                className={`filter-btn ${activeFilter === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveFilter('medical')}
              >
                Medical
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="appointments-section">
            <h2>Appointments</h2>
            
            {filteredAppointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <h3>No appointments found</h3>
                <p>You don't have any appointments matching your current filter.</p>
                <button 
                  className="book-new-btn"
                  onClick={() => navigate('/user-dashboard')}
                >
                  Book New Appointment
                </button>
              </div>
            ) : (
              <div className="appointments-grid">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <div className="appointment-type">
                        <span className="type-icon">{getTypeIcon(appointment.type)}</span>
                        <span className="type-label" style={{ color: getTypeColor(appointment.type) }}>
                          {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                        </span>
                      </div>
                      <div className="appointment-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(appointment.status) }}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="appointment-content">
                      <h3 className="service-name">{appointment.service}</h3>
                      <p className="doctor-name">Dr. {appointment.doctor}</p>
                      
                      <div className="appointment-details">
                        <div className="detail-item">
                          <span className="detail-label">📅 Date:</span>
                          <span className="detail-value">{appointment.date}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">🕐 Time:</span>
                          <span className="detail-value">{appointment.time}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">📍 Location:</span>
                          <span className="detail-value">{appointment.location}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">💰 Cost:</span>
                          <span className="detail-value cost">{appointment.cost}</span>
                        </div>
                      </div>
                      
                      {appointment.notes && (
                        <div className="appointment-notes">
                          <span className="notes-label">📝 Notes:</span>
                          <p className="notes-text">{appointment.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="appointment-actions">
                      {appointment.status === 'upcoming' && (
                        <>
                          <button
                            className="action-btn reschedule"
                            onClick={() => handleReschedule(appointment.id)}
                          >
                            Reschedule
                          </button>
                          <button
                            className="action-btn cancel"
                            onClick={() => handleCancel(appointment.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        className="action-btn details"
                        onClick={() => handleViewDetails(appointment.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
