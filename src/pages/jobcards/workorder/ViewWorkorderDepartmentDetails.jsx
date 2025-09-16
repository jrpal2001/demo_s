'use client';

import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { getDepartmentWorkOrderById } from '@/api/workorderDepartment.api.js';
import { toast } from 'react-toastify';

const ViewWorkorderDepartmentDetails = ({ workOrderId, department, departmentWorkOrderRef }) => {
  const [loading, setLoading] = useState(true);
  const [workOrderData, setWorkOrderData] = useState(null);

  // Department color scheme
  const departmentColors = {
    fabric: {
      light: '#E3F2FD', // Light blue
      main: '#2196F3',
      dark: '#1565C0',
      contrastText: '#000',
    },
    cutting: {
      light: '#E8F5E9', // Light green
      main: '#4CAF50',
      dark: '#2E7D32',
      contrastText: '#000',
    },
    operationparts: {
      light: '#FFF3E0', // Light orange
      main: '#FF9800',
      dark: '#E65100',
      contrastText: '#000',
    },
    trims: {
      light: '#F3E5F5', // Light purple
      main: '#9C27B0',
      dark: '#6A1B9A',
      contrastText: '#fff',
    },
    stitching: {
      light: '#E1F5FE', // Light cyan
      main: '#03A9F4',
      dark: '#0277BD',
      contrastText: '#000',
    },
    finishing: {
      light: '#FFEBEE', // Light red
      main: '#F44336',
      dark: '#C62828',
      contrastText: '#000',
    },
  };

  useEffect(() => {
    const fetchWorkOrderData = async () => {
      try {
        setLoading(true);
        const data = await getDepartmentWorkOrderById(departmentWorkOrderRef);
        console.log('Fetched work order data:', data);
        setWorkOrderData(data);
      } catch (error) {
        console.error('Error fetching work order data:', error);
        toast.error('Failed to fetch work order data');
      } finally {
        setLoading(false);
      }
    };

    if (workOrderId) {
      fetchWorkOrderData();
    }
  }, [workOrderId, departmentWorkOrderRef]);

  // Determine which sections to show based on department
  const showFabric = department === 'fabric' || department === 'all';
  const showCutting = department === 'cutting' || department === 'all';
  const showOperationParts =
    department === 'operationparts' ||
    department === 'embroidery' ||
    department === 'production' ||
    department === 'all';
  const showTrims = department === 'trims' || department === 'all';
  const showStitching =
    department === 'stitching' || department === 'production' || department === 'all';
  const showFinishing = department === 'finishing' || department === 'all';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Helper function to display data fields
  const DisplayField = ({ label, value, color }) => (
    <Box sx={{ mb: 2, p: 1.5, borderRadius: 1, backgroundColor: color || 'transparent' }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );

  // Section header with colored background
  const SectionHeader = ({ title, color }) => (
    <Box
      sx={{
        backgroundColor: color,
        borderRadius: '4px 4px 0 0',
        p: 1.5,
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: departmentColors[title.toLowerCase()]?.dark || 'inherit' }}
      >
        {title}
      </Typography>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: '#333' }}>
        Work Order Department Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Fabric Section */}
        {showFabric && workOrderData?.fabric?.length > 0 && (
          <Grid item xs={12}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                overflow: 'hidden',
                border: `1px solid ${departmentColors.fabric.main}`,
              }}
            >
              <SectionHeader title="Fabric Details" color={departmentColors.fabric.light} />
              <CardContent sx={{ pt: 0 }}>
                {workOrderData.fabric.map((fabricItem, index) => (
                  <Box
                    key={fabricItem._id || index}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                      border: `1px solid ${departmentColors.fabric.light}`,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Fabric Item #{index + 1}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <DisplayField
                          label="Fabric Code"
                          value={
                            fabricItem.code && typeof fabricItem.code === 'object'
                              ? fabricItem.code.bomId
                              : 'N/A'
                          }
                          color="rgba(33, 150, 243, 0.08)"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <DisplayField
                          label="Fabric Weight"
                          value={fabricItem.fabricWeight ?? 'N/A'}
                          color="rgba(33, 150, 243, 0.08)"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <DisplayField
                          label="Relaxing Hours"
                          value={fabricItem.relaxingHours ?? 'N/A'}
                          color="rgba(33, 150, 243, 0.08)"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Cutting Section */}
        {showCutting && workOrderData?.cutting && (
          <Grid item xs={12}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                overflow: 'hidden',
                border: `1px solid ${departmentColors.cutting.main}`,
              }}
            >
              <SectionHeader title="Cutting Details" color={departmentColors.cutting.light} />
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Cutting Quantity"
                      value={workOrderData.cutting.cuttingQuantity}
                      color="rgba(76, 175, 80, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Remarks"
                      value={workOrderData.cutting.remarks}
                      color="rgba(76, 175, 80, 0.08)"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Operation Parts Section */}
        {showOperationParts && workOrderData?.operationparts && (
          <Grid item xs={12}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                overflow: 'hidden',
                border: `1px solid ${departmentColors.operationparts.main}`,
              }}
            >
              <SectionHeader
                title="Operation Parts Details"
                color={departmentColors.operationparts.light}
              />
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Embroidery Details"
                      value={workOrderData.operationparts.embDetails}
                      color="rgba(255, 152, 0, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Finished Quantity"
                      value={workOrderData.operationparts.finishedQty}
                      color="rgba(255, 152, 0, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Daily Production Details"
                      value={workOrderData.operationparts.dailyProductionDetails}
                      color="rgba(255, 152, 0, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Remarks"
                      value={workOrderData.operationparts.remarks}
                      color="rgba(255, 152, 0, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Cut Panels Received Quantity"
                      value={workOrderData.operationparts.cutPanelsReceivedQty}
                      color="rgba(255, 152, 0, 0.08)"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Trims Section */}
        {showTrims && workOrderData?.trims && (
          <Grid item xs={12}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                overflow: 'hidden',
                border: `1px solid ${departmentColors.trims.main}`,
              }}
            >
              <SectionHeader title="Trims Details" color={departmentColors.trims.light} />
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Date"
                      value={
                        workOrderData.trims.date
                          ? new Date(workOrderData.trims.date).toLocaleDateString()
                          : 'N/A'
                      }
                      color="rgba(156, 39, 176, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Number of Members"
                      value={workOrderData.trims.noOfMembers}
                      color="rgba(156, 39, 176, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Total Quantity"
                      value={workOrderData.trims.quantity}
                      color="rgba(156, 39, 176, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Remarks"
                      value={workOrderData.trims.remarks}
                      color="rgba(156, 39, 176, 0.08)"
                    />
                  </Grid>

                  {/* Products Section */}
                  {workOrderData.trims.products && workOrderData.trims.products.length > 0 && (
                    <Grid item xs={12}>
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Products
                        </Typography>
                      </Box>
                      <Box
                        sx={{ backgroundColor: 'rgba(156, 39, 176, 0.03)', p: 2, borderRadius: 1 }}
                      >
                        {workOrderData.trims.products.map((product, index) => (
                          <Box
                            key={index}
                            sx={{
                              mb: index !== workOrderData.trims.products.length - 1 ? 2 : 0,
                              p: 1.5,
                              borderRadius: 1,
                              backgroundColor:
                                index % 2 === 0 ? 'rgba(156, 39, 176, 0.05)' : 'transparent',
                              border: '1px solid rgba(156, 39, 176, 0.1)',
                            }}
                          >
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <DisplayField
                                  label="Product ID"
                                  value={
                                    product.productId && typeof product.productId === 'object'
                                      ? product.productId.itemCode
                                      : product.productId
                                  }
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <DisplayField
                                  label="Trims Quantity"
                                  value={product.trimsQuantity}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Stitching Section */}
        {showStitching && workOrderData?.stitching && workOrderData.stitching.length > 0 && (
          <Grid item xs={12}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                overflow: 'hidden',
                border: `1px solid ${departmentColors.stitching.main}`,
              }}
            >
              <SectionHeader title="Stitching Details" color={departmentColors.stitching.light} />
              <CardContent sx={{ pt: 0 }}>
                {workOrderData.stitching.map((stitchingItem, stitchingIndex) => (
                  <Box
                    key={stitchingIndex}
                    sx={{
                      mb: stitchingIndex !== workOrderData.stitching.length - 1 ? 4 : 0,
                      p: 2,
                      borderRadius: 1,
                      backgroundColor: stitchingIndex % 2 === 0 ? '#f5f5f5' : 'white',
                      border: `1px solid ${departmentColors.stitching.light}`,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="medium"
                      color={departmentColors.stitching.dark}
                    >
                      Stitching Entry {stitchingIndex + 1}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <DisplayField
                          label="Cut Panels Received Quantity"
                          value={stitchingItem.cutPanelsReceivedQty}
                          color="rgba(3, 169, 244, 0.08)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DisplayField
                          label="Number of Lines"
                          value={stitchingItem.noOfLines}
                          color="rgba(3, 169, 244, 0.08)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DisplayField
                          label="Hourly Production"
                          value={stitchingItem.hourlyProduction}
                          color="rgba(3, 169, 244, 0.08)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DisplayField
                          label="Daily Production"
                          value={stitchingItem.dailyProduction}
                          color="rgba(3, 169, 244, 0.08)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DisplayField
                          label="Total Daily Production"
                          value={stitchingItem.totalDailyProduction}
                          color="rgba(3, 169, 244, 0.08)"
                        />
                      </Grid>

                      {/* Products Section */}
                      {stitchingItem.products && stitchingItem.products.length > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2, mb: 1 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="medium"
                              color={departmentColors.stitching.dark}
                            >
                              Products
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              backgroundColor: 'rgba(3, 169, 244, 0.03)',
                              p: 2,
                              borderRadius: 1,
                            }}
                          >
                            {stitchingItem.products.map((product, productIndex) => (
                              <Box
                                key={productIndex}
                                sx={{
                                  mb: productIndex !== stitchingItem.products.length - 1 ? 2 : 0,
                                  p: 1.5,
                                  borderRadius: 1,
                                  backgroundColor:
                                    productIndex % 2 === 0
                                      ? 'rgba(3, 169, 244, 0.05)'
                                      : 'transparent',
                                  border: '1px solid rgba(3, 169, 244, 0.1)',
                                }}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <DisplayField
                                      label="Product ID"
                                      value={
                                        product.productId && typeof product.productId === 'object'
                                          ? product.productId.itemCode
                                          : product.productId
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <DisplayField
                                      label="Trims Quantity"
                                      value={product.trimsQuantity}
                                    />
                                  </Grid>
                                </Grid>
                              </Box>
                            ))}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Finishing Section */}
        {showFinishing && workOrderData?.finishing && (
          <Grid item xs={12}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                overflow: 'hidden',
                border: `1px solid ${departmentColors.finishing.main}`,
              }}
            >
              <SectionHeader title="Finishing Details" color={departmentColors.finishing.light} />
              <CardContent sx={{ pt: 0 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Number of Garments Loaded"
                      value={workOrderData.finishing.noOfGarmentsLoaded}
                      color="rgba(244, 67, 54, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Hourly Process"
                      value={workOrderData.finishing.hourlyProcess}
                      color="rgba(244, 67, 54, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Daily Process"
                      value={workOrderData.finishing.dailyProcess}
                      color="rgba(244, 67, 54, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DisplayField
                      label="Total Daily Finishing Quantity"
                      value={workOrderData.finishing.totalDailyFinishingQty}
                      color="rgba(244, 67, 54, 0.08)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DisplayField
                      label="Final Inspection Report"
                      value={workOrderData.finishing.finalInspectionReport}
                      color="rgba(244, 67, 54, 0.08)"
                    />
                  </Grid>

                  {/* Products Section */}
                  {workOrderData.finishing.products &&
                    workOrderData.finishing.products.length > 0 && (
                      <Grid item xs={12}>
                        <Box sx={{ mt: 2, mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Products
                          </Typography>
                        </Box>
                        <Box
                          sx={{ backgroundColor: 'rgba(244, 67, 54, 0.03)', p: 2, borderRadius: 1 }}
                        >
                          {workOrderData.finishing.products.map((product, index) => (
                            <Box
                              key={index}
                              sx={{
                                mb: index !== workOrderData.finishing.products.length - 1 ? 2 : 0,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor:
                                  index % 2 === 0 ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
                                border: '1px solid rgba(244, 67, 54, 0.1)',
                              }}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                  <DisplayField
                                    label="Product ID"
                                    value={
                                      product.productId && typeof product.productId === 'object'
                                        ? product.productId.itemCode
                                        : product.productId
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <DisplayField
                                    label="Accessories Quantity"
                                    value={product.accessoriesQuantity}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default ViewWorkorderDepartmentDetails;
