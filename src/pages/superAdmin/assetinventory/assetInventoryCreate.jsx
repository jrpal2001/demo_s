'use client';
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Autocomplete,
  Box,
  Button,
  Grid2,
  MenuItem,
  FormControl,
  Select,
  IconButton,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createAssetInventory } from '@/api/assetinventory.api';
import { fetchAssetCodes } from '../../../api/assetmanagementERP';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateAssetInventory = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-inventory`, title: 'Asset Inventory' },
    { title: 'Create' },
  ];

  const navigate = useNavigate();
  const [selectedAssetType, setSelectedAssetType] = useState('');
  const [assetCodes, setAssetCodes] = useState([]);
  const [loadingAssetCodes, setLoadingAssetCodes] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const assetTypes = [
    { value: 'MACHINERY', label: 'Machinery' },
    { value: 'ELECTRICALS', label: 'Electricals' },
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'FURNITURE&FIXTURES', label: 'Furniture & Fixtures' },
    { value: 'IMMOVABLE PROPERTIES', label: 'Immovable Properties' },
    { value: 'VEHICLES', label: 'Vehicles' },
    { value: 'SOFTWARES&LICENSES', label: 'Softwares & Licenses' },
  ];

  const formik = useFormik({
    initialValues: {
      assetType: '',
      assetCode: '',
      assetName: '',
      description: '',
      department: 'General',
      currentStock: 0,
      uom: '',
      unitPrice: 0,
      storageLocation: '',
      minimumRequiredStock: 0,
      lots: [{ lotName: '', quantity: 0 }],
      remarks: '',
    },
    validationSchema: Yup.object({
      assetType: Yup.string().required('Asset Type is required'),
      assetCode: Yup.string().required('Asset Code is required'),
      assetName: Yup.string().required('Asset Name is required'),
      description: Yup.string(),
      department: Yup.string().required('Department is required'),
      uom: Yup.string().required('UOM is required'),
      unitPrice: Yup.number()
        .required('Unit Price is required')
        .min(0, 'Unit Price cannot be negative'),
      storageLocation: Yup.string().required('Storage Location is required'),
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
      remarks: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        console.log('Submitting values:', values);

        // Calculate total stock from lots
        const totalStock = values.lots.reduce((sum, lot) => sum + Number(lot.quantity), 0);

        // Create lots object for backend
        const lotsObject = {};
        values.lots.forEach((lot) => {
          if (lot.lotName && lot.quantity > 0) {
            lotsObject[lot.lotName] = Number(lot.quantity);
          }
        });

        // Prepare form data
        const formData = new FormData();

        // Ensure the data structure matches what the API expects
        const assetInventoryData = {
          assetCode: values.assetCode,
          assetType: values.assetType,
          assetName: values.assetName,
          description: values.description,
          department: values.department,
          currentStock: totalStock,
          uom: values.uom,
          unitPrice: values.unitPrice,
          storageLocation: values.storageLocation,
          minimumRequiredStock: values.minimumRequiredStock,
          lowStockAlert: totalStock < values.minimumRequiredStock,
          lots: lotsObject,
          remarks: values.remarks,
        };

        // Add asset inventory data
        Object.keys(assetInventoryData).forEach((key) => {
          if (key === 'lots') {
            formData.append(key, JSON.stringify(assetInventoryData[key]));
          } else {
            formData.append(key, assetInventoryData[key]);
          }
        });

        // Add images
        images.forEach((file) => {
          formData.append('images', file);
        });

        console.log('Sending to API:', assetInventoryData);
        const response = await createAssetInventory(formData);
        if (response) {
          toast.success('Asset Inventory created successfully');
          navigate(`/${userType}/asset-inventory`);
        }
      } catch (error) {
        toast.error('Failed to create Asset Inventory: ' + (error.message || 'Unknown error'));
        console.error('Error creating asset inventory:', error);
      } finally {
        setIsUploading(false);
      }
    },
  });

  const handleAssetTypeChange = async (event) => {
    const assetType = event.target.value;
    setSelectedAssetType(assetType);
    formik.setFieldValue('assetType', assetType);
    formik.setFieldValue('assetCode', ''); // Reset asset code when type changes
    formik.setFieldValue('assetName', ''); // Reset asset name when type changes
    formik.setFieldValue('uom', ''); // Reset UOM when type changes

    if (assetType) {
      await fetchAssetCodesByType(assetType);
    } else {
      setAssetCodes([]);
    }
  };

  const fetchAssetCodesByType = async (assetType) => {
    try {
      setLoadingAssetCodes(true);
      const response = await fetchAssetCodes(assetType);
      console.log('🚀 ~ fetchAssetCodesByType ~ response:', response);
      if (response && Array.isArray(response)) {
        setAssetCodes(response);
      } else {
        setAssetCodes([]);
        toast.warning(`No asset codes found for ${assetType}`);
      }
    } catch (error) {
      console.error('Error fetching asset codes:', error);
      toast.error('Failed to fetch asset codes');
      setAssetCodes([]);
    } finally {
      setLoadingAssetCodes(false);
    }
  };

  const handleAssetCodeChange = (event, newValue) => {
    console.log('Selected asset:', newValue);
    if (newValue) {
      formik.setFieldValue('assetCode', newValue.mainAssetId);
      console.log('Setting assetCode to:', newValue.mainAssetId);
      // Auto-fill fields if available
      if (newValue.mainAssetId) {
        formik.setFieldValue('assetName', newValue.mainAssetId);
      }
      if (newValue.department) {
        formik.setFieldValue('department', newValue.department);
      }
      if (newValue.price) {
        formik.setFieldValue('unitPrice', newValue.price);
      }
    } else {
      formik.setFieldValue('assetCode', '');
      formik.setFieldValue('assetName', '');
      formik.setFieldValue('department', 'General');
      formik.setFieldValue('unitPrice', 0);
    }
    // Debug log to check current form values
    console.log('Current form values:', formik.values);
  };

  // Lot management functions
  const addLot = () => {
    const currentLots = formik.values.lots;
    formik.setFieldValue('lots', [...currentLots, { lotName: '', quantity: 0 }]);
  };

  const removeLot = (index) => {
    const currentLots = formik.values.lots;
    if (currentLots.length > 1) {
      const updatedLots = currentLots.filter((_, i) => i !== index);
      formik.setFieldValue('lots', updatedLots);
      updateCurrentStock(updatedLots);
    }
  };

  const updateLotQuantity = (index, quantity) => {
    const currentLots = [...formik.values.lots];
    currentLots[index].quantity = Number(quantity);
    formik.setFieldValue('lots', currentLots);
    updateCurrentStock(currentLots);
  };

  const updateCurrentStock = (lots) => {
    const totalStock = lots.reduce((sum, lot) => sum + Number(lot.quantity || 0), 0);
    formik.setFieldValue('currentStock', totalStock);
  };

  // Image management functions
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
    navigate(`/${userType}/asset-inventory`);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <PageContainer
      title="Admin - Create Asset Inventory"
      description="Create new asset inventory item"
    >
      <Breadcrumb title="Create Asset Inventory Item" items={BCrumb} />
      <ParentCard title="Create New Asset Inventory Item">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* ASSET TYPE SELECTION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="assetType" sx={{ marginTop: 0 }}>
                Asset Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControl
                fullWidth
                error={formik.touched.assetType && Boolean(formik.errors.assetType)}
              >
                <Select
                  id="assetType"
                  name="assetType"
                  value={formik.values.assetType}
                  onChange={handleAssetTypeChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Asset Type
                  </MenuItem>
                  {assetTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.assetType && formik.errors.assetType && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.assetType}
                  </Box>
                )}
              </FormControl>
            </Grid2>

            {/* ASSET CODE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="assetCode" sx={{ marginTop: 0 }}>
                Asset Code
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                options={assetCodes}
                autoHighlight
                loading={loadingAssetCodes}
                disabled={!selectedAssetType || loadingAssetCodes}
                getOptionLabel={(option) => option.mainAssetId || ''}
                value={
                  assetCodes.find((item) => item.mainAssetId === formik.values.assetCode) || null
                }
                onChange={handleAssetCodeChange}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder={
                      !selectedAssetType
                        ? 'Please select an asset type first'
                        : loadingAssetCodes
                        ? 'Loading asset codes...'
                        : 'Search Asset Code'
                    }
                    error={formik.touched.assetCode && Boolean(formik.errors.assetCode)}
                    helperText={formik.touched.assetCode && formik.errors.assetCode}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Box sx={{ fontWeight: 'bold' }}>{option.mainAssetId}</Box>
                      {option.department && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          Department: {option.department}
                        </Box>
                      )}
                      {option.price && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          Price: ₹{option.price}
                        </Box>
                      )}
                      {option.currentStatus && (
                        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                          Status: {option.currentStatus}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              />
            </Grid2>

            {/* ASSET NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="assetName" sx={{ marginTop: 0 }}>
                Asset Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="assetName"
                name="assetName"
                value={formik.values.assetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Asset Name"
                error={formik.touched.assetName && Boolean(formik.errors.assetName)}
                helperText={formik.touched.assetName && formik.errors.assetName}
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
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Description"
                multiline
                rows={2}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid2>

            {/* DEPARTMENT */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="department" sx={{ marginTop: 0 }}>
                Department
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="department"
                name="department"
                value={formik.values.department}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Department"
                error={formik.touched.department && Boolean(formik.errors.department)}
                helperText={formik.touched.department && formik.errors.department}
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
                name="uom"
                value={formik.values.uom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter UOM"
                error={formik.touched.uom && Boolean(formik.errors.uom)}
                helperText={formik.touched.uom && formik.errors.uom}
              />
            </Grid2>

            {/* UNIT PRICE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="unitPrice" sx={{ marginTop: 0 }}>
                Unit Price
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="unitPrice"
                name="unitPrice"
                type="number"
                value={formik.values.unitPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Unit Price"
                error={formik.touched.unitPrice && Boolean(formik.errors.unitPrice)}
                helperText={formik.touched.unitPrice && formik.errors.unitPrice}
              />
            </Grid2>

            {/* STORAGE LOCATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="storageLocation" sx={{ marginTop: 0 }}>
                Storage Location
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="storageLocation"
                name="storageLocation"
                value={formik.values.storageLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Storage Location"
                error={formik.touched.storageLocation && Boolean(formik.errors.storageLocation)}
                helperText={formik.touched.storageLocation && formik.errors.storageLocation}
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
                  <Typography variant="h6">Manage Asset Lots</Typography>
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
                {formik.values.lots.map((lot, index) => (
                  <Grid2 container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid2 size={{ xs: 12, md: 5 }}>
                      <CustomTextField
                        fullWidth
                        placeholder="Enter Lot Name (e.g., LOT-AST-202406-A)"
                        value={lot.lotName}
                        onChange={(e) => {
                          const currentLots = [...formik.values.lots];
                          currentLots[index].lotName = e.target.value;
                          formik.setFieldValue('lots', currentLots);
                        }}
                        error={
                          formik.touched.lots?.[index]?.lotName &&
                          Boolean(formik.errors.lots?.[index]?.lotName)
                        }
                        helperText={
                          formik.touched.lots?.[index]?.lotName &&
                          formik.errors.lots?.[index]?.lotName
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
                          formik.touched.lots?.[index]?.quantity &&
                          Boolean(formik.errors.lots?.[index]?.quantity)
                        }
                        helperText={
                          formik.touched.lots?.[index]?.quantity &&
                          formik.errors.lots?.[index]?.quantity
                        }
                      />
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 2 }}>
                      <IconButton
                        color="error"
                        onClick={() => removeLot(index)}
                        disabled={formik.values.lots.length === 1}
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
                name="currentStock"
                type="number"
                value={formik.values.currentStock}
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
                name="minimumRequiredStock"
                type="number"
                value={formik.values.minimumRequiredStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Minimum Required Stock"
                error={
                  formik.touched.minimumRequiredStock && Boolean(formik.errors.minimumRequiredStock)
                }
                helperText={
                  formik.touched.minimumRequiredStock && formik.errors.minimumRequiredStock
                }
              />
            </Grid2>

            {/* REMARKS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="remarks" sx={{ marginTop: 0 }}>
                Remarks
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="remarks"
                name="remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Remarks"
                multiline
                rows={2}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
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
              {isUploading ? 'Creating...' : 'Create Asset Inventory'}
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

export default CreateAssetInventory;
