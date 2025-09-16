'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid2 } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import PageContainer from '@/components/container/PageContainer';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { fetchVendor } from '@/api/admin';

const ViewVendor = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  console.log('🚀 ~ ViewVendor ~ id:', id);
  const [vendorData, setVendorData] = useState({});

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object({}),
    onSubmit: async () => {},
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/vendor`);
  };

  const getCompanyTypeDisplay = (value) => {
    const reverseMap = {
      'pvt-ltd': 'Private Limited',
      ltd: 'Limited',
      proprietorship: 'Proprietorship',
      partnership: 'Partnership',
      unregistered: 'Unregistered',
      'commission-agent': 'Commission Agent',
    };
    return reverseMap[value] || value;
  };

  const getBusinessTypeDisplay = (value) => {
    const reverseMap = {
      msme: 'MSME',
      'non-msme': 'Non-MSME',
      'large-scale': 'Large Scale',
    };
    return reverseMap[value] || value;
  };

  const getVendorPriorityDisplay = (value) => {
    const priorityMap = {
      L1: 'L 1',
      L2: 'L 2',
      L3: 'L 3',
    };
    return priorityMap[value] || value;
  };

  const getVendorProductDetailsDisplay = (value) => {
    const productMap = {
      'fabric-manufacturer': 'Fabric Manufacturer',
      'trims-manufacturer': 'Trims Manufacturer',
      'accessories-manufacturer': 'Accessories Manufacturer',
      'service-providers': 'Service Providers',
      'product-providers': 'Product Providers',
    };
    return productMap[value] || value;
  };

  const fetchData = async () => {
    try {
      const response = await fetchVendor(id);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setVendorData(response);
        const mappedResponse = {
          ...response,
          companyType: response.companyType || '',
          businessType: response.businessType || '',
          msmeCertificate: response.msmeCertificate || '',
        };
        formik.setValues(mappedResponse);
      }
    } catch (error) {
      toast.error('Failed to fetch vendor data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/vendor`, title: 'Vendor' },
    { title: 'View' },
  ];

  return (
    <PageContainer title="Admin - Vendors" description="">
      <Breadcrumb title="Vendors" items={BCrumb} />
      <ParentCard title="View Vendor">
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
              <CustomTextField
                fullWidth
                id="companyType"
                name="companyType"
                value={getCompanyTypeDisplay(formik.values.companyType)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Company Type"
                disabled={true}
              />
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
              <CustomTextField
                fullWidth
                id="businessType"
                name="businessType"
                value={getBusinessTypeDisplay(formik.values.businessType)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Business Type"
                disabled={true}
              />
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
                  {vendorData.msmeCertificate || vendorData.msmeCertificateUrl ? (
                    <a
                      href={vendorData.msmeCertificate || vendorData.msmeCertificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Certificate
                    </a>
                  ) : (
                    <span>No certificate uploaded</span>
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
                placeholder="Enter Bank Acccount Type"
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
              <CustomTextField
                fullWidth
                id="vendorPriority"
                name="vendorPriority"
                value={getVendorPriorityDisplay(formik.values.vendorPriority)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Vendor Priority"
                disabled={true}
              />
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
              <CustomTextField
                fullWidth
                id="vendorProductDetails"
                name="vendorProductDetails"
                value={getVendorProductDetailsDisplay(formik.values.vendorProductDetails)}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Vendor Product Details"
                disabled={true}
              />
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
                type="text"
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

export default ViewVendor;
