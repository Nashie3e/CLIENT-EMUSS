// Equipment models data
export const EQUIPMENT_MODELS = {
  Desktop: [
    'Acer Aspire',
    'HP ProDesk',
    'Lenovo ThinkCentre',
    'Dell OptiPlex',
    'ASUS VivoPC',
    'MSI Pro',
    'Intel NUC',
    'Others'
  ],
  Laptop: [
    'Acer Swift',
    'HP Pavilion',
    'Lenovo ThinkPad',
    'Dell XPS',
    'ASUS ZenBook',
    'MSI Modern',
    'MacBook Pro',
    'MacBook Air',
    'Other'
  ],
  Printer: [
    'HP LaserJet',
    'Canon PIXMA',
    'Epson WorkForce',
    'Brother HL',
    'Xerox VersaLink',
    'Lexmark',
    'Samsung Xpress',
    'Other'
  ],
  Scanner: [
    'Epson V39',
    'Canon DR',
    'HP ScanJet',
    'Brother ADS',
    'Fujitsu ScanSnap',
    'Kodak i2600',
    'Plustek',
    'Other'
  ],
  Others: []
};

// Initial form data
export const INITIAL_FORM_DATA = {
  name: '',
  email: '',
  department: '',
  locationType: '',
  schoolLevel: '',
  schoolName: '',
  dateOfRequest: new Date().toISOString().split('T')[0],
  typeOfEquipment: '',
  modelOfEquipment: '',
  serialNo: '',
  specificProblem: '',
  customEquipmentType: '',
  customModel: '',
  priority: '',
  captchaCode: '',
  file: null
};

// Form validation constants
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Location types
export const LOCATION_TYPES = {
  SDO: 'SDO',
  SCHOOL: 'SCHOOL'
};

// Priority levels
export const PRIORITY_LEVELS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

// Equipment types
export const EQUIPMENT_TYPES = {
  DESKTOP: 'Desktop',
  LAPTOP: 'Laptop',
  PRINTER: 'Printer',
  SCANNER: 'Scanner',
  OTHERS: 'Others'
}; 