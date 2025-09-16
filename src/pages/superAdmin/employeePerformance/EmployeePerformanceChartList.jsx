import { getAllEmployeePerformance, deleteEmployeePerformance } from '@/api/employeePerformance.api';
import PageContainer from '@/components/container/PageContainer';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, CircularProgress, Typography, Fab } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons';
import Tooltip from '@mui/material/Tooltip';
import CustomDialog from '@/components/CustomDialog';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [
  { to: '/', title: 'Home' },
  { title: 'Employee Performance Chart' },
];

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  } catch (error) {
    return 'Error';
  }
};

const EmployeePerformanceChartList = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
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
      headerName: 'SERIAL NO.',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value}</div>,
    },
    {
      field: 'employeeName',
      headerName: 'EMPLOYEE NAME',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'employeeId',
      headerName: 'EMPLOYEE ID',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'department',
      headerName: 'DEPARTMENT',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'overallPerformance',
      headerName: 'OVERALL PERFORMANCE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: () => <div style={cellStyle}>—</div>,
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Tooltip title="View">
              <Fab color="info" size="small" onClick={() => navigate(`/${userType}/employee-performance/chart/view/${row._id}`)}>
                <IconEye size={18} />
              </Fab>
            </Tooltip>
            <Tooltip title="Edit">
              <Fab color="warning" size="small" onClick={() => navigate(`/${userType}/employee-performance/chart/edit/${row._id}`)}>
                <IconEdit size={18} />
              </Fab>
            </Tooltip>
            <Fab color="error" size="small">
              <CustomDialog
                title="Confirm Delete"
                icon="delete"
                handleClickDelete={() => handleDelete(row._id)}
              >
                <Typography>Are you sure you want to delete this Employee Performance Chart?</Typography>
                <Typography variant="caption" color="error">This action cannot be undone.</Typography>
              </CustomDialog>
            </Fab>
          </Box>
        );
      },
    },
  ];

  const handleClickCreate = () => {
    navigate(`/${userType}/employee-performance/chart/create`);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllEmployeePerformance({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      if (response && Array.isArray(response)) {
        const mappedData = response.map((item, index) => ({
          ...item,
          id: index + 1 + paginationModel.page * paginationModel.pageSize,
        }));
        setData(mappedData);
        setTotal(response.length);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch employee performance records');
      toast.error(error.message || 'Failed to fetch employee performance records');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteEmployeePerformance(id);
      toast.success('Employee Performance Chart deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Failed to delete Employee Performance Chart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [paginationModel]);

  return (
    <PageContainer title="Admin - Employee Performance Chart List" description="List of Employee Performance Charts">
      <Breadcrumb title="Employee Performance Chart" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Add Performance
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
          totalProducts={total}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </PageContainer>
  );
};

export default EmployeePerformanceChartList; 