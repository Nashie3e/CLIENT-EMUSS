import api from '../utils/api';

export const getAccountTypes = async () => {
  try {
    const response = await api.get('/public/account-types');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch account types');
  } catch (error) {
    console.error('Error fetching account types:', error);
    throw error;
  }
}; 