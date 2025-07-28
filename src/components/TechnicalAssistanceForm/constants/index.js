// Initial form data
export const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  priority: '',
  taType: '',
  location: '',
  schoolLevel: '',
  schoolName: '',
  department: '',
  subject: '',
  message: '',
  otherTaType: ''
};

// Validation patterns
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Form options
export const PRIORITIES = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' }
];

export const LOCATION_TYPES = [
  { value: 'SDO_IMUS_CITY', label: 'SDO - Imus City' },
  { value: 'SCHOOL_IMUS_CITY', label: 'School - Imus City' }
];

// Menu props for consistent dropdown styling
export const MENU_PROPS = {
  PaperProps: {
    style: {
      maxHeight: 200,
      width: 'auto',
      overflowX: 'hidden'
    }
  }
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}; 