'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { storeWorkOrderData, getLastCreatedWorkOrder } from '@/api/workorder.api';
import { getSrsJobCardById } from '@/api/srsjobcard.api';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { fetchProductImagesBySkuCode, fetchProducableBySku } from '@/api/productmaster.api';
import { getStockDetailsBySkuCode } from '@/api/stock.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Spinner from '@/components/common/spinner/Spinner';

const CreateSrsWorkOrder = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const { jobCardId } = useParams();
  const [jobCard, setJobCard] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [producableBreakdown, setProducableBreakdown] = useState([]);
  const [totalProducable, setTotalProducable] = useState(null);
  const [loading, setLoading] = useState(true); // Set to true initially to show spinner
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastWorkOrder, setLastWorkOrder] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [workOrderId, setWorkOrderId] = useState('');
  const [showLotModal, setShowLotModal] = useState(false);
  const printRef = useRef();
  const dateObj = new Date();
  const dateToday = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${dateObj.getDate().toString().padStart(2, '0')}`;

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    setError,
    watch,
    reset, // Added reset here
  } = useForm({
    defaultValues: {
      startDate: dateToday,
      jobCardNo: '',
      purpose: '',
      expectedCompletionDate: '',
      productionInstruction: '',
      assignedDepartments: [],
      status: 'pending',
      remarks: '',
      departmentNotes: '',
      sizeSpecification: {
        xs: 0,
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        '2xl': 0,
        '3xl': 0,
        '4xl': 0,
        '5xl': 0,
      },
      quantityToBeProduced: 0,
      productId: '',
    },
  });

  // Helper function to fetch product-related data and prepare form values
  const fetchProductDetailsAndPrepareForm = useCallback(async (product) => {
    try {
      // Fetch product images
      const imageUrls = await fetchProductImagesBySkuCode(product.skuCode);
      setProductImages(imageUrls);
      // Fetch producable breakdown
      const producableData = await fetchProducableBySku(product.skuCode);
      setProducableBreakdown(producableData.breakdown || []);
      setTotalProducable(producableData.totalProducable ?? null);

      const sizeSpec = product.sizeSpecification || {};
      const newSizeSpecification = {
        xs: Number(sizeSpec.xs) || 0,
        s: Number(sizeSpec.s) || 0,
        m: Number(sizeSpec.m) || 0,
        l: Number(sizeSpec.l) || 0,
        xl: Number(sizeSpec.xl) || 0,
        '2xl': Number(sizeSpec['2xl']) || 0,
        '3xl': Number(sizeSpec['3xl']) || 0,
        '4xl': Number(sizeSpec['4xl']) || 0,
        '5xl': Number(sizeSpec['5xl']) || 0,
      };
      const totalQuantity = Number(sizeSpec.total) || 0;

      return { newSizeSpecification, totalQuantity };
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Failed to fetch product details');
      return {
        newSizeSpecification: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          '2xl': 0,
          '3xl': 0,
          '4xl': 0,
          '5xl': 0,
        },
        totalQuantity: 0,
      };
    }
  }, []);

  // Fetch job card data and initialize form
  const fetchJobCard = useCallback(async () => {
    if (!jobCardId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await getSrsJobCardById(jobCardId);
      console.log('🚀 ~ fetchJobCard ~ response:', response);
      const fetchedJobCard = response;
      setJobCard(fetchedJobCard);

      let initialProduct = null;
      if (fetchedJobCard && fetchedJobCard.products && fetchedJobCard.products.length > 0) {
        initialProduct = fetchedJobCard.products[0];
        setSelectedProduct(initialProduct);
        console.log('🚀 ~ CreateSrsWorkOrder ~ initialProduct:', initialProduct);
        setSelectedProductIndex(0);
      }

      let productFormDetails = {
        newSizeSpecification: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          '2xl': 0,
          '3xl': 0,
          '4xl': 0,
          '5xl': 0,
        },
        totalQuantity: 0,
      };
      if (initialProduct) {
        productFormDetails = await fetchProductDetailsAndPrepareForm(initialProduct);
      }

      // Determine next work order ID
      let nextWorkOrderId = '';
      try {
        const lastWorkOrderData = await getLastCreatedWorkOrder(jobCardId);
        console.log('🚀 ~ fetchJobCard ~ lastWorkOrderData:', lastWorkOrderData);
        const lastWorkOrder = lastWorkOrderData?.data;
        setLastWorkOrder(lastWorkOrder);
        const nextWorkOrderNumber = Number(lastWorkOrder?.workOrderNumber || 0) + 1;
        nextWorkOrderId = `${fetchedJobCard.jobCardNo}-W${String(nextWorkOrderNumber).padStart(
          2,
          '0',
        )}`;
      } catch (error) {
        // Fallback: start with W01 if unable to fetch last work order
        nextWorkOrderId = `${fetchedJobCard.jobCardNo}-W01`;
        console.error('❌ Error fetching last work order or setting workOrderId:', error);
      }
      setWorkOrderId(nextWorkOrderId);

      // Reset the form with all initial values
      reset({
        startDate: dateToday,
        jobCardNo: fetchedJobCard.jobCardNo,
        purpose: '', // Assuming these are empty initially, adjust if they should come from jobCard
        expectedCompletionDate: '', // Assuming empty, adjust if from jobCard
        productionInstruction: '', // Assuming empty, adjust if from jobCard
        assignedDepartments: [], // Assuming empty, adjust if from jobCard
        status: 'pending', // Assuming default, adjust if from jobCard
        remarks: '', // Assuming empty, adjust if from jobCard
        departmentNotes: '', // Assuming empty, adjust if from jobCard
        sizeSpecification: productFormDetails.newSizeSpecification,
        quantityToBeProduced: productFormDetails.totalQuantity,
        productId: initialProduct ? initialProduct.skuCode || initialProduct.id : '', // Use _id or id as productId
      });
    } catch (error) {
      console.error('Error fetching job card:', error);
      toast.error('Failed to fetch job card details');
    } finally {
      setLoading(false);
    }
  }, [jobCardId, reset, dateToday, fetchProductDetailsAndPrepareForm]);

  useEffect(() => {
    fetchJobCard();
  }, [fetchJobCard]);

  const sizeKeys = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const sizeValues = watch(sizeKeys.map((size) => `sizeSpecification.${size}`));
  const totalQuantity =
    sizeValues?.map((v) => Number(v) || 0).reduce((acc, curr) => acc + curr, 0) || 0;

  useEffect(() => {
    setValue('quantityToBeProduced', totalQuantity);
  }, [totalQuantity, setValue]);

  // Handle product selection change
  const handleProductChange = useCallback(
    async (productIndex) => {
      if (!jobCard || !jobCard.products || !jobCard.products[productIndex]) return;
      const product = jobCard.products[productIndex];
      console.log('🚀 ~ handleProductChange ~ product:', product);
      setSelectedProduct(product);
      setSelectedProductIndex(productIndex);
      const productFormDetails = await fetchProductDetailsAndPrepareForm(product);
      // Update only the product-specific fields in the form
      setValue('productId', product.skuCode || product.id); // Use _id or id as productId
      setValue('sizeSpecification', productFormDetails.newSizeSpecification);
      setValue('quantityToBeProduced', productFormDetails.totalQuantity);
    },
    [jobCard, setValue, fetchProductDetailsAndPrepareForm],
  );

  const onSubmit = async (data) => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }
    setIsSubmitting(true);
    // Create clean form data with only allowed fields
    const formData = {
      startDate: data.startDate,
      jobCardNo: data.jobCardNo,
      purpose: data.purpose,
      expectedCompletionDate: data.expectedCompletionDate,
      productionInstruction: data.productionInstruction,
      assignedDepartments: data.assignedDepartments,
      status: data.status,
      remarks: data.remarks,
      departmentNotes: data.departmentNotes,
      sizeSpecification: data.sizeSpecification,
      quantityToBeProduced: data.quantityToBeProduced,
      jobCardRef: jobCardId,
      productId: data.productId, // Use the productId field
    };
    console.log('🚀 ~ onSubmit ~ formData:', formData);
    try {
      const response = await storeWorkOrderData(formData);
      if (response) {
        toast.success('SRS Work order created successfully');
        navigate(`/${userType}/srs-jobcard/workorder/view/${jobCardId}`, {
          state: { jobCard: jobCard },
        });
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error);
      console.log('Error:', error.message);
      if (error.data) {
        error.data.map((err) => {
          setError(err.field, { type: 'manual', message: err.message });
        });
      }
      toast.error('Failed to create work order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>SRS Work Order</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .MuiGrid-item { padding: 1rem; border: 2px solid black; }
            .MuiTypography-h5 { text-align: center; font-weight: bold; }
            .MuiTypography-subtitle2 { color: #6b7280; }
            .MuiTypography-body1 { font-weight: bold; }
            .MuiCard-root { margin-bottom: 1.5rem; }
            .MuiCardContent-root { padding: 1rem; }
            .MuiFormControl-root { margin-bottom: 1rem; }
            .MuiInputBase-root { width: 100%; }
            .MuiInputLabel-root { margin-bottom: 0.5rem; }
            .MuiStack-root { gap: 1rem; }
            .MuiChip-root { font-weight: bold; }
            .MuiButton-root { margin-left: 0.5rem; }
            .MuiFormHelperText-root { color: #ef4444; }
            .MuiInputBase-input[readonly] { background-color: #f0f0f0; }
            .MuiInputBase-input[disabled] { background-color: #f0f0f0; }
            .print-section-title { color: #1e40af; font-weight: bold; margin-bottom: 1rem; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleBack = () => {
    navigate(`/${userType}/srs-jobcard`);
  };

  if (loading) {
    return (
      <PageContainer title="Create SRS Work Order" description="Create a new SRS work order">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Spinner />
        </Box>
      </PageContainer>
    );
  }

  if (!jobCard) {
    return (
      <PageContainer title="Create SRS Work Order" description="Create a new SRS work order">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="error">
            Job card not found
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Create SRS Work Order" description="Create a new SRS work order">
      <ParentCard title="SAMURAI EXPORTS PRIVATE LIMITED - SRS WORK ORDER">
        <Button
          onClick={handlePrint}
          sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 1 }}
        >
          Print
        </Button>

        {/* Job Card Information */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: 'primary.main', fontWeight: 'bold' }}
            >
              📋 Job Card Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Job Card No
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {jobCard.jobCardNo}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Customer
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {jobCard.customerName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Products
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {jobCard.products?.length || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Chip
                  label={jobCard.status?.replace('_', ' ')}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container ref={printRef}>
            {/* Row 1 */}
            <Grid item xs={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Stack>
                <CustomTextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('startDate')}
                  onChange={(e) => setValue('startDate', e.target.value)}
                  {...register('startDate')}
                />
                <Typography variant="h5" textAlign="center">
                  Start Date
                </Typography>
              </Stack>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                borderTop: '2px solid black',
                borderBottom: '2px solid black',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" textAlign="center">
                SRS WORK ORDER
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Stack>
                <Typography variant="h5" textAlign="center">
                  Work Order ID
                </Typography>
                <CustomTextField
                  id="workOrderId"
                  name="workOrderId"
                  label="Work Order ID"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  value={workOrderId}
                  helperText="This will be auto-generated"
                />
              </Stack>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={6} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Stack spacing={2}>
                <CustomTextField
                  id="jobCardNo"
                  name="jobCardNo"
                  label="Job Card No"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('jobCardNo')}
                  InputProps={{
                    readOnly: true,
                  }}
                  {...register('jobCardNo', { required: 'Job Card No is required' })}
                  error={!!errors.jobCardNo}
                  helperText={errors.jobCardNo?.message}
                />
                <CustomTextField
                  id="purpose"
                  name="purpose"
                  label="Purpose"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('purpose')}
                  onChange={(e) => setValue('purpose', e.target.value)}
                  {...register('purpose')}
                  error={!!errors.purpose}
                  helperText={errors.purpose?.message}
                />
                <CustomTextField
                  id="expectedCompletionDate"
                  name="expectedCompletionDate"
                  label="Expected Completion Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('expectedCompletionDate')}
                  onChange={(e) => setValue('expectedCompletionDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                  {...register('expectedCompletionDate')}
                  error={!!errors.expectedCompletionDate}
                  helperText={errors.expectedCompletionDate?.message}
                />
              </Stack>
            </Grid>
            <Grid item xs={6} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Stack spacing={2}>
                <CustomTextField
                  id="productionInstruction"
                  name="productionInstruction"
                  label="Production Instructions"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('productionInstruction')}
                  onChange={(e) => setValue('productionInstruction', e.target.value)}
                  {...register('productionInstruction')}
                  error={!!errors.productionInstruction}
                  helperText={errors.productionInstruction?.message}
                />
                <FormControl fullWidth size="small">
                  <InputLabel id="assigned-departments-label">Assigned Departments</InputLabel>
                  <Controller
                    name="assignedDepartments"
                    control={control}
                    render={({ field: { onChange, value = [], ...restField } }) => (
                      <Select
                        {...restField}
                        value={value}
                        onChange={(e) => {
                          let selected = e.target.value;
                          const includesCutting = selected.includes('cutting');
                          const prevIncludesCutting = value.includes('cutting');
                          if (includesCutting && !prevIncludesCutting) {
                            selected = Array.from(new Set([...selected, 'bitchecking']));
                          } else if (!includesCutting && prevIncludesCutting) {
                            selected = selected.filter((item) => item !== 'bitchecking');
                          }
                          onChange(selected);
                        }}
                        multiple
                        size="small"
                        labelId="assigned-departments-label"
                        label="Assigned Departments"
                      >
                        <MenuItem value="fabric">Fabric</MenuItem>
                        <MenuItem value="cutting">Cutting</MenuItem>
                        <MenuItem value="bitchecking" disabled>
                          Bitchecking
                        </MenuItem>
                        <MenuItem value="accessories">Accessories</MenuItem>
                        <MenuItem value="trims">Trims</MenuItem>
                        <MenuItem value="printing&fusing">Printing & Fusing</MenuItem>
                        <MenuItem value="embroidery">Embroidery</MenuItem>
                        <MenuItem value="operationpart">Operation Part</MenuItem>
                        <MenuItem value="stitching">Stitching</MenuItem>
                        <MenuItem value="finishing">Finishing</MenuItem>
                        <MenuItem value="fqi">FQI</MenuItem>
                        <MenuItem value="audit">Audit</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Status</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId="status-label" label="Status" size="small">
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="on_hold">On Hold</MenuItem>
                        <MenuItem value="approval_required">Approval Required</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <CustomTextField
                  id="remarks"
                  name="remarks"
                  label="Remarks"
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('remarks')}
                  onChange={(e) => setValue('remarks', e.target.value)}
                  {...register('remarks')}
                  error={!!errors.remarks}
                  helperText={errors.remarks?.message}
                />
                <CustomTextField
                  id="departmentNotes"
                  name="departmentNotes"
                  label="Department Notes"
                  multiline
                  rows={2}
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('departmentNotes')}
                  onChange={(e) => setValue('departmentNotes', e.target.value)}
                  {...register('departmentNotes')}
                  error={!!errors.departmentNotes}
                  helperText={errors.departmentNotes?.message}
                />
              </Stack>
            </Grid>

            {/* Product Selection */}
            <Grid item xs={12} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                🎯 Product Selection
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Product</InputLabel>
                <Select
                  value={selectedProductIndex}
                  onChange={(e) => handleProductChange(e.target.value)}
                  label="Select Product"
                >
                  {jobCard.products?.map((product, index) => (
                    <MenuItem key={index} value={index}>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {product.skuCode} - {product.product}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Quantity:{' '}
                          {product.sizeSpecification.totalz || product.sizeSpecification.total}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Color: {product.bodyColor || 'N/A'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedProduct && (
                <Card sx={{ background: '#f8f9fa', mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Selected Product Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          SKU Code
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProduct.skuCode}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Product Name
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProduct.product}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Total Quantity
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProduct.sizeSpecification?.total || 0}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Color
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {selectedProduct.bodyColor || 'N/A'}
                        </Typography>
                      </Grid>
                      {/* New Grid item for product images */}
                      <Grid item xs={12}>
                        {productImages.length > 0 ? (
                          <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, mt: 2, pb: 1 }}>
                            {productImages.map((image, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  flexShrink: 0,
                                  width: 100,
                                  height: 100,
                                  border: '1px solid #e0e0e0',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <img
                                  src={image || '/placeholder.svg'}
                                  alt={`Product image ${idx + 1}`}
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                  }}
                                />
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                            No images available for this product.
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    {/* Producable Breakdown */}
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Size Specification */}
            <Grid item xs={12} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: 'primary.main', fontWeight: 'bold' }}
              >
                📏 Size Specification
              </Typography>
              <Grid container spacing={2}>
                {sizeKeys.map((size) => (
                  <Grid item xs={4} key={size}>
                    <CustomTextField
                      id={`sizeSpecification.${size}`}
                      name={`sizeSpecification.${size}`}
                      label={size.toUpperCase()}
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={watch('sizeSpecification')[size]}
                      onChange={(e) =>
                        setValue(`sizeSpecification.${size}`, Number.parseInt(e.target.value) || 0)
                      }
                      {...register(`sizeSpecification.${size}`, {
                        min: { value: 0, message: 'Quantity cannot be negative' },
                      })}
                      error={!!errors.sizeSpecification?.[size]}
                      helperText={errors.sizeSpecification?.[size]?.message}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Quantity Summary */}
            <Grid item xs={12} sx={{ border: '2px solid black', padding: '1rem' }}>
              <CustomTextField
                id="quantityToBeProduced"
                name="quantityToBeProduced"
                label="Total Quantity to be Produced"
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ marginBottom: '1rem', mt: '2rem' }}
                value={watch('quantityToBeProduced')}
                InputProps={{ readOnly: true }}
                {...register('quantityToBeProduced', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                })}
                error={!!errors.quantityToBeProduced}
                helperText={errors.quantityToBeProduced?.message}
                disabled
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={3}>
            <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary">
              Create SRS Work Order
            </LoadingButton>
            <Button type="button" variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </Stack>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateSrsWorkOrder;
