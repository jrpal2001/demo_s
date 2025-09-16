'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Grid2, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { fetchInventoryById } from '@/api/inventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';



const InventoryView = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/inventory`, title: 'Product Inventory' },
    { title: 'View' },
  ];
  const { id, department } = useParams();
  const navigate = useNavigate();
  const [inventoryItem, setInventoryItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchInventoryById(department, id);
        console.log('🚀 ~ fetchData ~ response:', response);
        if (response && response.data) {
          setInventoryItem(response.data);
        } else {
          toast.warning('Inventory item not found');
          navigate(`/${userType}/inventory`);
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error);
        toast.error('Failed to fetch inventory item details');
        navigate(`/${userType}/inventory`);
      } finally {
        setLoading(false);
      }
    };

    if (id && department) {
      fetchData();
    }
  }, [id, department, navigate]);

  if (loading) {
    return (
      <PageContainer title="Admin - Inventory Item" description="Loading inventory item details">
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

  return (
    <PageContainer title="Admin - Inventory Item" description="View inventory item details">
      <Breadcrumb
        title={`${department.charAt(0).toUpperCase() + department.slice(1)} Inventory Details`}
        items={BCrumb}
      />

      <ParentCard title="Inventory Item Details">
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
              value={getValue(inventoryItem, 'itemCode')}
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
              value={getValue(inventoryItem, 'description')}
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
              value={getValue(inventoryItem, 'currentStock')}
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
              value={getValue(inventoryItem, 'uom')}
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
              value={getValue(inventoryItem, 'lowStockAlert') ? 'Yes' : 'No'}
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
              value={getValue(inventoryItem, 'minimumRequiredStock')}
              disabled
            />
          </Grid2>

          {/* LOT DETAILS */}
          {inventoryItem?.lots && Object.keys(inventoryItem.lots).length > 0 && (
            <>
              <Grid2 size={12}>
                <CustomFormLabel
                  sx={{ marginTop: 2, marginBottom: 1, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Lot Details
                </CustomFormLabel>
              </Grid2>
              {Object.entries(inventoryItem.lots).map(([lotName, quantity], index) => (
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
                      value={`${quantity} ${getValue(inventoryItem, 'uom')}`}
                      disabled
                    />
                  </Grid2>
                </React.Fragment>
              ))}
            </>
          )}

          {/* NO LOTS MESSAGE */}
          {(!inventoryItem?.lots || Object.keys(inventoryItem.lots).length === 0) && (
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
              value={formatDate(getValue(inventoryItem, 'createdAt'))}
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
              value={formatDate(getValue(inventoryItem, 'updatedAt'))}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>

      {/* INVENTORY IMAGES */}
      <ParentCard title="Inventory Images" sx={{ mt: 3 }}>
        {inventoryItem?.images && inventoryItem.images.length > 0 ? (
          <Grid2 container spacing={2}>
            {inventoryItem.images.map((image, index) => (
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
                    alt={`Inventory image ${index + 1}`}
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

export default InventoryView;
