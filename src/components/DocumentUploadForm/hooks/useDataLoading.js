import { useState, useEffect } from 'react';
import { getLocations } from '../../../services/locationService';
import { getDocumentTypes } from '../../../services/documentService';

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

  // Document types state
  const [documentTypes, setDocumentTypes] = useState([]);
  const [isLoadingDocumentTypes, setIsLoadingDocumentTypes] = useState(true);

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

  // Fetch document types
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setIsLoadingDocumentTypes(true);
        const types = await getDocumentTypes();
        setDocumentTypes(types);
      } catch (error) {
        console.error('Error fetching document types:', error);
        addNotification('error', 'Failed to load document types. Please try again later.');
      } finally {
        setIsLoadingDocumentTypes(false);
      }
    };

    fetchDocumentTypes();
  }, [addNotification]);

  return {
    locations,
    isLoadingLocations,
    documentTypes,
    isLoadingDocumentTypes
  };
}; 