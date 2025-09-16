import { useEffect, useState } from 'react';
import { Box, Grid2, Chip } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { fetchMaterialInwardById } from '@/api/inwardMaterial.api';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';


const ViewMaterialInward = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/material-inward`, title: 'Material Inward' },
    { title: 'View' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [materialInward, setMaterialInward] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get department from URL query params or default to 'accessories'
  const queryParams = new URLSearchParams(location.search);
  const department = queryParams.get('department') || 'accessories';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchMaterialInwardById(id, department);
        console.log('🚀 ~ fetchData ~ response:', response);
        if (response && response.data) {
          setMaterialInward(response.data);
        } else {
          toast.warning('Material inward not found');
          navigate(`/${userType}/inwardmaterial-all`);
        }
      } catch (error) {
        toast.error('Failed to fetch material inward details');
        navigate(`/${userType}/inwardmaterial-all`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, department, navigate]);

  if (loading) {
    return (
      <PageContainer title="Admin - Material Inward" description="Loading material inward details">
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
    <PageContainer title="Admin - Material Inward" description="View material inward details">
      <Breadcrumb
        title={`${department.charAt(0).toUpperCase() + department.slice(1)} Inward Details`}
        items={BCrumb}
      />
      <ParentCard title="Material Inward Details">
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getValue(materialInward, 'inspectionStatus', 'N/A')}
            color={
              getValue(materialInward, 'inspectionStatus') === 'Accepted'
                ? 'success'
                : getValue(materialInward, 'inspectionStatus') === 'Rejected'
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
              value={getValue(materialInward, 'poNumber')}
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
              value={getValue(materialInward, 'indentId')}
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
              value={getValue(materialInward, 'vendorId')}
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
              value={getValue(materialInward, 'vendorName')}
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
              value={
                getValue(materialInward, 'item.itemCode') || getValue(materialInward, 'itemCode')
              }
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
              value={
                getValue(materialInward, 'item.itemDescription') ||
                getValue(materialInward, 'itemDescription')
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
              value={getValue(materialInward, 'item.uom') || getValue(materialInward, 'uom')}
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
                getValue(materialInward, 'item.quantityReceived') ||
                getValue(materialInward, 'quantityReceived')
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
                getValue(materialInward, 'item.unitPrice') || getValue(materialInward, 'unitPrice')
              }
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
              value={getValue(materialInward, 'invoiceNo')}
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
              value={formatDate(getValue(materialInward, 'invoiceDate'))}
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
              value={getValue(materialInward, 'lotNo')}
              disabled
            />
          </Grid2>

          {/* DC NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="dcNo" sx={{ marginTop: 0 }}>
              DC Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="dcNo"
              name="dcNo"
              value={getValue(materialInward, 'dcNo')}
              disabled
            />
          </Grid2>

          {/* E-WAY BILL NUMBER */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel htmlFor="ewayBillNo" sx={{ marginTop: 0 }}>
              E-way Bill Number
            </CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              id="ewayBillNo"
              name="ewayBillNo"
              value={getValue(materialInward, 'ewayBillNo')}
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
              value={getValue(materialInward, 'storageLocation')}
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
              value={getValue(materialInward, 'receivedBy')}
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
              value={getValue(materialInward, 'inspectionStatus')}
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
              value={getValue(materialInward, 'remarks')}
              disabled
            />
          </Grid2>
        </Grid2>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewMaterialInward;
