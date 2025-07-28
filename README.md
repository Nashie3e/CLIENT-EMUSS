# DepEd Imus City Ticketing System - Frontend

A modern React-based ticketing system for the Department of Education (DepEd) Imus City, designed to streamline ICT support requests and administrative processes.

## 🚀 Features

### User Features
- **Multi-Category Support**: Troubleshooting, Account Management, Document Upload, and Technical Assistance
- **Modular Form Architecture**: Component-based forms with enhanced maintainability and performance
- **Real-time Updates**: Live notifications and ticket status updates via WebSocket
- **Enhanced Notifications**: Modern notification system with tracking ID support and "View Ticket" functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **File Attachments**: Support for document uploads with validation and preview
- **Ticket Tracking**: Unique tracking IDs for easy reference with prefilled tracking forms
- **Priority System**: HIGH, MEDIUM, LOW priority levels with visual indicators
- **Dynamic Form Fields**: Location-based and category-specific form sections
- **Smart Equipment Selection**: Conditional model selection based on equipment type
- **Unified Footer System**: Integrated ticket information and version display

### Admin Features
- **Comprehensive Dashboard**: Statistics, charts, and system overview
- **Ticket Management**: View, filter, and manage all tickets
- **Status Updates**: Change ticket status with automatic notifications
- **User Management**: Admin and staff user administration
- **Real-time Monitoring**: Live updates on ticket activities
- **Overdue Alerts**: Visual indicators for urgent and overdue tickets

### Technical Features
- **Modular Component Architecture**: Separated business logic, UI components, and styling
- **Custom React Hooks**: Reusable hooks for form management, notifications, CAPTCHA, and data loading
- **Material-UI Components**: Modern, accessible UI components with consistent theming
- **Socket.io Integration**: Real-time bidirectional communication
- **Enhanced CAPTCHA System**: Secure spam prevention with rate limiting and retry logic
- **Centralized API Management**: Consistent HTTP client with error handling
- **Responsive Tables**: Adaptive layouts for different screen sizes
- **Advanced Filtering**: Category and search-based filtering
- **Code Splitting Ready**: Optimized for lazy loading and tree shaking
- **Comprehensive Validation**: Real-time form validation with helpful error messages
- **Error Handling**: Comprehensive error management and user feedback
- **Conditional Form Logic**: Smart form fields that adapt based on user selections

## 🛠️ Technology Stack

- **React 18** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Create React App** - Build tooling and development server

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API server running (see backend documentation)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the client directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   REACT_APP_VERSION=1.0.0
   ```

4. **Add Notification Sound** (Optional)
   - Obtain a notification sound file in WAV format
   - Rename it to `Notification.wav`
   - Place it in the `public/` directory
   - This enables audio notifications for real-time updates

### Development

**Start the development server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000) with hot reloading enabled.

**Other available scripts:**

```bash
# Run tests
npm test

# Build for production
npm run build

# Eject from Create React App (one-way operation)
npm run eject
```

## 🏗️ Project Structure

```
client/
├── public/
│   ├── index.html
│   ├── background.jpg           # Background image for forms
│   ├── deped-logo.png          # DepEd logo for headers and footers
│   ├── Notification.wav         # Optional notification sound
│   └── ...
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── TroubleshootingForm/ # Modular troubleshooting form
│   │   │   ├── components/      # Individual form sections
│   │   │   │   ├── EquipmentSection.jsx  # Enhanced equipment selection
│   │   │   │   └── ...
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── constants/      # Form configuration
│   │   │   ├── styles/         # Centralized styling
│   │   │   ├── TroubleshootingForm.jsx
│   │   │   ├── index.js        # Export file
│   │   │   └── README.md       # Component documentation
│   │   ├── TrackTicket/        # Modular ticket tracking system
│   │   │   ├── components/     # UI components
│   │   │   │   ├── Footer.jsx  # Unified footer with ticket info & version
│   │   │   │   ├── Header.jsx  # Consistent header component
│   │   │   │   └── ...
│   │   │   ├── hooks/          # Custom hooks for tracking
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── styles/         # Centralized styling
│   │   │   ├── TrackTicket.jsx # Main component
│   │   │   └── index.js
│   │   ├── AccountManagementForm/ # Modular account management
│   │   │   ├── components/     # 7 section components
│   │   │   ├── hooks/          # 4 custom hooks
│   │   │   ├── constants/      # Configuration data
│   │   │   ├── styles/         # Centralized styling
│   │   │   ├── AccountManagementForm.jsx
│   │   │   ├── index.js
│   │   │   └── README.md
│   │   ├── DocumentUploadForm/ # Modular document upload
│   │   │   ├── components/     # 7 section components
│   │   │   ├── hooks/          # 4 custom hooks
│   │   │   ├── constants/      # File constraints & config
│   │   │   ├── styles/         # Centralized styling
│   │   │   ├── DocumentUploadForm.jsx
│   │   │   ├── index.js
│   │   │   └── README.md
│   │   ├── TechnicalAssistanceForm/ # Modular technical assistance
│   │   │   ├── components/     # 6 section components
│   │   │   ├── hooks/          # 4 custom hooks
│   │   │   ├── constants/      # TA types & config
│   │   │   ├── styles/         # Centralized styling
│   │   │   ├── TechnicalAssistanceForm.jsx
│   │   │   ├── index.js
│   │   │   └── README.md
│   │   ├── NotificationSystem/ # Enhanced notification system
│   │   └── ...                 # Other shared components
│   ├── pages/                  # Main application pages
│   │   ├── admin/              # Admin-only pages
│   │   ├── ict-coor/           # Staff pages
│   │   ├── TrackTicket.jsx     # Track ticket page wrapper
│   │   └── ...                 # Public pages
│   ├── services/               # API service layer
│   │   ├── locationService.js  # Location data management
│   │   ├── taService.js        # Technical assistance types
│   │   └── ...
│   ├── utils/                  # Utility functions
│   │   ├── api.js              # Centralized HTTP client
│   │   ├── socketConfig.js     # Socket.io configuration
│   │   └── ...
│   ├── context/                # React contexts
│   │   └── AuthContext.js      # Authentication context
│   ├── layouts/                # Layout components
│   │   ├── AdminLayout.jsx     # Admin interface layout
│   │   └── StaffLayout.jsx     # Staff interface layout
│   ├── App.jsx                 # Main application component
│   ├── theme.js                # Material-UI theme configuration
│   └── index.js                # Application entry point
├── package.json
└── README.md
```

## 🎨 Key Components

### Modular Form Architecture

#### TroubleshootingForm
- **6 Section Components**: Device info, issue details, location, message, CAPTCHA, confirmation
- **Enhanced EquipmentSection**: Smart equipment type and model selection with conditional logic
- **4 Custom Hooks**: Form management, notifications, CAPTCHA, data loading
- **Centralized Styling**: Consistent design patterns across all sections
- **Enhanced Validation**: Real-time validation with helpful error messages

#### TrackTicket System
- **Modular Architecture**: Separated components for header, form, details, and footer
- **Unified Footer Component**: Combines ticket information (last updated, age) with page footer and version
- **Custom Hooks**: useTrackTicket, useNotifications, useChatSupport
- **Responsive Design**: Optimized for all device sizes
- **Real-time Updates**: Live ticket status and information updates

#### AccountManagementForm  
- **7 Section Components**: Personal info, request details, form links, location, message, CAPTCHA, confirmation
- **4 Custom Hooks**: Form state, notifications, CAPTCHA, external data fetching
- **Form Links Integration**: Dynamic DEPED and M365 account links
- **Completion Tracking**: Form completion validation and status

#### DocumentUploadForm
- **7 Section Components**: Personal info, request details, location, document details, file upload, CAPTCHA, confirmation
- **4 Custom Hooks**: Form management, notifications, CAPTCHA, data loading
- **File Management**: Upload validation, preview, and 2MB size limit
- **Document Types**: Dynamic document type loading and validation

#### TechnicalAssistanceForm
- **6 Section Components**: Personal info, request details, location, message, CAPTCHA, confirmation  
- **4 Custom Hooks**: Form state, notifications, CAPTCHA, TA type loading
- **TA Type Management**: Dynamic technical assistance types with custom "Others" option
- **Priority System**: Visual priority indicators and handling

### Admin Dashboard
- **ManageTickets.jsx** - Advanced ticket management with filtering and real-time updates
- **TicketDetails.jsx** - Detailed ticket view with status management
- **Dashboard.jsx** - Comprehensive statistics and system overview
- **Reports.jsx** - Analytics and reporting interface

### Enhanced Notification System
- **NotificationSystem.jsx** - Modern card-based notifications with animations
- **Tracking ID Integration** - "View Ticket" buttons with prefilled tracking
- **Multi-notification Queue** - Sequential notification display
- **Custom Styling** - Type-specific colors and icons

### Shared Components
- **BackButton** - Consistent navigation with hover effects
- **ProtectedRoute** - Role-based access control
- **Loading States** - Comprehensive loading indicators
- **Form Validation** - Reusable validation patterns

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `REACT_APP_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |
| `REACT_APP_VERSION` | Application version for footer display | `1.0.0` |

### Socket.io Configuration

The application uses Socket.io for real-time features:
- Automatic reconnection on connection loss
- Authentication with JWT tokens
- Event handling for ticket updates, new tickets, and deletions
- Real-time notifications with audio alerts
- Live dashboard updates and statistics

### Modular Form Configuration

Each form module includes its own configuration:

#### Constants Structure
```javascript
// Form options, validation patterns, initial data
export const INITIAL_FORM_DATA = { /* form fields */ };
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const EQUIPMENT_TYPES = {
  DESKTOP: 'Desktop',
  LAPTOP: 'Laptop',
  PRINTER: 'Printer',
  SCANNER: 'Scanner',
  OTHERS: 'Others'
};
export const EQUIPMENT_MODELS = {
  Desktop: ['Acer Aspire', 'HP ProDesk', /* ... */],
  Laptop: ['Acer Swift', 'HP Pavilion', /* ... */],
  // ... other equipment models
};
```

#### Custom Hooks Pattern
```javascript
// Reusable business logic
export const useFormName = (dependencies) => {
  // Form state management
  // Validation logic  
  // Submission handling
  return { formData, loading, handleSubmit, /* ... */ };
};
```

#### Component Structure
```javascript
// Section-based components with conditional logic
const EquipmentSection = ({ formData, loading, handleChange }) => {
  // Smart equipment type selection
  // Conditional model dropdown
  // Auto-clearing of dependent fields
  return (/* JSX for equipment selection */);
};
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 600px (sm)
- **Tablet**: 600px - 960px (md)
- **Desktop**: > 960px (lg+)

Mobile-specific features:
- Card-based ticket display
- Collapsible navigation
- Touch-optimized interactions
- Simplified pagination
- Responsive footer layout

## 🚀 Recent Updates

### Version 1.0.0 Features

#### Unified Footer System
- **Integrated Design**: Combined ticket information and page footer
- **Conditional Display**: Shows ticket details (last updated, age) only when ticket data is available
- **Version Display**: Integrated application version from environment variables
- **Consistent Styling**: Unified design language across all pages

#### Enhanced Equipment Selection
- **Smart Dependencies**: Model dropdown only appears after equipment type selection
- **Auto-clearing Logic**: Dependent fields clear when parent selection changes
- **Improved UX**: Better placeholder text and selection prompts
- **Consistent Sizing**: Fixed field width issues for better form layout

#### Modular Architecture Improvements
- **Component Separation**: Better separation of concerns in TrackTicket system
- **Removed Redundancy**: Eliminated duplicate TicketFooter component
- **Cleaner Exports**: Updated component index files for better organization

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Environment Setup for Production

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
REACT_APP_VERSION=1.0.0
```

### Deployment Script

Use the included deployment script:

```bash
sh deploy.sh
```

The script will:
1. Check for required notification sound file
2. Build the production version
3. Deploy to the configured server
4. Verify deployment success

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the build folder** to your web server
   - Apache: Copy to document root
   - Nginx: Configure static file serving
   - Cloud platforms: Follow platform-specific instructions

3. **Configure environment variables** for production

## 🔍 Troubleshooting

### Common Issues

**Build fails to minify**
- Check for syntax errors in JavaScript files
- Ensure all dependencies are properly installed
- See [Create React App troubleshooting](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

**Socket connection issues**
- Verify backend server is running
- Check CORS configuration on backend
- Ensure `REACT_APP_SOCKET_URL` is correct

**API connection problems**
- Confirm `REACT_APP_API_URL` points to running backend
- Check network connectivity
- Verify authentication tokens

**Version not displaying**
- Ensure `REACT_APP_VERSION` is set in environment variables
- Check that the environment file is properly loaded

### Performance Optimization

#### Modular Architecture Benefits
- **Code Splitting**: Each form module can be lazy-loaded
- **Tree Shaking**: Unused form sections are excluded from bundles
- **Memoization**: React.memo and useCallback prevent unnecessary re-renders
- **Centralized Styling**: Reduces CSS duplication and bundle size
- **Component Reusability**: Shared components reduce overall bundle size

#### General Optimizations
- Use React DevTools Profiler for performance analysis
- Implement lazy loading for admin and form components
- Optimize images and assets
- Enable gzip compression on server
- Leverage browser caching for static assets

#### Bundle Analysis
```bash
# Analyze bundle composition
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 🏗️ Modular Architecture Guide

### Form Module Structure

Each form follows a consistent modular pattern:

```
FormName/
├── components/          # UI section components
│   ├── PersonalInformationSection.jsx
│   ├── RequestDetailsSection.jsx
│   ├── EquipmentSection.jsx    # Enhanced with conditional logic
│   ├── LocationSection.jsx
│   ├── MessageDetailsSection.jsx
│   ├── CaptchaSection.jsx
│   └── ConfirmationDialog.jsx
├── hooks/              # Business logic hooks
│   ├── useFormName.js     # Main form logic
│   ├── useNotifications.js # Notification management
│   ├── useCaptcha.js      # CAPTCHA handling
│   └── useDataLoading.js  # External data fetching
├── constants/          # Configuration
│   └── index.js          # Form options, validation, equipment data
├── styles/             # Centralized styling
│   └── index.js          # All component styles
├── FormName.jsx        # Main component
├── index.js           # Export file
└── README.md          # Component documentation
```

### TrackTicket Module Structure

```
TrackTicket/
├── components/          # UI components
│   ├── Header.jsx         # Page header with logo and admin button
│   ├── TrackingForm.jsx   # Ticket tracking form
│   ├── TicketDetails.jsx  # Ticket information display
│   ├── Footer.jsx         # Unified footer with ticket info & version
│   ├── ChatSupport.jsx    # Help chat widget
│   └── ...               # Other ticket-related components
├── hooks/              # Custom hooks
│   ├── useTrackTicket.js  # Main tracking logic
│   ├── useNotifications.js # Notification system
│   └── useChatSupport.js  # Chat functionality
├── utils/              # Utility functions
│   └── index.js          # Date formatting, validation, etc.
├── styles/             # Centralized styling
│   └── index.js          # All component styles
├── TrackTicket.jsx     # Main component orchestrator
└── index.js           # Export file
```

### Adding New Form Modules

1. **Create Directory Structure**
   ```bash
   mkdir src/components/NewForm
   mkdir src/components/NewForm/{components,hooks,constants,styles}
   ```

2. **Implement Core Files**
   - Constants: Form options and validation rules
   - Hooks: Business logic and state management
   - Components: Individual form sections
   - Styles: Centralized styling patterns

3. **Follow Naming Conventions**
   - Main component: `NewForm.jsx`
   - Hook pattern: `useNewForm.js`
   - Section pattern: `SectionNameSection.jsx`

### Migration Benefits

- **Maintainability**: Isolated concerns and clear separation
- **Reusability**: Hooks and components can be shared
- **Performance**: Code splitting and optimized re-renders
- **Testing**: Individual components can be tested in isolation
- **Documentation**: Self-documenting modular structure
- **Consistency**: Unified patterns across all forms

### Form-Specific Features

#### TroubleshootingForm
- **Device Information**: Comprehensive device and software details
- **Smart Equipment Selection**: Conditional model dropdown based on equipment type
- **Issue Classification**: Categorized problem types with dynamic fields
- **Location Management**: SDO departments and school hierarchy
- **Urgency Levels**: Visual priority indicators with color coding

#### TrackTicket System
- **Unified Footer**: Combines ticket metadata with application footer
- **Responsive Design**: Adapts to different screen sizes
- **Real-time Updates**: Live ticket information updates
- **Chat Support**: Integrated help system
- **Version Display**: Shows application version for support purposes

#### AccountManagementForm  
- **Account Types**: DEPED and M365 account management
- **Action Types**: Create, modify, delete, and access requests
- **External Forms**: Integration with DEPED and M365 registration forms
- **Completion Tracking**: Form submission validation and confirmation

#### DocumentUploadForm
- **File Validation**: Type checking (PDF, DOC, DOCX) and size limits
- **Document Categories**: Dynamic document type classification
- **Preview System**: File preview before submission
- **Upload Progress**: Real-time upload status and error handling

#### TechnicalAssistanceForm
- **TA Type Management**: Administrative TA type configuration
- **Custom Requests**: "Others" option with custom specification
- **Priority Routing**: Priority-based ticket assignment
- **Expertise Matching**: TA type-based technician routing

## 📚 Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Material-UI Documentation](https://mui.com/)
- [Socket.io Client Documentation](https://socket.io/docs/v4/client-api/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Component Architecture Best Practices](https://reactjs.org/docs/thinking-in-react.html)

## 🤝 Contributing

### Development Guidelines

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Follow the modular architecture**
   - Use existing patterns for new forms
   - Separate business logic into custom hooks
   - Create reusable section components
   - Centralize styling in the styles directory
   - Implement conditional logic for better UX

4. **Code Quality Standards**
   - Follow existing naming conventions
   - Add comprehensive prop validation
   - Include component documentation
   - Write unit tests for hooks and components
   - Ensure responsive design compatibility

5. **Testing Requirements**
   ```bash
   # Run tests before submitting
   npm test
   
   # Test specific form modules
   npm test -- --testPathPattern=TroubleshootingForm
   ```

6. **Documentation Updates**
   - Update component README files
   - Document new hooks and their usage
   - Include usage examples for new components
   - Update main README for significant changes

7. **Submit a pull request**
   - Include detailed description of changes
   - Reference any related issues
   - Ensure all tests pass
   - Include screenshots for UI changes

## 📄 License

This project is developed for DepEd Imus City. All rights reserved.

## 📞 Support

For technical support or questions about the DepEd Imus City Ticketing System, please contact:

### Technical Team
- **@soozu** - Lead Developer
- **@Ross** - Developer

### ICT Department
For general support and administrative questions, please contact the ICT department.

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Status**: Production Ready
