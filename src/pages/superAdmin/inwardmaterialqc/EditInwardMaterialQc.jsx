'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Autocomplete, Box, Button, Grid2, MenuItem, IconButton, Chip } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { toast } from 'react-toastify';
import { searchPurchaseOrders } from '@/api/purchaseorder.api';
import InwardItemQc from './components/InwardItemQc';
import { fetchMaterialInwardQcById, updateInwardMaterialQc } from '@/api/inwardMaterialQc.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditInwardMaterialQc = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/material-inward-qc`, title: 'Material Inward QC' },
    { title: 'Edit' },
  ];
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState({});
  const [mergedItems, setMergedItems] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      invoiceNumber: '',
      lotNumber: '',
      debitNote: '',
      remark: '',
      items: [
        {
          code: '',
          quantityReceived: 0,
          quantityAccepted: 0,
        },
      ],
      totalAmount: '',
      inspectionStatus: 'default',
      inspectionRemarks: '',
      inspectedBy: '',
      inspectedDate: '',
      images: [],
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      invoiceNumber: Yup.string().required('Invoice Number is required'),
      lotNumber: Yup.string().required('Lot Number is required'),
      debitNote: Yup.string().required('Debit Note is required'),
      remark: Yup.string().required('Remark is required'),
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
        setIsUploading(true);
        const formData = new FormData();

        // Always include required fields, even if unchanged
        const requiredFields = [
          'purchaseOrderNumber',
          'invoiceNumber',
          'lotNumber',
          'debitNote',
          'remark',
          'totalAmount',
          'inspectionStatus',
          'inspectionRemarks',
          'inspectedBy',
          'inspectedDate',
        ];

        // Add required fields (always include these)
        requiredFields.forEach((field) => {
          formData.append(field, values[field]);
        });

        // Add existing images that weren't removed
        existingImages.forEach((imageUrl) => {
          formData.append('existingImages', imageUrl);
        });

        // Add new image files
        newImages.forEach((file) => {
          formData.append('images', file);
        });

        // Always include items array
        values.items.forEach((item, index) => {
          const stringifiedItem = JSON.stringify(item);
          formData.append(`items[${index}]`, stringifiedItem);
        });

        console.log('🚀 ~ Submitting form data...');
        console.log('🚀 ~ onSubmit: ~ formData:', formData);
        const response = await updateInwardMaterialQc(id, formData);

        if (response) {
          toast.success('Material Inward QC updated successfully');
          navigate(`/${userType}/material-inward-qc`);
        }
      } catch (error) {
        console.error('🚀 ~ Update error:', error);
        toast.error('Material Inward QC update failed: ' + (error.message || 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    },
  });

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
        quantity: indentItem.orderQuantity,
        uom: indentItem.uom,
        _id: indentItem._id,

        // From QC item
        quantityReceived: matchingQcItem?.quantityReceived || 0,
        quantityAccepted: matchingQcItem?.quantityAccepted || 0,

        // Derived/combined fields
        bomId: bomId,
        qcItemId: matchingQcItem?._id,
        hasQcData: !!matchingQcItem,
        orderQuantity: indentItem.quantity,
      };

      return mergedItem;
    });
  };

  const handleClickImagesChange = (event) => {
    const files = Array.from(event.currentTarget.files);
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setNewImages([...newImages, ...files]);
      setNewImagePreviews([...newImagePreviews, ...previewUrls]);
      event.target.value = '';
    }
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const removeNewImage = (index) => {
    const updatedFiles = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImages(updatedFiles);
    setNewImagePreviews(updatedPreviews);
  };

  const handleClickCancel = () => {
    newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    navigate(`/${userType}/material-inward-qc`);
  };

  const fetchData = async () => {
    try {
      const response = await fetchMaterialInwardQcById(id);
      console.log('🚀 ~ fetchData ~ response:', response);

      if (response) {
        setData(response.data);
        setPurchaseOrderData(response.data.purchaseOrderNumber);

        // Handle existing images
        if (response.data.images && response.data.images.length > 0) {
          setExistingImages(response.data.images);
        }

        // Merge QC items with indent items
        const qcItems = response.data.items || [];
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
            quantity: item.orderQuantity,
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
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <PageContainer title="Admin - Material Inward QC" description="This is material inward qc page">
      <Breadcrumb title="Material Inward QC" items={BCrumb} />
      <ParentCard title="Edit Material Inward QC">
        <form action="" method="POST" onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* EXISTING IMAGES */}
            {existingImages.length > 0 && (
              <Grid2 size={12}>
                <CustomFormLabel>Current QC Images</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {existingImages.map((imageUrl, index) => (
                    <Box key={`existing-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={imageUrl || '/placeholder.svg'}
                        alt={`existing-qc-${index}`}
                        style={{
                          height: '100px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '2px solid #e0e0e0',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeExistingImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Chip
                        label="Current"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          fontSize: '10px',
                          height: '16px',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {/* NEW IMAGES */}
            {newImagePreviews.length > 0 && (
              <Grid2 size={12}>
                <CustomFormLabel>New QC Images to Upload</CustomFormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {newImagePreviews.map((previewUrl, index) => (
                    <Box key={`new-${index}`} sx={{ position: 'relative' }}>
                      <img
                        src={previewUrl || '/placeholder.svg'}
                        alt={`new-qc-${index}`}
                        style={{
                          height: '100px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '2px solid #4caf50',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeNewImage(index)}
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': { backgroundColor: 'error.dark' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Chip
                        label="New"
                        size="small"
                        color="success"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          fontSize: '10px',
                          height: '16px',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Grid2>
            )}

            {/* ADD NEW IMAGES */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="images">
                {existingImages.length > 0 ? 'Add More QC Images' : 'Choose QC Images'}
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  padding: '16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: '#999' },
                  backgroundColor: '#f9f9f9',
                }}
              >
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  onChange={handleClickImagesChange}
                  onBlur={formik.handleBlur}
                  style={{
                    display: 'block',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
                <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                  <AddIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  {existingImages.length > 0
                    ? 'Click to add more QC images'
                    : 'Click to select or drag and drop QC images here'}
                </Box>
              </Box>
            </Grid2>

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

                {/* INVOICE NUMBER */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="invoiceNumber" sx={{ marginTop: 0 }}>
                    Invoice Number
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formik.values.invoiceNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Invoice Number"
                    error={formik.touched.invoiceNumber && Boolean(formik.errors.invoiceNumber)}
                    helperText={formik.touched.invoiceNumber && formik.errors.invoiceNumber}
                  />
                </Grid2>

                {/* LOT NUMBER */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="lotNumber" sx={{ marginTop: 0 }}>
                    Lot Number
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="lotNumber"
                    name="lotNumber"
                    value={formik.values.lotNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Lot Number"
                    error={formik.touched.lotNumber && Boolean(formik.errors.lotNumber)}
                    helperText={formik.touched.lotNumber && formik.errors.lotNumber}
                  />
                </Grid2>

                {/* DEBIT NOTE */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="debitNote" sx={{ marginTop: 0 }}>
                    Debit Note
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="debitNote"
                    name="debitNote"
                    value={formik.values.debitNote}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Debit Note"
                    error={formik.touched.debitNote && Boolean(formik.errors.debitNote)}
                    helperText={formik.touched.debitNote && formik.errors.debitNote}
                  />
                </Grid2>

                {/* REMARK */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
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
                    value={formik.values.remark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Remark"
                    error={formik.touched.remark && Boolean(formik.errors.remark)}
                    helperText={formik.touched.remark && formik.errors.remark}
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
                        disable={false} // Enable editing
                      />
                    );
                  })}

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
                  <CustomSelect
                    fullWidth
                    id="inspectionStatus"
                    name="inspectionStatus"
                    value={formik.values.inspectionStatus}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.inspectionStatus && Boolean(formik.errors.inspectionStatus)
                    }
                    helperText={formik.touched.inspectionStatus && formik.errors.inspectionStatus}
                  >
                    <MenuItem value="default" disabled>
                      Select Inspection Status
                    </MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </CustomSelect>
                  {formik.touched.inspectionStatus && formik.errors.inspectionStatus && (
                    <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                      Please Select The Inspection Status
                    </p>
                  )}
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
                    value={formik.values.inspectionRemarks}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Inspection Remarks"
                    error={
                      formik.touched.inspectionRemarks && Boolean(formik.errors.inspectionRemarks)
                    }
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
                    value={formik.values.inspectedDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Inspected Date"
                    error={formik.touched.inspectedDate && Boolean(formik.errors.inspectedDate)}
                    helperText={formik.touched.inspectedDate && formik.errors.inspectedDate}
                  />
                </Grid2>
              </>
            )}
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
            <Button type="submit" sx={{ marginRight: '0.5rem' }} disabled={isUploading}>
              {isUploading ? 'Updating...' : 'Update QC'}
            </Button>
            <Button type="button" onClick={handleClickCancel} disabled={isUploading}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EditInwardMaterialQc;
