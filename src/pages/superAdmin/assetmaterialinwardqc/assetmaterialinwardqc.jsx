'use client';
import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Fab, Typography, IconButton, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import CustomTable from '@/components/shared/CustomTable';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { IconEye, IconX, IconSearch, IconEdit } from '@tabler/icons';
import CustomDialog from '@/components/CustomDialog';
import {
  deleteAssetMaterialInwardQc,
  fetchAssetMaterialInwardQcsData,
} from '@/api/assetMaterialInwardQc.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Material Inward QC' }];

// Helper function to get display code for items
const getItemDisplayCode = (item) => {
  if (item?.codeDetails?.mainAssetId) return item.codeDetails.mainAssetId;
  if (item?.codeDetails?.mainMaintenanceId) return item.codeDetails.mainMaintenanceId;
  if (item?.codeDetails?.mainItemCode) return item.codeDetails.mainItemCode;
  return item?.code || 'N/A';
};

const getColumns = (handleDelete, handleEdit, handleEditRecord) => [
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
          <Typography>{params.row.purchaseOrderNumber?.purchaseOrderNumber || 'N/A'}</Typography>
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
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.purchaseOrderNumber?.indentId?.indentId || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'vendorId',
    headerName: 'VENDOR ID',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.purchaseOrderNumber?.vendorId?.vendorId || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'vendorName',
    headerName: 'VENDOR NAME',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.purchaseOrderNumber?.vendorId?.vendorName || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'itemCode',
    headerName: 'ITEM CODE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      const firstItem = params.row.items?.[0];
      const displayCode = getItemDisplayCode(firstItem);
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{displayCode}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'model',
    headerName: 'MODEL',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.items?.[0]?.model || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'itemDescription',
    headerName: 'DESCRIPTION',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.items?.[0]?.description || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'quantityReceived',
    headerName: 'QTY RECEIVED',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.items?.[0]?.quantityReceived || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'quantityAccepted',
    headerName: 'QTY ACCEPTED',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.items?.[0]?.quantityAccepted || 'N/A'}</Typography>
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
          <Typography>{params.row.items?.[0]?.uom || 'N/A'}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'invoiceNumber',
    headerName: 'INVOICE NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.invoiceNumber || 'N/A'}</Typography>
        </Box>
      );
    },
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
      if (status === 'accepted') color = 'success.main';
      if (status === 'rejected') color = 'error.main';
      if (status === 'pending') color = 'warning.main';
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography color={color} fontWeight="medium">
            {status?.toUpperCase() || 'N/A'}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    width: 160,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            minWidth: 140,
          }}
        >
          <Fab color="primary" size="small" onClick={() => handleEdit(params.row._id)}>
            <IconEye size="18" />
          </Fab>
          <Fab color="secondary" size="small" onClick={() => handleEditRecord(params.row._id)}>
            <IconEdit size="18" />
          </Fab>
          <Fab color="error" size="small">
            <CustomDialog
              title="Confirm Delete"
              icon="delete"
              handleClickDelete={() => handleDelete(params.row._id)}
            >
              <Typography>
                Are you sure you want to delete this asset material inward QC record?
              </Typography>
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

const AssetMaterialInwardQcAll = () => {
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
    navigate(`/${userType}/asset-material-inward-qc/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/asset-material-inward-qc/${id}`);
  };

  const handleEditRecord = (id) => {
    navigate(`/${userType}/asset-material-inward-qc/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAssetMaterialInwardQc(id);
      toast.success('Record deleted successfully');
      fetchData(); // Refresh the data
    } catch (error) {
      toast.error('Failed to delete record: ' + error.message);
    }
  };

  // Memoize fetchData to avoid recreation on every render
  const fetchData = useCallback(async () => {
    console.log('Fetching data with search:', searchQuery);
    setLoading(true);
    try {
      const response = await fetchAssetMaterialInwardQcsData(
        paginationModel.page,
        paginationModel.pageSize,
        searchQuery,
      );
      console.log('🚀 ~ fetchData response:', response);
      if (response && response.assetMaterialInwardQc) {
        setData(response.assetMaterialInwardQc);
        setTotalProducts(response.totalCount || response.assetMaterialInwardQc.length || 0);
        // Show toast for search results
        if (isSearching) {
          if (response.assetMaterialInwardQc.length === 0) {
            toast.info(`No results found for "${searchQuery}"`);
          } else {
            toast.success(
              `Found ${response.assetMaterialInwardQc.length} results for "${searchQuery}"`,
            );
          }
        }
      } else {
        setData([]);
        setTotalProducts(0);
        if (isSearching) {
          toast.info(`No results found for "${searchQuery}"`);
        } else {
          toast.warning(response?.message || 'No asset material inward QC records found');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch asset material inward QC data');
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
    <PageContainer
      title="Admin - Asset Material Inward QC"
      description="This is asset material inward QC page"
    >
      <Breadcrumb title="Asset Material Inward QC" items={BCrumb} />
      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomTextField
            label="Search by Indent ID, Vendor ID, or Item Code"
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
          Create Asset Material Inward QC
        </Button>
        <CustomTable
          columns={getColumns(handleDelete, handleClickView, handleEditRecord)}
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

export default AssetMaterialInwardQcAll;
