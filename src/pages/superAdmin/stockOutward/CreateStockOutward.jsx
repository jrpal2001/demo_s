'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Card,
  CardContent,
  IconButton,
  Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { createStockOutward } from '@/api/stockOutward.api';
import { getAllLotNoForSkuCode } from '@/api/stockInward.api';
import styled from '@mui/material/styles/styled';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateStockOutward = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { jobCardId } = useParams();
  const location = useLocation();
  const jobCardData = location.state?.rowData;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lotNumberData, setLotNumberData] = useState([]);
  const [lotSearchParams, setLotSearchParams] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  
  const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      dispatchId: '',
      jobCardRef: jobCardData?._id || jobCardId || '',
      dispatchDate: new Date().toISOString().split('T')[0],
      dispatchTo: jobCardData?.clientName || '',
      productDescription: '',
      skuCode: jobCardData?.skuCode || '',
      quantityDispatched: 0,
      quantityOrdered: jobCardData?.quantity || 0,
      quantityShipped: 0,
      uom: 'pcs',
      hsnCode: '',
      ewayBillNo: '',
      deliveryChallan: '',
      dispatchMethod: '',
      dispatchAddress: jobCardData?.deliveryAddress || '',
      deliveryDate: '',
      dispatchStatus: 'Pending',
      transportDetails: '',
      dispatchApprovedBy: '',
      remarks: '',
      invoiceOrDocumentRef: '',
      paymentDetails: '',
      packagingDetails: '',
      receiptConfirmation: false,
      lotSpecifications: [
        {
          lotNumber: '',
          sizeSpecifications: SIZES.reduce((acc, size) => {
            acc[size] = 0;
            return acc;
          }, {}),
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lotSpecifications',
  });

  // Calculate total dispatched quantity based on all lot size specifications
  const calculateTotalQuantity = () => {
    const lotSpecifications = watch('lotSpecifications');
    return lotSpecifications.reduce((total, lot) => {
      return (
        total +
        SIZES.reduce((lotTotal, size) => {
          return lotTotal + (Number.parseInt(lot.sizeSpecifications[size]) || 0);
        }, 0)
      );
    }, 0);
  };

  // Get already selected lot numbers to exclude from dropdown
  const getSelectedLotNumbers = () => {
    const lotSpecifications = watch('lotSpecifications');
    return lotSpecifications.map((lot) => lot.lotNumber).filter(Boolean);
  };

  // Get available lot numbers (excluding already selected ones)
  const getAvailableLotNumbers = () => {
    const selectedLots = getSelectedLotNumbers();
    return lotNumberData.filter((lot) => !selectedLots.includes(lot.lotNo));
  };

  // Get the lot data for a specific lot number
  const getLotData = (lotNumber) => {
    return lotNumberData.find((lot) => lot.lotNo === lotNumber);
  };

  // Get available quantity for a specific size in a lot
  const getAvailableQuantity = (lotNumber, size) => {
    const lotData = getLotData(lotNumber);
    return lotData && lotData.sizeWiseQty ? lotData.sizeWiseQty[size] || 0 : 0;
  };

  // Check if quantity exceeds available quantity
  const isQuantityExceeded = (lotNumber, size, quantity) => {
    const availableQty = getAvailableQuantity(lotNumber, size);
    return quantity > availableQty;
  };

  // Get border color based on quantity validation
  const getBorderColor = (lotNumber, size, quantity) => {
    if (!lotNumber || quantity === 0) return 'initial';
    return isQuantityExceeded(lotNumber, size, quantity) ? 'red' : 'green';
  };

  const fetchLotNumbers = async (skuCode, searchParams = '') => {
    if (!skuCode || skuCode.trim() === '') {
      setLotNumberData([]);
      return;
    }

    try {
      const response = await getAllLotNoForSkuCode(skuCode, 20, searchParams);
      if (response && response.data && response.data.lots) {
        setLotNumberData(response.data.lots);
      } else {
        setLotNumberData([]);
      }
    } catch (error) {
      console.error('Error fetching lot numbers:', error);
      setLotNumberData([]);
    }
  };

  const handleAddLot = () => {
    append({
      lotNumber: '',
      sizeSpecifications: SIZES.reduce((acc, size) => {
        acc[size] = 0;
        return acc;
      }, {}),
    });
  };

  const handleRemoveLot = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Validate all quantities against available stock
  const validateQuantities = () => {
    const lotSpecifications = watch('lotSpecifications');
    const errors = [];

    lotSpecifications.forEach((lot, lotIndex) => {
      if (lot.lotNumber) {
        SIZES.forEach((size) => {
          const quantity = Number.parseInt(lot.sizeSpecifications[size]) || 0;
          if (isQuantityExceeded(lot.lotNumber, size, quantity)) {
            errors.push(
              `Lot ${
                lotIndex + 1
              }: Size ${size.toUpperCase()} quantity (${quantity}) exceeds available stock (${getAvailableQuantity(
                lot.lotNumber,
                size,
              )})`,
            );
          }
        });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Update dispatched quantity when lot specifications change
  useEffect(() => {
    const totalQty = calculateTotalQuantity();
    setValue('quantityDispatched', totalQty);
    validateQuantities();
  }, [watch('lotSpecifications')]);

  // Fetch lot numbers when SKU code changes
  useEffect(() => {
    const currentSkuCode = watch('skuCode');
    if (currentSkuCode) {
      fetchLotNumbers(currentSkuCode, lotSearchParams);
    }
  }, [watch('skuCode'), lotSearchParams]);

  const onSubmit = async (data) => {
    // Validate quantities before submission
    if (!validateQuantities()) {
      toast.error('Cannot submit: Some quantities exceed available stock');
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate that all lots have lot numbers
      const hasEmptyLots = data.lotSpecifications.some((lot) => !lot.lotNumber);
      if (hasEmptyLots) {
        toast.error('Please select lot numbers for all lots');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for submission
      const stockOutwardData = {
        ...data,
        quantityDispatched: Number.parseInt(data.quantityDispatched),
        quantityOrdered: Number.parseInt(data.quantityOrdered),
        quantityShipped: Number.parseInt(data.quantityShipped),
        dispatchDate: data.dispatchDate ? new Date(data.dispatchDate) : new Date(),
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        // Transform lot specifications
        lotSpecifications: data.lotSpecifications.map((lot) => ({
          lotNumber: lot.lotNumber,
          sizeSpecifications: SIZES.reduce((acc, size) => {
            acc[size] = Number.parseInt(lot.sizeSpecifications[size]) || 0;
            return acc;
          }, {}),
        })),
      };

      const response = await createStockOutward(stockOutwardData);
      if (response) {
        toast.success('Stock outward created successfully');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error creating stock outward:', error);
      toast.error(error.message || 'Failed to create stock outward');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/stockoutward`, title: 'Stock Outward' },
    { title: 'Create' },
  ];

  const StyledTextField = styled(TextField)(({ theme, borderColor }) => ({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: borderColor,
        borderWidth: borderColor === 'red' ? 2 : 1,
      },
      '&:hover fieldset': {
        borderColor: borderColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: borderColor,
      },
    },
  }));

  return (
    <PageContainer title="Create Stock Outward" description="Create a new stock outward entry">
      <Breadcrumb title="Create Stock Outward" items={BCrumb} />
      <ParentCard title="Stock Outward Entry Form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Work Order Id : {jobCardData?.workOrderId?.workOrderId}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Job Card No : {jobCardData?.workOrderId?.jobCardNo}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="dispatchId"
                label="Dispatch ID"
                variant="outlined"
                fullWidth
                {...register('dispatchId', { required: 'Dispatch ID is required' })}
                error={!!errors.dispatchId}
                helperText={errors.dispatchId?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="jobCardRef"
                label="Job Card Reference"
                variant="outlined"
                fullWidth
                {...register('jobCardRef', { required: 'Job Card Reference is required' })}
                error={!!errors.jobCardRef}
                helperText={errors.jobCardRef?.message}
                InputProps={{
                  readOnly: !!jobCardId,
                }}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="dispatchDate"
                label="Dispatch Date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dispatchDate', { required: 'Dispatch Date is required' })}
                error={!!errors.dispatchDate}
                helperText={errors.dispatchDate?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="dispatchTo"
                label="Dispatch To"
                variant="outlined"
                fullWidth
                {...register('dispatchTo', { required: 'Dispatch To is required' })}
                error={!!errors.dispatchTo}
                helperText={errors.dispatchTo?.message}
              />
            </Grid>

            {/* Product Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="skuCode"
                label="SKU Code"
                variant="outlined"
                fullWidth
                {...register('skuCode', { required: 'SKU Code is required' })}
                error={!!errors.skuCode}
                helperText={errors.skuCode?.message}
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="productDescription"
                label="Product Description"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                {...register('productDescription')}
              />
            </Grid>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">Validation Errors:</Typography>
                  <ul style={{ margin: 0, paddingLeft: '1rem' }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Alert>
              </Grid>
            )}

            {/* Lot Specifications */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Lot-wise Dispatch Specifications</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddLot}
                >
                  Add Lot
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {fields.map((field, lotIndex) => {
                const lotNumber = watch(`lotSpecifications.${lotIndex}.lotNumber`);
                const lotData = getLotData(lotNumber);

                return (
                  <Card key={field.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1">Lot {lotIndex + 1}</Typography>
                        {fields.length > 1 && (
                          <IconButton color="error" onClick={() => handleRemoveLot(lotIndex)}>
                            <RemoveIcon />
                          </IconButton>
                        )}
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Controller
                            name={`lotSpecifications.${lotIndex}.lotNumber`}
                            control={control}
                            rules={{ required: 'Lot number is required' }}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                {...field}
                                options={getAvailableLotNumbers()}
                                getOptionLabel={(option) => option?.lotNo || ''}
                                value={
                                  lotNumberData.find((item) => item.lotNo === field.value) || null
                                }
                                onChange={(event, newValue) => {
                                  field.onChange(newValue?.lotNo || '');
                                  // Reset size specifications when lot changes
                                  if (newValue?.lotNo) {
                                    SIZES.forEach((size) => {
                                      setValue(
                                        `lotSpecifications.${lotIndex}.sizeSpecifications.${size}`,
                                        0,
                                      );
                                    });
                                  }
                                }}
                                onInputChange={(event, newInputValue) => {
                                  setLotSearchParams(newInputValue);
                                }}
                                renderInput={(params) => (
                                  <CustomTextField
                                    {...params}
                                    label="Lot Number"
                                    placeholder="Search lot numbers..."
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                  />
                                )}
                                noOptionsText={
                                  watch('skuCode')
                                    ? 'No available lot numbers'
                                    : 'Enter SKU code first'
                                }
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      {lotData && (
                        <Box sx={{ mt: 2, mb: 1 }}>
                          <Typography variant="subtitle2" color="primary">
                            Lot Details: {lotData.lotNo}
                          </Typography>
                          <Typography variant="body2">
                            Total Received: {lotData.receivedQuantity} | Created:{' '}
                            {new Date(lotData.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Size Specifications
                      </Typography>

                      <Grid container spacing={1}>
                        {SIZES.map((size, sizeIndex) => {
                          const availableQty = getAvailableQuantity(lotNumber, size);
                          const currentQty =
                            watch(`lotSpecifications.${lotIndex}.sizeSpecifications.${size}`) || 0;
                          const borderColor = getBorderColor(lotNumber, size, currentQty);

                          return (
                            <Grid item xs={4} sm={3} md={2} key={size}>
                              {lotNumber && (
                                <Typography variant="caption" display="block" gutterBottom>
                                  Available: {availableQty}
                                </Typography>
                              )}
                              <Controller
                                name={`lotSpecifications.${lotIndex}.sizeSpecifications.${size}`}
                                control={control}
                                render={({ field }) => (
                                  <StyledTextField
                                    {...field}
                                    label={size.toUpperCase()}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    inputProps={{
                                      min: 0,
                                      max: availableQty,
                                    }}
                                    onChange={(e) => {
                                      const value = Number.parseInt(e.target.value) || 0;
                                      // Limit the value to available quantity
                                      const limitedValue = Math.min(value, availableQty);
                                      field.onChange(limitedValue);
                                    }}
                                    borderColor={borderColor}
                                    error={borderColor === 'red'}
                                    helperText={borderColor === 'red' ? `Max: ${availableQty}` : ''}
                                  />
                                )}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Grid>

            {/* Quantity Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Quantity Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="quantityOrdered"
                label="Quantity Ordered"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('quantityOrdered')}
                error={!!errors.quantityOrdered}
                helperText={errors.quantityOrdered?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="quantityDispatched"
                label="Quantity Dispatched (Auto-calculated)"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('quantityDispatched', { required: 'Quantity Dispatched is required' })}
                error={!!errors.quantityDispatched}
                helperText={errors.quantityDispatched?.message}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="quantityShipped"
                label="Quantity Shipped"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('quantityShipped')}
                error={!!errors.quantityShipped}
                helperText={errors.quantityShipped?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="uom-label">Unit of Measure</InputLabel>
                <Controller
                  name="uom"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} labelId="uom-label" label="Unit of Measure">
                      <MenuItem value="pcs">Pieces (pcs)</MenuItem>
                      <MenuItem value="kg">Kilograms (kg)</MenuItem>
                      <MenuItem value="g">Grams (g)</MenuItem>
                      <MenuItem value="m">Meters (m)</MenuItem>
                      <MenuItem value="cm">Centimeters (cm)</MenuItem>
                      <MenuItem value="l">Liters (l)</MenuItem>
                      <MenuItem value="ml">Milliliters (ml)</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Document Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Document Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="hsnCode"
                label="HSN Code"
                variant="outlined"
                fullWidth
                {...register('hsnCode')}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="ewayBillNo"
                label="E-way Bill Number"
                variant="outlined"
                fullWidth
                {...register('ewayBillNo')}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="deliveryChallan"
                label="Delivery Challan"
                variant="outlined"
                fullWidth
                {...register('deliveryChallan')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="invoiceOrDocumentRef"
                label="Invoice/Document Reference"
                variant="outlined"
                fullWidth
                {...register('invoiceOrDocumentRef')}
              />
            </Grid>

            {/* Dispatch Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Dispatch Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="dispatchMethod"
                label="Dispatch Method"
                variant="outlined"
                fullWidth
                {...register('dispatchMethod')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="dispatchAddress"
                label="Dispatch Address"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                {...register('dispatchAddress', { required: 'Dispatch Address is required' })}
                error={!!errors.dispatchAddress}
                helperText={errors.dispatchAddress?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="deliveryDate"
                label="Expected Delivery Date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('deliveryDate')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="dispatch-status-label">Dispatch Status</InputLabel>
                <Controller
                  name="dispatchStatus"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} labelId="dispatch-status-label" label="Dispatch Status">
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Dispatched">Dispatched</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="transportDetails"
                label="Transport Details"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                {...register('transportDetails')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="packagingDetails"
                label="Packaging Details"
                variant="outlined"
                fullWidth
                multiline
                rows={2}
                {...register('packagingDetails')}
              />
            </Grid>

            {/* Additional Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="dispatchApprovedBy"
                label="Dispatch Approved By"
                variant="outlined"
                fullWidth
                {...register('dispatchApprovedBy')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="paymentDetails"
                label="Payment Details"
                variant="outlined"
                fullWidth
                {...register('paymentDetails')}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                id="remarks"
                label="Remarks"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                {...register('remarks')}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name="receiptConfirmation"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Typography variant="subtitle1" gutterBottom>
                        Receipt Confirmation
                      </Typography>
                      <Select {...field} fullWidth displayEmpty>
                        <MenuItem value={false}>No</MenuItem>
                        <MenuItem value={true}>Yes</MenuItem>
                      </Select>
                    </div>
                  )}
                />
              </FormControl>
            </Grid>

            {/* Submit Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
                <LoadingButton
                  loading={isSubmitting}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={validationErrors.length > 0}
                >
                  Create Stock Outward
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateStockOutward;
