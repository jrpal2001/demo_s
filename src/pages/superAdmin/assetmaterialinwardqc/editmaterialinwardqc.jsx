'use client';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Autocomplete, Box, Button, Grid2, FormControl, Select, MenuItem } from '@mui/material';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { searchAssetPurchaseOrders } from '@/api/assetpurchaseorder.api';
import {
  fetchAssetMaterialInwardQcById,
  updateAssetMaterialInwardQc,
} from '@/api/assetMaterialInwardQc.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const EditAssetMaterialInwardQc = () => {
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-material-inward-qc`, title: 'Asset Material Inward QC' },
    { title: 'Edit' },
  ];

  const navigate = useNavigate();
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [itemCodes, setItemCodes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  // Helper function to get display code for items
  const getItemDisplayCode = (item) => {
    if (item?.codeDetails?.mainAssetId) return item.codeDetails.mainAssetId;
    if (item?.codeDetails?.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
    if (item?.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;
    return item?.code || 'N/A';
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      invoiceNumber: '',
      lotNumber: '',
      debitNote: '',
      remark: '',
      quantityReceived: 0,
      quantityAccepted: 0,
      totalAmount: 0,
      inspectionStatus: 'pending',
      inspectionRemarks: '',
      inspectedBy: '',
      inspectedDate: '',
      // Display fields
      indentId: '',
      vendorId: '',
      vendorName: '',
      itemCode: '',
      itemDescription: '',
      uom: '',
      unitPrice: 0,
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      invoiceNumber: Yup.string().required('Invoice Number is required'),
      lotNumber: Yup.string().required('Lot Number is required'),
      debitNote: Yup.string().required('Debit Note is required'),
      remark: Yup.string().required('Remark is required'),
      itemCode: Yup.string().required('Item Code is required'),
      quantityReceived: Yup.number()
        .required('Quantity Received is required')
        .min(1, 'Quantity must be at least 1'),
      quantityAccepted: Yup.number()
        .required('Quantity Accepted is required')
        .min(0, 'Quantity Accepted cannot be negative'),
      totalAmount: Yup.number()
        .required('Total Amount is required')
        .min(0, 'Total Amount cannot be negative'),
      inspectionStatus: Yup.string()
        .oneOf(['accepted', 'pending'])
        .required('Inspection Status is required'),
      inspectionRemarks: Yup.string().required('Inspection Remarks is required'),
      inspectedBy: Yup.string().required('Inspected By is required'),
      inspectedDate: Yup.date().required('Inspected Date is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('Submitting values:', values);

        // Only send changed fields
        const changedFields = {};
        Object.keys(values).forEach((key) => {
          if (
            key !== 'indentId' &&
            key !== 'vendorId' &&
            key !== 'vendorName' &&
            key !== 'itemDescription' &&
            key !== 'uom' &&
            key !== 'purchaseOrderNumber' // Add this to exclude from general comparison
          ) {
            if (originalData && JSON.stringify(originalData[key]) !== JSON.stringify(values[key])) {
              changedFields[key] = values[key];
            }
          }
        });

        // Handle items separately if item selection changed
        if (selectedItem) {
          changedFields.items = [
            JSON.stringify({
              code: selectedItem.code,
              model: selectedItem.model || 'Asset',
              description: selectedItem.description,
              quantityReceived: values.quantityReceived,
              quantityAccepted: values.quantityAccepted,
              uom: selectedItem.uom,
            }),
          ];
        }

        // Handle purchase order change - compare ObjectIds, not display values
        if (purchaseOrderData && purchaseOrderData._id !== originalData?.purchaseOrderNumber?._id) {
          changedFields.purchaseOrderNumber = purchaseOrderData._id;
        } else if (originalData?.purchaseOrderNumber?._id && !purchaseOrderData) {
          // If purchase order was cleared
          changedFields.purchaseOrderNumber = null;
        }

        console.log('Changed fields:', changedFields);

        if (Object.keys(changedFields).length === 0) {
          toast.warning('No changes detected');
          return;
        }

        const response = await updateAssetMaterialInwardQc(id, changedFields);
        if (response) {
          toast.success('Asset Material Inward QC updated successfully');
          navigate(`/${userType}/asset-material-inward-qc`);
        }
      } catch (error) {
        toast.error(
          'Failed to update Asset Material Inward QC: ' + (error.message || 'Unknown error'),
        );
        console.error('Error updating asset material inward QC:', error);
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/asset-material-inward-qc`);
  };

  // Function to search purchase orders based on input
  const handleSearchPurchaseOrders = async (searchText) => {
    try {
      if (searchText && searchText.trim() !== '') {
        const response = await searchAssetPurchaseOrders(searchText);
        console.log('🚀 ~ handleSearchPurchaseOrders ~ response:', response);
        if (response && response.data && response.data.data) {
          setPurchaseOrdersData(response.data.data);
        }
      } else {
        fetchPurchaseOrderData();
      }
    } catch (error) {
      console.error('Error searching asset purchase orders:', error);
      toast.error('Failed to search asset purchase orders');
    }
  };

  const fetchPurchaseOrderData = async () => {
    try {
      const response = await searchAssetPurchaseOrders('');
      console.log('🚀 ~ fetchPurchaseOrderData ~ response:', response);
      if (response) {
        setPurchaseOrdersData(response);
      }
    } catch (error) {
      console.error('Error fetching purchase order data:', error);
      toast.error('Failed to fetch asset purchase order data');
    }
  };

  // Fetch existing material inward QC data
  const fetchMaterialInwardData = async () => {
    try {
      setLoading(true);
      const response = await fetchAssetMaterialInwardQcById(id);
      console.log('🚀 ~ fetchMaterialInwardData ~ response:', response);

      if (response && response.data) {
        const data = response.data;
        setOriginalData(data);

        // Set form values
        formik.setValues({
          purchaseOrderNumber: data.purchaseOrderNumber?.purchaseOrderNumber || '',
          invoiceNumber: data.invoiceNumber || '',
          lotNumber: data.lotNumber || '',
          debitNote: data.debitNote || '',
          remark: data.remark || '',
          quantityReceived: data.items?.[0]?.quantityReceived || 0,
          quantityAccepted: data.items?.[0]?.quantityAccepted || 0,
          totalAmount: data.totalAmount || 0,
          inspectionStatus: data.inspectionStatus || 'pending',
          inspectionRemarks: data.inspectionRemarks || '',
          inspectedBy: data.inspectedBy || '',
          inspectedDate: data.inspectedDate ? data.inspectedDate.split('T')[0] : '',
          // Display fields
          indentId: data.purchaseOrderNumber?.indentId?.indentId || '',
          vendorId: data.purchaseOrderNumber?.vendorId?.vendorId || '',
          vendorName: data.purchaseOrderNumber?.vendorId?.vendorName || '',
          itemCode: getItemDisplayCode(data.items?.[0]) || '',
          itemDescription: data.items?.[0]?.description || '',
          uom: data.items?.[0]?.uom || '',
        });

        // Set purchase order data
        setPurchaseOrderData(data.purchaseOrderNumber);
        setInputValue(data.purchaseOrderNumber?.purchaseOrderNumber || '');

        // Set selected item
        if (data.items?.[0]) {
          const item = data.items[0];
          setSelectedItem({
            code: item.code,
            model: item.model,
            description: item.description,
            uom: item.uom,
            quantity: item.quantityReceived,
            codeDetails: item.codeDetails,
            displayCode: getItemDisplayCode(item),
          });
        }

        // Set items for the purchase order
        if (data.purchaseOrderNumber?.items) {
          const items = data.purchaseOrderNumber.items.map((item) => ({
            code: item.code?._id || item.code,
            model: item.model,
            description: item.description,
            uom: item.uom,
            quantity: item.orderQuantity || item.quantity,
            codeDetails: item.codeDetails || item.code,
            displayCode: item.displayCode || getItemDisplayCode(item),
          }));
          setItemCodes(items);
        }
      }
    } catch (error) {
      console.error('Error fetching material inward data:', error);
      toast.error('Failed to fetch material inward QC data');
      navigate(`/${userType}/asset-material-inward-qc`);
    } finally {
      setLoading(false);
    }
  };

  // Extract item codes when purchase order is selected
  useEffect(() => {
    if (purchaseOrderData && purchaseOrderData.items) {
      const items = purchaseOrderData.items.map((item) => ({
        code: item.code?._id || item.code,
        model: item.model,
        description: item.description,
        uom: item.uom,
        quantity: item.orderQuantity || item.quantity,
        codeDetails: item.codeDetails || item.code,
        displayCode: item.displayCode || getItemDisplayCode(item),
      }));
      console.log('Available items:', items);
      setItemCodes(items);

      // Set indent ID and vendor details
      formik.setFieldValue('indentId', purchaseOrderData.indentId?.indentId || '');
      formik.setFieldValue('vendorId', purchaseOrderData.vendorId?.vendorId || '');
      formik.setFieldValue('vendorName', purchaseOrderData.vendorId?.vendorName || '');
    } else {
      setItemCodes([]);
    }
  }, [purchaseOrderData]);

  // Auto-fill item details when an item code is selected
  useEffect(() => {
    if (selectedItem) {
      console.log('Selected item:', selectedItem);
      formik.setFieldValue('itemDescription', selectedItem.description || '');
      formik.setFieldValue('uom', selectedItem.uom || '');
      formik.setFieldValue('itemCode', selectedItem.displayCode || selectedItem.code);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (id) {
      fetchMaterialInwardData();
      fetchPurchaseOrderData();
    }
  }, [id]);

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

  return (
    <PageContainer
      title="Admin - Asset Material Inward QC"
      description="This is asset material inward QC page"
    >
      <Breadcrumb title="Edit Asset Material Inward QC" items={BCrumb} />
      <ParentCard title="Edit Asset Material Inward QC">
        <form onSubmit={formik.handleSubmit}>
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
                    (item) => item.purchaseOrderNumber === formik.values.purchaseOrderNumber,
                  ) || null
                }
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  handleSearchPurchaseOrders(newInputValue);
                }}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`purchaseOrderNumber`, newValue?.purchaseOrderNumber || '');
                  setPurchaseOrderData(newValue);
                  // Reset item selection when PO changes
                  formik.setFieldValue('itemCode', '');
                  formik.setFieldValue('itemDescription', '');
                  formik.setFieldValue('uom', '');
                  setSelectedItem(null);
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

            {purchaseOrderData && (
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
                    value={formik.values.indentId}
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
                    value={formik.values.vendorId}
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
                    value={formik.values.vendorName}
                    disabled
                  />
                </Grid2>

                {/* ITEM CODE DROPDOWN */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="itemCode" sx={{ marginTop: 0 }}>
                    Item Code
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <Autocomplete
                    options={itemCodes}
                    autoHighlight
                    getOptionLabel={(option) => option.displayCode || option.code || ''}
                    value={selectedItem}
                    onChange={(event, newValue) => {
                      setSelectedItem(newValue);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Select Item Code"
                        aria-label="Select Item Code"
                        autoComplete="off"
                        name="itemCode"
                        error={formik.touched.itemCode && Boolean(formik.errors.itemCode)}
                        helperText={formik.touched.itemCode && formik.errors.itemCode}
                      />
                    )}
                  />
                </Grid2>

                {/* ITEM DESCRIPTION */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="itemDescription" sx={{ marginTop: 0 }}>
                    Item Description
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="itemDescription"
                    name="itemDescription"
                    value={formik.values.itemDescription}
                    disabled
                  />
                </Grid2>

                {/* UOM */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="uom" sx={{ marginTop: 0 }}>
                    UOM
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="uom"
                    name="uom"
                    value={formik.values.uom}
                    disabled
                  />
                </Grid2>

                {/* REQUEST QUANTITY */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="requestQuantity" sx={{ marginTop: 0 }}>
                    Request Quantity
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="requestQuantity"
                    name="requestQuantity"
                    value={selectedItem?.quantity || 0}
                    disabled
                  />
                </Grid2>
              </>
            )}

            {/* QUANTITY RECEIVED */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="quantityReceived" sx={{ marginTop: 0 }}>
                Quantity Received
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="quantityReceived"
                name="quantityReceived"
                type="number"
                value={formik.values.quantityReceived}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Quantity Received"
                error={formik.touched.quantityReceived && Boolean(formik.errors.quantityReceived)}
                helperText={formik.touched.quantityReceived && formik.errors.quantityReceived}
              />
            </Grid2>

            {/* QUANTITY ACCEPTED */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="quantityAccepted" sx={{ marginTop: 0 }}>
                Quantity Accepted
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="quantityAccepted"
                name="quantityAccepted"
                type="number"
                value={formik.values.quantityAccepted}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Quantity Accepted"
                error={formik.touched.quantityAccepted && Boolean(formik.errors.quantityAccepted)}
                helperText={formik.touched.quantityAccepted && formik.errors.quantityAccepted}
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
                multiline
                rows={3}
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
                error={formik.touched.inspectedDate && Boolean(formik.errors.inspectedDate)}
                helperText={formik.touched.inspectedDate && formik.errors.inspectedDate}
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
              <FormControl
                fullWidth
                error={formik.touched.inspectionStatus && Boolean(formik.errors.inspectionStatus)}
              >
                <Select
                  id="inspectionStatus"
                  name="inspectionStatus"
                  value={formik.values.inspectionStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                </Select>
                {formik.touched.inspectionStatus && formik.errors.inspectionStatus && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.inspectionStatus}
                  </Box>
                )}
              </FormControl>
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
              Update
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

export default EditAssetMaterialInwardQc;
