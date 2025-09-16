'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { getFgDefectsBySKU } from '@/api/fgstore.api';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';



const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];

const FGStoreDefects = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/fgstore`, title: 'FGStore' },
    { title: 'Defects' },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log('🚀 ~ FGStoreDefects ~ rowData:', rowData);

  const [skuCode, setSkuCode] = useState(rowData?.skuCode || '');
  const [defectsData, setDefectsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalCount, setTotalCount] = useState(0);

  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 20, headerClassName: 'custom-header' },
    {
      field: 'workOrderRef',
      headerName: 'WORK ORDER',
      flex: 1.2,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%">
          {params.row.workOrderRef && typeof params.row.workOrderRef === 'object'
            ? params.row.workOrderRef.workOrderId || 'N/A'
            : params.row.workOrderRef || 'N/A'}
        </Typography>
      ),
    },
    {
      field: 'rejectTotal',
      headerName: 'REJECT',
      flex: 0.7,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%" color="error.main">
          {params.row.reject?.total || 0}
        </Typography>
      ),
    },
    {
      field: 'lineTotal',
      headerName: 'LINE',
      flex: 0.7,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography display="flex" alignItems="center" height="100%" color="warning.main">
          {params.row.line?.total || 0}
        </Typography>
      ),
    },
    // Size columns showing both reject and line quantities
    ...SIZES.map((size) => ({
      field: size,
      headerName: size.toUpperCase(),
      flex: 0.5,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: 'error.main', fontSize: '0.7rem', lineHeight: 1 }}
          >
            R: {params.row.reject?.[size] || 0}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'warning.main', fontSize: '0.7rem', lineHeight: 1 }}
          >
            L: {params.row.line?.[size] || 0}
          </Typography>
        </Box>
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
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🚀 ~ fetchData ~ sku:', skuCode);
      const response = await getFgDefectsBySKU(
        skuCode,
        paginationModel.page + 1, // Convert to 1-based pagination for API
        paginationModel.pageSize,
      );
      console.log('🚀 ~ fetchData ~ response:', response);

      if (response?.records?.length) {
        setDefectsData(response.records);
        setTotalCount(response.totalCount || response.records.length);
      } else {
        setDefectsData([]);
        setTotalCount(0);
        toast.info('No defect records found for this SKU code');
      }
    } catch (error) {
      console.error('Error fetching FG Store defects data:', error);
      toast.error(error.message || 'Failed to fetch FG Store defects data');
      setDefectsData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Initialize with rowData if available
  useEffect(() => {
    if (rowData?.skuCode) {
      setSkuCode(rowData.skuCode);
    }
  }, [rowData]);

  // Fetch data when pagination changes or when component mounts with skuCode
  useEffect(() => {
    if (skuCode.trim()) {
      fetchData();
    }
  }, [paginationModel, skuCode]);

  return (
    <PageContainer title="FG Store Defects" description="View FG Store defects data by SKU code">
      <Breadcrumb title="FG Store Defects" items={BCrumb} />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            SKU Code: {skuCode}
          </Typography>
        </Box>

        {/* Summary Stats */}
        {defectsData.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'error.main', color: 'white' }}>
              <Typography variant="h6">Total Reject Defects</Typography>
              <Typography variant="h4">
                {defectsData.reduce((sum, item) => sum + (item.reject?.total || 0), 0)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'warning.main', color: 'white' }}>
              <Typography variant="h6">Total Line Defects</Typography>
              <Typography variant="h4">
                {defectsData.reduce((sum, item) => sum + (item.line?.total || 0), 0)}
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'info.main', color: 'white' }}>
              <Typography variant="h6">Records Found</Typography>
              <Typography variant="h4">{totalCount}</Typography>
            </Paper>
            <Paper sx={{ p: 2, flex: 1, bgcolor: 'success.main', color: 'white' }}>
              <Typography variant="h6">Total Defects</Typography>
              <Typography variant="h4">
                {defectsData.reduce(
                  (sum, item) => sum + (item.reject?.total || 0) + (item.line?.total || 0),
                  0,
                )}
              </Typography>
            </Paper>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CustomTable
            columns={columns}
            rows={defectsData}
            loading={false}
            totalProducts={totalCount}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            getRowId={(row) => row._id || Math.random().toString()}
          />
        )}

        {defectsData.length === 0 && !loading && skuCode.trim() && (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No defects found for SKU: {skuCode}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This SKU appears to have no recorded defects.
            </Typography>
          </Box>
        )}
      </Paper>
    </PageContainer>
  );
};

export default FGStoreDefects;
