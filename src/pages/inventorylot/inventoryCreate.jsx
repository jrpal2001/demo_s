'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Autocomplete, Box, Button, Grid2, MenuItem, IconButton, Typography } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createInventory } from '@/api/inventory.api';
import { fetchBomByCategory } from '@/api/bom.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';



const CreateInventory = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/inventory`, title: 'Product Inventory' },
    { title: 'Create' },
  ];
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [bomCodes, setBomCodes] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingBomCodes, setLoadingBomCodes] = useState(false);

  const categories = [
    { value: 'fabric', label: 'Fabric' },
    { value: 'trims', label: 'Trims' },
    { value: 'accessories', label: 'Accessories' },
  ];

  const formik = useFormik({
    initialValues: {
      category: '',
      itemCode: '',
      data: {
        description: '',
        uom: '',
        currentStock: 0,
        minimumRequiredStock: 0,
        lots: [{ lotName: '', quantity: 0 }], // Add lots array
      },
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Category is required'),
      itemCode: Yup.string().required('Item Code is required'),
      data: Yup.object({
        description: Yup.string().required('Description is required'),
        uom: Yup.string().required('UOM is required'),
        currentStock: Yup.number()
          .required('Current Stock is required')
          .min(0, 'Current Stock cannot be negative'),
        minimumRequiredStock: Yup.number()
          .required('Minimum Required Stock is required')
          .min(0, 'Minimum Required Stock cannot be negative'),
        lots: Yup.array()
          .of(
            Yup.object({
              lotName: Yup.string().required('Lot name is required'),
              quantity: Yup.number()
                .required('Quantity is required')
                .min(0, 'Quantity cannot be negative'),
            }),
          )
          .min(1, 'At least one lot is required'),
      }),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        const formData = new FormData();

        // Calculate total stock from lots
        const totalStock = values.data.lots.reduce((sum, lot) => sum + Number(lot.quantity), 0);

        // Create lots object for backend
        const lotsObject = {};
        values.data.lots.forEach((lot) => {
          if (lot.lotName && lot.quantity > 0) {
            lotsObject[lot.lotName] = Number(lot.quantity);
          }
        });

        // Update current stock to match total from lots
        const updatedData = {
          ...values.data,
          currentStock: totalStock,
          lots: lotsObject,
        };

        // Add form data
        formData.append('itemCode', values.itemCode);
        formData.append('data', JSON.stringify(updatedData));

        // Add images
        images.forEach((file) => {
          formData.append('images', file);
        });

        console.log('🚀 ~ Submitting form data...');
        const response = await createInventory(formData);

        if (response) {
          toast.success('Inventory item created successfully');
          navigate(`/${userType}/inventory`);
        }
      } catch (error) {
        console.error('🚀 ~ Create error:', error);
        toast.error('Failed to create inventory item: ' + (error.message || 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleCategoryChange = async (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    formik.setFieldValue('category', category);
    formik.setFieldValue('itemCode', ''); // Reset item code when category changes
    formik.setFieldValue('data.uom', ''); // Reset UOM when category changes

    if (category) {
      await fetchBomCodes(category);
    } else {
      setBomCodes([]);
    }
  };

  const fetchBomCodes = async (category) => {
    try {
      setLoadingBomCodes(true);
      const response = await fetchBomByCategory(category);
      console.log('🚀 ~ fetchBomCodes ~ response:', response);

      if (response && Array.isArray(response)) {
        setBomCodes(response);
      } else {
        setBomCodes([]);
        toast.warning(`No BOM codes found for ${category}`);
      }
    } catch (error) {
      console.error('Error fetching BOM codes:', error);
      toast.error('Failed to fetch BOM codes');
      setBomCodes([]);
    } finally {
      setLoadingBomCodes(false);
    }
  };

  const handleItemCodeChange = (event, newValue) => {
    if (newValue) {
      formik.setFieldValue('itemCode', newValue.bomId);
      // Auto-fill UOM if available
      if (newValue.uom) {
        formik.setFieldValue('data.uom', newValue.uom);
      }
    } else {
      formik.setFieldValue('itemCode', '');
      formik.setFieldValue('data.uom', ''); // Clear UOM when item code is cleared
    }
  };

  // Lot management functions
  const addLot = () => {
    const currentLots = formik.values.data.lots;
    formik.setFieldValue('data.lots', [...currentLots, { lotName: '', quantity: 0 }]);
  };

  const removeLot = (index) => {
    const currentLots = formik.values.data.lots;
    if (currentLots.length > 1) {
      const updatedLots = currentLots.filter((_, i) => i !== index);
      formik.setFieldValue('data.lots', updatedLots);
      updateCurrentStock(updatedLots);
    }
  };

  const updateLotQuantity = (index, quantity) => {
    const currentLots = [...formik.values.data.lots];
    currentLots[index].quantity = Number(quantity);
    formik.setFieldValue('data.lots', currentLots);
    updateCurrentStock(currentLots);
  };

  const updateCurrentStock = (lots) => {
    const totalStock = lots.reduce((sum, lot) => sum + Number(lot.quantity || 0), 0);
    formik.setFieldValue('data.currentStock', totalStock);
  };

  const handleImagesChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setImages([...images, ...files]);
      setImagePreviews([...imagePreviews, ...previewUrls]);
      event.target.value = '';
    }
  };

  const removeImage = (index) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleClickCancel = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    navigate(`/${userType}/inventory`);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <PageContainer title="Admin - Create Inventory" description="Create new inventory item">
      <Breadcrumb title="Create Inventory Item" items={BCrumb} />
      <ParentCard title="Create New Inventory Item">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* CATEGORY SELECTION */}
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
                onChange={handleCategoryChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Grid2>

            {/* ITEM CODE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="itemCode" sx={{ marginTop: 0 }}>
                Item Code
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                options={bomCodes}
                autoHighlight
                loading={loadingBomCodes}
                disabled={!selectedCategory || loadingBomCodes}
                getOptionLabel={(option) => option.bomId || ''}
                value={bomCodes.find((item) => item.bomId === formik.values.itemCode) || null}
                onChange={handleItemCodeChange}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder={
                      !selectedCategory
                        ? 'Please select a category first'
                        : loadingBomCodes
                        ? 'Loading BOM codes...'
                        : 'Search Item Code'
                    }
                    error={formik.touched.itemCode && Boolean(formik.errors.itemCode)}
                    helperText={formik.touched.itemCode && formik.errors.itemCode}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Box sx={{ fontWeight: 'bold' }}>{option.bomId}</Box>
                      {option.uom && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          UOM: {option.uom}
                        </Box>
                      )}
                      {option.price && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          Price: {option.price}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Grid2>

            {/* DESCRIPTION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="description" sx={{ marginTop: 0 }}>
                Description
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="description"
                name="data.description"
                value={formik.values.data.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Description"
                error={formik.touched.data?.description && Boolean(formik.errors.data?.description)}
                helperText={formik.touched.data?.description && formik.errors.data?.description}
              />
            </Grid2>

            {/* UOM */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="uom" sx={{ marginTop: 0 }}>
                UOM
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="uom"
                name="data.uom"
                value={formik.values.data.uom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter UOM"
                disabled={
                  !!formik.values.itemCode &&
                  bomCodes.find((item) => item.bomId === formik.values.itemCode)?.uom
                }
                error={formik.touched.data?.uom && Boolean(formik.errors.data?.uom)}
                helperText={
                  formik.touched.data?.uom && formik.errors.data?.uom
                    ? formik.errors.data?.uom
                    : !!formik.values.itemCode &&
                      bomCodes.find((item) => item.bomId === formik.values.itemCode)?.uom
                    ? 'UOM auto-filled from selected BOM item'
                    : ''
                }
              />
            </Grid2>

            {/* LOT DETAILS SECTION */}
            <Grid2 size={12}>
              <ParentCard title="Lot Details">
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6">Manage Lots</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addLot}
                    size="small"
                    sx={{ minWidth: 'auto' }}
                  >
                    Add Lot
                  </Button>
                </Box>

                {formik.values.data.lots.map((lot, index) => (
                  <Grid2 container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid2 size={{ xs: 12, md: 5 }}>
                      <CustomTextField
                        fullWidth
                        placeholder="Enter Lot Name (e.g., LOT-202406-A)"
                        value={lot.lotName}
                        onChange={(e) => {
                          const currentLots = [...formik.values.data.lots];
                          currentLots[index].lotName = e.target.value;
                          formik.setFieldValue('data.lots', currentLots);
                        }}
                        error={
                          formik.touched.data?.lots?.[index]?.lotName &&
                          Boolean(formik.errors.data?.lots?.[index]?.lotName)
                        }
                        helperText={
                          formik.touched.data?.lots?.[index]?.lotName &&
                          formik.errors.data?.lots?.[index]?.lotName
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 5 }}>
                      <CustomTextField
                        fullWidth
                        type="number"
                        placeholder="Enter Quantity"
                        value={lot.quantity}
                        onChange={(e) => updateLotQuantity(index, e.target.value)}
                        error={
                          formik.touched.data?.lots?.[index]?.quantity &&
                          Boolean(formik.errors.data?.lots?.[index]?.quantity)
                        }
                        helperText={
                          formik.touched.data?.lots?.[index]?.quantity &&
                          formik.errors.data?.lots?.[index]?.quantity
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 2 }}>
                      <IconButton
                        color="error"
                        onClick={() => removeLot(index)}
                        disabled={formik.values.data.lots.length === 1}
                        sx={{ width: '100%' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid2>
                  </Grid2>
                ))}
              </ParentCard>
            </Grid2>

            {/* CURRENT STOCK (Auto-calculated) */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="currentStock" sx={{ marginTop: 0 }}>
                Current Stock (Total)
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="currentStock"
                name="data.currentStock"
                type="number"
                value={formik.values.data.currentStock}
                disabled
                placeholder="Auto-calculated from lots"
                helperText="This value is automatically calculated from the sum of all lot quantities"
              />
            </Grid2>

            {/* MINIMUM REQUIRED STOCK */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="minimumRequiredStock" sx={{ marginTop: 0 }}>
                Minimum Required Stock
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="minimumRequiredStock"
                name="data.minimumRequiredStock"
                type="number"
                value={formik.values.data.minimumRequiredStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Minimum Required Stock"
                error={
                  formik.touched.data?.minimumRequiredStock &&
                  Boolean(formik.errors.data?.minimumRequiredStock)
                }
                helperText={
                  formik.touched.data?.minimumRequiredStock &&
                  formik.errors.data?.minimumRequiredStock
                }
              />
            </Grid2>

            {/* IMAGE PREVIEWS */}
            {imagePreviews.length > 0 && (
              <Grid2 size={12}>
                <CustomFormLabel>Selected Images</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {imagePreviews.map((previewUrl, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img
                        src={previewUrl || '/placeholder.svg'}
                        alt={`preview-${index}`}
                        style={{
                          height: '100px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '2px solid #4caf50',
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => removeImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          minWidth: 'auto',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {/* ADD IMAGES */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="images">Choose Images</CustomFormLabel>
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
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  onChange={handleImagesChange}
                  style={{
                    display: 'block',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
                <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                  <AddIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Click to select or drag and drop images here (Max 10 images, 5MB each)
                </Box>
              </Box>
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
              {isUploading ? 'Creating...' : 'Create Inventory'}
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

export default CreateInventory;
