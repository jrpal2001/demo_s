'use client';
import { useEffect, useState } from 'react';
import { Box, Grid2, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { fetchAssetInwardById } from '@/api/assetinward.api';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewAssetInward = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-inward`, title: 'Asset Inward' },
    { title: 'View' },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const [assetInward, setAssetInward] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAssetInwardById(id);
        console.log('🚀 ~ fetchData ~ response:', response);
        if (response && response.data) {
          setAssetInward(response.data);
        } else {
          toast.warning('Asset inward not found');
          navigate(`/${userType}/asset-inward`);
        }
      } catch (error) {
        toast.error('Failed to fetch asset inward details');
        navigate(`/${userType}/asset-inward`);
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
      <PageContainer title="Admin - Asset Inward" description="Loading asset inward details">
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
    <PageContainer title="Admin - Asset Inward" description="View asset inward details">
      <Breadcrumb title="Asset Inward Details" items={BCrumb} />
      <ParentCard title="Asset Inward Details">
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getValue(assetInward, 'inspectionStatus', 'N/A')}
            color={
              getValue(assetInward, 'inspectionStatus') === 'Accepted'
                ? 'success'
                : getValue(assetInward, 'inspectionStatus') === 'Rejected'
                ? 'error'
                : 'warning'
            }
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
        <Grid2 container rowSpacing={2}>
          {/* PURCHASE ORDER NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="poNumber" sx={{ marginTop: 0 }}>
              Purchase Order Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="poNumber"
              name="poNumber"
              value={
                getValue(assetInward, 'poNumber.purchaseOrderNumber') ||
                getValue(assetInward, 'poNumber')
              }
              disabled
            />
          </Grid2>

          {/* INDENT ID */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="indentId" sx={{ marginTop: 0 }}>
              Indent ID
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="indentId"
              name="indentId"
              value={getValue(assetInward, 'indentId')}
              disabled
            />
          </Grid2>

          {/* VENDOR ID */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="vendorId" sx={{ marginTop: 0 }}>
              Vendor ID
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="vendorId"
              name="vendorId"
              value={getValue(assetInward, 'vendorId')}
              disabled
            />
          </Grid2>

          {/* VENDOR NAME */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="vendorName" sx={{ marginTop: 0 }}>
              Vendor Name
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="vendorName"
              name="vendorName"
              value={getValue(assetInward, 'vendorName')}
              disabled
            />
          </Grid2>

          {/* ASSET ID */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="assetId" sx={{ marginTop: 0 }}>
              Asset ID
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="assetId"
              name="assetId"
              value={getValue(assetInward, 'item.assetId') || getValue(assetInward, 'assetId')}
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
              value={getValue(assetInward, 'item.assetName') || getValue(assetInward, 'assetName')}
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
              value={getValue(assetInward, 'item.assetType') || getValue(assetInward, 'assetType')}
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
              value={getValue(assetInward, 'item.uom') || getValue(assetInward, 'uom')}
              disabled
            />
          </Grid2>

          {/* QUANTITY RECEIVED */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="quantityReceived" sx={{ marginTop: 0 }}>
              Quantity Received
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="quantityReceived"
              name="quantityReceived"
              value={
                getValue(assetInward, 'item.quantityReceived') ||
                getValue(assetInward, 'quantityReceived')
              }
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
              value={getValue(assetInward, 'item.unitPrice') || getValue(assetInward, 'unitPrice')}
              disabled
            />
          </Grid2>

          {/* INVOICE NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="invoiceNo" sx={{ marginTop: 0 }}>
              Invoice Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="invoiceNo"
              name="invoiceNo"
              value={getValue(assetInward, 'invoiceNo')}
              disabled
            />
          </Grid2>

          {/* INVOICE DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="invoiceDate" sx={{ marginTop: 0 }}>
              Invoice Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="invoiceDate"
              name="invoiceDate"
              value={formatDate(getValue(assetInward, 'invoiceDate'))}
              disabled
            />
          </Grid2>

          {/* INWARD DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="inwardDate" sx={{ marginTop: 0 }}>
              Inward Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="inwardDate"
              name="inwardDate"
              value={formatDate(getValue(assetInward, 'inwardDate'))}
              disabled
            />
          </Grid2>

          {/* LOT NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="lotNo" sx={{ marginTop: 0 }}>
              Lot Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="lotNo"
              name="lotNo"
              value={getValue(assetInward, 'lotNo')}
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
              value={getValue(assetInward, 'storageLocation')}
              disabled
            />
          </Grid2>

          {/* RECEIVED BY */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="receivedBy" sx={{ marginTop: 0 }}>
              Received By
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="receivedBy"
              name="receivedBy"
              value={getValue(assetInward, 'receivedBy')}
              disabled
            />
          </Grid2>

          {/* INSPECTION STATUS */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="inspectionStatus" sx={{ marginTop: 0 }}>
              Inspection Status
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="inspectionStatus"
              name="inspectionStatus"
              value={getValue(assetInward, 'inspectionStatus')}
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
              rows={3}
              value={getValue(assetInward, 'remarks')}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewAssetInward;
