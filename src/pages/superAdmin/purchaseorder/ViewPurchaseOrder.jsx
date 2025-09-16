import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import {
  Autocomplete,
  Box,
  Button,
  Grid2,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  ButtonGroup,
  Tooltip,
} from '@mui/material';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import PurchaseItem from '../purchaseindent/components/ViewPurchaseItem';

import { fetchPurchaseOrderById } from '@/api/purchaseorder.api';
import { useNavigate, useParams } from 'react-router-dom';
import TrimsAccessoriesPO from './reports/TrimsReport';
import FabricPO from './reports/FabricReport';
import { updatePurchaseOrderMainStatus } from '@/api/purchaseorder.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState({});
  const [poView, setPoView] = useState('trims');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      indentId: '',
      items: [],
      vendorId: '',
      gst: '',
      discount: '',
      grandTotal: '',
      paymentTerms: '',
      freightTerms: '',
      deliveryAddress: '',
      deliveryTerms: '',
      quotationNumber: '',
    },
  });

  const fetchData = async () => {
    try {
      const response = await fetchPurchaseOrderById(id);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        formik.setValues(response);
        formik.setFieldValue('indentId', response.indentId.indentId);
        formik.setFieldValue('items', response?.items);
        formik.setFieldValue('vendorId', response.vendorId.vendorId);
        formik.setFieldValue('vendorName', response.vendorId?.vendorName);
        formik.setFieldValue('address', response.vendorId?.address);
        setData(response);
      }
    } catch {
      toast.error('Failed to fetch data');
    }
  };

  const handleClickBack = () => {
    formik.resetForm();
    navigate(`/${userType}/purchaseorder`);
  };

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await updatePurchaseOrderMainStatus(id, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setData((prev) => ({ ...prev, status: newStatus }));
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const bothApproved =
    data.superAdminStatus === 'approved' && data.superMerchandiserStatus === 'approved';

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/purchaseorder`, title: 'Purchase Order' },
    { title: 'Edit' },
  ];

  return (
    <PageContainer title="Admin - Purchase Order" description="This is the purchase order page">
      <Breadcrumb title="Purchase Order" items={BCrumb} />
      <ParentCard title="View Purchase Order">
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="po-view-label">Show</InputLabel>
            <Select
              labelId="po-view-label"
              id="po-view-select"
              value={poView}
              label="Show"
              onChange={(e) => setPoView(e.target.value)}
            >
              <MenuItem value="trims">Trims/Accessories</MenuItem>
              <MenuItem value="fabric">Fabric</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={data.status ? data.status.toUpperCase() : 'UNKNOWN'}
              color={
                data.status === 'received'
                  ? 'success'
                  : data.status === 'ordered'
                  ? 'info'
                  : 'default'
              }
              sx={{ fontWeight: 600 }}
            />
            {/* Show approval statuses */}
            <Chip
              label={`Super Admin: ${
                data.superAdminStatus ? data.superAdminStatus.toUpperCase() : 'UNKNOWN'
              }`}
              color={
                data.superAdminStatus === 'approved'
                  ? 'success'
                  : data.superAdminStatus === 'rejected'
                  ? 'error'
                  : 'default'
              }
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={`Super Merchandiser: ${
                data.superMerchandiserStatus
                  ? data.superMerchandiserStatus.toUpperCase()
                  : 'UNKNOWN'
              }`}
              color={
                data.superMerchandiserStatus === 'approved'
                  ? 'success'
                  : data.superMerchandiserStatus === 'rejected'
                  ? 'error'
                  : 'default'
              }
              sx={{ fontWeight: 600 }}
            />
            {/* Only enable status change if both are approved */}
            {(() => {
              const bothApproved =
                data.superAdminStatus === 'approved' && data.superMerchandiserStatus === 'approved';
              return (
                <Tooltip
                  title={
                    bothApproved
                      ? ''
                      : 'Both Super Admin and Super Merchandiser must approve before changing status'
                  }
                >
                  <span>
                    <ButtonGroup
                      variant="contained"
                      size="small"
                      disabled={statusUpdating || !bothApproved}
                    >
                      <Button
                        color="info"
                        onClick={() => handleStatusUpdate('ordered')}
                        disabled={data.status === 'ordered' || statusUpdating || !bothApproved}
                      >
                        Mark as Ordered
                      </Button>
                      <Button
                        color="success"
                        onClick={() => handleStatusUpdate('received')}
                        disabled={data.status === 'received' || statusUpdating || !bothApproved}
                      >
                        Mark as Received
                      </Button>
                    </ButtonGroup>
                  </span>
                </Tooltip>
              );
            })()}
          </Box>
        </Box>
        {poView === 'trims' && <TrimsAccessoriesPO poData={data} />}
        {poView === 'fabric' && <FabricPO poData={data} />}
        <form action="" method="POST" onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* PURCHASE ORDER NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
                PO
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="purchaseOrderNumber"
                name="purchaseOrderNumber"
                value={formik.values.purchaseOrderNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Purchase Order Number"
                disabled
              />
            </Grid2>

            {/* QUOTATION NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="quotationNumber" sx={{ marginTop: 0 }}>
                Quotation No
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="quotationNumber"
                name="quotationNumber"
                value={formik.values.quotationNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Quotation Number"
                disabled
              />
            </Grid2>

            {/* INDENT ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="indentId" sx={{ marginTop: 0 }}>
                Indent ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                //   options={}
                autoHighlight
                //   getOptionLabel={formik.values.indentId}
                value={formik.values.indentId}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Indent ID"
                    aria-label="Select Indent ID"
                    autoComplete="off"
                  />
                )}
                disabled
              />
            </Grid2>
            {formik.values.items &&
              formik.values.items?.map((item, index) => {
                return (
                  <>
                    <PurchaseItem
                      formik={formik}
                      index={index}
                      key={index}
                      disable={true}
                      view={true}
                    />
                  </>
                );
              })}

            {/* VENDOR ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorId" sx={{ marginTop: 0 }}>
                Vendor ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                autoHighlight
                value={formik.values.vendorId}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Vendor ID"
                    aria-label="Select Vendor ID"
                    autoComplete="off"
                  />
                )}
                disabled
              />
            </Grid2>

            {formik.values.vendorId && (
              <>
                {/* VENDOR NAME */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="vendorName" sx={{ marginTop: 0 }}>
                    Vendor Name
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="vendorName"
                    name="vendorName"
                    value={formik.values.vendorName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Vendor Name"
                    disabled
                  />
                </Grid2>

                {/* ADDRESS */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="address" sx={{ marginTop: 0 }}>
                    Address
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="address"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Address"
                    disabled
                  />
                </Grid2>
              </>
            )}

            {/* GST */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="gst" sx={{ marginTop: 0 }}>
                GST
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="gst"
                name="gst"
                value={formik.values.gst}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter GST"
                disabled
              />
            </Grid2>

            {/* DISCOUNT */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="discount" sx={{ marginTop: 0 }}>
                Discount
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="discount"
                name="discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Discount"
                disabled
              />
            </Grid2>

            {/* GRAND TOTAL */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="grandTotal" sx={{ marginTop: 0 }}>
                GRAND TOTAL
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="grandTotal"
                name="grandTotal"
                value={formik.values.grandTotal}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Grand Total"
                disabled
              />
            </Grid2>

            {/* PAYMENT TERMS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="paymentTerms" sx={{ marginTop: 0 }}>
                Payment Terms
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="paymentTerms"
                name="paymentTerms"
                value={formik.values.paymentTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Payment Terms"
                disabled
              />
            </Grid2>

            {/* FREIGHT TERMS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="freightTerms" sx={{ marginTop: 0 }}>
                Freight Terms
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="freightTerms"
                name="freightTerms"
                value={formik.values.freightTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Freight Terms"
                disabled
              />
            </Grid2>

            {/* DELIVERY ADDRESS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="deliveryAddress" sx={{ marginTop: 0 }}>
                Delivery Address
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="deliveryAddress"
                name="deliveryAddress"
                value={formik.values.deliveryAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Delivery Address"
                disabled
              />
            </Grid2>

            {/* DELIVERY TERMS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="deliveryTerms" sx={{ marginTop: 0 }}>
                Delivery Terms
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="deliveryTerms"
                name="deliveryTerms"
                value={formik.values.deliveryTerms}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Delivery Terms"
                disabled
              />
            </Grid2>
          </Grid2>

          {/* SUBMIT */}
          <Box
            sx={{
              margin: '1rem 1.5rem 0 0',
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <Button type="reset" onClick={handleClickBack}>
              Back
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewPurchaseOrder;
