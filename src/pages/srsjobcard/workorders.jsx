import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { getSrsJobCardById } from '@/api/srsjobcard.api';
import { getWorkOrdersByJobCardId } from '@/api/workorder.api';
import { toast } from 'react-toastify';
import PageContainer from '@/components/container/PageContainer';
import Spinner from '@/components/common/spinner/Spinner';

const SrsJobCardWorkOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [jobCard, setJobCard] = useState(null);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workOrdersLoading, setWorkOrdersLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [workOrderDetailsOpen, setWorkOrderDetailsOpen] = useState(false);

  useEffect(() => {
    fetchJobCard();
    fetchWorkOrders();
  }, [id, page, search]);

  const fetchJobCard = async () => {
    try {
      const data = await getSrsJobCardById(id);
      setJobCard(data);
    } catch (error) {
      console.error('Error fetching job card:', error);
      toast.error('Failed to fetch job card details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkOrders = async () => {
    setWorkOrdersLoading(true);
    try {
      const response = await getWorkOrdersByJobCardId(id, page, limit, search);
      console.log('🚀 ~ fetchWorkOrders ~ response:', response);

      // Extract data from the correct response structure
      const workOrdersData = response.data || [];
      setWorkOrders(workOrdersData);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching work orders:', error);
      toast.error('Failed to fetch work orders');
    } finally {
      setWorkOrdersLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleViewWorkOrder = (workOrder) => {
    setSelectedWorkOrder(workOrder);
    setWorkOrderDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <PageContainer title="Job Card Work Orders" description="View work orders for SRS job card">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Spinner />
        </Box>
      </PageContainer>
    );
  }

  if (!jobCard) {
    return (
      <PageContainer title="Job Card Work Orders" description="View work orders for SRS job card">
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Job card not found
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Job Card Work Orders" description="View work orders for SRS job card">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/${userType}/srs-jobcard/view/${id}`)}
            >
              Back to Job Card
            </Button>
            <Typography variant="h4" component="h1">
              Work Orders - {jobCard.jobCardNo}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/${userType}/job-card/workorder/${id}`)}
          >
            Create Work Order
          </Button>
        </Box>

        {/* Job Card Summary */}
        <Card mb={3}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {jobCard.jobCardNo}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Customer: {jobCard.customerName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Products: {jobCard.products?.length || 0} | Total Quantity:{' '}
                  {jobCard.totalQuantity || 0}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} textAlign="right">
                <Chip
                  label={jobCard.status?.replace('_', ' ')}
                  color={getStatusColor(jobCard.status)}
                  size="large"
                />
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Created: {formatDate(jobCard.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card mb={3}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Search Work Orders"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by work order ID or description"
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setSearch('');
                    setPage(0);
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Work Orders Table */}
        <Card>
          <CardContent>
            {workOrdersLoading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <Spinner />
              </Box>
            ) : (
              <>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Work Order ID</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Assigned To</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Created Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workOrders.map((workOrder) => (
                        <TableRow key={workOrder._id}>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {workOrder.workOrderId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{workOrder.description}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {workOrder.department?.name || 'Not assigned'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {workOrder.assignedTo?.name || 'Not assigned'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={workOrder.status?.replace('_', ' ')}
                              color={getStatusColor(workOrder.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={workOrder.priority}
                              color={
                                workOrder.priority === 'high'
                                  ? 'error'
                                  : workOrder.priority === 'medium'
                                  ? 'warning'
                                  : 'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(workOrder.createdAt)}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewWorkOrder(workOrder)}
                                >
                                  <ViewIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    navigate(
                                      `/${userType}/job-card/workorder/${id}/view/${workOrder._id}`,
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                )}

                {/* No data message */}
                {workOrders.length === 0 && !workOrdersLoading && (
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="textSecondary">
                      No work orders found for this job card
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate(`/${userType}/job-card/workorder/${id}`)}
                      sx={{ mt: 2 }}
                    >
                      Create First Work Order
                    </Button>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Work Order Details Dialog */}
        <Dialog
          open={workOrderDetailsOpen}
          onClose={() => setWorkOrderDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Work Order Details - {selectedWorkOrder?.workOrderId}</DialogTitle>
          <DialogContent>
            {selectedWorkOrder && (
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Work Order ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedWorkOrder.workOrderId}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedWorkOrder.status?.replace('_', ' ')}
                    color={getStatusColor(selectedWorkOrder.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Priority
                  </Typography>
                  <Chip
                    label={selectedWorkOrder.priority}
                    color={
                      selectedWorkOrder.priority === 'high'
                        ? 'error'
                        : selectedWorkOrder.priority === 'medium'
                        ? 'warning'
                        : 'success'
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {selectedWorkOrder.department?.name || 'Not assigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Description
                  </Typography>
                  <Typography variant="body1">{selectedWorkOrder.description}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Assigned To
                  </Typography>
                  <Typography variant="body1">
                    {selectedWorkOrder.assignedTo?.name || 'Not assigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedWorkOrder.createdAt)}
                  </Typography>
                </Grid>
                {selectedWorkOrder.updatedAt && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {formatDateTime(selectedWorkOrder.updatedAt)}
                    </Typography>
                  </Grid>
                )}
                {selectedWorkOrder.remarks && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Remarks
                    </Typography>
                    <Typography variant="body1">{selectedWorkOrder.remarks}</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWorkOrderDetailsOpen(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                setWorkOrderDetailsOpen(false);
                navigate(`/${userType}/job-card/workorder/${id}/view/${selectedWorkOrder._id}`);
              }}
            >
              Edit Work Order
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default SrsJobCardWorkOrders;
