'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Select,
  MenuItem,
  Button,
  Typography,
  Grid2,
  FormControl,
  InputLabel,
  Autocomplete,
} from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import ParentCard from '@/components/shared/ParentCard';
import { Stack, Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { createJobCard, fetchLastJobCardNo } from '@/api/admin';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import {
  fetchAllProductMasterSkus,
  fetchProductImagesBySkuCode,
  fetchProductMasterBySku,
} from '@/api/productmaster.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Add debounce utility function
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
};

const CreateJobCard = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/job-cards`, title: 'Job Card' },
    { title: 'Add' },
  ];
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed unused productMaster and availability state
  const [embroidery, setEmbroidery] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [lastJobCard, setlastJobCard] = useState();
  // Removed orderItems and orderDetails state
  const [dropdownValue, setDropdownValue] = useState('STK');
  // Removed unused allSkus state
  const [filteredSkus, setFilteredSkus] = useState([]);
  const printRef = useRef();
  const [isSearching, setIsSearching] = useState(false);

  const dateObj = new Date();
  const dateToday = `${dateObj.getFullYear()}-${
    dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0${dateObj.getMonth() + 1}`
  }-${dateObj.getDate() + 1 > 9 ? dateObj.getDate() + 1 : `0${dateObj.getDate() + 1}`}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobCard = async () => {
      const lastJobCardNo = await fetchLastJobCardNo();
      console.log('🚀 ~ fetchJobCard ~ lastJobCardNo:', lastJobCardNo);
      setlastJobCard(lastJobCardNo);
    };

    fetchJobCard();

    // Initialize with empty SKUs for STK mode
    if (dropdownValue === 'STK') {
      setFilteredSkus([]);
    }
  }, [dropdownValue]);

  useEffect(() => {
    if (lastJobCard) {
      // Extract prefix from lastJobCard and increment the number
      const prefix = lastJobCard.slice(0, 3); // Gets "STK", "PRD", etc.
      const number = Number.parseInt(lastJobCard.slice(-4)) + 1;
      const newJobCardNo = prefix + number.toString().padStart(4, '0');

      // Update the form field value
      setValue('jobCardNo', newJobCardNo);
    } else {
      // If no lastJobCard, use dropdown value with 0001
      setValue('jobCardNo', dropdownValue + '0001');
    }
  }, [lastJobCard, dropdownValue, setValue]);

  // Removed orderItems and orderDetails state
  const [productImages, setProductImages] = useState([]);

  // Auto-calculate total quantity based on size fields
  useEffect(() => {
    const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
    const total = sizes.reduce((sum, size) => {
      const val = Number(watch(size)) || 0;
      return sum + val;
    }, 0);
    setValue('total', total);
  }, [
    watch('xs'),
    watch('s'),
    watch('m'),
    watch('l'),
    watch('xl'),
    watch('2xl'),
    watch('3xl'),
    watch('4xl'),
    watch('5xl'),
    setValue,
  ]);

  const onSubmit = async (data) => {
    console.log('Data before submit:', data);

    console.log('Final modified data:', data);
    try {
      const response = await createJobCard(data);
      if (response) {
        toast.success('Job card added successfully');
        navigate(`/${userType}/job-cards`);
      }
    } catch (error) {
      console.log('Error:', error);
      error.data?.map((err) => {
        setError(err.field, { type: 'manual', message: err.message });
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchSkusFromAPI = async (searchTerm) => {
    setIsSearching(true);
    try {
      const skuData = await fetchAllProductMasterSkus({
        page: 1,
        limit: 50,
        search: searchTerm,
      });
      const skus = skuData?.records || [];
      setFilteredSkus(skus);
    } catch (error) {
      console.error('Error searching SKUs:', error);
      toast.error('Failed to search SKU codes');
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearchSkus = useDebounce(searchSkusFromAPI, 300);

  const handleSkuInput = (event) => {
    const sku = event.target.value.toUpperCase();
    event.target.value = sku;
    if (sku && typeof sku === 'string' && sku.length > 0) {
      debouncedSearchSkus(sku);
    } else {
      setFilteredSkus([]);
    }
  };

  // Unified handleSkuChange for all jobcard types
  const handleSkuChange = async (newValue) => {
    if (!newValue) return;
    // Always fetch product details from API for the selected SKU
    try {
      const productMasterData = await fetchProductMasterBySku(newValue);
      if (productMasterData) {
        setValue('product', productMasterData.name || '');
        setValue('description', productMasterData.description || '');
        setValue('gender', productMasterData.gender || 'male');
        setValue('bodyColor', productMasterData.color || '');
        setValue('panelColor', productMasterData.panelcolor || '');
        // Optionally set sizes if your API returns them
        setValue('2xl', productMasterData['2xl'] || 0);
        setValue('3xl', productMasterData['3xl'] || 0);
        setValue('4xl', productMasterData['4xl'] || 0);
        setValue('5xl', productMasterData['5xl'] || 0);
        setValue('s', productMasterData.s || 0);
        setValue('m', productMasterData.m || 0);
        setValue('l', productMasterData.l || 0);
        setValue('xl', productMasterData.xl || 0);
        setValue('xs', productMasterData.xs || 0);
      }
      try {
        const imageUrls = await fetchProductImagesBySkuCode(newValue);
        setProductImages(imageUrls);
      } catch (err) {
        console.error('Error fetching images:', err);
      }
    } catch (err) {
      console.error('Error fetching product master data:', err);
    }
  };

  // Removed unused capitalize function

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
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
    navigate(`/${userType}/job-cards`);
  };

  // Removed orderMaster state
  // Removed handleOrderInput and handleOrderChange

  // Get SKU options based on current mode
  const getSkuOptions = () => {
    return filteredSkus.map((product) => product.skuCode).filter(Boolean);
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <PageContainer title="Create Job Card" description="This is the Create Job Card page">
        <Breadcrumb title="Create Job Card" items={BCrumb} />
        <ParentCard title="SAMURAI EXPORTS PRIVATE LIMITED">
          <Button
            onClick={handlePrint}
            sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 1 }}
          >
            Print
          </Button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container ref={printRef}>
              {/* Row 1 */}
              <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
                <Stack>
                  <CustomTextField
                    id="date"
                    name="date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    defaultValue={dateToday}
                    {...register('date')}
                  />
                  <Typography variant="h5" textAlign="center">
                    Date
                  </Typography>
                </Stack>
              </Grid2>
              <Grid2
                size={4}
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
                  JOB CARD
                </Typography>
              </Grid2>
              <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
                <Typography>Last Created Job Card : {lastJobCard}</Typography>
                <Grid2 container spacing={1} alignItems="center">
                  <Grid2 item xs={3}>
                    <Select
                      value={dropdownValue}
                      onChange={(e) => {
                        setDropdownValue(e.target.value);
                        // Clear form fields when switching modes
                        setValue('skuCode', '');
                        setValue('product', '');
                        setValue('description', '');
                        // Removed orderItems setting as orderItems state is removed
                        // Removed orderDetails setting as orderDetails state is removed
                      }}
                      fullWidth
                      size="small"
                    >
                      <MenuItem value="STK">STK</MenuItem>
                      <MenuItem value="PRD">PRD</MenuItem>
                      <MenuItem value="SAM">SAM</MenuItem>
                      <MenuItem value="ONL">ONL</MenuItem>
                    </Select>
                  </Grid2>

                  <Grid2 item xs={9}>
                    <CustomTextField
                      id="jobCardNo"
                      name="jobCardNo"
                      variant="outlined"
                      fullWidth
                      size="small"
                      {...register('jobCardNo', {
                        required: 'select from dropdown for confirmation.',
                      })}
                      error={!!errors.jobCardNo}
                      helperText={errors.jobCardNo?.message}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid2>
                </Grid2>
                <Typography variant="h5" textAlign="center">
                  Serial Number
                  <span style={{ color: 'red' }}> * </span>
                </Typography>
              </Grid2>

              {/* Row 2 */}
              <Grid2
                size={4}
                sx={{
                  borderLeft: '2px solid black',
                  borderRight: '2px solid black',
                  borderBottom: '2px solid black',
                }}
              >
                <Grid2 container>
                  <Grid2
                    size={12}
                    sx={{
                      borderBottom: '2px solid black',
                      padding: '1rem',
                    }}
                  >
                    <CustomTextField
                      id="customerName"
                      name="customerName"
                      label={
                        <span>
                          Customer Name <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.8rem' }}
                      {...register('customerName', { required: 'Customer Name is required' })}
                      error={!!errors.customerName}
                      helperText={errors.customerName?.message}
                    />
                    <CustomTextField
                      id="customerAddress"
                      name="customerAddress"
                      label="Customer Address"
                      multiline
                      rows={6}
                      variant="outlined"
                      fullWidth
                      size="small"
                      {...register('customerAddress')}
                      error={!!errors.customerAddress}
                      helperText={errors.customerAddress?.message}
                    />
                  </Grid2>

                  {/* Removed Order ID field and logic */}

                  <Grid2 size={12} sx={{ padding: '1rem', borderBottom: '2px solid black' }}>
                    <CustomTextField
                      id="paymentTerms"
                      name="paymentTerms"
                      label="Payment Terms"
                      variant="outlined"
                      fullWidth
                      size="small"
                      {...register('paymentTerms')}
                      error={!!errors.paymentTerms}
                      helperText={errors.paymentTerms?.message}
                    />
                  </Grid2>
                  <Grid2 size={12} sx={{ padding: '1rem' }}>
                    <CustomTextField
                      id="gstin"
                      name="gstin"
                      label="GSTIN"
                      variant="outlined"
                      fullWidth
                      size="small"
                      {...register('gstin')}
                      error={!!errors.gstin}
                      helperText={errors.gstin?.message}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>

              {/* Rest of the form remains the same until Product Specification section */}
              <Grid2 size={4} sx={{ borderBottom: '2px solid black' }}>
                <Grid2 container sx={{ padding: '1rem', borderBottom: '2px solid black' }}>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="dealerOrderedBy"
                      name="dealerOrderedBy"
                      label="Ordered By"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('dealerOrderedBy')}
                      error={!!errors.dealerOrderedBy}
                      helperText={errors.dealerOrderedBy?.message}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="dealerDesignation"
                      name="dealerDesignation"
                      label="Designation"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('dealerDesignation')}
                      error={!!errors.dealerDesignation}
                      helperText={errors.dealerDesignation?.message}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="dealerMobile"
                      name="dealerMobile"
                      label="Mobile"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="tel"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('dealerMobile')}
                      error={!!errors.dealerMobile}
                      helperText={errors.dealerMobile?.message}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="dealerEmail"
                      name="dealerEmail"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="email"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('dealerEmail')}
                      error={!!errors.dealerEmail}
                      helperText={errors.dealerEmail?.message}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container sx={{ padding: '1rem' }}>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="personnelOrderedBy"
                      name="personnelOrderedBy"
                      label="Ordered By"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('personnelOrderedBy')}
                      error={!!errors.personnelOrderedBy}
                      helperText={errors.personnelOrderedBy?.message}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="personnelDesignation"
                      name="personnelDesignation"
                      label="Designation"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('personnelDesignation')}
                      error={!!errors.personnelDesignation}
                      helperText={errors.personnelDesignation?.message}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="personnelMobile"
                      name="personnelMobile"
                      label="Mobile"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="tel"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('personnelMobile')}
                      error={!!errors.personnelMobile}
                      helperText={errors.personnelMobile?.message}
                    />
                  </Grid2>
                  <Grid2 size={12}>
                    <CustomTextField
                      id="personnelEmail"
                      name="personnelEmail"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      size="small"
                      type="email"
                      sx={{ marginBottom: '0.5rem' }}
                      {...register('personnelEmail')}
                      error={!!errors.personnelEmail}
                      helperText={errors.personnelEmail?.message}
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
              <Grid2
                size={4}
                sx={{
                  borderLeft: '2px solid black',
                  borderRight: '2px solid black',
                  borderBottom: '2px solid black',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <Grid2 size={12} sx={{ padding: '1rem' }}>
                  <CustomTextField
                    id="orderExecutedBy"
                    name="orderExecutedBy"
                    label="Order Executed By"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '1rem' }}
                    {...register('orderExecutedBy')}
                    error={!!errors.orderExecutedBy}
                    helperText={errors.orderExecutedBy?.message}
                  />
                  <CustomTextField
                    id="deliveryDate"
                    name="deliveryDate"
                    label="Delivery Date"
                    type="date"
                    InputProps={{
                      inputProps: { min: dateToday },
                    }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    InputLabelProps={{ shrink: true }}
                    {...register('deliveryDate')}
                    error={!!errors.deliveryDate}
                    helperText={errors.deliveryDate?.message}
                  />
                  <CustomTextField
                    id="orderProcessedBy"
                    name="orderProcessedBy"
                    label="Order Processed By"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('orderProcessedBy')}
                    error={!!errors.orderProcessedBy}
                    helperText={errors.orderProcessedBy?.message}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <Box height="2px" width={'100%'} sx={{ backgroundColor: 'black' }}></Box>
                </Grid2>
                <Grid2 container size={12} sx={{ padding: '1rem' }}>
                  <Grid2 size={12} sx={{ marginBottom: '1rem' }}>
                    <Typography variant="h5">Product Operations</Typography>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth size="small" sx={{ marginBottom: '1rem' }}>
                      <InputLabel id="embroidery-label">Embroidery</InputLabel>
                      <Controller
                        name="embroidery"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            labelId="embroidery-label"
                            label="Embroidery"
                            onChange={(e) => {
                              const newValue = e.target.value === 'true';
                              setEmbroidery(newValue);
                              onChange(newValue);
                              
                              // Clear embroidery form fields when set to false
                              if (!newValue) {
                                setValue('printingLogo', '');
                                setValue('printingLogoBack', '');
                                setValue('printingLogoSleeveL', '');
                                setValue('printingLogoSleeveR', '');
                                setValue('printingRemarks', '');
                              }
                              
                              // Clear main product specification fields when embroidery is set to false
                              if (!newValue) {
                                setValue('product', '');
                                setValue('description', '');
                                setValue('bodyColor', '');
                                setValue('panelColor', '');
                                setValue('skuCode', '');
                                setProductImages([]);
                              }
                            }}
                            value={value === true ? 'true' : value === false ? 'false' : value || 'false'}
                            displayEmpty
                          >
                            <MenuItem value="false">False</MenuItem>
                            <MenuItem value="true">True</MenuItem>
                          </CustomSelect>
                        )}
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth size="small" sx={{ marginBottom: '1rem' }}>
                      <InputLabel id="printing-label">Printing</InputLabel>
                      <Controller
                        name="printing"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            labelId="printing-label"
                            label="Printing"
                            onChange={(e) => {
                              const newValue = e.target.value === 'true';
                              setPrinting(newValue);
                              onChange(newValue);
                              
                              // Clear printing form fields when set to false
                              if (!newValue) {
                                setValue('embroideryLogoChest', '');
                                setValue('embroideryLogoBack', '');
                                setValue('embroideryLogoSleeveL', '');
                                setValue('embroideryLogoSleeveR', '');
                                setValue('embroideryRemarks', '');
                              }
                              
                              // Clear main product specification fields when printing is set to false
                              // if (!newValue) {
                              //   setValue('product', '');
                              //   setValue('description', '');
                              //   setValue('bodyColor', '');
                              //   setValue('panelColor', '');
                              //   setValue('skuCode', '');
                              //   setProductImages([]);
                              // }
                            }}
                            value={value === true ? 'true' : value === false ? 'false' : value || 'false'}
                            displayEmpty
                          >
                            <MenuItem value="false">False</MenuItem>
                            <MenuItem value="true">True</MenuItem>
                          </CustomSelect>
                        )}
                      />
                    </FormControl>
                  </Grid2>
                  <Grid2 size={12}>
                    <FormControl fullWidth size="small" sx={{ marginBottom: '1rem' }}>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Controller
                        name="gender"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <CustomSelect
                            labelId="gender-label"
                            label="Gender"
                            onChange={onChange}
                            value={value || 'male'}
                            displayEmpty
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="unisex">Unisex</MenuItem>
                          </CustomSelect>
                        )}
                      />
                    </FormControl>
                  </Grid2>
                </Grid2>
              </Grid2>

              {/* Row 3 - Updated Product Specification section */}
              <Grid2
                size={8}
                sx={{
                  borderLeft: '2px solid black',
                  borderRight: '2px solid black',
                  borderBottom: '2px solid black',
                }}
              >
                <Grid2 container sx={{ padding: '1rem' }} rowSpacing={1}>
                  <Grid2 size={12}>
                    <Typography variant="h5" textAlign="center">
                      Product Specification
                    </Typography>
                  </Grid2>
                  <Grid2
                    size={12}
                    sx={embroidery == true ? { borderBottom: '2px solid black' } : {}}
                  >
                    <CustomTextField
                      id="product"
                      name="product"
                      label={
                        <span>
                          Product <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      value={watch('product') || ''}
                      {...register('product', { required: 'Product is required' })}
                      error={!!errors.product}
                      helperText={errors.product?.message}
                    />
                    <Controller
                      name="skuCode"
                      control={control}
                      rules={{ required: 'SKU Code is required' }}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          freeSolo
                          loading={dropdownValue === 'STK' && isSearching}
                          options={getSkuOptions()}
                          inputValue={value?.toUpperCase() || ''}
                          onInputChange={(event, newValue) => {
                            const uppercasedValue = newValue.toUpperCase();
                            handleSkuInput({ target: { value: uppercasedValue } });
                            onChange(uppercasedValue);
                          }}
                          onChange={(event, newValue) => {
                            const uppercasedValue = newValue?.toUpperCase() || '';
                            handleSkuChange(uppercasedValue);
                            onChange(uppercasedValue);
                          }}
                          renderInput={(params) => (
                            <CustomTextField
                              {...params}
                              label={
                                <span>
                                  SKU Code <span style={{ color: 'red' }}>*</span>
                                </span>
                              }
                              variant="outlined"
                              fullWidth
                              size="small"
                              sx={{ marginBottom: '0.5rem' }}
                              error={!!errors.skuCode}
                              helperText={errors.skuCode?.message}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {dropdownValue === 'STK' && isSearching ? (
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          marginRight: '8px',
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #f3f3f3',
                                            borderTop: '2px solid #3498db',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      )}
                    />

                    {/* Changed from quality to description */}
                    <CustomTextField
                      id="description"
                      name="description"
                      label={
                        <span>
                          Description <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      value={watch('description') || ''}
                      {...register('description', { required: 'Description is required' })}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                    <CustomTextField
                      id="bodyColor"
                      control={control}
                      name="bodyColor"
                      label={<span>Body Color</span>}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      value={watch('bodyColor') || ''}
                      {...register('bodyColor')}
                      error={!!errors.bodyColor}
                      helperText={errors.bodyColor?.message}
                      placeholder="Body Color"
                    />
                    <CustomTextField
                      id="panelColor"
                      name="panelColor"
                      label={<span>panel color</span>}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      value={watch('panelColor') || ''}
                      {...register('panelColor')}
                      error={!!errors.panelColor}
                      helperText={errors.panelColor?.message}
                    />
                    {productImages.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {productImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Product Preview ${idx}`}
                            style={{
                              width: '100px',
                              height: 'auto',
                              marginTop: '0.5rem',
                              borderRadius: '4px',
                              marginRight: '0.5rem',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </Grid2>

                  {/* Rest of the embroidery and printing sections remain the same */}
                  {embroidery && (
                    <>
                      <Grid2 size={12}>
                        <Typography variant="h5" textAlign="center" sx={{ marginBottom: '0.5rem' }}>
                          Embroidery Design
                        </Typography>

                        <CustomTextField
                          id="printingLogo"
                          name="printingLogo"
                          label="Logo Chest"
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginBottom: '1rem' }}
                          {...register('printingLogo')}
                          error={!!errors.printingLogo}
                          helperText={errors.printingLogo?.message}
                        />
                        <CustomTextField
                          id="printingLogoBack"
                          name="printingLogoBack"
                          label="Logo Back"
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginBottom: '0.5rem' }}
                          {...register('printingLogoBack')}
                          error={!!errors.printingLogoBack}
                          helperText={errors.printingLogoBack?.message}
                        />
                        <CustomTextField
                          id="printingLogoSleeveL"
                          name="printingLogoSleeveL"
                          label="Logo Sleeve Left"
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginBottom: '1rem' }}
                          {...register('printingLogoSleeveL')}
                          error={!!errors.printingLogoSleeveL}
                          helperText={errors.printingLogoSleeveL?.message}
                        />
                        <CustomTextField
                          id="printingLogoSleeveR"
                          name="printingLogoSleeveR"
                          label="Logo Sleeve Right"
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginBottom: '1rem' }}
                          {...register('printingLogoSleeveR')}
                          error={!!errors.printingLogoSleeveR}
                          helperText={errors.printingLogoSleeveR?.message}
                        />
                        <CustomTextField
                          id="printingRemarks"
                          name="printingRemarks"
                          label="Spl Ins / Remarks"
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{ marginBottom: '1rem' }}
                          {...register('printingRemarks')}
                          error={!!errors.printingRemarks}
                          helperText={errors.printingRemarks?.message}
                        />
                      </Grid2>
                    </>
                  )}

                  {printing && (
                    <>
                      <Grid2 size={12}>
                        <Typography variant="h5" textAlign="center" sx={{ marginBottom: '0.5rem' }}>
                          Printing Design
                        </Typography>
                        {[
                          { id: 'embroideryLogoChest', label: 'Logo Chest' },
                          { id: 'embroideryLogoBack', label: 'Logo Back' },
                          { id: 'embroideryLogoSleeveL', label: 'Logo Sleeve Left' },
                          { id: 'embroideryLogoSleeveR', label: 'Logo Sleeve Right' },
                          { id: 'embroideryRemarks', label: 'Spl Ins / Remarks' },
                        ].map((field) => (
                          <CustomTextField
                            key={field.id}
                            id={field.id}
                            name={field.id}
                            label={field.label}
                            variant="outlined"
                            fullWidth
                            size="small"
                            sx={{ marginBottom: '1rem' }}
                            {...register(field.id)}
                            error={!!errors[field.id]}
                            helperText={errors[field.id]?.message}
                          />
                        ))}
                      </Grid2>
                    </>
                  )}
                </Grid2>
              </Grid2>

              {/* Size section remains the same */}
              <Grid2
                size={4}
                sx={{
                  borderLeft: '2px solid black',
                  borderRight: '2px solid black',
                  borderBottom: '2px solid black',
                }}
              >
                <Grid2 container sx={{ padding: '1rem' }} rowSpacing={1}>
                  <Grid2 size={5}>
                    <Typography variant="h5" sx={{ display: 'inline' }}>
                      Size
                    </Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <Typography variant="h5" sx={{ display: 'inline' }} textAlign="center">
                      Quantity
                    </Typography>
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">XS</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="xs"
                      name="xs"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('xs')}
                      error={!!errors.xs}
                      helperText={errors.xs?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">S</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="s"
                      name="s"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('s')}
                      error={!!errors.s}
                      helperText={errors.s?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">M</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="m"
                      name="m"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('m')}
                      error={!!errors.m}
                      helperText={errors.m?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">L</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="l"
                      name="l"
                      type="number"
                      min="0"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('l')}
                      error={!!errors.l}
                      helperText={errors.l?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">XL</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="xl"
                      name="xl"
                      type="number"
                      min="0"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('xl')}
                      error={!!errors.xl}
                      helperText={errors.xl?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">XXL</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="2xl"
                      name="2xl"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('2xl')}
                      error={!!errors['2xl']}
                      helperText={errors['2xl']?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">XXXL</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="3xl"
                      name="3xl"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('3xl')}
                      error={!!errors['3xl']}
                      helperText={errors['3xl']?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">4XL</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="4xl"
                      name="4xl"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('4xl')}
                      error={!!errors['4xl']}
                      helperText={errors['4xl']?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">5XL</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="5xl"
                      name="5xl"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register('5xl')}
                      error={!!errors['5xl']}
                      helperText={errors['5xl']?.message}
                    />
                  </Grid2>
                  <Grid2 size={5} sx={{ alignContent: 'center' }}>
                    <Typography variant="h6">Total</Typography>
                  </Grid2>
                  <Grid2 size={7}>
                    <CustomTextField
                      id="total"
                      name="total"
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      inputProps={{ min: 0, readOnly: true }}
                      value={watch('total') || 0}
                      {...register('total')}
                      error={!!errors['total']}
                      helperText={errors['total']?.message}
                      disabled
                    />
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>

            <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={3}>
              <LoadingButton disabled={isSubmitting} type="submit">
                Save
              </LoadingButton>
              <Button type="reset" variant="outlined" onClick={handleBack}>
                Back
              </Button>
            </Stack>
          </form>
        </ParentCard>
      </PageContainer>
    </>
  );
};

export default CreateJobCard;
