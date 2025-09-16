import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Grid,
  Button,
  Stack,
  MenuItem,
  FormControl,
  FormHelperText,
  Avatar,
  Box,
  IconButton,
  Typography,
  Divider,
  Input,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';

import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import ParentCard from '@/components/shared/ParentCard';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '@/utils/axios';
import axios from 'axios';
import { fetchVendor, UpdateVendor } from '@/api/admin';
import Spinner from '@/components/common/spinner/Spinner';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditVendor = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendor, setVendor] = useState();
  const { id } = useParams();
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/vendors`, title: 'Vendors' },
    { title: 'Edit' },
  ];

  async function fetchVendorDetails() {
    try {
      const user = await fetchVendor(id);
      if (user) {
        Object.entries(user).map(([key, value]) => {
          if (value !== null && value !== undefined && typeof value == 'object') {
            Object.entries(value).map(([nestedKey, nestedValue]) => {
              if (nestedKey == 'dateOfEstablishment') {
                const formattedDate = new Date(nestedValue).toISOString().split('T');
                setValue(nestedKey, formattedDate[0]);
              } else {
                setValue(nestedKey, nestedValue);
              }
            });
          } else {
            setValue(key, value);
          }
        });
      }
      setVendor(user);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  async function onSubmit(data) {
    try {
      setIsSubmitting(true);
      const newData = {};
      if (vendor) {
        Object.entries(vendor).map(([key, value]) => {
          if (value !== null && value !== undefined && typeof value === 'object') {
            Object.entries(value).map(([nestedKey, nestedValue]) => {
              if (
                nestedKey == 'dateOfEstablishment' &&
                nestedValue !== new Date(data[nestedKey]).toISOString()
              ) {
                newData[nestedKey] = new Date(data[nestedKey]).toISOString();
              } else if (
                nestedKey !== 'dateOfEstablishment' &&
                nestedKey !== 'existingVendors' &&
                nestedValue !== data[nestedKey]
              ) {
                newData[nestedKey] = data[nestedKey];
              } else if (nestedKey == 'existingVendors') {
                if (vendor[key][nestedKey].length > 0) {
                  const array = vendor[key][nestedKey].map((elem, index) => {
                    if (index == 0 && elem !== data.existingVendors1) {
                      return data.existingVendors1;
                    } else if (index == 1 && elem !== data.existingVendors2) {
                      return data.existingVendors2;
                    } else if (index == 2 && elem !== data.existingVendors3) {
                      return data.existingVendors3;
                    } else {
                      return elem;
                    }
                  });
                  const lat = array.filter((val) => val !== '');
                  if (lat.length > 0) {
                    newData[nestedKey] = lat;
                  }
                } else if (
                  data.existingVendors1 ||
                  data.existingVendors2 ||
                  data.existingVendors3
                ) {
                  const ary = [
                    data.existingVendors1,
                    data.existingVendors2,
                    data.existingVendors3,
                  ].filter((val) => val !== '');
                  if (ary.length > 0) {
                    newData[nestedKey] = ary;
                  }
                }
              }
            });
          } else if (vendor[key] !== data[key]) {
            newData[key] = data[key];
          }
        });
        if (Object.keys(newData).length > 0) {
          const editedData = await UpdateVendor(id, newData);
          if (editedData) {
            navigate(`/${userType}/vendors`);
            toast.success('Vendor updated successfully');
          }
        } else {
          toast.warn('No field was changed');
        }
      } else {
        toast.error('Please wait data is loading');
      }
    } catch (error) {
      error?.data?.map((err) => {
        setError(err.field, { type: 'manual', message: err.message });
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function capitalize(event) {
    return (event.target.value = event.target.value.toUpperCase());
  }

  async function handleIFSC(event) {
    if (event.target.value.length > 10) {
      const response = await axios.get(`https://ifsc.razorpay.com/${event.target.value}`);
      if (response) {
        setValue('bankName', response.data.BANK);
        setValue('bankAddress', response.data.ADDRESS);
        if (response.data.SWIFT) {
          setValue('swiftCode', response.data.SWIFT);
        }
      }
    }
    return capitalize(event);
  }

  return (
    <PageContainer title="Samurai - Vendor Management">
      <Breadcrumb title="Edit Vendor" items={BCrumb} />
      <ParentCard title="Edit Vendor">
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
                  Company Details
                </Typography>
              </Grid>
              {/* Company Information */}
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="companyName">Company Name</CustomFormLabel>
                <CustomTextField
                  id="companyName"
                  placeholder="Enter company name"
                  {...register('companyName')}
                  defaultValue={vendor?.companyName}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="address">Address</CustomFormLabel>
                <CustomTextField
                  id="address"
                  placeholder="Enter address"
                  {...register('address')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="state">State</CustomFormLabel>
                <CustomTextField
                  id="state"
                  placeholder="Enter state"
                  {...register('state')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="pinCode">Pin Code</CustomFormLabel>
                <CustomTextField
                  id="pinCode"
                  type="number"
                  onInput={(event) =>
                    (event.target.value = event.target.value.replace(/[^0-9\-]/, ''))
                  }
                  placeholder="Enter pin code"
                  {...register('pinCode')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.pinCode}
                  helperText={errors.pinCode?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="phoneNo">Phone Number</CustomFormLabel>
                <CustomTextField
                  id="phoneNo"
                  placeholder="Enter phone number"
                  type="tel"
                  onInput={(event) =>
                    (event.target.value = event.target.value.replace(/[^0-9\+\-]/, ''))
                  }
                  {...register('phoneNo', {
                    required: 'Phone number is required',
                    // pattern: {
                    //     value: /^(\+\d{2})?\d{10}$/,
                    //     message: "Please enter 10 digits"
                    // }
                  })}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="companyWebsite">Company Website</CustomFormLabel>
                <CustomTextField
                  id="companyWebsite"
                  type="url"
                  placeholder="Enter website (optional)"
                  {...register('companyWebsite')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.companyWebsite}
                  helperText={errors.companyWebsite?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="companyType">Company Type</CustomFormLabel>
                <CustomSelect
                  id="companyType"
                  {...register('companyType')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  defaultValue={vendor?.companyType ?? 'default'}
                  error={!!errors.companyType}
                >
                  <MenuItem value="default" disabled>
                    Select Company Type
                  </MenuItem>
                  <MenuItem value="Proprietor">Proprietor</MenuItem>
                  <MenuItem value="Partnership">Partnership</MenuItem>
                  <MenuItem value="Limited Co">Limited Co</MenuItem>
                  <MenuItem value="Private Limited">Private Limited</MenuItem>
                </CustomSelect>
                <FormHelperText
                  sx={{ color: '#FA896B', fontWeight: 400, margin: '4px 14px 0 14px' }}
                >
                  {errors.companyType?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="vendorCode">Vendor Code</CustomFormLabel>
                <CustomTextField
                  id="vendorCode"
                  placeholder="Enter vendor code"
                  type="text" // Assuming vendor code is alphanumeric
                  onInput={
                    (event) =>
                      (event.target.value = event.target.value.replace(/[^a-zA-Z0-9\-]/, '')) // Only allow alphanumeric characters and hyphens
                  }
                  {...register('vendorCode', {
                    required: 'Vendor code is required',
                    pattern: {
                      value: /^[a-zA-Z0-9\-]+$/, // Allow alphanumeric characters and hyphens only
                      message: 'Vendor code must be alphanumeric or contain hyphens',
                    },
                  })}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.vendorCode}
                  helperText={errors.vendorCode?.message}
                />
              </Grid>

              {/* Primary Contact Information */}
              <Grid item xs={12}>
                <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
                  Primary Contact Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="proprietorOrDirectorName">
                  Proprietor/Director Name
                </CustomFormLabel>
                <CustomTextField
                  id="proprietorOrDirectorName"
                  placeholder="Enter name"
                  {...register('proprietorOrDirectorName')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.proprietorOrDirectorName}
                  helperText={errors.proprietorOrDirectorName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="contactNumber">Contact Number</CustomFormLabel>
                <CustomTextField
                  id="contactNumber"
                  type="tel"
                  onInput={(event) =>
                    (event.target.value = event.target.value.replace(/[^0-9\+\-]/, ''))
                  }
                  placeholder="Enter contact number"
                  {...register('contactNumber', {
                    required: 'Contact number is required',
                    pattern: {
                      value: /^(\+{1}\d{2})?\d{10}$/,
                      message: 'Contact number should be 10 digits',
                    },
                  })}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="emailId">Email ID</CustomFormLabel>
                <CustomTextField
                  id="emailId"
                  placeholder="Enter email ID"
                  type="email"
                  {...register('emailId')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.emailId}
                  helperText={errors.emailId?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="groupEmailId">Group Email ID</CustomFormLabel>
                <CustomTextField
                  id="groupEmailId"
                  type="email"
                  placeholder="Enter group email ID"
                  {...register('groupEmailId')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.groupEmailId}
                  helperText={errors.groupEmailId?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="communicationPersonName">
                  Communication Person Name
                </CustomFormLabel>
                <CustomTextField
                  id="communicationPersonName"
                  placeholder="Enter communication person name"
                  {...register('communicationPersonName')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.communicationPersonName}
                  helperText={errors.communicationPersonName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="designation">Designation</CustomFormLabel>
                <CustomTextField
                  id="designation"
                  placeholder="Enter designation"
                  {...register('designation')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.designation}
                  helperText={errors.designation?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="additionalContactNumber">
                  Additional Contact Number
                </CustomFormLabel>
                <CustomTextField
                  id="additionalContactNumber"
                  placeholder="Enter additional contact number"
                  {...register('additionalContactNumber', {
                    pattern: {
                      value: /^(\+{1}\d{2})?\d{10}$/,
                      message: 'Contact number should be 10 digits',
                    },
                  })}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.additionalContactNumber}
                  helperText={errors.additionalContactNumber?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="additionalEmailId">Additional Email ID</CustomFormLabel>
                <CustomTextField
                  id="additionalEmailId"
                  placeholder="Enter additional email ID"
                  {...register('additionalEmailId')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.additionalEmailId}
                  helperText={errors.additionalEmailId?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="website">Website</CustomFormLabel>
                <CustomTextField
                  id="website"
                  placeholder="Enter website"
                  {...register('website')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.website}
                  helperText={errors.website?.message}
                />
              </Grid>

              {/* Bank Details */}
              <Grid item xs={12}>
                <Divider
                  sx={{ backgroundColor: '#1651b1', marginTop: '25px' }}
                  aria-hidden="true"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
                  Company Bank Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="accountName">Bank Account Name</CustomFormLabel>
                <CustomTextField
                  id="accountName"
                  placeholder="Enter account name"
                  {...register('accountName')}
                  variant="outlined"
                  onInput={capitalize}
                  fullWidth
                  size="small"
                  error={!!errors.accountName}
                  helperText={errors.accountName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="accountNumber">Bank Account Number</CustomFormLabel>
                <CustomTextField
                  id="accountNumber"
                  type="number"
                  placeholder="Enter account number"
                  {...register('accountNumber')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="accountType">Bank Account Type</CustomFormLabel>
                <CustomSelect
                  id="accountType"
                  {...register('accountType')}
                  defaultValue={vendor?.bankDetails?.accountType ?? 'default'}
                  fullWidth
                  variant="outlined"
                  size="small"
                  error={!!errors.accountType}
                >
                  <MenuItem value="default" disabled>
                    Select Account Type
                  </MenuItem>
                  <MenuItem value="savings">Savings</MenuItem>
                  <MenuItem value="current">Current</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </CustomSelect>
                <FormHelperText
                  sx={{ color: '#FA896B', fontWeight: 400, margin: '4px 14px 0 14px' }}
                >
                  {errors.accountType?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="bankName">Bank Name</CustomFormLabel>
                <CustomTextField
                  id="bankName"
                  placeholder="Enter bank name"
                  onInput={capitalize}
                  {...register('bankName')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.bankName}
                  helperText={errors.bankName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="bankAddress">Bank Address</CustomFormLabel>
                <CustomTextField
                  id="bankAddress"
                  type="textarea"
                  placeholder="Enter bank address"
                  {...register('bankAddress')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.bankAddress}
                  helperText={errors.bankAddress?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="ifscCode">IFSC Code</CustomFormLabel>
                <CustomTextField
                  id="ifscCode"
                  placeholder="Enter IFSC Code"
                  onInput={handleIFSC}
                  {...register('ifscCode')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="swiftCode">Swift Code</CustomFormLabel>
                <CustomTextField
                  id="swiftCode"
                  placeholder="Enter swift code"
                  onInput={(event) => (event.target.value = event.target.value.toUpperCase())}
                  {...register('swiftCode')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.swiftCode}
                  helperText={errors.swiftCode?.message}
                />
              </Grid>

              {/* Company Info */}
              <Grid item xs={12}>
                <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
                  Company Info
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="dateOfEstablishment">
                  Date of Establishment
                </CustomFormLabel>
                <CustomTextField
                  id="dateOfEstablishment"
                  type="date"
                  {...register('dateOfEstablishment')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.dateOfEstablishment}
                  helperText={errors.dateOfEstablishment?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="numberOfEmployees">Number of Employees</CustomFormLabel>
                <CustomTextField
                  id="numberOfEmployees"
                  type="number"
                  placeholder="Enter number of employees"
                  {...register('numberOfEmployees')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.numberOfEmployees}
                  helperText={errors.numberOfEmployees?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="existingVendors1">Vendor 1</CustomFormLabel>
                <CustomTextField
                  id="existingVendors1"
                  placeholder="Enter vendor name"
                  {...register('existingVendors1')}
                  defaultValue={vendor?.companyInfo?.existingVendors?.[0]}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.existingVendors1}
                  helperText={errors.existingVendors1?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="existingVendors2">Vendor 2</CustomFormLabel>
                <CustomTextField
                  id="existingVendors2"
                  placeholder="Enter vendor name"
                  {...register('existingVendors2')}
                  defaultValue={vendor?.companyInfo?.existingVendors?.[1]}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.existingVendors2}
                  helperText={errors.existingVendors2?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="existingVendors3">Vendor 3</CustomFormLabel>
                <CustomTextField
                  id="existingVendors3"
                  placeholder="Enter vendor name"
                  {...register('existingVendors3')}
                  defaultValue={vendor?.companyInfo?.existingVendors?.[2]}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.existingVendors3}
                  helperText={errors.existingVendors3?.message}
                />
              </Grid>

              {/* Compliance Info */}
              <Grid item xs={12}>
                <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
                  Compliance Info
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="panNumber">PAN Number</CustomFormLabel>
                <CustomTextField
                  id="panNumber"
                  placeholder="Enter PAN number"
                  onInput={capitalize}
                  {...register('panNumber')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.panNumber}
                  helperText={errors.panNumber?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="gstin">GSTIN</CustomFormLabel>
                <CustomTextField
                  id="gstin"
                  placeholder="Enter GSTIN"
                  onInput={capitalize}
                  {...register('gstin')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.gstin}
                  helperText={errors.gstin?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="certificateOfIncorporationNo">
                  Certificate of Incorporation Number
                </CustomFormLabel>
                <CustomTextField
                  id="certificateOfIncorporationNo"
                  placeholder="Enter Incorporation Certificate Number"
                  {...register('certificateOfIncorporationNo')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.certificateOfIncorporationNo}
                  helperText={errors.certificateOfIncorporationNo?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="msmeCertificateNo">
                  MSME Certificate Number
                </CustomFormLabel>
                <CustomTextField
                  id="msmeCertificateNo"
                  placeholder="Enter MSME Certificate Number"
                  {...register('msmeCertificateNo')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.msmeCertificateNo}
                  helperText={errors.msmeCertificateNo?.message}
                />
              </Grid>

              {/* Authorized Seal & Signature */}
              <Grid item xs={12} sm={6} lg={4}>
                <CustomFormLabel htmlFor="authorizedSealAndSignature">
                  Authorized Seal & Signature
                </CustomFormLabel>
                <CustomTextField
                  id="authorizedSealAndSignature"
                  placeholder="Upload signature (optional)"
                  type="file"
                  accept="image/*"
                  {...register('authorizedSealAndSignature')}
                  variant="outlined"
                  fullWidth
                  size="small"
                  error={!!errors.authorizedSealAndSignature}
                  helperText={errors.authorizedSealAndSignature?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="end">
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => navigate(`/${userType}/vendors`)}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={isSubmitting}
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default EditVendor;
