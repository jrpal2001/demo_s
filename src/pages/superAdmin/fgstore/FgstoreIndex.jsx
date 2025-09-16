import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Typography, Tabs, Tab, IconButton, Chip, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomTable from '@/components/shared/CustomTable';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { fetchProductMaster } from '@/api/productmaster.api.js';
import { IconSearch, IconX } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { Fab } from '@mui/material';
import { IconEdit, IconEye, IconCirclePlus } from '@tabler/icons';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Fgstore' }];

const FGstore = () => {
  const userType = useSelector(selectCurrentUserType);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // 0 for Requests, 1 for Stock tracking
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Trim the search query to remove any leading/trailing whitespace
      const trimmedSearch = searchQuery.trim();
      console.log('Fetching data with SKU code search:', trimmedSearch);

      const response = await fetchProductMaster({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: trimmedSearch,
      });

      console.log('🚀 ~ fetchData ~ response:', response);

      if (response && response.productMaster) {
        setData(response.productMaster);
        setTotalProducts(response.dataCount || 0);

        // Show feedback for search results
        if (isSearching && trimmedSearch) {
          if (response.productMaster.length === 0) {
            setError(
              `No products found with SKU code "${trimmedSearch}". Please check the SKU code and try again.`,
            );
            toast.info(`No products found with SKU code "${trimmedSearch}"`);
          } else {
            toast.success(
              `Found ${response.productMaster.length} products with SKU code "${trimmedSearch}"`,
            );
          }
        }
      } else {
        setData([]);
        setTotalProducts(0);
        if (isSearching && trimmedSearch) {
          setError(
            `No products found with SKU code "${trimmedSearch}". Please check the SKU code and try again.`,
          );
        } else {
          setError('No products found');
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
      setData([]);
      setTotalProducts(0);
      setError(`Error: ${error.message || 'Failed to fetch products'}`);
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
        // Set searching state to true when there's a search query
        setIsSearching(!!searchValue.trim());
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

  // Initial data load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      field: 'id',
      headerName: 'SERIAL NO',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
    },
    {
      field: 'skuCode',
      headerName: 'SKU CODE',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'NAME',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
    },
    {
      field: 'color',
      headerName: 'COLOR',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
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
            sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Typography>{params.row.category?.toUpperCase()}</Typography>
          </Box>
        );
      },
    },
    {
      field: 'tracking',
      headerName: 'TRACKING',
      headerAlign: 'center',
      flex: 2,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        // Show different buttons based on the selected tab
        return (
          <Box
            onClick={(e) => e.stopPropagation()} // ✅ Prevent row click
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {selectedTab === 0 ? (
              // Requests tab
              <>
                <Button
                  sx={{
                    backgroundImage: 'linear-gradient(black, black)',
                    color: 'white',
                    marginRight: '5px',
                  }}
                  onClick={() =>
                    navigate(`requests`, {
                      state: { rowData: params.row },
                    })
                  }
                >
                  Requests
                </Button>
                <Button
                  sx={{
                    backgroundImage: 'linear-gradient(black, black)',
                    color: 'white',
                    marginRight: '5px',
                  }}
                  onClick={() =>
                    navigate(`defects`, {
                      state: { rowData: params.row },
                    })
                  }
                >
                  Defects
                </Button>
              </>
            ) : (
              // Stock tracking tab
              <>
                <Button
                  sx={{
                    backgroundImage: 'linear-gradient(black, black)',
                    color: 'white',
                    marginRight: '5px',
                  }}
                  onClick={() =>
                    navigate(`stocks`, {
                      state: { rowData: params.row },
                    })
                  }
                >
                  Stocks
                </Button>
                <Button
                  sx={{ backgroundImage: 'linear-gradient(black, black)', color: 'white' }}
                  onClick={() =>
                    navigate(`outward`, {
                      state: { rowData: params.row },
                    })
                  }
                >
                  Outward
                </Button>
              </>
            )}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      flex: 1,
      minWidth: 130,
      sortable: false,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Fab
            variant="contained"
            color="info"
            size="small"
            onClick={() => navigate(`/${userType}/fgstore/stocks/${params.row._id}`)}
          >
            <IconEye size="16" />
          </Fab>
        </Box>
      ),
    },
  ];

  return (
    <PageContainer title="Admin - Product Master" description="This is the product master page">
      <Breadcrumb title="Fgstore" items={BCrumb} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="tracking tabs">
          <Tab label="Requests" />
          <Tab label="Stock tracking" />
        </Tabs>
      </Box>

      <Box sx={{ position: 'relative', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomTextField
            label="Search by SKU Code"
            onChange={handleSearch}
            value={searchQuery}
            variant="outlined"
            fullWidth
            size="small"
            placeholder="Enter exact SKU code"
            InputProps={{
              startAdornment: <IconSearch size={18} style={{ marginRight: 8, opacity: 0.7 }} />,
              endAdornment: searchQuery ? (
                <IconButton size="small" onClick={handleClearSearch}>
                  <IconX size={18} />
                </IconButton>
              ) : null,
            }}
          />

          {/* Create Stock Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/${userType}/fgstore/stocks/create`)} // adjust route if needed
            sx={{ whiteSpace: 'nowrap' }}
          >
            Create Stock
          </Button>
        </Box>

        {searchQuery && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Chip
              label={`Searching for SKU: ${searchQuery.trim()}`}
              size="small"
              color="primary"
              onDelete={handleClearSearch}
              sx={{ mr: 1 }}
            />
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: 'relative' }}>
        <CustomTable
          columns={columns.map((col) => {
            return { ...col };
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

export default FGstore;
