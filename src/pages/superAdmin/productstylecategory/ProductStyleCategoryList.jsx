import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Fab,
  Tooltip,
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import {
  getAllProductStyleCategories,
  deleteProductStyleCategory,
} from '@/api/productstylecategory.api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import CustomDialog from '@/components/CustomDialog';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ProductStyleCategoryList = () => {
  console.log('🚀 ~ ProductStyleCategoryList ~ Component mounted');
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const tabOptions = [
    { label: 'All', value: '' },
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Boys', value: 'boys' },
    { label: 'Others', value: 'others' },
  ];
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const allowedToEdit = ['superadmin', 'merchandiser', 'supermerchandiser','admin'].includes(userType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Product Style Category', to: `/${userType}/productstylecategory` },
  ];

  const fetchData = async () => {
    console.log('🚀 ~ ProductStyleCategoryList ~ fetchData ~ Starting API call');
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProductStyleCategories({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        productCategory: categoryFilter,
      });
      console.log('🚀 ~ ProductStyleCategoryList ~ fetchData ~ response:', response);
      const items = response.data || [];
      setData(items);
      setTotal(response.total || 0);
    } catch (err) {
      console.error('🚀 ~ ProductStyleCategoryList ~ fetchData ~ error:', err);
      setError(err.message || 'Failed to fetch data');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [paginationModel, categoryFilter]);

  const handleDelete = async (id) => {
    try {
      await deleteProductStyleCategory(id);
      toast.success('Deleted successfully');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'SERIAL NUMBER',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => params.value,
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
    {
      field: 'ageGroup',
      headerName: 'AGE GROUP',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => params.value || 'N/A',
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
    {
      field: 'productCategory',
      headerName: 'PRODUCT CATEGORY',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) =>
        params.value ? params.value.charAt(0).toUpperCase() + params.value.slice(1) : 'N/A',
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
    {
      field: 'fashionType',
      headerName: 'FASHION TYPE',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => params.value || 'N/A',
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
    {
      field: 'season',
      headerName: 'SEASON',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => params.value || 'N/A',
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
    {
      field: 'action',
      headerName: 'ACTION',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Tooltip title="View">
              <Fab
                color="info"
                size="small"
                onClick={() => navigate(`/${userType}/productstylecategory/view/${row._id}`)}
              >
                <VisibilityIcon fontSize="small" />
              </Fab>
            </Tooltip>
            {allowedToEdit && (
              <Tooltip title="Edit">
                <Fab
                  color="warning"
                  size="small"
                  onClick={() => navigate(`/${userType}/productstylecategory/edit/${row._id}`)}
                >
                  <EditIcon fontSize="small" />
                </Fab>
              </Tooltip>
            )}
            {allowedToEdit && (
              <Fab color="error" size="small">
                <CustomDialog
                  title="Confirm Delete"
                  icon="delete"
                  handleClickDelete={() => handleDelete(row._id)}
                >
                  <Typography>
                    Are you sure you want to delete this Product Style Category?
                  </Typography>
                  <Typography variant="caption" color="error">
                    This action cannot be undone.
                  </Typography>
                </CustomDialog>
              </Fab>
            )}
          </Box>
        );
      },
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
  ];

  return (
    <PageContainer title="Admin - Product Style Category" description="">
      <Breadcrumb title="Product Style Category" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => {
              setTabValue(newValue);
              setCategoryFilter(tabOptions[newValue].value);
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {tabOptions.map((tab) => (
              <Tab key={tab.value || 'all'} label={tab.label} />
            ))}
          </Tabs>
        </Stack>
        {allowedToEdit && (
          <Button
            sx={{ position: 'absolute', top: '0.5rem', right: '1rem', zIndex: 1 }}
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={() => navigate(`/${userType}/productstylecategory/create`)}
          >
            Add Product
          </Button>
        )}
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
          rows={data.map((item, idx) => ({
            ...item,
            id: idx + 1 + paginationModel.page * paginationModel.pageSize,
          }))}
          loading={loading}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          totalProducts={typeof total === 'number' ? total : 0}
          getRowId={(row) => row.id}
        />
      </Box>
    </PageContainer>
  );
};

export default ProductStyleCategoryList;
