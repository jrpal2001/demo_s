import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { getSrsJobCardById } from '@/api/srsjobcard.api';
import { toast } from 'react-toastify';
import PageContainer from '@/components/container/PageContainer';
import Spinner from '@/components/common/spinner/Spinner';

const ViewSrsJobCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [jobCard, setJobCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobCard();
  }, [id]);

  const fetchJobCard = async () => {
    try {
      const data = await getSrsJobCardById(id);
      setJobCard(data);
    } catch (error) {
      console.error('Error fetching job card:', error);
      toast.error('Failed to fetch job card details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

  if (loading) {
    return (
      <PageContainer title="View SRS Job Card" description="View SRS job card details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Spinner />
        </Box>
      </PageContainer>
    );
  }

  if (!jobCard) {
    return (
      <PageContainer title="View SRS Job Card" description="View SRS job card details">
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Job card not found
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View SRS Job Card" description="View SRS job card details">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/${userType}/srs-jobcard`)}
            >
              Back
            </Button>
            <Typography variant="h4" component="h1">
              SRS Job Card Details
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/${userType}/srs-jobcard/edit/${id}`)}
            >
              Edit
            </Button>
          </Stack>
        </Box>

        {/* Job Card Header Info */}
        <Card mb={3}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {jobCard.jobCardNo}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created on {formatDate(jobCard.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} textAlign="right">
                <Chip
                  label={jobCard.status?.replace('_', ' ')}
                  color={getStatusColor(jobCard.status)}
                  size="large"
                />
                <Typography variant="h6" mt={1}>
                  Total Quantity: {jobCard.totalQuantity || 0}
                </Typography>
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
                <Typography variant="subtitle2" color="textSecondary">
                  Customer Name
                </Typography>
                <Typography variant="body1">{jobCard.customerName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  GSTIN
                </Typography>
                <Typography variant="body1">{jobCard.gstin || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {jobCard.customerAddress || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Payment Terms
                </Typography>
                <Typography variant="body1">{jobCard.paymentTerms || 'Not specified'}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Products */}
        <Card mb={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Products ({jobCard.products?.length || 0})
            </Typography>

            {jobCard.products?.map((product, index) => (
              <Accordion key={index} defaultExpanded={index === 0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {product.product} - {product.skuCode}
                    </Typography>
                    <Chip
                      label={`Total: ${product.sizeSpecification?.total || 0}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={3}>
                    {/* Basic Product Info */}
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Basic Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" fontWeight="bold">
                            Product:
                          </Typography>
                          <Typography variant="body1">{product.product}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" fontWeight="bold">
                            SKU Code:
                          </Typography>
                          <Typography variant="body1">{product.skuCode}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="body2" fontWeight="bold">
                            Gender:
                          </Typography>
                          <Typography variant="body1" textTransform="capitalize">
                            {product.gender}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" fontWeight="bold">
                            Description:
                          </Typography>
                          <Typography variant="body1">{product.description}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" fontWeight="bold">
                            Body Color:
                          </Typography>
                          <Typography variant="body1">
                            {product.bodyColor || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" fontWeight="bold">
                            Panel Color:
                          </Typography>
                          <Typography variant="body1">
                            {product.panelColor || 'Not specified'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Embroidery Information */}
                    {product.embroidery && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Embroidery Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Chest:
                            </Typography>
                            <Typography variant="body1">
                              {product.embroideryLogoChest || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Back:
                            </Typography>
                            <Typography variant="body1">
                              {product.embroideryLogoBack || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Sleeve L:
                            </Typography>
                            <Typography variant="body1">
                              {product.embroideryLogoSleeveL || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Sleeve R:
                            </Typography>
                            <Typography variant="body1">
                              {product.embroideryLogoSleeveR || 'Not specified'}
                            </Typography>
                          </Grid>
                          {product.embroideryRemarks && (
                            <Grid item xs={12}>
                              <Typography variant="body2" fontWeight="bold">
                                Remarks:
                              </Typography>
                              <Typography variant="body1">{product.embroideryRemarks}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {/* Printing Information */}
                    {product.printing && (
                      <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Printing Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo:
                            </Typography>
                            <Typography variant="body1">
                              {product.printingLogo || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Back:
                            </Typography>
                            <Typography variant="body1">
                              {product.printingLogoBack || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Sleeve L:
                            </Typography>
                            <Typography variant="body1">
                              {product.printingLogoSleeveL || 'Not specified'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Typography variant="body2" fontWeight="bold">
                              Logo Sleeve R:
                            </Typography>
                            <Typography variant="body1">
                              {product.printingLogoSleeveR || 'Not specified'}
                            </Typography>
                          </Grid>
                          {product.printingRemarks && (
                            <Grid item xs={12}>
                              <Typography variant="body2" fontWeight="bold">
                                Remarks:
                              </Typography>
                              <Typography variant="body1">{product.printingRemarks}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    )}

                    {/* Size Specification */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Size Specification
                      </Typography>
                      <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              {sizes.map((size) => (
                                <TableCell key={size} align="center">
                                  {size.toUpperCase()}
                                </TableCell>
                              ))}
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              {sizes.map((size) => (
                                <TableCell key={size} align="center">
                                  {product.sizeSpecification?.[size] || 0}
                                </TableCell>
                              ))}
                              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                {product.sizeSpecification?.total || 0}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
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
                <Typography variant="subtitle2" color="textSecondary">
                  Ordered By
                </Typography>
                <Typography variant="body1">{jobCard.dealerOrderedBy}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Designation
                </Typography>
                <Typography variant="body1">{jobCard.dealerDesignation}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Mobile
                </Typography>
                <Typography variant="body1">{jobCard.dealerMobile}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">{jobCard.dealerEmail}</Typography>
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
                <Typography variant="subtitle2" color="textSecondary">
                  Ordered By
                </Typography>
                <Typography variant="body1">{jobCard.personnelOrderedBy}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Designation
                </Typography>
                <Typography variant="body1">{jobCard.personnelDesignation}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Mobile
                </Typography>
                <Typography variant="body1">{jobCard.personnelMobile}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography variant="body1">{jobCard.personnelEmail}</Typography>
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
                <Typography variant="subtitle2" color="textSecondary">
                  Order Executed By
                </Typography>
                <Typography variant="body1">
                  {jobCard.orderExecutedBy || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Order Processed By
                </Typography>
                <Typography variant="body1">
                  {jobCard.orderProcessedBy || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Delivery Date
                </Typography>
                <Typography variant="body1">{formatDate(jobCard.deliveryDate)}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" onClick={() => navigate(`/${userType}/srs-jobcard`)}>
            Back to List
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/${userType}/srs-jobcard/edit/${id}`)}
          >
            Edit Job Card
          </Button>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ViewSrsJobCard;
