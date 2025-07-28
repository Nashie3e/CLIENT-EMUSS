// Initial form data
export const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  priority: '',
  locationType: '',
  schoolLevel: '',
  schoolName: '',
  department: '',
  subject: '',
  message: '',
  file: null,
  documentType: '',
  captchaCode: ''
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
  { value: 'SDO', label: 'SDO - Imus City' },
  { value: 'SCHOOL', label: 'School - Imus City' }
];

// File validation
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB in bytes
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  ALLOWED_EXTENSIONS: ['PDF', 'DOC', 'DOCX']
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}; 