'use client';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Grid2,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { createSamplePattern } from '@/api/samplepattern.api.js';
import { getAllDesignIds } from '@/api/approvedsample.api.js';

const SamplePatternCreate = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [designOptions, setDesignOptions] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);

  // Function to fetch design IDs
  const fetchDesignIds = async (searchTerm = '') => {
    setLoadingDesigns(true);
    try {
      const params = {
        search: searchTerm,
        limit: 50,
        page: 1,
      };

      const data = await getAllDesignIds(params);
      setDesignOptions(data.designIds || []);
    } catch (error) {
      console.error('Error fetching design IDs:', error);
      toast.error(error?.message || 'Failed to fetch design IDs');
    } finally {
      setLoadingDesigns(false);
    }
  };

  // Load initial design options
  useEffect(() => {
    fetchDesignIds();
  }, []);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/samplepattern`, title: 'Sample Pattern' },
    { title: 'Create' },
  ];

  const formik = useFormik({
    initialValues: {
      designId: '',
      dateOfCreation: '',
      productId: '',
      jobCardId: '',
      patternMadeBy: '',
      category: 'default',
      sizeSpecification: '',
      measurementParameters: '',
      sizeSetCreatedBy: '',
      sizeChartAttached: false,
      sizeChartFile: null,
      approvedBy: '',
      approvedDate: '',
      comments: '',
    },
    validationSchema: Yup.object({
      designId: Yup.string().required('Design ID is required'),
      dateOfCreation: Yup.string().required('Date of Creation is required'),
      productId: Yup.string().required('Product ID is required'),
      jobCardId: Yup.string().required('Job Card ID is required'),
      patternMadeBy: Yup.string().required('Pattern Made By is required'),
      category: Yup.string()
        .notOneOf(['default'], 'Please select a category')
        .required('Category is required'),
      sizeSpecification: Yup.string(),
      measurementParameters: Yup.string(),
      sizeSetCreatedBy: Yup.string(),
      sizeChartAttached: Yup.boolean(),
      sizeChartFile: Yup.mixed().when('sizeChartAttached', {
        is: true,
        then: (schema) =>
          schema.required('Size chart file is required when size chart is attached'),
        otherwise: (schema) => schema.nullable(),
      }),
      approvedBy: Yup.string(),
      approvedDate: Yup.date().nullable(),
      comments: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'sizeChartFile' && value) {
            formData.append(key, value);
          } else if (key !== 'sizeChartFile') {
            formData.append(key, value);
          }
        });

        const response = await createSamplePattern(formData);
        if (response) {
          toast.success('Sample pattern created successfully');
          navigate(`/${userType}/samplepattern`);
        }
      } catch (error) {
        toast.error('Creating sample pattern failed');
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/samplepattern`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('sizeChartFile', file);
  };

  // Handle design ID selection and auto-fill date
  const handleDesignIdChange = (event, newValue) => {
    if (newValue) {
      formik.setFieldValue('designId', newValue.designId);
      formik.setFieldValue('dateOfCreation', newValue.dateOfCreation);
    } else {
      formik.setFieldValue('designId', '');
      formik.setFieldValue('dateOfCreation', '');
    }
  };

  // Handle search input change for design IDs
  const handleDesignSearch = (event, value) => {
    if (value.length > 2 || value.length === 0) {
      fetchDesignIds(value);
    }
  };

  return (
    <PageContainer title="Admin - Sample Pattern" description="">
      <Breadcrumb title="Sample Pattern" items={BCrumb} />
      <ParentCard title="Create Sample Pattern">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* DESIGN ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="designId" sx={{ marginTop: 0 }}>
                Design ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                options={designOptions}
                getOptionLabel={(option) => option.designId}
                loading={loadingDesigns}
                onChange={handleDesignIdChange}
                onInputChange={handleDesignSearch}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    fullWidth
                    placeholder="Search and select Design ID"
                    error={formik.touched.designId && Boolean(formik.errors.designId)}
                    helperText={formik.touched.designId && formik.errors.designId}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <div style={{ fontWeight: 'bold' }}>{option.designId}</div>
                      <div style={{ fontSize: '0.875rem', color: 'gray' }}>
                        Created: {new Date(option.dateOfCreation).toLocaleDateString()}
                      </div>
                    </Box>
                  </li>
                )}
              />
            </Grid2>

            {/* DATE OF CREATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="dateOfCreation" sx={{ marginTop: 0 }}>
                Date of Creation
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="dateOfCreation"
                name="dateOfCreation"
                value={formik.values.dateOfCreation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Auto-filled when Design ID is selected"
                disabled
                error={formik.touched.dateOfCreation && Boolean(formik.errors.dateOfCreation)}
                helperText={formik.touched.dateOfCreation && formik.errors.dateOfCreation}
              />
            </Grid2>

            {/* PRODUCT ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="productId" sx={{ marginTop: 0 }}>
                Product ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="productId"
                name="productId"
                value={formik.values.productId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product ID"
                error={formik.touched.productId && Boolean(formik.errors.productId)}
                helperText={formik.touched.productId && formik.errors.productId}
              />
            </Grid2>

            {/* JOB CARD ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="jobCardId" sx={{ marginTop: 0 }}>
                Job Card ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="jobCardId"
                name="jobCardId"
                value={formik.values.jobCardId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Job Card ID"
                error={formik.touched.jobCardId && Boolean(formik.errors.jobCardId)}
                helperText={formik.touched.jobCardId && formik.errors.jobCardId}
              />
            </Grid2>

            {/* PATTERN MADE BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="patternMadeBy" sx={{ marginTop: 0 }}>
                Pattern Made By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="patternMadeBy"
                name="patternMadeBy"
                value={formik.values.patternMadeBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Pattern Made By"
                error={formik.touched.patternMadeBy && Boolean(formik.errors.patternMadeBy)}
                helperText={formik.touched.patternMadeBy && formik.errors.patternMadeBy}
              />
            </Grid2>

            {/* CATEGORY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="category" sx={{ marginTop: 0 }}>
                Category
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem value="default" disabled>
                  Select Category
                </MenuItem>
                <MenuItem value="FIRST SAMPLE">First Sample</MenuItem>
                <MenuItem value="PP SAMPLE">PP Sample</MenuItem>
                <MenuItem value="FINAL SAMPLE">Final Sample</MenuItem>
              </CustomSelect>
            </Grid2>

            {/* SIZE SPECIFICATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="sizeSpecification" sx={{ marginTop: 0 }}>
                Size Specification
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="sizeSpecification"
                name="sizeSpecification"
                value={formik.values.sizeSpecification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Size Specification"
                error={formik.touched.sizeSpecification && Boolean(formik.errors.sizeSpecification)}
                helperText={formik.touched.sizeSpecification && formik.errors.sizeSpecification}
              />
            </Grid2>

            {/* MEASUREMENT PARAMETERS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="measurementParameters" sx={{ marginTop: 0 }}>
                Measurement Parameters
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="measurementParameters"
                name="measurementParameters"
                value={formik.values.measurementParameters}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Measurement Parameters"
                error={
                  formik.touched.measurementParameters &&
                  Boolean(formik.errors.measurementParameters)
                }
                helperText={
                  formik.touched.measurementParameters && formik.errors.measurementParameters
                }
              />
            </Grid2>

            {/* SIZE SET CREATED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="sizeSetCreatedBy" sx={{ marginTop: 0 }}>
                Size Set Created By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="sizeSetCreatedBy"
                name="sizeSetCreatedBy"
                value={formik.values.sizeSetCreatedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Size Set Created By"
                error={formik.touched.sizeSetCreatedBy && Boolean(formik.errors.sizeSetCreatedBy)}
                helperText={formik.touched.sizeSetCreatedBy && formik.errors.sizeSetCreatedBy}
              />
            </Grid2>

            {/* SIZE CHART ATTACHED */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="sizeChartAttached" sx={{ marginTop: 0 }}>
                Size Chart Attached
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="sizeChartAttached"
                    name="sizeChartAttached"
                    checked={formik.values.sizeChartAttached}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                }
                label="Size Chart Attached"
              />
              {formik.touched.sizeChartAttached && formik.errors.sizeChartAttached && (
                <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px' }}>
                  {formik.errors.sizeChartAttached}
                </div>
              )}
            </Grid2>

            {/* SIZE CHART FILE */}
            {formik.values.sizeChartAttached && (
              <>
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="sizeChartFile" sx={{ marginTop: 0 }}>
                    Size Chart File
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <input
                    type="file"
                    id="sizeChartFile"
                    name="sizeChartFile"
                    onChange={handleFileChange}
                    onBlur={formik.handleBlur}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    style={{ width: '100%', padding: '8px' }}
                  />
                  {formik.touched.sizeChartFile && formik.errors.sizeChartFile && (
                    <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px' }}>
                      {formik.errors.sizeChartFile}
                    </div>
                  )}
                </Grid2>
              </>
            )}

            {/* APPROVED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="approvedBy" sx={{ marginTop: 0 }}>
                Approved By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="approvedBy"
                name="approvedBy"
                value={formik.values.approvedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Approved By"
                error={formik.touched.approvedBy && Boolean(formik.errors.approvedBy)}
                helperText={formik.touched.approvedBy && formik.errors.approvedBy}
              />
            </Grid2>

            {/* APPROVED DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="approvedDate" sx={{ marginTop: 0 }}>
                Approved Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="approvedDate"
                name="approvedDate"
                type="date"
                value={formik.values.approvedDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.approvedDate && Boolean(formik.errors.approvedDate)}
                helperText={formik.touched.approvedDate && formik.errors.approvedDate}
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

export default SamplePatternCreate;
