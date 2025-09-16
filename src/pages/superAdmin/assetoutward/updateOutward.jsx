'use client';

import React from 'react';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { IconArrowLeft, IconDeviceFloppy, IconEye, IconChevronDown } from '@tabler/icons';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { fetchNewOutwardById, updateNewOutwardIssuedStatus } from '@/api/assetOutward.api';
import { fetchLotsByAssetInventory } from '@/api/assetlot.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const UpdateNewOutward = () => {
  const userType = useSelector(selectCurrentUserType);
  const { department, id } = useParams();
  const navigate = useNavigate();
  const [outward, setOutward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    issued: false,
    issuedOn: new Date(),
    issuedBy: '',
    items: [],
    outwardedTo: '',
  });
  const [error, setError] = useState('');
  const [itemLots, setItemLots] = useState({}); // Store lots for each item
  const [loadingLots, setLoadingLots] = useState({}); // Track loading state for each item's lots

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-outward`, title: 'New Outward Management' },
    { title: 'Update Outward' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchNewOutwardById(department, id);

        if (response && response.data) {
          const outwardData = response.data;
          setOutward(outwardData);

          // Initialize form data
          setFormData({
            issued: outwardData.issued || false,
            issuedOn: outwardData.issuedOn ? new Date(outwardData.issuedOn) : new Date(),
            issuedBy: outwardData.issuedBy || '',
            outwardedTo: outwardData.outwardedTo || '',
            items:
              outwardData.items?.map((item) => ({
                _id: item._id,
                itemCode: item.itemCode,
                code: item.code || '',
                requestedQuantity: item.requestedQuantity,
                issuedQuantity: item.issuedQuantity || 0,
                unit: item.unit || '',
                // Add current issue quantity and notes for new issues
                currentIssueQuantity: 0,
                notes: '',
                // Store existing issue logs
                issueLogs: item.issueLogs || [],
                // Initialize empty lots array for this item
                lots: [],
              })) || [],
          });

          // Fetch lots for each item
          if (outwardData.items && outwardData.items.length > 0) {
            outwardData.items.forEach((item) => {
              if (item.itemCode) {
                fetchLotsForItem(item.itemCode, item._id);
              }
            });
          }
        } else {
          toast.error('Failed to fetch outward details');
          setError('Failed to fetch outward details');
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
        setError(`Error: ${error.message}`);
        console.error('Error fetching outward details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (department && id) {
      fetchData();
    }
  }, [department, id]);

  const fetchLotsForItem = async (itemCodeId, itemId) => {
    try {
      setLoadingLots((prev) => ({ ...prev, [itemId]: true }));
      const response = await fetchLotsByAssetInventory(itemCodeId);

      if (response && response.lots) {
        setItemLots((prev) => ({
          ...prev,
          [itemId]: response.lots.map((lot) => ({
            ...lot,
            selectedQuantity: 0, // Initialize selected quantity to 0
          })),
        }));
      }
    } catch (error) {
      console.error(`Error fetching lots for item ${itemCodeId}:`, error);
      toast.error(`Failed to fetch lots for item`);
    } finally {
      setLoadingLots((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const handleBack = () => {
    navigate(`/${userType}/asset-outward`);
  };

  const handleView = () => {
    navigate(`/${userType}/asset-outward/view/${department}/${id}`);
  };

  const handleIssuedChange = (event) => {
    setFormData({
      ...formData,
      issued: event.target.checked,
    });
  };

  const handleIssuedOnChange = (newDate) => {
    setFormData({
      ...formData,
      issuedOn: newDate,
    });
  };

  const handleIssuedByChange = (event) => {
    setFormData({
      ...formData,
      issuedBy: event.target.value,
    });
  };

  const handleCurrentIssueQuantityChange = (itemId, value) => {
    const numValue = Number.parseInt(value, 10) || 0;

    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item._id === itemId ? { ...item, currentIssueQuantity: numValue } : item,
      ),
    });
  };

  const handleItemNotesChange = (itemId, value) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) => (item._id === itemId ? { ...item, notes: value } : item)),
    });
  };

  const handleOutwardedToChange = (event) => {
    setFormData({
      ...formData,
      outwardedTo: event.target.value,
    });
  };

  // FIXED: This function now properly isolates lot quantity changes per item
  const handleLotQuantityChange = (itemId, lotNo, value) => {
    const numValue = Number.parseInt(value, 10) || 0;

    // Update the specific lot's selected quantity for the specific item only
    setItemLots((prevItemLots) => {
      // Create a deep copy to avoid mutations
      const updatedItemLots = { ...prevItemLots };

      // Only update lots for the specific item
      if (updatedItemLots[itemId]) {
        updatedItemLots[itemId] = updatedItemLots[itemId].map((lot) =>
          lot.lotNo === lotNo ? { ...lot, selectedQuantity: numValue } : lot,
        );
      }

      return updatedItemLots;
    });

    // Update formData separately to avoid race conditions
    setFormData((prevFormData) => {
      // Get the current lots for this specific item
      const currentItemLots = itemLots[itemId] || [];

      // Update the specific lot's quantity
      const updatedLots = currentItemLots.map((lot) =>
        lot.lotNo === lotNo ? { ...lot, selectedQuantity: numValue } : lot,
      );

      // Calculate total selected quantity for this item only
      const totalSelectedQuantity = updatedLots.reduce(
        (sum, lot) => sum + (lot.selectedQuantity || 0),
        0,
      );

      // Create the lots array for the form data (only lots with quantity > 0)
      const lotsForFormData = updatedLots
        .filter((lot) => (lot.selectedQuantity || 0) > 0)
        .map((lot) => ({
          lotId: lot.lotNo,
          lotNo: lot.lotNo,
          quantity: lot.selectedQuantity,
        }));

      return {
        ...prevFormData,
        items: prevFormData.items.map(
          (item) =>
            item._id === itemId
              ? {
                  ...item,
                  currentIssueQuantity: totalSelectedQuantity,
                  lots: lotsForFormData,
                }
              : item, // Keep other items unchanged
        ),
      };
    });
  };

  const validateForm = () => {
    if (formData.issued && !formData.issuedBy) {
      setError('Please enter who issued the items');
      return false;
    }

    if (formData.issued && !formData.outwardedTo) {
      setError('Please enter who the items were outwarded to');
      return false;
    }

    // Check if any items have quantities to issue
    const hasItemsToIssue = formData.items.some((item) => item.currentIssueQuantity > 0);

    if (formData.issued && !hasItemsToIssue) {
      setError('Please enter at least one item quantity to issue');
      return false;
    }

    // Validate lot quantities for each item
    for (const item of formData.items) {
      if (item.currentIssueQuantity > 0) {
        // If item has lots, make sure lot quantities are specified
        const lots = itemLots[item._id] || [];
        const totalLotQuantity = lots.reduce((sum, lot) => sum + (lot.selectedQuantity || 0), 0);

        if (totalLotQuantity !== item.currentIssueQuantity) {
          setError(
            `The total lot quantity (${totalLotQuantity}) for item ${item.code} does not match the issue quantity (${item.currentIssueQuantity})`,
          );
          return false;
        }

        // Check if any lot exceeds available quantity
        const invalidLot = lots.find((lot) => (lot.selectedQuantity || 0) > lot.quantity);
        if (invalidLot) {
          setError(
            `Cannot issue more than available quantity (${invalidLot.quantity}) from lot ${invalidLot.lotNo}`,
          );
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');

      // Validate form
      if (!validateForm()) {
        setSaving(false);
        return;
      }

      // Prepare data for API
      const updateData = {
        issued: formData.issued,
        issuedOn: formData.issued ? formData.issuedOn.toISOString() : null,
        issuedBy: formData.issued ? formData.issuedBy : null,
        outwardedTo: formData.outwardedTo,
        items: formData.items
          .filter((item) => item.currentIssueQuantity > 0) // Only include items with quantities to issue
          .map((item) => ({
            _id: item._id,
            issuedQuantity: item.currentIssueQuantity,
            notes: item.notes || '',
            lots: item.lots || [], // Include lot information
          })),
      };

      // Call API
      const response = await updateNewOutwardIssuedStatus(department, id, updateData);
      console.log('🚀 ~ handleSubmit ~ response:', response);

      if (
        response &&
        (response.success || response.status === 200 || response.status === 'success')
      ) {
        toast.success('Outward record updated successfully');
        // Navigate to view page
        navigate(`/${userType}/asset-outward/view/${department}/${id}`);
      } else {
        throw new Error(response?.message || 'Failed to update outward record');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update outward record';
      toast.error(errorMessage);
      setError(errorMessage);
      console.error('Error updating outward:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Update New Outward" description="Update new outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!outward) {
    return (
      <PageContainer title="Update New Outward" description="Update new outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6" color="error">
            Outward record not found
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Update New Outward" description="Update new outward details">
      <Breadcrumb title="Update New Outward" items={BCrumb} />

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" startIcon={<IconArrowLeft />} onClick={handleBack}>
          Back to List
        </Button>
        <Button variant="outlined" color="secondary" startIcon={<IconEye />} onClick={handleView}>
          View Details
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Update {department?.charAt(0).toUpperCase() + department?.slice(1)} Outward
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Outward Number:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {outward.outwardNumber}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Requested On:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {new Date(outward.requestedOn).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Issue Status
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch checked={formData.issued} onChange={handleIssuedChange} color="primary" />
                }
                label="Mark as Issued"
              />
            </Grid>

            {formData.issued && (
              <>
                <Grid item xs={12} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Issued On"
                      value={formData.issuedOn}
                      onChange={handleIssuedOnChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    label="Issued By"
                    value={formData.issuedBy}
                    onChange={handleIssuedByChange}
                    fullWidth
                    required
                    error={formData.issued && !formData.issuedBy}
                    helperText={formData.issued && !formData.issuedBy ? 'Required field' : ''}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Items ({formData.items?.length || 0})
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item Code</TableCell>
                  <TableCell align="right">Requested Quantity</TableCell>
                  <TableCell align="right">Previously Issued</TableCell>
                  <TableCell align="right">Issue Now</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right">Total Issued</TableCell>
                  <TableCell>Unit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.items &&
                  formData.items.map((item, index) => {
                    const previouslyIssued = item.issueLogs.reduce(
                      (sum, log) => sum + log.quantity,
                      0,
                    );
                    const totalIssued = previouslyIssued + (item.currentIssueQuantity || 0);
                    const remainingToIssue = item.requestedQuantity - previouslyIssued;
                    const lots = itemLots[item._id] || [];
                    const hasLots = lots.length > 0;

                    return (
                      <React.Fragment key={item._id || index}>
                        <TableRow>
                          <TableCell>{item.code}</TableCell>
                          <TableCell align="right">{item.requestedQuantity}</TableCell>
                          <TableCell align="right">{previouslyIssued}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.currentIssueQuantity}
                              onChange={(e) =>
                                handleCurrentIssueQuantityChange(item._id, e.target.value)
                              }
                              inputProps={{
                                min: 0,
                                max: remainingToIssue,
                                style: { textAlign: 'right' },
                              }}
                              variant="outlined"
                              size="small"
                              sx={{ width: '100px' }}
                              disabled={!formData.issued || remainingToIssue <= 0 || hasLots}
                            />
                            {hasLots && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                (Based on lot selection)
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <TextField
                              placeholder="Add notes"
                              value={item.notes}
                              onChange={(e) => handleItemNotesChange(item._id, e.target.value)}
                              variant="outlined"
                              size="small"
                              fullWidth
                              disabled={!formData.issued || item.currentIssueQuantity <= 0}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              color={totalIssued > item.requestedQuantity ? 'error' : 'inherit'}
                              fontWeight={totalIssued > item.requestedQuantity ? 'bold' : 'normal'}
                            >
                              {totalIssued}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.unit || '-'}</TableCell>
                        </TableRow>

                        {/* Lot selection row */}
                        {formData.issued && remainingToIssue > 0 && (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ py: 0 }}>
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={<IconChevronDown />}
                                  sx={{ backgroundColor: 'background.subtle' }}
                                >
                                  <Typography>
                                    Select Lots for {item.code}
                                    {hasLots
                                      ? ` (${lots.length} lots available)`
                                      : ' (No lots available)'}
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {loadingLots[item._id] ? (
                                    <Box display="flex" justifyContent="center" p={2}>
                                      <CircularProgress size={24} />
                                    </Box>
                                  ) : hasLots ? (
                                    <TableContainer>
                                      <Table size="small">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Lot No</TableCell>
                                            <TableCell align="right">Available Quantity</TableCell>
                                            <TableCell align="right">Issue Quantity</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {(itemLots[item._id] || []).map((lot) => (
                                            <TableRow key={lot.lotNo}>
                                              <TableCell>{lot.lotNo}</TableCell>
                                              <TableCell align="right">{lot.quantity}</TableCell>
                                              <TableCell align="right">
                                                <TextField
                                                  type="number"
                                                  value={lot.selectedQuantity || 0}
                                                  onChange={(e) =>
                                                    handleLotQuantityChange(
                                                      item._id,
                                                      lot.lotNo,
                                                      e.target.value,
                                                    )
                                                  }
                                                  inputProps={{
                                                    min: 0,
                                                    max: lot.quantity,
                                                    style: { textAlign: 'right' },
                                                  }}
                                                  variant="outlined"
                                                  size="small"
                                                  sx={{ width: '80px' }}
                                                  disabled={!formData.issued}
                                                />
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                          <TableRow>
                                            <TableCell colSpan={2} align="right">
                                              <Typography fontWeight="bold">
                                                Total Selected:
                                              </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                              <Chip
                                                label={(itemLots[item._id] || []).reduce(
                                                  (sum, lot) => sum + (lot.selectedQuantity || 0),
                                                  0,
                                                )}
                                                color={
                                                  (itemLots[item._id] || []).reduce(
                                                    (sum, lot) => sum + (lot.selectedQuantity || 0),
                                                    0,
                                                  ) > remainingToIssue
                                                    ? 'error'
                                                    : 'primary'
                                                }
                                              />
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  ) : (
                                    <Alert severity="info">No lots available for this item</Alert>
                                  )}
                                </AccordionDetails>
                              </Accordion>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                {(!formData.items || formData.items.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Outwarded To"
                value={formData.outwardedTo}
                onChange={handleOutwardedToChange}
                fullWidth
                required={formData.issued}
                error={formData.issued && !formData.outwardedTo}
                helperText={formData.issued && !formData.outwardedTo ? 'Required field' : ''}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconDeviceFloppy />}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default UpdateNewOutward;
