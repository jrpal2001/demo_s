'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Button, Fab, Typography } from '@mui/material';
import { IconAlbum, IconEdit, IconEye } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { fetchOtherStoreInventoryByType } from '@/api/otherstoresInventory.api';

const OtherStoreInventory = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);

  // Map tab index to item type
  const itemTypes = ['TOOLS&SPAREPARTS', 'STATIONERY&HOUSEKEEPING', 'EMBROIDERYSTORE'];
  const currentItemType = itemTypes[selectedTab];

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Other Store Inventory', to: `/${userType}/otherstore-inventory` },
  ];

  const handleClickCreate = () => {
    navigate(`/${userType}/otherstore-inventory/create`);
  };

  useEffect(() => {
    fetchOtherStoreInventoryData();
  }, [selectedTab, paginationModel]);

  const fetchOtherStoreInventoryData = async () => {
    try {
      setLoading(true);
      setInventory([]);

      const response = await fetchOtherStoreInventoryByType({
        itemType: currentItemType,
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: '',
      });

      if (response && response.data) {
        const inventoryData = Array.isArray(response.data.items)
          ? response.data.items
          : [response.data];

        // Process data to ensure lowStockAlert is calculated
        const processedData = inventoryData.map((item) => ({
          ...item,
          description: item.itemName, // Map itemName to description for display
          MinreqStock: item.minimumRequiredStock, // Map minimumRequiredStock to MinreqStock
          lowStockAlert: item.currentStock < item.minimumRequiredStock,
        }));

        setInventory(processedData);
        setTotalPages(
          response.data.totalCount || response.data.totalPages || processedData.length || 0,
        );
      }
    } catch (error) {
      toast.error(`Error fetching ${currentItemType} other store inventory: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickViewOtherStore = (id) => {
    navigate(`/${userType}/otherstore-inventory/${currentItemType}/${id}`);
  };

  const handleClickEditOtherStore = (id) => {
    navigate(`/${userType}/otherstore-inventory/edit/${currentItemType}/${id}`);
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const viewLotDetails = (inventoryId) => {
    navigate(`/${userType}/otherstore-inventory/lots/${currentItemType}/${inventoryId}`);
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
      field: 'itemCode',
      headerName: 'ITEM CODE',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'description', // This will now use the mapped itemName
      headerName: 'DESCRIPTION',
      flex: 1,
      minWidth: 150,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'category',
      headerName: 'CATEGORY',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'brand',
      headerName: 'BRAND',
      flex: 1,
      minWidth: 100,
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
      field: 'MinreqStock', // This will now use the mapped minimumRequiredStock
      headerName: 'MIN REQUIRED',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'condition',
      headerName: 'CONDITION',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const condition = params.row.condition || 'New';
        let color = 'success.main';
        if (condition === 'Damaged') color = 'error.main';
        if (condition === 'Used') color = 'warning.main';

        return <Typography color={color}>{condition}</Typography>;
      },
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
            <Fab color="primary" size="small">
              <IconEye onClick={() => handleClickViewOtherStore(params.row._id)} />
            </Fab>
            <Fab color="primary" size="small">
              <IconAlbum onClick={() => viewLotDetails(params.row._id)} />
            </Fab>
            <Fab color="warning" size="small">
              <IconEdit onClick={() => handleClickEditOtherStore(params.row._id)} />
            </Fab>
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer title="Other Store Inventory" description="Other Store Inventory">
      <Breadcrumb title="Other Store Inventory" items={BCrumb} />
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="other store inventory tabs">
            <Tab label="Tools & Spare Parts" />
            <Tab label="Stationery & Housekeeping" />
            <Tab label="Embroidery Store" />
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ position: 'relative', zIndex: 1 }}
            onClick={handleClickCreate}
          >
            Create Other Store Inventory
          </Button>

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

export default OtherStoreInventory;
