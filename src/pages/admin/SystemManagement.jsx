import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Drawer,
  Tabs,
  Tab,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  AccountCircle as AccountIcon,
  Description as DocumentIcon,
  Build as TechnicalIcon,
  SupervisorAccount as StaffIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  RestartAlt as ResetIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import * as systemManagementService from '../../services/systemManagementService';

const ManagementSection = ({ title, items, onAdd, onEdit, onDelete, fields, additionalFields = [], isLocation = false, locationTypes = [], schoolLevels = [], loading, error, availableLocations = [], onSnackbarMessage }) => {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [locations, setLocations] = useState({ sdo: [], schools: {} });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isResettingAccount, setIsResettingAccount] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    locationType: '',
    location: ''
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (title === 'User Management') {
      fetchLocations();
    }
  }, [title]);

  useEffect(() => {
    if (items) {
      let filtered = items;

      // Apply search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(query) || 
          item.email?.toLowerCase().includes(query) || 
          item.role?.toLowerCase().includes(query) || 
          item.location?.toLowerCase().includes(query)
        );
      }

      // Apply role filter
      if (filters.role) {
        filtered = filtered.filter(item => item.role === filters.role);
      }

      // Apply location type filter
      if (filters.locationType) {
        filtered = filtered.filter(item => {
          if (filters.locationType === 'SYSTEM_WIDE') {
            return item.role === 'ADMIN' || !item.location || item.location === 'System Wide';
          }
          return item.location?.toLowerCase().includes(filters.locationType.toLowerCase());
        });
      }

      // Apply specific location filter
      if (filters.location) {
        filtered = filtered.filter(item => 
          item.location?.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      setFilteredItems(filtered);
    }
  }, [searchQuery, items, filters]);

  useEffect(() => {
    // Reset pagination when search results change
    setPage(0);
  }, [filteredItems]);

  const fetchLocations = async () => {
    try {
      const response = await systemManagementService.getLocations();
      const locationData = response.data || response; // Handle both response formats
      
      const sdoLocations = locationData.filter(loc => loc.type === 'SDO');
      const schoolLocations = locationData.filter(loc => loc.type === 'SCHOOL')
        .reduce((acc, school) => {
          if (!acc[school.level]) {
            acc[school.level] = [];
          }
          acc[school.level].push(school);
          return acc;
        }, {});
      
      setLocations({
        sdo: sdoLocations,
        schools: schoolLocations
      });
    } catch (err) {
      console.error('Error fetching locations:', err);
      setFormError('Failed to load locations');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpen = (item = null) => {
    setEditItem(item);
    if (item) {
      // If editing, set the location type based on the existing location
      const locationData = {
        ...item,
        locationType: item.location?.type || ''
      };
      if (item.location?.type === 'SCHOOL') {
        locationData.schoolLevel = item.location?.level || '';
      }
      setFormData(locationData);
    } else {
      setFormData({});
    }
    setFormError(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setFormData({});
    setFormError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'role') {
      // Reset location-related fields when role changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        locationType: '',
        locationId: null,
        schoolLevel: ''
      }));
    } else if (name === 'locationType') {
      // Reset location-specific fields when location type changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        locationId: null,
        schoolLevel: ''
      }));
    } else if (name === 'schoolLevel') {
      // Reset locationId when school level changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        locationId: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      role: '',
      locationType: '',
      location: ''
    });
  };

  const hasActiveFilters = () => {
    return searchQuery || filters.role || filters.locationType || filters.location;
  };

  const validateForm = () => {
    if (isLocation) {
      if (!formData.type) return false;
      if (formData.type === 'SCHOOL' && !formData.level) return false;
      if (!formData.name) return false;
      return true;
    }

    // For user management (both ADMIN and STAFF)
    if (title === 'User Management') {
      if (!formData.name || !formData.email || !formData.role) return false;
      if (formData.role === 'STAFF' && !formData.locationId) return false;
      return true;
    }

    // For other sections
    return !!formData.name;
  };

  const handleSubmit = async () => {
    try {
      setFormError(null);
      
      if (!validateForm()) {
        setFormError('Please fill in all required fields');
        return;
      }

      if (editItem) {
        await onEdit(editItem.id, formData);
        onSnackbarMessage(`${title.slice(0, -1)} updated successfully`, 'success');
      } else {
        await onAdd(formData);
        onSnackbarMessage(`${title.slice(0, -1)} created successfully`, 'success');
      }
      handleClose();
    } catch (err) {
      setFormError(err.response?.data?.message || 'An error occurred while saving');
      onSnackbarMessage(err.response?.data?.message || 'An error occurred while saving', 'error');
    }
  };

  const handleResetIctCoordinatorAccount = async (userId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to reset this ICT Coordinator account?\n\n' +
      'This will:\n' +
      '• Generate a new temporary password\n' +
      '• Reset account security settings\n' +
      '• Send an email notification to the user\n\n' +
      'This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setIsResettingAccount(true);
    onSnackbarMessage('Resetting ICT Coordinator account...', 'info');

    try {
      const response = await systemManagementService.resetIctCoordinatorAccount(userId);
      onSnackbarMessage(
        response.message || 'ICT Coordinator account reset successfully! New credentials have been sent via email.', 
        'success'
      );
    } catch (err) {
      onSnackbarMessage(
        err.response?.data?.message || 'Failed to reset ICT Coordinator account. Please try again.', 
        'error'
      );
    } finally {
      setIsResettingAccount(false);
    }
  };

  const handleResetAdminAccount = async (userId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to reset this Administrator account?\n\n' +
      'This will:\n' +
      '• Generate a new temporary password\n' +
      '• Reset account security settings\n' +
      '• Send an email notification to the user\n\n' +
      'This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setIsResettingAccount(true);
    onSnackbarMessage('Resetting Administrator account...', 'info');

    try {
      const response = await systemManagementService.resetAdminAccount(userId);
      onSnackbarMessage(
        response.message || 'Administrator account reset successfully! New credentials have been sent via email.', 
        'success'
      );
    } catch (err) {
      onSnackbarMessage(
        err.response?.data?.message || 'Failed to reset Administrator account. Please try again.', 
        'error'
      );
    } finally {
      setIsResettingAccount(false);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await onDelete(id);
        onSnackbarMessage(`${title.slice(0, -1)} deleted successfully`, 'success');
      } catch (err) {
        onSnackbarMessage(err.response?.data?.message || 'Failed to delete item', 'error');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3, fontFamily: 'Poppins' }}>
        {error}
      </Alert>
    );
  }

  const currentItems = filteredItems?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || [];

  // Helper function to render mobile card view for each item
  const renderMobileCard = (item) => (
    <Card 
      key={item.id} 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'visible',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {fields.map((field, index) => (
          field.key !== 'createdAt' ? (
            <Box 
              key={`${item.id}-${field.key}`}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 1,
                ...(index !== 0 && { 
                  pt: 1,
                  borderTop: '1px dashed',
                  borderColor: 'rgba(0,0,0,0.06)' 
                })
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                  fontFamily: 'Poppins',
                  mr: 1
                }}
              >
                {field.label}:
              </Typography>
              <Typography 
                variant="body2" 
                align="right"
                sx={{ 
                  fontSize: '0.85rem',
                  fontFamily: 'Poppins',
                  wordBreak: 'break-word',
                  maxWidth: '60%'
                }}
              >
                {item[field.key]}
              </Typography>
            </Box>
          ) : null
        ))}

        {/* Actions buttons at the bottom */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            pt: 1.5,
            mt: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <IconButton 
            onClick={() => handleOpen(item)} 
            size="small"
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.lighter',
              }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            onClick={() => handleDeleteClick(item.id)} 
            size="small"
            sx={{
              ml: 1,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.lighter',
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: { xs: 1, sm: 2 },
      overflow: 'hidden',
      boxShadow: { xs: 0, sm: '0 4px 20px 0 rgba(0,0,0,0.05)' },
    }}>
      <Box sx={{ 
        p: { xs: 1.5, sm: 3 }, 
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.5, sm: 0 }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: 'Poppins',
              fontWeight: 600,
              color: 'primary.main',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            {title}
          </Typography>
            {title === 'User Management' && hasActiveFilters() && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'primary.lighter',
                color: 'primary.main',
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: '0.7rem',
                fontFamily: 'Poppins'
              }}>
                <FilterIcon fontSize="small" sx={{ mr: 0.5 }} />
                Filtered
              </Box>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            size={isMobile ? "small" : "medium"}
            fullWidth={isMobile}
            sx={{ 
              fontFamily: 'Poppins',
              textTransform: 'none',
              borderRadius: 1.5,
              px: { xs: 2, sm: 3 },
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Add New
          </Button>
        </Box>
        
        {title === 'User Management' && (
          <Box sx={{ mt: 2 }}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search users..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              sx={{ 
                fontFamily: 'Poppins',
                '.MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                },
                mb: 2
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton 
                      aria-label="clear search" 
                      onClick={clearSearch} 
                      edge="end"
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { fontFamily: 'Poppins' }
              }}
            />

            {/* Filter Controls */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              mb: 2
            }}>
              {/* Role Filter */}
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                <InputLabel sx={{ fontFamily: 'Poppins' }}>Role</InputLabel>
                <Select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  label="Role"
                  sx={{ fontFamily: 'Poppins' }}
                >
                  <MenuItem value="" sx={{ fontFamily: 'Poppins' }}>All Roles</MenuItem>
                  <MenuItem value="ADMIN" sx={{ fontFamily: 'Poppins' }}>Administrator</MenuItem>
                  <MenuItem value="STAFF" sx={{ fontFamily: 'Poppins' }}>ICT Coordinator</MenuItem>
                </Select>
              </FormControl>

              {/* Location Type Filter */}
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                <InputLabel sx={{ fontFamily: 'Poppins' }}>Location Type</InputLabel>
                <Select
                  value={filters.locationType}
                  onChange={(e) => handleFilterChange('locationType', e.target.value)}
                  label="Location Type"
                  sx={{ fontFamily: 'Poppins' }}
                >
                  <MenuItem value="" sx={{ fontFamily: 'Poppins' }}>All Locations</MenuItem>
                  <MenuItem value="SYSTEM_WIDE" sx={{ fontFamily: 'Poppins' }}>System Wide</MenuItem>
                  <MenuItem value="SDO" sx={{ fontFamily: 'Poppins' }}>SDO - Imus City</MenuItem>
                  <MenuItem value="SCHOOL" sx={{ fontFamily: 'Poppins' }}>School - Imus City</MenuItem>
                </Select>
              </FormControl>

              {/* Clear Filters Button */}
              {hasActiveFilters() && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={clearAllFilters}
                  startIcon={<ClearIcon />}
                  sx={{ 
                    fontFamily: 'Poppins',
                    textTransform: 'none',
                    minWidth: { xs: '100%', sm: 'auto' },
                    borderRadius: 1.5
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Results Summary */}
            {filteredItems && items && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
              }}>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontFamily: 'Poppins', 
                  color: 'text.secondary',
                    fontSize: '0.75rem'
                }}
              >
                Showing {filteredItems.length} of {items.length} users
                  {hasActiveFilters() && (
                    <span style={{ color: '#1976d2', fontWeight: 500 }}>
                      {' '}(filtered)
                    </span>
                  )}
              </Typography>
                
                {hasActiveFilters() && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {filters.role && (
                      <Box sx={{ 
                        backgroundColor: 'primary.lighter', 
                        color: 'primary.main',
                        px: 1, 
                        py: 0.25, 
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontFamily: 'Poppins'
                      }}>
                        Role: {filters.role === 'ADMIN' ? 'Administrator' : 'ICT Coordinator'}
                      </Box>
                    )}
                    {filters.locationType && (
                      <Box sx={{ 
                        backgroundColor: 'secondary.lighter', 
                        color: 'secondary.main',
                        px: 1, 
                        py: 0.25, 
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontFamily: 'Poppins'
                      }}>
                        Location: {filters.locationType === 'SYSTEM_WIDE' ? 'System Wide' : filters.locationType}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Mobile Card View */}
      {isMobile && (
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 1.5, 
            bgcolor: '#f5f7fa',
            overflowY: 'auto' 
          }}
        >
          {!filteredItems || filteredItems.length === 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                py: 4,
                px: 2,
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              >
                {title === 'User Management' && hasActiveFilters() 
                  ? 'No users match your current filters' 
                  : searchQuery 
                    ? 'No results found for your search' 
                    : `No ${title.toLowerCase()} available`
                }
              </Typography>
              <Button
                variant="outlined"
                startIcon={
                  title === 'User Management' && hasActiveFilters() 
                    ? <ClearIcon /> 
                    : searchQuery 
                      ? <ClearIcon /> 
                      : <AddIcon />
                }
                onClick={
                  title === 'User Management' && hasActiveFilters() 
                    ? clearAllFilters 
                    : searchQuery 
                      ? clearSearch 
                      : () => handleOpen()
                }
                size="small"
                sx={{ 
                  fontFamily: 'Poppins',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  minWidth: 120
                }}
              >
                {title === 'User Management' && hasActiveFilters() 
                  ? 'Clear Filters' 
                  : searchQuery 
                    ? 'Clear Search' 
                    : `Add New`
                }
              </Button>
            </Box>
          ) : (
            currentItems.map(renderMobileCard)
          )}
        </Box>
      )}

      {/* Desktop/Tablet Table View */}
      {!isMobile && (
        <TableContainer
          sx={{
            flexGrow: 1,
            maxHeight: 'calc(100vh - 300px)',
            overflowY: 'auto',
            borderRadius: 3,
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)',
            background: '#fff',
            mt: 2,
          }}
        >
          <Table size="medium" stickyHeader>
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell
                    key={field.key}
                    scope="col"
                    sx={{
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      borderBottom: '2px solid',
                      borderColor: 'primary.main',
                      letterSpacing: 0.5,
                      py: 2,
                      px: 2,
                    }}
                  >
                    {field.label}
                  </TableCell>
                ))}
                <TableCell
                  scope="col"
                  sx={{
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    fontWeight: 700,
                    borderBottom: '2px solid',
                    borderColor: 'primary.main',
                    py: 2,
                    px: 2,
                    width: 120,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 1} align="center" sx={{ py: 6 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                      <img src="/no-data.svg" alt="No data" width={80} />
                      <Typography variant="body1" color="text.secondary">
                        No records found.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                      transition: 'background 0.2s',
                      '&:hover': {
                        backgroundColor: 'primary.lighter',
                      },
                      borderRadius: 2,
                    }}
                  >
                    {fields.map((field) => (
                      <TableCell
                        key={`${item.id}-${field.key}`}
                        sx={{
                          py: 2,
                          px: 2,
                          fontWeight: field.key === 'name' ? 600 : 400,
                          fontSize: '0.97rem',
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        {item[field.key]}
                      </TableCell>
                    ))}
                    <TableCell
                      sx={{
                        py: 1,
                        px: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Box display="flex" gap={1}>
                        <IconButton
                          aria-label="Edit"
                          onClick={() => handleOpen(item)}
                          sx={{ color: 'primary.main' }}
                          size="small"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="Delete"
                          onClick={() => handleDeleteClick(item.id)}
                          sx={{ color: 'error.main' }}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {filteredItems && filteredItems.length > 0 && (
        <TablePagination
          component="div"
          count={filteredItems.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            fontFamily: 'Poppins',
            '.MuiTablePagination-select': {
              fontFamily: 'Poppins',
            },
            '.MuiTablePagination-displayedRows': {
              fontFamily: 'Poppins',
            },
            '.MuiTablePagination-selectLabel': {
              fontFamily: 'Poppins',
            }
          }}
        />
      )}

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ 
          fontFamily: 'Poppins',
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          py: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 3 },
          backgroundColor: 'primary.main',
          color: 'white'
        }}>
          {editItem ? 'Edit' : 'Add New'} {title}
        </DialogTitle>
        <DialogContent sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, fontFamily: 'Poppins' }}>
              {formError}
            </Alert>
          )}
          
          {isLocation ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel sx={{ fontFamily: 'Poppins' }}>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                  label="Type"
                  error={!!formError}
                  sx={{ fontFamily: 'Poppins' }}
                >
                  {locationTypes.map(type => (
                    <MenuItem key={type.value} value={type.value} sx={{ fontFamily: 'Poppins' }}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {formData.type === 'SDO' && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Department"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  placeholder="Enter department name"
                  error={!!formError}
                  helperText={formError}
                  sx={{ fontFamily: 'Poppins' }}
                  InputLabelProps={{ sx: { fontFamily: 'Poppins' } }}
                  InputProps={{ sx: { fontFamily: 'Poppins' } }}
                />
              )}

              {formData.type === 'SCHOOL' && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ fontFamily: 'Poppins' }}>School Level</InputLabel>
                    <Select
                      name="level"
                      value={formData.level || ''}
                      onChange={handleChange}
                      label="School Level"
                      error={!!formError}
                      sx={{ fontFamily: 'Poppins' }}
                    >
                      {schoolLevels.map(level => (
                        <MenuItem key={level.value} value={level.value} sx={{ fontFamily: 'Poppins' }}>
                          {level.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {formData.level && (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="School Name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      error={!!formError}
                      helperText={formError}
                      sx={{ fontFamily: 'Poppins' }}
                      InputLabelProps={{ sx: { fontFamily: 'Poppins' } }}
                      InputProps={{ sx: { fontFamily: 'Poppins' } }}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {title === 'User Management' ? (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    error={!!formError}
                    required
                    sx={{ fontFamily: 'Poppins' }}
                    InputLabelProps={{ sx: { fontFamily: 'Poppins' } }}
                    InputProps={{ sx: { fontFamily: 'Poppins' } }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    error={!!formError}
                    required
                    sx={{ fontFamily: 'Poppins' }}
                    InputLabelProps={{ sx: { fontFamily: 'Poppins' } }}
                    InputProps={{ sx: { fontFamily: 'Poppins' } }}
                  />
                  <FormControl fullWidth margin="normal" required>
                    <InputLabel sx={{ fontFamily: 'Poppins' }}>Role</InputLabel>
                    <Select
                      name="role"
                      value={formData.role || ''}
                      onChange={handleChange}
                      label="Role"
                      error={!!formError}
                      sx={{ fontFamily: 'Poppins' }}
                    >
                      <MenuItem value="ADMIN" sx={{ fontFamily: 'Poppins' }}>Administrator</MenuItem>
                      <MenuItem value="STAFF" sx={{ fontFamily: 'Poppins' }}>ICT Coordinator</MenuItem>
                    </Select>
                  </FormControl>

                  {formData.role === 'STAFF' && (
                    <>
                      <FormControl fullWidth margin="normal" required>
                        <InputLabel sx={{ fontFamily: 'Poppins' }}>Location Type</InputLabel>
                        <Select
                          name="locationType"
                          value={formData.locationType || ''}
                          onChange={handleChange}
                          label="Location Type"
                          error={!!formError}
                          sx={{ fontFamily: 'Poppins' }}
                        >
                          <MenuItem value="SDO" sx={{ fontFamily: 'Poppins' }}>SDO - Imus City</MenuItem>
                          <MenuItem value="SCHOOL" sx={{ fontFamily: 'Poppins' }}>School - Imus City</MenuItem>
                        </Select>
                      </FormControl>

                      {formData.locationType === 'SDO' && (
                        <FormControl fullWidth margin="normal" required>
                          <InputLabel sx={{ fontFamily: 'Poppins' }}>Department</InputLabel>
                          <Select
                            name="locationId"
                            value={formData.locationId || ''}
                            onChange={handleChange}
                            label="Department"
                            error={!!formError}
                            sx={{ fontFamily: 'Poppins' }}
                          >
                            {locations.sdo.map(dept => (
                              <MenuItem key={dept.id} value={dept.id} sx={{ fontFamily: 'Poppins' }}>
                                {dept.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}

                      {formData.locationType === 'SCHOOL' && (
                        <>
                          <FormControl fullWidth margin="normal" required>
                            <InputLabel sx={{ fontFamily: 'Poppins' }}>School Level</InputLabel>
                            <Select
                              name="schoolLevel"
                              value={formData.schoolLevel || ''}
                              onChange={handleChange}
                              label="School Level"
                              error={!!formError}
                              sx={{ fontFamily: 'Poppins' }}
                            >
                              {Object.keys(locations.schools).map(level => (
                                <MenuItem key={level} value={level} sx={{ fontFamily: 'Poppins' }}>
                                  {level}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                          {formData.schoolLevel && (
                            <FormControl fullWidth margin="normal" required>
                              <InputLabel sx={{ fontFamily: 'Poppins' }}>School Name</InputLabel>
                              <Select
                                name="locationId"
                                value={formData.locationId || ''}
                                onChange={handleChange}
                                label="School Name"
                                error={!!formError}
                                sx={{ fontFamily: 'Poppins' }}
                              >
                                {locations.schools[formData.schoolLevel]?.map(school => (
                                  <MenuItem key={school.id} value={school.id} sx={{ fontFamily: 'Poppins' }}>
                                    {school.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {fields.map((field) => (
                    field.key !== 'createdAt' && (
                      field.key === 'location' ? (
                        <FormControl key={field.key} fullWidth margin="normal">
                          <InputLabel sx={{ fontFamily: 'Poppins' }}>Location</InputLabel>
                          <Select
                            name="location"
                            value={formData.location || ''}
                            onChange={handleChange}
                            label="Location"
                            error={!!formError}
                            sx={{ fontFamily: 'Poppins' }}
                          >
                            {availableLocations.map(loc => (
                              <MenuItem key={loc.value} value={loc.value} sx={{ fontFamily: 'Poppins' }}>
                                {loc.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          key={field.key}
                          fullWidth
                          label={field.label}
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleChange}
                          margin="normal"
                          error={!!formError}
                          helperText={formError}
                          sx={{ fontFamily: 'Poppins' }}
                          InputLabelProps={{ sx: { fontFamily: 'Poppins' } }}
                          InputProps={{ sx: { fontFamily: 'Poppins' } }}
                        />
                      )
                    )
                  ))}
                  {!editItem && additionalFields.map((field) => (
                    <TextField
                      key={field.key}
                      fullWidth
                      label={field.label}
                      name={field.key}
                      type={field.type || 'text'}
                      value={formData[field.key] || ''}
                      onChange={handleChange}
                      margin="normal"
                      error={!!formError}
                      helperText={formError}
                      sx={{ fontFamily: 'Poppins' }}
                      InputLabelProps={{ sx: { fontFamily: 'Poppins' } }}
                      InputProps={{ sx: { fontFamily: 'Poppins' } }}
                    />
                  ))}
                </>
              )}
            </>
          )}
          
          {title === 'User Management' && editItem && (
            <Box sx={{ mt: 2, borderTop: 1, pt: 2, borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ fontFamily: 'Poppins' }}>
                Account Management
              </Typography>
              
              {editItem.role === 'STAFF' && (
                <>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleResetIctCoordinatorAccount(editItem.id)}
                    startIcon={isResettingAccount ? <CircularProgress size={16} color="inherit" /> : <ResetIcon />}
                    size={isMobile ? "small" : "medium"}
                    disabled={isResettingAccount}
                    sx={{ 
                      fontFamily: 'Poppins',
                      opacity: isResettingAccount ? 0.7 : 1,
                      '&.Mui-disabled': {
                        borderColor: 'error.main',
                        color: 'error.main',
                      }
                    }}
                  >
                    {isResettingAccount ? 'Resetting Account...' : 'Reset ICT Coordinator Account'}
                  </Button>
                  
                  <Typography variant="caption" display="block" sx={{ mt: 1.5, color: 'text.secondary', fontFamily: 'Poppins' }}>
                    • Reset ICT Coordinator Account: Comprehensive account reset including password reset and security settings
                    {isResettingAccount && (
                      <>
                        <br />
                        <span style={{ color: '#1976d2', fontWeight: 500 }}>
                          ⏳ Processing account reset... Please wait.
                        </span>
                      </>
                    )}
                  </Typography>
                </>
              )}
              
              {editItem.role === 'ADMIN' && (
                <>
              <Button
                variant="outlined"
                color="warning"
                    onClick={() => handleResetAdminAccount(editItem.id)}
                    startIcon={isResettingAccount ? <CircularProgress size={16} color="inherit" /> : <ResetIcon />}
                size={isMobile ? "small" : "medium"}
                    disabled={isResettingAccount}
                    sx={{ 
                      fontFamily: 'Poppins',
                      opacity: isResettingAccount ? 0.7 : 1,
                      '&.Mui-disabled': {
                        borderColor: 'warning.main',
                        color: 'warning.main',
                      }
                    }}
              >
                    {isResettingAccount ? 'Resetting Account...' : 'Reset Administrator Account'}
              </Button>
                  
                  <Typography variant="caption" display="block" sx={{ mt: 1.5, color: 'text.secondary', fontFamily: 'Poppins' }}>
                    • Reset Administrator Account: Comprehensive account reset including password reset and security settings
                    {isResettingAccount && (
                      <>
                        <br />
                        <span style={{ color: '#1976d2', fontWeight: 500 }}>
                          ⏳ Processing account reset... Please wait.
                        </span>
                      </>
                    )}
              </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }}>
          <Button 
            onClick={handleClose} 
            sx={{ 
              fontFamily: 'Poppins',
              textTransform: 'none' 
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!validateForm()}
            sx={{ 
              fontFamily: 'Poppins',
              textTransform: 'none',
              px: 3 
            }}
          >
            {editItem ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

const SystemManagement = () => {
  const [data, setData] = useState({
    locations: [],
    accountTypes: [],
    documentTypes: [],
    taTypes: [],
    users: []
  });
  const [loading, setLoading] = useState({
    locations: false,
    accountTypes: false,
    documentTypes: false,
    taTypes: false,
    users: false
  });
  const [error, setError] = useState({
    locations: null,
    accountTypes: null,
    documentTypes: null,
    taTypes: null,
    users: null
  });
  const [selectedSection, setSelectedSection] = useState('locations');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchData = async (section) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    setError(prev => ({ ...prev, [section]: null }));
    try {
      const { data } = await (() => {
        switch (section) {
          case 'locations':
            return systemManagementService.getLocations();
          case 'accountTypes':
            return systemManagementService.getAccountTypes();
          case 'documentTypes':
            return systemManagementService.getDocumentTypes();
          case 'taTypes':
            return systemManagementService.getTATypes();
          case 'users':
            return systemManagementService.getUsers().then(response => {
              // Format the user data
              const formattedData = response.data.map(user => ({
                ...user,
                displayRole: user.role === 'STAFF' ? 'ICT Coordinator' : user.role === 'ADMIN' ? 'Administrator' : user.role,
                location: user.location ? 
                  `${user.location.name}${user.location.level ? ` - ${user.location.level}` : ''}` : 
                  user.role === 'ADMIN' ? 'System Wide' : 'Not Assigned',
                createdAt: new Date(user.createdAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }));
              return { data: formattedData };
            });
          default:
            return Promise.resolve({ data: [] });
        }
      })();
      
      setData(prev => ({ ...prev, [section]: data }));
    } catch (err) {
      setError(prev => ({ ...prev, [section]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  useEffect(() => {
    fetchData(selectedSection);
  }, [selectedSection]);

  const handleAdd = (section) => async (newData) => {
    try {
      switch (section) {
        case 'locations':
          await systemManagementService.createLocation(newData);
          break;
        case 'accountTypes':
          await systemManagementService.createAccountType(newData);
          break;
        case 'documentTypes':
          await systemManagementService.createDocumentType(newData);
          break;
        case 'taTypes':
          await systemManagementService.createTAType(newData);
          break;
        case 'users':
          await systemManagementService.createUser(newData);
          break;
        default:
          return;
      }
      await fetchData(section);
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = (section) => async (id, newData) => {
    try {
      switch (section) {
        case 'locations':
          await systemManagementService.updateLocation(id, newData);
          break;
        case 'accountTypes':
          await systemManagementService.updateAccountType(id, newData);
          break;
        case 'documentTypes':
          await systemManagementService.updateDocumentType(id, newData);
          break;
        case 'taTypes':
          await systemManagementService.updateTAType(id, newData);
          break;
        case 'users':
          await systemManagementService.updateUser(id, newData);
          break;
        default:
          return;
      }
      await fetchData(section);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = (section) => async (id) => {
    try {
      switch (section) {
        case 'locations':
          await systemManagementService.deleteLocation(id);
          break;
        case 'accountTypes':
          await systemManagementService.deleteAccountType(id);
          break;
        case 'documentTypes':
          await systemManagementService.deleteDocumentType(id);
          break;
        case 'taTypes':
          await systemManagementService.deleteTAType(id);
          break;
        case 'users':
          await systemManagementService.deleteUser(id);
          break;
        default:
          return;
      }
      await fetchData(section);
    } catch (err) {
      throw err;
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sections = [
    {
      id: 'locations',
      title: 'Location Management',
      icon: <LocationIcon />,
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'type', label: 'Type' },
        { key: 'level', label: 'School Level' },
      ],
      isLocation: true,
      locationTypes: [
        { value: 'SDO', label: 'SDO - Imus City' },
        { value: 'SCHOOL', label: 'School - Imus City' }
      ],
      schoolLevels: [
        { value: 'Elementary', label: 'Elementary' },
        { value: 'Junior High School', label: 'Junior High School' },
        { value: 'Senior High School', label: 'Senior High School' },
        { value: 'Integrated School', label: 'Integrated School' }
      ]
    },
    {
      id: 'accountTypes',
      title: 'Account Types',
      icon: <AccountIcon />,
      fields: [{ key: 'name', label: 'Name' }],
    },
    {
      id: 'documentTypes',
      title: 'Document Types',
      icon: <DocumentIcon />,
      fields: [{ key: 'name', label: 'Name' }],
    },
    {
      id: 'taTypes',
      title: 'Technical Assistance Types',
      icon: <TechnicalIcon />,
      fields: [{ key: 'name', label: 'Name' }],
    },
    {
      id: 'users',
      title: 'User Management',
      icon: <StaffIcon />,
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'displayRole', label: 'Role' },
        { key: 'location', label: 'Location' },
        { key: 'createdAt', label: 'Created At' }
      ],
      additionalFields: []
    },
  ];

  const getAvailableLocations = () => {
    return data.locations.map(location => ({
      value: location.id,
      label: `${location.name} (${location.type}${location.level ? ` - ${location.level}` : ''})`
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showNotification = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const renderSidebar = () => (
    <Box>
      <Typography 
        variant="h6" 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider', 
          fontFamily: 'Poppins',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <SettingsIcon fontSize="small" />
        System Settings
      </Typography>
      <List>
        {sections.map((section) => (
          <ListItem key={section.id} disablePadding>
            <ListItemButton
              selected={selectedSection === section.id}
              onClick={() => handleSectionClick(section.id)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                borderRadius: isMobile ? 0 : '0 8px 8px 0'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: selectedSection === section.id ? 'inherit' : 'primary.main' }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText 
                primary={section.title} 
                primaryTypographyProps={{ 
                  fontSize: { xs: '0.85rem', sm: '0.9rem' },
                  fontWeight: selectedSection === section.id ? 600 : 500,
                  fontFamily: 'Poppins'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Mobile Navigation Tabs (Alternative for small screens)
  const renderMobileTabs = () => (
    <Paper 
      square 
      elevation={0} 
      sx={{ 
        display: { xs: 'block', md: 'none' },
        position: 'sticky',
        top: 0,
        zIndex: 10,
        mb: 2,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Tabs
        value={selectedSection}
        onChange={(e, newValue) => setSelectedSection(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: '48px',
          '& .MuiTab-root': {
            minHeight: '48px',
            fontFamily: 'Poppins',
            fontSize: '0.8rem',
            fontWeight: 500,
            textTransform: 'none',
            minWidth: 'auto'
          }
        }}
      >
        {sections.map((section) => (
          <Tab 
            key={section.id} 
            value={section.id} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {React.cloneElement(section.icon, { fontSize: 'small' })}
                {isMobile ? null : section.title.split(' ')[0]}
              </Box>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );

  // Main title and toggle button for sidebar on mobile
  const renderMobileHeader = () => (
    <Box 
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        py: 1.5,
        px: 2,
        backgroundColor: 'white',
        borderRadius: 1,
        boxShadow: 1
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton 
          edge="start" 
          color="primary"
          onClick={handleDrawerToggle}
          sx={{ mr: 1, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Poppins',
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          System Management
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: { xs: 'auto', sm: 'calc(100vh - 160px)' } }}>
      {/* Mobile Header */}
      {isMobile && renderMobileHeader()}
      
      <Box sx={{ display: 'flex', flexGrow: 1, height: '100%' }}>
        {/* Sidebar for larger screens and drawer for mobile */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
              },
            }}
          >
            {renderSidebar()}
          </Drawer>
        ) : (
          <Box
            sx={{
              width: 250,
              flexShrink: 0,
              backgroundColor: 'background.paper',
              borderRight: '1px solid',
              borderColor: 'divider',
              mr: 2,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            {renderSidebar()}
          </Box>
        )}

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'calc(100% - 250px)' } }}>
          {/* Mobile tabs for navigation */}
          {isMobile && renderMobileTabs()}
          
          {sections.map((section) => (
            selectedSection === section.id && (
              <ManagementSection
                key={section.id}
                title={section.title}
                items={data[section.id]}
                onAdd={handleAdd(section.id)}
                onEdit={handleEdit(section.id)}
                onDelete={handleDelete(section.id)}
                fields={section.fields}
                additionalFields={section.additionalFields}
                isLocation={section.isLocation}
                locationTypes={section.locationTypes}
                schoolLevels={section.schoolLevels}
                loading={loading[section.id]}
                error={error[section.id]}
                availableLocations={section.id === 'users' ? getAvailableLocations() : []}
                onSnackbarMessage={showNotification}
              />
            )
          ))}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%', 
            fontFamily: 'Poppins',
            '& .MuiAlert-message': { fontFamily: 'Poppins' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemManagement; 