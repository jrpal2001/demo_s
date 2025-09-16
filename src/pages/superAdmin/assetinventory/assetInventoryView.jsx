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
import { fetchAssetInventoryById } from '@/api/assetinventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const AssetInventoryView = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-inventory`, title: 'Asset Inventory' },
    { title: 'View' },
  ];

  const { id, assetType } = useParams();
  const navigate = useNavigate();
  const [assetInventory, setAssetInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAssetInventoryById(id);
        console.log('🚀 ~ fetchData ~ response:', response);
        if (response && response.data) {
          setAssetInventory(response.data);
        } else {
          toast.warning('Asset inventory not found');
          navigate(`/${userType}/asset-inventory`);
        }
      } catch (error) {
        console.log('🚀 ~ fetchData ~ error:', error);
        toast.error('Failed to fetch asset inventory details');
        navigate(`/${userType}/asset-inventory`);
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
      <PageContainer title="Admin - Asset Inventory" description="Loading asset inventory details">
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
    <PageContainer title="Admin - Asset Inventory" description="View asset inventory details">
      <Breadcrumb
        title={`${
          assetType ? assetType.charAt(0).toUpperCase() + assetType.slice(1) : 'Asset'
        } Inventory Details`}
        items={BCrumb}
      />
      <ParentCard title="Asset Inventory Item Details">
        <Grid2 container rowSpacing={2}>
          {/* ASSET CODE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="assetCode" sx={{ marginTop: 0 }}>
              Asset Code
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="assetCode"
              name="assetCode"
              value={getValue(assetInventory, 'assetCode')}
              disabled
            />
          </Grid2>

          {/* ASSET NAME */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="assetName" sx={{ marginTop: 0 }}>
              Asset Name
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="assetName"
              name="assetName"
              value={
                getValue(assetInventory, 'assetName') || getValue(assetInventory, 'description')
              }
              disabled
            />
          </Grid2>

          {/* ASSET TYPE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="assetType" sx={{ marginTop: 0 }}>
              Asset Type
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="assetType"
              name="assetType"
              value={getValue(assetInventory, 'assetType')}
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
              value={getValue(assetInventory, 'department')}
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
              value={getValue(assetInventory, 'currentStock')}
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
              value={getValue(assetInventory, 'uom')}
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
              value={getValue(assetInventory, 'unitPrice')}
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
              value={getValue(assetInventory, 'storageLocation')}
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
              value={getValue(assetInventory, 'lowStockAlert') ? 'Yes' : 'No'}
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
              value={
                getValue(assetInventory, 'minimumRequiredStock') ||
                getValue(assetInventory, 'MinreqStock')
              }
              disabled
            />
          </Grid2>

          {/* LOT DETAILS */}
          {assetInventory?.lots && Object.keys(assetInventory.lots).length > 0 && (
            <>
              <Grid2 size={12}>
                <CustomFormLabel
                  sx={{ marginTop: 2, marginBottom: 1, fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                  Lot Details
                </CustomFormLabel>
              </Grid2>
              {Object.entries(assetInventory.lots).map(([lotName, quantity], index) => (
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
                      value={`${quantity} ${getValue(assetInventory, 'uom')}`}
                      disabled
                    />
                  </Grid2>
                </React.Fragment>
              ))}
            </>
          )}

          {/* NO LOTS MESSAGE */}
          {(!assetInventory?.lots || Object.keys(assetInventory.lots).length === 0) && (
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
              value={getValue(assetInventory, 'remarks') || 'No remarks'}
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
              value={formatDate(getValue(assetInventory, 'createdAt'))}
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
              value={formatDate(getValue(assetInventory, 'updatedAt'))}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>

      {/* ASSET INVENTORY IMAGES */}
      <ParentCard title="Asset Inventory Images" sx={{ mt: 3 }}>
        {assetInventory?.images && assetInventory.images.length > 0 ? (
          <Grid2 container spacing={2}>
            {assetInventory.images.map((image, index) => (
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
                    alt={`Asset inventory image ${index + 1}`}
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

export default AssetInventoryView;
