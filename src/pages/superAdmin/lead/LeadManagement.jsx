import { deleteLead, getAllLeads } from '@/api/lead.api.js';
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

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Lead Management' }];

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

const LeadList = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalLeads, setTotalLeads] = useState(0);
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
      field: 'leadNo',
      headerName: 'LEAD NO',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'customerName',
      headerName: 'CUSTOMER NAME',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'company',
      headerName: 'COMPANY',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'productType',
      headerName: 'PRODUCT TYPE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'purpose',
      headerName: 'PURPOSE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'mobileNo',
      headerName: 'MOBILE NO',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'leadSource',
      headerName: 'LEAD SOURCE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'createdAt',
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
              <CustomDialog title="Lead Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Grid2 container spacing={2}>
                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Lead No:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.leadNo || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Date:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{formatDate(params.row.date)}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Product Type:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.productType || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Purpose:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.purpose || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Customer Name:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.customerName || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Mobile No:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.mobileNo || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Lead Source:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.leadSource || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Company:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.company || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Designation:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.designation || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Customer Type:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.customerType || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Order Type:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.orderType || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Quantity:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.quantity || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Delivery Lead Time:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.deliveryLeadTime || 'N/A'}
                      </Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Order Details:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">{params.row.orderDetails || 'N/A'}</Typography>
                    </Grid2>

                    <Grid2 size={4}>
                      <Typography variant="body2" fontWeight="bold">
                        Assigned Executive:
                      </Typography>
                    </Grid2>
                    <Grid2 size={8}>
                      <Typography variant="body2">
                        {params.row.assignedExecutive || 'N/A'}
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
                <Typography>Are you sure you want to delete this lead?</Typography>
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
    navigate(`/${userType}/lead/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/lead/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteLead(id);
      if (response) {
        toast.success('Lead deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete lead');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllLeads({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });

      if (response && response.leads) {
        const mappedData = response.leads.map((item, index) => ({
          ...item,
          id: index + 1 + paginationModel.page * paginationModel.pageSize,
        }));

        setData(mappedData);
        setTotalLeads(response.total || 0);
      } else {
        setData([]);
        setTotalLeads(0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch leads');
      toast.error(error.message || 'Failed to fetch leads');
      setData([]);
      setTotalLeads(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer title="Admin - Lead Management" description="This is the lead management page">
      <Breadcrumb title="Lead Management" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Lead
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
          totalProducts={totalLeads}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </PageContainer>
  );
};

export default LeadList;
