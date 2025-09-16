'use client';
import { useEffect, useState } from 'react';
import { Box, Grid2, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { fetchAssetMaterialInwardQcById } from '@/api/assetMaterialInwardQc.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewAssetMaterialInwardQc = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-material-inward-qc`, title: 'Asset Material Inward QC' },
    { title: 'View' },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const [materialInward, setMaterialInward] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to get display code for items
  const getItemDisplayCode = (item) => {
    if (item?.codeDetails?.mainAssetId) return item.codeDetails.mainAssetId;
    if (item?.codeDetails?.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
    if (item?.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;
    return item?.code || 'N/A';
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchAssetMaterialInwardQcById(id);
        console.log('🚀 ~ fetchData ~ response:', response);
        if (response && response.data) {
          setMaterialInward(response.data);
        } else {
          toast.warning('Asset material inward QC not found');
          navigate(`/${userType}/asset-material-inward-qc`);
        }
      } catch (error) {
        toast.error('Failed to fetch asset material inward QC details');
        navigate(`/${userType}/asset-material-inward-qc`);
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
        title="Admin - Asset Material Inward QC"
        description="Loading asset material inward QC details"
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

  // Get the first item for display
  const firstItem = materialInward?.items?.[0];
  const itemDisplayCode = getItemDisplayCode(firstItem);

  return (
    <PageContainer
      title="Admin - Asset Material Inward QC"
      description="View asset material inward QC details"
    >
      <Breadcrumb title="Asset Material Inward QC Details" items={BCrumb} />
      <ParentCard title="Asset Material Inward QC Details">
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getValue(materialInward, 'inspectionStatus', 'N/A').toUpperCase()}
            color={
              getValue(materialInward, 'inspectionStatus') === 'accepted'
                ? 'success'
                : getValue(materialInward, 'inspectionStatus') === 'rejected'
                ? 'error'
                : 'warning'
            }
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        <Grid2 container rowSpacing={2}>
          {/* PURCHASE ORDER NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
              Purchase Order Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="purchaseOrderNumber"
              name="purchaseOrderNumber"
              value={getValue(materialInward, 'purchaseOrderNumber.purchaseOrderNumber', 'N/A')}
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
              value={getValue(materialInward, 'purchaseOrderNumber.indentId.indentId', 'N/A')}
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
              value={getValue(materialInward, 'purchaseOrderNumber.vendorId.vendorId', 'N/A')}
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
              value={getValue(materialInward, 'purchaseOrderNumber.vendorId.vendorName', 'N/A')}
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
              value={itemDisplayCode}
              disabled
            />
          </Grid2>

          {/* MODEL */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="model" sx={{ marginTop: 0 }}>
              Model
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="model"
              name="model"
              value={firstItem?.model || 'N/A'}
              disabled
            />
          </Grid2>

          {/* ITEM DESCRIPTION */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="itemDescription" sx={{ marginTop: 0 }}>
              Item Description
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="itemDescription"
              name="itemDescription"
              value={firstItem?.description || 'N/A'}
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
              value={firstItem?.uom || 'N/A'}
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
              value={firstItem?.quantityReceived || 'N/A'}
              disabled
            />
          </Grid2>

          {/* QUANTITY ACCEPTED */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="quantityAccepted" sx={{ marginTop: 0 }}>
              Quantity Accepted
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="quantityAccepted"
              name="quantityAccepted"
              value={firstItem?.quantityAccepted || 'N/A'}
              disabled
            />
          </Grid2>

          {/* TOTAL AMOUNT */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="totalAmount" sx={{ marginTop: 0 }}>
              Total Amount
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="totalAmount"
              name="totalAmount"
              value={getValue(materialInward, 'totalAmount', 'N/A')}
              disabled
            />
          </Grid2>

          {/* INVOICE NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="invoiceNumber" sx={{ marginTop: 0 }}>
              Invoice Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="invoiceNumber"
              name="invoiceNumber"
              value={getValue(materialInward, 'invoiceNumber', 'N/A')}
              disabled
            />
          </Grid2>

          {/* LOT NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="lotNumber" sx={{ marginTop: 0 }}>
              Lot Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="lotNumber"
              name="lotNumber"
              value={getValue(materialInward, 'lotNumber', 'N/A')}
              disabled
            />
          </Grid2>

          {/* DEBIT NOTE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="debitNote" sx={{ marginTop: 0 }}>
              Debit Note
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="debitNote"
              name="debitNote"
              value={getValue(materialInward, 'debitNote', 'N/A')}
              disabled
            />
          </Grid2>

          {/* INSPECTED BY */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="inspectedBy" sx={{ marginTop: 0 }}>
              Inspected By
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="inspectedBy"
              name="inspectedBy"
              value={getValue(materialInward, 'inspectedBy', 'N/A')}
              disabled
            />
          </Grid2>

          {/* INSPECTED DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="inspectedDate" sx={{ marginTop: 0 }}>
              Inspected Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="inspectedDate"
              name="inspectedDate"
              value={formatDate(getValue(materialInward, 'inspectedDate', ''))}
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
              value={getValue(materialInward, 'inspectionStatus', 'N/A').toUpperCase()}
              disabled
            />
          </Grid2>

          {/* INSPECTION REMARKS */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="inspectionRemarks" sx={{ marginTop: 0 }}>
              Inspection Remarks
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="inspectionRemarks"
              name="inspectionRemarks"
              multiline
              rows={3}
              value={getValue(materialInward, 'inspectionRemarks', 'N/A')}
              disabled
            />
          </Grid2>

          {/* REMARK */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="remark" sx={{ marginTop: 0 }}>
              Remark
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="remark"
              name="remark"
              multiline
              rows={3}
              value={getValue(materialInward, 'remark', 'N/A')}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewAssetMaterialInwardQc;
