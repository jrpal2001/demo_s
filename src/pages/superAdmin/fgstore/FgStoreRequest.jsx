'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { getFgStoreBySKU } from '@/api/fgstore.api';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const FGStoreRequest = () => {
  
const userType = useSelector(selectCurrentUserType);

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: `/${userType}/fgstore`, title: 'FGStore' },
  { title: 'Request' },
];
  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log("🚀 ~ FGStoreRequest ~ rowData:", rowData)

  const [skuCode, setSkuCode] = useState(rowData.skuCode);
  const [fgStoreData, setFgStoreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 }); // Changed to 0-based pagination
  const [totalCount, setTotalCount] = useState(0);

  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 20, headerClassName: 'custom-header' },
    {
      field: 'skuCode',
      headerName: 'SKU CODE',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%">
          {params.row.skuCode}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      flex: 0.7,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%">
          {params.row.total}
        </Typography>
      ),
    },
    ...SIZES.map((size) => ({
      field: size,
      headerName: size.toUpperCase(),
      flex: 0.7,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%">
          {params.row[size] || 0}
        </Typography>
      ),
    })),
    {
      field: 'timestamp',
      headerName: 'DATE',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%">
          {new Date(params.row.timestamp).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: 'inward',
      headerName: 'Inward',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Button
          sx={{ backgroundImage: 'linear-gradient(black, black)', color: 'white' }}
          onClick={() =>
            navigate(`/${role}/fgstore/create/stockinward`, {
              state: { rowData: params.row },
            })
          }
        >
          Inward
        </Button>
      ),
    },
  ];

  const fetchData = async () => {

    setLoading(true);
    try {
      console.log('🚀 ~ fetchData ~ sku:', skuCode);
      const response = await getFgStoreBySKU(
        skuCode,
        paginationModel.page,
        paginationModel.pageSize,
      );
      console.log("🚀 ~ fetchData ~ response:", response)

      if (response?.records?.length) {
        setFgStoreData(response.records);
        setTotalCount(response.totalCount || response.records.length);
      } else {
        setFgStoreData([]);
        setTotalCount(0);
        toast.info('No records found for this SKU code');
      }
    } catch (error) {
      console.error('Error fetching FG Store data:', error);
      toast.error(error.message || 'Failed to fetch FG Store data');
      setFgStoreData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Initialize with rowData if available
  useEffect(() => {
    if (rowData?.skuCode) {
      setSkuCode(rowData.skuCode);
      // We'll fetch data in the next useEffect when skuCode changes
    }
  }, [rowData]);

  // Fetch data when pagination changes or when skuCode is set from rowData
  useEffect(() => {
    if (skuCode.trim()) {
      fetchData();
    }
  }, [paginationModel]);

  const handleSearch = () => {
    if (!skuCode.trim()) return;

    // Reset to first page when searching
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    fetchData();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <PageContainer title="FG Store Request" description="View FG Store data by SKU code">
      <Breadcrumb title="FG Store Request" items={BCrumb} />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField
            label="SKU Code"
            variant="outlined"
            value={skuCode}
            onChange={(e) => setSkuCode(e.target.value)}
            onKeyPress={handleKeyPress}
            fullWidth
            placeholder="Enter SKU code to search"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundImage: 'linear-gradient(black, black)',
              color: 'white',
              height: '56px',
              minWidth: '120px',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CustomTable
            columns={columns}
            rows={fgStoreData}
            loading={false}
            totalProducts={totalCount}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            getRowId={(row) => row._id || Math.random().toString()}
          />
        )}
      </Paper>
    </PageContainer>
  );
};

export default FGStoreRequest;
