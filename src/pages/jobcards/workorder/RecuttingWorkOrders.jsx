import { useEffect, useState } from 'react';
import { Typography, Stack, Button, Box, Alert } from '@mui/material';
import { Fab } from '@mui/material';
import { IconEye, IconPlus, IconPaperclip, IconRotateClockwise } from '@tabler/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getRecuttingWorkOrders, getLastCreatedRecuttingWorkOrder } from '@/api/workorder.api';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { toast } from 'react-toastify';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const RecuttingWorkOrders = () => {
  const userType = useSelector(selectCurrentUserType);
  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();
  const department = role === 'admin' ? 'all' : role;

  const navigate = useNavigate();
  const [recuttingWorkOrders, setRecuttingWorkOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const { workOrderId } = useParams();
  const location = useLocation();
  const rowData = location.state?.rowData;

  const fetchRecuttingWorkOrders = async () => {
    if (!workOrderId) {
      setErrorMessage('No Work Order ID provided');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await getRecuttingWorkOrders(workOrderId);
      console.log('🚀 ~ fetchRecuttingWorkOrders ~ response:', response);

      if (response && response.data) {
        setRecuttingWorkOrders(response.data);
        if (response.data.length === 0) {
          setErrorMessage('No recutting work orders found for this work order');
        }
      } else {
        setRecuttingWorkOrders([]);
        setErrorMessage('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching recutting work orders:', error);
      toast.error('Failed to fetch recutting work orders');
      setRecuttingWorkOrders([]);
      setErrorMessage(`Error: ${error.message || 'Failed to fetch recutting work orders'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastRecuttingWorkOrder = async () => {
    if (!workOrderId) return;

    try {
      const response = await getLastCreatedRecuttingWorkOrder(workOrderId);
      console.log('🚀 ~ fetchLastRecuttingWorkOrder ~ response:', response);
      // setLastRecuttingWorkOrder(response?.data || null); // This state is no longer needed
    } catch (error) {
      console.error('Error fetching last recutting work order:', error);
      // setLastRecuttingWorkOrder(null); // This state is no longer needed
    }
  };

  useEffect(() => {
    fetchRecuttingWorkOrders();
    fetchLastRecuttingWorkOrder();
  }, [workOrderId]);

  // Add this useEffect to populate form data from rowData
  useEffect(() => {
    if (rowData) {
      // setValue('jobCardNo', rowData.jobCardNo); // This state is no longer needed
      // setValue('productId', rowData.skuCode); // This state is no longer needed
      // setValue('quantityToBeProduced', rowData.total); // This state is no longer needed
      // setValue('sizeSpecification.xs', rowData.xs || 0); // This state is no longer needed
      // setValue('sizeSpecification.s', rowData.s || 0); // This state is no longer needed
      // setValue('sizeSpecification.m', rowData.m || 0); // This state is no longer needed
      // setValue('sizeSpecification.l', rowData.l || 0); // This state is no longer needed
      // setValue('sizeSpecification.xl', rowData.xl || 0); // This state is no longer needed
      // setValue('sizeSpecification.2xl', rowData['2xl'] || 0); // This state is no longer needed
      // setValue('sizeSpecification.3xl', rowData['3xl'] || 0); // This state is no longer needed
      // setValue('sizeSpecification.4xl', rowData['4xl'] || 0); // This state is no longer needed
      // setValue('sizeSpecification.5xl', rowData['5xl'] || 0); // This state is no longer needed
    }
  }, [rowData]); // Removed setValue from dependencies

  const handleAddRecuttingWorkOrder = () => {
    navigate(`/${userType}/job-card/workorder/recutting/${workOrderId}/create`, {
      state: { rowData: rowData },
    });
  };

  // Removed handleCloseDialog function

  // Removed onSubmit function

  // Removed generateRecuttingWorkOrderId function

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }

      // Format as DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Invalid Date';
    }
  };

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 20, headerClassName: 'custom-header' },
    {
      field: 'workOrderId',
      headerName: 'Recutting Work Order ID',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
    },
    {
      field: 'purpose',
      headerName: 'Purpose',
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header',
    },
    {
      field: 'startDate',
      headerName: 'Start Date',
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        console.log(
          'Start Date value:',
          params.row.startDate,
          'Type:',
          typeof params.row.startDate,
        );
        return (
          <Typography height={'100%'} display={'flex'} alignItems={'center'}>
            {formatDate(params.row.startDate)}
          </Typography>
        );
      },
    },
    {
      field: 'expectedCompletionDate',
      headerName: 'Completion Exp',
      flex: 1,
      minWidth: 120,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        console.log(
          'Expected Completion Date value:',
          params.row.expectedCompletionDate,
          'Type:',
          typeof params.row.expectedCompletionDate,
        );
        return (
          <Typography height={'100%'} display={'flex'} alignItems={'center'}>
            {formatDate(params.row.expectedCompletionDate)}
          </Typography>
        );
      },
    },
    {
      field: 'quantityToBeProduced',
      headerName: 'Quantity',
      flex: 1,
      minWidth: 80,
      headerClassName: 'custom-header',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
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
      flex: 1.5,
      minWidth: 100,
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
            onClick={() =>
              navigate(
                `/${role}/job-card/workorder/${params.row.jobCardRef}/view/${params.row._id}`,
                {
                  state: { rowData: params.row },
                },
              )
            }
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
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
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
          </Box>
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
    <PageContainer
      title="Recutting Work Orders"
      description="View and manage recutting work orders"
    >
      <Breadcrumb
        title="Recutting Work Orders"
        items={[
          { to: '/', title: 'Home' },
          { to: `/${userType}/job-cards`, title: 'Work Orders' },
          { title: 'Recutting Work Orders' },
        ]}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
          Recutting Work Orders - {rowData?.workOrderId || 'N/A'}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<IconPlus size={18} />}
          onClick={handleAddRecuttingWorkOrder}
        >
          Add Recutting Work Order
        </Button>
      </Stack>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <CustomTable
          rows={Array.isArray(recuttingWorkOrders) ? recuttingWorkOrders : []}
          columns={columns}
          totalProducts={recuttingWorkOrders.length}
          loading={loading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>

      {/* Removed Add Recutting Work Order Dialog */}
    </PageContainer>
  );
};

export default RecuttingWorkOrders;
