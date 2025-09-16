'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Chip,
} from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { getStockById } from '@/api/stock.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewStock = () => {
  const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const params = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const stockId = params.id;
  console.log("🚀 ~ ViewStock ~ stockId:", stockId)

  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      if (!stockId) {
        setError('Stock ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const stockData = await getStockById(stockId);
        console.log("🚀 ~ fetchStock ~ stockData:", stockData)
        setStock(stockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching stock:', err);
        setError(err.message || 'Failed to fetch stock details');
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [stockId]);

  const handleBack = () => {
    navigate(-1);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/stock`, title: 'Stock' },
    { title: 'View' },
  ];

  if (loading) {
    return (
      <PageContainer title="View Stock" description="View stock details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading stock details...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="View Stock" description="View stock details">
        <Alert severity="error">{error}</Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View Stock" description="View stock details">
      <Breadcrumb title="View Stock" items={BCrumb} />
      <ParentCard title={`Stock Details - ${stock?.skuCode || ''}`}>
        <Grid container spacing={3}>
          {/* Header Actions */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6">Total Quantity: {stock?.currentQuantity || 0}</Typography>
                {stock?.currentQuantity <= stock?.lowStockAlertLevel && (
                  <Chip label="Low Stock" color="error" size="small" />
                )}
              </Box>
            </Box>
          </Grid>

          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextField
              label="SKU Code"
              variant="outlined"
              fullWidth
              value={stock?.skuCode || ''}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextField
              label="Product Description"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={stock?.productDescription || ''}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Stock Controls */}
          <Grid item xs={12} md={4}>
            <CustomTextField
              label="Reorder Level"
              type="number"
              variant="outlined"
              fullWidth
              value={stock?.reorderLevel || 0}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              label="Current Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={stock?.currentQuantity || 0}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <CustomTextField
              label="Low Stock Alert Level"
              type="number"
              variant="outlined"
              fullWidth
              value={stock?.lowStockAlertLevel || 0}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Main Size Specifications */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Main Size Specifications
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {SIZES.map((size) => (
                <Grid item xs={6} md={3} key={size}>
                  <CustomTextField
                    label={`Size ${size.toUpperCase()}`}
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={stock?.sizeSpecifications?.[size] || 0}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Lot Specifications */}
          {stock?.lotSpecifications && stock.lotSpecifications.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Lot Specifications
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {stock.lotSpecifications.map((lot, lotIndex) => (
                <ParentCard key={lotIndex} title={lot.lotNumber} sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>
                        Size Specifications for {lot.lotNumber}
                      </Typography>
                      <Grid container spacing={2}>
                        {SIZES.map((size) => (
                          <Grid item xs={6} md={3} key={size}>
                            <CustomTextField
                              label={`Size ${size.toUpperCase()}`}
                              type="number"
                              variant="outlined"
                              fullWidth
                              value={lot.sizeSpecifications?.[size] || 0}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </ParentCard>
              ))}
            </Grid>
          )}
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewStock;
