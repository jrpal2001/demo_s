'use client';

import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import CustomTable from '@/components/shared/CustomTable';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { getFgStoreBySKU } from '@/api/fgstore.api';
import SizeDistributionChart from './SizeDistributionChart';
import FGStoreSummary from './FgStoreSummary';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Define sizes array for column generation
const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const FGStoreRequest = () => {
const userType = useSelector(selectCurrentUserType);
const BCrumb = [
  { to: '/', title: 'Home' },
  { to: `/${userType}/fgstore`, title: 'FGStore' },
  { title: 'Request' },
];

  const [skuCode, setSkuCode] = useState('');
  const [fgStoreData, setFgStoreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchInitiated, setSearchInitiated] = useState(false);

  // Generate columns dynamically including size columns
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 0.7,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: 'center', width: '100%' }}>
          {params.row._id?.substring(0, 8) || '-'}
        </Typography>
      ),
    },
    {
      field: 'skuCode',
      headerName: 'SKU CODE',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: 'center', width: '100%' }}>
          {params.row.skuCode}
        </Typography>
      ),
    },
    {
      field: 'total',
      headerName: 'TOTAL',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 0.7,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: 'center', width: '100%' }}>
          {params.row.total}
        </Typography>
      ),
    },
    ...SIZES.map((size) => ({
      field: size,
      headerName: size.toUpperCase(),
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 0.7,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: 'center', width: '100%' }}>
          {params.row[size] || 0}
        </Typography>
      ),
    })),
    {
      field: 'timestamp',
      headerName: 'DATE',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ textAlign: 'center', width: '100%' }}>
          {new Date(params.row.timestamp).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const handleSearch = async () => {
    if (!skuCode.trim()) {
      toast.error('Please enter a SKU code');
      return;
    }

    setLoading(true);
    setSearchInitiated(true);

    try {
      const response = await getFgStoreBySKU(
        skuCode,
        paginationModel.page + 1,
        paginationModel.pageSize,
      );

      if (response && response.data) {
        setFgStoreData(response.data.records || []);
        setTotalRecords(response.data.totalCount || 0);

        if (response.data.records.length === 0) {
          toast.info('No records found for this SKU code');
        }
      } else {
        setFgStoreData([]);
        setTotalRecords(0);
        toast.info('No records found for this SKU code');
      }
    } catch (error) {
      console.error('Error fetching FG Store data:', error);
      toast.error(error.message || 'Failed to fetch FG Store data');
      setFgStoreData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when pagination changes, but only if a search has been initiated
  useEffect(() => {
    if (searchInitiated && skuCode.trim()) {
      handleSearch();
    }
  }, [paginationModel]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Reset to first page when initiating a new search
      setPaginationModel({ ...paginationModel, page: 0 });
      handleSearch();
    }
  };

  const handleSearchClick = () => {
    // Reset to first page when initiating a new search
    setPaginationModel({ ...paginationModel, page: 0 });
    handleSearch();
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
            onClick={handleSearchClick}
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
          <>
            <Box sx={{ position: 'relative' }}>
              <CustomTable
                columns={columns}
                rows={fgStoreData}
                loading={loading}
                totalProducts={totalRecords}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                getRowId={(row) => row._id || Math.random().toString()}
              />
            </Box>

            {fgStoreData.length > 0 && (
              <>
                <FGStoreSummary data={fgStoreData} />
                <SizeDistributionChart data={fgStoreData} />
              </>
            )}
          </>
        )}
      </Paper>
    </PageContainer>
  );
};

export default FGStoreRequest;
