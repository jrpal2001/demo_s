'use client';

import { deleteApprovedSample, getAllApprovedSamples } from '@/api/approvedsample.api';
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Approved Sample' }];

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Error';
  }
};

const capitalize = (str) => {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ApprovedSampleList = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [error, setError] = useState(null);

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
      field: 'productName',
      headerName: 'PRODUCT NAME',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'sampleType',
      headerName: 'SAMPLE TYPE',
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
      field: 'targetMarket',
      headerName: 'TARGET MARKET',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <div style={cellStyle}>
          <Chip
            label={params.value || 'N/A'}
            color={params.value === 'B2B' ? 'primary' : 'secondary'}
            size="small"
          />
        </div>
      ),
    },
    {
      field: 'designStatus',
      headerName: 'DESIGN STATUS',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <div style={cellStyle}>
          <Chip
            label={params.value || 'N/A'}
            color={
              params.value === 'APPROVED'
                ? 'success'
                : params.value === 'FINALIZED'
                ? 'primary'
                : params.value === 'IN PROGRESS'
                ? 'warning'
                : params.value === 'UNDER REVIEW'
                ? 'info'
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
              <CustomDialog title="Approved Sample Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Grid2 container spacing={2}>
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
                        Product Name:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.productName || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Design ID:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.designId || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Sample Type:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.sampleType || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Product Description:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.productDescription || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Materials Used:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.materialsUsed || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Target Market:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.targetMarket || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Photoshoot Sample:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.photoshootSample ? 'Yes' : 'No'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Design Created By:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.designCreatedBy || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Design Status:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.designStatus || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Approved Status:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.approvedStatus || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Customer Reference:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.customerReference || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Sample Produced:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.sampleProduced ? 'Yes' : 'No'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Feedback on Design:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.feedbackOnDesign || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Mannequin/Table Shoot:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.mannequinShootOrTableShoot ? 'Yes' : 'No'}
                      </Typography>
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
                <Typography>Are you sure you want to delete this approved sample?</Typography>
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
    navigate(`/${userType}/approvedsample/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/approvedsample/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteApprovedSample(id);
      if (response) {
        toast.success('Approved sample deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete approved sample');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllApprovedSamples({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });

      if (response && response.samples) {
        const mappedData = response.samples.map((item, index) => ({
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
      setError(error.message || 'Failed to fetch approved samples');
      toast.error(error.message || 'Failed to fetch approved samples');
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
    <PageContainer title="Admin - Approved Sample" description="This is the approved sample page">
      <Breadcrumb title="Approved Sample" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'absolute', top: '0.5rem', right: '1rem', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Approved Sample
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

export default ApprovedSampleList;
