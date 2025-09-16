'use client';

import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { Autocomplete, Box, Button, Grid2 } from '@mui/material';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { storeAssetPurchaseOrder } from '@/api/assetpurchaseorder.api';
import { searchAssetIndent } from '@/api/assetIndent';
import { assetVendorSearch } from '@/api/assetvendor';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateAssetPurchaseOrder = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/assetpurchaseorder`, title: 'Asset Purchase Order' },
    { title: 'Create' },
  ];

  const navigate = useNavigate();
  const [assetIndentData, setAssetIndentData] = useState([]);
  const [vendorData, setVendorData] = useState([]);
  const [searchParams, setSearchParams] = useState('');

  // Helper function to get display code for item
  const getItemDisplayCode = (item) => {
    // First check if we have codeDetails from purchase order population
    if (item.codeDetails?.mainAssetId) return item.codeDetails.mainAssetId;
    if (item.codeDetails?.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
    if (item.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;

    // Then check if we have itemDetails from indent population
    if (item.itemDetails?.mainAssetId) return item.itemDetails.mainAssetId;
    if (item.itemDetails?.mainMaintenanceId) return item.itemDetails.mainMaintenanceId;
    if (item.itemDetails?.mainItemCode) return item.itemDetails.mainItemCode;

    // Check direct properties from indent search
    if (item.mainAssetId) return item.mainAssetId;
    if (item.mainMaintenanceId) return item.mainMaintenanceId;
    if (item.mainItemCode) return item.mainItemCode;

    return item._id || item.code || 'N/A';
  };

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
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      indentId: Yup.string().required('Indent ID is required'),
      vendorId: Yup.string().required('Vendor ID is required'),
      gst: Yup.string().required('GST is required'),
      discount: Yup.string().required('Discount is required'),
      grandTotal: Yup.string().required('Grand Total is required'),
      paymentTerms: Yup.string().required('Payment Terms is required'),
      freightTerms: Yup.string().required('Freight Terms is required'),
      deliveryAddress: Yup.string().required('Delivery Address is required'),
      deliveryTerms: Yup.string().required('Delivery Terms is required'),
      items: Yup.array().min(1, 'At least one item is required'),
    }),
    onSubmit: async (values) => {
      try {
        // Transform items to send _id as code to backend
        const transformedItems = values.items.map((item) => ({
          code: item._id || item.code, // Send _id as code
          model: item.model,
          description: item.description,
          orderQuantity: item.orderQuantity,
          indentQuantity: item.quantity || item.indentQuantity, // Use quantity from indent as indentQuantity
          uom: item.uom,
        }));

        console.log('🚀 ~ Original items:', values.items);
        console.log('🚀 ~ Transformed items:', transformedItems);

        const payload = {
          ...values,
          items: transformedItems,
        };

        // Remove fields that shouldn't be sent to backend
        delete payload.vendorName;
        delete payload.address;
        delete payload.vendorPriority;

        console.log('🚀 ~ onSubmit: ~ payload:', payload);

        const response = await storeAssetPurchaseOrder(payload);
        if (response) {
          toast.success('Asset purchase order created');
          navigate(`/${userType}/assetpurchaseorder`);
        } else {
          toast.error('Failed to create asset purchase order');
        }
      } catch (error) {
        console.error('Error creating purchase order:', error);
        toast.error('Failed to create asset purchase order');
      }
    },
  });

  const fetchIndentData = async (searchParams) => {
    try {
      const response = await searchAssetIndent(searchParams);
      console.log('🚀 ~ fetchIndentData ~ response:', response);
      if (response) {
        setAssetIndentData(response);
      } else {
        toast.warning('No asset indents found');
      }
    } catch (error) {
      toast.error("Asset indent couldn't be fetched");
    }
  };

  const fetchVendorData = async () => {
    try {
      const response = await assetVendorSearch(10, '');
      if (response) {
        setVendorData(response.vendors);
      } else {
        toast.warning('No vendors found');
      }
    } catch (error) {
      toast.error("Vendors data couldn't be fetched");
    }
  };

  const handleClickCancel = () => {
    formik.resetForm();
    navigate(`/${userType}/assetpurchaseorder`);
  };

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ searchParams:', searchParams);
    fetchIndentData(searchParams);
    fetchVendorData();
  }, []);

  useEffect(() => {
    fetchIndentData(searchParams);
  }, [searchParams]);

  return (
    <PageContainer
      title="Admin - Asset Purchase Order"
      description="This is the asset purchase order page"
    >
      <Breadcrumb title="Asset Purchase Order" items={BCrumb} />
      <ParentCard title="Create Asset Purchase Order">
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Asset Purchase Order Number"
                error={
                  formik.touched.purchaseOrderNumber && Boolean(formik.errors.purchaseOrderNumber)
                }
                helperText={formik.touched.purchaseOrderNumber && formik.errors.purchaseOrderNumber}
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
              <Autocomplete
                options={assetIndentData}
                autoHighlight
                getOptionLabel={(option) => option.indentId || ''}
                value={assetIndentData?.find((item) => item._id === formik.values.indentId) || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`indentId`, newValue?._id || '');
                  // Transform items to include display codes and preserve all necessary data
                  const transformedItems =
                    newValue?.items?.map((item) => ({
                      ...item,
                      _id: item.code, // Preserve the original code as _id for later use
                      displayCode: getItemDisplayCode(item),
                      // Preserve the populated data structure from indent search
                      codeDetails: item.itemDetails || null,
                      // Map the mainAssetId from indent search response
                      mainAssetId:
                        item.mainAssetId ||
                        item.itemDetails?.mainAssetId ||
                        item.itemDetails?.mainMaintenanceId ||
                        item.itemDetails?.mainItemCode ||
                        null,
                    })) || [];
                  console.log('🚀 ~ Transformed items from indent:', transformedItems);
                  formik.setFieldValue(`items`, transformedItems);
                }}
                onInputChange={(event, newInputValue) => {
                  setSearchParams(newInputValue);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Asset Indent ID"
                    aria-label="Select Asset Indent ID"
                    autoComplete="off"
                    name="IndentId"
                    error={formik.touched.indentId && Boolean(formik.errors.indentId)}
                    helperText={formik.touched.indentId && formik.errors.indentId}
                  />
                )}
              />
            </Grid2>

            {/* ITEMS DISPLAY */}
            {formik.values.items &&
              formik.values.items?.map((item, index) => {
                return (
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
                            value={item.quantity || ''}
                            disabled
                            placeholder="Request Quantity"
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 2.4 }}>
                          <CustomFormLabel>Order Quantity</CustomFormLabel>
                          <CustomTextField
                            fullWidth
                            type="number"
                            value={item.orderQuantity || ''}
                            onChange={(e) => {
                              const updatedItems = [...formik.values.items];
                              updatedItems[index].orderQuantity = Number(e.target.value);
                              formik.setFieldValue('items', updatedItems);
                            }}
                            placeholder="Order Quantity"
                          />
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 2.4 }}>
                          <CustomFormLabel>UOM</CustomFormLabel>
                          <CustomTextField
                            fullWidth
                            value={item.uom || ''}
                            onChange={(e) => {
                              const updatedItems = [...formik.values.items];
                              updatedItems[index].uom = e.target.value;
                              formik.setFieldValue('items', updatedItems);
                            }}
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
                              value={item.description || ''}
                              onChange={(e) => {
                                const updatedItems = [...formik.values.items];
                                updatedItems[index].description = e.target.value;
                                formik.setFieldValue('items', updatedItems);
                              }}
                              placeholder="Description"
                              multiline
                              rows={2}
                            />
                          </Grid2>
                        </Grid2>
                      )}
                    </Box>
                  </Grid2>
                );
              })}

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
              <Autocomplete
                options={vendorData}
                autoHighlight
                getOptionLabel={(option) => option.vendorId || ''}
                value={vendorData?.find((item) => item._id === formik.values.vendorId) || null}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`vendorId`, newValue?._id || '');
                  formik.setFieldValue(`vendorName`, newValue?.vendorName || '');
                  formik.setFieldValue(`address`, newValue?.address || '');
                  formik.setFieldValue(`vendorPriority`, newValue?.vendorPriority || '');
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Asset Vendor ID"
                    aria-label="Select Asset Vendor ID"
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
                    placeholder="Enter Vendor Name"
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
                    placeholder="Enter Address"
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
                    placeholder="Enter Vendor Priority"
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

export default CreateAssetPurchaseOrder;
