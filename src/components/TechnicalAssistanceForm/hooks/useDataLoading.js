import { useState, useEffect } from 'react';
import { getLocations } from '../../../services/locationService';
import { getTATypes } from '../../../services/taService';

export const useDataLoading = (addNotification) => {
  // Locations state
  const [locations, setLocations] = useState({
    SDO: [],
    SCHOOL: {
      'Elementary': [],
      'Junior High School': [],
      'Senior High School': [],
      'Integrated School': []
    }
  });
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // TA types state
  const [taTypes, setTATypes] = useState([]);
  const [isLoadingTATypes, setIsLoadingTATypes] = useState(true);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingLocations(true);
        const fetchedLocations = await getLocations();
        setLocations(fetchedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
        addNotification('error', 'Failed to load locations. Please try again later.');
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, [addNotification]);

  // Fetch TA types
  useEffect(() => {
    const fetchTATypes = async () => {
      try {
        setIsLoadingTATypes(true);
        const types = await getTATypes();
        setTATypes(types);
      } catch (error) {
        console.error('Error fetching TA types:', error);
        addNotification('error', 'Failed to load TA types. Please try again later.');
      } finally {
        setIsLoadingTATypes(false);
      }
    };

    fetchTATypes();
  }, [addNotification]);

  return {
    locations,
    isLoadingLocations,
    taTypes,
    isLoadingTATypes
  };
}; 