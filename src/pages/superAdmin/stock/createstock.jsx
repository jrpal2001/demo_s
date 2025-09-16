'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  Autocomplete,
  TextField,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { createStock } from '@/api/stock.api';
import { fetchAllProductMasterSkus } from '@/api/productmaster.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateStock = () => {
  const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skuOptions, setSkuOptions] = useState([]);
  const [skuLoading, setSkuLoading] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productMasterRef: '',
      skuCode: '',
      productDescription: '',
      reorderLevel: 0,
      currentQuantity: 0,
      lowStockAlertLevel: 0,
      sizeSpecifications: SIZES.reduce((acc, size) => {
        acc[size] = 0;
        return acc;
      }, {}),
      lotSpecifications: [],
    },
  });

  const {
    fields: lotFields,
    append: appendLot,
    remove: removeLot,
  } = useFieldArray({
    control,
    name: 'lotSpecifications',
  });

  const calculateMainSizeSpecifications = (lotSpecs) => {
    console.log('[v0] Calculating main specs with lots:', lotSpecs);
    const mainSpecs = {};

    // Initialize all sizes to 0
    SIZES.forEach((size) => {
      mainSpecs[size] = 0;
    });

    if (lotSpecs && lotSpecs.length > 0) {
      lotSpecs.forEach((lot, index) => {
        console.log(`[v0] Processing lot ${index}:`, lot);
        if (lot.sizeSpecifications) {
          SIZES.forEach((size) => {
            const value = Number.parseInt(lot.sizeSpecifications[size]) || 0;
            mainSpecs[size] += value;
            console.log(`[v0] Adding ${value} to size ${size}, new total: ${mainSpecs[size]}`);
          });
        }
      });
    }

    console.log('[v0] Final main specs:', mainSpecs);
    return mainSpecs;
  };

  const calculateTotalQuantity = (mainSpecs) => {
    const total = Object.values(mainSpecs).reduce((total, qty) => total + qty, 0);
    console.log('[v0] Total quantity calculated:', total);
    return total;
  };

  const watchedValues = watch();

  const calculatedMainSpecs = calculateMainSizeSpecifications(watchedValues.lotSpecifications);
  const calculatedTotalQuantity = calculateTotalQuantity(calculatedMainSpecs);

  // Handle SKU Search
  const handleSkuSearch = async (search) => {
    setSkuLoading(true);
    try {
      const data = await fetchAllProductMasterSkus({ page: 1, limit: 10, search });
      console.log('🚀 ~ handleSkuSearch ~ data:', data);
      setSkuOptions(data.records || []);
    } catch (err) {
      console.error('Error fetching SKUs:', err);
      toast.error('Failed to fetch SKUs');
    } finally {
      setSkuLoading(false);
    }
  };

  const addNewLot = () => {
    const newLot = {
      lotNumber: `LOT-${Date.now()}`,
      sizeSpecifications: SIZES.reduce((acc, size) => {
        acc[size] = 0;
        return acc;
      }, {}),
    };
    appendLot(newLot);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const stockData = {
        ...data,
        reorderLevel: Number.parseInt(data.reorderLevel),
        currentQuantity: calculatedTotalQuantity,
        lowStockAlertLevel: Number.parseInt(data.lowStockAlertLevel),
        sizeSpecifications: calculatedMainSpecs,
        lotSpecifications: data.lotSpecifications.map((lot) => ({
          lotNumber: lot.lotNumber,
          sizeSpecifications: Object.keys(lot.sizeSpecifications).reduce((acc, size) => {
            acc[size] = Number.parseInt(lot.sizeSpecifications[size]) || 0;
            return acc;
          }, {}),
        })),
      };

      const response = await createStock(stockData);
      if (response) {
        toast.success('Stock created successfully');
        navigate(-1);
      }
    } catch (error) {
      console.error('Error creating stock:', error);
      toast.error(error.message || 'Failed to create stock');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/stock`, title: 'Stock' },
    { title: 'Create' },
  ];

  return (
    <PageContainer title="Create Stock" description="Create a new stock entry">
      <Breadcrumb title="Create Stock" items={BCrumb} />
      <ParentCard title="Stock Entry Form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            {/* SKU Search & Select */}
            <Grid item xs={12} md={6}>
              <Controller
                name="skuCode"
                control={control}
                rules={{ required: 'SKU Code is required' }}
                render={({ field }) => (
                  <Autocomplete
                    freeSolo
                    loading={skuLoading}
                    options={skuOptions}
                    value={skuOptions.find((opt) => opt.skuCode === field.value) || null}
                    getOptionLabel={(option) => option?.skuCode || ''}
                    onInputChange={(e, value) => handleSkuSearch(value)}
                    onChange={(e, value) => {
                      if (value) {
                        field.onChange(value.skuCode);
                        setValue('productMasterRef', value._id, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue('productDescription', value.description || '', {
                          shouldValidate: true,
                        });
                      } else {
                        field.onChange('');
                        setValue('productMasterRef', '');
                        setValue('productDescription', '');
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="SKU Code"
                        variant="outlined"
                        error={!!errors.skuCode}
                        helperText={errors.skuCode?.message}
                      />
                    )}
                  />
                )}
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
                value={watch('productDescription') || ''}
                onChange={(e) => setValue('productDescription', e.target.value)}
              />
            </Grid>

            {/* Stock Controls */}
            <Grid item xs={12} md={4}>
              <CustomTextField
                id="reorderLevel"
                label="Reorder Level"
                type="number"
                variant="outlined"
                fullWidth
                {...register('reorderLevel', { required: 'Reorder level is required' })}
                error={!!errors.reorderLevel}
                helperText={errors.reorderLevel?.message}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="currentQuantity"
                label="Current Quantity (Auto-calculated)"
                type="number"
                variant="outlined"
                fullWidth
                value={calculatedTotalQuantity}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <CustomTextField
                id="lowStockAlertLevel"
                label="Low Stock Alert Level"
                type="number"
                variant="outlined"
                fullWidth
                {...register('lowStockAlertLevel', {
                  required: 'Low stock alert level is required',
                })}
                error={!!errors.lowStockAlertLevel}
                helperText={errors.lowStockAlertLevel?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Main Size Specifications (Auto-calculated from Lots)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {SIZES.map((size) => (
                  <Grid item xs={6} md={3} key={size}>
                    <CustomTextField
                      label={`Size ${size.toUpperCase()}`}
                      type="number"
                      variant="outlined"
                      fullWidth
                      value={calculatedMainSpecs[size] || 0}
                      InputProps={{
                        readOnly: true,
                      }}
                      helperText="Auto-calculated from lot specifications"
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Lot Specifications</Typography>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addNewLot}>
                  Add Lot
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {lotFields.map((lot, lotIndex) => (
                <Card key={lot.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">Lot #{lotIndex + 1}</Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeLot(lotIndex)}
                        disabled={lotFields.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`lotSpecifications.${lotIndex}.lotNumber`}
                          control={control}
                          rules={{ required: 'Lot number is required' }}
                          render={({ field }) => (
                            <CustomTextField
                              {...field}
                              label="Lot Number"
                              variant="outlined"
                              fullWidth
                              error={!!errors.lotSpecifications?.[lotIndex]?.lotNumber}
                              helperText={errors.lotSpecifications?.[lotIndex]?.lotNumber?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>
                          Size Specifications for this Lot
                        </Typography>
                        <Grid container spacing={2}>
                          {SIZES.map((size) => (
                            <Grid item xs={6} md={3} key={size}>
                              <Controller
                                name={`lotSpecifications.${lotIndex}.sizeSpecifications.${size}`}
                                control={control}
                                render={({ field }) => (
                                  <CustomTextField
                                    {...field}
                                    label={`Size ${size.toUpperCase()}`}
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              {lotFields.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  No lots added yet. Click "Add Lot" to create lot-specific specifications.
                </Typography>
              )}
            </Grid>

            {/* Actions */}
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <LoadingButton loading={isSubmitting} variant="contained" type="submit">
                  Submit
                </LoadingButton>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateStock;
