'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Autocomplete, Box, Button, Grid2, MenuItem } from '@mui/material';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { toast } from 'react-toastify';
import { searchPurchaseOrders } from '@/api/purchaseorder.api';
import InwardItemQc from './components/InwardItemQc';
import { storeInwardMaterialQc } from '@/api/inwardMaterialQc.api';
import { useNavigate } from 'react-router-dom';
// Import multiple image upload components - FIXED IMPORT
import { useMultipleImageUpload, MultipleImageUpload } from '@/utils/imageupload';
import SingleFileUpload from '@/utils/imageupload/components/singleFileUpload';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateInwardMaterialQc = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/inwardmaterialqc`, title: 'Material Inward QC' },
    { title: 'Create' },
  ];
  const navigate = useNavigate();
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [reportFile, setReportFile] = useState(null);
  const [reportFileName, setReportFileName] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  const handleReportFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setReportError(null);
      setReportFile(file);
      setReportFileName(file.name);
      formik.setFieldValue('reportAttachment', file);
    }
  };

  const handleClearReportFile = () => {
    setReportFile(null);
    setReportFileName('');
    setReportError(null);
    formik.setFieldValue('reportAttachment', null);
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      invoiceNumber: '',
      lotNumber: '',
      debitNote: '',
      remark: '',
      items: [],
      totalAmount: '',
      inspectionStatus: 'default',
      inspectionRemarks: '',
      inspectedBy: '',
      inspectedDate: '',
      images: [],
      reportAttachment: null,
    },
    onSubmit: async (values) => {
      console.log('onSubmit called!', values);
      try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (key === 'items') {
            if (Array.isArray(value) && value.length > 0) {
              const itemsArray = values.items.map(
                ({ code, quantityReceived, quantityAccepted }) => ({
                  code,
                  quantityReceived,
                  quantityAccepted,
                }),
              );
              formData.append('items', JSON.stringify(itemsArray));
            }
          } else if (key === 'images') {
            if (Array.isArray(value)) {
              value.forEach((file) => {
                if (file instanceof File) {
                  console.log('🚀 ~ Appending file to FormData:', file.name, file.size);
                  formData.append('images', file);
                  console.log('Appended to FormData: images =', file.name);
                }
              });
            }
            return;
          } else {
            formData.append(key, value);
            console.log(`Appended to FormData: ${key} =`, value);
          }
        });

        if (values.reportAttachment && values.reportAttachment instanceof File) {
          console.log(
            '🚀 ~ Appending report file to FormData:',
            values.reportAttachment.name,
            values.reportAttachment.size,
          );
          formData.append('reportAttachment', values.reportAttachment);
          console.log('Appended to FormData: reportAttachment =', values.reportAttachment.name);
        }

        console.log('🚀 ~ FormData contents:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        const response = await storeInwardMaterialQc(formData);
        if (response) {
          toast.success('Inward Material QC completed');
          resetImages();
          navigate(`/${userType}/material-inward-qc`);
        }
      } catch (error) {
        console.log('🚀 ~ Frontend error:', error.message);
        toast.error('Failed to create Material Inward QC');
      }
    },
  });

  const {
    images,
    isLoading: imageLoading,
    errors: imageErrors,
    addImages,
    removeImage,
    clearAllImages,
    resetImages,
    canAddMore,
    remainingSlots,
  } = useMultipleImageUpload(
    (files) => formik.setFieldValue('images', files),
    {
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    },
    10,
  );

  const handleClickCancel = () => {
    navigate(`/${userType}/material-inward-qc`);
  };

  const handleSearchPurchaseOrders = async (searchText) => {
    try {
      if (searchText && searchText.trim() !== '') {
        const response = await searchPurchaseOrders(searchText);
        if (response) {
          setPurchaseOrdersData(response);
        }
      } else {
        fetchPurchaseOrderData();
      }
    } catch (error) {
      console.error('Error searching purchase orders:', error);
      toast.error('Failed to search purchase orders');
    }
  };

  const fetchPurchaseOrderData = async () => {
    try {
      const response = await searchPurchaseOrders('');
      console.log('🚀 ~ fetchPurchaseOrderData ~ response:', response);
      if (response) {
        setPurchaseOrdersData(response);
      }
    } catch (error) {
      toast.error('Failed to fetch purchase order data');
    }
  };

  useEffect(() => {
    fetchPurchaseOrderData();
  }, []);

  return (
    <PageContainer title="Admin - Material Inward QC" description="This is material inward qc page">
      <Breadcrumb title="Material Inward QC" items={BCrumb} />
      <ParentCard title="Create Material Inward QC">
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
                  setPurchaseOrderData(newValue);
                  formik.setFieldValue('purchaseOrderNumber', newValue?._id || '');
                  formik.setFieldValue(
                    'items',
                    (newValue?.items || []).map((item) => ({
                      code: item.code?._id || '',
                      quantityReceived: 0,
                      quantityAccepted: 0,
                    })),
                  );
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  handleSearchPurchaseOrders(newInputValue);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Search Purchase Order Number"
                    aria-label="Search Purchase Order Number"
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

                {/* RENDER QC FIELDS FOR ALL ITEMS */}
                {purchaseOrderData.items &&
                  purchaseOrderData.items.map((poItem, index) => (
                    <InwardItemQc
                      item={poItem} // full PO item for display
                      formik={formik}
                      index={index}
                      key={poItem.code?._id || poItem.code}
                    />
                  ))}

                {/* MULTIPLE IMAGE UPLOAD */}
                <MultipleImageUpload
                  label="QC Images"
                  id="images"
                  onChange={addImages}
                  images={images}
                  isLoading={imageLoading}
                  errors={[
                    ...imageErrors,
                    ...(formik.touched.images && formik.errors.images
                      ? [formik.errors.images]
                      : []),
                  ]}
                  onRemove={removeImage}
                  onClear={clearAllImages}
                  required={false}
                  maxImages={10}
                  canAddMore={canAddMore}
                  remainingSlots={remainingSlots}
                  gridSize={{ label: 3, field: 9 }}
                />

                {/* REPORT ATTACHMENT */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="reportAttachment" sx={{ marginTop: 0 }}>
                    Report Attachment
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <SingleFileUpload
                    label=""
                    id="reportAttachment"
                    onChange={handleReportFileChange}
                    fileName={reportFileName}
                    isLoading={reportLoading}
                    error={
                      reportError ||
                      (formik.touched.reportAttachment && formik.errors.reportAttachment)
                    }
                    onClear={handleClearReportFile}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    required={false}
                    gridSize={{ label: 0, field: 12 }}
                    showClearButton={true}
                  />
                </Grid2>

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
            <Button type="submit" sx={{ marginRight: '0.5rem' }} disabled={imageLoading}>
              {imageLoading ? 'Processing Images...' : 'Submit'}
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

export default CreateInwardMaterialQc;
