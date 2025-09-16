'use client';

import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid2, MenuItem, IconButton, Chip, Tooltip } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import InfoIcon from '@mui/icons-material/Info';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';

import ParentCard from '@/components/shared/ParentCard';
import ProductAccordian from './components/ProductAccordianEdit';
import PageContainer from '@/components/container/PageContainer';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { toast } from 'react-toastify';
import { fetchProductMasterById, updateProductMaster } from '@/api/productmaster.api.js';
import { productEditValidationSchema } from '@/validations/productmasterValidations';
import { getAllStyleCategories } from '@/api/productstylecategory.api.js';

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userType = useSelector(selectCurrentUserType);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [data, setData] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [materialCostDisplay, setMaterialCostDisplay] = useState('0.00');
  const [availableStyleCategories, setAvailableStyleCategories] = useState([]);

  const formik = useFormik({
    initialValues: {
      images: [],
      skuCode: '',
      color: '',
      panelcolor: '',
      name: '',
      description: '',
      brand: '',
      category: 'default',
      stylecategory: 'default',
      fabric: [],
      trims: [],
      accessories: [],
      brandingcost: '',
      makingcost: '',
      mrp: '',
      materialcost: '',
    },
    validationSchema: productEditValidationSchema,
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        const formData = new FormData();

        // Handle simple fields
        const simpleFields = [
          'skuCode',
          'color',
          'panelcolor',
          'name',
          'description',
          'brand',
          'category',
          'stylecategory',
          'brandingcost',
          'makingcost',
          'mrp',
          'materialcost',
        ];
        simpleFields.forEach((field) => {
          if (data[field] !== values[field]) {
            formData.append(field, values[field]);
          }
        });

        // Add existing images that weren't removed
        existingImages.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });

        // Add new image files
        newImages.forEach((file) => {
          formData.append('images', file);
        });

        // Clean up empty arrays - same as create form
        if (values.fabric?.length == 0) {
          delete values.fabric;
        }
        if (values.trims?.length == 0) {
          delete values.trims;
        }
        if (values.accessories?.length == 0) {
          delete values.accessories;
        }
        // Handle nested arrays (fabric, trims, accessories) - same as create form
        ['fabric', 'trims', 'accessories'].forEach((key) => {
          if (values[key] && Array.isArray(values[key])) {
            // Check if the array has changed
            const hasChanged = JSON.stringify(values[key]) !== JSON.stringify(data[key]);

            if (hasChanged && values[key].length > 0) {
              values[key] = values[key].map(({ _id, ...rest }) => rest);
              values[key].forEach((val, index) => {
                const theKey = `${key}[${index}]`;
                if (typeof val === 'object') {
                  const newValue = JSON.stringify(val);
                  formData.append(theKey, newValue);
                }
              });
            }
          }
        });

        // Check if any data has changed
        let formDataHasValues = false;
        for (const pair of formData.entries()) {
          formDataHasValues = true;
          break;
        }

        if (formDataHasValues) {
          console.log('Submitting form data...');
          const response = await updateProductMaster(id, formData);

          if (response) {
            toast.success('Product updated successfully');
            navigate(`/${userType}/productmaster`);
          }
        } else {
          toast.warning('Please edit at least one field');
        }
      } catch (error) {
        console.error('Update error:', error);
        toast.error('Product update failed: ' + (error.message || 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    },
  });

  // Function to calculate material cost from all materials
  const calculateMaterialCost = () => {
    try {
      console.log('Calculating material cost with values:', formik.values);

      // Calculate fabric cost
      let fabricCost = 0;
      if (Array.isArray(formik.values.fabric)) {
        formik.values.fabric.forEach((item) => {
          const cost = Number.parseFloat(item.cost || 0);
          const quantity = Number.parseFloat(item.quantity || item.consumption || 0);
          const itemTotal = cost * quantity;
          fabricCost += itemTotal;
        });
      }

      // Calculate trims cost
      let trimsCost = 0;
      if (Array.isArray(formik.values.trims)) {
        formik.values.trims.forEach((item) => {
          const cost = Number.parseFloat(item.cost || 0);
          const quantity = Number.parseFloat(item.quantity || item.consumption || 0);
          const itemTotal = cost * quantity;
          trimsCost += itemTotal;
        });
      }

      // Calculate accessories cost
      let accessoriesCost = 0;
      if (Array.isArray(formik.values.accessories)) {
        formik.values.accessories.forEach((item) => {
          const cost = Number.parseFloat(item.cost || 0);
          const quantity = Number.parseFloat(item.quantity || item.consumption || 0);
          const itemTotal = cost * quantity;
          accessoriesCost += itemTotal;
        });
      }

      // Calculate total cost
      const totalCost = fabricCost + trimsCost + accessoriesCost;
      console.log(
        `Total material cost: ${totalCost} (Fabric: ${fabricCost}, Trims: ${trimsCost}, Accessories: ${accessoriesCost})`,
      );

      return totalCost.toFixed(2);
    } catch (error) {
      console.error('Error calculating material cost:', error);
      return '0.00';
    }
  };

  // Update material cost whenever form values change
  useEffect(() => {
    const newMaterialCost = calculateMaterialCost();
    console.log('Setting material cost to:', newMaterialCost);
    formik.setFieldValue('materialcost', newMaterialCost);
    setMaterialCostDisplay(newMaterialCost);
  }, [
    JSON.stringify(formik.values.fabric),
    JSON.stringify(formik.values.trims),
    JSON.stringify(formik.values.accessories),
  ]);

  // Update stylecategory options when category changes
  useEffect(() => {
    if (formik.values.category && formik.values.category !== 'default') {
      getAllStyleCategories(formik.values.category)
        .then((categories) => {
          const options = (categories || []).map((value) => ({ value, label: value }));
          setAvailableStyleCategories(options);
          formik.setFieldValue('stylecategory', 'default');
        })
        .catch(() => {
          setAvailableStyleCategories([]);
          formik.setFieldValue('stylecategory', 'default');
        });
    } else {
      setAvailableStyleCategories([]);
      formik.setFieldValue('stylecategory', 'default');
    }
  }, [formik.values.category]);

  const handleClickImagesChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setNewImages([...newImages, ...files]);
      setNewImagePreviews([...newImagePreviews, ...previewUrls]);
      event.target.value = '';
    }
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const removeNewImage = (index) => {
    const updatedFiles = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages(updatedFiles);
    setNewImagePreviews(updatedPreviews);
  };

  const handleClickCancel = () => {
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    navigate(`/${userType}/productmaster`);
  };

  const fetchData = async () => {
    try {
      const response = await fetchProductMasterById(id);
      if (response) {
        // Convert code objects to _id strings
        ['fabric', 'trims', 'accessories'].forEach((key) => {
          if (response[key] && Array.isArray(response[key])) {
            response[key] = response[key].map((item) => ({
              ...item,
              code: typeof item.code === 'object' ? item.code._id : item.code,
            }));
          }
        });
        setData(response);
        Object.entries(response).forEach(([key, value]) => {
          if (key === 'images') {
            if (value.length > 0) setExistingImages(value);
          } else {
            formik.setFieldValue(key, value);
          }
        });
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/productmaster`, title: 'Product Master' },
    { title: 'Edit' },
  ];

  // No hardcoded options; will fetch from API

  return (
    <PageContainer title="Admin - Product Master" description="">
      <Breadcrumb title="Product Master" items={BCrumb} />
      <ParentCard title="Edit Product Master">
        <form action="" method="POST" onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
              <Grid2 size={12}>
                <CustomFormLabel>Current Images</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {existingImages.map((imageUrl, index) => (
                    <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={imageUrl || '/placeholder.svg'}
                        alt={`existing-${index}`}
                        style={{
                          height: '100px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '2px solid #e0e0e0',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Chip
                        label="Current"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          fontSize: '10px',
                          height: '16px',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {/* NEW IMAGES */}
            {newImagePreviews.length > 0 && (
              <Grid2 size={12}>
                <CustomFormLabel>New Images to Upload</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {newImagePreviews.map((previewUrl, index) => (
                    <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={previewUrl || '/placeholder.svg'}
                        alt={`new-${index}`}
                        style={{
                          height: '100px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '2px solid #4caf50',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeNewImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Chip
                        label="New"
                        size="small"
                        color="success"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          fontSize: '10px',
                          height: '16px',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {/* ADD NEW IMAGES */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="images">
                {existingImages.length > 0 ? 'Add More Images' : 'Choose Product Images'}
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#999' },
                  backgroundColor: '#f9f9f9',
                }}
              >
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleClickImagesChange}
                  onBlur={formik.handleBlur}
                  style={{
                    display: 'block',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
                <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                  <AddIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {existingImages.length > 0
                    ? 'Click to add more images'
                    : 'Click to select or drag and drop images here'}
                </Box>
              </Box>
              {formik.touched.images && formik.errors.images && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  {formik.errors.images}
                </p>
              )}
            </Grid2>

            {/* SKU CODE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="skuCode" sx={{ marginTop: 0 }}>
                SKU Code
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="skuCode"
                name="skuCode"
                value={formik.values.skuCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter SKU Code"
                error={formik.touched.skuCode && Boolean(formik.errors.skuCode)}
                helperText={formik.touched.skuCode && formik.errors.skuCode}
              />
            </Grid2>

            {/* PRODUCT COLOR */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="color" sx={{ marginTop: 0 }}>
                Product Color
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
                placeholder="Enter Product Color"
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
              />
            </Grid2>
            {/* PANEL COLOR */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="panelcolor" sx={{ marginTop: 0 }}>
                Panel Color
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="panelcolor"
                name="panelcolor"
                value={formik.values.panelcolor}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Panel Color"
                error={formik.touched.panelcolor && Boolean(formik.errors.panelcolor)}
                helperText={formik.touched.panelcolor && formik.errors.panelcolor}
              />
            </Grid2>

            {/* PRODUCT NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="name" sx={{ marginTop: 0 }}>
                Product Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Name"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid2>

            {/* PRODUCT DESCRIPTION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="description" sx={{ marginTop: 0 }}>
                Product Description
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Description"
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid2>

            {/* PRODUCT BRAND */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="brand" sx={{ marginTop: 0 }}>
                Product Brand
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="brand"
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Brand"
                error={formik.touched.brand && Boolean(formik.errors.brand)}
                helperText={formik.touched.brand && formik.errors.brand}
              />
            </Grid2>

            {/* PRODUCT CATEGORY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="category" sx={{ marginTop: 0 }}>
                Product Category
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem value="default" disabled>
                  Select Product Category
                </MenuItem>
                <MenuItem value="men">Men</MenuItem>
                <MenuItem value="women">Women</MenuItem>
                <MenuItem value="boys">Boys</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </CustomSelect>
              {formik.touched.category && formik.errors.category && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select The Product Category
                </p>
              )}
            </Grid2>

            {/* PRODUCT STYLE CATEGORY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="stylecategory" sx={{ marginTop: 0 }}>
                Product Style Category
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="stylecategory"
                name="stylecategory"
                value={formik.values.stylecategory}
                onChange={formik.handleChange}
                error={formik.touched.stylecategory && Boolean(formik.errors.stylecategory)}
                helperText={formik.touched.stylecategory && formik.errors.stylecategory}
                disabled={!availableStyleCategories.length}
              >
                <MenuItem value="default" disabled>
                  {availableStyleCategories.length
                    ? 'Select Product Style Category'
                    : 'Select Category First'}
                </MenuItem>
                {availableStyleCategories.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              {formik.touched.stylecategory && formik.errors.stylecategory && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select The Product Style Category
                </p>
              )}
            </Grid2>

            {/* BRANDING COST */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="brandingcost" sx={{ marginTop: 0 }}>
                Branding Cost
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="brandingcost"
                name="brandingcost"
                type="number"
                value={formik.values.brandingcost}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Branding Cost"
                error={formik.touched.brandingcost && Boolean(formik.errors.brandingcost)}
                helperText={formik.touched.brandingcost && formik.errors.brandingcost}
              />
            </Grid2>

            {/* MAKING COST */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="makingcost" sx={{ marginTop: 0 }}>
                Making Cost
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="makingcost"
                name="makingcost"
                type="number"
                value={formik.values.makingcost}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Making Cost"
                error={formik.touched.makingcost && Boolean(formik.errors.makingcost)}
                helperText={formik.touched.makingcost && formik.errors.makingcost}
              />
            </Grid2>
            {/* MRP */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="mrp" sx={{ marginTop: 0 }}>
                MRP
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="mrp"
                name="mrp"
                type="number"
                value={formik.values.mrp}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter MRP"
                error={formik.touched.mrp && Boolean(formik.errors.mrp)}
                helperText={formik.touched.mrp && formik.errors.mrp}
              />
            </Grid2>

            {/* MATERIAL COST */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="materialcost" sx={{ marginTop: 0 }}>
                Material Cost
                <Tooltip title="Automatically calculated as the sum of all fabric, trims, and accessories costs (cost × quantity)">
                  <InfoIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                </Tooltip>
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="materialcost"
                name="materialcost"
                type="number"
                value={materialCostDisplay}
                placeholder="Auto-calculated from materials"
                error={formik.touched.materialcost && Boolean(formik.errors.materialcost)}
                helperText={formik.touched.materialcost && formik.errors.materialcost}
                disabled={true}
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000',
                    fontWeight: 'bold',
                  },
                }}
              />
            </Grid2>

            {/* Accordian */}
            <Grid2 size={12}>
              <ProductAccordian
                formik={formik}
                title="Fabric"
                code={formik.values.fabric?.length}
                onChange={() => {
                  setTimeout(() => {
                    const newMaterialCost = calculateMaterialCost();
                    formik.setFieldValue('materialcost', newMaterialCost);
                    setMaterialCostDisplay(newMaterialCost);
                  }, 0);
                }}
              />
              <ProductAccordian
                formik={formik}
                title="Trims"
                code={formik.values.trims?.length}
                onChange={() => {
                  setTimeout(() => {
                    const newMaterialCost = calculateMaterialCost();
                    formik.setFieldValue('materialcost', newMaterialCost);
                    setMaterialCostDisplay(newMaterialCost);
                  }, 0);
                }}
              />
              <ProductAccordian
                formik={formik}
                title="Accessories"
                code={formik.values.accessories?.length}
                onChange={() => {
                  setTimeout(() => {
                    const newMaterialCost = calculateMaterialCost();
                    formik.setFieldValue('materialcost', newMaterialCost);
                    setMaterialCostDisplay(newMaterialCost);
                  }, 0);
                }}
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
            <Button type="submit" sx={{ marginRight: '0.5rem' }} disabled={isUploading}>
              {isUploading ? 'Updating...' : 'Update Product'}
            </Button>
            <Button type="button" onClick={handleClickCancel} disabled={isUploading}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EditProduct;
