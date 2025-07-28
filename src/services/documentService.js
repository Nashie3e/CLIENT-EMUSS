import api from '../utils/api';

export const getDocumentTypes = async () => {
  try {
    const response = await api.get('/public/document-types');
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error('Failed to fetch document types');
  } catch (error) {
    console.error('Error fetching document types:', error);
    throw error;
  }
}; 