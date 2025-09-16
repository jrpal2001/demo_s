'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid2, MenuItem, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';

import ParentCard from '@/components/shared/ParentCard';
import ProductAccordian from './components/ProductAccordian';
import PageContainer from '@/components/container/PageContainer';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { toast } from 'react-toastify';
import { storeProductMaster } from '@/api/productmaster.api.js';
import { productcreationValidationSchema } from '@/validations/productmasterValidations';
import { getAllStyleCategories } from '@/api/productstylecategory.api.js';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ProductCreation = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [productImages, setProductImages] = useState([]);
  const [materialCostDisplay, setMaterialCostDisplay] = useState('0.00');
  const [availableStyleCategories, setAvailableStyleCategories] = useState([]);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/productmaster`, title: 'Product Master' },
    { title: 'Product Creation' },
  ];

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
      materialcost: '0.00',
    },
    validationSchema: productcreationValidationSchema,
    onSubmit: async (values) => {
      try {
        // Clean up empty arrays
        if (values.fabric?.length == 0) {
          delete values.fabric;
        }
        if (values.trims?.length == 0) {
          delete values.trims;
        }
        if (values.accessories?.length == 0) {
          delete values.accessories;
        }

        const formData = new FormData();

        // Append all form values to formData
        Object.entries(values).map(([key, value]) => {
          if (key === 'images' && Array.isArray(value)) {
            // Append each image file directly to formData
            // The backend will handle the upload
            value.forEach((file, index) => {
              formData.append('images', file);
            });
          } else if (key === 'fabric' || key === 'trims' || key === 'accessories') {
            value.map((val, index) => {
              const theKey = `${key}[${index}]`;
              if (typeof val === 'object') {
                const newValue = JSON.stringify(val);
                formData.append(theKey, newValue);
              }
            });
          } else if (key === 'panelcolor' || key === 'mrp') {
            formData.append(key, value);
          } else {
            formData.append(key, value);
          }
        });

        const response = await storeProductMaster(formData);

        if (response) {
          toast.success('Product created successfully');
          navigate(`/${userType}/productmaster`);
        }
      } catch (error) {
        console.error('Product creation error:', error);
        toast.error('Product creation failed');
      }
    },
  });

  // Function to calculate material cost from all materials
  const calculateMaterialCost = () => {
    try {
      // console.log('Calculating material cost with values:', formik.values);

      // Calculate fabric cost
      let fabricCost = 0;
      if (Array.isArray(formik.values.fabric)) {
        formik.values.fabric.forEach((item) => {
          // console.log('Fabric item:', item);
          const cost = Number.parseFloat(item.cost || 0);
          const quantity = Number.parseFloat(item.quantity || item.consumption || 0);
          const itemTotal = cost * quantity;
          // console.log(`Fabric: cost=${cost}, quantity=${quantity}, total=${itemTotal}`);
          fabricCost += itemTotal;
        });
      }

      // Calculate trims cost
      let trimsCost = 0;
      if (Array.isArray(formik.values.trims)) {
        formik.values.trims.forEach((item) => {
          // console.log('Trims item:', item);
          const cost = Number.parseFloat(item.cost || 0);
          const quantity = Number.parseFloat(item.quantity || item.consumption || 0);
          const itemTotal = cost * quantity;
          // console.log(`Trims: cost=${cost}, quantity=${quantity}, total=${itemTotal}`);
          trimsCost += itemTotal;
        });
      }

      // Calculate accessories cost
      let accessoriesCost = 0;
      if (Array.isArray(formik.values.accessories)) {
        formik.values.accessories.forEach((item) => {
          // console.log('Accessories item:', item);
          const cost = Number.parseFloat(item.cost || 0);
          const quantity = Number.parseFloat(item.quantity || item.consumption || 0);
          const itemTotal = cost * quantity;
          // console.log(`Accessories: cost=${cost}, quantity=${quantity}, total=${itemTotal}`);
          accessoriesCost += itemTotal;
        });
      }

      // Calculate total cost
      const totalCost = fabricCost + trimsCost + accessoriesCost;

      return totalCost.toFixed(2);
    } catch (error) {
      console.error('Error calculating material cost:', error);
      return '0.00';
    }
  };

  // Update material cost whenever form values change
  useEffect(() => {
    const newMaterialCost = calculateMaterialCost();
    formik.setFieldValue('materialcost', newMaterialCost);
    setMaterialCostDisplay(newMaterialCost);
  }, [
    JSON.stringify(formik.values.fabric),
    JSON.stringify(formik.values.trims),
    JSON.stringify(formik.values.accessories),
  ]);

  // Fetch all style categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const styleCategories = await getAllStyleCategories();
        const styleCategoryArray = styleCategories.data || [];
        // setAllStyleCategories(styleCategoryArray); // This line is removed
        // Extract unique productCategory values
        // const uniqueCategories = Array.from( // This line is removed
        //   new Set(styleCategoryArray.map((item) => item.productCategory)) // This line is removed
        // ); // This line is removed
        // setAvailableCategories(uniqueCategories); // This line is removed
      } catch (error) {
        // setAvailableCategories([]); // This line is removed
        // setAllStyleCategories([]); // This line is removed
      }
    }
    fetchCategories();
  }, []);

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

  // Custom handler for form field changes
  const handleFormChange = (e) => {
    formik.handleChange(e);

    // Update material cost after form values change
    setTimeout(() => {
      const newMaterialCost = calculateMaterialCost();
      formik.setFieldValue('materialcost', newMaterialCost);
      setMaterialCostDisplay(newMaterialCost);
    }, 0);
  };

  const handleClickImagesChange = (event) => {
    const files = Array.from(event.currentTarget.files); // Convert FileList to Array
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file)); // Preview URLs
      setProductImages(previewUrls);
      formik.setFieldValue('images', files); // Store files in Formik
    }
  };

  const handleClickCancel = () => {
    navigate(`/${userType}/productmaster`);
  };

  return (
    <PageContainer title="Admin - Product Master" description="">
      <Breadcrumb title="Product Master" items={BCrumb} />
      <ParentCard title="Product Creation">
        <form action="" method="POST" onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <Grid2 container rowSpacing={2}>
            {/* IMAGE */}
            <Grid2 size={12}>
              <Box
                width="100%"
                sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                {productImages.length > 0 &&
                  productImages.map((img, index) => (
                    <img
                      key={index}
                      src={img || '/placeholder.svg'}
                      alt={`preview-${index}`}
                      style={{ height: '100px', margin: '5px' }}
                    />
                  ))}
              </Box>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="product-images">Choose Product Images</CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#999' },
                  backgroundColor: '#f9f9f9',
                }}
              >
                <input
                  id="product-images"
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
                  Click to select or drag and drop images here
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
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="skuCode" sx={{ marginTop: 0 }}>
                SKU Code
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="skuCode"
                name="skuCode"
                value={formik.values.skuCode}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter SKU Code"
                error={formik.touched.skuCode && Boolean(formik.errors.skuCode)}
                helperText={formik.touched.skuCode && formik.errors.skuCode}
              />
            </Grid2>

            {/* PRODUCT COLOR */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="color" sx={{ marginTop: 0 }}>
                Product Color
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="color"
                name="color"
                value={formik.values.color}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Color"
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
              />
            </Grid2>
            {/* PANEL COLOR */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="panelcolor" sx={{ marginTop: 0 }}>
                Panel Color
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="panelcolor"
                name="panelcolor"
                value={formik.values.panelcolor}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Panel Color"
                error={formik.touched.panelcolor && Boolean(formik.errors.panelcolor)}
                helperText={formik.touched.panelcolor && formik.errors.panelcolor}
              />
            </Grid2>

            {/* PRODUCT NAME */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="name" sx={{ marginTop: 0 }}>
                Product Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="name"
                name="name"
                value={formik.values.name}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Name"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid2>

            {/* PRODUCT DESCRIPTION */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="description" sx={{ marginTop: 0 }}>
                Product Description
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="description"
                name="description"
                value={formik.values.description}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Description"
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid2>

            {/* PRODUCT BRAND */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="brand" sx={{ marginTop: 0 }}>
                Brand
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="brand"
                name="brand"
                value={formik.values.brand}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Product Brand"
                error={formik.touched.brand && Boolean(formik.errors.brand)}
                helperText={formik.touched.brand && formik.errors.brand}
              />
            </Grid2>

            {/* PRODUCT CATEGORY */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="category" sx={{ marginTop: 0 }}>
                Product Category
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="category"
                name="category"
                value={formik.values.category}
                onChange={handleFormChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
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

            {/* PRODUCT SUBCATEGORY */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="stylecategory" sx={{ marginTop: 0 }}>
                Product Style Category
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="stylecategory"
                name="stylecategory"
                value={formik.values.stylecategory}
                onChange={handleFormChange}
                error={formik.touched.stylecategory && Boolean(formik.errors.stylecategory)}
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
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="brandingcost" sx={{ marginTop: 0 }}>
                Branding Cost
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="brandingcost"
                name="brandingcost"
                type="number"
                value={formik.values.brandingcost}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Branding Cost"
                error={formik.touched.brandingcost && Boolean(formik.errors.brandingcost)}
                helperText={formik.touched.brandingcost && formik.errors.brandingcost}
              />
            </Grid2>

            {/* MAKING COST */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="makingcost" sx={{ marginTop: 0 }}>
                Making Cost
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="makingcost"
                name="makingcost"
                type="number"
                value={formik.values.makingcost}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Making Cost"
                error={formik.touched.makingcost && Boolean(formik.errors.makingcost)}
                helperText={formik.touched.makingcost && formik.errors.makingcost}
              />
            </Grid2>
            {/* MRP */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="mrp" sx={{ marginTop: 0 }}>
                MRP
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="mrp"
                name="mrp"
                type="number"
                value={formik.values.mrp}
                onChange={handleFormChange}
                onBlur={formik.handleBlur}
                placeholder="Enter MRP"
                error={formik.touched.mrp && Boolean(formik.errors.mrp)}
                helperText={formik.touched.mrp && formik.errors.mrp}
              />
            </Grid2>

            {/* MATERIAL COST */}
            <Grid2
              size={{ sm: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="materialcost" sx={{ marginTop: 0 }}>
                Material Cost
                <Tooltip title="Automatically calculated as the sum of all fabric, trims, and accessories costs (cost × quantity)">
                  <InfoIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
                </Tooltip>
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ sm: 12, md: 9 }}>
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
            <Button type="submit" sx={{ marginRight: '0.5rem' }}>
              Submit
            </Button>
            <Button type="reset" onClick={handleClickCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ProductCreation;
