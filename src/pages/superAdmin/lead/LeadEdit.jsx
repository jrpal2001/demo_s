'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Grid2, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { getLeadById, updateLead } from '@/api/lead.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const LeadEdit = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/lead`, title: 'Lead Management' },
    { title: 'Edit' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const onSubmit = async (values) => {
    try {
      // Check if required fields are present
      if (
        !values.customerName ||
        !values.mobileNo ||
        !values.leadSource ||
        !values.company ||
        !values.designation
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      let hasChanges = false;
      const updatedData = {};

      Object.entries(values).forEach(([key, value]) => {
        if (value !== data[key]) {
          updatedData[key] = value;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        // Convert quantity to number if provided
        if (updatedData.quantity) {
          updatedData.quantity = Number(updatedData.quantity);
        }

        const response = await updateLead(id, updatedData);
        if (response) {
          toast.success('Lead updated successfully');
          navigate(`/${userType}/lead`);
        }
      } else {
        toast.warning('Please update at least one field');
      }
    } catch (error) {
      toast.error(error.message || 'Updating lead failed');
    }
  };

  const formik = useFormik({
    initialValues: {
      date: '',
      leadNo: '',
      productType: '',
      customerName: '',
      mobileNo: '',
      leadSource: '',
      company: '',
      designation: '',
      customerType: '',
      orderType: '',
      quantity: '',
      deliveryLeadTime: '',
      orderDetails: '',
      assignedExecutive: '',
      purpose: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: Yup.object({
      date: Yup.date().nullable(),
      productType: Yup.string().required('Product Type is required'),
      customerName: Yup.string().required('Customer Name is required'),
      mobileNo: Yup.string().required('Mobile Number is required'),
      leadSource: Yup.string().required('Lead Source is required'),
      company: Yup.string().required('Company is required'),
      designation: Yup.string().required('Designation is required'),
      quantity: Yup.number().positive('Quantity must be positive').nullable(),
    }),
    onSubmit,
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/lead`);
  };

  const fetchData = async () => {
    try {
      const response = await getLeadById(id);
      if (response) {
        // Format date for input field
        const formattedDate = response.date
          ? new Date(response.date).toISOString().split('T')[0]
          : '';

        const formValues = {
          date: formattedDate,
          leadNo: response.leadNo || '',
          productType: response.productType || '',
          customerName: response.customerName || '',
          mobileNo: response.mobileNo || '',
          leadSource: response.leadSource || '',
          company: response.company || '',
          designation: response.designation || '',
          customerType: response.customerType || '',
          orderType: response.orderType || '',
          quantity: response.quantity || '',
          deliveryLeadTime: response.deliveryLeadTime || '',
          orderDetails: response.orderDetails || '',
          assignedExecutive: response.assignedExecutive || '',
          purpose: response.purpose || '',
        };

        setData(response);
        formik.setValues(formValues);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch lead');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer title="Admin - Lead Management" description="">
      <Breadcrumb title="Lead Management" items={BCrumb} />
      <ParentCard title="Edit Lead">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="date" sx={{ marginTop: 0 }}>
                Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </Grid2>

            {/* LEAD NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="leadNo" sx={{ marginTop: 0 }}>
                Lead Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="leadNo"
                name="leadNo"
                value={formik.values.leadNo || ''}
                disabled
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000000',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Grid2>

            {/* PRODUCT TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="productType" sx={{ marginTop: 0 }}>
                Product Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="productType"
                name="productType"
                value={formik.values.productType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Type"
                error={formik.touched.productType && Boolean(formik.errors.productType)}
                helperText={formik.touched.productType && formik.errors.productType}
              />
            </Grid2>

            {/* PURPOSE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purpose" sx={{ marginTop: 0 }}>
                Purpose
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="purpose"
                name="purpose"
                value={formik.values.purpose}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Purpose"
                error={formik.touched.purpose && Boolean(formik.errors.purpose)}
                helperText={formik.touched.purpose && formik.errors.purpose}
              />
            </Grid2>

            {/* CUSTOMER NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="customerName" sx={{ marginTop: 0 }}>
                Customer Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="customerName"
                name="customerName"
                value={formik.values.customerName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Customer Name"
                error={formik.touched.customerName && Boolean(formik.errors.customerName)}
                helperText={formik.touched.customerName && formik.errors.customerName}
              />
            </Grid2>

            {/* MOBILE NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="mobileNo" sx={{ marginTop: 0 }}>
                Mobile Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="mobileNo"
                name="mobileNo"
                value={formik.values.mobileNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Mobile Number"
                error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
                helperText={formik.touched.mobileNo && formik.errors.mobileNo}
              />
            </Grid2>

            {/* LEAD SOURCE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="leadSource" sx={{ marginTop: 0 }}>
                Lead Source
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="leadSource"
                name="leadSource"
                value={formik.values.leadSource}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.leadSource && Boolean(formik.errors.leadSource)}
                helperText={formik.touched.leadSource && formik.errors.leadSource}
              >
                <MenuItem value="" disabled>
                  Select Lead Source
                </MenuItem>
                <MenuItem value="manual">REF MANNUAL ENTRY</MenuItem>
                <MenuItem value="google-ads">GOOGLE ADS</MenuItem>
                <MenuItem value="exhibition">EXHIBITION</MenuItem>
                <MenuItem value="facebook">FACEBOOK</MenuItem>
                <MenuItem value="instagram">INSTAGRAM</MenuItem>
                <MenuItem value="amazon">AMAZON</MenuItem>
                <MenuItem value="flipkart">FLIPKART</MenuItem>
                <MenuItem value="myntra">MYNTRA</MenuItem>
                <MenuItem value="youtube">YOUTUBE</MenuItem>
                <MenuItem value="influencer">INFLUENCER</MenuItem>
              </CustomSelect>
            </Grid2>

            {/* COMPANY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="company" sx={{ marginTop: 0 }}>
                Company
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="company"
                name="company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Company"
                error={formik.touched.company && Boolean(formik.errors.company)}
                helperText={formik.touched.company && formik.errors.company}
              />
            </Grid2>

            {/* DESIGNATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="designation" sx={{ marginTop: 0 }}>
                Designation
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="designation"
                name="designation"
                value={formik.values.designation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Designation"
                error={formik.touched.designation && Boolean(formik.errors.designation)}
                helperText={formik.touched.designation && formik.errors.designation}
              />
            </Grid2>

            {/* CUSTOMER TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="customerType" sx={{ marginTop: 0 }}>
                Customer Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="customerType"
                name="customerType"
                value={formik.values.customerType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.customerType && Boolean(formik.errors.customerType)}
                helperText={formik.touched.customerType && formik.errors.customerType}
              >
                <MenuItem value="" disabled>
                  Select Customer Type
                </MenuItem>
                <MenuItem value="direct-b2b">DIRECT B2B</MenuItem>
                <MenuItem value="dealer-b2b">DEALER B2B</MenuItem>
                <MenuItem value="retailer-dealer">RETAILER DEALER</MenuItem>
                <MenuItem value="individual">INDIVIDUAL BULK ORDER</MenuItem>
              </CustomSelect>
            </Grid2>

            {/* ORDER TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="orderType" sx={{ marginTop: 0 }}>
                Order Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="orderType"
                name="orderType"
                value={formik.values.orderType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.orderType && Boolean(formik.errors.orderType)}
                helperText={formik.touched.orderType && formik.errors.orderType}
              >
                <MenuItem value="" disabled>
                  Select Order Type
                </MenuItem>
                <MenuItem value="bulk">BULK ORDER</MenuItem>
                <MenuItem value="individual">INDIVIDUAL ORDER</MenuItem>
              </CustomSelect>
            </Grid2>

            {/* QUANTITY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="quantity" sx={{ marginTop: 0 }}>
                Quantity
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="quantity"
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Quantity"
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid2>

            {/* DELIVERY LEAD TIME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="deliveryLeadTime" sx={{ marginTop: 0 }}>
                Delivery Lead Time
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="deliveryLeadTime"
                name="deliveryLeadTime"
                value={formik.values.deliveryLeadTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Delivery Lead Time"
                error={formik.touched.deliveryLeadTime && Boolean(formik.errors.deliveryLeadTime)}
                helperText={formik.touched.deliveryLeadTime && formik.errors.deliveryLeadTime}
              />
            </Grid2>

            {/* ORDER DETAILS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="orderDetails" sx={{ marginTop: 0 }}>
                Order Details
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                id="orderDetails"
                name="orderDetails"
                value={formik.values.orderDetails}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Order Details"
                error={formik.touched.orderDetails && Boolean(formik.errors.orderDetails)}
                helperText={formik.touched.orderDetails && formik.errors.orderDetails}
              />
            </Grid2>

            {/* ASSIGNED EXECUTIVE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="assignedExecutive" sx={{ marginTop: 0 }}>
                Assigned Executive
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="assignedExecutive"
                name="assignedExecutive"
                value={formik.values.assignedExecutive}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Assigned Executive"
                error={formik.touched.assignedExecutive && Boolean(formik.errors.assignedExecutive)}
                helperText={formik.touched.assignedExecutive && formik.errors.assignedExecutive}
              />
            </Grid2>
          </Grid2>

          {/* SUBMIT */}
          <Box
            sx={{
              margin: '1rem 1.5rem 0 0',
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <Button type="submit" sx={{ marginRight: '0.5rem' }}>
              Update
            </Button>
            <Button type="button" onClick={handleClickCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default LeadEdit;
