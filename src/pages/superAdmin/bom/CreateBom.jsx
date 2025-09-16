'use client';

import { useState, useCallback } from 'react';
import { useFormik } from 'formik';
import { Box, Button, Grid, MenuItem } from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import Fabric from './components/Fabric';
import Accessories from './components/Accessories';
import Trims from './components/Trims';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { api } from '@/utils/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getValidationSchema } from '@/validations/bomValidations';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice'

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'BOM' }];

// Get initial values based on category and subcategory
const getInitialValues = (category = 'default', subCategory = null) => {
  const baseValues = {
    category,
    hsn: '',
    uom: 'default',
    price: '',
    image: null,
  };

  if (category === 'trims') {
    return {
      ...baseValues,
      trimsName: '',
      trimsColor: '',
      trimsSize: '',
      trimsCode: '',
      subCategory: '',
    };
  }

  if (category === 'accessories') {
    return {
      ...baseValues,
      accessoriesName: '',
      accessoriesColor: '',
      accessoriesSize: '',
      accessoriesCode: '',
      subCategory: '',
    };
  }

  if (category === 'fabric') {
    const fabricValues = {
      ...baseValues,
      fabricName: '',
      fabricColor: '',
      fabricCode: '',
      gsm: '',
      dia: '',
      yarnComposition: '',
      fabricStructure: '',
      fabricType: '',
      subCategory: subCategory || 'mainfabric',
    };

    // Only add collar fields if subcategory is "colar"
    if (subCategory === 'colar') {
      fabricValues.collarHeight = '';
      fabricValues.collarLength = '';
      fabricValues.tapeHeight = '';
    }

    return fabricValues;
  }

  return baseValues;
};

const CreateBom = () => {
const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [category, setCategory] = useState('default');
  const [subCategory, setSubCategory] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const formik = useFormik({
    initialValues: getInitialValues(category, subCategory),
    validationSchema: getValidationSchema(category, subCategory),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        // Only include fields that should exist for this category/subcategory
        Object.keys(values).forEach((key) => {
          if (key !== 'image') {
            // For fabric category, only include collar fields if subcategory is "colar"
            if (['collarHeight', 'collarLength', 'tapeHeight'].includes(key)) {
              if (values.category === 'fabric' && values.subCategory === 'colar' && values[key]) {
                formData.append(key, values[key]);
              }
              // Skip collar fields for non-collar subcategories
            } else {
              formData.append(key, values[key]);
            }
          }
        });

        if (values.image instanceof File) {
          formData.append('image', values.image);
        }

        const response = await api.post(`/${userType}/bom/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response && response.status === 201) {
          toast.success('BOM created successfully');
          navigate(`/${userType}/bom`);
        } else {
          toast.error('BOM could not be created');
        }
      } catch (error) {
        console.log('🚀 ~ onSubmit: ~ error:', error);
        if (Array.isArray(error)) {
          error.forEach((err) => {
            toast.error(err);
          });
        } else {
          toast.error('An error occurred while creating BOM');
        }
      }
    },
  });

  const handleImageChange = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreviewUrl(previewUrl);
        formik.setFieldValue('image', file);
      }
    },
    [formik],
  );

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    setSubCategory(null);
    formik.resetForm({ values: getInitialValues(newCategory) });
    setImagePreviewUrl(null);
  };

  // Handle subcategory change for fabric
  const handleSubCategoryChange = useCallback(
    (newSubCategory) => {
      setSubCategory(newSubCategory);

      // Reset form with new subcategory-specific initial values
      if (category === 'fabric') {
        const currentValues = formik.values;
        const newInitialValues = getInitialValues(category, newSubCategory);

        // Preserve existing values but add/remove collar fields as needed
        const updatedValues = { ...currentValues };

        if (newSubCategory === 'colar') {
          // Add collar fields if switching to collar
          updatedValues.collarHeight = '';
          updatedValues.collarLength = '';
          updatedValues.tapeHeight = '';
        } else {
          // Remove collar fields if switching away from collar
          delete updatedValues.collarHeight;
          delete updatedValues.collarLength;
          delete updatedValues.tapeHeight;
        }

        formik.setValues(updatedValues);
      }
    },
    [category, formik],
  );

  return (
    <PageContainer title="BOM" description="Manage Products">
      <Breadcrumb title="BOM" items={BCrumb} />
      <ParentCard title="Create BOM">
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Category Selection */}
            <Grid item xs={3}>
              <CustomFormLabel htmlFor="category">Category</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
              <CustomSelect
                fullWidth
                id="category"
                name="category"
                value={category}
                onChange={handleCategoryChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem value="default" disabled>
                  Select
                </MenuItem>
                <MenuItem value="fabric">Fabric</MenuItem>
                <MenuItem value="trims">Trims</MenuItem>
                <MenuItem value="accessories">Accessories</MenuItem>
              </CustomSelect>
            </Grid>

            {/* Render category-specific form sections */}
            {category === 'fabric' && (
              <Fabric formik={formik} onSubCategoryChange={handleSubCategoryChange} />
            )}
            {category === 'trims' && <Trims formik={formik} />}
            {category === 'accessories' && <Accessories formik={formik} />}

            {/* Rest of the form fields... */}
            {/* HSN, UOM, Price, Image fields remain the same */}

            {/* HSN */}
            <Grid item xs={3}>
              <CustomFormLabel htmlFor="hsn">HSN</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
              <CustomTextField
                fullWidth
                id="hsn"
                name="hsn"
                value={formik.values.hsn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter HSN"
                error={formik.touched.hsn && Boolean(formik.errors.hsn)}
                helperText={formik.touched.hsn && formik.errors.hsn}
              />
            </Grid>

            {/* UOM */}
            <Grid item xs={3}>
              <CustomFormLabel htmlFor="uom">UOM</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
              <CustomSelect
                fullWidth
                id="uom"
                name="uom"
                value={formik.values.uom}
                onChange={formik.handleChange}
                error={formik.touched.uom && Boolean(formik.errors.uom)}
                helperText={formik.touched.uom && formik.errors.uom}
              >
                <MenuItem value="default" disabled>
                  Select Unit of Measurement
                </MenuItem>
                <MenuItem value="pieces">PCS</MenuItem>
                <MenuItem value="grams">GRAMS</MenuItem>
                <MenuItem value="kgs">KGS</MenuItem>
                <MenuItem value="meters">MTRS</MenuItem>
                <MenuItem value="inch">INCH</MenuItem>
                <MenuItem value="cm">CM</MenuItem>
                <MenuItem value="cones">CONES</MenuItem>
                <MenuItem value="pkts">PKTS</MenuItem>
              </CustomSelect>
            </Grid>

            {/* Price */}
            <Grid item xs={3}>
              <CustomFormLabel htmlFor="price">Price</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
              <CustomTextField
                fullWidth
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Price"
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={3}>
              <CustomFormLabel htmlFor="image">Image</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
              <CustomTextField
                id="image"
                type="file"
                fullWidth
                inputProps={{ accept: 'image/*' }}
                onChange={handleImageChange}
              />
              {imagePreviewUrl && (
                <Box mt={2}>
                  <img
                    src={imagePreviewUrl || '/placeholder.svg'}
                    alt="Preview"
                    width="150px"
                    height="150px"
                    style={{ borderRadius: '5px', objectFit: 'cover' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'end', marginTop: '1rem' }}>
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateBom;
