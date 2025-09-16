'use client';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid2,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import { IconArrowLeft, IconEdit, IconPrinter } from '@tabler/icons';
import { toast } from 'react-toastify';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import { fetchAssetIndentById } from '../../api/assetIndent';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Error';
  }
};

// Function to capitalize first letter
const capitalize = (str) => {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to get item identifier based on model type
const getItemIdentifier = (item) => {
  if (!item.code) return 'N/A';

  // If code is an object (populated from backend)
  if (typeof item.code === 'object') {
    return (
      item.code.mainAssetId ||
      item.code.mainMaintenanceId ||
      item.code.mainItemCode ||
      item.code.assetId ||
      item.code.machineId ||
      item.code.propertyId ||
      item.code.registrationNumber ||
      item.code.licenseId ||
      item.code.weighMachineId ||
      item.code.safetyEquipmentId ||
      item.code.amcId ||
      item.code.insuranceId ||
      item.code.agreementId ||
      item.code.itemCode ||
      item.code.bomId ||
      item.code._id ||
      'Unknown ID'
    );
  }

  return item.code;
};

// Function to get item name
const getItemName = (item) => {
  if (!item.code || typeof item.code !== 'object') {
    return item.description || 'N/A';
  }

  return (
    item.code.name ||
    item.code.itemName ||
    item.code.assetName ||
    item.code.machineName ||
    item.code.propertyName ||
    item.code.softwareName ||
    item.code.licenseType ||
    item.code.machineType ||
    item.code.safetyEquipmentName ||
    item.description ||
    'N/A'
  );
};

// Function to get model color for chip
const getModelColor = (model) => {
  const colors = {
    Asset: 'primary',
    Maintenance: 'secondary',
    OtherStore: 'success',
  };
  return colors[model] || 'default';
};

// Function to get department display name
const getDepartmentDisplayName = (department) => {
  const departmentNames = {
    'fabric-store': 'Fabric Store',
    'trims-machine-parts-store': 'Trims & Machine Parts Store',
    'packing-accessories-store': 'Packing Accessories Store',
    'asset-management': 'Asset Management',
    maintanance: 'Maintenance',
    'other-stores': 'Other Stores',
  };
  return departmentNames[department] || department;
};

const ViewAssetIndent = () => {
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const navigate = useNavigate();
  const [assetIndentData, setAssetIndentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/assetindent`, title: 'Asset Indent' },
    { title: 'View Details' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Frontend: Fetching asset indent details for ID:', id);

      const response = await fetchAssetIndentById(id);
      console.log('📥 Frontend: Received asset indent data:', response);

      if (response) {
        setAssetIndentData(response);
      } else {
        setError('Asset indent not found');
      }
    } catch (error) {
      console.error('❌ Frontend: Error fetching asset indent:', error);
      setError(error.message || 'Failed to fetch asset indent details');
      toast.error(error.message || 'Failed to fetch asset indent details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/${userType}/assetindent`);
  };

  const handleEdit = () => {
    navigate(`/${userType}/assetindent/edit/${id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <PageContainer title="View Asset Indent" description="Asset indent details">
        <Breadcrumb title="View Asset Indent" items={BCrumb} />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={40} />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="View Asset Indent" description="Asset indent details">
        <Breadcrumb title="View Asset Indent" items={BCrumb} />
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={handleBack} startIcon={<IconArrowLeft />}>
            Back to List
          </Button>
        </Box>
      </PageContainer>
    );
  }

  if (!assetIndentData) {
    return (
      <PageContainer title="View Asset Indent" description="Asset indent details">
        <Breadcrumb title="View Asset Indent" items={BCrumb} />
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No data available
          </Typography>
          <Button variant="contained" onClick={handleBack} startIcon={<IconArrowLeft />}>
            Back to List
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="View Asset Indent" description="Asset indent details">
      <Breadcrumb title="View Asset Indent" items={BCrumb} />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={handleBack}>
          Back to List
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" startIcon={<IconEdit />} onClick={handleEdit}>
            Edit
          </Button>
        </Box>
      </Box>

      <ParentCard title={`Asset Indent Details - ${assetIndentData.indentId}`}>
        {/* Header Information */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Indent ID
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {assetIndentData.indentId}
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(assetIndentData.date)}
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Requested By
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {assetIndentData.requestedBy || 'N/A'}
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Department
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {assetIndentData.department || 'N/A'}
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    To Department
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {getDepartmentDisplayName(assetIndentData.toDepartment)}
                  </Typography>
                </Box>
              </Grid2>

              <Grid2 size={{ xs: 12, md: 6 }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Priority
                  </Typography>
                  <Chip
                    label={capitalize(assetIndentData.priority)}
                    color={
                      assetIndentData.priority === 'immediate'
                        ? 'error'
                        : assetIndentData.priority === 'week'
                        ? 'warning'
                        : 'success'
                    }
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Grid2>

              {assetIndentData.remarks && (
                <Grid2 size={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Remarks
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body1">{assetIndentData.remarks}</Typography>
                    </Paper>
                  </Box>
                </Grid2>
              )}
            </Grid2>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card>
          <CardContent>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Items ({assetIndentData.items?.length || 0})
              </Typography>
              {assetIndentData.mainAssetIds?.length > 0 && (
                <Typography variant="body2" color="textSecondary">
                  Main Asset IDs: {assetIndentData.mainAssetIds.join(', ')}
                </Typography>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />

            {assetIndentData.items && assetIndentData.items.length > 0 ? (
              <Grid2 container spacing={3}>
                {assetIndentData.items.map((item, index) => (
                  <Grid2 size={12} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          Item {index + 1}
                        </Typography>
                        {item.model && (
                          <Chip
                            label={item.model}
                            size="small"
                            color={getModelColor(item.model)}
                            variant="filled"
                          />
                        )}
                      </Box>

                      <Grid2 container spacing={2}>
                        {/* Image */}
                        <Grid2 size={{ xs: 12, md: 3 }}>
                          <Box sx={{ textAlign: 'center' }}>
                            {item?.itemDetails?.image || item?.code?.image ? (
                              <img
                                src={`${import.meta.env.VITE_APP_SERVER_URL}/${
                                  item.itemDetails?.image || item.code?.image
                                }`}
                                alt="Item"
                                style={{
                                  maxHeight: 150,
                                  maxWidth: '100%',
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  border: '1px solid #e0e0e0',
                                }}
                                onError={(e) => {
                                  console.error('Image failed to load');
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  height: 120,
                                  width: 120,
                                  bgcolor: 'grey.100',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  margin: '0 auto',
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'grey.300',
                                }}
                              >
                                <Typography variant="caption" color="textSecondary">
                                  No Image
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Grid2>

                        {/* Item Details */}
                        <Grid2 size={{ xs: 12, md: 9 }}>
                          <Grid2 container spacing={2}>

                            <Grid2 size={{ xs: 12, md: 6 }}>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Item Name
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {getItemName(item)}
                              </Typography>
                            </Grid2>

                            <Grid2 size={12}>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Description
                              </Typography>
                              <Typography variant="body1">{item.description || 'N/A'}</Typography>
                            </Grid2>

                            <Grid2 size={{ xs: 12, md: 6 }}>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Quantity
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {item.quantity || 'N/A'}
                              </Typography>
                            </Grid2>

                            <Grid2 size={{ xs: 12, md: 6 }}>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Unit of Measurement
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {item.uom ? item.uom.toUpperCase() : 'N/A'}
                              </Typography>
                            </Grid2>

                            {/* Additional fields based on item type */}
                            {item.itemDetails?.assetType && (
                              <Grid2 size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Asset Type
                                </Typography>
                                <Typography variant="body1">
                                  {item.itemDetails.assetType}
                                </Typography>
                              </Grid2>
                            )}

                            {item.mainAssetId && (
                              <Grid2 size={{ xs: 12, md: 6 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                  Main Asset ID
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {item.mainAssetId}
                                </Typography>
                              </Grid2>
                            )}
                          </Grid2>
                        </Grid2>
                      </Grid2>
                    </Paper>
                  </Grid2>
                ))}
              </Grid2>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No Items Found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  This asset indent doesn't have any items associated with it.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Metadata */}
        {(assetIndentData.createdAt || assetIndentData.updatedAt) && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                Record Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid2 container spacing={3}>
                {assetIndentData.createdAt && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Created At
                    </Typography>
                    <Typography variant="body1">{formatDate(assetIndentData.createdAt)}</Typography>
                  </Grid2>
                )}

                {assetIndentData.updatedAt && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Last Updated
                    </Typography>
                    <Typography variant="body1">{formatDate(assetIndentData.updatedAt)}</Typography>
                  </Grid2>
                )}
              </Grid2>
            </CardContent>
          </Card>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default ViewAssetIndent;
