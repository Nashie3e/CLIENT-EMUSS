import { useState, useEffect } from 'react';
import { getLocations } from '../../../services/locationService';
import { getAccountTypes } from '../../../services/accountService';

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

  // Account types state
  const [accountTypes, setAccountTypes] = useState([]);
  const [isLoadingAccountTypes, setIsLoadingAccountTypes] = useState(true);

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

  // Fetch account types
  useEffect(() => {
    const fetchAccountTypes = async () => {
      try {
        setIsLoadingAccountTypes(true);
        const types = await getAccountTypes();
        setAccountTypes(types);
      } catch (error) {
        console.error('Error fetching account types:', error);
        addNotification('error', 'Failed to load account types. Please try again later.');
      } finally {
        setIsLoadingAccountTypes(false);
      }
    };

    fetchAccountTypes();
  }, [addNotification]);

  return {
    locations,
    isLoadingLocations,
    accountTypes,
    isLoadingAccountTypes
  };
}; 