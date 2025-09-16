'use client';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Grid2, Button, IconButton, Chip, Typography } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import {
  fetchMaintenanceInventoryById,
  updateMaintenanceInventory,
} from '@/api/maintenanceInventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const MaintenanceInventoryEdit = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/maintenance-inventory`, title: 'Maintenance Inventory' },
    { title: 'Edit' },
  ];
  const navigate = useNavigate();
  const { id, maintenanceType } = useParams();
  const [maintenanceInventory, setMaintenanceInventory] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      maintenanceCode: '',
      maintenanceName: '',
      description: '',
      maintenanceType: '',
      department: '',
      uom: '',
      currentStock: 0,
      minimumRequiredStock: 0,
      unitPrice: 0,
      storageLocation: '',
      lots: [{ lotName: '', quantity: 0 }],
      remarks: '',
      status: 'Active',
    },
    validationSchema: Yup.object({
      maintenanceName: Yup.string().required('Maintenance Name is required'),
      description: Yup.string(),
      department: Yup.string().required('Department is required'),
      uom: Yup.string().required('UOM is required'),
      unitPrice: Yup.number()
        .required('Unit Price is required')
        .min(0, 'Unit Price cannot be negative'),
      storageLocation: Yup.string(),
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
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: async (values) => {
      try {
        setIsUploading(true);
        const formData = new FormData();

        const totalStock = values.lots.reduce((sum, lot) => sum + Number(lot.quantity), 0);
        const lotsObject = {};
        values.lots.forEach((lot) => {
          if (lot.lotName && lot.quantity > 0) {
            lotsObject[lot.lotName] = Number(lot.quantity);
          }
        });

        const updatedData = {
          maintenanceName: values.maintenanceName,
          description: values.description,
          department: values.department,
          uom: values.uom,
          currentStock: totalStock,
          minimumRequiredStock: values.minimumRequiredStock,
          lowStockAlert: totalStock < values.minimumRequiredStock,
          unitPrice: values.unitPrice,
          storageLocation: values.storageLocation,
          lots: lotsObject,
          remarks: values.remarks,
          status: values.status,
        };

        Object.keys(updatedData).forEach((key) => {
          if (key === 'lots') {
            formData.append(key, JSON.stringify(updatedData[key]));
          } else {
            formData.append(key, updatedData[key]);
          }
        });

        existingImages.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });

        newImages.forEach((file) => {
          formData.append('images', file);
        });

        console.log('Submitting form data...');
        const response = await updateMaintenanceInventory(id, formData);
        if (response) {
          toast.success('Maintenance inventory item updated successfully');
          navigate(`/${userType}/maintenance-inventory`);
        }
      } catch (error) {
        console.error('Update error:', error);
        toast.error(
          'Failed to update maintenance inventory item: ' + (error.message || 'Unknown error'),
        );
      } finally {
        setIsUploading(false);
      }
    },
  });

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

  const handleNewImagesChange = (event) => {
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
    navigate(`/${userType}/maintenance-inventory`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchMaintenanceInventoryById(id);
        console.log('fetchData response:', response);
        if (response && response.data) {
          const item = response.data;
          setMaintenanceInventory(item);

          const lotsArray = [];
          if (item.lots && typeof item.lots === 'object') {
            Object.entries(item.lots).forEach(([lotName, quantity]) => {
              lotsArray.push({ lotName, quantity: Number(quantity) });
            });
          }
          if (lotsArray.length === 0) {
            lotsArray.push({ lotName: '', quantity: 0 });
          }

          formik.setValues({
            maintenanceCode: item.maintenanceCode || '',
            maintenanceName: item.maintenanceName || '',
            description: item.description || '',
            maintenanceType: item.maintenanceType || '',
            department: item.department || '',
            uom: item.uom || '',
            currentStock: item.currentStock || 0,
            minimumRequiredStock: item.minimumRequiredStock || 0,
            unitPrice: item.unitPrice || 0,
            storageLocation: item.storageLocation || '',
            lots: lotsArray,
            remarks: item.remarks || '',
            status: item.status || 'Active',
          });

          if (item.images && item.images.length > 0) {
            setExistingImages(item.images);
          }
        } else {
          toast.warning('Maintenance inventory item not found');
          navigate(`/${userType}/maintenance-inventory`);
        }
      } catch (error) {
        console.error('fetchData error:', error);
        toast.error('Failed to fetch maintenance inventory item');
        navigate(`/${userType}/maintenance-inventory`);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id]);

  if (loading) {
    return (
      <PageContainer
        title="Admin - Edit Maintenance Inventory"
        description="Loading maintenance inventory item"
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          Loading...
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Admin - Edit Maintenance Inventory"
      description="Edit maintenance inventory item"
    >
      <Breadcrumb
        title={`Edit ${
          maintenanceType
            ? maintenanceType.charAt(0).toUpperCase() + maintenanceType.slice(1)
            : 'Maintenance'
        } Inventory Item`}
        items={BCrumb}
      />
      <ParentCard title="Edit Maintenance Inventory Item">
        <form onSubmit={formik.handleSubmit}>
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
                {existingImages.length > 0 ? 'Add More Images' : 'Choose Images'}
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
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  multiple
                  onChange={handleNewImagesChange}
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
            </Grid2>

            {/* MAINTENANCE CODE (Read-only) */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="maintenanceCode" sx={{ marginTop: 0 }}>
                Maintenance Code
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="maintenanceCode"
                name="maintenanceCode"
                value={formik.values.maintenanceCode}
                disabled
                placeholder="Maintenance Code (Read-only)"
              />
            </Grid2>

            {/* MAINTENANCE TYPE (Read-only) */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="maintenanceType" sx={{ marginTop: 0 }}>
                Maintenance Type
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Chip
                label={formik.values.maintenanceType}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.875rem', height: '40px' }}
              />
            </Grid2>

            {/* MAINTENANCE NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="maintenanceName" sx={{ marginTop: 0 }}>
                Maintenance Name
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="maintenanceName"
                name="maintenanceName"
                value={formik.values.maintenanceName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Maintenance Name"
                error={formik.touched.maintenanceName && Boolean(formik.errors.maintenanceName)}
                helperText={formik.touched.maintenanceName && formik.errors.maintenanceName}
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

            {/* STATUS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="status" sx={{ marginTop: 0 }}>
                Status
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="status"
                name="status"
                select
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </CustomTextField>
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
                  <Typography variant="h6">Manage Maintenance Lots</Typography>
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
                        placeholder="Enter Lot Name (e.g., LOT-MNT-202406-A)"
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
              {isUploading ? 'Updating...' : 'Update Maintenance Inventory'}
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

export default MaintenanceInventoryEdit;
