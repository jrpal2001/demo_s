'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Button, Fab, Typography } from '@mui/material';
import { IconAlbum, IconEdit, IconEye } from '@tabler/icons';
import { toast } from 'react-toastify';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { fetchMaintenanceInventoryByType } from '@/api/maintenanceInventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Maintenance Inventory' }];

const MaintenanceInventory = () => {
  const userType = useSelector(selectCurrentUserType);
  const [selectedTab, setSelectedTab] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();

  // Map tab index to maintenance type
  const maintenanceTypes = [
    'BUSINESSLICENSE',
    'WEIGHTS&MEASUREMENTS',
    'SAFETYEQUIPMENT',
    'AMC',
    'INSURANCE',
    'AGREEMENTS',
  ];
  const currentMaintenanceType = maintenanceTypes[selectedTab];

  const handleClickCreate = () => {
    navigate(`/${userType}/maintenance-inventory/create`);
  };

  useEffect(() => {
    fetchMaintenanceInventoryData();
  }, [selectedTab, paginationModel]);

  const fetchMaintenanceInventoryData = async () => {
    try {
      setLoading(true);
      setInventory([]);

      const response = await fetchMaintenanceInventoryByType({
        maintenanceType: currentMaintenanceType,
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
          description: item.maintenanceName, // Map maintenanceName to description for display
          MinreqStock: item.minimumRequiredStock, // Map minimumRequiredStock to MinreqStock
          lowStockAlert: item.currentStock < item.minimumRequiredStock,
        }));

        setInventory(processedData);
        setTotalPages(
          response.data.totalCount || response.data.totalPages || processedData.length || 0,
        );
      }
    } catch (error) {
      toast.error(
        `Error fetching ${currentMaintenanceType} maintenance inventory: ${error.message}`,
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickViewMaintenance = (id) => {
    navigate(`/${userType}/maintenance-inventory/${currentMaintenanceType}/${id}`);
  };

  const handleClickEditMaintenance = (id) => {
    navigate(`/${userType}/maintenance-inventory/edit/${currentMaintenanceType}/${id}`);
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  const viewLotDetails = (inventoryId) => {
    navigate(`/${userType}/maintenance-inventory/lots/${currentMaintenanceType}/${inventoryId}`);
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
      field: 'maintenanceCode',
      headerName: 'MAINTENANCE CODE',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'description', // This will now use the mapped maintenanceName
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
      field: 'MinreqStock', // This will now use the mapped minimumRequiredStock
      headerName: 'MIN REQUIRED',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const status = params.row.status || 'Active';
        let color = 'success.main';
        if (status === 'Expired') color = 'error.main';
        if (status === 'Pending') color = 'warning.main';

        return <Typography color={color}>{status}</Typography>;
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
              <IconEye onClick={() => handleClickViewMaintenance(params.row._id)} />
            </Fab>
            <Fab color="primary" size="small">
              <IconAlbum onClick={() => viewLotDetails(params.row._id)} />
            </Fab>
            <Fab color="warning" size="small">
              <IconEdit onClick={() => handleClickEditMaintenance(params.row._id)} />
            </Fab>
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer title="Maintenance Inventory" description="Maintenance Inventory">
      <Breadcrumb title="Maintenance Inventory" items={BCrumb} />
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="maintenance inventory tabs">
            <Tab label="Business License" />
            <Tab label="Weights & Measurements" />
            <Tab label="Safety Equipment" />
            <Tab label="AMC" />
            <Tab label="Insurance" />
            <Tab label="Agreements" />
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ position: 'relative', zIndex: 1 }}
            onClick={handleClickCreate}
          >
            Create Maintenance Inventory
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

export default MaintenanceInventory;
