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
import { fetchAllOtherStoreInwards } from '@/api/otherstoresInward.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const getColumns = () => [
  {
    field: 'id',
    headerName: 'SERIAL NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 0.5,
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
            {params.row.poNumber?.purchaseOrderNumber || params.row.poNumber || 'N/A'}
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
    field: 'itemCode',
    headerName: 'ITEM CODE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.itemId || params.row.itemId || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'itemName',
    headerName: 'ITEM NAME',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.itemName || params.row.itemName || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'itemType',
    headerName: 'ITEM TYPE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.itemType || params.row.itemType || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'category',
    headerName: 'CATEGORY',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.category || params.row.category || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'brand',
    headerName: 'BRAND',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.brand || params.row.brand || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'quantityReceived',
    headerName: 'QTY',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 0.5,
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
    flex: 0.5,
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
    field: 'manufacturingDate',
    headerName: 'MFG DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const date = params.row.item?.manufacturingDate
        ? new Date(params.row.item.manufacturingDate).toLocaleDateString()
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
    field: 'expiryDate',
    headerName: 'EXPIRY DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const date = params.row.item?.expiryDate
        ? new Date(params.row.item.expiryDate).toLocaleDateString()
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
    field: 'batchNumber',
    headerName: 'BATCH NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.batchNumber || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'warrantyPeriod',
    headerName: 'WARRANTY',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.warrantyPeriod || 'N/A'}</Typography>
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
    headerName: 'INSP. STATUS',
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
    field: 'condition',
    headerName: 'CONDITION',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const condition = params.row.condition;
      let color = 'inherit';
      if (condition === 'New') color = 'success.main';
      if (condition === 'Damaged' || condition === 'Repair needed') color = 'error.main';
      if (condition === 'Used' || condition === 'Refurbished') color = 'info.main';
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography color={color} fontWeight="medium">
            {condition || 'N/A'}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'qualityCheckStatus',
    headerName: 'QC STATUS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const status = params.row.qualityCheckStatus;
      let color = 'inherit';
      if (status === 'Pass') color = 'success.main';
      if (status === 'Fail') color = 'error.main';
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
    flex: 0.5,
  },
];

const OtherStoreInwardAll = () => {
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

  const itemTypes = ['TOOLS&SPAREPARTS', 'STATIONERY&HOUSEKEEPING', 'EMBROIDERYSTORE'];
  const currentItemType = itemTypes[selectedTab];

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Other Store Inward', to: `/${userType}/otherstore-inward` },
  ];

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ pageSize: 5, page: 0 });
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleClickCreate = () => {
    navigate(`/${userType}/otherstore-inward/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/otherstore-inward/${id}?itemType=${currentItemType}`);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAllOtherStoreInwards({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
        search: searchQuery,
        itemType: currentItemType,
      });
      if (response && response.data && response.data.data) {
        setData(response.data.data);
        setTotalProducts(response.data.totalCount || response.data.data.length);
        if (isSearching) {
          if (response.data.data.length === 0) {
            toast.info(`No results found for "${searchQuery}"`);
          } else {
            toast.success(`Found ${response.data.data.length} results for "${searchQuery}"`);
          }
        }
      } else {
        setData([]);
        setTotalProducts(0);
        if (isSearching) {
          toast.info(`No results found for "${searchQuery}"`);
        } else {
          toast.warning(response?.message || `No other store inwards found for ${currentItemType}`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to fetch ${currentItemType} other store inwards data`);
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [currentItemType, paginationModel.page, paginationModel.pageSize, searchQuery, isSearching]);

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
    <PageContainer title="Admin - Other Store Inward" description="This is other store inward page">
      <Breadcrumb title="Other Store Inward" items={BCrumb} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="other store inward tabs">
          <Tab label="Tools & Spare Parts" />
          <Tab label="Stationery & Housekeeping" />
          <Tab label="Embroidery Store" />
        </Tabs>
      </Box>
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            label={`Search ${itemTypes[selectedTab]} by Indent ID, Vendor ID, or Item Code`}
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
              Search by Indent ID, Vendor ID, or Item Code
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Button sx={{ position: 'relative', zIndex: 1 }} onClick={handleClickCreate}>
          Create Other Store Inward
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

export default OtherStoreInwardAll;
