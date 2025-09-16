'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ParentCard from '@/components/shared/ParentCard';
import { getStockOutwardById } from '@/api/stockOutward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewStockOutward = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const [stockOutward, setStockOutward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockOutward = async () => {
      try {
        setLoading(true);
        const data = await getStockOutwardById(id);
        setStockOutward(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock outward:', error);
        setError(error.message || 'Failed to fetch stock outward details');
        toast.error(error.message || 'Failed to fetch stock outward details');
        setLoading(false);
      }
    };

    if (id) {
      fetchStockOutward();
    }
  }, [id]);

  const handleBack = () => {
    navigate(`/${userType}/stockoutward`);
  };

  if (loading) {
    return (
      <PageContainer title="View Stock Outward" description="View stock outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="View Stock Outward" description="View stock outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!stockOutward) {
    return (
      <PageContainer title="View Stock Outward" description="View stock outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Stock outward record not found</Typography>
        </Box>
      </PageContainer>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'Dispatched':
        return 'info';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/stockoutward`, title: 'Stock Outward' },
    { title: 'View' },
  ];

  return (
    <PageContainer title="View Stock Outward" description="View stock outward details">
      <Breadcrumb title="View Stock Outward" items={BCrumb} />
      <ParentCard title="Stock Outward Details">
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch ID
                </Typography>
                <Typography variant="body1">{stockOutward.dispatchId}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Job Card Reference
                </Typography>
                <Typography variant="body1">
                  {stockOutward.jobCardRef?.jobCardNo || stockOutward.jobCardRef || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch Date
                </Typography>
                <Typography variant="body1">{formatDate(stockOutward.dispatchDate)}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch To
                </Typography>
                <Typography variant="body1">{stockOutward.dispatchTo}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch Status
                </Typography>
                <Chip
                  label={stockOutward.dispatchStatus}
                  color={getStatusColor(stockOutward.dispatchStatus)}
                  size="medium"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Product Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  SKU Code
                </Typography>
                <Typography variant="body1">{stockOutward.skuCode}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Product Description
                </Typography>
                <Typography variant="body1">
                  {stockOutward.productDescription || 'No description provided'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quantity Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Quantity Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity Ordered
                </Typography>
                <Typography variant="body1">{stockOutward.quantityOrdered || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity Dispatched
                </Typography>
                <Typography variant="body1">{stockOutward.quantityDispatched}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Quantity Shipped
                </Typography>
                <Typography variant="body1">{stockOutward.quantityShipped || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Unit of Measure
                </Typography>
                <Typography variant="body1">{stockOutward.uom || 'pcs'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Document Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Document Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Match Lot Number
                </Typography>
                <Typography variant="body1">{stockOutward.matchLotNumber || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  HSN Code
                </Typography>
                <Typography variant="body1">{stockOutward.hsnCode || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  E-way Bill Number
                </Typography>
                <Typography variant="body1">{stockOutward.ewayBillNo || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Delivery Challan
                </Typography>
                <Typography variant="body1">{stockOutward.deliveryChallan || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Invoice/Document Reference
                </Typography>
                <Typography variant="body1">
                  {stockOutward.invoiceOrDocumentRef || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Dispatch Details */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Dispatch Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch Method
                </Typography>
                <Typography variant="body1">{stockOutward.dispatchMethod || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch Address
                </Typography>
                <Typography variant="body1">{stockOutward.dispatchAddress || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Expected Delivery Date
                </Typography>
                <Typography variant="body1">
                  {stockOutward.deliveryDate ? formatDate(stockOutward.deliveryDate) : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Transport Details
                </Typography>
                <Typography variant="body1">{stockOutward.transportDetails || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Packaging Details
                </Typography>
                <Typography variant="body1">{stockOutward.packagingDetails || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Receipt Confirmation
                </Typography>
                <Chip
                  label={stockOutward.receiptConfirmation ? 'Confirmed' : 'Not Confirmed'}
                  color={stockOutward.receiptConfirmation ? 'success' : 'default'}
                  size="medium"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Additional Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Dispatch Approved By
                </Typography>
                <Typography variant="body1">{stockOutward.dispatchApprovedBy || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Payment Details
                </Typography>
                <Typography variant="body1">{stockOutward.paymentDetails || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Remarks
                </Typography>
                <Typography variant="body1">{stockOutward.remarks || 'No remarks'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Timestamps */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Timestamps
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {stockOutward.createdAt ? formatDate(stockOutward.createdAt) : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Updated At
                </Typography>
                <Typography variant="body1">
                  {stockOutward.updatedAt ? formatDate(stockOutward.updatedAt) : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Back Button */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={handleBack}>
                Back to List
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewStockOutward;
