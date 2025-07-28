import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { saveAs } from 'file-saver';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Consolidated table configurations
const TABLE_CONFIGS = {
  volumeTrends: {
    title: 'Ticket Volume Trends',
    columns: [
      { id: 'date', label: 'Date', numeric: false },
      { id: 'total', label: 'Total', numeric: true },
      { id: 'resolved', label: 'Resolved', numeric: true }
    ]
  },
  priority: {
    title: 'Priority Distribution',
    columns: [
      { id: 'priority', label: 'Priority Level', numeric: false },
      { id: 'count', label: 'Count', numeric: true },
      { id: 'percentage', label: 'Percentage', numeric: true, format: (value) => `${value.toFixed(1)}%` }
    ]
  },
  category: {
    title: 'Category Performance',
    columns: [
      { id: 'category', label: 'Category', numeric: false },
      { id: 'count', label: 'Tickets', numeric: true },
      { id: 'resolutionTime', label: 'Avg. Resolution Time (h)', numeric: true, format: (value) => value.toFixed(1) }
    ]
  },
  responseTime: {
    title: 'Response Time Analysis',
    columns: [
      { id: 'date', label: 'Date', numeric: false },
      { id: 'responseTime', label: 'Response Time (h)', numeric: true, format: (value) => value.toFixed(1) },
      { id: 'resolutionTime', label: 'Resolution Time (h)', numeric: true, format: (value) => value.toFixed(1) }
    ]
  },
  ictCoor: {
    title: 'ICT COOR Distribution by School Type',
    columns: [
      { id: 'type', label: 'School Type', numeric: false },
      { id: 'count', label: 'Number of ICT COORs', numeric: true },
      { id: 'percentage', label: 'Percentage', numeric: true, format: (value) => `${value.toFixed(0)}%` }
    ]
  }
};

// Summary card configurations
const SUMMARY_CARDS = [
  {
    title: 'Total Tickets',
    getValue: (stats) => stats.totalTickets,
    getSubtext: (stats) => `Resolution Rate: ${stats.performanceMetrics.resolutionRate.toFixed(1)}%`
  },
  {
    title: 'Response Time',
    getValue: (stats) => `${stats.responseTimeMetrics.averageResponseTime}h`,
    getSubtext: (stats) => `Efficiency: ${stats.performanceMetrics.responseEfficiency.toFixed(1)}%`
  },
  {
    title: 'Resolution Time',
    getValue: (stats) => `${stats.responseTimeMetrics.averageResolutionTime}h`,
    getSubtext: () => 'Average time to resolve'
  },
  {
    title: 'Satisfaction Score',
    getValue: (stats) => `${stats.performanceMetrics.satisfactionScore.toFixed(1)}%`,
    getSubtext: () => 'Based on resolution time'
  },
  {
    title: 'ICT COORs',
    getValue: (stats) => stats.ictCoorUsers || 0,
    getSubtext: () => 'Total ICT Coordinators',
    icon: PersonIcon,
    color: '#651fff'
  }
];

const PaginatedTable = ({ config, data, searchable = true }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredData = searchable 
    ? data.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
      )
    : data;

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 1 : 0,
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center' 
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: 'Poppins',
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {config.title}
        </Typography>
        {searchable && (
          <TextField
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { fontFamily: 'Poppins' }
            }}
            sx={{ 
              width: isMobile ? '100%' : '200px',
              '& .MuiInputLabel-root': { fontFamily: 'Poppins' }
            }}
          />
        )}
      </Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {config.columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align={column.numeric ? 'right' : 'left'}
                  sx={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {config.columns.map((column) => (
                  <TableCell 
                    key={column.id}
                    align={column.numeric ? 'right' : 'left'}
                    sx={{ 
                      fontFamily: 'Poppins',
                      whiteSpace: 'nowrap',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  >
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        sx={{
          '& .MuiTablePagination-select': { fontFamily: 'Poppins' },
          '& .MuiTablePagination-displayedRows': { fontFamily: 'Poppins' }
        }}
      />
    </Paper>
  );
};

const SummaryCard = ({ config, stats }) => {
  const Icon = config.icon;
  
  return (
    <Card>
      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: Icon ? 1 : 0 }}>
          {Icon && <Icon sx={{ mr: 1, color: config.color }} />}
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              fontFamily: 'Poppins',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            {config.title}
          </Typography>
        </Box>
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: 'Poppins',
            fontSize: { xs: '1.8rem', sm: '2.5rem' },
            color: config.color || 'inherit'
          }}
        >
          {config.getValue(stats)}
        </Typography>
        <Typography 
          variant="body2" 
          color="textSecondary" 
          sx={{ 
            fontFamily: 'Poppins',
            fontSize: { xs: '0.75rem', sm: '0.8rem' }
          }}
        >
          {config.getSubtext(stats)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [timePeriod, setTimePeriod] = useState('monthly');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Generate ICT COOR distribution data
  const generateIctCoorDistribution = useCallback((totalIctCoors) => [
    { type: 'Elementary School', count: Math.round(totalIctCoors * 0.55), percentage: 55 },
    { type: 'Junior High School', count: Math.round(totalIctCoors * 0.25), percentage: 25 },
    { type: 'Senior High School', count: Math.round(totalIctCoors * 0.15), percentage: 15 },
    { type: 'Integrated School', count: Math.round(totalIctCoors * 0.05), percentage: 5 },
  ], []);

  // Map frontend time period values to backend expected values
  const getBackendTimeRange = (timePeriod) => {
    const timeRangeMap = {
      'today': '24hours',
      'monthly': '30days',
      'quarter': '90days'
    };
    return timeRangeMap[timePeriod] || '30days';
  };

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const backendTimeRange = getBackendTimeRange(timePeriod);
      console.log(`Fetching report data for time period: ${timePeriod} (backend: ${backendTimeRange})`);

      const response = await axios.get(`${API_BASE_URL}/admin/stats?time_range=${backendTimeRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setStats(response.data.data);
        setError(null);
        console.log('Report data fetched successfully:', response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError(err.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const exportToExcel = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const backendTimeRange = getBackendTimeRange(timePeriod);
      const response = await axios.get(`${API_BASE_URL}/admin/tickets/export?time_period=${backendTimeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const date = new Date().toISOString().split('T')[0];
      saveAs(blob, `tickets_report_${timePeriod}_${date}.xlsx`);
      setError(null);
    } catch (err) {
      console.error('Error exporting to Excel:', err);
      setError(err.message || 'Failed to export data to Excel');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data with calculations
  const preparedData = stats ? {
    priorityData: stats.priorityDistribution.map(row => ({
    ...row,
    percentage: (row.count / stats.totalTickets) * 100
    })),
    ictCoorDistribution: generateIctCoorDistribution(stats.ictCoorUsers || 0)
  } : null;

  if (loading && !stats) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{ p: { xs: 2, sm: 4 } }}
      >
        <CircularProgress size={isMobile ? 40 : 50} />
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'Poppins',
            mt: 2,
            color: 'text.secondary',
            fontSize: { xs: '0.9rem', sm: '1rem' }
          }}
        >
          Loading report data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h2"
          sx={{ 
            fontWeight: 800,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
            lineHeight: 1.2,
            mb: { xs: 1.5, sm: 2 },
            color: '#0f172a',
            fontFamily: 'Poppins',
            letterSpacing: '-0.02em',
          }}
        >
          Advanced<br /> 
          <Typography 
            component="span" 
            variant="inherit" 
            sx={{ 
              color: '#1976d2',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '100%',
                height: '8px',
                backgroundColor: '#1976d210',
                zIndex: -1,
                borderRadius: '4px',
              }
            }}
          >
             Reports
          </Typography>
        </Typography>
      </Box>
      
      {/* Controls */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        justifyContent: 'flex-end', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        gap: isMobile ? 2 : 0,
        mb: 3 
      }}>
        <Stack 
          direction={isMobile ? "column" : "row"} 
          spacing={isMobile ? 1 : 2} 
          alignItems={isMobile ? "stretch" : "center"}
          width={isMobile ? "100%" : "auto"}
        >
          <ToggleButtonGroup
            value={timePeriod}
            exclusive
            onChange={(event, newTimePeriod) => {
              if (newTimePeriod && newTimePeriod !== timePeriod) {
                console.log(`Time period changed from ${timePeriod} to ${newTimePeriod}`);
                setTimePeriod(newTimePeriod);
              }
            }}
            aria-label="time period"
            size="small"
            fullWidth={isMobile}
            disabled={loading}
            sx={{ 
              '& .MuiToggleButton-root': { 
                fontFamily: 'Poppins',
                flex: isMobile ? 1 : 'initial'
              } 
            }}
          >
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="quarter">Quarter</ToggleButton>
          </ToggleButtonGroup>
          
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            disabled={loading}
            fullWidth={isMobile}
            sx={{
              backgroundColor: '#000000',
              '&:hover': { backgroundColor: '#333333' },
              fontFamily: 'Poppins',
              whiteSpace: 'nowrap',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Export {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Report
          </Button>
        </Stack>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ 
          mb: 3, 
          '& .MuiAlert-message': { fontFamily: 'Poppins' } 
        }}>
          {error}
        </Alert>
      )}
      
      {/* Loading indicator for data refresh */}
      {loading && stats && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 1, fontFamily: 'Poppins' }}>
            Updating data...
          </Typography>
        </Box>
      )}
      
      {/* Summary Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3, opacity: loading ? 0.6 : 1 }}>
          {SUMMARY_CARDS.map((config, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <SummaryCard config={config} stats={stats} />
          </Grid>
          ))}
        </Grid>
      )}
      
      {/* Analytics Tables */}
      {stats && preparedData && (
        <Grid container spacing={2} sx={{ opacity: loading ? 0.6 : 1 }}>
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 2, 
                mb: 2, 
                fontFamily: 'Poppins',
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Ticket Analytics
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <PaginatedTable
              config={TABLE_CONFIGS.volumeTrends}
              data={stats.ticketTrends}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <PaginatedTable
              config={TABLE_CONFIGS.priority}
              data={preparedData.priorityData}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <PaginatedTable
              config={TABLE_CONFIGS.category}
              data={stats.categoryDistribution}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <PaginatedTable
              config={TABLE_CONFIGS.responseTime}
              data={stats.ticketTrends}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography 
              variant="h5" 
              sx={{ 
                mt: 4, 
                mb: 2, 
                fontFamily: 'Poppins',
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ mr: 1, color: '#651fff' }} />
                ICT Coordinator Analytics
              </Box>
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <PaginatedTable
              config={TABLE_CONFIGS.ictCoor}
              data={preparedData.ictCoorDistribution}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              p: { xs: 2, sm: 3 }, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center' 
            }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: 'Poppins', 
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                  }}
                >
                  ICT Coordinator Overview
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: 'Poppins', 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    {stats.ictCoorUsers || 0} Total ICT Coordinators
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ 
                      fontFamily: 'Poppins', 
                      mb: 2,
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    Responsible for ticket management at their schools
                  </Typography>
                  
                  {['View and respond to technical issues', 'Coordinate with SDO ICT Unit', 'Provide first-level technical support', 'Manage school\'s ICT resources'].map((item, index) => (
                  <Typography 
                      key={index}
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'Poppins', 
                      mb: 1,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' }
                    }}
                  >
                      • {item}
                  </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Reports; 