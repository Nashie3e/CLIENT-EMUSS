import api from '../utils/api';

export const getLocations = async () => {
  try {
    const response = await api.get('/public/locations');
    if (response.data.success) {
      // Process and organize locations by type and level
      const locations = {
        SDO: [],
        SCHOOL: {
          'Elementary': [],
          'Junior High School': [],
          'Senior High School': [],
          'Integrated School': []
        }
      };

      response.data.data.forEach(location => {
        if (location.type === 'SDO') {
          locations.SDO.push(location.name);
        } else if (location.type === 'SCHOOL') {
          if (locations.SCHOOL[location.level]) {
            locations.SCHOOL[location.level].push(location.name);
          }
        }
      });

      return locations;
    }
    throw new Error('Failed to fetch locations');
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
}; 