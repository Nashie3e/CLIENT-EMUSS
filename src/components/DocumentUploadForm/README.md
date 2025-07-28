# Document Upload Form - Modular Structure

A modular, reusable document upload form component with enhanced performance, maintainability, and user experience.

## 🏗️ Architecture Overview

This modular structure provides better performance through code splitting, easier maintenance through separation of concerns, and improved reusability.

```
DocumentUploadForm/
├── components/          # Individual form section components
├── hooks/              # Custom React hooks for business logic
├── constants/          # Configuration and constants
├── styles/             # Centralized styling
├── DocumentUploadForm.jsx  # Main form component
├── index.js           # Export file
└── README.md          # This documentation
```

## 📁 Directory Structure

### `/components`
Individual section components that make up the form:

- **PersonalInformationSection.jsx** - Name and email input fields
- **RequestDetailsSection.jsx** - Priority, location type, and document type selection
- **LocationSection.jsx** - Location selection (SDO/School) with dynamic dropdowns
- **DocumentDetailsSection.jsx** - Subject and message fields
- **FileUploadSection.jsx** - File upload with validation and preview
- **CaptchaSection.jsx** - CAPTCHA verification with refresh functionality
- **ConfirmationDialog.jsx** - Review dialog before submission

### `/hooks`
Custom React hooks for business logic:

- **useDocumentUploadForm.js** - Main form state management, validation, and submission
- **useNotifications.js** - Notification system management
- **useCaptcha.js** - CAPTCHA generation, validation, and error handling
- **useDataLoading.js** - External data fetching (locations, document types)

### `/constants`
Configuration and constants:

- **index.js** - Form options, validation patterns, file constraints, and initial data

### `/styles`
Centralized styling:

- **index.js** - All component styles organized by category (containers, forms, buttons, dialogs, file upload)

## 🎯 Key Features

### 🔧 Modular Architecture
- **Separation of Concerns**: Each component handles a specific form section
- **Reusable Hooks**: Business logic extracted into custom hooks
- **Centralized Styling**: Consistent design patterns across components
- **Easy Maintenance**: Changes can be made to specific sections without affecting others

### 🚀 Performance Optimizations
- **Code Splitting**: Components can be lazy-loaded
- **Memoization**: React.memo and useCallback prevent unnecessary re-renders
- **Optimized Re-renders**: State updates are localized to specific components

### 🎨 Enhanced User Experience
- **Modern Design**: Consistent with Material-UI design principles
- **Responsive Layout**: Optimized for mobile and desktop
- **Enhanced Notifications**: Modern notification system with tracking ID support
- **Loading States**: Comprehensive loading indicators
- **Form Validation**: Real-time validation with helpful error messages
- **File Upload**: Drag-and-drop style interface with file validation

### 🔒 Security & Validation
- **File Validation**: Size and type checking (2MB limit, PDF/DOC/DOCX only)
- **CAPTCHA Integration**: Spam prevention with rate limiting
- **Email Validation**: Real-time email format validation
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 📁 File Management
- **File Type Validation**: Supports PDF, DOC, and DOCX files
- **Size Limitation**: 2MB maximum file size
- **Preview**: Shows selected file name before upload
- **Error Handling**: Clear feedback for invalid files

## 📊 Component Props

### Main Form Component
```jsx
<DocumentUploadForm />
```
No props required - fully self-contained.

### Individual Section Components
Each section component accepts specific props for form data, handlers, and state.

## 🔄 State Management

### Form State
```javascript
{
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
}
```

### Loading States
- `isSubmitting` - Form submission state
- `isLoadingLocations` - Location data loading
- `isLoadingDocumentTypes` - Document types loading
- `captchaDisabled` - CAPTCHA generation state

### File Constraints
```javascript
{
  MAX_SIZE: 2MB,
  ALLOWED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['PDF', 'DOC', 'DOCX']
}
```

## 🎬 Usage Examples

### Basic Implementation
```jsx
import DocumentUploadForm from './components/DocumentUploadForm';

function App() {
  return <DocumentUploadForm />;
}
```

### With Custom Routing
```jsx
import { Routes, Route } from 'react-router-dom';
import DocumentUploadForm from './components/DocumentUploadForm';

function App() {
  return (
    <Routes>
      <Route path="/documents" element={<DocumentUploadForm />} />
    </Routes>
  );
}
```

## 🛠️ Customization

### Adding New Form Sections
1. Create a new component in `/components`
2. Add any required constants to `/constants/index.js`
3. Include the component in the main form
4. Update styling in `/styles/index.js` if needed

### Modifying File Constraints
Update the constraints in `constants/index.js`:

```javascript
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // Change to 5MB
  ALLOWED_TYPES: [
    // Add new types
    'application/pdf',
    'image/jpeg',
    'image/png'
  ],
  ALLOWED_EXTENSIONS: ['PDF', 'JPG', 'PNG']
};
```

### Styling Customization
Modify styles in `/styles/index.js`:

```javascript
export const customStyles = {
  // Add your custom styles
};
```

## 🔗 Integration Points

### API Endpoints
- `POST /api/tickets/document-upload` - Form submission with file upload
- `GET /api/tickets/generate-captcha` - CAPTCHA generation
- Location and document type services

### External Dependencies
- Material-UI components and icons
- React Router for navigation
- Custom notification system
- Location and document services

### File Upload Integration
- Uses FormData for multipart file uploads
- Validates file type and size on client side
- Provides progress feedback during upload

## 🧪 Testing Considerations

### Component Testing
Each section component can be tested independently:

```javascript
import { render, screen } from '@testing-library/react';
import FileUploadSection from './components/FileUploadSection';

test('validates file upload', () => {
  // Test file upload validation
});
```

### Hook Testing
Custom hooks can be tested in isolation:

```javascript
import { renderHook } from '@testing-library/react-hooks';
import { useDocumentUploadForm } from './hooks/useDocumentUploadForm';

test('form validation works correctly', () => {
  // Test hook logic
});
```

### File Upload Testing
```javascript
import { fireEvent, waitFor } from '@testing-library/react';

test('handles file upload', async () => {
  const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
  const input = screen.getByLabelText(/upload document/i);
  
  fireEvent.change(input, { target: { files: [file] } });
  
  await waitFor(() => {
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });
});
```

## 📈 Performance Metrics

### Bundle Size Optimization
- Modular structure allows for tree shaking
- Components can be lazy-loaded
- Styles are consolidated to prevent duplication

### Runtime Performance
- Optimized re-renders through proper state management
- Memoized callbacks prevent unnecessary function recreation
- Efficient form validation and file handling

## 🔄 Migration from Monolithic Structure

The modular structure maintains 100% compatibility with the original monolithic form while providing enhanced maintainability and performance.

### Benefits of Migration
1. **Better Performance** - Reduced re-renders and code splitting
2. **Easier Maintenance** - Isolated components and business logic
3. **Enhanced Testing** - Individual components can be tested in isolation
4. **Improved Readability** - Cleaner code organization
5. **Better Reusability** - Components and hooks can be reused
6. **File Management** - Dedicated file upload component with proper validation

## 📊 Form Validation Rules

### Required Fields
- Name
- Email (with format validation)
- Priority
- Location Type
- Document Type
- Subject
- Message
- CAPTCHA Code

### Conditional Requirements
- **SDO Location**: Department selection required
- **School Location**: School level and school name required

### File Validation
- **Size**: Maximum 2MB
- **Type**: PDF, DOC, DOCX only
- **Optional**: File upload is not required but recommended

## 🔐 Security Features

### Input Validation
- Email format validation
- File type and size validation
- CAPTCHA verification
- XSS protection through proper input handling

### Rate Limiting
- CAPTCHA generation rate limiting
- Form submission rate limiting
- Error handling for rate limit exceeded

## 📚 Additional Resources

- [Material-UI Documentation](https://mui.com/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [File Upload Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [Form Validation Best Practices](https://ux.shopify.com/form-design-best-practices)

---

*This modular structure provides a robust foundation for the document upload form while maintaining flexibility for future enhancements and modifications.* 