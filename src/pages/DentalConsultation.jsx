import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Consultation.css';
import '../styles/UserDashboard.css';

const DentalConsultation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const dentalServices = [
    { id: 'checkup', name: 'Regular Checkup', duration: '30 min', price: '$50' },
    { id: 'cleaning', name: 'Teeth Cleaning', duration: '45 min', price: '$80' },
    { id: 'whitening', name: 'Teeth Whitening', duration: '60 min', price: '$150' },
    { id: 'filling', name: 'Cavity Filling', duration: '45 min', price: '$120' },
    { id: 'extraction', name: 'Tooth Extraction', duration: '30 min', price: '$200' },
    { id: 'consultation', name: 'Emergency Consultation', duration: '20 min', price: '$75' }
  ];

  const availableTimes = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
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

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime && selectedService) {
      alert('Appointment booked successfully!');
      navigate('/user-dashboard');
    } else {
      alert('Please fill in all required fields.');
    }
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
              <h1>Dental Consultation</h1>
              <p>Book your dental appointment</p>
            </div>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.name || 'User'}</span>
            <div className="user-avatar">👤</div>
          </div>
        </div>

        <div className="main-content">
          <div className="consultation-grid">
            {/* Main Content */}
            <div>
              {/* Services Selection */}
              <div className="form-section">
                <h2>Select Service</h2>
                <div className="service-grid">
                  {dentalServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
                    >
                      <div className="service-header">
                        <h3 className="service-name">{service.name}</h3>
                        <span className="service-price dental">{service.price}</span>
                      </div>
                      <p className="service-duration">Duration: {service.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="form-section">
                <h2>Select Date & Time</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="form-control dental"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="form-control dental"
                    >
                      <option value="">Select a time</option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms Description */}
              <div className="form-section">
                <h2>Describe Your Symptoms</h2>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Please describe any symptoms, concerns, or specific issues you'd like to discuss..."
                  className="form-control dental"
                  rows={4}
                />
              </div>

              {/* Book Button */}
              <div className="action-section">
                <button
                  onClick={handleBookAppointment}
                  className="book-btn dental"
                >
                  Book Appointment
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="consultation-sidebar">
              {/* Appointment Summary */}
              <div className="summary-card">
                <h3>Appointment Summary</h3>
                
                {selectedService && (
                  <div className="summary-item">
                    <span className="summary-label">Service</span>
                    <span className="summary-value">
                      {dentalServices.find(s => s.id === selectedService)?.name}
                    </span>
                  </div>
                )}
                
                {selectedDate && (
                  <div className="summary-item">
                    <span className="summary-label">Date</span>
                    <span className="summary-value">{selectedDate}</span>
                  </div>
                )}
                
                {selectedTime && (
                  <div className="summary-item">
                    <span className="summary-label">Time</span>
                    <span className="summary-value">{selectedTime}</span>
                  </div>
                )}
                
                {selectedService && (
                  <div className="summary-item">
                    <span className="summary-label">Estimated Cost</span>
                    <span className="summary-cost">
                      {dentalServices.find(s => s.id === selectedService)?.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Dental Tips */}
              <div className="tips-card">
                <h3>Dental Care Tips</h3>
                <ul className="tips-list">
                  <li>Brush twice daily with fluoride toothpaste</li>
                  <li>Floss daily to remove plaque</li>
                  <li>Limit sugary foods and drinks</li>
                  <li>Visit dentist every 6 months</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalConsultation;
