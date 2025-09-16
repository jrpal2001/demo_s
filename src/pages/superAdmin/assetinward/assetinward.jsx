'use client';
import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Fab, Typography, IconButton, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { fetchAllAssetInwards } from '@/api/assetinward.api';
import CustomTable from '@/components/shared/CustomTable';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { IconEye, IconX, IconSearch } from '@tabler/icons';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Inward' }];

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
    field: 'assetCode',
    headerName: 'ASSET CODE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.assetId || params.row.assetId || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'assetName',
    headerName: 'ASSET NAME',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.assetName || params.row.assetName || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'assetType',
    headerName: 'ASSET TYPE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.item?.assetType || params.row.assetType || 'N/A'}</Typography>
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

const AssetInwardAll = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleClickCreate = () => {
    navigate(`/${userType}/asset-inward/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/asset-inward/${id}`);
  };

  // Memoize fetchData to avoid recreation on every render
  const fetchData = useCallback(async () => {
    console.log('Fetching data with search:', searchQuery);
    setLoading(true);
    try {
      const response = await fetchAllAssetInwards(
        paginationModel.page,
        paginationModel.pageSize,
        searchQuery,
      );
      console.log('🚀 ~ fetchData response:', response);
      if (response && response.data && response.data.data) {
        // Access the nested data array
        setData(response.data.data);
        setTotalProducts(response.data.totalCount || response.data.data.length || 0);
        // Show toast for search results
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
          toast.warning(response.message || 'No asset inwards found');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch asset inwards data');
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, isSearching]);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    // Set a new timeout to delay the search
    setSearchTimeout(
      setTimeout(() => {
        // Set searching state based on whether there's a search query
        setIsSearching(!!searchValue);
        // Reset to first page when searching
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        // fetchData will be called by the useEffect below
      }, 500),
    );
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    // fetchData will be called by the useEffect below when searchQuery changes
  };

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <PageContainer title="Admin - Asset Inward" description="This is asset inward page">
      <Breadcrumb title="Asset Inward" items={BCrumb} />

      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            label="Search by Indent ID, Vendor ID, or Asset Code"
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
              Search by Indent ID, Vendor ID, or Asset Code
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
        >
          Create Inward
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

export default AssetInwardAll;
