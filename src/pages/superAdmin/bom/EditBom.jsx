import { fetchBOM } from '@/api/admin';
import PageContainer from '@/components/container/PageContainer';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { api } from '@/utils/axios';
import { Box, Button, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Fabric from './components/Fabric';
import Trims from './components/Trims';
import Accessories from './components/Accessories';
import { getValidationSchema } from '@/validations/bomValidations';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditBom = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/bom`, title: 'BOM' },
    { title: 'Edit BOM' },
  ];

  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [category, setCategory] = useState('default');
  const [subCategory, setSubCategory] = useState('default');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const formik = useFormik({
    initialValues: {
      category: '',
      hsn: '',
      uom: '',
      price: '',
    },
    validationSchema: getValidationSchema(category),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // Clean up collar fields if not 'colar'
        let submitValues = { ...values };
        if (submitValues.subCategory !== 'colar') {
          delete submitValues.collarHeight;
          delete submitValues.collarLength;
          delete submitValues.tapeHeight;
        }

        let formData;
        let isMultipart = false;

        console.log('🚀 ~ onSubmit: ~ values.image:', values.image);
        // 1. If new image file is uploaded
        if (submitValues.image instanceof File) {
          isMultipart = true;
          formData = new FormData();

          const fieldsToExclude = [
            '_id',
            '__v',
            'createdAt',
            'updatedAt',
            'inventoryRef',
            'inventoryModel',
          ];
          Object.keys(submitValues).forEach((key) => {
            if (!fieldsToExclude.includes(key)) {
              if (key === 'image' && submitValues[key] instanceof File) {
                formData.append('image', submitValues[key]);
              } else if (key !== 'image') {
                formData.append(key, submitValues[key]);
              }
            }
          });

          // Check if bomId needs to be updated
          if (submitValues.bomId && submitValues.bomId !== data?.bomId) {
            formData.set('bomId', submitValues.bomId);
          }
        }
        // 2. If image is removed, send image: "" (empty string)
        else if (submitValues.image === null || submitValues.image === '') {
          formData = {};
          const fieldsToExclude = [
            '_id',
            '__v',
            'createdAt',
            'updatedAt',
            'inventoryRef',
            'inventoryModel',
          ];
          Object.keys(submitValues).forEach((key) => {
            if (!fieldsToExclude.includes(key)) {
              if (key === 'image') {
                formData[key] = '';
              } else {
                formData[key] = submitValues[key];
              }
            }
          });
          // Handle bomId
          if (submitValues.bomId && submitValues.bomId === data?.bomId) {
            delete formData.bomId;
          }
        }
        // 3. If image is unchanged (string URL), do not send image field at all
        else {
          formData = {};
          const fieldsToExclude = [
            '_id',
            '__v',
            'createdAt',
            'updatedAt',
            'inventoryRef',
            'inventoryModel',
            'image', // Exclude image field if it's a string (unchanged)
          ];
          Object.keys(submitValues).forEach((key) => {
            if (!fieldsToExclude.includes(key)) {
              formData[key] = submitValues[key];
            }
          });
          // Handle bomId
          if (submitValues.bomId && submitValues.bomId === data?.bomId) {
            delete formData.bomId;
          }
        }

        const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};

        const response = await api.post(`/${userType}/bom/update/${params.id}`, formData, config);

        console.log('🚀 ~ onSubmit: ~ response:', response);
        if (response && response.status === 200) {
          toast.success('BOM updated successfully');
          navigate(`/${userType}/bom`);
        } else {
          toast.error('BOM could not be updated');
        }
      } catch (error) {
        console.log('🚀 ~ onSubmit: ~ error:', error);
        console.error(error);

        (Array.isArray(error) ? error : [error])?.forEach((err) =>
          toast.error(err?.message || 'Something went wrong'),
        );
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

  const handleRemoveImage = () => {
    formik.setFieldValue('image', null);
    setImagePreviewUrl(null);
    // Clear the file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    formik.setFieldValue('category', event.target.value);
  };

  const handleSubCategoryChange = (event) => {
    const newSubCategory = event.target.value;
    formik.setFieldValue('subCategory', newSubCategory);
    setSubCategory(newSubCategory);

    // If not 'colar', remove collar-specific fields
    if (newSubCategory !== 'colar') {
      formik.setFieldValue('collarHeight', undefined);
      formik.setFieldValue('collarLength', undefined);
      formik.setFieldValue('tapeHeight', undefined);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchBOM(params?.id);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setCategory(response.category);
        const fieldsToExclude = [
          '_id',
          '__v',
          'createdAt',
          'updatedAt',
          'inventoryRef',
          'inventoryModel',
        ];

        const filteredValues = Object.keys(response).reduce((acc, key) => {
          if (!fieldsToExclude.includes(key)) {
            acc[key] = response[key];
          }
          return acc;
        }, {});

        formik.setValues(filteredValues);

        // Fix: set subCategory in local state
        if (filteredValues.subCategory) {
          setSubCategory(filteredValues.subCategory);
        }

        setData(response);
        setImagePreviewUrl(null);
      }
    } catch (error) {
      toast.error('Data failed to fetch');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                value={formik.values.category}
                onChange={handleCategoryChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
                disabled
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
              <Fabric
                formik={formik}
                subCategory={subCategory}
                handleSubCategoryChange={handleSubCategoryChange}
                edit={true}
              />
            )}
            {category === 'trims' && <Trims formik={formik} />}
            {category === 'accessories' && <Accessories formik={formik} />}

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
                <MenuItem value="cones">cones</MenuItem>
              </CustomSelect>
              {formik.touched.uom && formik.errors.uom && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select The Unit of Measurement
                </p>
              )}
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
              {(formik.values.image || imagePreviewUrl) && (
                <Box mt={2}>
                  <img
                    src={
                      imagePreviewUrl ||
                      (typeof formik.values.image === 'object'
                        ? URL.createObjectURL(formik.values.image)
                        : formik.values.image) // Use directly if it's a full URL
                    }
                    alt="Preview"
                    width="150px"
                    height="150px"
                    style={{ borderRadius: '5px', objectFit: 'cover' }}
                  />
                  <Box mt={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </Button>
                  </Box>
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

export default EditBom;
