import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { getSrsJobCardById, updateSrsJobCard } from '@/api/srsjobcard.api';
import { toast } from 'react-toastify';
import PageContainer from '@/components/container/PageContainer';
import Spinner from '@/components/common/spinner/Spinner';

const EditSrsJobCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jobCard, setJobCard] = useState(null);
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
    status: 'in_progress',
  });

  useEffect(() => {
    fetchJobCard();
  }, [id]);

  const fetchJobCard = async () => {
    setLoading(true);
    try {
      const data = await getSrsJobCardById(id);
      setJobCard(data);

      // Populate form data
      setFormData({
        customerName: data.customerName || '',
        customerAddress: data.customerAddress || '',
        paymentTerms: data.paymentTerms || '',
        gstin: data.gstin || '',
        products:
          data.products?.length > 0
            ? data.products.map((product) => ({
                product: product.product || '',
                skuCode: product.skuCode || '',
                description: product.description || '',
                bodyColor: product.bodyColor || '',
                panelColor: product.panelColor || '',
                gender: product.gender || 'male',
                embroidery: product.embroidery || false,
                embroideryLogoChest: product.embroideryLogoChest || '',
                embroideryLogoBack: product.embroideryLogoBack || '',
                embroideryLogoSleeveL: product.embroideryLogoSleeveL || '',
                embroideryLogoSleeveR: product.embroideryLogoSleeveR || '',
                embroideryRemarks: product.embroideryRemarks || '',
                printing: product.printing || false,
                printingLogo: product.printingLogo || '',
                printingLogoBack: product.printingLogoBack || '',
                printingLogoSleeveL: product.printingLogoSleeveL || '',
                printingLogoSleeveR: product.printingLogoSleeveR || '',
                printingRemarks: product.printingRemarks || '',
                sizeSpecification: {
                  xs: product.sizeSpecification?.xs || 0,
                  s: product.sizeSpecification?.s || 0,
                  m: product.sizeSpecification?.m || 0,
                  l: product.sizeSpecification?.l || 0,
                  xl: product.sizeSpecification?.xl || 0,
                  '2xl': product.sizeSpecification?.['2xl'] || 0,
                  '3xl': product.sizeSpecification?.['3xl'] || 0,
                  '4xl': product.sizeSpecification?.['4xl'] || 0,
                  '5xl': product.sizeSpecification?.['5xl'] || 0,
                  total: product.sizeSpecification?.total || 0,
                },
              }))
            : [
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
        dealerOrderedBy: data.dealerOrderedBy || '',
        dealerDesignation: data.dealerDesignation || '',
        dealerMobile: data.dealerMobile || '',
        dealerEmail: data.dealerEmail || '',
        personnelOrderedBy: data.personnelOrderedBy || '',
        personnelDesignation: data.personnelDesignation || '',
        personnelMobile: data.personnelMobile || '',
        personnelEmail: data.personnelEmail || '',
        orderExecutedBy: data.orderExecutedBy || '',
        orderProcessedBy: data.orderProcessedBy || '',
        deliveryDate: data.deliveryDate
          ? new Date(data.deliveryDate).toISOString().split('T')[0]
          : '',
        status: data.status || 'in_progress',
      });
    } catch (error) {
      console.error('Error fetching job card:', error);
      toast.error('Failed to fetch job card details');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle product changes
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

    // Calculate total
    const total = Object.values(updatedProducts[productIndex].sizeSpecification).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0,
    );
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
    setSaving(true);

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

      await updateSrsJobCard(id, formData);
      toast.success('SRS Job Card updated successfully');
      navigate(`/${userType}/srs-jobcard/view/${id}`);
    } catch (error) {
      console.error('Error updating job card:', error);
      toast.error('Failed to update job card');
    } finally {
      setSaving(false);
    }
  };

  const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

  if (loading) {
    return (
      <PageContainer title="Edit SRS Job Card" description="Edit SRS job card">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Spinner />
        </Box>
      </PageContainer>
    );
  }

  if (!jobCard) {
    return (
      <PageContainer title="Edit SRS Job Card" description="Edit SRS job card">
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Job card not found
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit SRS Job Card" description="Edit SRS job card">
      <Box component="form" onSubmit={handleSubmit}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/${userType}/srs-jobcard/view/${id}`)}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              Edit SRS Job Card - {jobCard.jobCardNo}
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <Spinner /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        {/* Status */}
        <Card mb={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Card Status
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card mb={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Customer Information
            </Typography>
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

        {/* Products */}
        <Card mb={3}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Products ({formData.products.length})</Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={addProduct}>
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
                  {/* Basic Product Info */}
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Product Name *"
                      value={product.product}
                      onChange={(e) => handleProductChange(index, 'product', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="SKU Code *"
                      value={product.skuCode}
                      onChange={(e) => handleProductChange(index, 'skuCode', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={product.gender}
                        onChange={(e) => handleProductChange(index, 'gender', e.target.value)}
                        label="Gender"
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
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Body Color"
                      value={product.bodyColor}
                      onChange={(e) => handleProductChange(index, 'bodyColor', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Panel Color"
                      value={product.panelColor}
                      onChange={(e) => handleProductChange(index, 'panelColor', e.target.value)}
                    />
                  </Grid>

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
          <Button
            variant="outlined"
            onClick={() => navigate(`/${userType}/srs-jobcard/view/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? <Spinner /> : <SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default EditSrsJobCard;
