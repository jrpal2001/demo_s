'use client';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Grid2, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { createApprovedSample } from '@/api/approvedsample.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';


const ApprovedSampleCreate = () => {
const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/approvedsample`, title: 'Approved Sample' },
    { title: 'Create' },
  ];
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      productId: '',
      jobCardId: '',
      productName: '',
      designId: '',
      sampleType: 'default',
      productDescription: '',
      materialsUsed: '',
      targetMarket: 'default',
      photoshootSample: false,
      materialUsed: '',
      designCreatedBy: '',
      designStatus: 'default',
      approvedStatus: 'default',
      customerReference: '',
      sampleProduced: false,
      feedbackOnDesign: '',
      mannequinShootOrTableShoot: false,
    },
    validationSchema: Yup.object({
      productId: Yup.string().required('Product ID is required'),
      jobCardId: Yup.string().required('Job Card ID is required'),
      productName: Yup.string().required('Product Name is required'),
      designId: Yup.string().required('Design ID is required'),
      sampleType: Yup.string()
        .notOneOf(['default'], 'Please select a sample type')
        .required('Sample Type is required'),
      productDescription: Yup.string(),
      materialsUsed: Yup.string(),
      targetMarket: Yup.string()
        .notOneOf(['default'], 'Please select a target market')
        .required('Target Market is required'),
      photoshootSample: Yup.boolean().required('Photoshoot Sample is required'),
      materialUsed: Yup.string(),
      designCreatedBy: Yup.string(),
      designStatus: Yup.string()
        .notOneOf(['default'], 'Please select a design status')
        .required('Design Status is required'),
      approvedStatus: Yup.string()
        .notOneOf(['default'], 'Please select an approved status')
        .required('Approved Status is required'),
      customerReference: Yup.string(),
      sampleProduced: Yup.boolean().required('Sample Produced is required'),
      feedbackOnDesign: Yup.string(),
      mannequinShootOrTableShoot: Yup.boolean().required('Mannequin/Table Shoot is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await createApprovedSample(values);
        if (response) {
          toast.success('Approved sample created successfully');
          navigate(`/${userType}/approvedsample`);
        }
      } catch (error) {
        toast.error('Creating approved sample failed');
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/approvedsample`);
  };

  return (
    <PageContainer title="Admin - Approved Sample" description="">
      <Breadcrumb title="Approved Sample" items={BCrumb} />
      <ParentCard title="Create Approved Sample">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
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

            {/* PRODUCT NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="productName" sx={{ marginTop: 0 }}>
                Product Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="productName"
                name="productName"
                value={formik.values.productName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Name"
                error={formik.touched.productName && Boolean(formik.errors.productName)}
                helperText={formik.touched.productName && formik.errors.productName}
              />
            </Grid2>

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
              <CustomTextField
                fullWidth
                id="designId"
                name="designId"
                value={formik.values.designId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Design ID"
                error={formik.touched.designId && Boolean(formik.errors.designId)}
                helperText={formik.touched.designId && formik.errors.designId}
              />
            </Grid2>

            {/* SAMPLE TYPE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="sampleType" sx={{ marginTop: 0 }}>
                Sample Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="sampleType"
                name="sampleType"
                value={formik.values.sampleType}
                onChange={formik.handleChange}
                error={formik.touched.sampleType && Boolean(formik.errors.sampleType)}
                helperText={formik.touched.sampleType && formik.errors.sampleType}
              >
                <MenuItem value="default" disabled>
                  Select Sample Type
                </MenuItem>
                <MenuItem value="FIRST SAMPLE">First Sample</MenuItem>
                <MenuItem value="PP SAMPLE">PP Sample</MenuItem>
                <MenuItem value="FINAL SAMPLE">Final Sample</MenuItem>
              </CustomSelect>
              {formik.touched.sampleType && formik.errors.sampleType && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select Sample Type
                </p>
              )}
            </Grid2>

            {/* PRODUCT DESCRIPTION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="productDescription" sx={{ marginTop: 0 }}>
                Product Description
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                id="productDescription"
                name="productDescription"
                value={formik.values.productDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Description"
                error={
                  formik.touched.productDescription && Boolean(formik.errors.productDescription)
                }
                helperText={formik.touched.productDescription && formik.errors.productDescription}
              />
            </Grid2>

            {/* MATERIALS USED */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="materialsUsed" sx={{ marginTop: 0 }}>
                Materials Used
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="materialsUsed"
                name="materialsUsed"
                value={formik.values.materialsUsed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Materials Used"
                error={formik.touched.materialsUsed && Boolean(formik.errors.materialsUsed)}
                helperText={formik.touched.materialsUsed && formik.errors.materialsUsed}
              />
            </Grid2>

            {/* TARGET MARKET */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="targetMarket" sx={{ marginTop: 0 }}>
                Target Market
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="targetMarket"
                name="targetMarket"
                value={formik.values.targetMarket}
                onChange={formik.handleChange}
                error={formik.touched.targetMarket && Boolean(formik.errors.targetMarket)}
                helperText={formik.touched.targetMarket && formik.errors.targetMarket}
              >
                <MenuItem value="default" disabled>
                  Select Target Market
                </MenuItem>
                <MenuItem value="B2B">B2B</MenuItem>
                <MenuItem value="B2C">B2C</MenuItem>
              </CustomSelect>
              {formik.touched.targetMarket && formik.errors.targetMarket && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select Target Market
                </p>
              )}
            </Grid2>

            {/* PHOTOSHOOT SAMPLE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="photoshootSample" sx={{ marginTop: 0 }}>
                Photoshoot Sample
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="photoshootSample"
                    name="photoshootSample"
                    checked={formik.values.photoshootSample}
                    onChange={formik.handleChange}
                  />
                }
                label="Photoshoot Sample"
              />
            </Grid2>

            {/* MATERIAL USED */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="materialUsed" sx={{ marginTop: 0 }}>
                Material Used
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="materialUsed"
                name="materialUsed"
                value={formik.values.materialUsed}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Material Used"
                error={formik.touched.materialUsed && Boolean(formik.errors.materialUsed)}
                helperText={formik.touched.materialUsed && formik.errors.materialUsed}
              />
            </Grid2>

            {/* DESIGN CREATED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="designCreatedBy" sx={{ marginTop: 0 }}>
                Design Created By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="designCreatedBy"
                name="designCreatedBy"
                value={formik.values.designCreatedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Design Created By"
                error={formik.touched.designCreatedBy && Boolean(formik.errors.designCreatedBy)}
                helperText={formik.touched.designCreatedBy && formik.errors.designCreatedBy}
              />
            </Grid2>

            {/* DESIGN STATUS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="designStatus" sx={{ marginTop: 0 }}>
                Design Status
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="designStatus"
                name="designStatus"
                value={formik.values.designStatus}
                onChange={formik.handleChange}
                error={formik.touched.designStatus && Boolean(formik.errors.designStatus)}
                helperText={formik.touched.designStatus && formik.errors.designStatus}
              >
                <MenuItem value="default" disabled>
                  Select Design Status
                </MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="IN PROGRESS">In Progress</MenuItem>
                <MenuItem value="FINALIZED">Finalized</MenuItem>
                <MenuItem value="UNDER REVIEW">Under Review</MenuItem>
              </CustomSelect>
              {formik.touched.designStatus && formik.errors.designStatus && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select Design Status
                </p>
              )}
            </Grid2>

            {/* APPROVED STATUS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="approvedStatus" sx={{ marginTop: 0 }}>
                Approved Status
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="approvedStatus"
                name="approvedStatus"
                value={formik.values.approvedStatus}
                onChange={formik.handleChange}
                error={formik.touched.approvedStatus && Boolean(formik.errors.approvedStatus)}
                helperText={formik.touched.approvedStatus && formik.errors.approvedStatus}
              >
                <MenuItem value="default" disabled>
                  Select Approved Status
                </MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="IN PROGRESS">In Progress</MenuItem>
                <MenuItem value="FINALIZED">Finalized</MenuItem>
                <MenuItem value="UNDER REVIEW">Under Review</MenuItem>
              </CustomSelect>
              {formik.touched.approvedStatus && formik.errors.approvedStatus && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select Approved Status
                </p>
              )}
            </Grid2>

            {/* CUSTOMER REFERENCE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="customerReference" sx={{ marginTop: 0 }}>
                Customer Reference
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="customerReference"
                name="customerReference"
                value={formik.values.customerReference}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Customer Reference"
                error={formik.touched.customerReference && Boolean(formik.errors.customerReference)}
                helperText={formik.touched.customerReference && formik.errors.customerReference}
              />
            </Grid2>

            {/* SAMPLE PRODUCED */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="sampleProduced" sx={{ marginTop: 0 }}>
                Sample Produced
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="sampleProduced"
                    name="sampleProduced"
                    checked={formik.values.sampleProduced}
                    onChange={formik.handleChange}
                  />
                }
                label="Sample Produced"
              />
            </Grid2>

            {/* FEEDBACK ON DESIGN */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="feedbackOnDesign" sx={{ marginTop: 0 }}>
                Feedback on Design
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                id="feedbackOnDesign"
                name="feedbackOnDesign"
                value={formik.values.feedbackOnDesign}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Feedback on Design"
                error={formik.touched.feedbackOnDesign && Boolean(formik.errors.feedbackOnDesign)}
                helperText={formik.touched.feedbackOnDesign && formik.errors.feedbackOnDesign}
              />
            </Grid2>

            {/* MANNEQUIN SHOOT OR TABLE SHOOT */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="mannequinShootOrTableShoot" sx={{ marginTop: 0 }}>
                Mannequin/Table Shoot
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    id="mannequinShootOrTableShoot"
                    name="mannequinShootOrTableShoot"
                    checked={formik.values.mannequinShootOrTableShoot}
                    onChange={formik.handleChange}
                  />
                }
                label="Mannequin/Table Shoot"
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

export default ApprovedSampleCreate;
