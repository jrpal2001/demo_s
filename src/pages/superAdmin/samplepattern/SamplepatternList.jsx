'use client';

import { deleteSamplePattern, getAllSamplePatterns } from '@/api/samplepattern.api';
import PageContainer from '@/components/container/PageContainer';
import CustomDialog from '@/components/CustomDialog';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Fab, Grid2, Typography, CircularProgress, Chip } from '@mui/material';
import { IconEdit } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const SamplePatternList = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [error, setError] = useState(null);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Sample Pattern', to: `/${userType}/samplepattern` },
  ];

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  };

  const columns = [
    {
      field: 'id',
      headerName: 'SERIAL NO',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value}</div>,
    },
    {
      field: 'productId',
      headerName: 'PRODUCT ID',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'jobCardId',
      headerName: 'JOB CARD ID',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'patternMadeBy',
      headerName: 'PATTERN MADE BY',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'category',
      headerName: 'CATEGORY',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <div style={cellStyle}>
          <Chip
            label={params.value || 'N/A'}
            color={
              params.value === 'FIRST SAMPLE'
                ? 'primary'
                : params.value === 'PP SAMPLE'
                ? 'warning'
                : params.value === 'FINAL SAMPLE'
                ? 'success'
                : 'default'
            }
            size="small"
          />
        </div>
      ),
    },
    {
      field: 'dateOfCreation',
      headerName: 'DATE CREATED',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{formatDate(params.value)}</div>,
    },
    {
      field: 'sizeChartAttached',
      headerName: 'SIZE CHART',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <div style={cellStyle}>
          <Chip
            label={params.value ? 'Attached' : 'Not Attached'}
            color={params.value ? 'success' : 'error'}
            size="small"
          />
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Fab color="primary" size="small">
              <CustomDialog title="Sample Pattern Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Design Id:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.designId || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Date of Creation:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        <Typography variant="body2">
                          {formatDate(params.row.dateOfCreation)}
                        </Typography>
                      </Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Product ID:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.productId || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Job Card ID:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.jobCardId || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Pattern Made By:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.patternMadeBy || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Category:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.category || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Size Specification:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.sizeSpecification || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Measurement Parameters:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.measurementParameters || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Size Set Created By:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.sizeSetCreatedBy || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Approved By:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.approvedBy || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Approved Date:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{formatDate(params.row.approvedDate)}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Comments:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.comments || 'N/A'}</Typography>
                    </Grid2>
                  </Grid2>
                </div>
              </CustomDialog>
            </Fab>
            <Fab color="warning" size="small" onClick={() => handleClickEdit(params.row._id)}>
              <IconEdit />
            </Fab>
            <Fab color="error" size="small">
              <CustomDialog
                title="Confirm Delete"
                icon="delete"
                handleClickDelete={() => handleClickDelete(params.row._id)}
              >
                <Typography>Are you sure you want to delete this sample pattern?</Typography>
                <Typography variant="caption" color="error">
                  This action cannot be undone.
                </Typography>
              </CustomDialog>
            </Fab>
          </Box>
        );
      },
    },
  ];

  const handleClickCreate = () => {
    navigate(`/${userType}/samplepattern/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/samplepattern/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteSamplePattern(id);
      if (response) {
        toast.success('Sample pattern deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete sample pattern');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSamplePatterns({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });

      if (response && response.data) {
        const mappedData = response.data.map((item, index) => ({
          ...item,
          id: index + 1 + paginationModel.page * paginationModel.pageSize,
        }));

        setData(mappedData);
        setTotalProducts(response.total || 0);
      } else {
        setData([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch sample patterns');
      toast.error(error.message || 'Failed to fetch sample patterns');
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer title="Admin - Sample Pattern" description="This is the sample pattern page">
      <Breadcrumb title="Sample Pattern" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Sample Pattern
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        )}

        <CustomTable
          columns={columns}
          rows={data}
          loading={loading}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </PageContainer>
  );
};

export default SamplePatternList;
