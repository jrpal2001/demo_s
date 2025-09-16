import { useState } from 'react';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  Tabs,
  Tab,
  Alert,
  Snackbar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Import the three components
import AssetManagementComponent from './asset-management-component';
import MaintenanceComponent from './maintenance-component';
import OtherStoresComponent from './other-stores-component';

const AssetManagementSystem = () => {
  // State for selected tab and subcategory
  const [selectedTab, setSelectedTab] = useState(0);
  const [subCategory, setSubCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSubCategory('');
  };

  // Handle subcategory change
  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Get subcategory options based on selected tab
  const getSubCategoryOptions = () => {
    if (selectedTab === 0) {
      return [
        { value: 'MACHINERY', label: 'MACHINERY' },
        { value: 'ELECTRICALS', label: 'ELECTRICALS' },
        { value: 'ELECTRONICS', label: 'ELECTRONICS' },
        { value: 'FURNITURE&FIXTURES', label: 'FURNITURE & FIXTURES' },
        { value: 'IMMOVABLE PROPERTIES', label: 'IMMOVABLE PROPERTIES' },
        { value: 'VEHICLES', label: 'VEHICLES' },
        { value: 'SOFTWARES&LICENSES', label: 'SOFTWARES & LICENSES' },
      ];
    } else if (selectedTab === 1) {
      return [
        { value: 'BUSINESS LICENSES', label: 'BUSINESS LICENSES' },
        { value: 'WEIGHTS&MEASUREMENTS', label: 'WEIGHTS & MEASUREMENTS' },
        { value: 'SAFETY EQUIPMENTS', label: 'SAFETY EQUIPMENTS' },
        { value: 'AMC', label: 'AMC' },
        { value: 'INSURANCE', label: 'INSURANCE' },
        { value: 'AGREEMENTS', label: 'AGREEMENTS' },
      ];
    } else if (selectedTab === 2) {
      return [
        { value: 'TOOLS AND SPARE PARTS', label: 'TOOLS AND SPARE PARTS' },
        { value: 'STATIONARY&HOUSEKEEPING', label: 'STATIONARY & HOUSEKEEPING' },
        { value: 'EMBROIDERY STORE', label: 'EMBROIDERY STORE' },
      ];
    }
    return [];
  };

  // Render the appropriate component based on selected tab
  const renderTabContent = () => {
    if (selectedTab === 0) {
      return (
        <AssetManagementComponent
          subCategory={subCategory}
          loading={loading}
          setLoading={setLoading}
          showSnackbar={showSnackbar}
        />
      );
    } else if (selectedTab === 1) {
      return (
        <MaintenanceComponent
          subCategory={subCategory}
          loading={loading}
          setLoading={setLoading}
          showSnackbar={showSnackbar}
        />
      );
    } else if (selectedTab === 2) {
      return (
        <OtherStoresComponent
          subCategory={subCategory}
          loading={loading}
          setLoading={setLoading}
          showSnackbar={showSnackbar}
        />
      );
    }
    return null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Asset Management System
          </Typography>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="Asset Management" />
              <Tab label="Maintenance" />
              <Tab label="Other Stores" />
            </Tabs>
          </Box>
          {/* Subcategory Selection */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={subCategory}
                label="Select Category"
                onChange={handleSubCategoryChange}
              >
                {getSubCategoryOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Render Tab Content */}
          {renderTabContent()}
          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default AssetManagementSystem;
