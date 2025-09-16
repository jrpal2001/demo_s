'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
} from '@mui/material';
import { toast } from 'react-toastify';
import CustomTable from '@/components/shared/CustomTable';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Fab } from '@mui/material';
import { IconEdit, IconEye, IconCirclePlus, IconSearch } from '@tabler/icons';
import { getAllStockOutwardsForSkuCode } from '@/api/stockOutward.api';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const StockOutward = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockOutwardData, setStockOutwardData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();
  const rowData = location.state?.rowData;


  
  console.log('🚀 ~ FGStoreRequest ~ rowData:', rowData);

  const userType = useSelector(selectCurrentUserType);
  const role = userType[0].toLowerCase() === 'superadmin' ? 'admin' : userType[0].toLowerCase();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/fgstore`, title: 'FGStore' },
    { title: 'Outward' },
  ];

  // Define columns for the table
  const columns = [
    { field: 'id', headerName: 'Sl No', width: 20, headerClassName: 'custom-header' },
    {
      field: 'dispatchId',
      headerName: 'Dispatch ID',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.dispatchId}
        </Typography>
      ),
    },
    {
      field: 'skuCode',
      headerName: 'SKU Code',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.skuCode}
        </Typography>
      ),
    },
    {
      field: 'dispatchTo',
      headerName: 'Dispatch To',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.dispatchTo}
        </Typography>
      ),
    },
    {
      field: 'dispatchDate',
      headerName: 'Dispatch Date',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {new Date(params.row.dispatchDate).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'quantityDispatched',
      headerName: 'Quantity',
      headerClassName: 'custom-header',
      flex: 0.7,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.quantityDispatched}
        </Typography>
      ),
    },
    {
      field: 'dispatchStatus',
      headerName: 'Status',
      headerClassName: 'custom-header',
      flex: 0.8,
      renderCell: (params) => {
        const status = params.row.dispatchStatus;
        let color = 'inherit';

        if (status === 'Delivered') color = 'success.main';
        else if (status === 'Dispatched') color = 'info.main';
        else if (status === 'Pending') color = 'warning.main';
        else if (status === 'Cancelled') color = 'error.main';

        return (
          <Typography
            height="100%"
            display="flex"
            alignItems="center"
            color={color}
            fontWeight="medium"
          >
            {status}
          </Typography>
        );
      },
    },
    {
      field: 'deliveryDate',
      headerName: 'Delivery Date',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.deliveryDate ? new Date(params.row.deliveryDate).toLocaleDateString() : '—'}
        </Typography>
      ),
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
            onClick={() => navigate(`/${userType}/fgstore/stockoutward/${params.row._id}`)}
          >
            <IconEye size="16" />
          </Fab>
          <Fab
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate(`/${userType}/fgstore/stockoutward/edit/${params.row._id}`)}
          >
            <IconEdit size="16" />
          </Fab>
        </Box>
      ),
    },
  ];

  // Fetch data function that calls getAllStockOutwards
  const fetchData = async (search = searchTerm) => {
    setLoading(true);
    try {
      const response = await getAllStockOutwardsForSkuCode(
        rowData.skuCode,
        paginationModel.page + 1, // API expects 1-based page index
        paginationModel.pageSize,
      );

      if (response && Array.isArray(response.records)) {
        setStockOutwardData(response.records);
        setTotalCount(response.totalCount || response.records.length);

        if (response.records.length === 0 && search) {
          toast.info('No records found for this search term');
        }
      } else {
        setStockOutwardData([]);
        if (search) {
          toast.info('No records found for this search term');
        }
      }
    } catch (error) {
      console.error('Error fetching stock outward data:', error);
      toast.error(error.message || 'Failed to fetch stock outward data');
      setStockOutwardData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination changes
  useEffect(() => {
    fetchData();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearch = () => {
    // Reset to first page when searching
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchData(searchTerm.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <PageContainer title="FG Store Outward" description="View and manage stock outward records">
      <Breadcrumb title="FG Store Outward" items={BCrumb} />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              placeholder="Search by Dispatch ID, SKU Code, or Dispatch To"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconSearch onClick={handleSearch} style={{ cursor: 'pointer' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box> */}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ position: 'relative' }}>
              <CustomTable
                columns={columns}
                rows={stockOutwardData}
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

export default StockOutward;
