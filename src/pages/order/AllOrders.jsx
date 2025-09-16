import { useEffect, useState } from 'react';
import { Typography, Stack, Button, Box } from '@mui/material';
import { Fab } from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchOrders } from '@/api/admin';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomTable from '@/components/shared/CustomTable';

const AllOrders = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalPages, setTotalPages] = useState(0);
  const [orders, setOrders] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();
  console.log('🚀 ~ AllOrders ~ role:', role);

  const fetchAllOrders = async () => {
    try {
      const limit = paginationModel.pageSize;
      const page = paginationModel.page + 1;

      const response = await fetchOrders(page, limit, searchQuery);

      if (response) {
        setOrders(response.orders);
        setTotalPages(response.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOrderSearch = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);
    setIsSearching(!!searchValue);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(async () => {
        fetchAllOrders();
      }, 1500),
    );
  };

  useEffect(() => {
    fetchAllOrders();
  }, [paginationModel.page, paginationModel.pageSize, isSearching, searchQuery]);

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
    {
      field: 'orderId',
      headerName: 'Order Id',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
    },
    {
      field: 'vendorCode',
      headerName: 'Vendor Code',
      flex: 1,
      minWidth: 50,
      headerClassName: 'custom-header',
    },
    {
      field: 'deliveryDate',
      headerName: 'Delivery Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
    },
    {
      field: 'orderStatus',
      headerName: 'Status',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
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
            onClick={() => navigate(`/${role}/orders/view/${params.row._id}`)}
          >
            <IconEye size="16" />
          </Fab>
          {role === 'admin' || role === 'ordermanagement' || role === 'merchandiser' || role === 'supermerchandiser' || role === 'salesexecutive' ? (
            <Fab
              color="warning"
              size="small"
              onClick={() => navigate(`/${role}/orders/edit/${params.row._id}`)}
            >
              <IconEdit size="16" />
            </Fab>
          ) : null}
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Orders" description="View and manage orders">
      <Breadcrumb title="Orders" items={[{ to: '/', title: 'Home' }, { title: 'Orders' }]} />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/${role}/orders/create`)}
        >
          Create Order
        </Button>
      </Stack>
      <CustomTextField
        label="Search Orders"
        onChange={handleOrderSearch}
        variant="outlined"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto', // Enable horizontal scrolling on smaller screens
        }}
      >
        <CustomTable
          rows={orders}
          columns={columns}
          totalProducts={totalPages}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </PageContainer>
  );
};

export default AllOrders;
