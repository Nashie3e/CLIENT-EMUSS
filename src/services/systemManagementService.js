import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE_URL}/system`;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create axios instance with auth header
const createAuthAxios = () => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    }
  });
};

// Location Management
export const getLocations = async () => {
  const response = await createAuthAxios().get('/locations');
  return response.data;
};

export const createLocation = async (locationData) => {
  const response = await createAuthAxios().post('/locations', locationData);
  return response.data;
};

export const updateLocation = async (id, locationData) => {
  const response = await createAuthAxios().put(`/locations/${id}`, locationData);
  return response.data;
};

export const deleteLocation = async (id) => {
  const response = await createAuthAxios().delete(`/locations/${id}`);
  return response.data;
};

// Account Type Management
export const getAccountTypes = async () => {
  const response = await createAuthAxios().get('/account-types');
  return response.data;
};

export const createAccountType = async (accountTypeData) => {
  const response = await createAuthAxios().post('/account-types', accountTypeData);
  return response.data;
};

export const updateAccountType = async (id, accountTypeData) => {
  const response = await createAuthAxios().put(`/account-types/${id}`, accountTypeData);
  return response.data;
};

export const deleteAccountType = async (id) => {
  const response = await createAuthAxios().delete(`/account-types/${id}`);
  return response.data;
};

// Document Type Management
export const getDocumentTypes = async () => {
  const response = await createAuthAxios().get('/document-types');
  return response.data;
};

export const createDocumentType = async (documentTypeData) => {
  const response = await createAuthAxios().post('/document-types', documentTypeData);
  return response.data;
};

export const updateDocumentType = async (id, documentTypeData) => {
  const response = await createAuthAxios().put(`/document-types/${id}`, documentTypeData);
  return response.data;
};

export const deleteDocumentType = async (id) => {
  const response = await createAuthAxios().delete(`/document-types/${id}`);
  return response.data;
};

// Technical Assistance Type Management
export const getTATypes = async () => {
  const response = await createAuthAxios().get('/ta-types');
  return response.data;
};

export const createTAType = async (taTypeData) => {
  const response = await createAuthAxios().post('/ta-types', taTypeData);
  return response.data;
};

export const updateTAType = async (id, taTypeData) => {
  const response = await createAuthAxios().put(`/ta-types/${id}`, taTypeData);
  return response.data;
};

export const deleteTAType = async (id) => {
  const response = await createAuthAxios().delete(`/ta-types/${id}`);
  return response.data;
};

// User Management (ADMIN and STAFF)
export const getUsers = async () => {
  const response = await createAuthAxios().get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await createAuthAxios().post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await createAuthAxios().put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await createAuthAxios().delete(`/users/${id}`);
  return response.data;
};

// Reset user password
export const resetUserPassword = async (id) => {
  const response = await createAuthAxios().post(`/users/${id}/reset-password`);
  return response.data;
}; 

// Reset ICT COORDINATOR account
export const resetIctCoordinatorAccount = async (id) => {
  const response = await createAuthAxios().post(`/users/${id}/reset-ict-coordinator-account`);
  return response.data;
};

// Reset ADMIN account
export const resetAdminAccount = async (id) => {
  const response = await createAuthAxios().post(`/users/${id}/reset-admin-account`);
  return response.data;
}; 