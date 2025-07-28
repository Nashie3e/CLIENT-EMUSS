// Initial form data
export const INITIAL_FORM_DATA = {
  email: '',
  priority: '',
  accountType: '',
  actionType: '',
  locationType: '',
  schoolLevel: '',
  schoolName: '',
  department: '',
  subject: '',
  message: '',
  captchaCode: '',
  formCompleted: false
};

// Validation patterns
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Form options
export const ACTION_TYPES = [
  { value: 'CREATE', label: 'Create Account' },
  { value: 'RESET', label: 'Reset Password' }
];

export const PRIORITIES = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' }
];

export const LOCATION_TYPES = [
  { value: 'SDO', label: 'SDO - Imus City' },
  { value: 'SCHOOL', label: 'School - Imus City' }
];

// Form links configuration
export const FORM_LINKS = {
  DEPED_ACCOUNT: {
    CREATE: 'https://depedph-my.sharepoint.com/:x:/g/personal/icts_imus_deped_gov_ph/EeXmLbZsXjVEm3WORbJPGqwBLBDtctSQ2gwk5uQ8zGyYhA',
    RESET: 'https://depedph-my.sharepoint.com/:x:/g/personal/icts_imus_deped_gov_ph/EeXmLbZsXjVEm3WORbJPGqwBLBDtctSQ2gwk5uQ8zGyYhA'
  },
  M365: {
    CREATE: 'https://docs.google.com/spreadsheets/d/1BYwMpR5GSgKU6z1F6bBJQ8m0YARCFvG0tEJnGgMmXyA/edit?usp=sharing',
    RESET: 'https://depedph-my.sharepoint.com/:x:/g/personal/icts_imus_deped_gov_ph/EUzEb_Rg6G5Ak1cFL3fOKaoBgJBo5FjIdqZKbUPNTtismw'
  }
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
}; 