'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ParentCard from '@/components/shared/ParentCard';
import { getWorkOrderById, closeWorkOrder, switchWorkOrderStatus } from '@/api/workorder.api';
import ViewWorkorderDepartmentDetails from './ViewWorkorderDepartmentDetails';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import TrimsCardGenerator from './TrimCard';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const ViewWorkOrderDetails = () => {
  const userType = useSelector(selectCurrentUserType);
  console.log('🚀 ~ ViewWorkOrderDetails ~ userType:', userType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/work-orders`, title: 'Work Orders' },
    { title: 'View' },
  ];
  const navigate = useNavigate();
  const { workOrderId } = useParams();
  const id = workOrderId;
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [closingWorkOrder, setClosingWorkOrder] = useState(false);

  // Add state for status switch
  const [switchingStatus, setSwitchingStatus] = useState(false);
  const [statusToSwitch, setStatusToSwitch] = useState('');
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const validStatuses = ['pending', 'in_progress', 'completed', 'on_hold', 'approval_required'];

  // Move fetchWorkOrder to component scope
  const fetchWorkOrder = async () => {
    try {
      setLoading(true);
      const data = await getWorkOrderById(id);
      setWorkOrder(data);
      setLoading(false);
    } catch (error) {
      setError(error.message || 'Failed to fetch work order details');
      toast.error(error.message || 'Failed to fetch work order details');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchWorkOrder();
    }
  }, [id]);

  const handleBack = () => {
    navigate(`/${userType}/work-orders`);
  };

  const handleViewDepartment = (department) => {
    navigate(`/${userType}/work-orders/${id}/department/${department}`);
  };

  const handleViewAllDepartments = () => {
    navigate(`/${userType}/work-orders/${id}/department/all`);
  };

  const handleCloseWorkOrder = () => {
    setCloseDialogOpen(true);
  };

  const handleConfirmClose = async () => {
    try {
      setClosingWorkOrder(true);
      await closeWorkOrder(id);
      toast.success('Work order closed successfully');
      setCloseDialogOpen(false);
      // Refresh the work order data
      const data = await getWorkOrderById(id);
      setWorkOrder(data);
    } catch (error) {
      console.error('Error closing work order:', error);
      toast.error(error.message || 'Failed to close work order');
    } finally {
      setClosingWorkOrder(false);
    }
  };

  const handleCancelClose = () => {
    setCloseDialogOpen(false);
  };

  const handleSwitchStatus = () => {
    setShowSwitchModal(true);
  };
  const handleConfirmSwitch = async () => {
    setSwitchingStatus(true);
    try {
      await switchWorkOrderStatus(workOrder._id, statusToSwitch);
      await fetchWorkOrder();
      setShowSwitchModal(false);
      setStatusToSwitch('');
    } catch (e) {
      // handle error (toast, etc)
    } finally {
      setSwitchingStatus(false);
    }
  };
  const handleCancelSwitch = () => {
    setShowSwitchModal(false);
    setStatusToSwitch('');
  };

  if (loading) {
    return (
      <PageContainer title="View Work Order" description="View work order details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="View Work Order" description="View work order details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!workOrder) {
    return (
      <PageContainer title="View Work Order" description="View work order details">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Work order record not found</Typography>
        </Box>
      </PageContainer>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Calculate total quantity from size-wise quantities
  const calculateTotalQuantity = () => {
    if (!workOrder.sizeSpecification) return 0;

    return SIZES.reduce((total, size) => {
      return total + (workOrder.sizeSpecification[size] || 0);
    }, 0);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'on_hold':
        return 'error';
      case 'approval_required':
        return 'secondary';
      default:
        return 'default';
    }
  };

  // Format status text
  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Compact field component
  const InfoField = ({ label, value, xs = 3, md = 3 }) => (
    <Grid item xs={xs} md={md}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          height: '100%',
        }}
      >
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'medium' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {value}
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <PageContainer title="View Work Order" description="View work order details">
      <Breadcrumb title="View Work Order" items={BCrumb} />
      <ParentCard
        title={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h5">Work Order: {workOrder.workOrderId}</Typography>
              {userType === 'quality' &&
                (workOrder.workOrderClosed ? (
                  <Chip label="Work Order Closed" color="success" size="small" variant="filled" />
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleCloseWorkOrder}
                    disabled={closingWorkOrder}
                  >
                    {closingWorkOrder ? 'Closing...' : 'Close Work Order'}
                  </Button>
                ))}
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={formatStatus(workOrder.status)}
                color={getStatusColor(workOrder.status)}
                size="small"
              />
              {/* Status Switch Dropdown/Button - now next to status chip */}
              {!workOrder.workOrderClosed && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#232323', mr: 1 }}>
                    Change Status:
                  </Typography>
                  <select
                    value={statusToSwitch}
                    onChange={(e) => setStatusToSwitch(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      fontSize: 15,
                      border: '1px solid #B9971B',
                      borderRadius: 4,
                      background: '#fff',
                      color: '#232323',
                      fontWeight: 600,
                    }}
                  >
                    <option value="">Select...</option>
                    {validStatuses
                      .filter((s) => s !== workOrder.status)
                      .map((s) => (
                        <option key={s} value={s}>
                          {formatStatus(s)}
                        </option>
                      ))}
                  </select>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSwitchStatus}
                    disabled={!statusToSwitch || switchingStatus}
                    sx={{ ml: 1, fontWeight: 700, letterSpacing: 0.5, minWidth: 90 }}
                  >
                    Switch
                  </Button>
                </>
              )}
            </Box>
          </Box>
        }
      >
        {/* Mute the TrimsCardGenerator card */}
        {/* <TrimsCardGenerator workOrderId={workOrder._id} /> */}

        <Grid container spacing={1}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 0.5, fontWeight: 'bold' }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
          </Grid>

          <InfoField label="Work Order ID" value={workOrder.workOrderId} />
          <InfoField label="Job Card No" value={workOrder.jobCardNo} />
          <InfoField label="Product ID" value={workOrder.productId} />
          <InfoField label="Current Department" value={workOrder.currentDept || 'N/A'} />
          <InfoField label="Purpose" value={workOrder.purpose || 'N/A'} />
          <InfoField
            label="Production Instructions"
            value={workOrder.productionInstruction || 'N/A'}
          />
          <InfoField label="Quantity to be Produced" value={workOrder.quantityToBeProduced} />
          <InfoField label="Start Date" value={formatDate(workOrder.startDate)} />
          <InfoField
            label="Expected Completion"
            value={formatDate(workOrder.expectedCompletionDate)}
          />
          <InfoField label="Created At" value={formatDate(workOrder.createdAt)} />
          <InfoField label="Updated At" value={formatDate(workOrder.updatedAt)} />
          <InfoField
            label="Material Status"
            value={
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                <Chip
                  size="small"
                  label={`Fabric: ${workOrder.fabricIssued ? 'Yes' : 'No'}`}
                  color={workOrder.fabricIssued ? 'success' : 'error'}
                />
                <Chip
                  size="small"
                  label={`Trims: ${workOrder.trimsIssued ? 'Yes' : 'No'}`}
                  color={workOrder.trimsIssued ? 'success' : 'error'}
                />
                <Chip
                  size="small"
                  label={`Accessories: ${workOrder.accessoriesIssued ? 'Yes' : 'No'}`}
                  color={workOrder.accessoriesIssued ? 'success' : 'error'}
                />
              </Box>
            }
            xs={12}
            md={12}
          />

          {/* Size Specification */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5, fontWeight: 'bold' }}>
              Size Specification
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{ '& .MuiTableCell-root': { py: 0.5, px: 1 } }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center" sx={{ fontSize: '0.75rem' }}>
                        {size.toUpperCase()}
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontSize: '0.75rem' }}>
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center" sx={{ fontSize: '0.75rem' }}>
                        {workOrder.sizeSpecification?.[size] || 0}
                      </TableCell>
                    ))}
                    <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                      {calculateTotalQuantity()}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Department Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5, fontWeight: 'bold' }}>
              Department Information
            </Typography>
            <Divider sx={{ mb: 1 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'medium' }}>
                Assigned Departments
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {workOrder.assignedDepartments && workOrder.assignedDepartments.length > 0 ? (
                  workOrder.assignedDepartments.map((dept) => (
                    <Chip
                      key={dept}
                      label={dept}
                      color="primary"
                      variant="outlined"
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                      onClick={() => handleViewDepartment(dept)}
                    />
                  ))
                ) : (
                  <Typography variant="body2">None</Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, flex: 1 }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'medium' }}>
                  Department Notes
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {workOrder.departmentNotes || 'No notes'}
                </Typography>
              </Box>
              <Box sx={{ p: 1, border: '1px solid #e0e0e0', borderRadius: 1, flex: 1 }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'medium' }}>
                  Remarks
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {workOrder.remarks || 'No remarks'}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ParentCard>
      <ViewWorkorderDepartmentDetails
        workOrderId={workOrderId}
        department="all"
        departmentWorkOrderRef={workOrder.departmentWorkOrderRef}
      />

      {/* Close Work Order Confirmation Dialog */}
      <Dialog open={closeDialogOpen} onClose={handleCancelClose}>
        <DialogTitle>Close Work Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to close this work order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelClose} disabled={closingWorkOrder}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClose}
            color="error"
            variant="contained"
            disabled={closingWorkOrder}
          >
            {closingWorkOrder ? 'Closing...' : 'Close Work Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Modal for Status Switch */}
      {showSwitchModal && (
        <Dialog open onClose={handleCancelSwitch}>
          <DialogTitle>Confirm Status Switch</DialogTitle>
          <DialogContent>
            Are you sure you want to switch the status to <b>{formatStatus(statusToSwitch)}</b>?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSwitch} disabled={switchingStatus}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSwitch} color="primary" disabled={switchingStatus}>
              {switchingStatus ? 'Switching...' : 'Confirm'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </PageContainer>
  );
};

export default ViewWorkOrderDetails;
