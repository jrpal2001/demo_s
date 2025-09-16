import PageContainer from '@/components/container/PageContainer';
import CustomDialog from '@/components/CustomDialog';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Fab, Grid2, Typography, CircularProgress, Chip } from '@mui/material';
import { IconEdit, IconEye } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteAssetIndent, fetchAssetIndent } from '../../api/assetIndent';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Indent' }];

// Function to format date
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

// Function to capitalize first letter
const capitalize = (str) => {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const AssetIndent = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [error, setError] = useState(null);

  // Common cell style for centering content
  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  };

  // Define columns with direct rendering and centered content
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
      field: 'indentId',
      headerName: 'INDENT ID',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'date',
      headerName: 'DATE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{formatDate(params.value)}</div>,
    },
    {
      field: 'toDepartment',
      headerName: 'TO DEPARTMENT',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'priority',
      headerName: 'PRIORITY',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{capitalize(params.value)}</div>,
    },
    {
      field: 'items',
      headerName: 'ITEMS COUNT',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => (
        <div style={cellStyle}>
          <Chip 
            label={params.value?.length || 0} 
            size="small" 
            color="primary" 
            variant="outlined"
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
            <Fab 
              color="primary" 
              size="small" 
              onClick={() => handleClickView(params.row._id)}
              title="View Details"
            >
              <IconEye />
            </Fab>
            <Fab 
              color="warning" 
              size="small" 
              onClick={() => handleClickEdit(params.row._id)}
              title="Edit"
            >
              <IconEdit />
            </Fab>
            <Fab color="error" size="small" title="Delete">
              <CustomDialog
                title="Confirm Delete"
                icon="delete"
                handleClickDelete={() => handleClickDelete(params.row._id)}
              >
                <Typography>Are you sure you want to delete this asset indent?</Typography>
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
    navigate(`/${userType}/assetindent/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/assetindent/view/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/assetindent/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteAssetIndent(id);
      if (response) {
        toast.success('Asset indent deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete asset indent');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchAssetIndent(paginationModel.page, paginationModel.pageSize);
      console.log('📥 Frontend: Fetched asset indent data:', response);
      
      if (response && response.assetIndent) {
        const mappedData = response.assetIndent.map((item, index) => {
          const newItem = {
            ...item,
            id: index + 1 + paginationModel.page * paginationModel.pageSize,
          };
          return newItem;
        });
        setData(mappedData);
        setTotalProducts(response.totalCount);
      } else {
        console.warn('No asset indent data received or invalid format');
        setData([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch asset indents');
      toast.error(error.message || 'Failed to fetch asset indents');
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
    <PageContainer title="Admin - Asset Indent" description="This is the asset indent page">
      <Breadcrumb title="Asset Indent" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Asset Indent
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
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        />
      </Box>
    </PageContainer>
  );
};

export default AssetIndent;
