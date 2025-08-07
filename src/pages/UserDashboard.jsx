import React from 'react';

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Your Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your consultations below.</p>
      </div>

      {/* Boxes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dental Consultation Box */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-2xl font-semibold text-blue-600 mb-3">Dental Consultation</h2>
          <p className="text-gray-700 mb-4">
            Book appointments, view dental history, and receive oral health advice.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Go to Dental
          </button>
        </div>

        {/* Medical Consultation Box */}
        <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
          <h2 className="text-2xl font-semibold text-green-600 mb-3">Medical Consultation</h2>
          <p className="text-gray-700 mb-4">
            Schedule check-ups, review past visits, and manage prescriptions.
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Go to Medical
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
