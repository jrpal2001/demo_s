'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Grid2, MenuItem, Alert } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { storeAssetVendorData } from '../../api/assetvendor';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { useState } from 'react';

const AssetVendorCreate = () => {
  const userType = useSelector(selectCurrentUserType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileError, setFileError] = useState('');

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/assetvendor`, title: 'Asset Vendor' },
    { title: 'Add' },
  ];

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      vendorId: '',
      vendorName: '',
      companyName: '',
      companyType: 'default',
      businessType: 'default',
      paymentTerms: '',
      branchName: '',
      msmeNumber: '',
      msmeCertificate: null,
      address: '',
      statePincode: '',
      phoneNumber: '',
      emailId: '',
      contactPerson: '',
      contactDesignation: '',
      vendorDesignation: '',
      pan: '',
      gst: '',
      bankAccountName: '',
      bankAccountNumber: '',
      bankAccountType: '',
      bankName: '',
      bankAddress: '',
      ifsc: '',
      productOrServiceDescription: '',
      vendorPriority: 'default',
      vendorProductDetails: 'default',
      termsConditions: '',
    },
    validationSchema: Yup.object({
      vendorId: Yup.string().required('Vendor ID is required'),
      vendorName: Yup.string().required('Vendor Name is required'),
      companyName: Yup.string().required('Company Name is required'),
      companyType: Yup.string().notOneOf(['default'], 'Company Type is required'),
      businessType: Yup.string().notOneOf(['default'], 'Business Type is required'),
      paymentTerms: Yup.string().required('Payment Terms is required'),
      branchName: Yup.string().required('Branch Name is required'),
      msmeNumber: Yup.string().when('businessType', {
        is: 'msme',
        then: () => Yup.string().required('MSME Number is required'),
        otherwise: () => Yup.string(),
      }),
      msmeCertificate: Yup.mixed().when('businessType', {
        is: 'msme',
        then: () =>
          Yup.mixed()
            .required('MSME Certificate is required')
            .test(
              'fileFormat',
              'Unsupported file format. Only PDF, PNG, and JPEG are allowed',
              (value) => {
                if (!value) return false;
                return ['application/pdf', 'image/png', 'image/jpeg'].includes(value.type);
              },
            )
            .test('fileSize', 'File size must be less than 5MB', (value) => {
              if (!value) return false;
              return value.size <= 5 * 1024 * 1024; // 5MB
            }),
        otherwise: () => Yup.mixed().nullable(),
      }),
      address: Yup.string().required('Address is required'),
      statePincode: Yup.string().required('State Pincode is required'),
      phoneNumber: Yup.string()
        .required('Phone Number is required')
        .matches(/^[0-9]{10}$/, 'Phone Number must be exactly 10 digits'),
      emailId: Yup.string().required('Email ID is required').email('Enter a valid email address'),
      contactPerson: Yup.string().required('Contact Person is required'),
      contactDesignation: Yup.string().required('Contact Designation is required'),
      vendorDesignation: Yup.string().required('Vendor Designation is required'),
      pan: Yup.string()
        .required('PAN is required')
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN format. Expected format: AAAAA9999A'),
      gst: Yup.string().required('GST is required'),
      bankAccountName: Yup.string().required('Bank Account Name is required'),
      bankAccountNumber: Yup.string()
        .required('Bank Account Number is required')
        .matches(/^[0-9]{6,18}$/, 'Bank Account Number must be 6 to 18 digits and numeric only'),
      bankAccountType: Yup.string().required('Bank Account Type is required'),
      bankName: Yup.string().required('Bank Name is required'),
      bankAddress: Yup.string().required('Bank Address is required'),
      ifsc: Yup.string().required('IFSC is required'),
      productOrServiceDescription: Yup.string().required(
        'Product / Service Description is required',
      ),
      vendorPriority: Yup.string().notOneOf(['default']).required('Vendor Priority is required'),
      vendorProductDetails: Yup.string()
        .notOneOf(['default'])
        .required('Vendor product details is required'),
      termsConditions: Yup.string().required('Terms & Conditions is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setFileError('');

        console.log('Form values before submission:', values);

        const formData = new FormData();

        // Add all form fields to FormData
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'msmeCertificate' && value) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined && value !== 'default') {
            formData.append(key, value.toString());
          }
        });

        console.log('Calling storeAssetVendorData API...');
        const response = await storeAssetVendorData(formData);
        console.log('API response:', response);

        if (response) {
          toast.success('Asset vendor added successfully');
          navigate(`/${userType}/assetvendor`);
        } else {
          toast.error('Failed to add asset vendor');
        }
      } catch (error) {
        console.error('Error submitting form:', error);

        // Handle specific error messages
        if (error.response?.data?.message) {
          if (error.response.data.message.includes('file')) {
            setFileError(error.response.data.message);
          }
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to add asset vendor: ' + (error.message || 'Unknown error'));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    setFileError('');

    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        setFileError('Invalid file type. Only PDF, PNG, and JPEG are allowed');
        event.currentTarget.value = '';
        formik.setFieldValue('msmeCertificate', null);
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFileError('File size must be less than 5MB');
        event.currentTarget.value = '';
        formik.setFieldValue('msmeCertificate', null);
        return;
      }

      formik.setFieldValue('msmeCertificate', file);
    } else {
      formik.setFieldValue('msmeCertificate', null);
    }
  };

  const handleClickCancel = () => {
    navigate(`/${userType}/assetvendor`);
  };

  return (
    <PageContainer title="Admin - Asset Vendors" description="">
      <Breadcrumb title="Asset Vendors" items={BCrumb} />
      <ParentCard title="Add Asset Vendor">
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault();
            formik.submitForm();
          }}
        >
          <Grid2 container rowSpacing={2}>
            {/* VENDOR ID*/}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorId" sx={{ marginTop: 0 }}>
                Vendor ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="vendorId"
                name="vendorId"
                value={formik.values.vendorId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Vendor ID"
                error={formik.touched.vendorId && Boolean(formik.errors.vendorId)}
                helperText={formik.touched.vendorId && formik.errors.vendorId}
              />
            </Grid2>

            {/* VENDOR NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorName" sx={{ marginTop: 0 }}>
                Vendor Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="vendorName"
                name="vendorName"
                value={formik.values.vendorName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Vendor Name"
                error={formik.touched.vendorName && Boolean(formik.errors.vendorName)}
                helperText={formik.touched.vendorName && formik.errors.vendorName}
              />
            </Grid2>

            {/* COMPANY NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="companyName" sx={{ marginTop: 0 }}>
                Company Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="companyName"
                name="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Company Name"
                error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                helperText={formik.touched.companyName && formik.errors.companyName}
              />
            </Grid2>

            {/* COMPANY TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="companyType" sx={{ marginTop: 0 }}>
                Company Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="companyType"
                name="companyType"
                value={formik.values.companyType}
                onChange={formik.handleChange}
                error={formik.touched.companyType && Boolean(formik.errors.companyType)}
              >
                <MenuItem value="default" disabled>
                  Select Company Type
                </MenuItem>
                <MenuItem value="pvt-ltd">Private Limited</MenuItem>
                <MenuItem value="ltd">Limited</MenuItem>
                <MenuItem value="proprietorship">Proprietorship</MenuItem>
                <MenuItem value="partnership">Partnership</MenuItem>
                <MenuItem value="unregistered">Unregistered</MenuItem>
                <MenuItem value="commission-agent">Commission Agent</MenuItem>
              </CustomSelect>
              {formik.touched.companyType && formik.errors.companyType && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  {formik.errors.companyType}
                </p>
              )}
            </Grid2>

            {/* BUSINESS TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="businessType" sx={{ marginTop: 0 }}>
                Business Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="businessType"
                name="businessType"
                value={formik.values.businessType}
                onChange={(e) => {
                  formik.handleChange(e);
                  if (e.target.value === 'msme') {
                    formik.setFieldValue('paymentTerms', '45 days');
                  } else {
                    // Clear MSME-related fields when not MSME
                    formik.setFieldValue('msmeNumber', '');
                    formik.setFieldValue('msmeCertificate', null);
                  }
                }}
                error={formik.touched.businessType && Boolean(formik.errors.businessType)}
              >
                <MenuItem value="default" disabled>
                  Select Business Type
                </MenuItem>
                <MenuItem value="msme">MSME</MenuItem>
                <MenuItem value="non-msme">Non-MSME</MenuItem>
                <MenuItem value="large-scale">Large Scale</MenuItem>
              </CustomSelect>
              {formik.touched.businessType && formik.errors.businessType && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  {formik.errors.businessType}
                </p>
              )}
            </Grid2>

            {/* PAYMENT TERMS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="paymentTerms" sx={{ marginTop: 0 }}>
                Payment Terms
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="paymentTerms"
                name="paymentTerms"
                value={formik.values.paymentTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Payment Terms"
                disabled={formik.values.businessType === 'msme'}
                error={formik.touched.paymentTerms && Boolean(formik.errors.paymentTerms)}
                helperText={formik.touched.paymentTerms && formik.errors.paymentTerms}
              />
            </Grid2>

            {/* MSME NUMBER - Only show if business type is MSME */}
            {formik.values.businessType === 'msme' && (
              <>
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="msmeNumber" sx={{ marginTop: 0 }}>
                    MSME Number
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="msmeNumber"
                    name="msmeNumber"
                    value={formik.values.msmeNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter MSME Number"
                    error={formik.touched.msmeNumber && Boolean(formik.errors.msmeNumber)}
                    helperText={formik.touched.msmeNumber && formik.errors.msmeNumber}
                  />
                </Grid2>

                {/* MSME CERTIFICATE UPLOAD */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="msmeCertificate" sx={{ marginTop: 0 }}>
                    MSME Certificate *
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <Box>
                    <input
                      id="msmeCertificate"
                      name="msmeCertificate"
                      type="file"
                      accept="image/png, image/jpeg, application/pdf"
                      onChange={handleFileChange}
                      onBlur={formik.handleBlur}
                      style={{
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        width: '100%',
                      }}
                    />
                    {fileError && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {fileError}
                      </Alert>
                    )}
                    {formik.touched.msmeCertificate && formik.errors.msmeCertificate && (
                      <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                        {formik.errors.msmeCertificate}
                      </p>
                    )}
                    <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                      Supported formats: PDF, PNG, JPEG (Max size: 5MB)
                    </p>
                  </Box>
                </Grid2>
              </>
            )}

            {/* Continue with other fields... */}
            {/* ADDRESS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="address" sx={{ marginTop: 0 }}>
                Address
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Address"
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid2>

            {/* STATE PINCODE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="statePincode" sx={{ marginTop: 0 }}>
                State Pincode
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="statePincode"
                name="statePincode"
                value={formik.values.statePincode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter State Pincode"
                error={formik.touched.statePincode && Boolean(formik.errors.statePincode)}
                helperText={formik.touched.statePincode && formik.errors.statePincode}
              />
            </Grid2>

            {/* PHONE NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="phoneNumber" sx={{ marginTop: 0 }}>
                Phone Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="phoneNumber"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Phone Number"
                error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
            </Grid2>

            {/* EMAIL ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="emailId" sx={{ marginTop: 0 }}>
                Email ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="emailId"
                name="emailId"
                value={formik.values.emailId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Email ID"
                error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                helperText={formik.touched.emailId && formik.errors.emailId}
              />
            </Grid2>

            {/* CONTACT PERSON */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="contactPerson" sx={{ marginTop: 0 }}>
                Contact Person
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="contactPerson"
                name="contactPerson"
                value={formik.values.contactPerson}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Contact Person"
                error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
                helperText={formik.touched.contactPerson && formik.errors.contactPerson}
              />
            </Grid2>

            {/* CONTACT DESIGNATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="contactDesignation" sx={{ marginTop: 0 }}>
                Contact Designation
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="contactDesignation"
                name="contactDesignation"
                value={formik.values.contactDesignation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Contact Designation"
                error={
                  formik.touched.contactDesignation && Boolean(formik.errors.contactDesignation)
                }
                helperText={formik.touched.contactDesignation && formik.errors.contactDesignation}
              />
            </Grid2>

            {/* VENDOR DESIGNATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorDesignation" sx={{ marginTop: 0 }}>
                Vendor Designation
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="vendorDesignation"
                name="vendorDesignation"
                value={formik.values.vendorDesignation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Vendor Designation"
                error={formik.touched.vendorDesignation && Boolean(formik.errors.vendorDesignation)}
                helperText={formik.touched.vendorDesignation && formik.errors.vendorDesignation}
              />
            </Grid2>

            {/* PAN */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="pan" sx={{ marginTop: 0 }}>
                PAN
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="pan"
                name="pan"
                value={formik.values.pan}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter PAN"
                error={formik.touched.pan && Boolean(formik.errors.pan)}
                helperText={formik.touched.pan && formik.errors.pan}
              />
            </Grid2>

            {/* GST */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="gst" sx={{ marginTop: 0 }}>
                GST
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="gst"
                name="gst"
                value={formik.values.gst}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter GST"
                error={formik.touched.gst && Boolean(formik.errors.gst)}
                helperText={formik.touched.gst && formik.errors.gst}
              />
            </Grid2>

            {/* BANK ACCOUNT NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="bankAccountName" sx={{ marginTop: 0 }}>
                Bank Account Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="bankAccountName"
                name="bankAccountName"
                value={formik.values.bankAccountName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Bank Account Name"
                error={formik.touched.bankAccountName && Boolean(formik.errors.bankAccountName)}
                helperText={formik.touched.bankAccountName && formik.errors.bankAccountName}
              />
            </Grid2>

            {/* BANK ACCOUNT NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="bankAccountNumber" sx={{ marginTop: 0 }}>
                Bank Account Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="bankAccountNumber"
                name="bankAccountNumber"
                type="number"
                value={formik.values.bankAccountNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Bank Account Number"
                error={formik.touched.bankAccountNumber && Boolean(formik.errors.bankAccountNumber)}
                helperText={formik.touched.bankAccountNumber && formik.errors.bankAccountNumber}
              />
            </Grid2>

            {/* BANK ACCOUNT TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="bankAccountType" sx={{ marginTop: 0 }}>
                Bank Account Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="bankAccountType"
                name="bankAccountType"
                value={formik.values.bankAccountType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Bank Account Type"
                error={formik.touched.bankAccountType && Boolean(formik.errors.bankAccountType)}
                helperText={formik.touched.bankAccountType && formik.errors.bankAccountType}
              />
            </Grid2>

            {/* BANK NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="bankName" sx={{ marginTop: 0 }}>
                Bank Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="bankName"
                name="bankName"
                value={formik.values.bankName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Bank Name"
                error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                helperText={formik.touched.bankName && formik.errors.bankName}
              />
            </Grid2>

            {/* BANK ADDRESS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="bankAddress" sx={{ marginTop: 0 }}>
                Bank Address
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="bankAddress"
                name="bankAddress"
                value={formik.values.bankAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Bank Address"
                error={formik.touched.bankAddress && Boolean(formik.errors.bankAddress)}
                helperText={formik.touched.bankAddress && formik.errors.bankAddress}
              />
            </Grid2>

            {/* BRANCH NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="branchName" sx={{ marginTop: 0 }}>
                Branch Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="branchName"
                name="branchName"
                value={formik.values.branchName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Branch Name"
                error={formik.touched.branchName && Boolean(formik.errors.branchName)}
                helperText={formik.touched.branchName && formik.errors.branchName}
              />
            </Grid2>

            {/* IFSC */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="ifsc" sx={{ marginTop: 0 }}>
                IFSC
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="ifsc"
                name="ifsc"
                value={formik.values.ifsc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter IFSC"
                error={formik.touched.ifsc && Boolean(formik.errors.ifsc)}
                helperText={formik.touched.ifsc && formik.errors.ifsc}
              />
            </Grid2>

            {/* PRODUCT / SERVICE DESCRIPTION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="productOrServiceDescription" sx={{ marginTop: 0 }}>
                Product / Service Description
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="productOrServiceDescription"
                name="productOrServiceDescription"
                value={formik.values.productOrServiceDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product / Service Description"
                error={
                  formik.touched.productOrServiceDescription &&
                  Boolean(formik.errors.productOrServiceDescription)
                }
                helperText={
                  formik.touched.productOrServiceDescription &&
                  formik.errors.productOrServiceDescription
                }
              />
            </Grid2>

            {/* VENDOR PRIORITY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorPriority" sx={{ marginTop: 0 }}>
                Vendor Priority
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="vendorPriority"
                name="vendorPriority"
                value={formik.values.vendorPriority}
                onChange={formik.handleChange}
                error={formik.touched.vendorPriority && Boolean(formik.errors.vendorPriority)}
              >
                <MenuItem value="default" disabled>
                  Select Vendor Priority
                </MenuItem>
                <MenuItem value="L1">L1</MenuItem>
                <MenuItem value="L2">L2</MenuItem>
                <MenuItem value="L3">L3</MenuItem>
              </CustomSelect>
              {formik.touched.vendorPriority && formik.errors.vendorPriority && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  {formik.errors.vendorPriority}
                </p>
              )}
            </Grid2>

            {/* VENDOR PRODUCT DETAILS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorProductDetails" sx={{ marginTop: 0 }}>
                Vendor Product Details
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="vendorProductDetails"
                name="vendorProductDetails"
                value={formik.values.vendorProductDetails}
                onChange={formik.handleChange}
                error={
                  formik.touched.vendorProductDetails && Boolean(formik.errors.vendorProductDetails)
                }
              >
                <MenuItem value="default" disabled>
                  Select Vendor Product Details
                </MenuItem>
                <MenuItem value="fabric-manufacturer">Fabric Manufacturer</MenuItem>
                <MenuItem value="trims-manufacturer">Trims Manufacturer</MenuItem>
                <MenuItem value="accessories-manufacturer">Accessories Manufacturer</MenuItem>
                <MenuItem value="service-providers">Service Providers</MenuItem>
                <MenuItem value="product-providers">Product Providers</MenuItem>
              </CustomSelect>
              {formik.touched.vendorProductDetails && formik.errors.vendorProductDetails && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  {formik.errors.vendorProductDetails}
                </p>
              )}
            </Grid2>

            {/* TERMS AND CONDITIONS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="termsConditions" sx={{ marginTop: 0 }}>
                Terms & Conditions
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="termsConditions"
                name="termsConditions"
                multiline
                rows={4}
                value={formik.values.termsConditions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Terms & Conditions"
                error={formik.touched.termsConditions && Boolean(formik.errors.termsConditions)}
                helperText={formik.touched.termsConditions && formik.errors.termsConditions}
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
            <Button type="submit" sx={{ marginRight: '0.5rem' }} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button type="reset" onClick={handleClickCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default AssetVendorCreate;
