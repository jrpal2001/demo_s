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
import { fetchOtherStoreInwardById } from '@/api/otherstoresInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewOtherStoreInward = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userType = useSelector(selectCurrentUserType);
  const [otherStoreInward, setOtherStoreInward] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const itemType = queryParams.get('itemType') || 'TOOLS&SPAREPARTS';

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/otherstore-inward`, title: 'Other Store Inward' },
    { title: 'View' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchOtherStoreInwardById(id);
        if (response && response.data) {
          setOtherStoreInward(response.data);
        } else {
          toast.warning('Other store inward not found');
          navigate(`/${userType}/otherstore-inward`);
        }
      } catch (error) {
        toast.error('Failed to fetch other store inward details');
        navigate(`/${userType}/otherstore-inward`);
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
        title="Admin - Other Store Inward"
        description="Loading other store inward details"
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

  return (
    <PageContainer title="Admin - Other Store Inward" description="View other store inward details">
      <Breadcrumb
        title={`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} Inward Details`}
        items={BCrumb}
      />
      <ParentCard title="Other Store Inward Details">
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Chip
            label={getValue(otherStoreInward, 'inspectionStatus', 'N/A')}
            color={
              getValue(otherStoreInward, 'inspectionStatus') === 'Accepted'
                ? 'success'
                : getValue(otherStoreInward, 'inspectionStatus') === 'Rejected'
                ? 'error'
                : 'warning'
            }
            sx={{ fontWeight: 'medium' }}
          />
          <Chip
            label={getValue(otherStoreInward, 'condition', 'N/A')}
            color={
              getValue(otherStoreInward, 'condition') === 'New'
                ? 'success'
                : getValue(otherStoreInward, 'condition') === 'Damaged'
                ? 'error'
                : 'info'
            }
            sx={{ fontWeight: 'medium' }}
          />
          <Chip
            label={getValue(otherStoreInward, 'qualityCheckStatus', 'N/A')}
            color={
              getValue(otherStoreInward, 'qualityCheckStatus') === 'Pass'
                ? 'success'
                : getValue(otherStoreInward, 'qualityCheckStatus') === 'Fail'
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
                getValue(otherStoreInward, 'poNumber.purchaseOrderNumber') ||
                getValue(otherStoreInward, 'poNumber')
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
              value={getValue(otherStoreInward, 'indentId')}
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
              value={getValue(otherStoreInward, 'vendorId')}
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
              value={getValue(otherStoreInward, 'vendorName')}
              disabled
            />
          </Grid2>
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
              value={getValue(otherStoreInward, 'item.itemId')}
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
              value={getValue(otherStoreInward, 'item.itemName')}
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
              value={getValue(otherStoreInward, 'item.itemType')}
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
              value={getValue(otherStoreInward, 'item.uom')}
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
              value={getValue(otherStoreInward, 'item.quantityReceived')}
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
              value={getValue(otherStoreInward, 'item.unitPrice')}
              disabled
            />
          </Grid2>
          {/* MANUFACTURING DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="manufacturingDate" sx={{ marginTop: 0 }}>
              Manufacturing Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="manufacturingDate"
              name="manufacturingDate"
              value={formatDate(getValue(otherStoreInward, 'item.manufacturingDate'))}
              disabled
            />
          </Grid2>
          {/* EXPIRY DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="expiryDate" sx={{ marginTop: 0 }}>
              Expiry Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="expiryDate"
              name="expiryDate"
              value={formatDate(getValue(otherStoreInward, 'item.expiryDate'))}
              disabled
            />
          </Grid2>
          {/* BATCH NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="batchNumber" sx={{ marginTop: 0 }}>
              Batch Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="batchNumber"
              name="batchNumber"
              value={getValue(otherStoreInward, 'item.batchNumber')}
              disabled
            />
          </Grid2>
          {/* WARRANTY PERIOD */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="warrantyPeriod" sx={{ marginTop: 0 }}>
              Warranty Period
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="warrantyPeriod"
              name="warrantyPeriod"
              value={getValue(otherStoreInward, 'item.warrantyPeriod')}
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
              value={getValue(otherStoreInward, 'invoiceNo')}
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
              value={formatDate(getValue(otherStoreInward, 'invoiceDate'))}
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
              value={getValue(otherStoreInward, 'lotNo')}
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
              value={getValue(otherStoreInward, 'storageLocation')}
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
              value={getValue(otherStoreInward, 'receivedBy')}
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
              value={getValue(otherStoreInward, 'inspectionStatus')}
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
              value={getValue(otherStoreInward, 'condition')}
              disabled
            />
          </Grid2>
          {/* QUALITY CHECK STATUS */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="qualityCheckStatus" sx={{ marginTop: 0 }}>
              Quality Check Status
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="qualityCheckStatus"
              name="qualityCheckStatus"
              value={getValue(otherStoreInward, 'qualityCheckStatus')}
              disabled
            />
          </Grid2>
          {/* CREATED BY */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="createdBy" sx={{ marginTop: 0 }}>
              Created By
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="createdBy"
              name="createdBy"
              value={getValue(otherStoreInward, 'createdBy')}
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
              value={getValue(otherStoreInward, 'remarks')}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewOtherStoreInward;
