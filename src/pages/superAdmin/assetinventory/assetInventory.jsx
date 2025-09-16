'use client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Button, Fab, Typography } from '@mui/material';
import { IconAlbum, IconEdit, IconEye } from '@tabler/icons';
import { toast } from 'react-toastify';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { fetchAssetInventoryByType } from '@/api/assetinventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Inventory' }];

const AssetInventory = () => {
  const userType = useSelector(selectCurrentUserType);
  console.log('🚀 ~ AssetInventory ~ userType:', userType);

  // Permission checks for different user types
  const canCreate =
    userType === 'admin' || userType === 'superadmin' || userType === 'assetmanager';
  const canEdit = userType === 'admin' || userType === 'superadmin' || userType === 'assetmanager';
  const canView = true; // Everyone can view
  const canViewOnly = userType === 'accounts'; // Accounts has view-only access

  console.log('🚀 ~ AssetInventory ~ canCreate:', canCreate, 'canEdit:', canEdit);

  const [selectedTab, setSelectedTab] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();

  // Map tab index to asset type
  const assetTypes = [
    'MACHINERY',
    'ELECTRICALS',
    'ELECTRONICS',
    'FURNITURE&FIXTURES',
    'IMMOVABLE PROPERTIES',
    'VEHICLES',
    'SOFTWARES&LICENSES',
  ];

  const currentAssetType = assetTypes[selectedTab];

  const handleClickView = (id) => {
    navigate(`/${userType}/asset-inventory/${currentAssetType}/${id}`);
  };

  const handleClickCreate = () => {
    navigate(`/${userType}/asset-inventory/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/asset-inventory/edit/${currentAssetType}/${id}`);
  };

  const viewLotDetails = (inventoryId) => {
    navigate(`/${userType}/asset-inventory/lots/${currentAssetType}/${inventoryId}`);
  };

  useEffect(() => {
    fetchAssetInventoryData();
  }, [selectedTab, paginationModel]);

  const fetchAssetInventoryData = async () => {
    try {
      setLoading(true);
      setInventory([]);
      const response = await fetchAssetInventoryByType({
        assetType: currentAssetType,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: '',
      });

      if (response && response.data) {
        const inventoryData = Array.isArray(response.data.items)
          ? response.data.items
          : [response.data];

        // Process data to ensure proper field mapping
        const processedData = inventoryData.map((item) => ({
          ...item,
          description: item.assetName || item.description, // Map assetName to description for display
          minimumRequiredStock: item.minimumRequiredStock || item.MinreqStock || 0,
          lowStockAlert:
            (item.currentStock || 0) < (item.minimumRequiredStock || item.MinreqStock || 0),
        }));

        setInventory(processedData);
        setTotalPages(
          response.data.totalCount || response.data.totalPages || processedData.length || 0,
        );
      }
    } catch (error) {
      toast.error(`Error fetching ${currentAssetType} asset inventory: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const getColumns = () => [
    {
      field: 'id',
      headerName: 'ID',
      width: 50,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      valueGetter: (params) => {
        return params.row && params.row._id ? params.row._id.substring(0, 5) : '-';
      },
    },
    {
      field: 'assetCode',
      headerName: 'ASSET CODE',
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
              <Fab color="primary" size="small" onClick={() => handleClickView(params.row._id)}>
                <IconEye />
              </Fab>
            )}
            {canView && (
              <Fab color="primary" size="small" onClick={() => viewLotDetails(params.row._id)}>
                <IconAlbum />
              </Fab>
            )}
            {canEdit && (
              <Fab color="warning" size="small" onClick={() => handleClickEdit(params.row._id)}>
                <IconEdit />
              </Fab>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer title="Asset Inventory" description="Asset Inventory">
      <Breadcrumb title="Asset Inventory" items={BCrumb} />
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="asset inventory tabs">
            <Tab label="Machinery" />
            <Tab label="Electricals" />
            <Tab label="Electronics" />
            <Tab label="Furniture & Fixtures" />
            <Tab label="Immovable Properties" />
            <Tab label="Vehicles" />
            <Tab label="Software & Licenses" />
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
              Create Asset Inventory
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

export default AssetInventory;
