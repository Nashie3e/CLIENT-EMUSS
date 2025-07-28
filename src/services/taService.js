import api from '../utils/api';

export const getTATypes = async () => {
  try {
    const response = await api.get('/public/ta-types');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch TA types');
  } catch (error) { 
    console.error('Error fetching TA types:', error);
    throw error;
  }
}; 