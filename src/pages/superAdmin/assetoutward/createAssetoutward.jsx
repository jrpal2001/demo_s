'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Autocomplete,
  ButtonGroup,
  Chip,
  CircularProgress,
} from '@mui/material';
import { IconArrowLeft, IconDeviceFloppy, IconPlus, IconTrash, IconSearch } from '@tabler/icons';
import { toast } from 'react-toastify';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { fetchAllAssetCodes } from '@/api/assetinventory.api';
import { fetchAllMaintenanceCodes } from '@/api/maintenanceInventory.api';
import { fetchAllOtherStoreItemCodes } from '@/api/otherstoresInventory.api';
import { createNewOutward, fetchNextOutwardNumber } from '@/api/assetOutward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateNewOutward = () => {
const userType = useSelector(selectCurrentUserType);
  const { department } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nextOutwardNumber, setNextOutwardNumber] = useState('');
  const [itemCodes, setItemCodes] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [selectedInventoryType, setSelectedInventoryType] = useState('');
  const [formData, setFormData] = useState({
    outwardedTo: '',
    referencedepartment: '',
    items: [
      {
        itemCode: '',
        requestedQuantity: 0,
        unit: '',
      },
    ],
  });

  // Track selected items separately to maintain selection state
  const [selectedItems, setSelectedItems] = useState([null]);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/new-outward`, title: 'New Outward Management' },
    { title: 'Create Outward' },
  ];

  // Inventory type options - All departments can select from all inventory types
  const getInventoryTypes = () => {
    return [
      { label: 'Asset Inventory', value: 'asset', color: 'primary' },
      { label: 'Maintenance Inventory', value: 'maintenance', color: 'primary' },
      { label: 'Other Stores Inventory', value: 'otherstores', color: 'success' },
    ];
  };

  const handleBack = () => {
    navigate(`/${userType}/new-outward`);
  };

  useEffect(() => {
    const fetchNextNumber = async () => {
      try {
        if (department) {
          const nextNumber = await fetchNextOutwardNumber(department);
          setNextOutwardNumber(nextNumber);
        }
      } catch (error) {
        console.error('Error fetching next outward number:', error);
        toast.error('Failed to fetch next outward number');
      }
    };

    fetchNextNumber();
  }, [department]);

  // Fetch item codes based on inventory type
  const fetchItemCodes = async (inventoryType, search = '') => {
    try {
      setLoadingItems(true);
      let response = [];

      switch (inventoryType) {
        case 'asset':
          response = await fetchAllAssetCodes({ page: 1, limit: 100, search });
          break;
        case 'maintenance':
          response = await fetchAllMaintenanceCodes({ page: 1, limit: 100, search });
          break;
        case 'otherstores':
          response = await fetchAllOtherStoreItemCodes({
            page: 1,
            limit: 100,
            search,
          });
          break;
        default:
          response = [];
      }

      // Handle different API response structures
      const items = response.items || response || [];
      console.log('Fetched items:', items);
      setItemCodes(items);
    } catch (error) {
      console.error('Error fetching item codes:', error);
      toast.error('Failed to fetch item codes');
      setItemCodes([]);
    } finally {
      setLoadingItems(false);
    }
  };

  // Handle inventory type selection
  const handleInventoryTypeSelect = (type) => {
    setSelectedInventoryType(type);
    fetchItemCodes(type);

    // Reset items when changing inventory type
    setFormData({
      ...formData,
      items: [
        {
          itemCode: '',
          requestedQuantity: 0,
          unit: '',
        },
      ],
    });
    setSelectedItems([null]);
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleItemCodeSelect = (index, selectedItem) => {
    // Update the selected items array
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = selectedItem;
    setSelectedItems(newSelectedItems);

    // Update the form data
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      itemCode: selectedItem?._id || '',
      unit: selectedItem?.uom || selectedItem?.unit || '',
    };
    setFormData({
      ...formData,
      items: updatedItems,
    });

    console.log('Selected item:', selectedItem);
    console.log('Updated form data:', updatedItems[index]);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          itemCode: '',
          requestedQuantity: 0,
          unit: '',
        },
      ],
    });
    // Add null to selectedItems array for the new item
    setSelectedItems([...selectedItems, null]);
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        items: updatedItems,
      });

      // Also remove from selectedItems
      const updatedSelectedItems = selectedItems.filter((_, i) => i !== index);
      setSelectedItems(updatedSelectedItems);
    }
  };

  const validateForm = () => {
    if (!selectedInventoryType) {
      setError('Please select an inventory type');
      return false;
    }
    if (formData.items.length === 0) {
      setError('At least one item is required');
      return false;
    }
    for (const item of formData.items) {
      if (!item.itemCode) {
        setError('All items must have an Item Code selected');
        return false;
      }
      if (!item.requestedQuantity || item.requestedQuantity <= 0) {
        setError('All items must have a valid Requested Quantity');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setError('');

      if (!validateForm()) {
        return;
      }

      setLoading(true);

      console.log("🚀 ~ handleSubmit ~ formData:", formData)
      const response = await createNewOutward(department, formData);

      if (
        response &&
        (response.success || response.status === 200 || response.status === 'success')
      ) {
        toast.success('Outward record created successfully');
        navigate(`/${userType}/asset-outward`);
      } else {
        throw new Error(response?.message || 'Failed to create outward record');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to create outward record';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error('Error creating outward:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchItems = (searchTerm) => {
    if (selectedInventoryType) {
      fetchItemCodes(selectedInventoryType, searchTerm);
    }
  };

  // Helper function to get display label for item
  const getItemLabel = (option) => {
    if (!option) return '';

    if (selectedInventoryType === 'asset') {
      return `${option.assetCode || ''} - ${option.assetName || ''}`;
    } else if (selectedInventoryType === 'maintenance') {
      return `${option.maintenanceCode || ''} - ${option.maintenanceName || ''}`;
    } else {
      return `${option.itemCode || ''} - ${option.itemName || ''}`;
    }
  };

  return (
    <PageContainer title="Create New Outward" description="Create new outward record">
      <Breadcrumb title="Create New Outward" items={BCrumb} />

      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={handleBack}>
          Back to List
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Create {department?.charAt(0).toUpperCase() + department?.slice(1)} Outward
          </Typography>

          <Box sx={{ mb: 3, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="h6" color="primary.contrastText">
              Next Outward Number: {nextOutwardNumber}
            </Typography>
          </Box>

          {/* Inventory Type Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Select Inventory Type
            </Typography>
            <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
              {getInventoryTypes().map((type) => (
                <Button
                  key={type.value}
                  variant={selectedInventoryType === type.value ? 'contained' : 'outlined'}
                  color={type.color}
                  onClick={() => handleInventoryTypeSelect(type.value)}
                  sx={{ mb: 1 }}
                >
                  {type.label}
                </Button>
              ))}
            </ButtonGroup>
            {selectedInventoryType && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={`Selected: ${
                    getInventoryTypes().find((t) => t.value === selectedInventoryType)?.label
                  }`}
                  color="primary"
                  variant="filled"
                />
              </Box>
            )}
          </Box>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Outwarded To"
                value={formData.outwardedTo}
                onChange={(e) => handleInputChange('outwardedTo', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Reference Department"
                value={formData.referencedepartment}
                onChange={(e) => handleInputChange('referencedepartment', e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">Items ({formData.items.length})</Typography>
            <Button
              variant="outlined"
              startIcon={<IconPlus />}
              onClick={addItem}
              disabled={!selectedInventoryType}
            >
              Add Item
            </Button>
          </Box>

          {!selectedInventoryType && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Please select an inventory type first to add items.
            </Alert>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Code</TableCell>
                  <TableCell align="right">Requested Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ minWidth: 300 }}>
                      <Autocomplete
                        options={itemCodes}
                        getOptionLabel={getItemLabel}
                        value={selectedItems[index]}
                        onChange={(event, newValue) => handleItemCodeSelect(index, newValue)}
                        onInputChange={(event, newInputValue) => {
                          if (newInputValue.length > 2) {
                            handleSearchItems(newInputValue);
                          }
                        }}
                        loading={loadingItems}
                        disabled={!selectedInventoryType}
                        isOptionEqualToValue={(option, value) => option._id === value?._id}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Search and select item code"
                            size="small"
                            required
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: <IconSearch size={16} />,
                              endAdornment: (
                                <>
                                  {loadingItems ? (
                                    <CircularProgress color="inherit" size={20} />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {selectedInventoryType === 'asset'
                                  ? option.assetCode
                                  : selectedInventoryType === 'maintenance'
                                  ? option.maintenanceCode
                                  : option.itemCode}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {selectedInventoryType === 'asset'
                                  ? option.assetName
                                  : selectedInventoryType === 'maintenance'
                                  ? option.maintenanceName
                                  : option.itemName}
                              </Typography>
                              {(option.uom || option.unit) && (
                                <Typography variant="caption" color="primary" sx={{ ml: 1 }}>
                                  ({option.uom || option.unit})
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                        noOptionsText={
                          !selectedInventoryType
                            ? 'Please select inventory type first'
                            : loadingItems
                            ? 'Loading...'
                            : 'No items found'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        value={item.requestedQuantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'requestedQuantity',
                            Number.parseInt(e.target.value) || 0,
                          )
                        }
                        inputProps={{
                          min: 1,
                          style: { textAlign: 'right' },
                        }}
                        size="small"
                        sx={{ width: '120px' }}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        placeholder="Unit"
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        size="small"
                        sx={{ width: '100px' }}
                        disabled
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeItem(index)}
                        disabled={formData.items.length === 1}
                      >
                        <IconTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconDeviceFloppy />}
              onClick={handleSubmit}
              disabled={loading || !selectedInventoryType}
            >
              {loading ? 'Creating...' : 'Create Outward'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default CreateNewOutward;
