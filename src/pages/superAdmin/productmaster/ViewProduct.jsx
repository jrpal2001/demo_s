'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Grid2, Chip, Typography, Paper, Divider } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Palette as PaletteIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';

import { toast } from 'react-toastify';
import { fetchProductMasterById } from '@/api/productmaster.api.js';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!id) {
      setError('Product ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetchProductMasterById(id);
      console.log('🚀 ~ fetchData ~ response:', response);

      if (response) {
        setProductData(response);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
      setError('Failed to fetch product data');
      toast.error('Failed to fetch product data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToProducts = () => {
    navigate(`/${userType}/productmaster`);
  };

  const handleEditProduct = () => {
    navigate(`/${userType}/productmaster/edit/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/productmaster`, title: 'Product Master' },
    { title: 'View' },
  ];

  if (loading) {
    return (
      <PageContainer title="Admin - Product Master" description="">
        <Breadcrumb title="Product Master" items={BCrumb} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Typography>Loading product...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error || !productData) {
    return (
      <PageContainer title="Admin - Product Master" description="">
        <Breadcrumb title="Product Master" items={BCrumb} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error || 'Product not found'}
          </Typography>
          <Button variant="contained" onClick={fetchData}>
            Try Again
          </Button>
        </Box>
      </PageContainer>
    );
  }

  const totalFabricCost =
    productData.fabric?.reduce((sum, item) => sum + item.cost * item.consumption, 0) || 0;
  const totalTrimsCost =
    productData.trims?.reduce((sum, item) => sum + item.cost * item.consumption, 0) || 0;
  const totalAccessoriesCost =
    productData.accessories?.reduce((sum, item) => sum + item.cost * item.consumption, 0) || 0;
  const totalMaterialCost = totalFabricCost + totalTrimsCost + totalAccessoriesCost;
  const totalProductCost = productData.materialcost || 0;

  // Helper function to format subcategory for display
  const formatStylecategory = (stylecategory) => {
    if (!stylecategory) return '';
    return stylecategory
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <PageContainer title="Admin - Product Master" description="">
      <Breadcrumb title="Product Master" items={BCrumb} />

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBackToProducts}>
            Back to Products
          </Button>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {productData.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SKU: {productData.skuCode}
            </Typography>
          </Box>
        </Box>
        {/* Only show Edit button for admin and supermerchandiser */}
        {(userType === 'admin' || userType === 'supermerchandiser') && (
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditProduct}>
            Edit Product
          </Button>
        )}
      </Box>

      <Grid2 container spacing={3}>
        {/* Product Images */}
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <ParentCard title="Product Images">
            {productData.images && productData.images.length > 0 ? (
              <Grid2 container spacing={2}>
                {productData.images.map((image, index) => (
                  <Grid2 size={{ xs: 6, md: 4 }} key={index}>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingBottom: '100%',
                        overflow: 'hidden',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                      }}
                    >
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Product image ${index + 1}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                    </Box>
                  </Grid2>
                ))}
              </Grid2>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                }}
              >
                <Typography color="text.secondary">No images available</Typography>
              </Box>
            )}
          </ParentCard>
        </Grid2>

        {/* Product Details */}
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <ParentCard title="Product Details">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Chip
                    label={productData.category}
                    size="small"
                    color="primary"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Stylecategory
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatStylecategory(productData.stylecategory)}
                  </Typography>
                </Box>

                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      Color
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {productData.color}
                  </Typography>
                </Box>
                {/* Panel Color */}
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Panel Color
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {productData.panelcolor || '-'}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body2">{productData.description}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Brand
                  </Typography>
                  <Typography variant="body2">{productData.brand}</Typography>
                </Box>
              </Box>
            </ParentCard>

            {/* Cost Breakdown */}
            <ParentCard title="Cost Breakdown">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Materials
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    ₹{totalMaterialCost.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Branding Cost
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    ₹{(productData.brandingcost || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Making Cost
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    ₹{(productData.makingcost || 0).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 1.5,
                    border: '1px solid orange',
                    borderRadius: '8px',
                    backgroundColor: '#fff8e1', // light yellow highlight
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    MRP
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'orange' }}>
                    ₹{(productData.mrp || 0).toFixed(2)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 1.5,
                    border: '1px solid teal',
                    borderRadius: '8px',
                    backgroundColor: '#e0f7fa', // light blue highlight
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Material Cost (Auto)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'teal' }}>
                    ₹{(productData.materialcost || 0).toFixed(2)}
                  </Typography>
                </Box>

                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Total Cost
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ₹{totalProductCost.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </ParentCard>
          </Box>
        </Grid2>

        {/* Materials Section */}
        <Grid2 size={12}>
          <Grid2 container spacing={3}>
            {/* Fabric */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <ParentCard title={`Fabric (${productData.fabric?.length || 0} items)`}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {productData.fabric && productData.fabric.length > 0 ? (
                    <>
                      {productData.fabric.map((item, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item?.code?.bomId || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Consumption: {item.consumption || 0} {item.uom || ''}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              ₹{((item.cost || 0) * (item.consumption || 0)).toFixed(2)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          Fabric Total
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ₹{totalFabricCost.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No fabric items
                    </Typography>
                  )}
                </Box>
              </ParentCard>
            </Grid2>

            {/* Trims */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <ParentCard title={`Trims (${productData.trims?.length || 0} items)`}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {productData.trims && productData.trims.length > 0 ? (
                    <>
                      {productData.trims.map((item, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item?.code?.bomId || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Consumption: {item.consumption || 0} {item.uom || ''}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              ₹{((item.cost || 0) * (item.consumption || 0)).toFixed(2)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          Trims Total
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ₹{totalTrimsCost.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No trim items
                    </Typography>
                  )}
                </Box>
              </ParentCard>
            </Grid2>

            {/* Accessories */}
            <Grid2 size={{ xs: 12, md: 4 }}>
              <ParentCard title={`Accessories (${productData.accessories?.length || 0} items)`}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {productData.accessories && productData.accessories.length > 0 ? (
                    <>
                      {productData.accessories.map((item, index) => (
                        <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {item?.code?.bomId || 'Unknown'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Consumption: {item.consumption || 0} {item.uom || ''}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              ₹{((item.cost || 0) * (item.consumption || 0)).toFixed(2)}
                            </Typography>
                          </Box>
                        </Paper>
                      ))}
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          Accessories Total
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          ₹{totalAccessoriesCost.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No accessory items
                    </Typography>
                  )}
                </Box>
              </ParentCard>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </PageContainer>
  );
};

export default ViewProduct;
