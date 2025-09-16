import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Work as WorkIcon,
  ListAlt as ListAltIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { getAllSrsJobCards, deleteSrsJobCard, getSrsJobCardStats } from '@/api/srsjobcard.api';
import { toast } from 'react-toastify';
import PageContainer from '@/components/container/PageContainer';
import Spinner from '@/components/common/spinner/Spinner';

const SrsJobCards = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [jobCards, setJobCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState(null);

  // Fetch job cards
  const fetchJobCards = async () => {
    setLoading(true);
    try {
      const response = await getAllSrsJobCards(page, limit, search, status);
      console.log('🚀 ~ fetchJobCards ~ response:', response);

      // Extract data from the correct response structure
      const jobCardsData = response.data?.jobCards || [];
      const paginationData = response.data?.pagination || {};

      setJobCards(jobCardsData);
      setTotalCount(paginationData.total || 0);
      setTotalPages(paginationData.totalPages || 0);
    } catch (error) {
      console.error('Error fetching job cards:', error);
      toast.error('Failed to fetch job cards');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await getSrsJobCardStats();
      console.log('🚀 ~ fetchStats ~ response:', response);
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchJobCards();
    fetchStats();
  }, [page, search, status]);

  // Handle search
  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // Handle status filter
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedJobCard) return;

    try {
      await deleteSrsJobCard(selectedJobCard._id);
      toast.success('Job card deleted successfully');
      fetchJobCards();
      fetchStats();
      setDeleteDialogOpen(false);
      setSelectedJobCard(null);
    } catch (error) {
      console.error('Error deleting job card:', error);
      toast.error('Failed to delete job card');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageContainer title="SRS Job Cards" description="Manage SRS job cards">
      <Box>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            SRS Job Cards
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/${userType}/srs-jobcard/create`)}
          >
            Create Job Card
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Box mb={1}>
          <Typography
            variant="h5"
            sx={{ mb: 1, mt: 1, color: 'primary.main', fontWeight: 'bold', p: 0 }}
          >
            📊 Dashboard Statistics
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent sx={{ py: 1, px: 1 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      📋 Total Job Cards
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.total || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent sx={{ py: 1, px: 1 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      ⏳ In Progress
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.inProgress || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent sx={{ py: 1, px: 1 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      ✅ Completed
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.completed || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <CardContent sx={{ py: 1, px: 1 }}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      📅 Today
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                      {stats.today || 0}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Filters */}
        <Box mb={1}>
          <Typography
            variant="h5"
            sx={{ mb: 1, mt: 1, color: 'primary.main', fontWeight: 'bold', p: 0 }}
          >
            🔍 Search & Filters
          </Typography>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ py: 1, px: 1 }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by job card number, customer name, or SKU code"
                    InputProps={{
                      startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={status}
                      onChange={handleStatusChange}
                      label="Status"
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={() => {
                      setSearch('');
                      setStatus('');
                      setPage(0);
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 2,
                      height: 40,
                      fontSize: '0.875rem',
                    }}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Job Cards Table */}
        <Box mb={0} mt={0}>
          <Typography
            variant="h5"
            sx={{ mb: 1, mt: 1, color: 'primary.main', fontWeight: 'bold', p: 0 }}
          >
            📋 SRS Job Cards List
          </Typography>
          <Card
            sx={{
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 3,
              padding: 0,
              '& .MuiCard-root': {
                padding: 0,
              },
            }}
          >
            <CardContent sx={{ py: 0, px: 0 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" p={0}>
                  <Spinner />
                </Box>
              ) : (
                <>
                  <TableContainer component={Paper} elevation={0} sx={{ p: 0 }}>
                    <Table size="small" sx={{ p: 0 }}>
                      <TableHead sx={{ p: 0 }}>
                        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Job Card No
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Customer Name
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Products
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Total Quantity
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Created Date
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Work Orders
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 'bold', color: 'primary.main', py: 1, px: 2 }}
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {jobCards.map((jobCard) => (
                          <TableRow
                            key={jobCard._id}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#f8f9fa',
                                transform: 'scale(1.01)',
                                transition: 'all 0.2s ease-in-out',
                              },
                            }}
                          >
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight="bold"
                                color="primary.main"
                              >
                                {jobCard.jobCardNo}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Typography variant="body2" fontWeight="medium">
                                {jobCard.customerName}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Box>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                  {jobCard.products?.length || 0} products
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {jobCard.products?.map((p) => p.skuCode).join(', ')}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Chip
                                label={jobCard.totalQuantity || 0}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Chip
                                label={jobCard.status?.replace('_', ' ')}
                                color={getStatusColor(jobCard.status)}
                                size="small"
                                sx={{ fontWeight: 'bold' }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Typography variant="body2" color="textSecondary">
                                {formatDate(jobCard.createdAt)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Stack direction="row" spacing={0.25}>
                                <Tooltip title="Create Work Order">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      backgroundColor: '#e8f5e8',
                                      '&:hover': { backgroundColor: '#c8e6c9' },
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `/${userType}/srs-jobcard/workorder/create/${jobCard._id}`,
                                      )
                                    }
                                  >
                                    <WorkIcon color="success" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View Work Orders">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      backgroundColor: '#fff3e0',
                                      '&:hover': { backgroundColor: '#ffe0b2' },
                                    }}
                                    onClick={() =>
                                      navigate(
                                        `/${userType}/srs-jobcard/workorder/view/${jobCard._id}`,
                                        { state: { jobCard } },
                                      )
                                    }
                                  >
                                    <ListAltIcon color="warning" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 1, px: 2 }}>
                              <Stack direction="row" spacing={0.25}>
                                <Tooltip title="View Details">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      backgroundColor: '#e3f2fd',
                                      '&:hover': { backgroundColor: '#bbdefb' },
                                    }}
                                    onClick={() =>
                                      navigate(`/${userType}/srs-jobcard/view/${jobCard._id}`, {
                                        state: { jobCard },
                                      })
                                    }
                                  >
                                    <ViewIcon color="primary" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      backgroundColor: '#fff3e0',
                                      '&:hover': { backgroundColor: '#ffe0b2' },
                                    }}
                                    onClick={() =>
                                      navigate(`/${userType}/srs-jobcard/edit/${jobCard._id}`)
                                    }
                                  >
                                    <EditIcon color="warning" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    sx={{
                                      backgroundColor: '#ffebee',
                                      '&:hover': { backgroundColor: '#ffcdd2' },
                                    }}
                                    onClick={() => {
                                      setSelectedJobCard(jobCard);
                                      setDeleteDialogOpen(true);
                                    }}
                                  >
                                    <DeleteIcon color="error" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </CardContent>
          </Card>
        </Box>

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
        {jobCards.length === 0 && !loading && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="textSecondary">
              No job cards found
            </Typography>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete job card "{selectedJobCard?.jobCardNo}"? This action
              cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </PageContainer>
  );
};

export default SrsJobCards;
