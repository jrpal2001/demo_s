import { useState, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Autocomplete, Box, Button, Grid2, Paper, Typography, Divider } from '@mui/material';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { searchPurchaseIndent, updatePurchaseIndent } from '@/api/purchaseindent.api';
import { searchByVendorId } from '@/api/vendor.api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPurchaseOrderById,
  storePurchaseOrder,
  updatePurchaseOrder,
} from '@/api/purchaseorder.api';
import EditPurchaseItem from '../purchaseindent/components/EditPurchaseItem';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState({});
  const [purchaseIndentData, setPurchaseIndentData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [vendorId, setvendorId] = useState('');
  const [indentId, setindentId] = useState('');
  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      quotationNumber: '',
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
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      quotationNumber: Yup.string().required('quotation Number is required'),
      indentId: Yup.string().required('Indent ID is required'),
      vendorId: Yup.string().required('Vendor ID is required'),
      gst: Yup.string().required('GST is required'),
      discount: Yup.string().required('Discount is required'),
      grandTotal: Yup.string().required('Grand Total is required'),
      paymentTerms: Yup.string().required('Payment Terms is required'),
      freightTerms: Yup.string().required('Freight Terms is required'),
      deliveryAddress: Yup.string().required('Delivery Address is required'),
      deliveryTerms: Yup.string().required('Delivery Terms is required'),
      items: Yup.array()
        .of(
          Yup.object({
            code: Yup.mixed().required('Code is required'),
            orderQuantity: Yup.number().required('Order Quantity is required'),
            // ...other fields as needed
          }),
        )
        .min(1, 'At least one item is required')
        .required('Items are required'),
    }),
    onSubmit: async (values) => {
      try {
        // Remove _id from each item
        const cleanedItems = values.items.map(({ _id, ...rest }) => rest);

        // Remove unwanted fields from the payload
        const { vendorName, address, vendorPriority, _id, __v, ...restValues } = values;

        const payload = { ...restValues, items: cleanedItems };

        const response = await updatePurchaseOrder(id, payload);
        if (response) {
          toast.success('Purchase order updated');
          navigate(`/${userType}/purchaseorder`);
        } else {
          toast.error('Failed to update purchase order');
        }
      } catch (error) {
        toast.error('Failed to update purchase order');
      }
    },
  });

  const calculatedTotals = useMemo(() => {
    if (!formik.values.items || formik.values.items.length === 0) {
      return {
        subtotal: 0,
        gstAmount: 0,
        discountAmount: 0,
        suggestedTotal: 0,
        itemBreakdown: [],
      };
    }

    let subtotal = 0;
    const itemBreakdown = [];

    formik.values.items.forEach((item, index) => {
      const quantity = Number.parseFloat(item.orderQuantity) || 0;
      const unitPrice = Number.parseFloat(item.code?.price) || 0;
      const itemTotal = quantity * unitPrice;

      if (itemTotal > 0) {
        itemBreakdown.push({
          index,
          name:
            item.code?.fabricName ||
            item.code?.trimsName ||
            item.code?.accessoriesName ||
            'Unknown Item',
          quantity,
          unitPrice,
          total: itemTotal,
        });
        subtotal += itemTotal;
      }
    });

    const gstRate = Number.parseFloat(formik.values.gst) || 0;
    const gstAmount = (subtotal * gstRate) / 100;

    const discountRate = Number.parseFloat(formik.values.discount) || 0;
    const discountAmount = (subtotal * discountRate) / 100;

    const suggestedTotal = subtotal + gstAmount - discountAmount;

    return {
      subtotal,
      gstAmount,
      discountAmount,
      suggestedTotal,
      itemBreakdown,
    };
  }, [formik.values.items, formik.values.gst, formik.values.discount]);

  useEffect(() => {
    const suggested = calculatedTotals.suggestedTotal.toFixed(2);
    if (formik.values.grandTotal !== suggested) {
      formik.setFieldValue('grandTotal', suggested);
    }
    // eslint-disable-next-line
  }, [calculatedTotals.suggestedTotal]);

  const handleUseSuggestedTotal = () => {
    formik.setFieldValue('grandTotal', calculatedTotals.suggestedTotal.toFixed(2));
  };

  const fetchData = async () => {
    try {
      const response = await fetchPurchaseOrderById(id);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setindentId(response?.indentId?.indentId);
        setvendorId(response?.vendorId?.vendorId);
        // Map the nested response to flat structure for the form
        const mappedData = {
          purchaseOrderNumber: response.purchaseOrderNumber || '',
          indentId: response.indentId?._id || '',
          items: response?.items || [],
          vendorId: response.vendorId?._id || '',
          vendorName: response.vendorId?.vendorName || '',
          address: response.vendorId?.address || '',
          vendorPriority: response.vendorId?.vendorPriority || '',
          gst: response.gst || '',
          discount: response.discount || '',
          grandTotal: response.grandTotal || '',
          paymentTerms: response.paymentTerms || '',
          freightTerms: response.freightTerms || '',
          deliveryAddress: response.deliveryAddress || '',
          deliveryTerms: response.deliveryTerms || '',
          quotationNumber: response.quotationNumber || '',
        };

        formik.setValues(mappedData);
        setData(mappedData);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const fetchIndentData = async () => {
    try {
      const response = await searchPurchaseIndent();
      if (response) {
        setPurchaseIndentData(response.data);
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      toast.error("Purchase indent couldn't be fetched");
    }
  };

  const fetchVendorData = async () => {
    try {
      let response = await searchByVendorId();
      if (response) {
        setVendorData(response?.data.vendors);
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      toast.error("Vendors data couldn't be fetched");
    }
  };

  const handleClickCancel = () => {
    formik.resetForm();
    navigate(`/${userType}/purchaseorder`);
  };

  useEffect(() => {
    fetchData();
    fetchIndentData();
    fetchVendorData();
  }, []);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/purchaseorder`, title: 'Purchase Order' },
    { title: 'Edit' },
  ];

  return (
    <PageContainer title="Admin - Purchase Order" description="This is the purchase order page">
      <Breadcrumb title="Purchase Order" items={BCrumb} />
      <ParentCard title="Edit Purchase Order">
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
                error={
                  formik.touched.purchaseOrderNumber && Boolean(formik.errors.purchaseOrderNumber)
                }
                helperText={formik.touched.purchaseOrderNumber && formik.errors.purchaseOrderNumber}
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
                error={formik.touched.quotationNumber && Boolean(formik.errors.quotationNumber)}
                helperText={formik.touched.quotationNumber && formik.errors.quotationNumber}
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
                options={purchaseIndentData}
                autoHighlight
                getOptionLabel={(option) => option.indentId}
                // Fix: Find the selected option by matching the _id with formik.values.indentId
                value={
                  purchaseIndentData.find((item) => item._id === formik.values.indentId) || null
                }
                // 2️⃣ Update Formik when user selects an option
                onChange={(event, newValue) => {
                  formik.setFieldValue(`indentId`, newValue?._id || '');
                  formik.setFieldValue(`items`, newValue?.items || []);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select New Indent ID"
                    aria-label="Select New Indent ID"
                    autoComplete="off"
                    name="indentId"
                    error={formik.touched.indentId && Boolean(formik.errors.indentId)}
                    helperText={formik.touched.indentId && formik.errors.indentId}
                  />
                )}
              />
            </Grid2>
            {formik.values.items &&
              formik.values.items?.map((item, index) => {
                return (
                  <EditPurchaseItem formik={formik} index={index} key={index} disable={true} />
                );
              })}

            {/* VENDOR ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', mt: 4, mx: 0, mb: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="vendorId" sx={{ marginTop: 0 }}>
                Vendor ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                options={vendorData}
                autoHighlight
                getOptionLabel={(option) => option.vendorId}
                // Fix: Find the selected option by matching the _id with formik.values.vendorId
                value={vendorData.find((item) => item._id === formik.values.vendorId) || null}
                // 2️⃣ Update Formik when user selects an option
                onChange={(event, newValue) => {
                  formik.setFieldValue(`vendorId`, newValue?._id || '');
                  formik.setFieldValue(`vendorName`, newValue?.vendorName || '');
                  formik.setFieldValue(`address`, newValue?.address || '');
                  formik.setFieldValue(`vendorPriority`, newValue?.vendorPriority || '');
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Vendor ID"
                    aria-label="Select Vendor ID"
                    autoComplete="off"
                    name="vendorId"
                    error={formik.touched.vendorId && Boolean(formik.errors.vendorId)}
                    helperText={formik.touched.vendorId && formik.errors.vendorId}
                  />
                )}
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
                    disabled
                    value={formik.values.vendorName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Vendor Name"
                    error={formik.touched.vendorName && Boolean(formik.errors.vendorName)}
                    helperText={formik.touched.vendorName && formik.errors.vendorName}
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
                    disabled
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Address"
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
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
                    disabled
                    value={formik.values.vendorPriority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Vendor Priority"
                    error={formik.touched.vendorPriority && Boolean(formik.errors.vendorPriority)}
                    helperText={formik.touched.vendorPriority && formik.errors.vendorPriority}
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
                error={formik.touched.gst && Boolean(formik.errors.gst)}
                helperText={formik.touched.gst && formik.errors.gst}
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
                error={formik.touched.discount && Boolean(formik.errors.discount)}
                helperText={formik.touched.discount && formik.errors.discount}
              />
            </Grid2>

            {calculatedTotals.itemBreakdown.length > 0 && (
              <Grid2 size={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    mt: 2,
                    mb: 2,
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}
                  >
                    💰 Order Calculation Summary
                  </Typography>

                  {/* Item Breakdown */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Item Breakdown:
                    </Typography>
                    {calculatedTotals.itemBreakdown.map((item, index) => (
                      <Box
                        key={index}
                        sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}
                      >
                        <Typography variant="body2">
                          {item.name} ({item.quantity} × ₹{item.unitPrice.toFixed(2)})
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          ₹{item.total.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Calculation Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ₹{calculatedTotals.subtotal.toFixed(2)}
                      </Typography>
                    </Box>

                    {formik.values.gst && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">GST ({formik.values.gst}%):</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                          +₹{calculatedTotals.gstAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}

                    {formik.values.discount && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          Discount ({formik.values.discount}%):
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 'bold', color: 'success.main' }}
                        >
                          -₹{calculatedTotals.discountAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 1 }} />

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Suggested Total:
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ₹{calculatedTotals.suggestedTotal.toFixed(2)}
                        </Typography>
                        <Button variant="outlined" size="small" onClick={handleUseSuggestedTotal}>
                          Use This Amount
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid2>
            )}

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
                error={formik.touched.grandTotal && Boolean(formik.errors.grandTotal)}
                helperText={formik.touched.grandTotal && formik.errors.grandTotal}
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
                error={formik.touched.paymentTerms && Boolean(formik.errors.paymentTerms)}
                helperText={formik.touched.paymentTerms && formik.errors.paymentTerms}
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
                error={formik.touched.freightTerms && Boolean(formik.errors.freightTerms)}
                helperText={formik.touched.freightTerms && formik.errors.freightTerms}
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
                error={formik.touched.deliveryAddress && Boolean(formik.errors.deliveryAddress)}
                helperText={formik.touched.deliveryAddress && formik.errors.deliveryAddress}
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
                error={formik.touched.deliveryTerms && Boolean(formik.errors.deliveryTerms)}
                helperText={formik.touched.deliveryTerms && formik.errors.deliveryTerms}
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
            <Button type="submit" sx={{ marginRight: '0.5rem' }}>
              Submit
            </Button>
            <Button type="reset" onClick={handleClickCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EditPurchaseOrder;
