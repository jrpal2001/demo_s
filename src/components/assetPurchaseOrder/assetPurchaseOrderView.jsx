'use client';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Box, Button, Grid2, Chip } from '@mui/material';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { fetchAssetPurchaseOrderById } from '@/api/assetpurchaseorder.api';
import { useNavigate, useParams } from 'react-router-dom';
import StationeryPO from '@/pages/superAdmin/purchaseorder/reports/StationeryReport';
import MachinePO from '@/pages/superAdmin/purchaseorder/reports/MachineryReport';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewAssetPurchaseOrder = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/assetpurchaseorder`, title: 'Asset Purchase Order' },
    { title: 'View' },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});

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
      status: '',
      vendorPriority: '',
      preparedBy: '',
      authorizedBy: '',
      rejectedBy: '',
      superAdminOne: false,
      superAdminTwo: false,
    },
  });

  // Helper function to get display code for item
  const getItemDisplayCode = (item) => {
    // First check if backend provided a displayCode
    if (item.displayCode) return item.displayCode;

    // Then check if we have codeDetails from purchase order population
    if (item.codeDetails) {
      if (item.codeDetails.mainAssetId) return item.codeDetails.mainAssetId;
      if (item.codeDetails.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
      if (item.codeDetails.mainItemCode) return item.codeDetails.mainItemCode;
    }

    // Then check if we have itemDetails from indent population
    if (item.itemDetails) {
      if (item.itemDetails.mainAssetId) return item.itemDetails.mainAssetId;
      if (item.itemDetails.mainMaintenanceId) return item.itemDetails.mainMaintenanceId;
      if (item.itemDetails.mainItemCode) return item.itemDetails.mainItemCode;
    }

    // Check direct properties from indent search
    if (item.mainAssetId) return item.mainAssetId;
    if (item.mainMaintenanceId) return item.mainMaintenanceId;
    if (item.mainItemCode) return item.mainItemCode;

    return item.code || 'N/A';
  };

  const fetchData = async () => {
    try {
      const response = await fetchAssetPurchaseOrderById(id);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        formik.setValues(response);
        formik.setFieldValue('indentId', response.indentId?._id);
        formik.setFieldValue('items', response.items || []);
        formik.setFieldValue('vendorId', response.vendorId?._id);
        formik.setFieldValue('vendorName', response.vendorId?.vendorName);
        formik.setFieldValue('address', response.vendorId?.address);
        formik.setFieldValue('vendorPriority', response.vendorId?.vendorPriority);
        setData(response);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch data');
    }
  };

  const handleClickBack = () => {
    formik.resetForm();
    navigate(`/${userType}/assetpurchaseorder`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer
      title="Admin - Asset Purchase Order"
      description="This is the asset purchase order page"
    >
      <Breadcrumb title="Asset Purchase Order" items={BCrumb} />
      <ParentCard title="View Asset Purchase Order">
        <MachinePO poData={data} />
        <StationeryPO poData={data} />
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* PURCHASE ORDER NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
                APO
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="purchaseOrderNumber"
                name="purchaseOrderNumber"
                value={formik.values.purchaseOrderNumber}
                placeholder="Enter Asset Purchase Order Number"
                disabled
              />
            </Grid2>

            {/* STATUS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="status" sx={{ marginTop: 0 }}>
                Status
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="status"
                name="status"
                value={formik.values.status?.toUpperCase() || 'PENDING'}
                placeholder="Status"
                disabled
              />
            </Grid2>

            {/* INDENT ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="indentId" sx={{ marginTop: 0 }}>
                Asset Indent ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="indentId"
                name="indentId"
                value={data.indentId?.indentId || ''}
                placeholder="Asset Indent ID"
                disabled
              />
            </Grid2>

            {/* ITEMS DISPLAY */}
            {formik.values.items &&
              formik.values.items?.map((item, index) => (
                <Grid2 key={index} size={{ xs: 12 }}>
                  <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, md: 2.4 }}>
                        <CustomFormLabel>Item Code</CustomFormLabel>
                        <CustomTextField
                          fullWidth
                          value={getItemDisplayCode(item)}
                          disabled
                          placeholder="Item Code"
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 2.4 }}>
                        <CustomFormLabel>Model</CustomFormLabel>
                        <CustomTextField
                          fullWidth
                          value={item.model || ''}
                          disabled
                          placeholder="Model"
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 2.4 }}>
                        <CustomFormLabel>Req Quantity</CustomFormLabel>
                        <CustomTextField
                          fullWidth
                          value={item.quantity || item.indentQuantity || ''}
                          disabled
                          placeholder="Request Quantity"
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 2.4 }}>
                        <CustomFormLabel>Order Quantity</CustomFormLabel>
                        <CustomTextField
                          fullWidth
                          value={item.orderQuantity || ''}
                          disabled
                          placeholder="Order Quantity"
                        />
                      </Grid2>
                      <Grid2 size={{ xs: 12, md: 2.4 }}>
                        <CustomFormLabel>UOM</CustomFormLabel>
                        <CustomTextField
                          fullWidth
                          value={item.uom || ''}
                          disabled
                          placeholder="Unit of Measure"
                        />
                      </Grid2>
                    </Grid2>
                    {item.description && (
                      <Grid2 container spacing={2} sx={{ mt: 1 }}>
                        <Grid2 size={{ xs: 12 }}>
                          <CustomFormLabel>Description</CustomFormLabel>
                          <CustomTextField
                            fullWidth
                            value={item.description}
                            disabled
                            placeholder="Description"
                            multiline
                            rows={2}
                          />
                        </Grid2>
                      </Grid2>
                    )}
                  </Box>
                </Grid2>
              ))}

            {/* VENDOR ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorId" sx={{ marginTop: 0 }}>
                Asset Vendor ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="vendorId"
                name="vendorId"
                value={data.vendorId?.vendorId || ''}
                placeholder="Asset Vendor ID"
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
                    placeholder="Enter Address"
                    disabled
                  />
                </Grid2>

                {/* VENDOR PRIORITY */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="vendorPriority" sx={{ marginTop: 0 }}>
                    Vendor Priority
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="vendorPriority"
                    name="vendorPriority"
                    value={formik.values.vendorPriority || ''}
                    placeholder="Enter Vendor Priority"
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
                placeholder="Enter Delivery Terms"
                disabled
              />
            </Grid2>

            {/* PREPARED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="preparedBy" sx={{ marginTop: 0 }}>
                Prepared By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="preparedBy"
                name="preparedBy"
                value={data.preparedBy?.fullName || ''}
                placeholder="Prepared By"
                disabled
              />
            </Grid2>

            {/* AUTHORIZED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="authorizedBy" sx={{ marginTop: 0 }}>
                Authorized By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="authorizedBy"
                name="authorizedBy"
                value={data.authorizedBy?.fullName || 'Not Authorized'}
                placeholder="Authorized By"
                disabled
              />
            </Grid2>

            {/* REJECTED BY */}
            {data.rejectedBy && (
              <>
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="rejectedBy" sx={{ marginTop: 0 }}>
                    Rejected By
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="rejectedBy"
                    name="rejectedBy"
                    value={data.rejectedBy?.fullName || ''}
                    placeholder="Rejected By"
                    disabled
                  />
                </Grid2>
              </>
            )}

            {/* SUPER ADMIN APPROVALS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="superAdminOne" sx={{ marginTop: 0 }}>
                Super Admin One
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                <Chip
                  label={formik.values.superAdminOne ? 'APPROVED' : 'PENDING'}
                  color={formik.values.superAdminOne ? 'success' : 'warning'}
                  variant="filled"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Grid2>

            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="superAdminTwo" sx={{ marginTop: 0 }}>
                Super Admin Two
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                <Chip
                  label={formik.values.superAdminTwo ? 'APPROVED' : 'PENDING'}
                  color={formik.values.superAdminTwo ? 'success' : 'warning'}
                  variant="filled"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
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

export default ViewAssetPurchaseOrder;
