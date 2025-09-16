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
import { fetchMaintenanceInwardById } from '@/api/maintenanceInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewMaintenanceInward = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/maintenance-inward`, title: 'Maintenance Inward' },
    { title: 'View' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [maintenanceInward, setMaintenanceInward] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(location.search);
  const maintenanceType = queryParams.get('maintenanceType') || 'BUSINESSLICENSE';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchMaintenanceInwardById(id);
        if (response && response.data) {
          setMaintenanceInward(response.data);
        } else {
          toast.warning('Maintenance inward not found');
          navigate(`/${userType}/maintenance-inward`);
        }
      } catch (error) {
        toast.error('Failed to fetch maintenance inward details');
        navigate(`/${userType}/maintenance-inward`);
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
        title="Admin - Maintenance Inward"
        description="Loading maintenance inward details"
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          Loading...
        </Box>
      </PageContainer>
    );
  }

  const getValue = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : defaultValue;
    }, obj);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  return (
    <PageContainer title="Admin - Maintenance Inward" description="View maintenance inward details">
      <Breadcrumb
        title={`${
          maintenanceType.charAt(0).toUpperCase() + maintenanceType.slice(1)
        } Inward Details`}
        items={BCrumb}
      />
      <ParentCard title="Maintenance Inward Details">
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getValue(maintenanceInward, 'inspectionStatus', 'N/A')}
            color={
              getValue(maintenanceInward, 'inspectionStatus') === 'Accepted'
                ? 'success'
                : getValue(maintenanceInward, 'inspectionStatus') === 'Rejected'
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
                getValue(maintenanceInward, 'poNumber.purchaseOrderNumber') ||
                getValue(maintenanceInward, 'poNumber')
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
              value={getValue(maintenanceInward, 'indentId')}
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
              value={getValue(maintenanceInward, 'vendorId')}
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
              value={getValue(maintenanceInward, 'vendorName')}
              disabled
            />
          </Grid2>
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
              value={
                getValue(maintenanceInward, 'item.maintenanceId') ||
                getValue(maintenanceInward, 'maintenanceId')
              }
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
              value={
                getValue(maintenanceInward, 'item.maintenanceName') ||
                getValue(maintenanceInward, 'maintenanceName')
              }
              disabled
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
              value={
                getValue(maintenanceInward, 'item.maintenanceType') ||
                getValue(maintenanceInward, 'maintenanceType')
              }
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
              value={getValue(maintenanceInward, 'item.uom') || getValue(maintenanceInward, 'uom')}
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
                getValue(maintenanceInward, 'item.quantityReceived') ||
                getValue(maintenanceInward, 'quantityReceived')
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
              value={
                getValue(maintenanceInward, 'item.unitPrice') ||
                getValue(maintenanceInward, 'unitPrice')
              }
              disabled
            />
          </Grid2>
          {/* VALIDITY START DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="validityStartDate" sx={{ marginTop: 0 }}>
              Validity Start Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="validityStartDate"
              name="validityStartDate"
              value={formatDate(getValue(maintenanceInward, 'item.validityStartDate'))}
              disabled
            />
          </Grid2>
          {/* VALIDITY END DATE */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="validityEndDate" sx={{ marginTop: 0 }}>
              Validity End Date
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="validityEndDate"
              name="validityEndDate"
              value={formatDate(getValue(maintenanceInward, 'item.validityEndDate'))}
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
              value={getValue(maintenanceInward, 'invoiceNo')}
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
              value={formatDate(getValue(maintenanceInward, 'invoiceDate'))}
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
              value={formatDate(getValue(maintenanceInward, 'inwardDate'))}
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
              value={getValue(maintenanceInward, 'lotNo')}
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
              value={getValue(maintenanceInward, 'storageLocation')}
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
              value={getValue(maintenanceInward, 'receivedBy')}
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
              value={getValue(maintenanceInward, 'inspectionStatus')}
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
              value={getValue(maintenanceInward, 'status')}
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
              value={getValue(maintenanceInward, 'remarks')}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewMaintenanceInward;
