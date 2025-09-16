'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { createSrsDispatch } from '@/api/srsDispatch.api';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const UpdateLotDetailsModal = ({
  open,
  onClose,
  skuCode,
  requiredQuantities, // This should be an object with size breakdowns
  onLotSelectionComplete,
  getStockDetailsBySkuCode,
  sizeSpecification,
}) => {
  console.log('🚀 ~ UpdateLotDetailsModal ~ sizeSpecification:', sizeSpecification);
  const [stockDetails, setStockDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLots, setSelectedLots] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalSelected, setTotalSelected] = useState({});

  // Fetch stock details when modal opens
  useEffect(() => {
    if (open && skuCode) {
      fetchStockDetails();
    }
  }, [open, skuCode]);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const data = await getStockDetailsBySkuCode(skuCode);
      setStockDetails(data);
    } catch (error) {
      console.error('Error fetching stock details:', error);
      toast.error('Failed to fetch stock details');
    } finally {
      setLoading(false);
    }
  };

  // Initialize selected lots state
  useEffect(() => {
    if (stockDetails?.lotSpecifications) {
      const initialSelected = {};
      const initialTotals = {};

      SIZES.forEach((size) => {
        initialSelected[size] = {};
        initialTotals[size] = 0;

        stockDetails.lotSpecifications.forEach((lot) => {
          initialSelected[size][lot.lotNumber] = 0;
        });
      });

      setSelectedLots(initialSelected);
      setTotalSelected(initialTotals);
    }
  }, [stockDetails]);

  // Calculate totals when selections change
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

  const handleLotQuantityChange = (size, lotNumber, value) => {
    const numValue = Number.parseInt(value) || 0;
    const lot = stockDetails.lotSpecifications.find((l) => l.lotNumber === lotNumber);
    const availableQty = lot?.sizeSpecifications?.[size] || 0;

    if (numValue > availableQty) {
      toast.error(
        `Cannot select more than available quantity (${availableQty}) for ${size.toUpperCase()} in lot ${lotNumber}`,
      );
      return;
    }

    setSelectedLots((prev) => ({
      ...prev,
      [size]: {
        ...prev[size],
        [lotNumber]: numValue,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Prepare dispatched lots data
      const dispatchedLots = [];

      stockDetails.lotSpecifications.forEach((lot) => {
        const sizeQuantities = {};
        let hasQuantity = false;

        SIZES.forEach((size) => {
          const qty = selectedLots[size]?.[lot.lotNumber] || 0;
          sizeQuantities[size] = qty;
          if (qty > 0) hasQuantity = true;
        });

        if (hasQuantity) {
          dispatchedLots.push({
            lotNumber: lot.lotNumber,
            sizeQuantities,
          });
        }
      });

      if (dispatchedLots.length === 0) {
        toast.error('Please select at least one lot with quantities');
        return;
      }

      const dispatchData = {
        workOrderId: 'WO-' + Date.now(), // You may want to pass this as a prop
        productId: stockDetails.productId || stockDetails._id,
        dispatchedLots,
        dispatchedBy: 'current-user', // You may want to get this from auth context
        remarks: 'Dispatched via lot selection modal',
      };

      console.log('[v0] Calling createSrsDispatch with data:', dispatchData);
      const result = await createSrsDispatch(dispatchData);
      console.log('[v0] SRS dispatch created successfully:', result);

      toast.success('SRS dispatch created successfully!');

      // Call the completion handler with selected lots and stock details
      await onLotSelectionComplete(dispatchedLots, stockDetails);
      onClose();
    } catch (error) {
      console.error('Error creating SRS dispatch:', error);
      toast.error(error.message || 'Failed to create SRS dispatch');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRequiredQuantities = () => {
    const required = {};
    SIZES.forEach((size) => {
      required[size] = sizeSpecification?.[size] || 0;
    });
    return required;
  };

  const requiredQty = getRequiredQuantities();
  const isValidSelection = SIZES.every((size) => totalSelected[size] <= requiredQty[size]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Update Lot Details</Typography>
        {stockDetails && (
          <Typography variant="subtitle1" color="textSecondary">
            SKU: {stockDetails.skuCode} | Total Stock: {stockDetails.currentQuantity}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : stockDetails ? (
          <>
            {/* Stock Overview */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Stock Overview
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 xs={6}>
                  <Typography>
                    <strong>Category:</strong> {stockDetails.category}
                  </Typography>
                  <Typography>
                    <strong>Subcategory:</strong> {stockDetails.subcategory}
                  </Typography>
                  <Typography>
                    <strong>Color:</strong> {stockDetails.color}
                  </Typography>
                </Grid2>
                <Grid2 xs={6}>
                  <Typography>
                    <strong>Reorder Level:</strong> {stockDetails.reorderLevel}
                  </Typography>
                  <Typography>
                    <strong>Low Stock Alert:</strong> {stockDetails.lowStockAlertLevel}
                  </Typography>
                  <Chip
                    label={stockDetails.reorderStatus}
                    color={stockDetails.reorderStatus === 'OK' ? 'success' : 'warning'}
                    size="small"
                  />
                </Grid2>
              </Grid2>
            </Box>

            {/* Required vs Selected Summary */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Required vs Selected Quantities
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Size</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Required</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Selected</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {SIZES.map((size) => (
                      <TableRow key={size}>
                        <TableCell>{size.toUpperCase()}</TableCell>
                        <TableCell align="center">{requiredQty[size]}</TableCell>
                        <TableCell align="center">{totalSelected[size] || 0}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              totalSelected[size] > requiredQty[size]
                                ? 'Excess'
                                : totalSelected[size] === requiredQty[size]
                                ? 'Complete'
                                : totalSelected[size] > 0
                                ? 'Partial'
                                : 'None'
                            }
                            color={
                              totalSelected[size] > requiredQty[size]
                                ? 'error'
                                : totalSelected[size] === requiredQty[size]
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
            </Box>

            {!isValidSelection && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Selected quantities exceed required quantities for some sizes. Please adjust your
                selection.
              </Alert>
            )}

            {/* Lot Selection Table */}
            <Typography variant="h6" gutterBottom>
              Lot Selection
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Lot Number</strong>
                    </TableCell>
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
                  {stockDetails.lotSpecifications?.map((lot) => (
                    <TableRow key={lot.lotNumber}>
                      <TableCell>
                        <Typography variant="subtitle2">{lot.lotNumber}</Typography>
                      </TableCell>
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
          </>
        ) : (
          <Typography>No stock details available</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={isSubmitting}
          variant="contained"
          disabled={
            !stockDetails ||
            !isValidSelection ||
            Object.values(totalSelected).every((qty) => qty === 0)
          }
        >
          Create SRS Dispatch
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateLotDetailsModal;
