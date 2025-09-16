'use client';

import { useEffect, useState } from 'react';
import { Box, Grid2, Chip } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { fetchOtherStoreInventoryById } from '@/api/otherstoresInventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const OtherStoreInventoryView = () => {
  const { id, itemType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userType = useSelector(selectCurrentUserType);
  const [otherStoreInventory, setOtherStoreInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/otherstore-inventory`, title: 'Other Store Inventory' },
    { title: 'View' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchOtherStoreInventoryById(id);
        if (response && response.data) {
          setOtherStoreInventory(response.data);
        } else {
          toast.warning('Other store inventory not found');
          navigate(`/${userType}/otherstore-inventory`);
        }
      } catch (error) {
        toast.error('Failed to fetch other store inventory details');
        navigate(`/${userType}/otherstore-inventory`);
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
        title="Admin - Other Store Inventory"
        description="Loading other store inventory details"
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
    return dateString.split('T')[0];
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'warning';
      case 'Discontinued':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get condition color
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'New':
        return 'success';
      case 'Used':
        return 'info';
      case 'Refurbished':
        return 'warning';
      case 'Damaged':
        return 'error';
      case 'Repair needed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <PageContainer
      title="Admin - Other Store Inventory"
      description="View other store inventory details"
    >
      <Breadcrumb
        title={`${
          itemType ? itemType.charAt(0).toUpperCase() + itemType.slice(1) : 'Other Store'
        } Inventory Details`}
        items={BCrumb}
      />
      <ParentCard title="Other Store Inventory Item Details">
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Chip
            label={getValue(otherStoreInventory, 'status', 'Active')}
            color={getStatusColor(getValue(otherStoreInventory, 'status', 'Active'))}
            sx={{ fontWeight: 'medium' }}
          />
          <Chip
            label={getValue(otherStoreInventory, 'condition', 'New')}
            color={getConditionColor(getValue(otherStoreInventory, 'condition', 'New'))}
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        <Grid2 container rowSpacing={2}>
          {/* ITEM CODE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="itemCode" sx={{ marginTop: 0 }}>
              Item Code
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="itemCode"
              name="itemCode"
              value={getValue(otherStoreInventory, 'itemCode')}
              disabled
            />
          </Grid2>

          {/* ITEM NAME */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="itemName" sx={{ marginTop: 0 }}>
              Item Name
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="itemName"
              name="itemName"
              value={getValue(otherStoreInventory, 'itemName')}
              disabled
            />
          </Grid2>

          {/* ITEM TYPE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="itemType" sx={{ marginTop: 0 }}>
              Item Type
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="itemType"
              name="itemType"
              value={getValue(otherStoreInventory, 'itemType')}
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
              multiline
              rows={2}
              value={getValue(otherStoreInventory, 'description')}
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
              value={getValue(otherStoreInventory, 'currentStock')}
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
              value={getValue(otherStoreInventory, 'uom')}
              disabled
            />
          </Grid2>

          {/* CONDITION */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="condition" sx={{ marginTop: 0 }}>
              Condition
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="condition"
              name="condition"
              value={getValue(otherStoreInventory, 'condition')}
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
              value={getValue(otherStoreInventory, 'status')}
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
              value={
                getValue(otherStoreInventory, 'currentStock') <
                getValue(otherStoreInventory, 'minimumRequiredStock')
                  ? 'Yes'
                  : 'No'
              }
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
              value={getValue(otherStoreInventory, 'minimumRequiredStock')}
              disabled
            />
          </Grid2>

          {/* MAXIMUM STOCK */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="maximumStock" sx={{ marginTop: 0 }}>
              Maximum Stock
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="maximumStock"
              name="maximumStock"
              value={getValue(otherStoreInventory, 'maximumStock')}
              disabled
            />
          </Grid2>

          {/* LOCATION */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="location" sx={{ marginTop: 0 }}>
              Location
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="location"
              name="location"
              value={getValue(otherStoreInventory, 'location')}
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
              value={getValue(otherStoreInventory, 'department')}
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
              value={formatDate(getValue(otherStoreInventory, 'createdAt'))}
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
              value={formatDate(getValue(otherStoreInventory, 'updatedAt'))}
              disabled
            />
          </Grid2>

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
              value={getValue(otherStoreInventory, 'remarks')}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default OtherStoreInventoryView;
