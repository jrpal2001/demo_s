'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Grid2, Typography, Chip } from '@mui/material';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { assetAPI, maintenanceAPI, otherStoreAPI } from '@/api/assetmanagementERP';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewOneAssetManagement = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-management`, title: 'Asset Management' },
    { title: 'View Details' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get type and subType from URL parameters
  const type = searchParams.get('type'); // 0=assets, 1=maintenance, 2=otherStore
  const subType = searchParams.get('subType'); // specific asset/maintenance/store type

  const getTypeLabel = () => {
    switch (type) {
      case '0':
        return 'Asset';
      case '1':
        return 'Maintenance';
      case '2':
        return 'Other Store';
      default:
        return 'Item';
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;

      switch (type) {
        case '0': // Assets
          response = await assetAPI.getAssetById(id);
          break;
        case '1': // Maintenance
          response = await maintenanceAPI.getMaintenanceById(id);
          break;
        case '2': // Other Store
          response = await otherStoreAPI.getOtherStoreById(id);
          break;
        default:
          throw new Error('Invalid type parameter');
      }

      if (response?.success) {
        console.log('🚀 ~ fetchData ~ response.data:', response.data);
        setData(response.data);
      } else {
        setError('Failed to fetch item details');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  const handleClickBack = () => {
    navigate(`/${userType}/viewassetmanagement`);
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'string' && value.includes('T') && value.includes('Z')) {
      // Likely a date string
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date.toLocaleDateString();
    }
    return String(value);
  };

  const renderStatusChip = (status) => {
    if (!status) return <Chip label="N/A" size="small" color="default" />;

    let color = 'default';
    if (status === 'Active' || status === 'In Use' || status === 'Approved') {
      color = 'success';
    } else if (
      status === 'Inactive' ||
      status === 'Expired' ||
      status === 'Rejected' ||
      status === 'Damaged' ||
      status === 'Out of service'
    ) {
      color = 'error';
    } else {
      color = 'warning';
    }

    return <Chip label={status} size="small" color={color} />;
  };

  const renderField = (key, value, isStatus = false) => {
    // Skip internal fields
    if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return null;

    const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

    // Special rendering for images array
    if (key === 'images' && Array.isArray(value)) {
      return (
        <Grid2 container key={key} sx={{ mb: 2 }}>
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>{label}</CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {value.map((img, idx) => (
                <Box key={idx} component="a" href={img} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img}
                    alt={`Asset Image ${idx + 1}`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 4,
                      border: '1px solid #eee',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid2>
        </Grid2>
      );
    }

    // Special rendering for reportAttachment
    if (key === 'reportAttachment' && value) {
      const fileName = value.split('/').pop();
      return (
        <Grid2 container key={key} sx={{ mb: 2 }}>
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>{label}</CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Button
              variant="outlined"
              color="primary"
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textTransform: 'none' }}
              startIcon={
                <span role="img" aria-label="file">
                  📄
                </span>
              }
            >
              {fileName}
            </Button>
          </Grid2>
        </Grid2>
      );
    }

    return (
      <Grid2 container key={key} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>{label}</CustomFormLabel>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 9 }}>
          {isStatus ? (
            <Box sx={{ display: 'flex', alignItems: 'center', height: '40px' }}>
              {renderStatusChip(value)}
            </Box>
          ) : (
            <CustomTextField fullWidth value={formatValue(value)} disabled variant="outlined" />
          )}
        </Grid2>
      </Grid2>
    );
  };

  const getStatusFields = () => {
    // Define which fields should be rendered as status chips
    const statusFields = [
      'currentStatus',
      'licenseStatus',
      'machineStatus',
      'equipmentStatus',
      'amcStatus',
      'policyStatus',
      'approvalStatus',
      'designStatus',
      'condition',
    ];
    return statusFields;
  };

  useEffect(() => {
    if (id && type) {
      fetchData();
    }
  }, [id, type]);

  if (loading) {
    return (
      <PageContainer title="Loading..." description="Loading item details">
        <Breadcrumb title={`View ${getTypeLabel()}`} items={BCrumb} />
        <ParentCard title="Loading...">
          <Typography>Loading item details...</Typography>
        </ParentCard>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading item details">
        <Breadcrumb title={`View ${getTypeLabel()}`} items={BCrumb} />
        <ParentCard title="Error">
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button onClick={handleClickBack} variant="contained">
            Back to Asset Management
          </Button>
        </ParentCard>
      </PageContainer>
    );
  }

  const statusFields = getStatusFields();

  return (
    <PageContainer
      title={`View ${getTypeLabel()}`}
      description={`View ${getTypeLabel().toLowerCase()} details`}
    >
      <Breadcrumb title={`View ${getTypeLabel()} Details`} items={BCrumb} />
      <ParentCard title={`${getTypeLabel()} Details - ${subType || 'Unknown Type'}`}>
        <Box sx={{ mt: 2 }}>
          {/* Render images and reportAttachment at the top */}
          {renderField('images', data.images)}
          {renderField('reportAttachment', data.reportAttachment)}
          {/* Render the rest of the fields, skipping images and reportAttachment */}
          {Object.entries(data)
            .filter(([key]) => key !== 'images' && key !== 'reportAttachment')
            .map(([key, value]) => renderField(key, value, statusFields.includes(key)))}
        </Box>

        {/* Back Button */}
        <Box
          sx={{
            margin: '2rem 0 0 0',
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
          }}
        >
          <Button variant="contained" onClick={handleClickBack} sx={{ minWidth: 120 }}>
            Back
          </Button>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewOneAssetManagement;
