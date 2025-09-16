import React, { useState } from 'react';
import { Button, Grid2, Container, Autocomplete, TextField, IconButton } from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { createOrder, fetchSkuCodes } from '@/api/admin';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateOrder = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/orders`, title: 'Orders' },
    { title: 'Create' },
  ];
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      clientName: '',
      orderItems: [{ skuCode: '', quantity: '' }], // Ensure default values for orderItems
    },
  });

  const [skuCodes, setSkuCodes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderItems',
  });

  const onSubmit = async (data) => {
    console.log('Data before submit:', data);

    // Make sure clientName is passed as a string and orderItems contain correct fields
    const orderData = {
      clientName: data.clientName, // Use clientName from form
      orderItems: data.orderItems.map((item) => ({
        skuCode: item.skuCode,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await createOrder(orderData);
      if (response) {
        toast.success('Order created successfully');
        navigate(`/${userType}/orders`);
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

  // Handle SKU input and fetch matching SKU codes
  const handleSkuInput = async (event) => {
    const searchQuery = event.target.value.toUpperCase();
    if (searchQuery) {
      const response = await fetchSkuCodes(searchQuery);
      console.log('🚀 ~ handleSkuInput ~ response:', response);
      if (response?.length > 0) {
        setSkuCodes(response); // Update SKU codes based on search query
      } else {
        setSkuCodes([]); // Clear suggestions if no matches
      }
    } else {
      setSkuCodes([]); // Clear suggestions when input is empty
    }
  };

  // When a SKU is selected, populate the form with the product details
  const handleSkuChange = (index, event, newValue) => {
    if (newValue) {
      // Extract only the skuCode from the selected object
      setValue(`orderItems[${index}].skuCode`, newValue.skuCode); // Use the skuCode from the selected object
    }
  };

  const handleBack = () => {
    navigate(`/${userType}/orders`);
  };

  return (
    <PageContainer>
      <Breadcrumb title="Create Order" items={BCrumb} />
      <Container maxWidth="lg">
        <ParentCard title="Create Order">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid2 container spacing={2}>
              {/* Client Name */}
              <Grid2 size={4}>
                <Controller
                  name="clientName"
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      label="Client Name"
                      fullWidth
                      error={!!errors.clientName}
                      helperText={errors.clientName?.message}
                    />
                  )}
                />
              </Grid2>

              {/* Dynamic SKU and Quantity Fields */}
              {fields.map((field, index) => (
                <Grid2
                  key={field.id}
                  container
                  alignItems="center"
                  columnSpacing={2}
                  sx={{ marginBottom: '0.5rem' }}
                >
                  {/* SKU Code Input with Autocomplete */}
                  <Grid2 item xs={12} sm={6} md={4}>
                    <Controller
                      name={`orderItems[${index}].skuCode`}
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          freeSolo
                          options={skuCodes}
                          onInputChange={handleSkuInput}
                          onChange={(e, newValue) => handleSkuChange(index, e, newValue)}
                          getOptionLabel={(option) => option.skuCode}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="SKU Code"
                              error={!!errors.orderItems?.[index]?.skuCode}
                              helperText={errors.orderItems?.[index]?.skuCode?.message}
                              sx={{ width: '100%' }}
                            />
                          )}
                        />
                      )}
                    />
                  </Grid2>

                  {/* Quantity Input */}
                  <Grid2 item xs={12} sm={6} md={4}>
                    <Controller
                      name={`orderItems[${index}].quantity`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Quantity"
                          error={!!errors.orderItems?.[index]?.quantity}
                          helperText={errors.orderItems?.[index]?.quantity?.message}
                          fullWidth
                          type="number"
                          onChange={(e) => field.onChange(e)} // Ensure this is updating the quantity in form state
                        />
                      )}
                    />
                  </Grid2>

                  {/* Add/Remove Buttons */}
                  <Grid2 item xs={12} sm={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() =>
                        index === 0 ? append({ skuCode: '', quantity: '' }) : remove(index)
                      }
                      color="primary"
                    >
                      {index === fields.length - 1 ? <AddIcon /> : <RemoveIcon />}
                    </IconButton>
                  </Grid2>
                </Grid2>
              ))}

              {/* Submit and Back Buttons */}
              <Grid2 item xs={12}>
                <LoadingButton
                  loading={isSubmitting}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Create Order
                </LoadingButton>
              </Grid2>

              <Grid2 item xs={12}>
                <Button variant="outlined" color="secondary" onClick={handleBack}>
                  Back
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </ParentCard>
      </Container>
    </PageContainer>
  );
};

export default CreateOrder;
