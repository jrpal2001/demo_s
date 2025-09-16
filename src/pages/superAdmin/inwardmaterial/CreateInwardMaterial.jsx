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
import { searchPurchaseOrders } from '@/api/purchaseorder.api';
import { storeInwardMaterial } from '@/api/inwardMaterial.api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateMaterialInward = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/material-inward`, title: 'Material Inward' },
    { title: 'Create' },
  ];
  const navigate = useNavigate();
  const [purchaseOrdersData, setPurchaseOrdersData] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState(null);
  const [itemCodes, setItemCodes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [inputValue, setInputValue] = useState(''); // Added for tracking input value

  const formik = useFormik({
    initialValues: {
      purchaseOrderNumber: '', // maps to poNumber in schema
      indentId: '',
      vendorId: '',
      vendorName: '',
      itemCode: '',
      itemDescription: '',
      uom: '',
      quantityReceived: 0,
      unitPrice: 0, // Added to match schema
      receivedBy: '', // maps to receivedBy in schema
      invoiceNo: '', // Added to match schema
      invoiceDate: '', // Added to match schema
      lotNo: '', // Added to match schema
      dcNo: '', // Added to match schema
      ewayBillNo: '', // Added to match schema
      storageLocation: '', // Added to match schema
      inspectionStatus: 'Pending', // Added to match schema
      remarks: '',
      department: 'stores', // Default department
    },
    validationSchema: Yup.object({
      purchaseOrderNumber: Yup.string().required('Purchase Order Number is required'),
      itemCode: Yup.string().required('Item Code is required'),
      itemDescription: Yup.string().required('Item Description is required'),
      uom: Yup.string().required('UOM is required'),
      quantityReceived: Yup.number()
        .required('Quantity Received is required')
        .min(1, 'Quantity must be at least 1'),
      unitPrice: Yup.number().required('Unit Price is required').min(0, 'Price cannot be negative'),
      receivedBy: Yup.string().required('Received By is required'),
      invoiceNo: Yup.string().required('Invoice Number is required'),
      invoiceDate: Yup.date().required('Invoice Date is required'),
      lotNo: Yup.string().required('Lot Number is required'),
      dcNo: Yup.string().required('DC Number is required'),
      ewayBillNo: Yup.string().required('E-way Bill Number is required'),
      storageLocation: Yup.string().required('Storage Location is required'),
      inspectionStatus: Yup.string().required('Inspection Status is required'),
      remarks: Yup.string(),
      department: Yup.string().required('Department is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('Submitting values:', values);

        // Transform form data to match schema structure
        const inwardData = {
          poNumber: values.purchaseOrderNumber,
          indentId: values.indentId,
          vendorId: values.vendorId,
          vendorName: values.vendorName,
          item: {
            itemCode: selectedItem.code,
            itemDescription: values.itemDescription,
            quantityReceived: values.quantityReceived,
            uom: values.uom,
            unitPrice: values.unitPrice,
          },
          invoiceNo: values.invoiceNo,
          invoiceDate: values.invoiceDate,
          lotNo: values.lotNo,
          dcNo: values.dcNo,
          ewayBillNo: values.ewayBillNo,
          storageLocation: values.storageLocation,
          receivedBy: values.receivedBy,
          inspectionStatus: values.inspectionStatus,
          remarks: values.remarks,
        };

        const response = await storeInwardMaterial(selectedItem.code, inwardData);
        if (response) {
          toast.success('Material Inward created successfully');
          navigate(`/${userType}/material-inward`);
        }
      } catch (error) {
        toast.error('Failed to create Material Inward: ' + (error.message || 'Unknown error'));
        console.error('Error creating material inward:', error);
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/material-inward`);
  };

  // Function to search purchase orders based on input
  const handleSearchPurchaseOrders = async (searchText) => {
    try {
      if (searchText && searchText.trim() !== '') {
        const response = await searchPurchaseOrders(searchText);
        if (response) {
          setPurchaseOrdersData(response);
        }
      } else {
        // If search text is empty, fetch all purchase orders
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

  // Extract item codes when purchase order is selected
  useEffect(() => {
    if (purchaseOrderData && purchaseOrderData.indentId && purchaseOrderData.indentId.items) {
      const items = purchaseOrderData.indentId.items.map((item) => ({
        code: item.code?.bomId || item.code,
        description: item.description,
        uom: item.uom,
        unitPrice: item.unitPrice || 0,
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
      formik.setFieldValue('unitPrice', selectedItem.unitPrice || 0);
    }
  }, [selectedItem]);

  useEffect(() => {
    fetchPurchaseOrderData();
  }, []);

  return (
    <PageContainer title="Admin - Material Inward" description="This is material inward page">
      <Breadcrumb title="Material Inward" items={BCrumb} />
      <ParentCard title="Create Material Inward">
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
                    (item) => item._id === formik.values.purchaseOrderNumber,
                  ) || null
                }
                // Track input value changes
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  // Call search API when input changes
                  handleSearchPurchaseOrders(newInputValue);
                }}
                onChange={(event, newValue) => {
                  formik.setFieldValue(`purchaseOrderNumber`, newValue?._id || '');
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
                    getOptionLabel={(option) => option.code || ''}
                    value={selectedItem}
                    onChange={(event, newValue) => {
                      formik.setFieldValue('itemCode', newValue?.code || '');
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
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    error={formik.touched.itemDescription && Boolean(formik.errors.itemDescription)}
                    helperText={formik.touched.itemDescription && formik.errors.itemDescription}
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

            {/* DC NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="dcNo" sx={{ marginTop: 0 }}>
                DC Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="dcNo"
                name="dcNo"
                value={formik.values.dcNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter DC Number"
                error={formik.touched.dcNo && Boolean(formik.errors.dcNo)}
                helperText={formik.touched.dcNo && formik.errors.dcNo}
              />
            </Grid2>

            {/* E-WAY BILL NUMBER */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="ewayBillNo" sx={{ marginTop: 0 }}>
                E-way Bill Number
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="ewayBillNo"
                name="ewayBillNo"
                value={formik.values.ewayBillNo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter E-way Bill Number"
                error={formik.touched.ewayBillNo && Boolean(formik.errors.ewayBillNo)}
                helperText={formik.touched.ewayBillNo && formik.errors.ewayBillNo}
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

export default CreateMaterialInward;
