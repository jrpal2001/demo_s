'use client';

import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Snackbar,
} from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { getDepartmentWorkOrderById, updateReturnedGoods } from '@/api/workorderDepartment.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const DEPARTMENTS = [
  { value: 'fabric', label: 'Fabric' },
  { value: 'trims', label: 'Trims' },
  { value: 'stitching', label: 'Stitching' },
  { value: 'finishing', label: 'Finishing' },
];

const ReturnGoods = () => {
  const userType = useSelector(selectCurrentUserType);
  const { workOrderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const rowData = location.state?.rowData || {};
  const departmentWorkOrderRef = location.state?.rowData?.departmentWorkOrderRef || workOrderId;

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departmentWorkOrderData, setDepartmentWorkOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [returnItems, setReturnItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // Fetch department work order data when department changes
  useEffect(() => {
    if (!selectedDepartment || !departmentWorkOrderRef) return;

    fetchDepartmentData();
  }, [selectedDepartment, departmentWorkOrderRef]);

  const fetchDepartmentData = async () => {
    setLoading(true);
    try {
      // Fetch the complete department work order data
      const data = await getDepartmentWorkOrderById(departmentWorkOrderRef);
      console.log('🚀 ~ fetchDepartmentData ~ data:', data);
      setDepartmentWorkOrderData(data);

      // Initialize return items based on the selected department
      if (data && data[selectedDepartment]) {
        console.log(`🚀 ~ ${selectedDepartment} data:`, data[selectedDepartment]);
        initializeReturnItems(data[selectedDepartment], selectedDepartment);
      } else {
        setReturnItems([]);
      }
    } catch (error) {
      console.error('Error fetching department data:', error);
      setAlert({
        open: true,
        message: 'Failed to fetch department data',
        severity: 'error',
      });
      setDepartmentWorkOrderData(null);
      setReturnItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize return items based on department data structure
  const initializeReturnItems = (data, department) => {
    if (!data) return;

    let items = [];

    if (department === 'fabric') {
      // Fabric is an array of items
      items = data.map((item, index) => ({
        codeId: item.code?._id?.toString() || item.code?.toString(),
        name: item.code?.name || item.name || `Fabric Item ${index + 1}`,
        issuedWeight: item.issuedWeight || 0,
        returnedWeight: item.returnedWeight || 0,
        newReturnedWeight: 0,
        availableToReturn: (item.issuedWeight || 0) - (item.returnedWeight || 0),
      }));
    } else if (department === 'trims' || department === 'finishing') {
      // Single object with products array
      items = (data.products || []).map((product, index) => ({
        productId: product.productId?._id?.toString() || product.productId?.toString(),
        name: product.productId?.itemCode || product.productId?.name || `Product ${index + 1}`,
        issuedQuantity: product.trimsQuantity || product.issuedQuantity || 0,
        returnedQuantity: product.returnedQuantity || 0,
        newReturnedQuantity: 0,
        availableToReturn:
          (product.trimsQuantity || product.issuedQuantity || 0) - (product.returnedQuantity || 0),
      }));
    } else if (department === 'stitching') {
      // Array of days/lines with their own products
      const productMap = new Map();

      data.forEach((entry) => {
        if (entry.products && entry.products.length) {
          entry.products.forEach((product) => {
            const productId = product.productId?._id?.toString() || product.productId?.toString();
            if (productMap.has(productId)) {
              // Sum up quantities if product already exists
              const existing = productMap.get(productId);
              existing.issuedQuantity += product.trimsQuantity || 0; // Use trimsQuantity instead of issuedQuantity
              existing.returnedQuantity += product.returnedQuantity || 0;
            } else {
              // Add new product if it doesn't exist
              productMap.set(productId, {
                productId: productId,
                name:
                  product.productId?.itemCode ||
                  product.productId?.name ||
                  `Product ${productMap.size + 1}`, // Use itemCode
                issuedQuantity: product.trimsQuantity || 0, // Use trimsQuantity instead of issuedQuantity
                returnedQuantity: product.returnedQuantity || 0,
                newReturnedQuantity: 0,
              });
            }
          });
        }
      });

      items = Array.from(productMap.values()).map((item) => ({
        ...item,
        availableToReturn: item.issuedQuantity - item.returnedQuantity,
      }));
    }

    setReturnItems(items);
  };

  // Handle input change for return quantities
  const handleReturnChange = (index, value, field) => {
    const updatedItems = [...returnItems];
    const numValue = Number.parseFloat(value) || 0;

    // Validate that return amount doesn't exceed available amount
    const maxReturn = updatedItems[index].availableToReturn;
    if (numValue > maxReturn) {
      setAlert({
        open: true,
        message: `Cannot return more than available amount (${maxReturn})`,
        severity: 'warning',
      });
      return;
    }

    updatedItems[index][field] = numValue;
    setReturnItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedDepartment || !departmentWorkOrderRef) {
      setAlert({
        open: true,
        message: 'Please select a department and ensure work order is valid',
        severity: 'error',
      });
      return;
    }

    // Prepare data based on department
    let returnedGoods = [];
    if (selectedDepartment === 'fabric') {
      returnedGoods = returnItems
        .filter((item) => item.newReturnedWeight > 0)
        .map((item) => ({
          codeId: item.codeId,
          returnedWeight: item.returnedWeight + item.newReturnedWeight,
        }));
    } else {
      returnedGoods = returnItems
        .filter((item) => item.newReturnedQuantity > 0)
        .map((item) => ({
          productId: item.productId,
          returnedQuantity: item.returnedQuantity + item.newReturnedQuantity,
        }));
    }

    if (returnedGoods.length === 0) {
      setAlert({
        open: true,
        message: 'Please enter at least one return quantity',
        severity: 'warning',
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await updateReturnedGoods(
        departmentWorkOrderRef,
        selectedDepartment,
        returnedGoods,
      );
      setAlert({
        open: true,
        message: result || 'Goods returned successfully',
        severity: 'success',
      });

      // Refresh data after successful submission
      await fetchDepartmentData();
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Failed to return goods',
        severity: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Breadcrumb
          title="Return Goods"
          items={[
            { to: `/${userType}/dashboard`, title: 'Dashboard' },
            { to: `/${userType}/work-orders`, title: 'Work Orders' },
            { to: `/${userType}/work-orders/${workOrderId}`, title: 'Work Order Details' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom mt={2}>
          Return Goods
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Work Order ID: {workOrderId}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="department-select-label">Select Department</InputLabel>
            <Select
              labelId="department-select-label"
              id="department-select"
              value={selectedDepartment}
              label="Select Department"
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept.value} value={dept.value}>
                  {dept.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : selectedDepartment && returnItems.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              {selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1)} Department
              Items
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell>Item Name</TableCell>
                    <TableCell align="right">
                      {selectedDepartment === 'fabric' ? 'Issued Weight' : 'Issued Quantity'}
                    </TableCell>
                    <TableCell align="right">
                      {selectedDepartment === 'fabric'
                        ? 'Previously Returned'
                        : 'Previously Returned'}
                    </TableCell>
                    <TableCell align="right">
                      {selectedDepartment === 'fabric'
                        ? 'Available to Return'
                        : 'Available to Return'}
                    </TableCell>
                    <TableCell align="right">
                      {selectedDepartment === 'fabric' ? 'Return Weight' : 'Return Quantity'}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returnItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">
                        {selectedDepartment === 'fabric' ? item.issuedWeight : item.issuedQuantity}
                      </TableCell>
                      <TableCell align="right">
                        {selectedDepartment === 'fabric'
                          ? item.returnedWeight
                          : item.returnedQuantity}
                      </TableCell>
                      <TableCell align="right" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {item.availableToReturn}
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          InputProps={{
                            inputProps: {
                              min: 0,
                              max: item.availableToReturn,
                              step: selectedDepartment === 'fabric' ? 0.01 : 1,
                            },
                          }}
                          value={
                            selectedDepartment === 'fabric'
                              ? item.newReturnedWeight
                              : item.newReturnedQuantity
                          }
                          onChange={(e) =>
                            handleReturnChange(
                              index,
                              e.target.value,
                              selectedDepartment === 'fabric'
                                ? 'newReturnedWeight'
                                : 'newReturnedQuantity',
                            )
                          }
                          disabled={item.availableToReturn <= 0}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate(`/${userType}/work-orders/${workOrderId}`)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={submitting}
                sx={{ backgroundImage: 'linear-gradient(black, black)', color: 'white' }}
              >
                {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Returns'}
              </Button>
            </Box>
          </>
        ) : selectedDepartment ? (
          <Alert severity="info">No items available for return in the selected department</Alert>
        ) : (
          <Alert severity="info">Please select a department to continue</Alert>
        )}
      </Paper>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReturnGoods;
