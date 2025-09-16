'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';
import {
  updateDepartmentWorkOrder,
  getDepartmentWorkOrderById,
} from '@/api/workorderDepartment.api.js';
import { toast } from 'react-toastify';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete, TextField } from '@mui/material';

// DEPARTMENT CONFIGURATION
const DEPARTMENTS = [
  { value: 'fabric', label: 'Fabric' },
  { value: 'cutting', label: 'Cutting' },
  { value: 'operationparts', label: 'Operation Parts' },
  { value: 'trims', label: 'Trims' },
  { value: 'stitching', label: 'Stitching' },
  { value: 'finishing', label: 'Finishing' },
];

const WorkorderDepartmentDetails = ({
  workOrderId,
  department: initialDepartment,
  departmentWorkOrderRef,
  isAdmin = true,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [workOrderData, setWorkOrderData] = useState(null);
  const [fabricBomIds, setFabricBomIds] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment || '');
  const [departmentToUpdate, setDepartmentToUpdate] = useState('');

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const showFabric = isAdmin || selectedDepartment === 'fabric';
  const showCutting = isAdmin || selectedDepartment === 'cutting';
  const showOperationParts =
    isAdmin ||
    selectedDepartment === 'operationparts' ||
    selectedDepartment === 'embroidery' ||
    selectedDepartment === 'production';
  const showTrims = isAdmin || selectedDepartment === 'trims';
  const showStitching =
    isAdmin || selectedDepartment === 'stitching' || selectedDepartment === 'production';
  const showFinishing = isAdmin || selectedDepartment === 'finishing';

  // FIXED: Helper function to get the correct product type for each department
  const getProductTypeForDepartment = (department) => {
    switch (department) {
      case 'trims':
      case 'stitching':
        return 'trims';
      case 'finishing':
        return 'accessories';
      default:
        return 'trims';
    }
  };

  // Helper function to get consumption rate for a product
  const getConsumptionRate = (productId, department) => {
    if (!workOrderData?.productDetails) return 0;

    const productType = getProductTypeForDepartment(department);
    const products = workOrderData.productDetails[productType] || [];

    // Search by inventoryRef first, then fallback to _id
    const product = products.find(
      (item) =>
        item.code?.inventoryRef === productId ||
        item.code?._id === productId ||
        item.code === productId,
    );
    return product?.consumption || 0;
  };

  // Helper function to calculate total consumption
  const calculateTotalConsumption = (productId, department, consumptionPerPiece = null) => {
    const quantityToBeProduced = workOrderData?.workOrderRef?.quantityToBeProduced || 0;
    const consumption = consumptionPerPiece || getConsumptionRate(productId, department);
    return consumption * quantityToBeProduced;
  };

  // Helper function to get product name/code for display
  const getProductDisplayName = (productId, department) => {
    if (!productId) return '';
    if (!workOrderData?.productDetails) return productId;

    const productType = getProductTypeForDepartment(department);
    const products = workOrderData.productDetails[productType] || [];

    // Search by inventoryRef first, then fallback to _id
    const product = products.find(
      (item) =>
        item.code?.inventoryRef === productId ||
        item.code?._id === productId ||
        item._id === productId ||
        item.code === productId,
    );

    return product?.code?.bomId || product?.code || product?.name || productId;
  };

  // Function to get BOM ID for a fabric code
  const getFabricBomId = (codeId) => {
    const fabricItem = fabricBomIds.find((item) => item.id === codeId);
    return fabricItem ? fabricItem.bomId : null;
  };

  // Validation function to ensure productId is never null/undefined
  const validateProductData = (data, department) => {
    const errors = [];

    if (department === 'trims' && data.trims?.products) {
      data.trims.products.forEach((product, index) => {
        if (!product.productId || product.productId === null || product.productId === '') {
          errors.push(`Trims product ${index + 1}: Product selection is required`);
        }
      });
    }

    if (department === 'stitching' && data.stitching) {
      data.stitching.forEach((stitchEntry, stitchIndex) => {
        if (stitchEntry.products) {
          stitchEntry.products.forEach((product, productIndex) => {
            if (!product.productId || product.productId === null || product.productId === '') {
              errors.push(
                `Stitching entry ${stitchIndex + 1}, product ${
                  productIndex + 1
                }: Product selection is required`,
              );
            }
          });
        }
      });
    }

    if (department === 'finishing' && data.finishing?.products) {
      data.finishing.products.forEach((product, index) => {
        if (!product.productId || product.productId === null || product.productId === '') {
          errors.push(`Finishing product ${index + 1}: Product selection is required`);
        }
      });
    }

    return errors;
  };

  useEffect(() => {
    if (workOrderId) {
      fetchWorkOrderData();
    }
  }, [workOrderId]);

  const fetchWorkOrderData = async () => {
    try {
      setLoading(true);
      const data = await getDepartmentWorkOrderById(departmentWorkOrderRef);
      console.log('Fetched work order data:', data);
      setWorkOrderData(data);

      if (data) {
        populateFormData(data);
      }
    } catch (error) {
      console.error('Error fetching work order data:', error);
      toast.error('Failed to fetch work order data');
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (data) => {
    // Fabric section
    if (data.fabric && Array.isArray(data.fabric)) {
      const fabricWithBomIds = data.fabric.map((fab) => {
        if (fab.code && typeof fab.code === 'object' && fab.code.bomId) {
          return { id: fab.code._id, bomId: fab.code.bomId };
        }
        return { id: fab.code, bomId: null };
      });
      setFabricBomIds(fabricWithBomIds);

      const formattedFabric = data.fabric.map((fab) => ({
        ...fab,
        code: fab.code?._id || fab.code,
      }));
      setValue('fabric', formattedFabric);
    }

    // Cutting section
    if (data.cutting) {
      setValue('cutting.cuttingQuantity', data.cutting.cuttingQuantity);
      setValue('cutting.remarks', data.cutting.remarks);
    }

    // Operation parts section
    if (data.operationparts) {
      setValue('operationparts.embDetails', data.operationparts.embDetails);
      setValue('operationparts.finishedQty', data.operationparts.finishedQty);
      setValue('operationparts.dailyProductionDetails', data.operationparts.dailyProductionDetails);
      setValue('operationparts.remarks', data.operationparts.remarks);
      setValue('operationparts.cutPanelsReceivedQty', data.operationparts.cutPanelsReceivedQty);
    }

    // Trims section
    if (data.trims) {
      setValue('trims.date', data.trims.date ? new Date(data.trims.date) : null);
      setValue('trims.noOfMembers', data.trims.noOfMembers);
      setValue('trims.quantity', data.trims.quantity);
      setValue('trims.remarks', data.trims.remarks);

      if (data.trims.products && data.trims.products.length > 0) {
        const processedProducts = data.trims.products
          .map((p) => ({
            ...p,
            // Handle both inventoryRef and _id for backward compatibility
            productId: p.productId?.inventoryRef || p.productId?._id || p.productId || '',
            _id: p._id,
          }))
          .filter((p) => p.productId);

        if (processedProducts.length === 0) {
          processedProducts.push({ productId: '', trimsQuantity: null });
        }

        setValue('trims.products', processedProducts);
      } else {
        setValue('trims.products', [{ productId: '', trimsQuantity: null }]);
      }
    }

    // Stitching section
    if (data.stitching && data.stitching.length > 0) {
      const processedStitching = data.stitching.map((entry) => ({
        ...entry,
        products: Array.isArray(entry.products)
          ? entry.products
              .map((p) => ({
                ...p,
                // Handle both inventoryRef and _id for backward compatibility
                productId: p.productId?.inventoryRef || p.productId?._id || p.productId || '',
                _id: p._id,
              }))
              .filter((p) => p.productId)
          : [{ productId: '', trimsQuantity: null }],
        _id: entry._id,
      }));

      // Ensure each stitching entry has at least one product entry
      processedStitching.forEach((entry) => {
        if (entry.products.length === 0) {
          entry.products.push({ productId: '', trimsQuantity: null });
        }
      });

      setValue('stitching', processedStitching);
    } else {
      setValue('stitching', [
        {
          cutPanelsReceivedQty: null,
          noOfLines: null,
          hourlyProduction: null,
          dailyProduction: null,
          totalDailyProduction: null,
          products: [{ productId: '', trimsQuantity: null }],
        },
      ]);
    }

    // Finishing section
    if (data.finishing) {
      setValue('finishing.noOfGarmentsLoaded', data.finishing.noOfGarmentsLoaded);
      setValue('finishing.hourlyProcess', data.finishing.hourlyProcess);
      setValue('finishing.dailyProcess', data.finishing.dailyProcess);
      setValue('finishing.totalDailyFinishingQty', data.finishing.totalDailyFinishingQty);
      setValue('finishing.finalInspectionReport', data.finishing.finalInspectionReport);

      if (data.finishing.products && data.finishing.products.length > 0) {
        const processedProducts = data.finishing.products
          .map((p) => ({
            ...p,
            // Handle both inventoryRef and _id for backward compatibility
            productId: p.productId?.inventoryRef || p.productId?._id || p.productId || '',
            _id: p._id,
          }))
          .filter((p) => p.productId);

        if (processedProducts.length === 0) {
          processedProducts.push({ productId: '', accessoriesQuantity: null });
        }

        setValue('finishing.products', processedProducts);
      } else {
        setValue('finishing.products', [{ productId: '', accessoriesQuantity: null }]);
      }
    }
  };

  // Enhanced form submission with validation
  const onSubmit = async (data) => {
    if (isAdmin && !departmentToUpdate) {
      toast.error('Please select a department to update');
      return;
    }

    const targetDepartment = isAdmin ? departmentToUpdate : selectedDepartment;
    console.log('🚀 ~ onSubmit ~ raw data:', data);
    console.log('🚀 ~ onSubmit ~ target department:', targetDepartment);

    // Validate product data before submission
    const validationErrors = validateProductData(data, targetDepartment);
    if (validationErrors.length > 0) {
      toast.error(`Validation failed: ${validationErrors.join(', ')}`);
      return;
    }

    setSubmitting(true);
    try {
      const departmentData = data[targetDepartment];
      if (!departmentData) {
        toast.error(`No data found for ${targetDepartment} department`);
        return;
      }

      // Clean and validate data before sending
      const cleanedDepartmentData = JSON.parse(JSON.stringify(departmentData));

      // Additional validation for products with null productId
      if (targetDepartment === 'trims' && cleanedDepartmentData.products) {
        cleanedDepartmentData.products = cleanedDepartmentData.products.filter(
          (p) => p.productId && p.productId !== null && p.productId !== '',
        );
      }

      if (targetDepartment === 'stitching' && cleanedDepartmentData) {
        cleanedDepartmentData.forEach((entry) => {
          if (entry.products) {
            entry.products = entry.products.filter(
              (p) => p.productId && p.productId !== null && p.productId !== '',
            );
          }
        });
      }

      if (targetDepartment === 'finishing' && cleanedDepartmentData.products) {
        cleanedDepartmentData.products = cleanedDepartmentData.products.filter(
          (p) => p.productId && p.productId !== null && p.productId !== '',
        );
      }

      const dataToSubmit = { [targetDepartment]: cleanedDepartmentData };
      console.log('🚀 ~ onSubmit ~ dataToSubmit:', JSON.stringify(dataToSubmit, null, 2));

      const message = await updateDepartmentWorkOrder(
        departmentWorkOrderRef,
        targetDepartment,
        dataToSubmit,
      );
      toast.success(
        message ||
          `${
            targetDepartment.charAt(0).toUpperCase() + targetDepartment.slice(1)
          } department updated successfully`,
      );

      await fetchWorkOrderData();
    } catch (error) {
      console.error('Error updating work order:', error);
      toast.error('Failed to update work order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Work Order Department Details {isAdmin && '(Admin View)'}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {isAdmin && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              As an admin, you can view all departments but can only update one department at a
              time.
            </Alert>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="department-to-update-label">Select Department to Update</InputLabel>
              <Select
                labelId="department-to-update-label"
                value={departmentToUpdate}
                label="Select Department to Update"
                onChange={(e) => setDepartmentToUpdate(e.target.value)}
              >
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Fabric Section */}
            {showFabric && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor:
                      isAdmin && departmentToUpdate === 'fabric' ? 'action.selected' : 'inherit',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Fabric Details{' '}
                    {isAdmin && departmentToUpdate === 'fabric' && '(Selected for Update)'}
                  </Typography>

                  <Controller
                    name="fabric"
                    control={control}
                    defaultValue={[{ fabricWeight: '', relaxingHours: '', code: '' }]}
                    render={({ field }) => (
                      <>
                        {Array.isArray(field.value) &&
                          field.value.map((fabricItem, index) => (
                            <Grid
                              container
                              spacing={2}
                              key={fabricItem._id || index}
                              sx={{ mb: 2, mt: 2 }}
                            >
                              <Grid item xs={12} md={4}>
                                <TextField
                                  fullWidth
                                  label={`Fabric Code (${index + 1})`}
                                  value={getFabricBomId(fabricItem.code) || fabricItem.code || ''}
                                  InputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <CustomTextField
                                  fullWidth
                                  label={`Fabric Weight (${index + 1})`}
                                  type="number"
                                  value={fabricItem.fabricWeight || ''}
                                  onChange={(e) => {
                                    const newArray = [...field.value];
                                    newArray[index].fabricWeight = e.target.value;
                                    field.onChange(newArray);
                                  }}
                                  disabled={isAdmin && departmentToUpdate !== 'fabric'}
                                  error={!!errors.fabric?.[index]?.fabricWeight}
                                  helperText={errors.fabric?.[index]?.fabricWeight?.message}
                                />
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <CustomTextField
                                  fullWidth
                                  label={`Relaxing Hours (${index + 1})`}
                                  type="number"
                                  value={fabricItem.relaxingHours || ''}
                                  onChange={(e) => {
                                    const newArray = [...field.value];
                                    newArray[index].relaxingHours = e.target.value;
                                    field.onChange(newArray);
                                  }}
                                  disabled={isAdmin && departmentToUpdate !== 'fabric'}
                                  error={!!errors.fabric?.[index]?.relaxingHours}
                                  helperText={errors.fabric?.[index]?.relaxingHours?.message}
                                />
                              </Grid>
                            </Grid>
                          ))}
                      </>
                    )}
                  />
                </Paper>
              </Grid>
            )}

            {/* Cutting Section */}
            {showCutting && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor:
                      isAdmin && departmentToUpdate === 'cutting' ? 'action.selected' : 'inherit',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Cutting Details{' '}
                    {isAdmin && departmentToUpdate === 'cutting' && '(Selected for Update)'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Cutting Quantity"
                        type="number"
                        {...register('cutting.cuttingQuantity')}
                        disabled={isAdmin && departmentToUpdate !== 'cutting'}
                        error={!!errors.cutting?.cuttingQuantity}
                        helperText={errors.cutting?.cuttingQuantity?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Remarks"
                        multiline
                        rows={2}
                        {...register('cutting.remarks')}
                        disabled={isAdmin && departmentToUpdate !== 'cutting'}
                        error={!!errors.cutting?.remarks}
                        helperText={errors.cutting?.remarks?.message}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Operation Parts Section */}
            {showOperationParts && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor:
                      isAdmin && departmentToUpdate === 'operationparts'
                        ? 'action.selected'
                        : 'inherit',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Operation Parts Details{' '}
                    {isAdmin && departmentToUpdate === 'operationparts' && '(Selected for Update)'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Embroidery Details"
                        multiline
                        rows={2}
                        {...register('operationparts.embDetails')}
                        disabled={isAdmin && departmentToUpdate !== 'operationparts'}
                        error={!!errors.operationparts?.embDetails}
                        helperText={errors.operationparts?.embDetails?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Finished Quantity"
                        type="number"
                        {...register('operationparts.finishedQty')}
                        disabled={isAdmin && departmentToUpdate !== 'operationparts'}
                        error={!!errors.operationparts?.finishedQty}
                        helperText={errors.operationparts?.finishedQty?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Daily Production Details"
                        multiline
                        rows={2}
                        {...register('operationparts.dailyProductionDetails')}
                        disabled={isAdmin && departmentToUpdate !== 'operationparts'}
                        error={!!errors.operationparts?.dailyProductionDetails}
                        helperText={errors.operationparts?.dailyProductionDetails?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Remarks"
                        multiline
                        rows={2}
                        {...register('operationparts.remarks')}
                        disabled={isAdmin && departmentToUpdate !== 'operationparts'}
                        error={!!errors.operationparts?.remarks}
                        helperText={errors.operationparts?.remarks?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Cut Panels Received Quantity"
                        type="number"
                        {...register('operationparts.cutPanelsReceivedQty')}
                        disabled={isAdmin && departmentToUpdate !== 'operationparts'}
                        error={!!errors.operationparts?.cutPanelsReceivedQty}
                        helperText={errors.operationparts?.cutPanelsReceivedQty?.message}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Trims Section */}
            {showTrims && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor:
                      isAdmin && departmentToUpdate === 'trims' ? 'action.selected' : 'inherit',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Trims Details{' '}
                    {isAdmin && departmentToUpdate === 'trims' && '(Selected for Update)'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="trims.date"
                        control={control}
                        render={({ field }) => (
                          <DatePicker
                            label="Date"
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                            disabled={isAdmin && departmentToUpdate !== 'trims'}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!errors.trims?.date,
                                helperText: errors.trims?.date?.message,
                              },
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Number of Members"
                        type="number"
                        {...register('trims.noOfMembers')}
                        disabled={isAdmin && departmentToUpdate !== 'trims'}
                        error={!!errors.trims?.noOfMembers}
                        helperText={errors.trims?.noOfMembers?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Total Quantity"
                        type="number"
                        {...register('trims.quantity')}
                        disabled={isAdmin && departmentToUpdate !== 'trims'}
                        error={!!errors.trims?.quantity}
                        helperText={errors.trims?.quantity?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Remarks"
                        multiline
                        rows={2}
                        {...register('trims.remarks')}
                        disabled={isAdmin && departmentToUpdate !== 'trims'}
                        error={!!errors.trims?.remarks}
                        helperText={errors.trims?.remarks?.message}
                      />
                    </Grid>

                    {/* Products Section */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Products
                      </Typography>
                      <Controller
                        name="trims.products"
                        control={control}
                        defaultValue={[{ productId: '', trimsQuantity: '' }]}
                        render={({ field }) => (
                          <>
                            {field.value.map((product, index) => (
                              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={4}>
                                  <Box>
                                    {product.productId && product.productId !== '' ? (
                                      <TextField
                                        fullWidth
                                        label="Product"
                                        value={
                                          getProductDisplayName(product.productId, 'trims') ||
                                          product.productId
                                        }
                                        InputProps={{ readOnly: true }}
                                      />
                                    ) : (
                                      <Autocomplete
                                        options={workOrderData?.productDetails?.trims || []}
                                        getOptionLabel={(option) =>
                                          option.code?.bomId || option.code || option.name || ''
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Select Product"
                                            fullWidth
                                            required
                                            error={!product.productId || product.productId === ''}
                                            helperText={
                                              !product.productId || product.productId === ''
                                                ? 'Product selection is required'
                                                : ''
                                            }
                                          />
                                        )}
                                        onChange={(event, newValue) => {
                                          const newProducts = [...field.value];
                                          // Save inventoryRef instead of _id for trims
                                          newProducts[index].productId = newValue
                                            ? newValue.code?.inventoryRef ||
                                              newValue.inventoryRef ||
                                              newValue._id
                                            : '';
                                          field.onChange(newProducts);
                                        }}
                                        disabled={isAdmin && departmentToUpdate !== 'trims'}
                                        renderOption={(props, option) => (
                                          <li {...props}>
                                            <div>
                                              <Typography variant="body2">
                                                {option.code?.bomId || option.code || option.name}
                                              </Typography>
                                              <Typography variant="caption" color="textSecondary">
                                                Consumption: {option.consumption || 0} per piece
                                              </Typography>
                                            </div>
                                          </li>
                                        )}
                                      />
                                    )}
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <CustomTextField
                                    fullWidth
                                    label="Consumption Rate"
                                    type="number"
                                    value={getConsumptionRate(product.productId, 'trims')}
                                    InputProps={{ readOnly: true }}
                                    helperText="Per piece"
                                  />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <CustomTextField
                                    fullWidth
                                    label="Total Consumption"
                                    type="number"
                                    value={calculateTotalConsumption(product.productId, 'trims')}
                                    InputProps={{ readOnly: true }}
                                    helperText={`For ${
                                      workOrderData?.workOrderRef?.quantityToBeProduced || 0
                                    } pieces`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    value={product.trimsQuantity || ''}
                                    onChange={(e) => {
                                      const newProducts = [...field.value];
                                      newProducts[index].trimsQuantity = e.target.value;
                                      field.onChange(newProducts);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'trims'}
                                    error={!!errors.trims?.products?.[index]?.trimsQuantity}
                                    helperText={
                                      errors.trims?.products?.[index]?.trimsQuantity?.message
                                    }
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={1}
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  {index > 0 && (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => {
                                        const newProducts = field.value.filter(
                                          (_, i) => i !== index,
                                        );
                                        field.onChange(newProducts);
                                      }}
                                      disabled={isAdmin && departmentToUpdate !== 'trims'}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            ))}
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                field.onChange([
                                  ...field.value,
                                  { productId: '', trimsQuantity: '' },
                                ]);
                              }}
                              disabled={isAdmin && departmentToUpdate !== 'trims'}
                              sx={{ mt: 1 }}
                            >
                              Add Product
                            </Button>
                          </>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Stitching Section - FIXED: Now uses trims products */}
            {showStitching && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor:
                      isAdmin && departmentToUpdate === 'stitching' ? 'action.selected' : 'inherit',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Stitching Details{' '}
                    {isAdmin && departmentToUpdate === 'stitching' && '(Selected for Update)'}
                  </Typography>
                  <Controller
                    name="stitching"
                    control={control}
                    defaultValue={[
                      {
                        cutPanelsReceivedQty: null,
                        noOfLines: null,
                        hourlyProduction: null,
                        dailyProduction: null,
                        totalDailyProduction: null,
                        products: [{ productId: '', trimsQuantity: null }],
                      },
                    ]}
                    render={({ field }) => (
                      <>
                        {Array.isArray(field.value) &&
                          field.value.map((stitchingEntry, stitchingIndex) => (
                            <Paper
                              key={stitchingEntry._id || stitchingIndex}
                              sx={{ p: 2, mb: 2, border: '1px solid #ccc' }}
                            >
                              <Typography variant="subtitle1">
                                Stitching Entry {stitchingIndex + 1}
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                  <CustomTextField
                                    fullWidth
                                    label="Cut Panels Received Quantity"
                                    type="number"
                                    value={stitchingEntry.cutPanelsReceivedQty || ''}
                                    onChange={(e) => {
                                      const newStitching = [...field.value];
                                      newStitching[stitchingIndex].cutPanelsReceivedQty =
                                        e.target.value;
                                      field.onChange(newStitching);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <CustomTextField
                                    fullWidth
                                    label="Number of Lines"
                                    type="number"
                                    value={stitchingEntry.noOfLines || ''}
                                    onChange={(e) => {
                                      const newStitching = [...field.value];
                                      newStitching[stitchingIndex].noOfLines = e.target.value;
                                      field.onChange(newStitching);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <CustomTextField
                                    fullWidth
                                    label="Hourly Production"
                                    type="number"
                                    value={stitchingEntry.hourlyProduction || ''}
                                    onChange={(e) => {
                                      const newStitching = [...field.value];
                                      newStitching[stitchingIndex].hourlyProduction =
                                        e.target.value;
                                      field.onChange(newStitching);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <CustomTextField
                                    fullWidth
                                    label="Daily Production"
                                    type="number"
                                    value={stitchingEntry.dailyProduction || ''}
                                    onChange={(e) => {
                                      const newStitching = [...field.value];
                                      newStitching[stitchingIndex].dailyProduction = e.target.value;
                                      field.onChange(newStitching);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <CustomTextField
                                    fullWidth
                                    label="Total Daily Production"
                                    type="number"
                                    value={stitchingEntry.totalDailyProduction || ''}
                                    onChange={(e) => {
                                      const newStitching = [...field.value];
                                      newStitching[stitchingIndex].totalDailyProduction =
                                        e.target.value;
                                      field.onChange(newStitching);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                  />
                                </Grid>
                                {/* Products Section - FIXED: Now uses trims products */}
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                    Products (from Trims)
                                  </Typography>
                                  {Array.isArray(stitchingEntry.products) &&
                                    stitchingEntry.products.map((product, productIndex) => (
                                      <Grid container spacing={2} key={productIndex} sx={{ mb: 2 }}>
                                        <Grid item xs={12} md={4}>
                                          <Box>
                                            {product.productId && product.productId !== '' ? (
                                              <TextField
                                                fullWidth
                                                label="Product"
                                                value={
                                                  getProductDisplayName(
                                                    product.productId,
                                                    'stitching',
                                                  ) || product.productId
                                                }
                                                InputProps={{ readOnly: true }}
                                              />
                                            ) : (
                                              <Autocomplete
                                                options={workOrderData?.productDetails?.trims || []}
                                                getOptionLabel={(option) =>
                                                  option.code?.bomId ||
                                                  option.code ||
                                                  option.name ||
                                                  ''
                                                }
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    label="Select Product"
                                                    fullWidth
                                                    required
                                                    error={
                                                      !product.productId || product.productId === ''
                                                    }
                                                    helperText={
                                                      !product.productId || product.productId === ''
                                                        ? 'Product selection is required'
                                                        : ''
                                                    }
                                                  />
                                                )}
                                                onChange={(event, newValue) => {
                                                  const newStitching = [...field.value];
                                                  // Save inventoryRef instead of _id for stitching
                                                  newStitching[stitchingIndex].products[
                                                    productIndex
                                                  ].productId = newValue
                                                    ? newValue.code?.inventoryRef ||
                                                      newValue.inventoryRef ||
                                                      newValue._id
                                                    : '';
                                                  field.onChange(newStitching);
                                                }}
                                                disabled={
                                                  isAdmin && departmentToUpdate !== 'stitching'
                                                }
                                                renderOption={(props, option) => (
                                                  <li {...props}>
                                                    <div>
                                                      <Typography variant="body2">
                                                        {option.code?.bomId ||
                                                          option.code ||
                                                          option.name}
                                                      </Typography>
                                                      <Typography
                                                        variant="caption"
                                                        color="textSecondary"
                                                      >
                                                        Consumption: {option.consumption || 0} per
                                                        piece
                                                      </Typography>
                                                    </div>
                                                  </li>
                                                )}
                                              />
                                            )}
                                          </Box>
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                          <CustomTextField
                                            fullWidth
                                            label="Consumption Rate"
                                            type="number"
                                            value={getConsumptionRate(
                                              product.productId,
                                              'stitching',
                                            )}
                                            InputProps={{ readOnly: true }}
                                            helperText="Per piece"
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={2}>
                                          <CustomTextField
                                            fullWidth
                                            label="Total Consumption"
                                            type="number"
                                            value={calculateTotalConsumption(
                                              product.productId,
                                              'stitching',
                                            )}
                                            InputProps={{ readOnly: true }}
                                            helperText={`For ${
                                              workOrderData?.workOrderRef?.quantityToBeProduced || 0
                                            } pieces`}
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={3}>
                                          <CustomTextField
                                            fullWidth
                                            label="Quantity"
                                            type="number"
                                            value={product.trimsQuantity || ''}
                                            onChange={(e) => {
                                              const newStitching = [...field.value];
                                              newStitching[stitchingIndex].products[
                                                productIndex
                                              ].trimsQuantity = e.target.value;
                                              field.onChange(newStitching);
                                            }}
                                            disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                          />
                                        </Grid>
                                        <Grid
                                          item
                                          xs={12}
                                          md={1}
                                          sx={{ display: 'flex', alignItems: 'center' }}
                                        >
                                          {productIndex > 0 && (
                                            <Button
                                              variant="outlined"
                                              color="error"
                                              size="small"
                                              onClick={() => {
                                                const newStitching = [...field.value];
                                                newStitching[stitchingIndex].products =
                                                  newStitching[stitchingIndex].products.filter(
                                                    (_, i) => i !== productIndex,
                                                  );
                                                field.onChange(newStitching);
                                              }}
                                              disabled={
                                                isAdmin && departmentToUpdate !== 'stitching'
                                              }
                                            >
                                              Remove
                                            </Button>
                                          )}
                                        </Grid>
                                      </Grid>
                                    ))}
                                  <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                      const newStitching = [...field.value];
                                      newStitching[stitchingIndex].products.push({
                                        productId: '',
                                        trimsQuantity: '',
                                      });
                                      field.onChange(newStitching);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'stitching'}
                                    sx={{ mt: 1 }}
                                  >
                                    Add Product
                                  </Button>
                                </Grid>
                              </Grid>
                            </Paper>
                          ))}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            field.onChange([
                              ...field.value,
                              {
                                cutPanelsReceivedQty: null,
                                noOfLines: null,
                                hourlyProduction: null,
                                dailyProduction: null,
                                totalDailyProduction: null,
                                products: [{ productId: '', trimsQuantity: null }],
                              },
                            ]);
                          }}
                          disabled={isAdmin && departmentToUpdate !== 'stitching'}
                          sx={{ mt: 1 }}
                        >
                          Add Stitching Entry
                        </Button>
                      </>
                    )}
                  />
                </Paper>
              </Grid>
            )}

            {/* Finishing Section - Uses accessories products */}
            {showFinishing && (
              <Grid item xs={12}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor:
                      isAdmin && departmentToUpdate === 'finishing' ? 'action.selected' : 'inherit',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Finishing Details{' '}
                    {isAdmin && departmentToUpdate === 'finishing' && '(Selected for Update)'}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Number of Garments Loaded"
                        type="number"
                        {...register('finishing.noOfGarmentsLoaded')}
                        disabled={isAdmin && departmentToUpdate !== 'finishing'}
                        error={!!errors.finishing?.noOfGarmentsLoaded}
                        helperText={errors.finishing?.noOfGarmentsLoaded?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Hourly Process"
                        type="number"
                        {...register('finishing.hourlyProcess')}
                        disabled={isAdmin && departmentToUpdate !== 'finishing'}
                        error={!!errors.finishing?.hourlyProcess}
                        helperText={errors.finishing?.hourlyProcess?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Daily Process"
                        type="number"
                        {...register('finishing.dailyProcess')}
                        disabled={isAdmin && departmentToUpdate !== 'finishing'}
                        error={!!errors.finishing?.dailyProcess}
                        helperText={errors.finishing?.dailyProcess?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Total Daily Finishing Quantity"
                        type="number"
                        {...register('finishing.totalDailyFinishingQty')}
                        disabled={isAdmin && departmentToUpdate !== 'finishing'}
                        error={!!errors.finishing?.totalDailyFinishingQty}
                        helperText={errors.finishing?.totalDailyFinishingQty?.message}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        fullWidth
                        label="Final Inspection Report"
                        multiline
                        rows={2}
                        {...register('finishing.finalInspectionReport')}
                        disabled={isAdmin && departmentToUpdate !== 'finishing'}
                        error={!!errors.finishing?.finalInspectionReport}
                        helperText={errors.finishing?.finalInspectionReport?.message}
                      />
                    </Grid>

                    {/* Products Section - Uses accessories */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Accessories
                      </Typography>
                      <Controller
                        name="finishing.products"
                        control={control}
                        defaultValue={[{ productId: '', accessoriesQuantity: '' }]}
                        render={({ field }) => (
                          <>
                            {field.value.map((product, index) => (
                              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={4}>
                                  <Box>
                                    {product.productId && product.productId !== '' ? (
                                      <TextField
                                        fullWidth
                                        label="Product"
                                        value={
                                          getProductDisplayName(product.productId, 'finishing') ||
                                          product.productId
                                        }
                                        InputProps={{ readOnly: true }}
                                      />
                                    ) : (
                                      <Autocomplete
                                        options={workOrderData?.productDetails?.accessories || []}
                                        getOptionLabel={(option) =>
                                          option.code?.bomId || option.code || option.name || ''
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Select Accessory"
                                            fullWidth
                                            required
                                            error={!product.productId || product.productId === ''}
                                            helperText={
                                              !product.productId || product.productId === ''
                                                ? 'Product selection is required'
                                                : ''
                                            }
                                          />
                                        )}
                                        onChange={(event, newValue) => {
                                          const newProducts = [...field.value];
                                          // Save inventoryRef instead of _id for finishing
                                          newProducts[index].productId = newValue
                                            ? newValue.code?.inventoryRef ||
                                              newValue.inventoryRef ||
                                              newValue._id
                                            : '';
                                          field.onChange(newProducts);
                                        }}
                                        disabled={isAdmin && departmentToUpdate !== 'finishing'}
                                        renderOption={(props, option) => (
                                          <li {...props}>
                                            <div>
                                              <Typography variant="body2">
                                                {option.code?.bomId || option.code || option.name}
                                              </Typography>
                                              <Typography variant="caption" color="textSecondary">
                                                Consumption: {option.consumption || 0} per piece
                                              </Typography>
                                            </div>
                                          </li>
                                        )}
                                      />
                                    )}
                                  </Box>
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <CustomTextField
                                    fullWidth
                                    label="Consumption Rate"
                                    type="number"
                                    value={getConsumptionRate(product.productId, 'finishing')}
                                    InputProps={{ readOnly: true }}
                                    helperText="Per piece"
                                  />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                  <CustomTextField
                                    fullWidth
                                    label="Total Consumption"
                                    type="number"
                                    value={calculateTotalConsumption(
                                      product.productId,
                                      'finishing',
                                    )}
                                    InputProps={{ readOnly: true }}
                                    helperText={`For ${
                                      workOrderData?.workOrderRef?.quantityToBeProduced || 0
                                    } pieces`}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <CustomTextField
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    value={product.accessoriesQuantity || ''}
                                    onChange={(e) => {
                                      const newProducts = [...field.value];
                                      newProducts[index].accessoriesQuantity = e.target.value;
                                      field.onChange(newProducts);
                                    }}
                                    disabled={isAdmin && departmentToUpdate !== 'finishing'}
                                    error={
                                      !!errors.finishing?.products?.[index]?.accessoriesQuantity
                                    }
                                    helperText={
                                      errors.finishing?.products?.[index]?.accessoriesQuantity
                                        ?.message
                                    }
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  md={1}
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  {index > 0 && (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      size="small"
                                      onClick={() => {
                                        const newProducts = field.value.filter(
                                          (_, i) => i !== index,
                                        );
                                        field.onChange(newProducts);
                                      }}
                                      disabled={isAdmin && departmentToUpdate !== 'finishing'}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </Grid>
                              </Grid>
                            ))}
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                field.onChange([
                                  ...field.value,
                                  { productId: '', accessoriesQuantity: '' },
                                ]);
                              }}
                              disabled={isAdmin && departmentToUpdate !== 'finishing'}
                              sx={{ mt: 1 }}
                            >
                              Add Accessory
                            </Button>
                          </>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting || (isAdmin && !departmentToUpdate)}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};

export default WorkorderDepartmentDetails;
