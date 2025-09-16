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
import { createMaintenanceInward } from '@/api/maintenanceInward.api';
import { searchAssetPurchaseOrders } from '@/api/assetpurchaseorder.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const MAINTENANCE_TYPES = [
  'BUSINESSLICENSE',
  'WEIGHTS&MEASUREMENTS',
  'SAFETYEQUIPMENT',
  'AMC',
  'INSURANCE',
  'AGREEMENTS',
];

const CreateMaintenanceInward = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/maintenance-inward`, title: 'Maintenance Inward' },
    { title: 'Create' },
  ];
  const navigate = useNavigate();
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [maintenanceCodes, setMaintenanceCodes] = useState([]);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Helper function to get display code for items
  const getItemDisplayCode = (item) => {
    if (item?.codeDetails?.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
    if (item?.codeDetails?.bomId) return item.codeDetails.bomId;
    return item?.code || 'N/A';
  };

  // Helper function to get the actual maintenance ID (mainMaintenanceId) for saving
  const getMaintenanceIdForSaving = (maintenance) => {
    if (maintenance?.displayCode) return maintenance.displayCode;
    if (maintenance?.codeDetails?.mainMaintenanceId)
      return maintenance.codeDetails.mainMaintenanceId;
    if (maintenance?.code?.mainMaintenanceId) return maintenance.code.mainMaintenanceId; // If code is populated
    return maintenance?.code || 'N/A';
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      indentId: '',
      vendorId: '',
      vendorName: '',
      maintenanceCode: '', // Changed from assetCode
      maintenanceName: '', // Changed from assetDescription
      uom: '',
      quantityReceived: 0,
      unitPrice: 0,
      receivedBy: '',
      invoiceNo: '',
      invoiceDate: '',
      lotNo: '',
      storageLocation: '',
      inspectionStatus: 'Pending',
      remarks: '',
      maintenanceType: 'BUSINESSLICENSE', // Changed from assetType
      validityStartDate: '',
      validityEndDate: '',
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      maintenanceCode: Yup.string().required('Maintenance Code is required'), // Changed from assetCode
      maintenanceName: Yup.string().required('Maintenance Name is required'), // Changed from assetDescription
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
      remarks: Yup.string(),
      maintenanceType: Yup.string().required('Maintenance Type is required'), // Changed from assetType
      validityStartDate: Yup.date(),
      validityEndDate: Yup.date(),
    }),
    onSubmit: async (values) => {
      try {
        const maintenanceIdForSaving = getMaintenanceIdForSaving(selectedMaintenance); // Changed from assetIdForSaving
        const maintenanceInwardData = {
          poNumber: purchaseOrderData?._id || '', // Use _id from selected PO
          indentId: values.indentId,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          lotNo: values.lotNo,
          item: {
            maintenanceId: maintenanceIdForSaving, // Changed from assetId
            maintenanceType: values.maintenanceType, // Changed from assetType
            maintenanceName: values.maintenanceName, // Changed from assetName
            quantityReceived: values.quantityReceived,
            uom: values.uom,
            unitPrice: values.unitPrice,
            validityStartDate: values.validityStartDate,
            validityEndDate: values.validityEndDate,
          },
          invoiceNo: values.invoiceNo,
          invoiceDate: values.invoiceDate,
          inwardDate: new Date(),
          storageLocation: values.storageLocation,
          receivedBy: values.receivedBy,
          inspectionStatus: values.inspectionStatus,
          status: 'Active',
          remarks: values.remarks,
        };
        const response = await createMaintenanceInward(maintenanceInwardData);
        if (response) {
          toast.success('Maintenance Inward created successfully');
          navigate(`/${userType}/maintenance-inward`);
        }
      } catch (error) {
        toast.error('Failed to create Maintenance Inward: ' + (error.message || 'Unknown error'));
        console.error('Error creating maintenance inward:', error);
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/maintenance-inward`);
  };

  const handlesearchAssetPurchaseOrders = async (searchText) => {
    try {
      if (searchText && searchText.trim() !== '') {
        const response = await searchAssetPurchaseOrders(searchText); // Changed API call
        if (response) {
          setPurchaseOrdersData(response);
        }
      } else {
        fetchPurchaseOrderData();
      }
    } catch (error) {
      console.error('Error searching maintenance purchase orders:', error);
      toast.error('Failed to search maintenance purchase orders');
    }
  };

  const fetchPurchaseOrderData = async () => {
    try {
      const response = await searchAssetPurchaseOrders(''); // Changed API call
      if (response) {
        setPurchaseOrdersData(response);
      }
    } catch (error) {
      toast.error('Failed to fetch maintenance purchase order data');
    }
  };

  useEffect(() => {
    if (purchaseOrderData && purchaseOrderData.items) {
      // Changed from indentId.items to items directly
      const maintenances = purchaseOrderData.items.map((maintenance) => ({
        code: maintenance.code?.bomId || maintenance.code, // Use bomId for maintenance code
        description: maintenance.description,
        uom: maintenance.uom,
        unitPrice: maintenance.unitPrice || 0,
        quantity: maintenance.orderQuantity || maintenance.quantity, // Use orderQuantity from PO
        maintenanceType:
          maintenance.code?.maintenanceType || maintenance.maintenanceType || 'BUSINESSLICENSE', // Get maintenanceType from populated code
        codeDetails: maintenance.codeDetails || maintenance.code, // Use existing codeDetails or populated code
        displayCode: maintenance.displayCode || getItemDisplayCode(maintenance), // Use existing displayCode or compute
        mainMaintenanceId:
          maintenance.codeDetails?.mainMaintenanceId ||
          maintenance.code?.mainMaintenanceId ||
          maintenance.displayCode, // New field
      }));
      setMaintenanceCodes(maintenances);
      formik.setFieldValue('indentId', purchaseOrderData.indentId?.indentId || '');
      formik.setFieldValue('vendorId', purchaseOrderData.vendorId?.vendorId || '');
      formik.setFieldValue('vendorName', purchaseOrderData.vendorId?.vendorName || '');
    } else {
      setMaintenanceCodes([]);
    }
  }, [purchaseOrderData]);

  useEffect(() => {
    if (selectedMaintenance) {
      formik.setFieldValue('maintenanceName', selectedMaintenance.description || ''); // Changed from assetDescription
      formik.setFieldValue('uom', selectedMaintenance.uom || '');
      formik.setFieldValue('unitPrice', selectedMaintenance.unitPrice || 0);
      formik.setFieldValue(
        'maintenanceType',
        selectedMaintenance.maintenanceType || 'BUSINESSLICENSE', // Changed from assetType
      );
      // Set the display code in the form field for user visibility
      formik.setFieldValue(
        'maintenanceCode', // Changed from assetCode
        selectedMaintenance.displayCode ||
          selectedMaintenance.mainMaintenanceId ||
          selectedMaintenance.code,
      );
    }
  }, [selectedMaintenance]);

  useEffect(() => {
    fetchPurchaseOrderData();
  }, []);

  return (
    <PageContainer title="Admin - Maintenance Inward" description="This is maintenance inward page">
      <Breadcrumb title="Maintenance Inward" items={BCrumb} />
      <ParentCard title="Create Maintenance Inward">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* PURCHASE ORDER NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
                Maintenance Purchase Order Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <Autocomplete
                options={purchaseOrdersData}
                autoHighlight
                getOptionLabel={(option) => option.purchaseOrderNumber}
                value={
                  purchaseOrdersData.find(
                    (item) => item.purchaseOrderNumber === formik.values.purchaseOrderNumber, // Changed from _id to purchaseOrderNumber
                  ) || null
                }
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  handlesearchAssetPurchaseOrders(newInputValue);
                }}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`purchaseOrderNumber`, newValue?.purchaseOrderNumber || ''); // Changed to purchaseOrderNumber
                  setPurchaseOrderData(newValue);
                  formik.setFieldValue('maintenanceCode', ''); // Changed from assetCode
                  formik.setFieldValue('maintenanceName', ''); // Changed from assetDescription
                  formik.setFieldValue('uom', '');
                  setSelectedMaintenance(null); // Changed from setSelectedAsset
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Search Maintenance Purchase Order Number"
                    aria-label="Search Maintenance Purchase Order Number"
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
                {/* MAINTENANCE CODE DROPDOWN */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="maintenanceCode" sx={{ marginTop: 0 }}>
                    Maintenance Code
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <Autocomplete
                    options={maintenanceCodes}
                    autoHighlight
                    getOptionLabel={(option) =>
                      option.displayCode || option.mainMaintenanceId || option.code || ''
                    } // Updated label
                    value={selectedMaintenance}
                    onChange={(event, newValue) => {
                      formik.setFieldValue(
                        'maintenanceCode',
                        newValue?.displayCode ||
                          newValue?.mainMaintenanceId ||
                          newValue?.code ||
                          '',
                      ); // Updated field
                      setSelectedMaintenance(newValue);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Select Maintenance Code"
                        aria-label="Select Maintenance Code"
                        autoComplete="off"
                        name="maintenanceCode" // Updated name
                        error={
                          formik.touched.maintenanceCode && Boolean(formik.errors.maintenanceCode)
                        }
                        helperText={formik.touched.maintenanceCode && formik.errors.maintenanceCode}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Box sx={{ fontWeight: 'bold' }}>
                            {option.displayCode || option.mainMaintenanceId || option.code}
                          </Box>
                          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {option.description} - {option.maintenanceType}
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
                {/* MAINTENANCE NAME */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="maintenanceName" sx={{ marginTop: 0 }}>
                    Maintenance Name
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="maintenanceName"
                    name="maintenanceName"
                    value={formik.values.maintenanceName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    error={formik.touched.maintenanceName && Boolean(formik.errors.maintenanceName)}
                    helperText={formik.touched.maintenanceName && formik.errors.maintenanceName}
                  />
                </Grid2>
                {/* MAINTENANCE TYPE */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="maintenanceType" sx={{ marginTop: 0 }}>
                    Maintenance Type
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <FormControl
                    fullWidth
                    error={formik.touched.maintenanceType && Boolean(formik.errors.maintenanceType)}
                  >
                    <Select
                      id="maintenanceType"
                      name="maintenanceType"
                      value={formik.values.maintenanceType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled // Disable as it's derived from selected PO item
                    >
                      {MAINTENANCE_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type.replace(/&/g, ' & ')}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.maintenanceType && formik.errors.maintenanceType && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {formik.errors.maintenanceType}
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
                {/* ORDER QUANTITY (from PO) */}
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
                    value={selectedMaintenance?.quantity || 0}
                    disabled
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
            {/* VALIDITY START DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="validityStartDate" sx={{ marginTop: 0 }}>
                Validity Start Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="validityStartDate"
                name="validityStartDate"
                type="date"
                value={formik.values.validityStartDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.validityStartDate && Boolean(formik.errors.validityStartDate)}
                helperText={formik.touched.validityStartDate && formik.errors.validityStartDate}
              />
            </Grid2>
            {/* VALIDITY END DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="validityEndDate" sx={{ marginTop: 0 }}>
                Validity End Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="validityEndDate"
                name="validityEndDate"
                type="date"
                value={formik.values.validityEndDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.validityEndDate && Boolean(formik.errors.validityEndDate)}
                helperText={formik.touched.validityEndDate && formik.errors.validityEndDate}
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

export default CreateMaintenanceInward;
