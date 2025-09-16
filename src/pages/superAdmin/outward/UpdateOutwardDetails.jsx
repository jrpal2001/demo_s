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
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { fetchOutwardById, updateOutwardIssuedStatus } from '@/api/outward.api';
import { toast } from 'react-toastify';
import { fetchLotsByInventory } from '@/api/lot.api';

const UpdateOutward = () => {
  const { department, id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
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
    { to: `/${userType}/outward`, title: 'Outward Management' },
    { title: 'Update Outward' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchOutwardById(department, id);

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
      const response = await fetchLotsByInventory(department, itemCodeId);
      console.log('🚀 ~ fetchLotsForItem ~ response:', response);

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
    navigate(`/${userType}/outward`);
  };

  const handleView = () => {
    navigate(`/${userType}/outward/${department}/${id}`);
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

  // Lot quantity change handler with proper isolation per item
  const handleLotQuantityChange = (itemId, lotName, value) => {
    const numValue = Number.parseInt(value, 10) || 0;

    // Update the specific lot's selected quantity for the specific item only
    setItemLots((prevItemLots) => {
      // Create a deep copy to avoid mutations
      const updatedItemLots = { ...prevItemLots };

      // Only update lots for the specific item
      if (updatedItemLots[itemId]) {
        updatedItemLots[itemId] = updatedItemLots[itemId].map((lot) =>
          lot.lotName === lotName ? { ...lot, selectedQuantity: numValue } : lot,
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
        lot.lotName === lotName ? { ...lot, selectedQuantity: numValue } : lot,
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
          lotId: lot.lotName,
          lotName: lot.lotName,
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
    const hasItemsToIssue = formData.items.some((item) => {
      // Check for regular issue quantity
      const hasIssueQuantity = item.currentIssueQuantity > 0;

      return hasIssueQuantity;
    });

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

        if (lots.length > 0 && totalLotQuantity !== item.currentIssueQuantity) {
          setError(
            `The total lot quantity (${totalLotQuantity}) for item ${item.code} does not match the issue quantity (${item.currentIssueQuantity})`,
          );
          return false;
        }

        // Check if any lot exceeds available quantity
        const invalidLot = lots.find((lot) => (lot.selectedQuantity || 0) > lot.quantity);
        if (invalidLot) {
          setError(
            `Cannot issue more than available quantity (${invalidLot.quantity}) from lot ${invalidLot.lotName}`,
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
          .filter((item) => {
            // Include if there's issue quantity
            const hasIssueQuantity = item.currentIssueQuantity > 0;
            return hasIssueQuantity;
          })
          .map((item) => ({
            _id: item._id,
            issuedQuantity: item.currentIssueQuantity,
            notes: item.notes || '',
            lots: item.lots || [], // Include lot information
          })),
      };

      // Call API
      const response = await updateOutwardIssuedStatus(department, id, updateData);

      if (
        response &&
        (response.success || response.status === 200 || response.status === 'success')
      ) {
        toast.success('Outward record updated successfully');
        // Navigate to view page
        navigate(`/${userType}/outward/${department}/${id}`);
      } else {
        throw new Error(response?.message || 'Failed to update outward record');
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update outward record';

      // If the error message contains "success", it's likely a misinterpreted success response
      if (errorMessage.toLowerCase().includes('success')) {
        toast.success(errorMessage);
        // Navigate to view page after a short delay
        setTimeout(() => {
          navigate(`/${userType}/outward/view/${department}/${id}`);
        }, 1000);
      } else {
        toast.error(errorMessage);
        setError(errorMessage);
      }
      console.error('Error updating outward:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Update Outward" description="Update outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!outward) {
    return (
      <PageContainer title="Update Outward" description="Update outward details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6" color="error">
            Outward record not found
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  // Extract work order and job card info
  const workOrderId =
    outward.workOrderRef?.workOrderId ||
    (typeof outward.workOrderRef === 'string' ? outward.workOrderRef : '-');

  const jobCardNo =
    outward.workOrderRef?.jobCardNo ||
    outward.jobCardRef?.jobCardNo ||
    (typeof outward.jobCardRef === 'string' ? outward.jobCardRef : '-');

  return (
    <PageContainer title="Update Outward" description="Update outward details">
      <Breadcrumb title="Update Outward" items={BCrumb} />

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
            Update {department.charAt(0).toUpperCase() + department.slice(1)} Outward
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Work Order:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {workOrderId}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" color="text.secondary">
                Job Card:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {jobCardNo}
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
                    console.log('🚀 ~ formData.items.map ~ item:', item);
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
                                            <TableCell>Lot Name</TableCell>
                                            <TableCell align="right">Available Quantity</TableCell>
                                            <TableCell align="right">Issue Quantity</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {(itemLots[item._id] || []).map((lot) => (
                                            <TableRow key={lot.lotName}>
                                              <TableCell>{lot.lotName}</TableCell>
                                              <TableCell align="right">{lot.quantity}</TableCell>
                                              <TableCell align="right">
                                                <TextField
                                                  type="number"
                                                  value={lot.selectedQuantity || 0}
                                                  onChange={(e) =>
                                                    handleLotQuantityChange(
                                                      item._id,
                                                      lot.lotName,
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

          {formData.items &&
            formData.items.some((item) => item.issueLogs && item.issueLogs.length > 0) && (
              <>
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Previous Issue Logs
                </Typography>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item Code</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell>Issued At</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.items.map(
                        (item) =>
                          item.issueLogs &&
                          item.issueLogs.map((log, logIndex) => (
                            <TableRow key={`${item._id}-log-${logIndex}`}>
                              <TableCell>{item.code}</TableCell>
                              <TableCell align="right">{log.quantity}</TableCell>
                              <TableCell>
                                {new Date(log.issuedAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </TableCell>
                              <TableCell>{log.notes || '-'}</TableCell>
                            </TableRow>
                          )),
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

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

export default UpdateOutward;
