'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ParentCard from '@/components/shared/ParentCard';
import { getStockInwardById } from '@/api/stockInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewStockInward = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const [stockInward, setStockInward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockInward = async () => {
      try {
        setLoading(true);
        const data = await getStockInwardById(id);
        console.log("🚀 ~ fetchStockInward ~ data:", data)
        setStockInward(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock inward:', error);
        setError(error.message || 'Failed to fetch stock inward details');
        toast.error(error.message || 'Failed to fetch stock inward details');
        setLoading(false);
      }
    };

    if (id) {
      fetchStockInward();
    }
  }, [id]);

  const handleBack = () => {
    navigate(`/${userType}/stockinward`);
  };

  if (loading) {
    return (
      <PageContainer title="View Stock Inward" description="View stock inward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="View Stock Inward" description="View stock inward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!stockInward) {
    return (
      <PageContainer title="View Stock Inward" description="View stock inward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Stock inward record not found</Typography>
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

  // Calculate total quantity from size-wise quantities
  const calculateTotalQuantity = () => {
    if (!stockInward.sizeWiseQty) return 0;

    return SIZES.reduce((total, size) => {
      return total + (stockInward.sizeWiseQty[size] || 0);
    }, 0);
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/stockinward`, title: 'Stock Inward' },
    { title: 'View' },
  ];

  const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

  return (
    <PageContainer title="View Stock Inward" description="View stock inward details">
      <Breadcrumb title="View Stock Inward" items={BCrumb} />
      <ParentCard title="Stock Inward Details">
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
                  Work Order ID
                </Typography>
                <Typography variant="body1">{stockInward.workOrderId.workOrderId}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Job Card ID
                </Typography>
                <Typography variant="body1">{stockInward.workOrderId.jobCardNo}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  SKU Code
                </Typography>
                <Typography variant="body1">{stockInward.skuCode}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Lot Number
                </Typography>
                <Typography variant="body1">{stockInward.lotNo}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Product Description
                </Typography>
                <Typography variant="body1">
                  {stockInward.productDescription || 'No description provided'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Product Image */}
          {stockInward.productImage && (
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Product Image
                  </Typography>
                  <Box sx={{ maxWidth: '300px', mt: 1 }}>
                    <img
                      src={stockInward.productImage || '/placeholder.svg'}
                      alt="Product"
                      style={{ width: '100%', borderRadius: '4px' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Size-wise Quantities */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Size-wise Quantities
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center">
                        {size.toUpperCase()}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center">
                        {stockInward.sizeWiseQty?.[size] || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
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
                  Received Quantity
                </Typography>
                <Typography variant="body1">{stockInward.receivedQuantity}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Shortage Quantity
                </Typography>
                <Typography variant="body1">{stockInward.shortageQuantity || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Excess Quantity
                </Typography>
                <Typography variant="body1">{stockInward.excessQuantity || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Quality Control */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Quality Control
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Micro Defects Quantity
                </Typography>
                <Typography variant="body1">{stockInward.microQty || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Minor Defects Quantity
                </Typography>
                <Typography variant="body1">{stockInward.minorQty || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Major Defects Quantity
                </Typography>
                <Typography variant="body1">{stockInward.majorQty || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Invoice Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Invoice Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Invoice Number
                </Typography>
                <Typography variant="body1">{stockInward.invoice?.number || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Invoice Date
                </Typography>
                <Typography variant="body1">
                  {stockInward.invoice?.date ? formatDate(stockInward.invoice.date) : 'N/A'}
                </Typography>
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
                  Received By
                </Typography>
                <Typography variant="body1">{stockInward.receivedBy}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Approved By
                </Typography>
                <Typography variant="body1">{stockInward.approvedBy || 'N/A'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Remarks
                </Typography>
                <Typography variant="body1">{stockInward.remarks || 'No remarks'}</Typography>
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
                  {stockInward.createdAt ? formatDate(stockInward.createdAt) : 'N/A'}
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
                  {stockInward.updatedAt ? formatDate(stockInward.updatedAt) : 'N/A'}
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

export default ViewStockInward;
