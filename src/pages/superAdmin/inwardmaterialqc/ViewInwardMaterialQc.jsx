'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Autocomplete, Grid2 } from '@mui/material';
import { Box, Button, Chip, Typography, Paper, Divider } from '@mui/material';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { toast } from 'react-toastify';
import { searchPurchaseOrders } from '@/api/purchaseorder.api';
import { fetchMaterialInwardQcById, storeInwardMaterialQc } from '@/api/inwardMaterialQc.api';
import { useNavigate, useParams } from 'react-router-dom';
import InwardItemQc from './components/viewInwardItemQc';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ViewInwardMaterialQc = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/material-inward-qc`, title: 'Material Inward QC' },
    { title: 'View' },
  ];
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [mergedItems, setMergedItems] = useState([]); // Store merged items

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      items: [
        {
          code: '',
          quantityReceived: 0,
          quantityAccepted: 0,
        },
      ],
      totalAmount: '',
      inspectionStatus: '',
      inspectionRemarks: '',
      inspectedBy: '',
      inspectedDate: '',
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      items: Yup.array()
        .of(
          Yup.object().shape({
            code: Yup.string().required('Item Code is required'),
            quantityReceived: Yup.number()
              .required('Quantity Received is required')
              .min(1, 'Quantity must be at least 1'),
            quantityAccepted: Yup.number()
              .required('Quantity Accepted is required')
              .min(0, 'Quantity Accepted cannot be negative'),
          }),
        )
        .required('Items are required')
        .min(1, 'At least one item is required'),
      totalAmount: Yup.string().required('Total Amount is required'),
      inspectionStatus: Yup.string().required('Inspection Status is required'),
      inspectionRemarks: Yup.string().required('Inspection Remarks is required'),
      inspectedBy: Yup.string().required('Inspected By is required'),
      inspectedDate: Yup.date().required('Inspected Date is required'),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).map(([key, value]) => {
          if (key == 'items') {
            if (Array.isArray(value)) {
              const items = value.map((item, index) => {
                const stringifiedItem = JSON.stringify(item);
                formData.append(`items[${index}]`, stringifiedItem);
              });
            }
          } else {
            formData.append(key, value);
          }
        });

        const response = await storeInwardMaterialQc(formData);
        if (response) {
          toast.success('Inward Material QC completed');
          navigate(`/${userType}/inwardmaterialqc`);
        }
      } catch (error) {}
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/material-inward-qc`);
  };

  // Function to merge QC items with indent items
  const mergeItemsData = (qcItems, indentItems) => {
    console.log('🚀 ~ Merging items:', { qcItems, indentItems });

    if (!qcItems || !indentItems) return [];

    return indentItems.map((indentItem, index) => {
      // First try to find matching QC item by code ID
      let matchingQcItem = qcItems.find((qcItem) => {
        if (!qcItem.code) return false;

        const qcCodeId = typeof qcItem.code === 'object' ? qcItem.code._id : qcItem.code;
        const indentCodeId =
          typeof indentItem.code === 'object' ? indentItem.code._id : indentItem.code;

        return qcCodeId === indentCodeId;
      });

      // If no match found by code, try matching by index (fallback)
      if (!matchingQcItem && qcItems[index]) {
        matchingQcItem = qcItems[index];
        console.log(`🚀 ~ Using index-based matching for item ${index}`);
      }

      // Extract bomId from QC item or use indent code
      let bomId = '';
      if (matchingQcItem?.code?.bomId) {
        bomId = matchingQcItem.code.bomId;
      } else if (typeof indentItem.code === 'string') {
        bomId = indentItem.code;
      }

      // Create merged item with all required fields
      const mergedItem = {
        // From indent item
        code: indentItem.code,
        description: indentItem.description,
        quantity: indentItem.quantity,
        uom: indentItem.uom,
        _id: indentItem._id,

        // From QC item
        quantityReceived: matchingQcItem?.quantityReceived || 0,
        quantityAccepted: matchingQcItem?.quantityAccepted || 0,

        // Derived/combined fields
        bomId: bomId,
        qcItemId: matchingQcItem?._id,
        hasQcData: !!matchingQcItem,
      };

      console.log('🚀 ~ Merged item:', {
        index,
        indentCode: indentItem.code,
        qcCode: matchingQcItem?.code,
        result: mergedItem,
      });

      return mergedItem;
    });
  };

  const fetchData = async () => {
    try {
      const response = await fetchMaterialInwardQcById(id);
      console.log('🚀 ~ fetchData ~ response:', response);

      if (response) {
        setData(response.data);
        setPurchaseOrderData(response.data.purchaseOrderNumber);

        // Normalize items to array
        const qcItems = Array.isArray(response.data.items)
          ? response.data.items
          : response.data.items
          ? [response.data.items]
          : [];
        const indentItems = response.data.purchaseOrderNumber?.indentId?.items || [];
        const merged = mergeItemsData(qcItems, indentItems);

        console.log('🚀 ~ Merged items result:', merged);
        setMergedItems(merged);

        // Set form values
        formik.setValues({
          ...response.data,
          items: merged.map((item) => ({
            code: typeof item.code === 'object' ? item.code._id || item.code : item.code,
            quantityReceived: item.quantityReceived,
            quantityAccepted: item.quantityAccepted,
            description: item.description,
            quantity: item.quantity,
            uom: item.uom,
            bomId: item.bomId,
          })),
          purchaseOrderNumber: response.data.purchaseOrderNumber._id,
          inspectedDate: response.data.inspectedDate?.split('T')[0],
        });
      } else {
        toast(response.message);
      }
    } catch (error) {
      console.error('🚀 ~ fetchData error:', error);
      toast.error('Failed to fetch data');
    }
  };

  const fetchPurchaseOrderData = async () => {
    try {
      const response = await searchPurchaseOrders();
      if (response) {
        setPurchaseOrdersData(response);
      }
    } catch (error) {
      toast.error('Failed to fetch purchase order data');
    }
  };

  useEffect(() => {
    fetchData();
    fetchPurchaseOrderData();
  }, []);

  return (
    <PageContainer title="Admin - Material Inward QC" description="This is material inward qc page">
      <Breadcrumb title="Material Inward QC" items={BCrumb} />
      <ParentCard title="View Material Inward QC">
        <form action="" method="POST" onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* PURCHASE ORDER NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
                Purchase Order Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                options={purchaseOrdersData}
                autoHighlight
                getOptionLabel={(option) => option.purchaseOrderNumber}
                value={
                  purchaseOrdersData.find(
                    (item) => item._id === formik.values.purchaseOrderNumber,
                  ) || null
                }
                onChange={(event, newValue) => {
                  formik.setFieldValue(`purchaseOrderNumber`, newValue?._id || '');
                  setPurchaseOrderData(newValue);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Select Purchase Order Number"
                    aria-label="Select Purchase Order Number"
                    autoComplete="off"
                    name="purchaseOrderNumber"
                    disabled
                    error={
                      formik.touched.purchaseOrderNumber &&
                      Boolean(formik.errors.purchaseOrderNumber)
                    }
                    helperText={
                      formik.touched.purchaseOrderNumber && formik.errors.purchaseOrderNumber
                    }
                  />
                )}
              />
            </Grid2>

            {/* Show reportAttachment above images */}
            {data.reportAttachment && (
              <Box sx={{ mb: 2 }}>
                <a
                  href={data.reportAttachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={
                      <span role="img" aria-label="file">
                        📄
                      </span>
                    }
                  >
                    {data.reportAttachment.split('/').pop()}
                  </Button>
                </a>
              </Box>
            )}

            {/* Product Images */}
            <Grid2 size={{ xs: 12, lg: 12 }}>
              <ParentCard title="QC Images">
                {data.images && data.images.length > 0 ? (
                  <Grid2 container spacing={2}>
                    {data.images.map((image, index) => (
                      <Grid2 item key={index}>
                        <Box
                          sx={{
                            width: 150,
                            height: 150,
                            overflow: 'hidden',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0',
                            position: 'relative',
                            padding: '5px',
                          }}
                        >
                          {image ? (
                            <a href={image} target="_blank" rel="noopener noreferrer">
                              <img
                                src={image || '/placeholder.svg'}
                                alt={`Product image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder.svg';
                                }}
                              />
                            </a>
                          ) : (
                            <img
                              src={'/placeholder.svg'}
                              alt={`Product image ${index + 1}`}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                              }}
                            />
                          )}
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
            </Grid2>

            {purchaseOrdersData.find(
              (purchaseOrder) => purchaseOrder?._id == formik.values.purchaseOrderNumber,
            )?._id && (
              <>
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
                  <CustomTextField
                    fullWidth
                    id="indentId"
                    name="indentId"
                    disabled
                    value={purchaseOrderData?.indentId?.indentId}
                  />
                </Grid2>

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
                  <CustomTextField
                    fullWidth
                    id="vendorId"
                    name="vendorId"
                    value={purchaseOrderData?.vendorId?.vendorId}
                    disabled
                  />
                </Grid2>

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
                    value={purchaseOrderData?.vendorId?.vendorName}
                    disabled
                  />
                </Grid2>

                {/* RENDER MERGED ITEMS */}
                {mergedItems.length > 0 &&
                  mergedItems.map((item, index) => {
                    return (
                      <InwardItemQc
                        item={item} // Pass the merged item with QC data
                        formik={formik}
                        index={index}
                        key={index}
                        disable={true}
                      />
                    );
                  })}
              </>
            )}

            {/* TOTAL AMOUNT */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="totalAmount" sx={{ marginTop: 0 }}>
                Total Amount
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="totalAmount"
                name="totalAmount"
                type="number"
                disabled
                value={formik.values.totalAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Total Amount"
                error={formik.touched.totalAmount && Boolean(formik.errors.totalAmount)}
                helperText={formik.touched.totalAmount && formik.errors.totalAmount}
              />
            </Grid2>

            {/* INSPECTION STATUS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="inspectionStatus" sx={{ marginTop: 0 }}>
                Inspection Status
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="inspectionStatus"
                name="inspectionStatus"
                disabled
                value={formik.values.inspectionStatus}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Inspection Status"
                error={formik.touched.inspectionStatus && Boolean(formik.errors.inspectionStatus)}
                helperText={formik.touched.inspectionStatus && formik.errors.inspectionStatus}
              />
            </Grid2>

            {/* INSPECTION REMARKS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="inspectionRemarks" sx={{ marginTop: 0 }}>
                Inspection Remarks
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="inspectionRemarks"
                name="inspectionRemarks"
                disabled
                value={formik.values.inspectionRemarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Inspection Remarks"
                error={formik.touched.inspectionRemarks && Boolean(formik.errors.inspectionRemarks)}
                helperText={formik.touched.inspectionRemarks && formik.errors.inspectionRemarks}
              />
            </Grid2>

            {/* INSPECTED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="inspectedBy" sx={{ marginTop: 0 }}>
                Inspected By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="inspectedBy"
                name="inspectedBy"
                disabled
                value={formik.values.inspectedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Inspected By"
                error={formik.touched.inspectedBy && Boolean(formik.errors.inspectedBy)}
                helperText={formik.touched.inspectedBy && formik.errors.inspectedBy}
              />
            </Grid2>

            {/* INSPECTED DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="inspectedDate" sx={{ marginTop: 0 }}>
                Inspected Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="inspectedDate"
                name="inspectedDate"
                type="date"
                disabled
                value={formik.values.inspectedDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Inspected Date"
                error={formik.touched.inspectedDate && Boolean(formik.errors.inspectedDate)}
                helperText={formik.touched.inspectedDate && formik.errors.inspectedDate}
              />
            </Grid2>
          </Grid2>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewInwardMaterialQc;
