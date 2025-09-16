'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid2, MenuItem, Alert, CircularProgress } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { getAssetVendorById } from '../../api/assetvendor';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const AssetVendorView = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/assetvendor`, title: 'Asset Vendor' },
    { title: 'View' },
  ];

  const navigate = useNavigate();
  const { id } = useParams();
  console.log('🚀 ~ AssetVendorView ~ id:', id);

  const [vendorData, setVendorData] = useState({});
  const [loading, setLoading] = useState(true);

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
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {},
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/assetvendor`);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAssetVendorById(id);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setVendorData(response);
        formik.setValues(response);
      }
    } catch (error) {
      toast.error('Failed to fetch asset vendor data');
      console.error('Error fetching asset vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <PageContainer title="Admin - Asset Vendors" description="">
        <Breadcrumb title="Asset Vendors" items={BCrumb} />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Admin - Asset Vendors" description="">
      <Breadcrumb title="Asset Vendors" items={BCrumb} />
      <ParentCard title="View Asset Vendor">
        <form method="POST" onSubmit={formik.handleSubmit}>
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                onChange={formik.handleChange}
                disabled={true}
              >
                <MenuItem value="default" disabled>
                  Select Business Type
                </MenuItem>
                <MenuItem value="msme">MSME</MenuItem>
                <MenuItem value="non-msme">Non-MSME</MenuItem>
                <MenuItem value="large-scale">Large Scale</MenuItem>
              </CustomSelect>
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
                disabled={true}
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
                disabled={true}
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
                    disabled={true}
                  />
                </Grid2>

                {/* MSME CERTIFICATE */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="msmeCertificate" sx={{ marginTop: 0 }}>
                    MSME Certificate
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  {vendorData.msmeCertificateUrl ? (
                    <Alert severity="info">
                      <a
                        href={vendorData.msmeCertificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        📄 View MSME Certificate
                      </a>
                    </Alert>
                  ) : (
                    <Alert severity="warning">No MSME certificate uploaded</Alert>
                  )}
                </Grid2>
              </>
            )}

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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
              >
                <MenuItem value="default" disabled>
                  Select Vendor Priority
                </MenuItem>
                <MenuItem value="L1">L1</MenuItem>
                <MenuItem value="L2">L2</MenuItem>
                <MenuItem value="L3">L3</MenuItem>
              </CustomSelect>
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
                disabled={true}
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
                disabled={true}
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
            <Button type="reset" onClick={handleClickCancel}>
              Back
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default AssetVendorView;
