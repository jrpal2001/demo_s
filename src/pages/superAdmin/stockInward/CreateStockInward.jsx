'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { createStockInward } from '@/api/stockInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateStockInward = () => {
    const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { workOrderId } = useParams();
  const location = useLocation();
  const workOrderData = location.state?.rowData;
  console.log('🚀 ~ CreateStockInward ~ workOrderData:', workOrderData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState('');

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      workOrderId: workOrderData?.workOrderRef?._id || '',
      skuCode: workOrderData?.skuCode || '',
      jobCardId: workOrderData?.jobCardRef || '',
      productDescription: '',
      sizeWiseQty: SIZES.map((size) => ({
        size,
        quantity: workOrderData[size] || 0,
      })),
      receivedQuantity: 0,
      shortageQuantity: 0,
      excessQuantity: 0,
      lotNo: '',
      invoice: {
        number: '',
        date: new Date().toISOString().split('T')[0],
      },
      microQty: 0,
      minorQty: 0,
      majorQty: 0,
      receivedBy: '',
      approvedBy: '',
      remarks: '',
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'sizeWiseQty',
  });

  // Calculate total received quantity based on size-wise quantities
  const calculateTotalQuantity = () => {
    const sizeWiseQty = watch('sizeWiseQty');
    return sizeWiseQty.reduce((total, item) => total + (Number.parseInt(item.quantity) || 0), 0);
  };

  // Update received quantity when size-wise quantities change
  useEffect(() => {
    const totalQty = calculateTotalQuantity();
    setValue('receivedQuantity', totalQty);
  }, [watch('sizeWiseQty')]);

  // Handle file change for product image
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // setSelectedFile(file); // This line was removed as per the edit hint
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Set empty URL for product image for now
      const productImageUrl = '';

      // Prepare data for submission
      const stockInwardData = {
        ...data,
        productImage: productImageUrl || data.productImage,
        // Convert string quantities to numbers
        receivedQuantity: Number.parseInt(data.receivedQuantity),
        shortageQuantity: Number.parseInt(data.shortageQuantity),
        excessQuantity: Number.parseInt(data.excessQuantity),
        microQty: Number.parseInt(data.microQty),
        minorQty: Number.parseInt(data.minorQty),
        majorQty: Number.parseInt(data.majorQty),
        // Transform sizeWiseQty from array to object format as expected by the validation schema
        sizeWiseQty: data.sizeWiseQty.reduce((acc, item) => {
          acc[item.size] = Number.parseInt(item.quantity) || 0;
          return acc;
        }, {}),
      };

      const response = await createStockInward(stockInwardData);
      if (response) {
        toast.success('Stock inward created successfully');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error creating stock inward:', error);
      toast.error(error.message || 'Failed to create stock inward');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/stockinward`, title: 'Stock Inward' },
    { title: 'Create' },
  ];



  return (
    <PageContainer title="Create Stock Inward" description="Create a new stock inward entry">
      <Breadcrumb title="Create Stock Inward" items={BCrumb} />
      <ParentCard title="Stock Inward Entry Form">
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
                Work Order Id : {workOrderData?.workOrderRef?.workOrderId}
              </Typography>
              <CustomTextField
                id="workOrderId"
                label="Work Order Ref"
                variant="outlined"
                fullWidth
                {...register('workOrderId', { required: 'Work Order ID is required' })}
                error={!!errors.workOrderId}
                helperText={errors.workOrderId?.message}
                InputProps={{
                  readOnly: !!workOrderId,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Job Card No : {workOrderData?.workOrderRef?.jobCardNo}
              </Typography>
              <CustomTextField
                id="jobCardId"
                label="Job Card ID"
                variant="outlined"
                fullWidth
                {...register('jobCardId', { required: 'Job Card ID is required' })}
                error={!!errors.jobCardId}
                helperText={errors.jobCardId?.message}
              />
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
              />
            </Grid>

            <Grid item xs={12}>
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

            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Product Image
              </Typography>
              <input
                accept="image/*"
                id="product-image"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="product-image">
                <Button variant="outlined" component="span">
                  Upload Image
                </Button>
              </label>
              {filePreview && (
                <Box mt={2} sx={{ maxWidth: '200px' }}>
                  <img
                    src={filePreview || '/placeholder.svg'}
                    alt="Product preview"
                    style={{ width: '100%' }}
                  />
                </Box>
              )}
            </Grid>

            {/* Size-wise Quantities */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Size-wise Quantities
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Size</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Controller
                            name={`sizeWiseQty.${index}.size`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                value={field.value ? field.value.toUpperCase() : ''}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name={`sizeWiseQty.${index}.quantity`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                type="number"
                                variant="outlined"
                                fullWidth
                                inputProps={{ min: 0 }}
                              />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
                id="receivedQuantity"
                label="Received Quantity"
                variant="outlined"
                fullWidth
                type="number"
                InputProps={{ min: 0 }}
                {...register('receivedQuantity', { required: 'Received Quantity is required' })}
                error={!!errors.receivedQuantity}
                helperText={errors.receivedQuantity?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="shortageQuantity"
                label="Shortage Quantity"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('shortageQuantity')}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="excessQuantity"
                label="Excess Quantity"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('excessQuantity')}
              />
            </Grid>

            {/* Quality Control */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Quality Control
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="microQty"
                label="Micro Defects Quantity"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('microQty')}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="minorQty"
                label="Minor Defects Quantity"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('minorQty')}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="majorQty"
                label="Major Defects Quantity"
                variant="outlined"
                fullWidth
                type="number"
                inputProps={{ min: 0 }}
                {...register('majorQty')}
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
                id="lotNo"
                label="Lot Number"
                variant="outlined"
                fullWidth
                {...register('lotNo', { required: 'Lot Number is required' })}
                error={!!errors.lotNo}
                helperText={errors.lotNo?.message}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                id="invoice.number"
                label="Invoice Number"
                variant="outlined"
                fullWidth
                {...register('invoice.number')}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <CustomTextField
                id="invoice.date"
                label="Invoice Date"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('invoice.date')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="receivedBy"
                label="Received By"
                variant="outlined"
                fullWidth
                {...register('receivedBy', { required: 'Received By is required' })}
                error={!!errors.receivedBy}
                helperText={errors.receivedBy?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                id="approvedBy"
                label="Approved By"
                variant="outlined"
                fullWidth
                {...register('approvedBy')}
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
                >
                  Create Stock Inward
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateStockInward;
