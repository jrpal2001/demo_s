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
import { useNavigate } from 'react-router-dom';
import { searchAssetPurchaseOrders } from '@/api/assetpurchaseorder.api';
import { createOtherStoreInward } from '@/api/otherstoresInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const OTHERSTORE_TYPES = ['TOOLS&SPAREPARTS', 'STATIONERY&HOUSEKEEPING', 'EMBROIDERYSTORE'];
const CONDITION_STATUS = ['New', 'Used', 'Refurbished', 'Damaged', 'Repair needed'];

const CreateOtherStoreInward = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [itemCodes, setItemCodes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/otherstore-inward`, title: 'Other Store Inward' },
    { title: 'Create' },
  ];

  const handleClickCancel = () => {
    navigate(`/${userType}/otherstore-inward`);
  };

  const getItemDisplayCode = (item) => {
    if (item?.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;
    if (item?.codeDetails?.bomId) return item.codeDetails.bomId;
    return item?.code || 'N/A';
  };

  const getItemIdForSaving = (item) => {
    if (item?.displayCode) return item.displayCode;
    if (item?.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;
    if (item?.code?.mainItemCode) return item.code.mainItemCode;
    return item?.code || 'N/A';
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      indentId: '',
      vendorId: '',
      vendorName: '',
      itemCode: '',
      itemName: '',
      uom: '',
      quantityReceived: 0,
      unitPrice: 0,
      receivedBy: '',
      invoiceNo: '',
      invoiceDate: '',
      lotNo: '',
      storageLocation: '',
      inspectionStatus: 'Pending',
      condition: 'New',
      qualityCheckStatus: 'Pending',
      remarks: '',
      itemType: 'TOOLS&SPAREPARTS',
      expiryDate: '',
      manufacturingDate: '',
      batchNumber: '',
      warrantyPeriod: '',
      createdBy: '',
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      itemCode: Yup.string().required('Item Code is required'),
      itemName: Yup.string().required('Item Name is required'),
      uom: Yup.string().required('UOM is required'),
      quantityReceived: Yup.number()
        .required('Quantity Received is required')
        .min(1, 'Quantity must be at least 1'),
      unitPrice: Yup.number().required('Unit Price is required').min(0, 'Price cannot be negative'),
      receivedBy: Yup.string().required('Received By is required'),
      invoiceNo: Yup.string().required('Invoice Number is required'),
      invoiceDate: Yup.date().required('Invoice Date is required'),
      lotNo: Yup.string().required('Lot Number is required'),
      storageLocation: Yup.string().required('Storage Location is required'),
      inspectionStatus: Yup.string().required('Inspection Status is required'),
      condition: Yup.string().required('Condition is required'),
      qualityCheckStatus: Yup.string().required('Quality Check Status is required'),
      remarks: Yup.string(),
      itemType: Yup.string().required('Item Type is required'),
      createdBy: Yup.string().required('Created By is required'),
      expiryDate: Yup.date(),
      manufacturingDate: Yup.date(),
      batchNumber: Yup.string(),
      warrantyPeriod: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const itemIdForSaving = getItemIdForSaving(selectedItem);
        const otherStoreInwardData = {
          poNumber: purchaseOrderData?._id || '',
          indentId: values.indentId,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          lotNo: values.lotNo,
          item: {
            itemId: itemIdForSaving,
            itemType: values.itemType,
            itemName: values.itemName,
            ...(selectedItem?.category && { category: selectedItem.category }),
            ...(selectedItem?.brand && { brand: selectedItem.brand }),
            quantityReceived: values.quantityReceived,
            uom: values.uom,
            unitPrice: values.unitPrice,
            expiryDate: values.expiryDate,
            manufacturingDate: values.manufacturingDate,
            batchNumber: values.batchNumber,
            warrantyPeriod: values.warrantyPeriod,
          },
          invoiceNo: values.invoiceNo,
          invoiceDate: values.invoiceDate,
          inwardDate: new Date(),
          storageLocation: values.storageLocation,
          receivedBy: values.receivedBy,
          inspectionStatus: values.inspectionStatus,
          condition: values.condition,
          qualityCheckStatus: values.qualityCheckStatus,
          status: 'Active',
          remarks: values.remarks,
          createdBy: values.createdBy,
        };
        const response = await createOtherStoreInward(otherStoreInwardData);
        if (response) {
          toast.success('Other Store Inward created successfully');
          navigate(`/${userType}/otherstore-inward`);
        }
      } catch (error) {
        toast.error('Failed to create Other Store Inward: ' + (error.message || 'Unknown error'));
        console.error('Error creating other store inward:', error);
      }
    },
  });

  const handleSearchOtherStorePurchaseOrders = async (searchText) => {
    try {
      if (searchText && searchText.trim() !== '') {
        const response = await searchAssetPurchaseOrders(searchText);
        if (response) {
          setPurchaseOrdersData(response);
        }
      } else {
        fetchPurchaseOrderData();
      }
    } catch (error) {
      console.error('Error searching other store purchase orders:', error);
      toast.error('Failed to search other store purchase orders');
    }
  };

  const fetchPurchaseOrderData = async () => {
    try {
      const response = await searchAssetPurchaseOrders('');
      if (response) {
        setPurchaseOrdersData(response);
      }
    } catch (error) {
      toast.error('Failed to fetch other store purchase order data');
    }
  };

  useEffect(() => {
    if (purchaseOrderData && purchaseOrderData.items) {
      const items = purchaseOrderData.items.map((item) => ({
        code: item.code?.bomId || item.code,
        description: item.description,
        category: item.category || '',
        brand: item.brand || '',
        uom: item.uom,
        unitPrice: item.unitPrice || 0,
        quantity: item.orderQuantity || item.quantity,
        itemType: item.code?.itemType || item.itemType || 'TOOLS&SPAREPARTS',
        codeDetails: item.codeDetails || item.code,
        displayCode: item.displayCode || getItemDisplayCode(item),
        mainItemCode: item.codeDetails?.mainItemCode || item.code?.mainItemCode || item.displayCode,
      }));
      setItemCodes(items);
      formik.setFieldValue('indentId', purchaseOrderData.indentId?.indentId || '');
      formik.setFieldValue('vendorId', purchaseOrderData.vendorId?.vendorId || '');
      formik.setFieldValue('vendorName', purchaseOrderData.vendorId?.vendorName || '');
    } else {
      setItemCodes([]);
    }
  }, [purchaseOrderData]);

  useEffect(() => {
    if (selectedItem) {
      formik.setFieldValue('itemName', selectedItem.description || '');
      formik.setFieldValue('uom', selectedItem.uom || '');
      formik.setFieldValue('unitPrice', selectedItem.unitPrice || 0);
      formik.setFieldValue('itemType', selectedItem.itemType || 'TOOLS&SPAREPARTS');
      formik.setFieldValue(
        'itemCode',
        selectedItem.displayCode || selectedItem.mainItemCode || selectedItem.code,
      );
    }
  }, [selectedItem]);

  useEffect(() => {
    fetchPurchaseOrderData();
  }, []);

  return (
    <PageContainer title="Admin - Other Store Inward" description="This is other store inward page">
      <Breadcrumb title="Other Store Inward" items={BCrumb} />
      <ParentCard title="Create Other Store Inward">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* PURCHASE ORDER NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
                Other Store Purchase Order Number
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
                  handleSearchOtherStorePurchaseOrders(newInputValue);
                }}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`purchaseOrderNumber`, newValue?.purchaseOrderNumber || '');
                  setPurchaseOrderData(newValue);
                  formik.setFieldValue('itemCode', '');
                  formik.setFieldValue('itemName', '');
                  setSelectedItem(null);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Search Other Store Purchase Order Number"
                    aria-label="Search Other Store Purchase Order Number"
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
                    getOptionLabel={(option) =>
                      option.displayCode || option.mainItemCode || option.code || ''
                    }
                    value={selectedItem}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        'itemCode',
                        newValue?.displayCode || newValue?.mainItemCode || newValue?.code || '',
                      );
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
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Box sx={{ fontWeight: 'bold' }}>
                            {option.displayCode || option.mainItemCode || option.code}
                          </Box>
                          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {option.description} - {option.itemType}
                          </Box>
                          {option.quantity && (
                            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                              Qty: {option.quantity} {option.uom}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  />
                </Grid2>
                {/* ITEM NAME */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="itemName" sx={{ marginTop: 0 }}>
                    Item Name
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="itemName"
                    name="itemName"
                    value={formik.values.itemName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    error={formik.touched.itemName && Boolean(formik.errors.itemName)}
                    helperText={formik.touched.itemName && formik.errors.itemName}
                  />
                </Grid2>
                {/* ITEM TYPE */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="itemType" sx={{ marginTop: 0 }}>
                    Item Type
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <FormControl
                    fullWidth
                    error={formik.touched.itemType && Boolean(formik.errors.itemType)}
                  >
                    <Select
                      id="itemType"
                      name="itemType"
                      value={formik.values.itemType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled // Disabled as it comes from selected item
                    >
                      {OTHERSTORE_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.replace(/&/g, ' & ')}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.itemType && formik.errors.itemType && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {formik.errors.itemType}
                      </Box>
                    )}
                  </FormControl>
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    error={formik.touched.uom && Boolean(formik.errors.uom)}
                    helperText={formik.touched.uom && formik.errors.uom}
                  />
                </Grid2>
                {/* UNIT PRICE */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="unitPrice" sx={{ marginTop: 0 }}>
                    Unit Price
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="unitPrice"
                    name="unitPrice"
                    type="number"
                    value={formik.values.unitPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.unitPrice && Boolean(formik.errors.unitPrice)}
                    helperText={formik.touched.unitPrice && formik.errors.unitPrice}
                  />
                </Grid2>
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="orderQuantity" sx={{ marginTop: 0 }}>
                    Order Quantity
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="orderQuantity"
                    name="orderQuantity"
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
            {/* MANUFACTURING DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="manufacturingDate" sx={{ marginTop: 0 }}>
                Manufacturing Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="manufacturingDate"
                name="manufacturingDate"
                type="date"
                value={formik.values.manufacturingDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.manufacturingDate && Boolean(formik.errors.manufacturingDate)}
                helperText={formik.touched.manufacturingDate && formik.errors.manufacturingDate}
              />
            </Grid2>
            {/* EXPIRY DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="expiryDate" sx={{ marginTop: 0 }}>
                Expiry Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formik.values.expiryDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                helperText={formik.touched.expiryDate && formik.errors.expiryDate}
              />
            </Grid2>
            {/* BATCH NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="batchNumber" sx={{ marginTop: 0 }}>
                Batch Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="batchNumber"
                name="batchNumber"
                value={formik.values.batchNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Batch Number"
                error={formik.touched.batchNumber && Boolean(formik.errors.batchNumber)}
                helperText={formik.touched.batchNumber && formik.errors.batchNumber}
              />
            </Grid2>
            {/* WARRANTY PERIOD */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="warrantyPeriod" sx={{ marginTop: 0 }}>
                Warranty Period
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="warrantyPeriod"
                name="warrantyPeriod"
                value={formik.values.warrantyPeriod}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Warranty Period (e.g., 1 year, 6 months)"
                error={formik.touched.warrantyPeriod && Boolean(formik.errors.warrantyPeriod)}
                helperText={formik.touched.warrantyPeriod && formik.errors.warrantyPeriod}
              />
            </Grid2>
            {/* INVOICE NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="invoiceNo" sx={{ marginTop: 0 }}>
                Invoice Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="invoiceNo"
                name="invoiceNo"
                value={formik.values.invoiceNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Invoice Number"
                error={formik.touched.invoiceNo && Boolean(formik.errors.invoiceNo)}
                helperText={formik.touched.invoiceNo && formik.errors.invoiceNo}
              />
            </Grid2>
            {/* INVOICE DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="invoiceDate" sx={{ marginTop: 0 }}>
                Invoice Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="invoiceDate"
                name="invoiceDate"
                type="date"
                value={formik.values.invoiceDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.invoiceDate && Boolean(formik.errors.invoiceDate)}
                helperText={formik.touched.invoiceDate && formik.errors.invoiceDate}
              />
            </Grid2>
            {/* LOT NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="lotNo" sx={{ marginTop: 0 }}>
                Lot Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="lotNo"
                name="lotNo"
                value={formik.values.lotNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Lot Number"
                error={formik.touched.lotNo && Boolean(formik.errors.lotNo)}
                helperText={formik.touched.lotNo && formik.errors.lotNo}
              />
            </Grid2>
            {/* STORAGE LOCATION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="storageLocation" sx={{ marginTop: 0 }}>
                Storage Location
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="storageLocation"
                name="storageLocation"
                value={formik.values.storageLocation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Storage Location"
                error={formik.touched.storageLocation && Boolean(formik.errors.storageLocation)}
                helperText={formik.touched.storageLocation && formik.errors.storageLocation}
              />
            </Grid2>
            {/* RECEIVED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="receivedBy" sx={{ marginTop: 0 }}>
                Received By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="receivedBy"
                name="receivedBy"
                value={formik.values.receivedBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Received By"
                error={formik.touched.receivedBy && Boolean(formik.errors.receivedBy)}
                helperText={formik.touched.receivedBy && formik.errors.receivedBy}
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
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
                {formik.touched.inspectionStatus && formik.errors.inspectionStatus && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.inspectionStatus}
                  </Box>
                )}
              </FormControl>
            </Grid2>
            {/* CONDITION */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="condition" sx={{ marginTop: 0 }}>
                Condition
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControl
                fullWidth
                error={formik.touched.condition && Boolean(formik.errors.condition)}
              >
                <Select
                  id="condition"
                  name="condition"
                  value={formik.values.condition}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {CONDITION_STATUS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.condition && formik.errors.condition && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.condition}
                  </Box>
                )}
              </FormControl>
            </Grid2>
            {/* QUALITY CHECK STATUS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="qualityCheckStatus" sx={{ marginTop: 0 }}>
                Quality Check Status
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.qualityCheckStatus && Boolean(formik.errors.qualityCheckStatus)
                }
              >
                <Select
                  id="qualityCheckStatus"
                  name="qualityCheckStatus"
                  value={formik.values.qualityCheckStatus}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Pass">Pass</MenuItem>
                  <MenuItem value="Fail">Fail</MenuItem>
                </Select>
                {formik.touched.qualityCheckStatus && formik.errors.qualityCheckStatus && (
                  <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                    {formik.errors.qualityCheckStatus}
                  </Box>
                )}
              </FormControl>
            </Grid2>
            {/* CREATED BY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="createdBy" sx={{ marginTop: 0 }}>
                Created By
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="createdBy"
                name="createdBy"
                value={formik.values.createdBy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Created By"
                error={formik.touched.createdBy && Boolean(formik.errors.createdBy)}
                helperText={formik.touched.createdBy && formik.errors.createdBy}
              />
            </Grid2>
            {/* REMARKS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
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
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Remarks"
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
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

export default CreateOtherStoreInward;
