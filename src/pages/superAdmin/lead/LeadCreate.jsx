'use client';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Grid2, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { createLead, getLastLead } from '@/api/lead.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const LeadCreate = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/lead`, title: 'Lead Management' },
    { title: 'Create' },
  ];
  const navigate = useNavigate();
  const [lastLead, setLastLead] = useState(null);
  const [loadingLastLead, setLoadingLastLead] = useState(false);

  // Fetch the last created lead
  const fetchLastLead = async () => {
    setLoadingLastLead(true);
    try {
      const data = await getLastLead();
      setLastLead(data);
    } catch (error) {
      console.error('Error fetching last lead:', error);
      toast.error('Failed to fetch last lead information');
    } finally {
      setLoadingLastLead(false);
    }
  };

  useEffect(() => {
    fetchLastLead();
  }, []);

  const formik = useFormik({
    initialValues: {
      date: '',
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
    validationSchema: Yup.object({
      date: Yup.date().nullable(),
      productType: Yup.string().required('Product Type is required'),
      customerName: Yup.string().required('Customer Name is required'),
      // mobileNo: Yup.string().required('Mobile Number is required'),
      mobileNo: Yup.string()
      .required("Mobile Number is required")
      .matches(/^[0-9]{10}$/, "Mobile Number must be exactly 10 digits"),

      leadSource: Yup.string().required('Lead Source is required'),
      company: Yup.string().required('Company is required'),
      designation: Yup.string().required('Designation is required'),
      customerType: Yup.string(),
      orderType: Yup.string(),
      quantity: Yup.number().positive('Quantity must be positive').nullable(),
      deliveryLeadTime: Yup.string(),
      orderDetails: Yup.string(),
      assignedExecutive: Yup.string(),
      purpose: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        // Convert quantity to number if provided
        const submitData = {
          ...values,
          quantity: values.quantity ? Number(values.quantity) : undefined,
        };

        const response = await createLead(submitData);
        if (response) {
          toast.success('Lead created successfully');
          navigate(`/${userType}/lead`);
        }
      } catch (error) {
        toast.error(error.message || 'Creating lead failed');
      }
    },
  });

  // Custom submit handler to show toast messages for validation errors
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = await formik.validateForm();

    // Mark all fields as touched so inline helper texts show as well
    const allTouched = Object.keys(formik.values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    formik.setTouched(allTouched, true);

    if (Object.keys(errors).length > 0) {
      // Show a toast for each validation message
      Object.values(errors).forEach((message) => {
        if (typeof message === 'string') {
          toast.error(message);
        }
      });
      return;
    }

    // No errors, proceed with the original submit logic
    formik.submitForm();
  };

  const handleClickCancel = () => {
    navigate(`/${userType}/lead`);
  };

  // Allow only digits and cap at 10 characters for mobile number
  const handleMobileChange = (event) => {
    const digitsOnly = (event.target.value || '').replace(/\D/g, '').slice(0, 10);
    formik.setFieldValue('mobileNo', digitsOnly);
  };

  const allowOnlyNumericKeys = (event) => {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];
    if (
      allowedKeys.includes(event.key) ||
      // Allow: Ctrl/Cmd + key combos (copy/paste/select all)
      (event.ctrlKey || event.metaKey)
    ) {
      return;
    }

    // Block non-digit characters
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <PageContainer title="Admin - Lead Management" description="">
      <Breadcrumb title="Lead Management" items={BCrumb} />
      <ParentCard title="Create Lead">
        {lastLead && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid #e0e0e0',
            }}
          >
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontWeight: 'bold' }}>Last Created Lead:</span>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{lastLead.leadNo}</span>
                  {lastLead.customerName && (
                    <>
                      <span style={{ mx: 1 }}>|</span>
                      <span>{lastLead.customerName}</span>
                    </>
                  )}
                  {lastLead.createdAt && (
                    <>
                      <span style={{ mx: 1 }}>|</span>
                      <span>{new Date(lastLead.createdAt).toLocaleDateString()}</span>
                    </>
                  )}
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        )}
        {loadingLastLead && (
          <Box sx={{ mb: 3, p: 2, textAlign: 'center' }}>Loading last lead information...</Box>
        )}
        <form onSubmit={handleFormSubmit}>
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
                onChange={handleMobileChange}
                onKeyDown={allowOnlyNumericKeys}
                onBlur={formik.handleBlur}
                placeholder="Enter Mobile Number"
                error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
                helperText={formik.touched.mobileNo && formik.errors.mobileNo}
                inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
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
              Submit
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

export default LeadCreate;



