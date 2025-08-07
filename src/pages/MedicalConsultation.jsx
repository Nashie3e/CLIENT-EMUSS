import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Consultation.css';
import '../styles/UserDashboard.css';

const MedicalConsultation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const medicalServices = [
    { id: 'checkup', name: 'General Checkup', duration: '30 min', price: '$80' },
    { id: 'consultation', name: 'Specialist Consultation', duration: '45 min', price: '$120' },
    { id: 'emergency', name: 'Emergency Visit', duration: '20 min', price: '$150' },
    { id: 'followup', name: 'Follow-up Visit', duration: '20 min', price: '$60' },
    { id: 'vaccination', name: 'Vaccination', duration: '15 min', price: '$40' },
    { id: 'labwork', name: 'Lab Work Consultation', duration: '30 min', price: '$90' }
  ];

  const doctors = [
    { id: 'dr-smith', name: 'Dr. Sarah Smith', specialty: 'General Medicine', rating: 4.8 },
    { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialty: 'Cardiology', rating: 4.9 },
    { id: 'dr-williams', name: 'Dr. Emily Williams', specialty: 'Pediatrics', rating: 4.7 },
    { id: 'dr-brown', name: 'Dr. David Brown', specialty: 'Internal Medicine', rating: 4.6 }
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

  const handleMedicalHistoryClick = () => {
    setActiveTab('history');
    navigate('/medical-history');
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
    navigate('/profile');
  };

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime && selectedService && selectedDoctor) {
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
          <div className="header-left">
            <button
              onClick={handleBackToDashboard}
              className="back-btn"
            >
              ←
            </button>
            <div className="header-title">
              <h1>Medical Consultation</h1>
              <p>Book your medical appointment</p>
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
                  {medicalServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`service-card ${selectedService === service.id ? 'selected medical' : ''}`}
                    >
                      <div className="service-header">
                        <h3 className="service-name">{service.name}</h3>
                        <span className="service-price medical">{service.price}</span>
                      </div>
                      <p className="service-duration">Duration: {service.duration}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Selection */}
              <div className="form-section">
                <h2>Select Doctor</h2>
                <div className="doctor-grid">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor.id)}
                      className={`doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                    >
                      <div className="doctor-info">
                        <div className="doctor-details">
                          <h4>{doctor.name}</h4>
                          <p>{doctor.specialty}</p>
                        </div>
                        <div className="doctor-rating">
                          ⭐ {doctor.rating}
                        </div>
                      </div>
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
                      className="form-control medical"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="form-control medical"
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
                  className="form-control medical"
                  rows={4}
                />
              </div>

              {/* Book Button */}
              <div className="action-section">
                <button
                  onClick={handleBookAppointment}
                  className="book-btn medical"
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
                      {medicalServices.find(s => s.id === selectedService)?.name}
                    </span>
                  </div>
                )}
                
                {selectedDoctor && (
                  <div className="summary-item">
                    <span className="summary-label">Doctor</span>
                    <span className="summary-value">
                      {doctors.find(d => d.id === selectedDoctor)?.name}
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
                    <span className="summary-cost medical">
                      {medicalServices.find(s => s.id === selectedService)?.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Health Tips */}
              <div className="tips-card medical">
                <h3>Health Tips</h3>
                <ul className="tips-list">
                  <li>Stay hydrated with 8 glasses of water daily</li>
                  <li>Get 7-9 hours of sleep each night</li>
                  <li>Exercise for at least 30 minutes daily</li>
                  <li>Eat a balanced diet with fruits and vegetables</li>
                </ul>
              </div>

              {/* Emergency Contact */}
              <div className="emergency-card">
                <h3>Emergency Contact</h3>
                <p>For medical emergencies, call:</p>
                <p className="emergency-number">911</p>
                <p>Or visit the nearest emergency room</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalConsultation;
