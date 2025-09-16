import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Button, Stack, Typography, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { fetchVendor } from '@/api/admin';

const ViewVendor = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [vendor, setVendor] = useState();
  const { id } = useParams();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/vendors`, title: 'Vendors' },
    { title: 'View' },
  ];

  async function fetchVendorDetails() {
    try {
      const user = await fetchVendor(id);
      if (user) {
        setVendor(user);
      } else {
        toast.error('Data was not fetched');
      }
    } catch (error) {
      toast.error('Failed to fetch vendor data');
    }
  }

  useEffect(() => {
    fetchVendorDetails();
  }, [id]);

  return (
    <PageContainer title="Vendor Management" description="">
      <Breadcrumb title="View Vendor" items={BCrumb} />
      <ParentCard title="View Vendor">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
              Vendor Details
            </Typography>
          </Grid>

          {/* Basic Vendor Information */}
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="vendorId">Vendor ID</CustomFormLabel>
            <CustomTextField
              id="vendorId"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.vendorId ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="vendorName">Vendor Name</CustomFormLabel>
            <CustomTextField
              id="vendorName"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.vendorName ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="companyName">Company Name</CustomFormLabel>
            <CustomTextField
              id="companyName"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.companyName ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="address">Address</CustomFormLabel>
            <CustomTextField
              id="address"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.address ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="phoneNumber">Phone Number</CustomFormLabel>
            <CustomTextField
              id="phoneNumber"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.phoneNumber ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="emailId">Email ID</CustomFormLabel>
            <CustomTextField
              id="emailId"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.emailId ?? ''}
              disabled
            />
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="contactPerson">Contact Person</CustomFormLabel>
            <CustomTextField
              id="contactPerson"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.contactPerson ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="designation">Designation</CustomFormLabel>
            <CustomTextField
              id="designation"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.designation ?? ''}
              disabled
            />
          </Grid>

          {/* Compliance Information */}
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
              Compliance Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="pan">PAN</CustomFormLabel>
            <CustomTextField
              id="pan"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.pan ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="gst">GST</CustomFormLabel>
            <CustomTextField
              id="gst"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.gst ?? ''}
              disabled
            />
          </Grid>

          {/* Bank Details */}
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
              Bank Details
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="bankAccountName">Bank Account Name</CustomFormLabel>
            <CustomTextField
              id="bankAccountName"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.bankAccountName ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="bankAccountNumber">Bank Account Number</CustomFormLabel>
            <CustomTextField
              id="bankAccountNumber"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.bankAccountNumber ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="bankAccountType">Bank Account Type</CustomFormLabel>
            <CustomTextField
              id="bankAccountType"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.bankAccountType ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="bankName">Bank Name</CustomFormLabel>
            <CustomTextField
              id="bankName"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.bankName ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="bankAddress">Bank Address</CustomFormLabel>
            <CustomTextField
              id="bankAddress"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.bankAddress ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="ifsc">IFSC</CustomFormLabel>
            <CustomTextField
              id="ifsc"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.ifsc ?? ''}
              disabled
            />
          </Grid>

          {/* Product/Service Information */}
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
              Product/Service Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="productOrServiceDescription">
              Product/Service Description
            </CustomFormLabel>
            <CustomTextField
              id="productOrServiceDescription"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.productOrServiceDescription ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="vendorPriority">Vendor Priority</CustomFormLabel>
            <CustomTextField
              id="vendorPriority"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.vendorPriority ?? ''}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
            <CustomFormLabel htmlFor="vendorProductDetails">Vendor Product Details</CustomFormLabel>
            <CustomTextField
              id="vendorProductDetails"
              variant="outlined"
              fullWidth
              size="small"
              value={vendor?.vendorProductDetails ?? ''}
              disabled
            />
          </Grid>

          {/* Terms and Conditions */}
          <Grid item xs={12}>
            <Divider sx={{ backgroundColor: '#1651b1', marginTop: '25px' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" textAlign="center" sx={{ marginBottom: '-10px' }}>
              Terms and Conditions
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel htmlFor="termsConditions">Terms & Conditions</CustomFormLabel>
            <CustomTextField
              id="termsConditions"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              size="small"
              value={vendor?.termsConditions ?? ''}
              disabled
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="end">
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => navigate(`/${userType}/vendors`)}
              >
                Back
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewVendor;
