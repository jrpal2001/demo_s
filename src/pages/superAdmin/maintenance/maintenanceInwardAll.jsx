'use client';
import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Fab, Typography, Tabs, Tab, IconButton, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import CustomTable from '@/components/shared/CustomTable';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { IconEye, IconX, IconSearch } from '@tabler/icons';
import { fetchAllMaintenanceInwards } from '@/api/maintenanceInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const MAINTENANCE_TYPES = [
  'BUSINESSLICENSE',
  'WEIGHTS&MEASUREMENTS',
  'SAFETYEQUIPMENT',
  'AMC',
  'INSURANCE',
  'AGREEMENTS',
];

const getColumns = () => [
  {
    field: 'id',
    headerName: 'SERIAL NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'poNumber',
    headerName: 'PO NUMBER',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>
            {params.row.poNumber?.purchaseOrderNumber ||
              params.row.purchaseOrderNumber?.purchaseOrderNumber ||
              'N/A'}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'indentId',
    headerName: 'INDENT ID',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'vendorId',
    headerName: 'VENDOR ID',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'vendorName',
    headerName: 'VENDOR NAME',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'maintenanceCode', // Changed from assetCode
    headerName: 'MAINTENANCE CODE', // Changed from ASSET CODE
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>
            {params.row.item?.maintenanceId || params.row.maintenanceId || 'N/A'}
          </Typography>{' '}
          {/* Changed from assetId */}
        </Box>
      );
    },
  },
  {
    field: 'maintenanceName', // Changed from assetName
    headerName: 'MAINTENANCE NAME', // Changed from ASSET NAME
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>
            {params.row.item?.maintenanceName || params.row.maintenanceName || 'N/A'}
          </Typography>{' '}
          {/* Changed from assetName */}
        </Box>
      );
    },
  },
  {
    field: 'maintenanceType', // Changed from assetType
    headerName: 'MAINTENANCE TYPE', // Changed from ASSET TYPE
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>
            {params.row.item?.maintenanceType || params.row.maintenanceType || 'N/A'}
          </Typography>{' '}
          {/* Changed from assetType */}
        </Box>
      );
    },
  },
  {
    field: 'quantityReceived',
    headerName: 'QTY',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>
            {params.row.item?.quantityReceived || params.row.quantityReceived || 'N/A'}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'uom',
    headerName: 'UOM',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.uom || params.row.uom || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'invoiceNo',
    headerName: 'INVOICE NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'invoiceDate',
    headerName: 'INVOICE DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const date = params.row.invoiceDate
        ? new Date(params.row.invoiceDate).toLocaleDateString()
        : 'N/A';
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{date}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'lotNo',
    headerName: 'LOT NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'inspectionStatus',
    headerName: 'STATUS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const status = params.row.inspectionStatus;
      let color = 'inherit';
      if (status === 'Accepted') color = 'success.main';
      if (status === 'Rejected') color = 'error.main';
      if (status === 'Pending') color = 'warning.main';
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography color={color} fontWeight="medium">
            {status || 'N/A'}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'receivedBy',
    headerName: 'RECEIVED BY',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'inwardDate',
    headerName: 'INWARD DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const date = params.row.inwardDate ? params.row.inwardDate.split('T')[0] : 'N/A';
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{date}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
];

const MaintenanceInwardAll = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const currentMaintenanceType = MAINTENANCE_TYPES[selectedTab];
  const maintenanceTypes = MAINTENANCE_TYPES; // Declare maintenanceTypes variable

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/maintenance-inward`, title: 'Maintenance Inward' },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ pageSize: 5, page: 0 });
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleClickCreate = () => {
    navigate(`/${userType}/maintenance-inward/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/maintenance-inward/${id}?maintenanceType=${currentMaintenanceType}`);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllMaintenanceInwards({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        search: searchQuery,
      });
      if (response && response.data && response.data.data) {
        // Filter by current maintenance type
        const filteredData = response.data.data.filter(
          (item) => (item.item?.maintenanceType || '').toUpperCase() === currentMaintenanceType,
        );
        setData(filteredData);
        setTotalProducts(filteredData.length);
        if (isSearching) {
          if (filteredData.length === 0) {
            toast.info(`No results found for "${searchQuery}"`);
          } else {
            toast.success(`Found ${filteredData.length} results for "${searchQuery}"`);
          }
        }
      } else {
        setData([]);
        setTotalProducts(0);
        if (isSearching) {
          toast.info(`No results found for "${searchQuery}"`);
        } else {
          toast.warning(
            response?.message || `No maintenance inwards found for ${currentMaintenanceType}`,
          );
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to fetch ${currentMaintenanceType} maintenance inwards data`);
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [
    currentMaintenanceType,
    paginationModel.page,
    paginationModel.pageSize,
    searchQuery,
    isSearching,
  ]);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    setSearchTimeout(
      setTimeout(() => {
        setIsSearching(!!searchValue);
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
      }, 500),
    );
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PageContainer title="Admin - Maintenance Inward" description="This is maintenance inward page">
      <Breadcrumb title="Maintenance Inward" items={BCrumb} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="maintenance inward tabs">
          <Tab label="Business License" />
          <Tab label="Weights & Measurements" />
          <Tab label="Safety Equipment" />
          <Tab label="AMC" />
          <Tab label="Insurance" />
          <Tab label="Agreements" />
        </Tabs>
      </Box>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            label={`Search ${maintenanceTypes[selectedTab]} by Indent ID, Vendor ID, or Maintenance Code`}
            onChange={handleSearch}
            value={searchQuery}
            variant="outlined"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <IconSearch size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              endAdornment: searchQuery ? (
                <IconButton size="small" onClick={handleClearSearch}>
                  <IconX size={18} />
                </IconButton>
              ) : null,
            }}
          />
        </Box>
        {isSearching && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`Searching for: ${searchQuery}`}
              size="small"
              color="primary"
              onDelete={handleClearSearch}
              sx={{ mr: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Search by Indent ID, Vendor ID, or Maintenance Code
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Button sx={{ position: 'relative', zIndex: 1 }} onClick={handleClickCreate}>
          Create Maintenance Inward
        </Button>
        <CustomTable
          columns={getColumns().map((col) => {
            if (col.field === 'actions') {
              return {
                ...col,
                renderCell: (params) => {
                  return (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Fab
                        color="primary"
                        size="small"
                        onClick={() => handleClickView(params.row._id)}
                      >
                        <IconEye />
                      </Fab>
                    </Box>
                  );
                },
              };
            } else {
              return col;
            }
          })}
          rows={Array.isArray(data) ? data : []}
          loading={loading}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </PageContainer>
  );
};

export default MaintenanceInwardAll;
