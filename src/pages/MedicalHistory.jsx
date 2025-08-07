import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/MedicalHistory.css';
import '../styles/UserDashboard.css';

const MedicalHistory = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('history');

  // Mock medical history data - in a real app, this would come from an API
  const medicalHistory = [
    {
      id: 1,
      type: 'dental',
      service: 'Regular Checkup',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-11-15',
      status: 'completed',
      diagnosis: 'Healthy teeth and gums',
      treatment: 'Routine cleaning and examination',
      prescription: 'None',
      followUp: '6 months',
      notes: 'Patient has good oral hygiene habits'
    },
    {
      id: 2,
      type: 'medical',
      service: 'General Checkup',
      doctor: 'Dr. Michael Smith',
      date: '2024-10-20',
      status: 'completed',
      diagnosis: 'Normal health status',
      treatment: 'Routine physical examination',
      prescription: 'Multivitamin supplement',
      followUp: '1 year',
      notes: 'Blood pressure and heart rate normal'
    },
    {
      id: 3,
      type: 'dental',
      service: 'Cavity Filling',
      doctor: 'Dr. Emily Davis',
      date: '2024-09-10',
      status: 'completed',
      diagnosis: 'Cavity in upper right molar',
      treatment: 'Composite filling',
      prescription: 'Ibuprofen for pain management',
      followUp: '3 months',
      notes: 'Patient reported sensitivity after procedure'
    },
    {
      id: 4,
      type: 'medical',
      service: 'Specialist Consultation',
      doctor: 'Dr. Robert Wilson',
      date: '2024-08-25',
      status: 'completed',
      diagnosis: 'Seasonal allergies',
      treatment: 'Allergy management plan',
      prescription: 'Cetirizine 10mg daily',
      followUp: 'As needed',
      notes: 'Patient responded well to treatment'
    },
    {
      id: 5,
      type: 'dental',
      service: 'Emergency Consultation',
      doctor: 'Dr. Lisa Chen',
      date: '2024-07-30',
      status: 'completed',
      diagnosis: 'Toothache due to cracked tooth',
      treatment: 'Temporary crown placement',
      prescription: 'Acetaminophen for pain',
      followUp: '2 weeks',
      notes: 'Permanent crown scheduled for next visit'
    },
    {
      id: 6,
      type: 'medical',
      service: 'Vaccination',
      doctor: 'Dr. Emily Williams',
      date: '2024-06-15',
      status: 'completed',
      diagnosis: 'Routine vaccination',
      treatment: 'Flu shot administered',
      prescription: 'None',
      followUp: '1 year',
      notes: 'No adverse reactions reported'
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

  const handleProfileClick = () => {
    setActiveTab('profile');
    navigate('/profile');
  };

  const handleViewDetails = (recordId) => {
    alert(`Viewing detailed medical record ${recordId}`);
  };

  const handleDownloadRecord = (recordId) => {
    alert(`Downloading medical record ${recordId}`);
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const filteredHistory = medicalHistory.filter(record => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'dental') return record.type === 'dental';
    if (activeFilter === 'medical') return record.type === 'medical';
    if (activeFilter === 'recent') {
      const recordDate = new Date(record.date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return recordDate >= threeMonthsAgo;
    }
    return true;
  });

  const getTypeIcon = (type) => {
    return type === 'dental' ? '🦷' : '🏥';
  };

  const getTypeColor = (type) => {
    return type === 'dental' ? '#3498db' : '#27ae60';
  };

  const getStatusColor = (status) => {
    return status === 'completed' ? '#27ae60' : '#f39c12';
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
              <h1>Medical History</h1>
              <p>View your complete medical and dental records</p>
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
              <div className="stat-icon dental">
                🦷
              </div>
              <div className="stat-info">
                <h3>Dental Records</h3>
                <p className="stat-number">{medicalHistory.filter(r => r.type === 'dental').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon medical">
                🏥
              </div>
              <div className="stat-info">
                <h3>Medical Records</h3>
                <p className="stat-number">{medicalHistory.filter(r => r.type === 'medical').length}</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon recent">
                📅
              </div>
              <div className="stat-info">
                <h3>Recent (3 months)</h3>
                <p className="stat-number">
                  {medicalHistory.filter(record => {
                    const recordDate = new Date(record.date);
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    return recordDate >= threeMonthsAgo;
                  }).length}
                </p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon total">
                📋
              </div>
              <div className="stat-info">
                <h3>Total Records</h3>
                <p className="stat-number">{medicalHistory.length}</p>
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
                All Records
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
              <button
                className={`filter-btn ${activeFilter === 'recent' ? 'active' : ''}`}
                onClick={() => setActiveFilter('recent')}
              >
                Recent (3 months)
              </button>
            </div>
          </div>

          {/* Medical History List */}
          <div className="history-section">
            <h2>Medical Records</h2>
            
            {filteredHistory.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No medical records found</h3>
                <p>You don't have any medical records matching your current filter.</p>
                <button 
                  className="book-new-btn"
                  onClick={() => navigate('/user-dashboard')}
                >
                  Book New Appointment
                </button>
              </div>
            ) : (
              <div className="history-grid">
                {filteredHistory.map((record) => (
                  <div key={record.id} className="history-card">
                    <div className="history-header">
                      <div className="record-type">
                        <span className="type-icon">{getTypeIcon(record.type)}</span>
                        <span className="type-label" style={{ color: getTypeColor(record.type) }}>
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </span>
                      </div>
                      <div className="record-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(record.status) }}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="history-content">
                      <h3 className="service-name">{record.service}</h3>
                      <p className="doctor-name">Dr. {record.doctor}</p>
                      
                      <div className="record-details">
                        <div className="detail-item">
                          <span className="detail-label">📅 Date:</span>
                          <span className="detail-value">{record.date}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">🔍 Diagnosis:</span>
                          <span className="detail-value">{record.diagnosis}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">💊 Treatment:</span>
                          <span className="detail-value">{record.treatment}</span>
                        </div>
                        {record.prescription !== 'None' && (
                          <div className="detail-item">
                            <span className="detail-label">💊 Prescription:</span>
                            <span className="detail-value prescription">{record.prescription}</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <span className="detail-label">🔄 Follow-up:</span>
                          <span className="detail-value">{record.followUp}</span>
                        </div>
                      </div>
                      
                      {record.notes && (
                        <div className="record-notes">
                          <span className="notes-label">📝 Notes:</span>
                          <p className="notes-text">{record.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="history-actions">
                      <button
                        className="action-btn details"
                        onClick={() => handleViewDetails(record.id)}
                      >
                        View Details
                      </button>
                      <button
                        className="action-btn download"
                        onClick={() => handleDownloadRecord(record.id)}
                      >
                        Download Record
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

export default MedicalHistory;
