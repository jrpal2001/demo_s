'use client';

import { deleteSampleJobCard, getAllSampleJobCards } from '@/api/sampleJobCard.api.js';
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

const SampleJobCardList = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalJobCards, setTotalJobCards] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [error, setError] = useState(null);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Sample Job Card Management', to: `/${userType}/sample-job-card` }];

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
      field: 'jobCardNo',
      headerName: 'JOB CARD NO',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'executiveName',
      headerName: 'EXECUTIVE NAME',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'style',
      headerName: 'STYLE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'color',
      headerName: 'COLOR',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'size',
      headerName: 'SIZES',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <div style={cellStyle}>
          {params.value && params.value.length > 0 ? (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              {params.value.map((size, index) => (
                <Chip key={index} label={size.toUpperCase()} size="small" color="primary" />
              ))}
            </Box>
          ) : (
            'N/A'
          )}
        </div>
      ),
    },
    {
      field: 'qty',
      headerName: 'QUANTITY',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'sampleDeliveryDate',
      headerName: 'DELIVERY DATE',
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
              <CustomDialog title="Sample Job Card Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Job Card No:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.jobCardNo || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Executive Name:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.executiveName || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Color:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.color || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Sizes:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.size && params.row.size.length > 0
                          ? params.row.size.join(', ').toUpperCase()
                          : 'N/A'}
                      </Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Style:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.style || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Quantity:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.qty || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Fabric Quality:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.fabricQuality || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Sample Delivery Date:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {formatDate(params.row.sampleDeliveryDate)}
                      </Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Comments:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.comments || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Issued By:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.issuedBy || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Received By:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.receivedBy || 'N/A'}</Typography>
                    </Grid2>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Creation Date:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{formatDate(params.row.creationDate)}</Typography>
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
                <Typography>Are you sure you want to delete this sample job card?</Typography>
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
    navigate(`/${userType}/samplejobcard/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/samplejobcard/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteSampleJobCard(id);
      if (response) {
        toast.success('Sample job card deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete sample job card');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSampleJobCards({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });
      console.log("🚀 ~ fetchData ~ response:", response)

      if (response && response.jobCards) {
        const mappedData = response.jobCards.map((item, index) => ({
          ...item,
          id: index + 1 + paginationModel.page * paginationModel.pageSize,
        }));
        setData(mappedData);
        setTotalJobCards(response.total || 0);
      } else {
        setData([]);
        setTotalJobCards(0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch sample job cards');
      toast.error(error.message || 'Failed to fetch sample job cards');
      setData([]);
      setTotalJobCards(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer
      title="Admin - Sample Job Card Management"
      description="This is the sample job card management page"
    >
      <Breadcrumb title="Sample Job Card Management" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Sample Job Card
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
          totalProducts={totalJobCards}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </PageContainer>
  );
};

export default SampleJobCardList;
