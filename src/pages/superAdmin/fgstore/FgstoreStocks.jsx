'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import CustomTable from '@/components/shared/CustomTable';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllStockInwardsForSkuCode } from '@/api/stockInward.api';
import { Fab } from '@mui/material';
import { IconEdit, IconEye, IconCirclePlus } from '@tabler/icons';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Define sizes array for column generation
const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const FGstoreStocks = () => {
const userType = useSelector(selectCurrentUserType);
const BCrumb = [
  { to: '/', title: 'Home' },
  { to: `/${userType}/fgstore`, title: 'FGStore' },
  { title: 'stocks' },
];
  const navigate = useNavigate();
  const [skuCode, setSkuCode] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log('🚀 ~ WorkOrders ~ rowData:', rowData);

  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();

  // Generate columns dynamically including size columns
  const columns = [
    { field: 'id', headerName: 'Sl No', width: 20, headerClassName: 'custom-header' },
    {
      field: 'lotNo',
      headerName: 'Lot No',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.lotNo}
        </Typography>
      ),
    },
    {
      field: 'productDescription',
      headerName: 'Product',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.productDescription}
        </Typography>
      ),
    },
    {
      field: 'invoiceNumber',
      headerName: 'Invoice No',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.invoice?.number || '—'}
        </Typography>
      ),
    },
    {
      field: 'workOrder',
      headerName: 'Work Order',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row?.workOrderId?.jobCardNo || '—'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'DATE',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {new Date(params.row.createdAt).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      headerClassName: 'custom-header',
      flex: 1.2,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.remarks || '—'}
        </Typography>
      ),
    },
    {
      field: 'approvedBy',
      headerName: 'approvedBy',
      headerClassName: 'custom-header',
      flex: 1.2,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.approvedBy || '—'}
        </Typography>
      ),
    },
    {
      field: 'currentQuantity',
      headerName: 'Received',
      headerClassName: 'custom-header',
      flex: 0.7,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.receivedQuantity}
        </Typography>
      ),
    },
    {
      field: 'outward',
      headerName: 'Outward',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Button
            sx={{ backgroundImage: 'linear-gradient(black, black)', color: 'white' }}
            onClick={() =>
              navigate(`/${role}/fgstore/create/stockoutward`, {
                state: { rowData: params.row },
              })
            }
          >
            Outward
          </Button>
        );
      },
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
            onClick={() => navigate(`/${role}/fgstore/stockinward/${params.row._id}`)}
          >
            <IconEye size="16" />
          </Fab>
        </Box>
      ),
    },
  ];

  // Fetch data function that calls getAllStockInwards
  const fetchData = async (searchSku = rowData.skuCode) => {
    setLoading(true);
    try {
      // Using the imported getAllStockInwards function
      const response = await getAllStockInwardsForSkuCode(
        searchSku,
        paginationModel.page + 1, // API expects 1-based page index
        paginationModel.pageSize,
      );
      console.log('🚀 ~ fetchData ~ response:', response);

      if (response && Array.isArray(response.records)) {
        setStockData(response.records);
        setTotalCount(response.totalCount || response.records.length);

        if (response.records.length === 0 && searchSku) {
          toast.info('No records found for this SKU code');
        }
      } else {
        setStockData([]);
        if (searchSku) {
          toast.info('No records found for this SKU code');
        }
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error(error.message || 'Failed to fetch stock data');
      setStockData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination changes
  useEffect(() => {
    fetchData(rowData.skuCode);
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearch = () => {
    // Reset to first page when searching
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchData(skuCode.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <PageContainer title="FG Store Stocks" description="View FG Store data by SKU code">
      <Breadcrumb title="FG Store Stocks" items={BCrumb} />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField
            label="SKU Code"
            variant="outlined"
            value={rowData.skuCode}
            onChange={(e) => setSkuCode(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            placeholder={rowData.skuCode}
            disabled
            InputProps={{
              sx: {
                fontWeight: 'bold',
                fontSize: '1.2rem', // Increase this as needed
              },
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ position: 'relative' }}>
              <CustomTable
                columns={columns}
                rows={stockData}
                loading={false}
                totalProducts={totalCount}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                getRowId={(row) => row._id || Math.random().toString()}
              />
            </Box>
          </>
        )}
      </Paper>
    </PageContainer>
  );
};

export default FGstoreStocks;
