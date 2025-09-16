import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Grid2,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { Stack, Box } from '@mui/system';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobCardDataById } from '@/api/admin';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { fetchProductImagesBySkuCode } from '@/api/productmaster.api';
import { markJobCardCompleted } from '@/api/jobcard.api';

const ViewJobCard = () => {
  const [jobCard, setJobCard] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const [productImages, setProductImages] = useState([]);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const role =
    user.userType[0].toLowerCase() == 'superadmin' ? 'admin' : user.userType[0].toLowerCase();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${role}/job-cards`, title: 'Job Card' },
    { title: 'Add' },
  ];

  const handleBack = () => {
    navigate(`/${role}/job-cards`);
  };

  const handleCompleteJobCard = async () => {
    setCompleting(true);
    try {
      await markJobCardCompleted(id);
      toast.success('Job Card marked as completed!');
      setCompleteDialogOpen(false);
      // Optionally, refresh or navigate
    } catch {
      toast.error('Failed to complete job card');
    } finally {
      setCompleting(false);
    }
  };

  useEffect(() => {
    async function fetchJobCardById() {
      try {
        const response = await fetchJobCardDataById(id);
        console.log('🚀 ~ fetchJobCardById ~ response:', response);
        if (response && typeof response === 'object') {
          setJobCard(response);
          const imageUrls = await fetchProductImagesBySkuCode(response.skuCode);
          console.log('🚀 ~ handleSkuChange ~ imageUrls:', imageUrls);
          setProductImages(imageUrls);
        } else {
          toast.error('Data access failed');
        }
      } catch {
        toast.error('Something went wrong');
      }
    }

    fetchJobCardById();
  }, []);

  return (
    <PageContainer title="Create Job Card" description="This is the Create Job Card page">
      <Breadcrumb title="Create Job Card" items={BCrumb} />
      {/* Complete Job Card Button and Confirmation Dialog */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-start' }}>
        {jobCard.status === 'completed' ? (
          <Typography color="success.main" fontWeight={600} sx={{ alignSelf: 'center' }}>
            Already Completed
          </Typography>
        ) : (
          <Button variant="contained" color="success" onClick={() => setCompleteDialogOpen(true)}>
            Complete Job Card
          </Button>
        )}
      </Box>
      <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)}>
        <DialogTitle>Complete Job Card</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to mark this job card as completed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)} disabled={completing}>
            No
          </Button>
          <Button
            onClick={handleCompleteJobCard}
            color="success"
            variant="contained"
            disabled={completing}
          >
            {completing ? 'Completing...' : 'Yes'}
          </Button>
        </DialogActions>
      </Dialog>
      <ParentCard title="SAMURAI EXPORTS PRIVATE LIMITED">
        <form>
          <Grid2 container>
            {/* // row 1 */}
            <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Stack>
                <CustomTextField
                  id="date"
                  name="date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={jobCard?.date?.split('T')[0] || ''}
                />
                <Typography variant="h5" textAlign="center">
                  Date
                </Typography>
              </Stack>
            </Grid2>
            <Grid2
              size={4}
              sx={{
                borderTop: '2px solid black',
                borderBottom: '2px solid black',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" textAlign="center">
                JOB CARD
              </Typography>
            </Grid2>
            <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <CustomTextField
                id="jobCardNo"
                name="jobCardNo"
                variant="outlined"
                fullWidth
                size="small"
                value={jobCard?.jobCardNo || ''}
              />
              <Typography variant="h5" textAlign="center">
                Serial Number
                <span style={{ color: 'red' }}> * </span>
              </Typography>
            </Grid2>

            {/* // row 2 */}
            <Grid2
              size={4}
              sx={{
                borderLeft: '2px solid black',
                borderRight: '2px solid black',
                borderBottom: '2px solid black',
              }}
            >
              <Grid2 container>
                <Grid2
                  size={12}
                  sx={{
                    borderBottom: '2px solid black',
                    padding: '1rem', // Add padding to create spacing before the border
                  }}
                >
                  <CustomTextField
                    id="customerName"
                    name="customerName"
                    label={
                      <span>
                        Customer Name <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.8rem' }}
                    value={jobCard?.customerName || ''}
                    InputLabelProps={{ shrink: true }}
                  />
                  <CustomTextField
                    id="customerAddress"
                    name="customerAddress"
                    label="Customer Address"
                    multiline
                    rows={6}
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={jobCard?.customerAddress || ''}
                    InputLabelProps={{ shrink: jobCard?.customerAddress ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12} sx={{ padding: '1rem', borderBottom: '2px solid black' }}>
                  <CustomTextField
                    id="paymentTerms"
                    name="paymentTerms"
                    label="Payment Terms"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={jobCard?.paymentTerms || ''}
                    InputLabelProps={{ shrink: jobCard?.paymentTerms ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12} sx={{ padding: '1rem' }}>
                  <CustomTextField
                    id="gstin"
                    name="gstin"
                    label="GSTIN"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={jobCard?.gstin || ''}
                    InputLabelProps={{ shrink: jobCard?.gstin ? true : false }}
                  />
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2 size={4} sx={{ borderBottom: '2px solid black' }}>
              <Grid2 container sx={{ padding: '1rem', borderBottom: '2px solid black' }}>
                <Grid2 size={12}>
                  <CustomTextField
                    id="dealerOrderedBy"
                    name="dealerOrderedBy"
                    label="Ordered By"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.dealerOrderedBy || ''}
                    InputLabelProps={{ shrink: jobCard?.dealerOrderedBy ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    id="dealerDesignation"
                    name="dealerDesignation"
                    label="Designation"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.dealerDesignation || ''}
                    InputLabelProps={{ shrink: jobCard?.dealerDesignation ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    id="dealerMobile"
                    name="dealerMobile"
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="tel"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.dealerMobile || ''}
                    InputLabelProps={{ shrink: jobCard?.dealerMobile ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    id="dealerEmail"
                    name="dealerEmail"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="email"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.dealerEmail || ''}
                    InputLabelProps={{ shrink: jobCard?.dealerEmail ? true : false }}
                  />
                </Grid2>
              </Grid2>
              <Grid2 container sx={{ padding: '1rem' }}>
                <Grid2 size={12}>
                  <CustomTextField
                    id="personnelOrderedBy"
                    name="personnelOrderedBy"
                    label="Ordered By"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.personnelOrderedBy || ''}
                    InputLabelProps={{ shrink: jobCard?.personnelOrderedBy ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    id="personnelDesignation"
                    name="personnelDesignation"
                    label="Designation"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.personnelDesignation || ''}
                    InputLabelProps={{ shrink: jobCard?.personnelDesignation ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    id="personnelMobile"
                    name="personnelMobile"
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="tel"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.personnelMobile || ''}
                    InputLabelProps={{ shrink: jobCard?.personnelMobile ? true : false }}
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    id="personnelEmail"
                    name="personnelEmail"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="email"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.personnelEmail || ''}
                    InputLabelProps={{ shrink: jobCard?.personnelEmail ? true : false }}
                  />
                </Grid2>
              </Grid2>
            </Grid2>
            <Grid2
              size={4}
              sx={{
                borderLeft: '2px solid black',
                borderRight: '2px solid black',
                borderBottom: '2px solid black',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
              }}
            >
              <Grid2 size={12} sx={{ padding: '1rem' }}>
                <CustomTextField
                  id="orderExecutedBy"
                  name="orderExecutedBy"
                  label="Executed By"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ marginBottom: '1rem' }}
                  value={jobCard?.orderExecutedBy || ''}
                  InputLabelProps={{ shrink: jobCard?.orderExecutedBy ? true : false }}
                />
                <CustomTextField
                  id="deliveryDate"
                  name="deliveryDate"
                  label="Delivery Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ marginBottom: '0.5rem' }}
                  value={jobCard?.deliveryDate?.split('T')[0] || ''}
                />
                <CustomTextField
                  id="orderProcessedBy"
                  name="orderProcessedBy"
                  label="Order Processed By"
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ marginBottom: '0.5rem' }}
                  value={jobCard?.orderProcessedBy || ''}
                  InputLabelProps={{ shrink: jobCard?.orderProcessedBy ? true : false }}
                />
              </Grid2>
              <Grid2 size={12}>
                <Box height="2px" width={'100%'} sx={{ backgroundColor: 'black' }}></Box>
              </Grid2>
              <Grid2 container size={12} sx={{ padding: '1rem' }} rowSpacing={2}>
                <Grid2 size={12} sx={{ marginBottom: '1rem' }}>
                  <Typography variant="h5">Product Operations</Typography>
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    label="embroidery"
                    value={jobCard?.embroidery ?? 'N/A'}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    label="printing"
                    value={jobCard?.printing ?? 'N/A'}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Grid2>
                <Grid2 size={12}>
                  <CustomTextField
                    label="gender"
                    value={jobCard?.gender ?? 'N/A'}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Grid2>
              </Grid2>
            </Grid2>

            {/* // row 3 */}
            <Grid2
              size={4}
              sx={{
                borderLeft: '2px solid black',
                borderRight: '2px solid black',
                borderBottom: '2px solid black',
              }}
            >
              <Grid2 container sx={{ padding: '1rem' }} rowSpacing={1}>
                <Grid2 size={12}>
                  <Typography variant="h5" textAlign="center">
                    Product Specification
                  </Typography>
                </Grid2>
                <Grid2
                  size={12}
                  sx={jobCard?.embroidery ? { borderBottom: '2px solid black' } : {}}
                >
                  <CustomTextField
                    id="skuCode"
                    name="skuCode"
                    label={
                      <span>
                        SKU Code <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
                    value={jobCard?.skuCode || ''}
                    InputLabelProps={{ shrink: jobCard?.skuCode ? true : false }}
                  />
                  <CustomTextField
                    id="product"
                    name="product"
                    label={
                      <span>
                        Product <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem', marginTop: '0.5rem' }}
                    value={jobCard?.product || ''}
                    InputLabelProps={{ shrink: jobCard?.product ? true : false }}
                  />
                  {productImages.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        margin: '1rem',
                      }}
                    >
                      {productImages.map((imgSrc, index) => (
                        <img
                          key={index}
                          src={imgSrc}
                          alt={`Product Preview ${index + 1}`}
                          style={{
                            width: '50px',
                            height: 'auto',
                            borderRadius: '4px',
                            objectFit: 'cover',
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <CustomTextField
                    id="description"
                    name="description"
                    label={
                      <span>
                        description <span style={{ color: 'red' }}>*</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.description || ''}
                    InputLabelProps={{ shrink: jobCard?.description ? true : false }}
                  />
                  <CustomTextField
                    id="bodyColor"
                    name="bodyColor"
                    label="Body Color"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.bodyColor || ''}
                    InputLabelProps={{ shrink: jobCard?.bodyColor ? true : false }}
                  />
                  <CustomTextField
                    id="panelColor"
                    name="panelColor"
                    label="Panel Color"
                    variant="outlined"
                    fullWidth
                    size="small"
                    sx={{ marginBottom: '0.5rem' }}
                    value={jobCard?.panelColor || ''}
                    InputLabelProps={{ shrink: jobCard?.panelColor ? true : false }}
                  />
                </Grid2>
                {jobCard?.embroidery && (
                  <>
                    <Grid2 size={12}>
                      <Typography variant="h5">Embroidery</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                      <CustomTextField
                        id="embroideryLogoChest"
                        name="embroideryLogoChest"
                        label="Logo Chest"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem', marginTop: '1rem' }}
                        value={jobCard?.embroideryLogoChest || ''}
                        InputLabelProps={{ shrink: jobCard?.embroideryLogoChest ? true : false }}
                      />
                      <CustomTextField
                        id="embroideryLogoBack"
                        name="embroideryLogoBack"
                        label="Logo Back"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '0.5rem' }}
                        value={jobCard?.embroideryLogoBack || ''}
                        InputLabelProps={{ shrink: jobCard?.embroideryLogoBack ? true : false }}
                      />
                      <CustomTextField
                        id="embroideryLogoSleeveL"
                        name="embroideryLogoSleeveL"
                        label="Logo Sleeve Left"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                        value={jobCard?.embroideryLogoSleeveL || ''}
                        InputLabelProps={{ shrink: jobCard?.embroideryLogoSleeveL ? true : false }}
                      />
                      <CustomTextField
                        id="embroideryLogoSleeveR"
                        name="embroideryLogoSleeveR"
                        label="Logo Sleeve Right"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                        value={jobCard?.embroideryLogoSleeveR || ''}
                        InputLabelProps={{ shrink: jobCard?.embroideryLogoSleeveR ? true : false }}
                      />
                      <CustomTextField
                        id="embroideryRemarks"
                        name="embroideryRemarks"
                        label="Spl Ins / Remarks"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                        value={jobCard?.embroideryRemarks || ''}
                        InputLabelProps={{ shrink: jobCard?.embroideryRemarks ? true : false }}
                      />
                    </Grid2>
                  </>
                )}
              </Grid2>
            </Grid2>
            <Grid2 size={4} sx={{ borderBottom: '2px solid black' }}>
              <Grid2 container sx={{ padding: '1rem' }} rowSpacing={1}>
                {jobCard?.printing && (
                  <>
                    <Grid2 size={12}>
                      <Typography variant="h5">Printing</Typography>
                    </Grid2>
                    <Grid2 size={12}>
                      <CustomTextField
                        id="printingLogo"
                        name="printingLogo"
                        label="Logo Chest"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem', marginTop: '1rem' }}
                        value={jobCard?.printingLogo || ''}
                        InputLabelProps={{ shrink: jobCard?.printingLogo ? true : false }}
                      />
                      <CustomTextField
                        id="printingLogoBack"
                        name="printingLogoBack"
                        label="Logo Back"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '0.5rem' }}
                        value={jobCard?.printingLogoBack || ''}
                        InputLabelProps={{ shrink: jobCard?.printingLogoBack ? true : false }}
                      />
                      <CustomTextField
                        id="printingLogoSleeveL"
                        name="printingLogoSleeveL"
                        label="Logo Sleeve Left"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                        value={jobCard?.printingLogoSleeveL || ''}
                        InputLabelProps={{ shrink: jobCard?.printingLogoSleeveL ? true : false }}
                      />
                      <CustomTextField
                        id="printingLogoSleeveR"
                        name="printingLogoSleeveR"
                        label="Logo Sleeve Right"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                        value={jobCard?.printingLogoSleeveR || ''}
                        InputLabelProps={{ shrink: jobCard?.printingLogoSleeveR ? true : false }}
                      />
                      <CustomTextField
                        id="printingRemarks"
                        name="printingRemarks"
                        label="Spl Ins / Remarks"
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ marginBottom: '1rem' }}
                        value={jobCard?.printingRemarks || ''}
                        InputLabelProps={{ shrink: jobCard?.printingRemarks ? true : false }}
                      />
                    </Grid2>
                  </>
                )}
              </Grid2>
            </Grid2>
            <Grid2
              size={4}
              sx={{
                borderLeft: '2px solid black',
                borderRight: '2px solid black',
                borderBottom: '2px solid black',
              }}
            >
              <Grid2 container sx={{ padding: '1rem' }} rowSpacing={1}>
                <Grid2 size={5}>
                  <Typography variant="h5" sx={{ display: 'inline' }}>
                    Size
                  </Typography>
                </Grid2>
                <Grid2 size={7}>
                  <Typography variant="h5" sx={{ display: 'inline' }}>
                    Quantity
                  </Typography>
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">XS</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="xs"
                    name="xs"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.xs || ''}
                    InputLabelProps={{ shrink: jobCard?.xs ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">S</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="s"
                    name="s"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.s || ''}
                    InputLabelProps={{ shrink: jobCard?.s ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">M</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="m"
                    name="m"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.m || ''}
                    InputLabelProps={{ shrink: jobCard?.m ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">L</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="l"
                    name="l"
                    type="number"
                    min="0"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.l || ''}
                    InputLabelProps={{ shrink: jobCard?.l ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">XL</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="xl"
                    name="xl"
                    type="number"
                    min="0"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.xl || ''}
                    InputLabelProps={{ shrink: jobCard?.xl ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">2XL</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="2xl"
                    name="2xl"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.['2xl'] || ''}
                    InputLabelProps={{ shrink: jobCard?.['2xl'] ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">3XL</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="3xl"
                    name="3xl"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.['3xl'] || ''}
                    InputLabelProps={{ shrink: jobCard?.['3xl'] ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">4XL</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="4xl"
                    name="4xl"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.['4xl'] || ''}
                    InputLabelProps={{ shrink: jobCard?.['4xl'] ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">5Xl</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="5xl"
                    name="5xl"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.['5xl'] || ''}
                    InputLabelProps={{ shrink: jobCard?.['5xl'] ? true : false }}
                  />
                </Grid2>
                <Grid2 size={5} sx={{ alignContent: 'center' }}>
                  <Typography variant="h6">Total</Typography>
                </Grid2>
                <Grid2 size={7}>
                  <CustomTextField
                    id="total"
                    name="total"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    value={jobCard?.total || ''}
                    InputLabelProps={{ shrink: jobCard?.total ? true : false }}
                  />
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>

          <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={3}>
            <Button type="reset" variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </Stack>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewJobCard;
