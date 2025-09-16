'use client';

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { createSrsDispatch, getSrsDispatchesByWorkOrder } from '@/api/srsDispatch.api';
import { getStockDetailsBySkuCode } from '@/api/stock.api.js';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const UpdateLotDetailsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const rowData = state?.rowData;
  console.log('🚀 ~ UpdateLotDetailsPage ~ rowData:', rowData);

  const [stockDetails, setStockDetails] = useState(rowData || null);
  const [lots, setLots] = useState(stockDetails?.lotSpecifications || []);
  const [selectedLots, setSelectedLots] = useState({});
  const [totalSelected, setTotalSelected] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productStock, setProductStock] = useState(null);

  const [existingDispatches, setExistingDispatches] = useState(null);
  const [loadingDispatches, setLoadingDispatches] = useState(true);

  // Fetch stock details by product SKU code (productId)
  useEffect(() => {
    const getStockData = async () => {
      try {
        const stock = await getStockDetailsBySkuCode(rowData.productId);
        setProductStock(stock);
        console.log('Product stock fetched: ', stock); // Debug log
      } catch (e) {
        console.error('Error fetching stock details', e);
        toast.error('Failed to fetch stock details');
      }
    };
    if (rowData?.productId) getStockData();
  }, [rowData?.productId]);

  // Fetch existing dispatches for this work order
  useEffect(() => {
    const fetchDispatches = async () => {
      setLoadingDispatches(true);
      try {
        if (!rowData?.workOrderId) {
          setExistingDispatches(null);
          setLoadingDispatches(false);
          return;
        }
        const dispatches = await getSrsDispatchesByWorkOrder(rowData.workOrderId);
        setExistingDispatches(dispatches && dispatches.length > 0 ? dispatches : null);
      } catch (e) {
        console.error('Error fetching dispatches', e);
        toast.error('Failed to fetch existing dispatches');
      } finally {
        setLoadingDispatches(false);
      }
    };
    fetchDispatches();
  }, [rowData?.workOrderId]);

  // Sync lots with the fetched product stock's lotSpecifications
  useEffect(() => {
    if (productStock && productStock.lotSpecifications) {
      setLots(productStock.lotSpecifications);
    }
  }, [productStock]);

  // Initialize selectedLots and totalSelected whenever lots change
  useEffect(() => {
    if (lots.length) {
      const initialSelected = {};
      const initialTotals = {};
      SIZES.forEach((size) => {
        initialSelected[size] = {};
        initialTotals[size] = 0;
        lots.forEach((lot) => {
          initialSelected[size][lot.lotNumber] = 0;
        });
      });
      setSelectedLots(initialSelected);
      setTotalSelected(initialTotals);
    }
  }, [lots]);

  // Calculate total selected quantity per size whenever selectedLots is updated
  useEffect(() => {
    const newTotals = {};
    SIZES.forEach((size) => {
      newTotals[size] = Object.values(selectedLots[size] || {}).reduce(
        (sum, qty) => sum + (Number.parseInt(qty) || 0),
        0,
      );
    });
    setTotalSelected(newTotals);
  }, [selectedLots]);

  // Handle changes to quantity input for each lot and size
  const handleLotQuantityChange = (size, lotNumber, value) => {
    const numValue = Number.parseInt(value) || 0;
    const lot = lots.find((l) => l.lotNumber === lotNumber);
    const availableQty = lot?.sizeSpecifications?.[size] || 0;

    if (numValue > availableQty) {
      toast.error(
        `Cannot select more than available quantity (${availableQty}) for ${size.toUpperCase()} in lot ${lotNumber}`,
      );
      return;
    }

    setSelectedLots((prev) => ({
      ...prev,
      [size]: { ...prev[size], [lotNumber]: numValue },
    }));
  };

  // Handle form submit to create SRS dispatch
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const dispatchedLots = [];

      // Prepare dispatched lots from selectedLots
      lots.forEach((lot) => {
        const sizeQuantities = {};
        let hasQuantity = false;
        SIZES.forEach((size) => {
          const qty = selectedLots[size]?.[lot.lotNumber] || 0;
          sizeQuantities[size] = qty;
          if (qty > 0) hasQuantity = true;
        });
        if (hasQuantity) dispatchedLots.push({ lotNumber: lot.lotNumber, sizeQuantities });
      });

      if (dispatchedLots.length === 0) {
        toast.error('Please select at least one lot with quantities');
        return;
      }

      // IMPORTANT: Send `workOrderRef` and `stockRef` ObjectIds if available in productStock or rowData
      const dispatchData = {
        workOrderRef: rowData?.departmentWorkOrderRef || productStock?.workOrderRef || null, // ObjectId expected by backend
        workOrderId: rowData?.workOrderId || productStock?.workOrderId || '',
        productId:
          productStock?.productMasterRef ||
          rowData?.productMasterRef ||
          productStock?.skuCode ||
          rowData?.productId ||
          '',
        stockRef: productStock?._id || null,
        dispatchedLots,
        dispatchedBy: 'current-user',
        remarks: 'Dispatched via lot selection page',
      };

      if (!dispatchData.workOrderRef || !dispatchData.stockRef) {
        toast.error('Missing required dispatch references (work order or stock).');
        setIsSubmitting(false);
        return;
      }

      const result = await createSrsDispatch(dispatchData);
      toast.success('SRS dispatch created successfully!');
      console.log('Dispatch result:', result);
      navigate(-1);
    } catch (error) {
      console.error('Error creating SRS dispatch:', error);
      toast.error(error.message || 'Failed to create SRS dispatch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredQty = stockDetails?.sizeSpecification || {};
  const isValidSelection = SIZES.every((size) => totalSelected[size] <= (requiredQty[size] || 0));

  // Render existing dispatch lot details table
  const renderDispatchDetails = () => {
    if (!existingDispatches) return null;

    return (
      <Box p={3}>
        <Typography variant="h4" mb={2}>
          Existing Dispatch Lot Details
        </Typography>

        {existingDispatches.map((dispatch, idx) => (
          <Box key={dispatch._id} mb={4}>
            <Typography variant="h6" gutterBottom>
              Dispatch Date: {new Date(dispatch.dispatchDate).toLocaleDateString()}
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Lot Number</TableCell>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center">
                        <strong>{size.toUpperCase()}</strong>
                      </TableCell>
                    ))}
                    <TableCell align="center">Total Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dispatch.dispatchedLots.map((lot) => (
                    <TableRow key={lot.lotNumber}>
                      <TableCell>{lot.lotNumber}</TableCell>
                      {SIZES.map((size) => (
                        <TableCell key={size} align="center">
                          {lot.sizeQuantities[size] || 0}
                        </TableCell>
                      ))}
                      <TableCell align="center">
                        {lot.totalLotQuantity ||
                          Object.values(lot.sizeQuantities).reduce((a, b) => a + b, 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell>
                      <strong>Totals</strong>
                    </TableCell>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center">
                        <strong>{dispatch.sizeWiseTotal?.[size] || 0}</strong>
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <strong>{dispatch.totalQuantityDispatched || 0}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}

        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  };

  if (loadingDispatches) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  // If dispatch exists, show details, else show form
  return existingDispatches ? (
    renderDispatchDetails()
  ) : (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Update Lot Details
      </Typography>

      {stockDetails ? (
        <>
          {/* Stock Overview */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Stock Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>
                  <strong>SKU:</strong> {stockDetails.productId || '-'}
                </Typography>
                <Typography>
                  <strong>Category:</strong> {stockDetails.category || '-'}
                </Typography>
                <Typography>
                  <strong>Subcategory:</strong> {stockDetails.subcategory || '-'}
                </Typography>
                <Typography>
                  <strong>Color:</strong> {stockDetails.color || '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  <strong>Reorder Level:</strong> {stockDetails.reorderLevel || '-'}
                </Typography>
                <Typography>
                  <strong>Low Stock Alert:</strong> {stockDetails.lowStockAlertLevel || '-'}
                </Typography>
                <Chip
                  label={stockDetails.reorderStatus || '-'}
                  color={stockDetails.reorderStatus === 'OK' ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Required vs Selected Table */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Required vs Selected Quantities
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Size</TableCell>
                    <TableCell align="center">Required</TableCell>
                    <TableCell align="center">Selected</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SIZES.map((size) => (
                    <TableRow key={size}>
                      <TableCell>{size.toUpperCase()}</TableCell>
                      <TableCell align="center">{requiredQty[size] || 0}</TableCell>
                      <TableCell align="center">{totalSelected[size] || 0}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={
                            totalSelected[size] > (requiredQty[size] || 0)
                              ? 'Excess'
                              : totalSelected[size] === (requiredQty[size] || 0)
                              ? 'Complete'
                              : totalSelected[size] > 0
                              ? 'Partial'
                              : 'None'
                          }
                          color={
                            totalSelected[size] > (requiredQty[size] || 0)
                              ? 'error'
                              : totalSelected[size] === (requiredQty[size] || 0)
                              ? 'success'
                              : totalSelected[size] > 0
                              ? 'warning'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {!isValidSelection && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Selected quantities exceed required quantities.
              </Alert>
            )}
          </Box>

          {/* Lot Selection Table */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Lot Selection
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Lot Number</TableCell>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center">
                        <strong>{size.toUpperCase()}</strong>
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          Available
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lots.map((lot) => (
                    <TableRow key={lot.lotNumber}>
                      <TableCell>{lot.lotNumber}</TableCell>
                      {SIZES.map((size) => {
                        const available = lot.sizeSpecifications?.[size] || 0;
                        const selected = selectedLots[size]?.[lot.lotNumber] || 0;
                        return (
                          <TableCell key={size} align="center">
                            <Typography variant="caption" display="block" color="textSecondary">
                              {available} available
                            </Typography>
                            <TextField
                              type="number"
                              size="small"
                              value={selected}
                              onChange={(e) =>
                                handleLotQuantityChange(size, lot.lotNumber, e.target.value)
                              }
                              inputProps={{
                                min: 0,
                                max: available,
                                style: { textAlign: 'center', width: '60px' },
                              }}
                              disabled={available === 0}
                            />
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!isValidSelection || Object.values(totalSelected).every((q) => q === 0)}
            >
              Create SRS Dispatch
            </LoadingButton>
          </Box>
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default UpdateLotDetailsPage;
