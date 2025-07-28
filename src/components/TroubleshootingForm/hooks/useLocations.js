import { useState, useEffect } from 'react';
import { getLocations } from '../../../services/locationService';

export const useLocations = (addNotification) => {
  const [locations, setLocations] = useState({
    SDO: [],
    SCHOOL: {
      'Elementary': [],
      'Junior High School': [],
      'Senior High School': [],
      'Integrated School': []
    }
  });
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [locationsError, setLocationsError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLocationsLoading(true);
        setLocationsError(null);
        const data = await getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocationsError('Failed to load locations. Please try again later.');
        addNotification('error', 'Failed to load locations. Please try again later.');
      } finally {
        setLocationsLoading(false);
      }
    };

    fetchLocations();
  }, [addNotification]);

  return {
    locations,
    locationsLoading,
    locationsError
  };
}; 