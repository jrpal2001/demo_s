'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Grid2,
  MenuItem,
  Chip,
  OutlinedInput,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { toast } from 'react-toastify';
import { createSampleJobCard, getLastSampleJobCard } from '@/api/sampleJobCard.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const SampleJobCardCreate = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [lastJobCard, setLastJobCard] = useState(null);
  const [loadingLastJobCard, setLoadingLastJobCard] = useState(false);

  // Fetch the last created job card
  const fetchLastJobCard = async () => {
    setLoadingLastJobCard(true);
    try {
      const data = await getLastSampleJobCard();
      setLastJobCard(data);
    } catch (error) {
      console.error('Error fetching last job card:', error);
      toast.error('Failed to fetch last job card information');
    } finally {
      setLoadingLastJobCard(false);
    }
  };

  useEffect(() => {
    fetchLastJobCard();
  }, []);

  const formik = useFormik({
    initialValues: {
      executiveName: '',
      color: '',
      size: [],
      style: '',
      qty: '',
      fabricQuality: '',
      sampleDeliveryDate: '',
      comments: '',
      issuedBy: '',
      receivedBy: '',
      creationDate: '',
    },
    validationSchema: Yup.object({
      executiveName: Yup.string().required('Executive Name is required'),
      color: Yup.string().required('Color is required'),
      size: Yup.array().min(1, 'At least one size must be selected').required('Size is required'),
      style: Yup.string().required('Style is required'),
      qty: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
      fabricQuality: Yup.string().required('Fabric Quality is required'),
      sampleDeliveryDate: Yup.date().required('Sample Delivery Date is required'),
      comments: Yup.string(),
      issuedBy: Yup.string().required('Issued By is required'),
      receivedBy: Yup.string(),
      creationDate: Yup.date().nullable(),
    }),
    onSubmit: async (values) => {
      try {
        const submitData = {
          ...values,
          qty: Number(values.qty),
        };

        const response = await createSampleJobCard(submitData);
        if (response) {
          toast.success('Sample job card created successfully');
          navigate(`/${userType}/samplejobcard`);
        }
      } catch (error) {
        toast.error(error.message || 'Creating sample job card failed');
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/samplejobcard`);
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    formik.setFieldValue('size', typeof value === 'string' ? value.split(',') : value);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/samplejobcard`, title: 'Sample Job Card Management' },
    { title: 'Create' },
  ];

  return (
    <PageContainer title="Admin - Sample Job Card Management" description="">
      <Breadcrumb title="Sample Job Card Management" items={BCrumb} />
      <ParentCard title="Create Sample Job Card">
        {lastJobCard && (
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
                  <span style={{ fontWeight: 'bold' }}>Last Created Job Card:</span>
                  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {lastJobCard.jobCardNo}
                  </span>
                  {lastJobCard.executiveName && (
                    <>
                      <span style={{ mx: 1 }}>|</span>
                      <span>{lastJobCard.executiveName}</span>
                    </>
                  )}
                  {lastJobCard.createdAt && (
                    <>
                      <span style={{ mx: 1 }}>|</span>
                      <span>{new Date(lastJobCard.createdAt).toLocaleDateString()}</span>
                    </>
                  )}
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        )}

        {loadingLastJobCard && (
          <Box sx={{ mb: 3, p: 2, textAlign: 'center' }}>Loading last job card information...</Box>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* EXECUTIVE NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="executiveName" sx={{ marginTop: 0 }}>
                Executive Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="executiveName"
                name="executiveName"
                value={formik.values.executiveName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Executive Name"
                error={formik.touched.executiveName && Boolean(formik.errors.executiveName)}
                helperText={formik.touched.executiveName && formik.errors.executiveName}
              />
            </Grid2>

            {/* COLOR */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="color" sx={{ marginTop: 0 }}>
                Color
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Color"
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
              />
            </Grid2>

            {/* SIZE (Multi-select) */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="size" sx={{ marginTop: 0 }}>
                Size
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControl fullWidth error={formik.touched.size && Boolean(formik.errors.size)}>
                <InputLabel id="size-label">Select Sizes</InputLabel>
                <Select
                  labelId="size-label"
                  id="size"
                  multiple
                  value={formik.values.size}
                  onChange={handleSizeChange}
                  input={<OutlinedInput label="Select Sizes" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value.toUpperCase()} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {SIZES.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.size && formik.errors.size && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5, ml: 2 }}>
                    {formik.errors.size}
                  </Box>
                )}
              </FormControl>
            </Grid2>

            {/* STYLE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="style" sx={{ marginTop: 0 }}>
                Style
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="style"
                name="style"
                value={formik.values.style}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Style"
                error={formik.touched.style && Boolean(formik.errors.style)}
                helperText={formik.touched.style && formik.errors.style}
              />
            </Grid2>

            {/* QUANTITY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="qty" sx={{ marginTop: 0 }}>
                Quantity
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="qty"
                name="qty"
                type="number"
                value={formik.values.qty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Quantity"
                error={formik.touched.qty && Boolean(formik.errors.qty)}
                helperText={formik.touched.qty && formik.errors.qty}
              />
            </Grid2>

            {/* FABRIC QUALITY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="fabricQuality" sx={{ marginTop: 0 }}>
                Fabric Quality
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="fabricQuality"
                name="fabricQuality"
                value={formik.values.fabricQuality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Fabric Quality"
                error={formik.touched.fabricQuality && Boolean(formik.errors.fabricQuality)}
                helperText={formik.touched.fabricQuality && formik.errors.fabricQuality}
              />
            </Grid2>

            {/* SAMPLE DELIVERY DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="sampleDeliveryDate" sx={{ marginTop: 0 }}>
                Sample Delivery Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="sampleDeliveryDate"
                name="sampleDeliveryDate"
                type="date"
                value={formik.values.sampleDeliveryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.sampleDeliveryDate && Boolean(formik.errors.sampleDeliveryDate)
                }
                helperText={formik.touched.sampleDeliveryDate && formik.errors.sampleDeliveryDate}
              />
            </Grid2>

            {/* COMMENTS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="comments" sx={{ marginTop: 0 }}>
                Comments
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                id="comments"
                name="comments"
                value={formik.values.comments}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Comments"
                error={formik.touched.comments && Boolean(formik.errors.comments)}
                helperText={formik.touched.comments && formik.errors.comments}
              />
            </Grid2>

            {/* ISSUED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="issuedBy" sx={{ marginTop: 0 }}>
                Issued By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="issuedBy"
                name="issuedBy"
                value={formik.values.issuedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Issued By"
                error={formik.touched.issuedBy && Boolean(formik.errors.issuedBy)}
                helperText={formik.touched.issuedBy && formik.errors.issuedBy}
              />
            </Grid2>

            {/* RECEIVED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="receivedBy" sx={{ marginTop: 0 }}>
                Received By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="receivedBy"
                name="receivedBy"
                value={formik.values.receivedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Received By"
                error={formik.touched.receivedBy && Boolean(formik.errors.receivedBy)}
                helperText={formik.touched.receivedBy && formik.errors.receivedBy}
              />
            </Grid2>

            {/* CREATION DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="creationDate" sx={{ marginTop: 0 }}>
                Creation Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="creationDate"
                name="creationDate"
                type="date"
                value={formik.values.creationDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.creationDate && Boolean(formik.errors.creationDate)}
                helperText={formik.touched.creationDate && formik.errors.creationDate}
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

export default SampleJobCardCreate;
