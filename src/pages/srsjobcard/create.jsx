import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { createSrsJobCard } from '@/api/srsjobcard.api';
import { toast } from 'react-toastify';
import {
  fetchAllProductMasterSkus,
  fetchProductImagesBySkuCode,
  fetchProductMasterBySku,
} from '@/api/productmaster.api';
import PageContainer from '@/components/container/PageContainer';
import Spinner from '@/components/common/spinner/Spinner';

// Add debounce utility function
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
};

const CreateSrsJobCard = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredSkus, setFilteredSkus] = useState([]); // This will now store full product objects
  const [productImages, setProductImages] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress: '',
    paymentTerms: '',
    gstin: '',
    products: [
      {
        product: '',
        skuCode: '',
        description: '',
        bodyColor: '',
        panelColor: '',
        gender: 'male',
        embroidery: false,
        embroideryLogoChest: '',
        embroideryLogoBack: '',
        embroideryLogoSleeveL: '',
        embroideryLogoSleeveR: '',
        embroideryRemarks: '',
        printing: false,
        printingLogo: '',
        printingLogoBack: '',
        printingLogoSleeveL: '',
        printingLogoSleeveR: '',
        printingRemarks: '',
        sizeSpecification: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          '2xl': 0,
          '3xl': 0,
          '4xl': 0,
          '5xl': 0,
          total: 0,
        },
      },
    ],
    dealerOrderedBy: '',
    dealerDesignation: '',
    dealerMobile: '',
    dealerEmail: '',
    personnelOrderedBy: '',
    personnelDesignation: '',
    personnelMobile: '',
    personnelEmail: '',
    orderExecutedBy: '',
    orderProcessedBy: '',
    deliveryDate: '',
  });

  // Search SKUs from API
  const searchSkusFromAPI = async (searchTerm) => {
    setIsSearching(true);
    try {
      const skuData = await fetchAllProductMasterSkus({
        page: 1,
        limit: 50,
        search: searchTerm,
      });
      // Assuming skuData.records contains objects like { skuCode: 'SKU001', name: 'Product Name', ... }
      setFilteredSkus(skuData?.records || []);
    } catch (error) {
      console.error('Error searching SKUs:', error);
      toast.error('Failed to search SKU codes');
    } finally {
      setIsSearching(false);
    }
  };
  const debouncedSearchSkus = useDebounce(searchSkusFromAPI, 300);

  const handleSkuInput = (event) => {
    const sku = event.target.value.toUpperCase();
    if (sku && typeof sku === 'string' && sku.length > 0) {
      debouncedSearchSkus(sku);
    } else {
      setFilteredSkus([]);
    }
  };

  // Handle SKU change and fetch product details
  const handleSkuChange = async (productIndex, newValue) => {
    const updatedProducts = [...formData.products];

    if (!newValue) {
      // Clear product details if SKU is empty
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        product: '',
        description: '',
        bodyColor: '',
        panelColor: '',
        gender: 'male',
        embroidery: false,
        embroideryLogoChest: '',
        embroideryLogoBack: '',
        embroideryLogoSleeveL: '',
        embroideryLogoSleeveR: '',
        embroideryRemarks: '',
        printing: false,
        printingLogo: '',
        printingLogoBack: '',
        printingLogoSleeveL: '',
        printingLogoSleeveR: '',
        printingRemarks: '',
        sizeSpecification: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          '2xl': 0,
          '3xl': 0,
          '4xl': 0,
          '5xl': 0,
          total: 0,
        },
      };
      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setProductImages([]);
      return;
    }

    try {
      const productMasterData = await fetchProductMasterBySku(newValue);
      if (productMasterData) {
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          product: productMasterData.name || '',
          skuCode: newValue, // Ensure skuCode is set to the fetched/selected SKU
          description: productMasterData.description || '',
          gender: productMasterData.gender || 'male',
          bodyColor: productMasterData.color || '',
          panelColor: productMasterData.panelcolor || '',
          sizeSpecification: {
            xs: Number(productMasterData.xs) || 0,
            s: Number(productMasterData.s) || 0,
            m: Number(productMasterData.m) || 0,
            l: Number(productMasterData.l) || 0,
            xl: Number(productMasterData.xl) || 0,
            '2xl': Number(productMasterData['2xl']) || 0,
            '3xl': Number(productMasterData['3xl']) || 0,
            '4xl': Number(productMasterData['4xl']) || 0,
            '5xl': Number(productMasterData['5xl']) || 0,
            total: 0, // Will be recalculated below
          },
        };
        // Calculate total
        const sizeFields = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
        const total = sizeFields.reduce((sum, sizeField) => {
          return sum + (parseInt(updatedProducts[productIndex].sizeSpecification[sizeField]) || 0);
        }, 0);
        updatedProducts[productIndex].sizeSpecification.total = total;

        setFormData((prev) => ({
          ...prev,
          products: updatedProducts,
        }));
        // Fetch product images
        try {
          const imageUrls = await fetchProductImagesBySkuCode(newValue);
          setProductImages(imageUrls);
        } catch (err) {
          console.error('Error fetching images:', err);
        }
      } else {
        // If SKU not found, clear product details but keep SKU typed by user
        updatedProducts[productIndex] = {
          ...updatedProducts[productIndex],
          product: '', // Clear product name
          description: '',
          bodyColor: '',
          panelColor: '',
          gender: 'male',
          embroidery: false,
          embroideryLogoChest: '',
          embroideryLogoBack: '',
          embroideryLogoSleeveL: '',
          embroideryLogoSleeveR: '',
          embroideryRemarks: '',
          printing: false,
          printingLogo: '',
          printingLogoBack: '',
          printingLogoSleeveL: '',
          printingLogoSleeveR: '',
          printingRemarks: '',
          sizeSpecification: {
            xs: 0,
            s: 0,
            m: 0,
            l: 0,
            xl: 0,
            '2xl': 0,
            '3xl': 0,
            '4xl': 0,
            '5xl': 0,
            total: 0,
          },
        };
        setFormData((prev) => ({ ...prev, products: updatedProducts }));
        setProductImages([]);
        toast.warn(`SKU "${newValue}" not found.`);
      }
    } catch (err) {
      console.error('Error fetching product master data:', err);
      toast.error('Failed to fetch product master details');
      // On error, also clear product details
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        product: '',
        description: '',
        bodyColor: '',
        panelColor: '',
        gender: 'male',
        embroidery: false,
        embroideryLogoChest: '',
        embroideryLogoBack: '',
        embroideryLogoSleeveL: '',
        embroideryLogoSleeveR: '',
        embroideryRemarks: '',
        printing: false,
        printingLogo: '',
        printingLogoBack: '',
        printingLogoSleeveL: '',
        printingLogoSleeveR: '',
        printingRemarks: '',
        sizeSpecification: {
          xs: 0,
          s: 0,
          m: 0,
          l: 0,
          xl: 0,
          '2xl': 0,
          '3xl': 0,
          '4xl': 0,
          '5xl': 0,
          total: 0,
        },
      };
      setFormData((prev) => ({ ...prev, products: updatedProducts }));
      setProductImages([]);
    }
  };

  // Get SKU options for autocomplete
  const getSkuOptions = () => {
    return filteredSkus; // filteredSkus now contains objects { skuCode, name, ... }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle product changes (for fields other than SKU)
  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  // Handle size specification changes
  const handleSizeChange = (productIndex, size, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      sizeSpecification: {
        ...updatedProducts[productIndex].sizeSpecification,
        [size]: parseInt(value) || 0,
      },
    };
    // Calculate total - exclude 'total' field from calculation
    const sizeFields = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
    const total = sizeFields.reduce((sum, sizeField) => {
      return sum + (parseInt(updatedProducts[productIndex].sizeSpecification[sizeField]) || 0);
    }, 0);
    updatedProducts[productIndex].sizeSpecification.total = total;
    setFormData((prev) => ({
      ...prev,
      products: updatedProducts,
    }));
  };

  // Add new product
  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product: '',
          skuCode: '',
          description: '',
          bodyColor: '',
          panelColor: '',
          gender: 'male',
          embroidery: false,
          embroideryLogoChest: '',
          embroideryLogoBack: '',
          embroideryLogoSleeveL: '',
          embroideryLogoSleeveR: '',
          embroideryRemarks: '',
          printing: false,
          printingLogo: '',
          printingLogoBack: '',
          printingLogoSleeveL: '',
          printingLogoSleeveR: '',
          printingRemarks: '',
          sizeSpecification: {
            xs: 0,
            s: 0,
            m: 0,
            l: 0,
            xl: 0,
            '2xl': 0,
            '3xl': 0,
            '4xl': 0,
            '5xl': 0,
            total: 0,
          },
        },
      ],
    }));
  };

  // Remove product
  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      setFormData((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.customerName || !formData.dealerOrderedBy || !formData.personnelOrderedBy) {
        toast.error('Please fill in all required fields');
        return;
      }
      // Validate products
      for (let i = 0; i < formData.products.length; i++) {
        const product = formData.products[i];
        if (!product.product || !product.skuCode || !product.description) {
          toast.error(`Please fill in all required fields for product ${i + 1}`);
          return;
        }
      }
      // Log the exact data being sent
      console.log('🚀 ~ handleSubmit ~ formData being sent:', JSON.stringify(formData, null, 2));
      console.log('🚀 ~ handleSubmit ~ products array:', formData.products);
      console.log('🚀 ~ handleSubmit ~ products length:', formData.products.length);
      // Ensure products array is properly structured and matches backend schema
      const validatedData = {
        customerName: formData.customerName,
        customerAddress: formData.customerAddress || '',
        paymentTerms: formData.paymentTerms || '',
        gstin: formData.gstin || '',
        // Products array with proper structure
        products: formData.products.map((product) => ({
          product: product.product,
          skuCode: product.skuCode,
          description: product.description,
          bodyColor: product.bodyColor || '',
          panelColor: product.panelColor || '',
          gender: product.gender || 'male',
          // Embroidery fields
          embroidery: Boolean(product.embroidery),
          embroideryLogoChest: product.embroideryLogoChest || '',
          embroideryLogoBack: product.embroideryLogoBack || '',
          embroideryLogoSleeveL: product.embroideryLogoSleeveL || '',
          embroideryLogoSleeveR: product.embroideryLogoSleeveR || '',
          embroideryRemarks: product.embroideryRemarks || '',
          // Printing fields
          printing: Boolean(product.printing),
          printingLogo: product.printingLogo || '',
          printingLogoBack: product.printingLogoBack || '',
          printingLogoSleeveL: product.printingLogoSleeveL || '',
          printingLogoSleeveR: product.printingLogoSleeveR || '',
          printingRemarks: product.printingRemarks || '',
          // Size specification with proper number types
          sizeSpecification: {
            xs: parseInt(product.sizeSpecification.xs) || 0,
            s: parseInt(product.sizeSpecification.s) || 0,
            m: parseInt(product.sizeSpecification.m) || 0,
            l: parseInt(product.sizeSpecification.l) || 0,
            xl: parseInt(product.sizeSpecification.xl) || 0,
            '2xl': parseInt(product.sizeSpecification['2xl']) || 0,
            '3xl': parseInt(product.sizeSpecification['3xl']) || 0,
            '4xl': parseInt(product.sizeSpecification['4xl']) || 0,
            '5xl': parseInt(product.sizeSpecification['5xl']) || 0,
            total: parseInt(product.sizeSpecification.total) || 0,
          },
        })),
        // Dealer information
        dealerOrderedBy: formData.dealerOrderedBy,
        dealerDesignation: formData.dealerDesignation || '',
        dealerMobile: formData.dealerMobile || '',
        dealerEmail: formData.dealerEmail || '',
        // Personnel information
        personnelOrderedBy: formData.personnelOrderedBy,
        personnelDesignation: formData.personnelDesignation || '',
        personnelMobile: formData.personnelMobile || '',
        personnelEmail: formData.personnelEmail || '',
        orderExecutedBy: formData.orderExecutedBy || '',
        orderProcessedBy: formData.orderProcessedBy || '',
        deliveryDate: formData.deliveryDate || null,
        status: 'in_progress',
      };
      console.log('🚀 ~ handleSubmit ~ validatedData:', JSON.stringify(validatedData, null, 2));
      await createSrsJobCard(validatedData);
      toast.success('SRS Job Card created successfully');
      navigate(`/${userType}/srs-jobcard`);
    } catch (error) {
      console.error('Error creating job card:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to create job card');
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

  return (
    <PageContainer title="Create SRS Job Card" description="Create a new SRS job card">
      <Box component="form" onSubmit={handleSubmit}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate(`/${userType}/srs-jobcard`)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Create SRS Job Card
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <Spinner /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Job Card'}
          </Button>
        </Box>
        {/* Customer Information */}
        <Box mb={4}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}
          >
            👤 Customer Information
          </Typography>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Name *"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer Address"
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Payment Terms"
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="GSTIN"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
        {/* Products */}
        <Box mb={4}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}
          >
            📦 Products ({formData.products.length})
          </Typography>
          <Card
            sx={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Product Details
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addProduct}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  Add Product
                </Button>
              </Box>
              {formData.products.map((product, index) => (
                <Box key={index} mb={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1">Product {index + 1}</Typography>
                    {formData.products.length > 1 && (
                      <IconButton color="error" onClick={() => removeProduct(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Grid container spacing={2}>
                    {/* SKU Code First */}
                    <Grid item xs={12} md={4}>
                      <Autocomplete
                        freeSolo
                        loading={isSearching}
                        options={getSkuOptions()} // Now contains objects { skuCode, name, ... }
                        getOptionLabel={(option) => {
                          // option can be a string (if freeSolo and user types) or an object (from options array)
                          if (typeof option === 'string') {
                            return option; // Display the typed string
                          }
                          return option.skuCode || ''; // Always display skuCode from object
                        }}
                        isOptionEqualToValue={(option, value) => {
                          // option is from options array (object), value is what's currently in the input (string or object)
                          if (typeof value === 'string') {
                            return option.skuCode === value;
                          }
                          return option.skuCode === value.skuCode;
                        }}
                        // The `value` prop should be the selected object.
                        // We find the object in filteredSkus that matches the current product's skuCode.
                        value={filteredSkus.find((opt) => opt.skuCode === product.skuCode) || null}
                        // The `inputValue` prop controls the text in the input field.
                        // Always show `product.skuCode` (what's being typed/searched or selected).
                        inputValue={product.skuCode?.toUpperCase() || ''}
                        onInputChange={(event, newInputValue) => {
                          // This fires on every input change. We need to update skuCode for search.
                          const uppercasedValue = newInputValue.toUpperCase();
                          handleProductChange(index, 'skuCode', uppercasedValue); // Update skuCode for search
                          // Do NOT update product.product here, it should only be updated after fetch
                          debouncedSearchSkus(uppercasedValue);
                        }}
                        onChange={(event, selectedOption) => {
                          // This fires when an option is selected. selectedOption will be the object from filteredSkus or a string if freeSolo.
                          if (typeof selectedOption === 'string') {
                            // User typed a value and pressed Enter or blurred
                            handleSkuChange(index, selectedOption.toUpperCase());
                            handleProductChange(index, 'skuCode', selectedOption.toUpperCase());
                          } else if (selectedOption && selectedOption.skuCode) {
                            // User selected an option (selectedOption is an object)
                            handleSkuChange(index, selectedOption.skuCode); // Fetch full details based on selected SKU
                            handleProductChange(index, 'skuCode', selectedOption.skuCode); // Ensure skuCode is set to selected SKU
                          } else {
                            // selectedOption is null (input cleared)
                            handleSkuChange(index, ''); // Clear product details
                            handleProductChange(index, 'skuCode', '');
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="SKU Code * (Search & Auto-fill)"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#e3f2fd',
                                borderColor: '#2196f3',
                                '&:hover': {
                                  backgroundColor: '#bbdefb',
                                  borderColor: '#1976d2',
                                },
                                '&.Mui-focused': {
                                  backgroundColor: '#bbdefb',
                                  borderColor: '#1565c0',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#1976d2',
                                fontWeight: 'bold',
                              },
                            }}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {isSearching ? (
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginRight: '8px',
                                      }}
                                    >
                                      <div
                                        style={{
                                          width: '16px',
                                          height: '16px',
                                          border: '2px solid #f3f3f3',
                                          borderTop: '2px solid #3498db',
                                          borderRadius: '50%',
                                          animation: 'spin 1s linear infinite',
                                        }}
                                      />
                                    </div>
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                            helperText="🔍 Type to search SKU codes - this will auto-fill all product details"
                          />
                        )}
                      />
                    </Grid>
                    {/* Product Name Second */}
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Product Name *"
                        value={product.product}
                        onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                        required
                        disabled={!!product.skuCode} // Disable when SKU is selected
                        helperText={
                          product.skuCode
                            ? 'Auto-filled from SKU'
                            : 'Enter product name or select SKU above'
                        }
                      />
                    </Grid>
                    {/* Gender Third */}
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={product.gender}
                          onChange={(e) => handleProductChange(index, 'gender', e.target.value)}
                          label="Gender"
                          disabled={!!product.skuCode} // Disable when SKU is selected
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                          <MenuItem value="unisex">Unisex</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Description *"
                        value={product.description}
                        onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                        multiline
                        rows={2}
                        required
                        disabled={!!product.skuCode} // Disable when SKU is selected
                        helperText={
                          product.skuCode
                            ? 'Auto-filled from SKU'
                            : 'Enter product description or select SKU above'
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Body Color"
                        value={product.bodyColor}
                        onChange={(e) => handleProductChange(index, 'bodyColor', e.target.value)}
                        disabled={!!product.skuCode} // Disable when SKU is selected
                        helperText={product.skuCode ? 'Auto-filled from SKU' : 'Enter body color'}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Panel Color"
                        value={product.panelColor}
                        onChange={(e) => handleProductChange(index, 'panelColor', e.target.value)}
                        disabled={!!product.skuCode} // Disable when SKU is selected
                        helperText={product.skuCode ? 'Auto-filled from SKU' : 'Enter panel color'}
                      />
                    </Grid>
                    {/* Product Images */}
                    {productImages.length > 0 && product.skuCode && (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          {productImages.map((img, idx) => (
                            <img
                              key={idx}
                              src={img || '/placeholder.svg'}
                              alt={`Product Preview ${idx}`}
                              style={{
                                width: '100px',
                                height: 'auto',
                                borderRadius: '4px',
                              }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}
                    {/* Embroidery Section */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={product.embroidery}
                              onChange={(e) =>
                                handleProductChange(index, 'embroidery', e.target.checked)
                              }
                            />
                          }
                          label="Embroidery"
                        />
                      </Box>
                      {product.embroidery && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Chest"
                              value={product.embroideryLogoChest}
                              onChange={(e) =>
                                handleProductChange(index, 'embroideryLogoChest', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Back"
                              value={product.embroideryLogoBack}
                              onChange={(e) =>
                                handleProductChange(index, 'embroideryLogoBack', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Sleeve L"
                              value={product.embroideryLogoSleeveL}
                              onChange={(e) =>
                                handleProductChange(index, 'embroideryLogoSleeveL', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Sleeve R"
                              value={product.embroideryLogoSleeveR}
                              onChange={(e) =>
                                handleProductChange(index, 'embroideryLogoSleeveR', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Embroidery Remarks"
                              value={product.embroideryRemarks}
                              onChange={(e) =>
                                handleProductChange(index, 'embroideryRemarks', e.target.value)
                              }
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    {/* Printing Section */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={product.printing}
                              onChange={(e) =>
                                handleProductChange(index, 'printing', e.target.checked)
                              }
                            />
                          }
                          label="Printing"
                        />
                      </Box>
                      {product.printing && (
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo"
                              value={product.printingLogo}
                              onChange={(e) =>
                                handleProductChange(index, 'printingLogo', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Back"
                              value={product.printingLogoBack}
                              onChange={(e) =>
                                handleProductChange(index, 'printingLogoBack', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Sleeve L"
                              value={product.printingLogoSleeveL}
                              onChange={(e) =>
                                handleProductChange(index, 'printingLogoSleeveL', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <TextField
                              fullWidth
                              label="Logo Sleeve R"
                              value={product.printingLogoSleeveR}
                              onChange={(e) =>
                                handleProductChange(index, 'printingLogoSleeveR', e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Printing Remarks"
                              value={product.printingRemarks}
                              onChange={(e) =>
                                handleProductChange(index, 'printingRemarks', e.target.value)
                              }
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    {/* Size Specification */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Size Specification
                      </Typography>
                      <Grid container spacing={2}>
                        {sizes.map((size) => (
                          <Grid item xs={6} sm={4} md={2} key={size}>
                            <TextField
                              fullWidth
                              label={size.toUpperCase()}
                              type="number"
                              value={product.sizeSpecification[size]}
                              onChange={(e) => handleSizeChange(index, size, e.target.value)}
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                            />
                          </Grid>
                        ))}
                        <Grid item xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Total"
                            type="number"
                            value={product.sizeSpecification.total}
                            InputProps={{
                              readOnly: true,
                              startAdornment: <InputAdornment position="start">Σ</InputAdornment>,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
        {/* Dealer Information */}
        <Card mb={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dealer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ordered By *"
                  value={formData.dealerOrderedBy}
                  onChange={(e) => handleInputChange('dealerOrderedBy', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation *"
                  value={formData.dealerDesignation}
                  onChange={(e) => handleInputChange('dealerDesignation', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile *"
                  value={formData.dealerMobile}
                  onChange={(e) => handleInputChange('dealerMobile', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={formData.dealerEmail}
                  onChange={(e) => handleInputChange('dealerEmail', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* Personnel Information */}
        <Card mb={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Office Personnel Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ordered By *"
                  value={formData.personnelOrderedBy}
                  onChange={(e) => handleInputChange('personnelOrderedBy', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Designation *"
                  value={formData.personnelDesignation}
                  onChange={(e) => handleInputChange('personnelDesignation', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mobile *"
                  value={formData.personnelMobile}
                  onChange={(e) => handleInputChange('personnelMobile', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={formData.personnelEmail}
                  onChange={(e) => handleInputChange('personnelEmail', e.target.value)}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* Additional Information */}
        <Card mb={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Order Executed By"
                  value={formData.orderExecutedBy}
                  onChange={(e) => handleInputChange('orderExecutedBy', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Order Processed By"
                  value={formData.orderProcessedBy}
                  onChange={(e) => handleInputChange('orderProcessedBy', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Delivery Date"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* Submit Button */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? <Spinner /> : <SaveIcon />}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Job Card'}
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default CreateSrsJobCard;
