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
import { searchAssetPurchaseOrders } from '@/api/assetpurchaseorder.api';
import { storeAssetInward } from '@/api/assetinward.api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateAssetInward = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-inward`, title: 'Asset Inward' },
    { title: 'Create' },
  ];

  const navigate = useNavigate();
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [assetCodes, setAssetCodes] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Helper function to get display code for items
  const getItemDisplayCode = (item) => {
    if (item?.codeDetails?.mainAssetId) return item.codeDetails.mainAssetId;
    if (item?.codeDetails?.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
    if (item?.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;
    return item?.code || 'N/A';
  };

  // Helper function to get the actual asset ID (mainAssetId) for saving
  const getAssetIdForSaving = (asset) => {
    // Priority order: displayCode > codeDetails.mainAssetId > mainAssetId from populated code
    if (asset?.displayCode) return asset.displayCode;
    if (asset?.codeDetails?.mainAssetId) return asset.codeDetails.mainAssetId;
    if (asset?.code?.mainAssetId) return asset.code.mainAssetId; // If code is populated
    return asset?.code || 'N/A';
  };

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '',
      indentId: '',
      vendorId: '',
      vendorName: '',
      assetCode: '',
      assetDescription: '',
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
      assetType: 'MACHINERY',
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      assetCode: Yup.string().required('Asset Code is required'),
      assetDescription: Yup.string().required('Asset Description is required'),
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
      assetType: Yup.string().required('Asset Type is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('Submitting values:', values);
        console.log('Selected asset:', selectedAsset);

        // Get the correct asset ID for saving
        const assetIdForSaving = getAssetIdForSaving(selectedAsset);
        console.log('Asset ID for saving:', assetIdForSaving);

        const assetInwardData = {
          poNumber: purchaseOrderData?._id || '',
          indentId: values.indentId,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          lotNo: values.lotNo,
          item: {
            assetId: assetIdForSaving, // Use the mainAssetId instead of _id
            assetType: values.assetType,
            assetName: values.assetDescription,
            quantityReceived: values.quantityReceived,
            uom: values.uom,
            unitPrice: values.unitPrice,
          },
          invoiceNo: values.invoiceNo,
          invoiceDate: values.invoiceDate,
          inwardDate: new Date(),
          storageLocation: values.storageLocation,
          receivedBy: values.receivedBy,
          inspectionStatus: values.inspectionStatus,
          remarks: values.remarks,
        };

        console.log('Final asset inward data:', assetInwardData);

        const response = await storeAssetInward(assetInwardData);
        if (response) {
          toast.success('Asset Inward created successfully');
          navigate(`/${userType}/asset-inward`);
        }
      } catch (error) {
        toast.error('Failed to create Asset Inward: ' + (error.message || 'Unknown error'));
        console.error('Error creating asset inward:', error);
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/asset-inward`);
  };

  const handleSearchAssetPurchaseOrders = async (searchText) => {
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
      toast.error('Failed to fetch asset purchase order data');
    }
  };

  // Updated to follow Asset Material Inward QC pattern
  useEffect(() => {
    if (purchaseOrderData && purchaseOrderData.items) {
      const assets = purchaseOrderData.items.map((asset) => ({
        code: asset.code?._id || asset.code, // Keep the _id for reference
        model: asset.model,
        description: asset.description,
        uom: asset.uom,
        unitPrice: asset.unitPrice || 0,
        quantity: asset.orderQuantity || asset.quantity, // Use orderQuantity from PO
        assetType: asset.code?.assetType || asset.assetType || 'MACHINERY', // Get assetType from populated code
        codeDetails: asset.codeDetails || asset.code, // Use existing codeDetails or populated code
        displayCode: asset.displayCode || getItemDisplayCode(asset), // Use existing displayCode or compute
        // Add the actual mainAssetId for easy access
        mainAssetId: asset.codeDetails?.mainAssetId || asset.code?.mainAssetId || asset.displayCode,
      }));
      console.log('Available assets:', assets);
      setAssetCodes(assets);

      // Set indent ID and vendor details
      formik.setFieldValue('indentId', purchaseOrderData.indentId?.indentId || '');
      formik.setFieldValue('vendorId', purchaseOrderData.vendorId?.vendorId || '');
      formik.setFieldValue('vendorName', purchaseOrderData.vendorId?.vendorName || '');
    } else {
      setAssetCodes([]);
    }
  }, [purchaseOrderData]);

  useEffect(() => {
    if (selectedAsset) {
      console.log('Selected asset:', selectedAsset);
      formik.setFieldValue('assetDescription', selectedAsset.description || '');
      formik.setFieldValue('uom', selectedAsset.uom || '');
      formik.setFieldValue('unitPrice', selectedAsset.unitPrice || 0);
      formik.setFieldValue('assetType', selectedAsset.assetType || 'MACHINERY');
      // Set the display code in the form field for user visibility
      formik.setFieldValue(
        'assetCode',
        selectedAsset.displayCode || selectedAsset.mainAssetId || selectedAsset.code,
      );
    }
  }, [selectedAsset]);

  useEffect(() => {
    fetchPurchaseOrderData();
  }, []);

  return (
    <PageContainer title="Admin - Asset Inward" description="This is asset inward page">
      <Breadcrumb title="Asset Inward" items={BCrumb} />
      <ParentCard title="Create Asset Inward">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* PURCHASE ORDER NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="purchaseOrderNumber" sx={{ marginTop: 0 }}>
                Asset Purchase Order Number
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
                  handleSearchAssetPurchaseOrders(newInputValue);
                }}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`purchaseOrderNumber`, newValue?.purchaseOrderNumber || '');
                  setPurchaseOrderData(newValue);
                  formik.setFieldValue('assetCode', '');
                  formik.setFieldValue('assetDescription', '');
                  formik.setFieldValue('uom', '');
                  setSelectedAsset(null);
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    placeholder="Search Asset Purchase Order Number"
                    aria-label="Search Asset Purchase Order Number"
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

                {/* ASSET CODE DROPDOWN */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="assetCode" sx={{ marginTop: 0 }}>
                    Asset Code
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <Autocomplete
                    options={assetCodes}
                    autoHighlight
                    getOptionLabel={(option) =>
                      option.displayCode || option.mainAssetId || option.code || ''
                    }
                    value={selectedAsset}
                    onChange={(event, newValue) => {
                      setSelectedAsset(newValue);
                    }}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Select Asset Code"
                        aria-label="Select Asset Code"
                        autoComplete="off"
                        name="assetCode"
                        error={formik.touched.assetCode && Boolean(formik.errors.assetCode)}
                        helperText={formik.touched.assetCode && formik.errors.assetCode}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Box sx={{ fontWeight: 'bold' }}>
                            {option.displayCode || option.mainAssetId || option.code}
                          </Box>
                          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                            {option.description} - {option.assetType}
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

                {/* ASSET DESCRIPTION */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="assetDescription" sx={{ marginTop: 0 }}>
                    Asset Description
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <CustomTextField
                    fullWidth
                    id="assetDescription"
                    name="assetDescription"
                    value={formik.values.assetDescription}
                    disabled
                  />
                </Grid2>

                {/* ASSET TYPE */}
                <Grid2
                  size={{ xs: 12, md: 3 }}
                  sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                >
                  <CustomFormLabel htmlFor="assetType" sx={{ marginTop: 0 }}>
                    Asset Type
                  </CustomFormLabel>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 9 }}>
                  <FormControl
                    fullWidth
                    error={formik.touched.assetType && Boolean(formik.errors.assetType)}
                  >
                    <Select
                      id="assetType"
                      name="assetType"
                      value={formik.values.assetType}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="MACHINERY">Machinery</MenuItem>
                      <MenuItem value="ELECTRICALS">Electricals</MenuItem>
                      <MenuItem value="ELECTRONICS">Electronics</MenuItem>
                      <MenuItem value="FURNITURE&FIXTURES">Furniture & Fixtures</MenuItem>
                      <MenuItem value="IMMOVABLE PROPERTIES">Immovable Properties</MenuItem>
                      <MenuItem value="VEHICLES">Vehicles</MenuItem>
                      <MenuItem value="SOFTWARES&LICENSES">Softwares & Licenses</MenuItem>
                    </Select>
                    {formik.touched.assetType && formik.errors.assetType && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {formik.errors.assetType}
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
                    value={selectedAsset?.quantity || 0}
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

export default CreateAssetInward;
