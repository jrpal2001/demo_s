import React, { useEffect, useState } from 'react';
import { Grid, MenuItem, Button, Typography } from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/components/shared/ParentCard';
import { Stack, Box } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import { getFabricById, updateFabric } from '@/api/admin';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '@/components/common/spinner/Spinner';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditProductFabric = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userType = useSelector(selectCurrentUserType);
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    reset, // Used to set default values
  } = useForm();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await getFabricById(id);
        console.log(response);

        setInitialData(response);
        reset(response); // Populate form with fetched data
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch product data:', err);
      }
    };

    fetchProductData();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      const response = await updateFabric(id, data);
      navigate(`/${userType}/products`);
      toast.success(response.message);
    } catch (err) {
      if (err.statusCode === 403) {
        err.errors.forEach(({ field, message }) => {
          setError(field, {
            type: 'manual',
            message: message,
          });
        });
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/products`, title: 'Products' },
    { title: 'Add' },
  ];
  const fields = [
    {
      label: 'DIVISION',
      id: 'division',
      type: 'text',
      required: 'DIVISION is required',
    },
    { label: 'PRODUCT', id: 'product', type: 'text', required: 'Product is required' },
    { label: 'BRAND', id: 'brand', type: 'text', required: false },
    { label: 'STYLE', id: 'style', type: 'text', required: 'Style is required' },
    { label: 'COLOR CODE', id: 'colorCode', type: 'text', required: false },
    { label: 'SIZE', id: 'size', type: 'text', required: 'Color Code is required' },
    { label: 'SUPPLIER', id: 'supplier', type: 'text', required: 'Supplier is required' },
    { label: 'COLOR NAME', id: 'colorName', type: 'text', required: false },
    { label: 'TYPE', id: 'type', type: 'text', required: 'Type is required' },
    { label: 'HSN CODE', id: 'hsnCode', type: 'text', required: 'Hsn Code is required' },
    { label: 'GST GROUP', id: 'gstGroup', type: 'number', required: 'GST is required' },
    { label: 'COST PRICE', id: 'costPrice', type: 'number', required: 'Cost Price is required' },
    {
      label: 'RETAIL PRICE',
      id: 'retailPrice',
      type: 'number',
      required: 'Retail Price is required',
    },
    { label: 'MRP', id: 'mrp', type: 'number', required: 'Mrp is required' },
    { label: 'WSP', id: 'wsp', type: 'number', required: 'WSP is required' },
    {
      label: 'UOM',
      id: 'uom',
      type: 'text',
      required: 'UOM is required',
    },
  ];

  return (
    <PageContainer
      title="Update Fabric Product"
      description="This is the Update Fabric Product page"
    >
      <Breadcrumb title="Update Product" items={BCrumb} />
      <ParentCard title="Update Fabric">
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {fields.map((fieldConfig) => (
                <Grid item xs={12} sm={12} lg={4} key={fieldConfig.id}>
                  <CustomFormLabel htmlFor={fieldConfig.id}>{fieldConfig.label}</CustomFormLabel>
                  {fieldConfig.type === 'select' ? (
                    <Controller
                      name={fieldConfig.id}
                      control={control}
                      rules={{ required: fieldConfig.required }}
                      render={({ field, fieldState }) => (
                        <>
                          <CustomSelect
                            {...field}
                            id={fieldConfig.id}
                            fullWidth
                            size="small"
                            error={!!fieldState.error}
                          >
                            <MenuItem value="">Select {fieldConfig.label}</MenuItem>
                            {fieldConfig.options?.map((option, index) => (
                              <MenuItem key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </CustomSelect>
                          {fieldState.error && (
                            <Typography color="error" variant="body2" style={{ marginTop: 4 }}>
                              {fieldState.error.message}
                            </Typography>
                          )}
                        </>
                      )}
                    />
                  ) : (
                    <CustomTextField
                      {...register(fieldConfig.id, { required: fieldConfig.required })}
                      id={fieldConfig.id}
                      placeholder={`Enter ${fieldConfig.label}`}
                      variant="outlined"
                      fullWidth
                      size="small"
                      type={fieldConfig.type}
                      error={!!errors[fieldConfig.id]}
                      helperText={errors[fieldConfig.id]?.message}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={3}>
              <LoadingButton
                loading={isSubmitting}
                type="submit"
                variant="contained"
                color="primary"
                // endIcon={<IconPrinter width={18} />}
              >
                Update
              </LoadingButton>
              <Button
                disabled={isSubmitting}
                type="button"
                variant="outlined"
                onClick={() => reset(initialData)}
              >
                Reset
              </Button>
            </Stack>
          </form>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default EditProductFabric;
