'use client';

import { useEffect, useState } from 'react';
import { Box, Grid2, Button, Typography, IconButton, Autocomplete } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { MenuItem } from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { createOtherStoreInventory } from '@/api/otherstoresInventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { getOtherStoreByType } from '@/api/assetmanagementERP';

const CreateOtherStoreInventory = () => {
  const userType = useSelector(selectCurrentUserType);
  const { itemType } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingItems, setExistingItems] = useState([]);
  const [selectedExistingItem, setSelectedExistingItem] = useState('');
  const [loadingExistingItems, setLoadingExistingItems] = useState(false);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/otherstore-inventory`, title: 'Other Store Inventory' },
    { title: 'Create' },
  ];

  // Form state
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    itemType: itemType || '',
    description: '',
    currentStock: '',
    uom: '', // UOM is now a text input field
    condition: 'New',
    status: 'Active',
    minimumRequiredStock: '',
    maximumStock: '',
    location: '',
    department: '',
    unitPrice: '',
    remarks: '',
  });

  // Lot management state
  const [lots, setLots] = useState([{ lotName: '', quantity: '' }]);

  // Image upload state
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchExistingItems = async () => {
      if (formData.itemType) {
        try {
          setLoadingExistingItems(true);
          console.log('🚀 ~ fetchExistingItems ~ itemType:', formData.itemType);

          const response = await getOtherStoreByType(formData.itemType, 0, 100, '');
          console.log('🚀 ~ fetchExistingItems ~ response:', response);

          // Handle the response structure - similar to maintenance inventory pattern
          const itemsData = response?.data?.items || response?.items || response?.data || response;

          if (itemsData && Array.isArray(itemsData)) {
            setExistingItems(itemsData);
            console.log('🚀 ~ fetchExistingItems ~ itemsData:', itemsData);
          } else {
            setExistingItems([]);
            console.log(`No existing items found for ${formData.itemType}`);
          }
        } catch (error) {
          console.error('Error fetching existing items:', error);
          toast.error('Failed to fetch existing items');
          setExistingItems([]);
        } finally {
          setLoadingExistingItems(false);
        }
      } else {
        setExistingItems([]);
      }
    };

    fetchExistingItems();
  }, [formData.itemType]); // Watch formData.itemType instead of itemType param

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleExistingItemChange = (event, newValue) => {
    console.log('Selected existing item:', newValue);
    if (newValue) {
      setSelectedExistingItem(newValue._id);
      // Auto-fill fields if available
      setFormData({
        itemCode: newValue.itemCode || '',
        itemName: newValue.itemName || '',
        itemType: newValue.itemType || itemType || '',
        description: newValue.description || '',
      });
    } else {
      setSelectedExistingItem('');
      // Reset form to defaults
      setFormData({
        itemCode: '',
        itemName: '',
        itemType: itemType || '',
        description: '',
        currentStock: '',
        uom: '',
        condition: 'New',
        status: 'Active',
        minimumRequiredStock: '',
        maximumStock: '',
        location: '',
        department: '',
        unitPrice: '',
        remarks: '',
      });
    }
    // Debug log to check current form values
    console.log('Current form values:', formData);
  };

  // Handle lot changes
  const handleLotChange = (index, field, value) => {
    const updatedLots = [...lots];
    updatedLots[index][field] = value;
    setLots(updatedLots);
  };

  // Add new lot
  const addLot = () => {
    setLots([...lots, { lotName: '', quantity: '' }]);
  };

  // Remove lot
  const removeLot = (index) => {
    if (lots.length > 1) {
      const updatedLots = lots.filter((_, i) => i !== index);
      setLots(updatedLots);
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImages((prev) => [...prev, event.target.result]);
          setImageFiles((prev) => [...prev, file]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemCode.trim()) newErrors.itemCode = 'Item Code is required';
    if (!formData.itemName.trim()) newErrors.itemName = 'Item Name is required';
    if (!formData.itemType.trim()) newErrors.itemType = 'Item Type is required';
    if (!formData.uom.trim()) newErrors.uom = 'UOM is required';

    // Validate lots
    const validLots = lots.filter((lot) => lot.lotName.trim() && lot.quantity.trim());
    if (validLots.length === 0) {
      newErrors.lots = 'At least one lot with name and quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      // Prepare lots data
      const validLots = lots.filter((lot) => lot.lotName.trim() && lot.quantity.trim());
      const lotsObject = {};
      validLots.forEach((lot) => {
        lotsObject[lot.lotName] = Number.parseInt(lot.quantity);
      });

      // Calculate total stock from lots
      const totalStock = validLots.reduce((sum, lot) => sum + Number.parseInt(lot.quantity), 0);

      const submitData = {
        ...formData,
        currentStock: totalStock,
        lots: lotsObject,
        images: images,
        unitPrice: formData.unitPrice ? Number.parseFloat(formData.unitPrice) : 0,
        minimumRequiredStock: Number.parseInt(formData.minimumRequiredStock),
        maximumStock: formData.maximumStock ? Number.parseInt(formData.maximumStock) : null,
      };

      const response = await createOtherStoreInventory(submitData);

      if (response) {
        toast.success('Other store inventory item created successfully!');
        navigate(`/${userType}/otherstore-inventory`);
      }
    } catch (error) {
      console.error('Error creating other store inventory:', error);
      toast.error(error.response?.data?.message || 'Failed to create other store inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Admin - Create Other Store Inventory"
      description="Create new other store inventory item"
    >
      <Breadcrumb
        title={`Create ${
          itemType ? itemType.charAt(0).toUpperCase() + itemType.slice(1) : 'Other Store'
        } Inventory`}
        items={BCrumb}
      />

      <form onSubmit={handleSubmit}>
        <ParentCard title="Other Store Inventory Item Details">
          <Grid2 container rowSpacing={2}>
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="itemType" sx={{ marginTop: 0 }}>
                Item Type *
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="itemType"
                name="itemType"
                value={formData.itemType}
                onChange={handleInputChange}
                error={!!errors.itemType}
              >
                <MenuItem value="TOOLS&SPAREPARTS">Tools & Spare Parts</MenuItem>
                <MenuItem value="STATIONERY&HOUSEKEEPING">Stationery & Housekeeping</MenuItem>
                <MenuItem value="EMBROIDERYSTORE">Embroidery Store</MenuItem>
              </CustomSelect>
              {errors.itemType && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.itemType}
                </Typography>
              )}
            </Grid2>

            {formData.itemType && existingItems.length > 0 && (
              <>
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="existingItem" sx={{ marginTop: 0 }}>
                    Select Existing Item (Optional)
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <Autocomplete
                    options={existingItems}
                    autoHighlight
                    loading={loadingExistingItems}
                    disabled={loadingExistingItems}
                    getOptionLabel={(option) => `${option.itemCode} - ${option.itemName}` || ''}
                    value={existingItems.find((item) => item._id === selectedExistingItem) || null}
                    onChange={handleExistingItemChange}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder={
                          loadingExistingItems
                            ? 'Loading existing items...'
                            : 'Search existing items or create new'
                        }
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Box sx={{ fontWeight: 'bold' }}>
                            {option.itemCode} - {option.itemName}
                          </Box>
                          {option.unitPrice && (
                            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                              Unit Price: ₹{option.unitPrice}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  />
                </Grid2>
              </>
            )}

            {/* ITEM CODE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="itemCode" sx={{ marginTop: 0 }}>
                Item Code *
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="itemCode"
                name="itemCode"
                value={formData.itemCode}
                onChange={handleInputChange}
                error={!!errors.itemCode}
                helperText={errors.itemCode}
                placeholder="Enter item code"
                disabled={!formData.itemType} // Disable when no item type selected
              />
            </Grid2>

            {/* ITEM NAME */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="itemName" sx={{ marginTop: 0 }}>
                Item Name *
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                error={!!errors.itemName}
                helperText={errors.itemName}
                placeholder="Enter item name"
                disabled={!formData.itemType} // Disable when no item type selected
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
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={2}
                placeholder="Enter description"
                disabled={!formData.itemType} // Disable when no item type selected
              />
            </Grid2>

            {/* UOM - Changed from dropdown to input field */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="uom" sx={{ marginTop: 0 }}>
                UOM *
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="uom"
                name="uom"
                value={formData.uom}
                onChange={handleInputChange}
                error={!!errors.uom}
                helperText={errors.uom}
                placeholder="Enter UOM (e.g., Pieces, Kg, Liters, Meters, Sets, Boxes, Units)"
                disabled={!formData.itemType} // Disable when no item type selected
              />
            </Grid2>

            {/* CONDITION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="condition" sx={{ marginTop: 0 }}>
                Condition
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                disabled={!formData.itemType} // Disable when no item type selected
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="Used">Used</MenuItem>
                <MenuItem value="Refurbished">Refurbished</MenuItem>
                <MenuItem value="Damaged">Damaged</MenuItem>
                <MenuItem value="Repair needed">Repair needed</MenuItem>
              </CustomSelect>
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
              <CustomSelect
                fullWidth
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={!formData.itemType} // Disable when no item type selected
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Discontinued">Discontinued</MenuItem>
              </CustomSelect>
            </Grid2>

            {/* MINIMUM REQUIRED STOCK */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="minimumRequiredStock" sx={{ marginTop: 0 }}>
                Minimum Required Stock *
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="minimumRequiredStock"
                name="minimumRequiredStock"
                type="number"
                value={formData.minimumRequiredStock}
                onChange={handleInputChange}
                error={!!errors.minimumRequiredStock}
                helperText={errors.minimumRequiredStock}
                placeholder="Enter minimum required stock"
                disabled={!formData.itemType} // Disable when no item type selected
              />
            </Grid2>

            {/* MAXIMUM STOCK */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="maximumStock" sx={{ marginTop: 0 }}>
                Maximum Stock
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="maximumStock"
                name="maximumStock"
                type="number"
                value={formData.maximumStock}
                onChange={handleInputChange}
                placeholder="Enter maximum stock"
                disabled={!formData.itemType} // Disable when no item type selected
              />
            </Grid2>

            {/* LOCATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="location" sx={{ marginTop: 0 }}>
                Location
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter storage location"
                disabled={!formData.itemType} // Disable when no item type selected
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
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter department"
                disabled={!formData.itemType} // Disable when no item type selected
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
                step="0.01"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Enter unit price"
                disabled={!formData.itemType} // Disable when no item type selected
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
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
                value={formData.remarks}
                onChange={handleInputChange}
                multiline
                rows={2}
                placeholder="Enter remarks"
                disabled={!formData.itemType} // Disable when no item type selected
              />
            </Grid2>
          </Grid2>
        </ParentCard>

        {formData.itemType && (
          <ParentCard title="Lot Details" sx={{ mt: 3 }}>
            {errors.lots && (
              <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>
                {errors.lots}
              </Typography>
            )}
            {lots.map((lot, index) => (
              <Grid2 container rowSpacing={2} key={index} sx={{ mb: 2 }}>
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel sx={{ marginTop: 0 }}>Lot {index + 1}</CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    fullWidth
                    placeholder="Lot Name"
                    value={lot.lotName}
                    onChange={(e) => handleLotChange(index, 'lotName', e.target.value)}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 3 }}>
                  <CustomTextField
                    fullWidth
                    type="number"
                    placeholder="Quantity"
                    value={lot.quantity}
                    onChange={(e) => handleLotChange(index, 'quantity', e.target.value)}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {index === lots.length - 1 && (
                      <IconButton onClick={addLot} color="primary">
                        <AddIcon />
                      </IconButton>
                    )}
                    {lots.length > 1 && (
                      <IconButton onClick={() => removeLot(index)} color="error">
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </Box>
                </Grid2>
              </Grid2>
            ))}
          </ParentCard>
        )}

        {formData.itemType && (
          <ParentCard title="Item Images" sx={{ mt: 3 }}>
            <Box sx={{ mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                  Upload Images
                </Button>
              </label>
            </Box>

            {images.length > 0 && (
              <Grid2 container spacing={2}>
                {images.map((image, index) => (
                  <Grid2 key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 150,
                        overflow: 'hidden',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Upload ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(255, 255, 255, 0.8)',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                          },
                        }}
                        size="small"
                        onClick={() => removeImage(index)}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            )}
          </ParentCard>
        )}

        {/* SUBMIT BUTTONS */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/${userType}/otherstore-inventory`)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </Button>
        </Box>
      </form>
    </PageContainer>
  );
};

export default CreateOtherStoreInventory;
