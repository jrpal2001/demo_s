'use client';
import { useEffect, useState } from 'react';
import { Box, Grid2, Chip, Typography } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { fetchMaintenanceInventoryById } from '@/api/maintenanceInventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import React from 'react';

const MaintenanceInventoryView = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/maintenance-inventory`, title: 'Maintenance Inventory' },
    { title: 'View' },
  ];
  const { id, maintenanceType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [maintenanceInventory, setMaintenanceInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchMaintenanceInventoryById(id);
        if (response && response.data) {
          setMaintenanceInventory(response.data);
        } else {
          toast.warning('Maintenance inventory not found');
          navigate(`/${userType}/maintenance-inventory`);
        }
      } catch (error) {
        toast.error('Failed to fetch maintenance inventory details');
        navigate(`/${userType}/maintenance-inventory`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate, userType]);

  if (loading) {
    return (
      <PageContainer
        title="Admin - Maintenance Inventory"
        description="Loading maintenance inventory details"
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          Loading...
        </Box>
      </PageContainer>
    );
  }

  // Helper function to get nested values safely
  const getValue = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : defaultValue;
    }, obj);
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expired':
        return 'error';
      case 'Pending':
        return 'warning';
      case 'Suspended':
        return 'error';
      case 'Cancelled':
        return 'error';
      case 'Completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <PageContainer
      title="Admin - Maintenance Inventory"
      description="View maintenance inventory details"
    >
      <Breadcrumb
        title={`${
          maintenanceType
            ? maintenanceType.charAt(0).toUpperCase() + maintenanceType.slice(1)
            : 'Maintenance'
        } Inventory Details`}
        items={BCrumb}
      />
      <ParentCard title="Maintenance Inventory Item Details">
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getValue(maintenanceInventory, 'status', 'Active')}
            color={getStatusColor(getValue(maintenanceInventory, 'status', 'Active'))}
            sx={{ fontWeight: 'medium' }}
          />
          {getValue(maintenanceInventory, 'lowStockAlert') && (
            <Chip label="Low Stock Alert" color="warning" sx={{ fontWeight: 'medium', ml: 1 }} />
          )}
        </Box>

        <Grid2 container rowSpacing={2}>
          {/* MAINTENANCE CODE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="maintenanceCode" sx={{ marginTop: 0 }}>
              Maintenance Code
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="maintenanceCode"
              name="maintenanceCode"
              value={getValue(maintenanceInventory, 'maintenanceCode')}
              disabled
            />
          </Grid2>

          {/* MAINTENANCE NAME */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="maintenanceName" sx={{ marginTop: 0 }}>
              Maintenance Name
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="maintenanceName"
              name="maintenanceName"
              value={getValue(maintenanceInventory, 'maintenanceName')}
              disabled
            />
          </Grid2>

          {/* DESCRIPTION */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="description" sx={{ marginTop: 0 }}>
              Description
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="description"
              name="description"
              value={getValue(maintenanceInventory, 'description') || 'No description provided'}
              disabled
              multiline
              rows={2}
            />
          </Grid2>

          {/* MAINTENANCE TYPE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="maintenanceType" sx={{ marginTop: 0 }}>
              Maintenance Type
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="maintenanceType"
              name="maintenanceType"
              value={getValue(maintenanceInventory, 'maintenanceType')}
              disabled
            />
          </Grid2>

          {/* DEPARTMENT */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="department" sx={{ marginTop: 0 }}>
              Department
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="department"
              name="department"
              value={getValue(maintenanceInventory, 'department')}
              disabled
            />
          </Grid2>

          {/* UOM */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="uom" sx={{ marginTop: 0 }}>
              UOM
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="uom"
              name="uom"
              value={getValue(maintenanceInventory, 'uom')}
              disabled
            />
          </Grid2>

          {/* CURRENT STOCK */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="currentStock" sx={{ marginTop: 0 }}>
              Current Stock
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="currentStock"
              name="currentStock"
              value={`${getValue(maintenanceInventory, 'currentStock')} ${getValue(
                maintenanceInventory,
                'uom',
              )}`}
              disabled
            />
          </Grid2>

          {/* MINIMUM REQUIRED STOCK */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="minimumRequiredStock" sx={{ marginTop: 0 }}>
              Minimum Required Stock
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="minimumRequiredStock"
              name="minimumRequiredStock"
              value={`${getValue(maintenanceInventory, 'minimumRequiredStock')} ${getValue(
                maintenanceInventory,
                'uom',
              )}`}
              disabled
            />
          </Grid2>

          {/* UNIT PRICE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="unitPrice" sx={{ marginTop: 0 }}>
              Unit Price
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="unitPrice"
              name="unitPrice"
              value={`₹${getValue(maintenanceInventory, 'unitPrice') || 0}`}
              disabled
            />
          </Grid2>

          {/* STORAGE LOCATION */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="storageLocation" sx={{ marginTop: 0 }}>
              Storage Location
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="storageLocation"
              name="storageLocation"
              value={getValue(maintenanceInventory, 'storageLocation') || 'Not specified'}
              disabled
            />
          </Grid2>

          {/* STATUS */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="status" sx={{ marginTop: 0 }}>
              Status
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="status"
              name="status"
              value={getValue(maintenanceInventory, 'status')}
              disabled
            />
          </Grid2>

          {/* LOW STOCK ALERT */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="lowStockAlert" sx={{ marginTop: 0 }}>
              Low Stock Alert
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="lowStockAlert"
              name="lowStockAlert"
              value={getValue(maintenanceInventory, 'lowStockAlert') ? 'Yes' : 'No'}
              disabled
            />
          </Grid2>

          {/* LOT DETAILS */}
          {maintenanceInventory?.lots && Object.keys(maintenanceInventory.lots).length > 0 && (
            <>
              <Grid2 size={12}>
                <CustomFormLabel
                  sx={{ marginTop: 2, marginBottom: 1, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Lot Details
                </CustomFormLabel>
              </Grid2>
              {Object.entries(maintenanceInventory.lots).map(([lotName, quantity], index) => (
                <React.Fragment key={lotName}>
                  <Grid2
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                  >
                    <CustomFormLabel sx={{ marginTop: 0 }}>
                      Lot {index + 1} - {lotName}
                    </CustomFormLabel>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 9 }}>
                    <CustomTextField
                      fullWidth
                      value={`${quantity} ${getValue(maintenanceInventory, 'uom')}`}
                      disabled
                    />
                  </Grid2>
                </React.Fragment>
              ))}
            </>
          )}
          {(!maintenanceInventory?.lots || Object.keys(maintenanceInventory.lots).length === 0) && (
            <>
              <Grid2
                size={{ xs: 12, md: 3 }}
                sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
              >
                <CustomFormLabel sx={{ marginTop: 0 }}>Lot Details</CustomFormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 9 }}>
                <CustomTextField fullWidth value="No lots available" disabled />
              </Grid2>
            </>
          )}

          {/* REMARKS */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="remarks" sx={{ marginTop: 0 }}>
              Remarks
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="remarks"
              name="remarks"
              multiline
              rows={2}
              value={getValue(maintenanceInventory, 'remarks') || 'No remarks'}
              disabled
            />
          </Grid2>

          {/* CREATED AT */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="createdAt" sx={{ marginTop: 0 }}>
              Created At
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="createdAt"
              name="createdAt"
              value={formatDate(getValue(maintenanceInventory, 'createdAt'))}
              disabled
            />
          </Grid2>

          {/* UPDATED AT */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="updatedAt" sx={{ marginTop: 0 }}>
              Updated At
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="updatedAt"
              name="updatedAt"
              value={formatDate(getValue(maintenanceInventory, 'updatedAt'))}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>

      {/* MAINTENANCE INVENTORY IMAGES */}
      <ParentCard title="Maintenance Inventory Images" sx={{ mt: 3 }}>
        {maintenanceInventory?.images && maintenanceInventory.images.length > 0 ? (
          <Grid2 container spacing={2}>
            {maintenanceInventory.images.map((image, index) => (
              <Grid2 key={index} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Box
                  sx={{
                    width: '100%',
                    height: 150,
                    overflow: 'hidden',
                    borderRadius: 1,
                    border: '1px solid #e0e0e0',
                    position: 'relative',
                  }}
                >
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`Maintenance inventory image ${index + 1}`}
                    style={{
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
    </PageContainer>
  );
};

export default MaintenanceInventoryView;
