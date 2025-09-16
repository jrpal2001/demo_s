import { useEffect, useState } from 'react';
import { Typography, Stack, Button, Box, IconButton, Chip, Alert } from '@mui/material';
import { Fab } from '@mui/material';
import { IconEye, IconPaperclip, IconRotateClockwise, IconSearch, IconX } from '@tabler/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getWorkOrdersByJobCardId } from '@/api/workorder.api';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomTable from '@/components/shared/CustomTable';
import { toast } from 'react-toastify';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const WorkOrders = () => {
  const userType = useSelector(selectCurrentUserType);

  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalCount, setTotalCount] = useState(0);
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const { jobCardId } = useParams(); // Get jobCardId from URL params

  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log('🚀 ~ WorkOrders ~ rowData:', rowData);

  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();

  const department = role === 'admin' ? 'all' : role;

  const fetchWorkOrders = async () => {
    if (!jobCardId) {
      setError('No Job Card ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching work orders for job card ID:', jobCardId);

      const response = await getWorkOrdersByJobCardId(
        jobCardId,
        paginationModel.page,
        paginationModel.pageSize,
        searchQuery, // This will be passed as workOrderIdSearch to the API
      );

      console.log('🚀 ~ fetchWorkOrders ~ complete response:', response);

      if (response && response.data) {
        console.log('Work orders data:', response.data);

        // Check if data is an array
        if (Array.isArray(response.data)) {
          setWorkOrders(response.data);
          setTotalCount(response.totalCount || response.data.length || 0);

          if (response.data.length === 0) {
            setError('No work orders found for this job card');
          }
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Handle nested data structure
          setWorkOrders(response.data.data);
          setTotalCount(response.data.totalCount || response.data.data.length || 0);

          if (response.data.data.length === 0) {
            setError('No work orders found for this job card');
          }
        } else {
          setWorkOrders([]);
          setTotalCount(0);
          setError('Invalid data format received from server');
        }

        // Show feedback for search results
        if (searchQuery) {
          if (workOrders.length === 0) {
            toast.info(`No work orders found matching "${searchQuery}"`);
          } else {
            toast.success(`Found ${workOrders.length} work orders matching "${searchQuery}"`);
          }
        }
      } else {
        setWorkOrders([]);
        setTotalCount(0);
        setError('No data received from server');

        if (searchQuery) {
          toast.info(`No work orders found matching "${searchQuery}"`);
        }
      }
    } catch (error) {
      console.error('Error fetching work orders:', error);
      toast.error('Failed to fetch work orders');
      setWorkOrders([]);
      setTotalCount(0);
      setError(`Error: ${error.message || 'Failed to fetch work orders'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout to delay the search
    setSearchTimeout(
      setTimeout(() => {
        // Reset to first page when searching
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        // fetchWorkOrders will be called by the useEffect
      }, 500),
    );
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    // fetchWorkOrders will be called by the useEffect
  };

  useEffect(() => {
    fetchWorkOrders();
  }, [jobCardId, paginationModel.page, paginationModel.pageSize, searchQuery]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 60, headerClassName: 'custom-header' },
    {
      field: 'workOrderId',
      headerName: 'Work Order ID',
      flex: 0.8,
      minWidth: 100,
      headerClassName: 'custom-header',
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      flex: 0.7,
      minWidth: 70,
      headerClassName: 'custom-header',
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 0.5,
      minWidth: 70,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography height={'100%'} display={'flex'} alignItems={'center'}>
          {formatDate(params.row.startDate)}
        </Typography>
      ),
    },
    {
      field: 'expectedCompletionDate',
      headerName: 'Completion Exp',
      flex: 0.6,
      minWidth: 80,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography height={'100%'} display={'flex'} alignItems={'center'}>
          {formatDate(params.row.expectedCompletionDate)}
        </Typography>
      ),
    },
    {
      field: 'quantityToBeProduced',
      headerName: 'Quantity',
      flex: 0.4,
      minWidth: 60,
      headerClassName: 'custom-header',
    },
    {
      field: 'fabricIssued',
      headerName: 'Fabric',
      flex: 0.3,
      minWidth: 50,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.fabricIssued ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
      field: 'trimsIssued',
      headerName: 'Trims',
      flex: 0.3,
      minWidth: 50,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.trimsIssued ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
      field: 'accessoriesIssued',
      headerName: 'Accessories',
      flex: 0.4,
      minWidth: 60,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.accessoriesIssued ? 'Yes' : 'No'}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.5,
      minWidth: 60,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography
          height={'100%'}
          display={'flex'}
          alignItems={'center'}
          sx={{
            textTransform: 'capitalize',
            color: getStatusColor(params.row.status),
          }}
        >
          {params.row.status?.replace('_', ' ') || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      flex: 0.8,
      minWidth: 80,
      sortable: false,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <Fab
            variant="contained"
            color="info"
            size="small"
            onClick={() => navigate(`${params.row._id}`)}
          >
            <IconEye size="16" />
          </Fab>
          <Fab
            variant="contained"
            color="info"
            size="small"
            onClick={() =>
              navigate(`/${role}/job-card/workorder/${params.row._id}/department/${department}`, {
                state: { rowData: params.row },
              })
            }
          >
            <IconPaperclip size="16" />
          </Fab>
          <Fab
            variant="contained"
            color="info"
            size="small"
            onClick={() =>
              navigate(`/${role}/job-card/workorder/return-goods/${params.row._id}`, {
                state: { rowData: params.row },
              })
            }
          >
            <IconRotateClockwise size="16" />
          </Fab>
        </Box>
      ),
    },
    {
      field: 'tracking',
      headerName: 'TRACKING',
      flex: 0.5,
      minWidth: 100,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Button
            sx={{ backgroundImage: 'linear-gradient(black, black)', color: 'white' }}
            onClick={() =>
              navigate(`/${role}/work-flow/${params.row._id}`, {
                state: { rowData: params.row },
              })
            }
          >
            Track
          </Button>
        );
      },
    },
    {
      field: 'recutting',
      headerName: 'RECUTTING',
      flex: 0.5,
      minWidth: 100,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Button
            sx={{ backgroundImage: 'linear-gradient(orange, orange)', color: 'white' }}
            onClick={() =>
              navigate(`/${role}/job-card/workorder/recutting/${params.row._id}`, {
                state: { rowData: params.row },
              })
            }
          >
            Recut
          </Button>
        );
      },
    },
  ];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success.main';
      case 'in_progress':
        return 'info.main';
      case 'on_hold':
        return 'warning.main';
      case 'approval_required':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <PageContainer title="Work Orders" description="View and manage work orders">
      <Breadcrumb
        title="Work Orders"
        items={[
          { to: '/', title: 'Home' },
          { to: `/${userType}/job-cards`, title: 'Work Orders' },
        ]}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Work Orders</Typography>

        {role === 'admin' || role === 'merchandiser' ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`/${role}/job-card/workorder/${jobCardId}`, {
                state: { rowData: rowData },
              })
            }
          >
            Create Work Order
          </Button>
        ) : null}
      </Stack>

      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            label="Search by Work Order ID"
            onChange={handleSearch}
            value={searchQuery}
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <IconSearch size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              endAdornment: searchQuery ? (
                <IconButton size="small" onClick={handleClearSearch}>
                  <IconX size={18} />
                </IconButton>
              ) : null,
            }}
          />
        </Box>
        {searchQuery && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`Searching for Work Order ID: ${searchQuery}`}
              size="small"
              color="primary"
              onDelete={handleClearSearch}
              sx={{ mr: 1 }}
            />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto', // Enable horizontal scrolling on smaller screens
        }}
      >
        <CustomTable
          rows={Array.isArray(workOrders) ? workOrders : []}
          columns={columns}
          totalProducts={totalCount}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          loading={loading}
        />
      </Box>
    </PageContainer>
  );
};

export default WorkOrders;
