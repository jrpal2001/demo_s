import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Divider, Grid2, Stack, Typography } from '@mui/material';

import PageContainer from '@/components/container/PageContainer.jsx';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { dealerViewById } from '@/api/admin';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { toast } from 'react-toastify';

const ViewDealer = () => {
  const { id } = useParams();
  const [dealer, setDealer] = useState({});
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);

  const Bcrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/vendors/2`, title: 'Dealers' },
    { title: 'Add' },
  ];

  async function fetchDealer() {
    try {
      let response = await dealerViewById(id);
      if (response) {
        setDealer(response);
      } else {
        toast.error('Data fetch was not successful');
      }
    } catch (error) {
      console.log(error);
      navigate(`/${userType}/vendors/2`);
    }
  }

  useEffect(() => {
    fetchDealer();
  }, [id]);

  function handleCancel() {
    navigate(`/${userType}/vendors/2`);
  }

  return (
    <PageContainer title="Samurai - Dealer Management">
      <Breadcrumb title="Dealer Management" items={Bcrumb} />
      <ParentCard title="View Dealer">
        <Grid2 container rowSpacing={2}>
          {/* Primary Details */}
          <Grid2 size={12}>
            <Grid2 container columnSpacing={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography textAlign="center" variant="h5">
                  Primary Details
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="dealerName">
                  Dealer Name <Typography sx={{ color: 'red', display: 'inline' }}> *</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="dealerName"
                  placeholer="Enter Dealer Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.dealerName ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="typeOfEntity">
                  Type of Entity <Typography sx={{ color: 'red', display: 'inline' }}>*</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="typeOfEntity"
                  variant="outlined"
                  value={dealer?.typeOfEntity ?? 'default'}
                  fullWidth
                  size="small"
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="registeredOfficeAddress">
                  Registered Office Address
                  <Typography sx={{ color: 'red', display: 'inline' }}> *</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="registeredOfficeAddress"
                  placeholer="Enter Registered Office Address"
                  type="textfield"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.registeredOfficeAddress ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="yearOfEstablishment">
                  Year of Establishment
                </CustomFormLabel>
                <CustomTextField
                  id="yearOfEstablishment"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.yearOfEstablishment?.split('T')[0] ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="telephone">
                  Contact Number
                  <Typography sx={{ color: 'red', display: 'inline' }}>*</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="telephone"
                  placeholer="Enter Contact Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.telephone ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="websiteURL">Website URL</CustomFormLabel>
                <CustomTextField
                  id="websiteURL"
                  placeholer="Enter Website URL"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.websiteURL ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="email">
                  Email
                  <Typography sx={{ color: 'red', display: 'inline' }}>*</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="email"
                  type="email"
                  placeholer="Enter Email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  autoComplete="email"
                  value={dealer?.email}
                  disabled
                />
              </Grid2>
              <Grid2 size={12} sx={{ marginTop: '2rem' }}>
                <Divider variant="middle" sx={{ backgroundColor: '#ecf2ff' }} />
              </Grid2>
            </Grid2>
          </Grid2>
          {/* Primary Contact */}
          <Grid2 size={12}>
            <Grid2 container columnSpacing={2}>
              <Grid2 size={12}>
                <Typography textAlign="center" variant="h5">
                  Primary Contact
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="pname">Name</CustomFormLabel>
                <CustomTextField
                  id="pname"
                  placeholer="Enter Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.primaryContact?.name ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="pdesignation">Designation</CustomFormLabel>
                <CustomTextField
                  id="pdesignation"
                  placeholer="Enter Designation"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.primaryContact?.designation ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="pmobileNumber">Contact Number</CustomFormLabel>
                <CustomTextField
                  id="pmobileNumber"
                  placeholer="Enter Contact Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.primaryContact?.mobileNumber ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="pemailOrFax">Email or Fax</CustomFormLabel>
                <CustomTextField
                  id="pemailOrFax"
                  placeholer="Enter Email/Fax"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.primaryContact?.emailOrFax ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={12} sx={{ marginTop: '2rem' }}>
                <Divider variant="middle" sx={{ backgroundColor: '#ecf2ff' }} />
              </Grid2>
            </Grid2>
          </Grid2>
          {/* Point of Contact */}
          <Grid2 size={12}>
            <Grid2 container columnSpacing={2}>
              <Grid2 size={12}>
                <Typography textAlign="center" variant="h5">
                  Point of Contact - Operations
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="pname">Name</CustomFormLabel>
                <CustomTextField
                  id="oname"
                  placeholer="Enter Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.pointOfContactOperations?.name ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="odesignation">Designation</CustomFormLabel>
                <CustomTextField
                  id="odesignation"
                  placeholer="Enter Designation"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.pointOfContactOperations?.designation ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="omobileNumber">Contact Number</CustomFormLabel>
                <CustomTextField
                  id="omobileNumber"
                  placeholer="Enter Contact Number"
                  type="tel"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.pointOfContactOperations?.mobileNumber ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
                <CustomFormLabel htmlFor="oemailOrFax">Email or Fax</CustomFormLabel>
                <CustomTextField
                  id="oemailOrFax"
                  placeholer="Enter Email/Fax"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.pointOfContactOperations?.emailOrFax ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={12} sx={{ marginTop: '2rem' }}>
                <Divider variant="middle" sx={{ backgroundColor: '#ecf2ff' }} />
              </Grid2>
            </Grid2>
          </Grid2>
          {/* Registration Details */}
          <Grid2 size={12}>
            <Grid2 container columnSpacing={2}>
              <Grid2 size={12}>
                <Typography textAlign="center" variant="h5">
                  Registration Details
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
                <Box
                  sx={{
                    height: '15rem',
                    width: '25rem',
                    backgroundColor: '#bdb3b34a',
                    justifySelf: 'center',
                    marginY: '2rem',
                    padding: '0.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    overflowX: 'clip',
                  }}
                >
                  <CustomTextField
                    type="file"
                    sx={{ display: 'none' }}
                    accept="image/*,application/pdf"
                  />
                  {dealer?.registrationDetails?.supportingDocuments?.panScanCopy && (
                    <img src="" alt="pancard" style={{ height: '100%', width: '' }} />
                  )}
                </Box>
                <CustomFormLabel htmlFor="pan">
                  PAN
                  <Typography sx={{ color: 'red', display: 'inline' }}> *</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="pan"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.registrationDetails?.pan ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 6 }}>
                <Box
                  sx={{
                    height: '15rem',
                    width: '15rem',
                    justifySelf: 'center',
                    marginY: '2rem',
                    backgroundColor: '#bdb3b34a',
                    padding: '1rem',
                    display: 'flex',
                    justifyContent: 'center',
                    overflowX: 'clip',
                  }}
                >
                  <CustomTextField
                    type="file"
                    sx={{ display: 'none' }}
                    accept="image/*,application/pdf"
                  />
                  {dealer?.registrationDetails?.supportingDocuments?.gstRegistrationCopy && (
                    <img src="" alt="gst registration" style={{ height: '100%' }} />
                  )}
                </Box>
                <CustomFormLabel htmlFor="gstin">
                  GSTIN
                  <Typography sx={{ color: 'red', display: 'inline' }}> *</Typography>
                </CustomFormLabel>
                <CustomTextField
                  id="gstin"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={dealer?.registrationDetails?.gstin ?? ''}
                  disabled
                />
              </Grid2>
              <Grid2 size={12} sx={{ marginY: '1.5rem' }}>
                <Stack>
                  {dealer?.registrationDetails?.supportingDocuments?.panScanCopy && (
                    <Stack sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                      <Box
                        sx={{
                          height: '10rem',
                          width: '20rem',
                          justifySelf: 'center',
                          backgroundColor: '#bdb3b34a',
                          padding: '1rem',
                          display: 'flex',
                          justifyContent: 'end',
                          overflowX: 'clip',
                        }}
                      >
                        <img src="" alt="dealer" style={{ width: '100%' }} />
                      </Box>
                      <CustomFormLabel htmlFor="dealerSignatureWithSeal">
                        Signature with Seal
                      </CustomFormLabel>
                    </Stack>
                  )}
                </Stack>
              </Grid2>
            </Grid2>
          </Grid2>

          {/* Buttons */}
          <Grid2 size={{ xs: 12 }} sx={{ marginTop: '1rem', display: 'flex' }} justifyContent="end">
            <Button type="reset" onClick={handleCancel}>
              Back
            </Button>
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewDealer;
