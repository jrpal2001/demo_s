'use client';

import React, { useEffect, useState } from 'react';
import {
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
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { fetchJobCardDataById, updateJobCard } from '@/api/admin';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { fetchAllProductMasterSkus, fetchProductMasterBySku } from '@/api/productmaster.api';
import { useCallback, useRef } from 'react';

const EditJobCard = () => {
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
  // Removed unused productMaster state
  const [embroidery, setEmbroidery] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [jobCard, setJobCard] = useState({});
  const { id } = useParams();
  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0]?.toLowerCase() == 'superadmin' ? 'admin' : user.userType[0]?.toLowerCase();

  const navigate = useNavigate();

  // Debounce utility
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

  // SKU search state
  const [filteredSkus, setFilteredSkus] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // SKU search logic
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
      toast.error('Failed to search SKU codes');
    } finally {
      setIsSearching(false);
    }
  };
  const debouncedSearchSkus = useDebounce(searchSkusFromAPI, 300);

  // SKU input handler
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
    try {
      const productMasterData = await fetchProductMasterBySku(newValue);
      if (productMasterData) {
        setValue('product', productMasterData.name || '');
        setValue('description', productMasterData.description || '');
        setValue('gender', productMasterData.gender || 'male');
        setValue('bodyColor', productMasterData.color || '');
        setValue('panelColor', productMasterData.panelcolor || '');
      }
      // Optionally fetch images if needed
      // const imageUrls = await fetchProductImagesBySkuCode(newValue);
      // setProductImages(imageUrls);
    } catch (err) {
      console.error('Error fetching product master data:', err);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const total =
        Number.parseInt(data.xs || 0) +
        Number.parseInt(data.s || 0) +
        Number.parseInt(data.m || 0) +
        Number.parseInt(data.l || 0) +
        Number.parseInt(data.xl || 0) +
        Number.parseInt(data['2xl'] || 0) +
        Number.parseInt(data['3xl'] || 0) +
        Number.parseInt(data['4xl'] || 0) +
        Number.parseInt(data['5xl'] || 0);

      const modifiedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString() : null,
        total: total,
        embroidery: data.embroidery === 'true' || data.embroidery === true,
        printing: data.printing === 'true' || data.printing === true,
      };

      // Remove orderId if jobCardNo starts with STK
      if (data.jobCardNo?.toUpperCase().startsWith('STK')) {
        delete modifiedData.orderId;
      }

      const newData = {};
      Object.keys(modifiedData).map((key) => {
        if (modifiedData[key] !== jobCard[key]) {
          newData[key] = modifiedData[key];
        }
      });

      if (Object.keys(newData).length > 0) {
        const response = await updateJobCard(id, newData);
        if (response) {
          toast.success('Job card updated successfully');
          navigate(`/${role}/job-cards`);
        }
      } else {
        toast.warn('Please make any changes and then save');
      }
    } catch (err) {
      err.data?.map((e) => {
        setError(e.field, { type: 'manual', message: e.message });
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const capitalize = (event) => {
    return (event.target.value = event.target.value.toUpperCase());
  };

  const handleBack = () => {
    navigate(`/${role}/job-cards`);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${role ?? 'admin'}/job-cards`, title: 'Job Card' },
    { title: 'Edit' },
  ];

  useEffect(() => {
    async function fetchJobCard() {
      try {
        const response = await fetchJobCardDataById(id);
        console.log('🚀 ~ fetchJobCard ~ response:', response);
        if (response && typeof response == 'object') {
          setJobCard(response);
          setEmbroidery(response.embroidery || false);
          setPrinting(response.printing || false);

          Object.keys(response).map((key) => {
            if (key == 'date' || key == 'deliveryDate') {
              const date = response[key]?.split('T')[0];
              setValue(key, date);
            } else if (
              key !== '_id' &&
              key !== '__v' &&
              key !== 'createdAt' &&
              key !== 'updatedAt'
            ) {
              setValue(key, response[key]);
            }
          });
        } else {
          toast.error('Something went wrong');
        }
      } catch {
        toast.error("Data couldn't be fetched");
      }
    }

    fetchJobCard();
  }, []);

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

  return (
    <PageContainer title="Edit Job Card" description="This is the Edit Job Card page">
      <Breadcrumb title="Edit Job Card" items={BCrumb} />
      <ParentCard title="SAMURAI EXPORTS PRIVATE LIMITED">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container>
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
                  {...register('date', { required: 'Date is required' })}
                  error={!!errors.date}
                  helperText={errors.date?.message}
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
              <CustomTextField
                id="jobCardNo"
                name="jobCardNo"
                variant="outlined"
                fullWidth
                size="small"
                onInput={capitalize}
                {...register('jobCardNo', { required: 'Job card number is required' })}
                error={!!errors.jobCardNo}
                helperText={errors.jobCardNo?.message}
              />
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
                  <FormControl fullWidth size="small" sx={{ marginBottom: '0.8rem' }}>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field: { onChange, value, ref } }) => (
                        <CustomSelect
                          labelId="type-label"
                          onChange={onChange}
                          value={value || 'sample'}
                          inputRef={ref}
                        >
                          <MenuItem value="sample">Sample</MenuItem>
                          <MenuItem value="production">Production</MenuItem>
                          <MenuItem value="online">Online</MenuItem>
                          <MenuItem value="stock">Stock</MenuItem>
                        </CustomSelect>
                      )}
                    />
                  </FormControl>

                  <CustomTextField
                    id="customerName"
                    name="customerName"
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
                    label="Customer Address"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    size="small"
                    {...register('customerAddress')}
                    error={!!errors.customerAddress}
                    helperText={errors.customerAddress?.message}
                  />
                </Grid2>
                <Grid2 size={12} sx={{ padding: '1rem', borderBottom: '2px solid black' }}>
                  {watch('jobCardNo')?.slice(0, 3) !== 'STK' && (
                    <CustomTextField
                      id="orderId"
                      name="orderId"
                      label="Order ID"
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.8rem' }}
                      {...register('orderId')}
                      error={!!errors.orderId}
                      helperText={errors.orderId?.message}
                    />
                  )}
                  <CustomTextField
                    id="paymentTerms"
                    name="paymentTerms"
                    label="Payment Terms"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
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

            {/* Dealer Section */}
            <Grid2 size={4} sx={{ borderBottom: '2px solid black' }}>
              <Grid2 container sx={{ padding: '1rem', borderBottom: '2px solid black' }}>
                <Grid2 size={12}>
                  <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
                    Dealer
                  </Typography>
                  <CustomTextField
                    id="dealerOrderedBy"
                    name="dealerOrderedBy"
                    label={
                      <span>
                        Ordered By <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('dealerOrderedBy', { required: 'Dealer ordered by is required' })}
                    error={!!errors.dealerOrderedBy}
                    helperText={errors.dealerOrderedBy?.message}
                  />
                  <CustomTextField
                    id="dealerDesignation"
                    name="dealerDesignation"
                    label={
                      <span>
                        Designation <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('dealerDesignation', {
                      required: 'Dealer designation is required',
                    })}
                    error={!!errors.dealerDesignation}
                    helperText={errors.dealerDesignation?.message}
                  />
                  <CustomTextField
                    id="dealerMobile"
                    name="dealerMobile"
                    label={
                      <span>
                        Mobile <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="tel"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('dealerMobile', { required: 'Dealer mobile is required' })}
                    error={!!errors.dealerMobile}
                    helperText={errors.dealerMobile?.message}
                  />
                  <CustomTextField
                    id="dealerEmail"
                    name="dealerEmail"
                    label={
                      <span>
                        Email <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="email"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('dealerEmail', {
                      required: 'Dealer email is required',
                      pattern: {
                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: 'Please enter valid email address',
                      },
                    })}
                    error={!!errors.dealerEmail}
                    helperText={errors.dealerEmail?.message}
                  />
                </Grid2>
              </Grid2>

              {/* Office Personnel Section */}
              <Grid2 container sx={{ padding: '1rem' }}>
                <Grid2 size={12}>
                  <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
                    Office Personnel
                  </Typography>
                  <CustomTextField
                    id="personnelOrderedBy"
                    name="personnelOrderedBy"
                    label={
                      <span>
                        Ordered By <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('personnelOrderedBy', {
                      required: 'Personnel ordered by is required',
                    })}
                    error={!!errors.personnelOrderedBy}
                    helperText={errors.personnelOrderedBy?.message}
                  />
                  <CustomTextField
                    id="personnelDesignation"
                    name="personnelDesignation"
                    label={
                      <span>
                        Designation <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('personnelDesignation', {
                      required: 'Personnel designation is required',
                    })}
                    error={!!errors.personnelDesignation}
                    helperText={errors.personnelDesignation?.message}
                  />
                  <CustomTextField
                    id="personnelMobile"
                    name="personnelMobile"
                    label={
                      <span>
                        Mobile <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="tel"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('personnelMobile', { required: 'Personnel mobile is required' })}
                    error={!!errors.personnelMobile}
                    helperText={errors.personnelMobile?.message}
                  />
                  <CustomTextField
                    id="personnelEmail"
                    name="personnelEmail"
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span>
                        Email <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="email"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('personnelEmail', {
                      required: 'Personnel email is required',
                      pattern: {
                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: 'Please enter valid email address',
                      },
                    })}
                    error={!!errors.personnelEmail}
                    helperText={errors.personnelEmail?.message}
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            {/* Right Column - Order Details */}
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
                  InputLabelProps={{ shrink: true }}
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
                  InputLabelProps={{ shrink: true }}
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
                      render={({ field: { onChange, value, ref } }) => (
                        <CustomSelect
                          labelId="embroidery-label"
                          onChange={(e) => {
                            const newValue = e.target.value === 'true';
                            setEmbroidery(newValue);
                            onChange(newValue);
                          }}
                          value={value ? 'true' : 'false'}
                          inputRef={ref}
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
                      render={({ field: { onChange, value, ref } }) => (
                        <CustomSelect
                          labelId="printing-label"
                          onChange={(e) => {
                            const newValue = e.target.value === 'true';
                            setPrinting(newValue);
                            onChange(newValue);
                          }}
                          value={value ? 'true' : 'false'}
                          inputRef={ref}
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
                      render={({ field: { onChange, value, ref } }) => (
                        <CustomSelect
                          labelId="gender-label"
                          onChange={onChange}
                          value={value || 'male'}
                          inputRef={ref}
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

            {/* Row 3 - Product Specification */}
            <Grid2
              size={4}
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
                  sx={embroidery ? { borderBottom: '2px solid black', paddingBottom: '1rem' } : {}}
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
                    InputLabelProps={{ shrink: true }}
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
                        loading={isSearching}
                        options={filteredSkus.map((item) => item.skuCode)}
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
                          />
                        )}
                      />
                    )}
                  />
                  <CustomTextField
                    id="description"
                    name="description"
                    InputLabelProps={{ shrink: true }}
                    label={
                      <span>
                        Description <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('description', { required: 'Description is required' })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                  <CustomTextField
                    id="bodyColor"
                    name="bodyColor"
                    label="Body Color"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('bodyColor')}
                    error={!!errors.bodyColor}
                    helperText={errors.bodyColor?.message}
                  />
                  <CustomTextField
                    id="panelColor"
                    name="panelColor"
                    InputLabelProps={{ shrink: true }}
                    label="Panel Color"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    {...register('panelColor')}
                    error={!!errors.panelColor}
                    helperText={errors.panelColor?.message}
                  />
                </Grid2>

                {/* Embroidery Design Section */}
                {embroidery && (
                  <Grid2 size={12}>
                    <Typography variant="h5" textAlign="center" sx={{ marginBottom: '0.5rem' }}>
                      Embroidery Design
                    </Typography>
                    <CustomTextField
                      id="embroideryLogoChest"
                      name="embroideryLogoChest"
                      label="Logo Chest"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
                      {...register('embroideryLogoChest')}
                      error={!!errors.embroideryLogoChest}
                      helperText={errors.embroideryLogoChest?.message}
                    />
                    <CustomTextField
                      id="embroideryLogoBack"
                      name="embroideryLogoBack"
                      label="Logo Back"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
                      {...register('embroideryLogoBack')}
                      error={!!errors.embroideryLogoBack}
                      helperText={errors.embroideryLogoBack?.message}
                    />
                    <CustomTextField
                      id="embroideryLogoSleeveL"
                      name="embroideryLogoSleeveL"
                      label="Logo Sleeve Left"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
                      {...register('embroideryLogoSleeveL')}
                      error={!!errors.embroideryLogoSleeveL}
                      helperText={errors.embroideryLogoSleeveL?.message}
                    />
                    <CustomTextField
                      id="embroideryLogoSleeveR"
                      name="embroideryLogoSleeveR"
                      label="Logo Sleeve Right"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
                      {...register('embroideryLogoSleeveR')}
                      error={!!errors.embroideryLogoSleeveR}
                      helperText={errors.embroideryLogoSleeveR?.message}
                    />
                    <CustomTextField
                      id="embroideryRemarks"
                      name="embroideryRemarks"
                      label="Spl Ins / Remarks"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
                      {...register('embroideryRemarks')}
                      error={!!errors.embroideryRemarks}
                      helperText={errors.embroideryRemarks?.message}
                    />
                  </Grid2>
                )}
              </Grid2>
            </Grid2>

            {/* Printing Design Section */}
            <Grid2 size={4} sx={{ borderBottom: '2px solid black' }}>
              <Grid2 container sx={{ padding: '1rem' }} rowSpacing={1}>
                {printing && (
                  <Grid2 size={12}>
                    <Typography variant="h5" textAlign="center" sx={{ marginBottom: '0.5rem' }}>
                      Printing Design
                    </Typography>
                    <CustomTextField
                      id="printingLogo"
                      name="printingLogo"
                      label="Logo Chest"
                      variant="outlined"
                      fullWidth
                      size="small"
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
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
                      InputLabelProps={{ shrink: true }}
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
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
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
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
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
                      sx={{ marginBottom: '0.5rem' }}
                      InputLabelProps={{ shrink: true }}
                      {...register('printingRemarks')}
                      error={!!errors.printingRemarks}
                      helperText={errors.printingRemarks?.message}
                    />
                  </Grid2>
                )}
              </Grid2>
            </Grid2>

            {/* Size and Quantity Section */}
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
                  <Typography variant="h5">Size</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <Typography variant="h5" textAlign="center">
                    Quantity
                  </Typography>
                </Grid2>

                {['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'].map((size) => (
                  <React.Fragment key={size}>
                    <Grid2 size={5} sx={{ alignContent: 'center' }}>
                      <Typography variant="h6">{size.toUpperCase()}</Typography>
                    </Grid2>
                    <Grid2 size={7}>
                      <CustomTextField
                        id={size}
                        name={size}
                        type="number"
                        variant="outlined"
                        fullWidth
                        size="small"
                        defaultValue={0}
                        inputProps={{ min: 0 }}
                        {...register(size)}
                        error={!!errors[size]}
                        helperText={errors[size]?.message}
                      />
                    </Grid2>
                  </React.Fragment>
                ))}

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
                    disabled
                    {...register('total')}
                    error={!!errors['total']}
                    helperText={errors['total']?.message}
                  />
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>

          <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={3}>
            <LoadingButton loading={isSubmitting} type="submit" variant="contained">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default EditJobCard;
