import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Button, Fab, Typography } from '@mui/material';
import { IconAlbum, IconEdit, IconEye } from '@tabler/icons';
import { toast } from 'react-toastify';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { fetchAllInventory } from '@/api/inventory.api';

import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Product Inventory' }];

const ProductInventory = () => {
  const userType = useSelector(selectCurrentUserType);
  console.log('🚀 ~ ProductInventory ~ userType:', userType);
  // Permission checks for different user types
  const canCreate = userType === 'admin' || userType === 'superadmin' || userType === 'merchandiser' || userType === 'trimsandmachinepartsstore';
  const canEdit = userType === 'admin' || userType === 'superadmin' || userType === 'merchandiser' || userType === 'trimsandmachinepartsstore';
  const canView = true; // Everyone can view
  const canViewOnly = userType === 'accounts'; // Accounts has view-only access
  console.log('🚀 ~ ProductInventory ~ canCreate:', canCreate, 'canEdit:', canEdit);

  const [selectedTab, setSelectedTab] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();

  // Map tab index to department name
  const departments = ['fabric', 'trims', 'accessories'];
  const currentDepartment = departments[selectedTab];

  const handleClickView = (id) => {
    navigate(`/${userType}/inventory/${id}?department=${currentDepartment}`);
  };

  const handleClickCreate = () => {
    navigate(`/${userType}/inventory/create`);
  };

  useEffect(() => {
    fetchInventoryData();
  }, [selectedTab, paginationModel]);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setInventory([]);

      const response = await fetchAllInventory(
        currentDepartment,
        paginationModel.page,
        paginationModel.pageSize,
      );

      if (response && response.data) {
        const inventoryData = Array.isArray(response.data) ? response.data : [response.data];

        // Process data to ensure lowStockAlert is calculated
        const processedData = inventoryData.map((item) => ({
          ...item,
          lowStockAlert: item.currentStock < item.minimumRequiredStock,
        }));

        setInventory(processedData);
        setTotalPages(response.totalCount || processedData.length || 0);
      }
    } catch (error) {
      toast.error(`Error fetching ${currentDepartment} inventory: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //mine

  const handleClickViewinventory = (id) => {
    console.log('🚀 ~ handleClickView ~ currentDepartment:', currentDepartment);
    navigate(`/${userType}/inventory/${currentDepartment}/${id}`);
  };

  const handleClickEditinventory = (id) => {
    console.log('id ', id);
    navigate(`/${userType}/inventory/edit/${currentDepartment}/${id}`);
  };
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const viewLotdetails = (inventoryId) => {
    navigate(`/${userType}/inventory/lots/${currentDepartment}/${inventoryId}`);
  };
  const getColumns = () => [
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      valueGetter: (params) => {
        // Safely check if params.row exists and has _id property
        return params.row && params.row._id ? params.row._id.substring(0, 5) : '-';
      },
    },
    {
      field: 'itemCode',
      headerName: 'ITEM CODE',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'description',
      headerName: 'DESCRIPTION',
      flex: 1,
      minWidth: 150,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'uom',
      headerName: 'UOM',
      flex: 1,
      minWidth: 80,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'currentStock',
      headerName: 'CURRENT STOCK',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'minimumRequiredStock',
      headerName: 'MIN REQUIRED',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'lowStockAlert',
      headerName: 'LOW STOCK ALERT',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography color={params.row && params.row.lowStockAlert ? 'error.main' : 'success.main'}>
          {params.row && params.row.lowStockAlert ? 'YES' : 'NO'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            {canView && (
              <Fab color="primary" size="small">
                <IconEye onClick={() => handleClickViewinventory(params.row._id)} />
              </Fab>
            )}
            {canView && (
              <Fab color="primary" size="small">
                <IconAlbum onClick={() => viewLotdetails(params.row._id)} />
              </Fab>
            )}
            {canEdit && (
              <Fab color="warning" size="small">
                <IconEdit onClick={() => handleClickEditinventory(params.row._id)} />
              </Fab>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer title="Product Inventory" description="Product Inventory">
      <Breadcrumb title="Product Inventory" items={BCrumb} />
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="inventory tabs">
            <Tab label="Fabric" />
            <Tab label="Trim" />
            <Tab label="Accessories" />
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {canCreate && (
            <Button
              variant="contained"
              color="primary"
              sx={{ position: 'relative', zIndex: 1 }}
              onClick={handleClickCreate}
            >
              Create Inventory
            </Button>
          )}

          <CustomTable
            rows={inventory}
            columns={getColumns()}
            totalProducts={totalPages}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            loading={loading}
            getRowId={(row) => (row && row._id ? row._id : Math.random().toString())}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ProductInventory;
