

import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IconEdit } from '@tabler/icons';
import { Stack, Button, Tabs, Tab, Fab, Box, TextField, Tooltip } from '@mui/material';

import CustomDialog from '@/components/CustomDialog';
import CustomTable from '@/components/shared/CustomTable';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import { TabConfigContext } from '@/context/TabConfigContext';
import { fetchFabric, fetchTrims, fetchAccessories, bomDelete, searchBOM } from '@/api/admin';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'BOM' }];

const tabConfig = [
  {
    key: 'Fabric',
    api: fetchFabric,
    columns: [
      { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
      { field: 'bomId', headerName: 'BOM ID', flex: 1, headerClassName: 'custom-header' },
      { field: 'gsm', headerName: 'GSM', flex: 1, headerClassName: 'custom-header' },
      { field: 'dia', headerName: 'Dia', flex: 1, headerClassName: 'custom-header' },
      { field: 'yarnComposition', headerName: 'Yarn Composition', flex: 1, headerClassName: 'custom-header' },
      { field: 'hsn', headerName: 'HSN', flex: 1, headerClassName: 'custom-header' },
      { field: 'uom', headerName: 'UOM', flex: 1, headerClassName: 'custom-header' },
      { field: 'price', headerName: 'Price', flex: 1, headerClassName: 'custom-header' },
      { field: 'actions', headerName: 'Actions', flex: 1, sortable: false, headerClassName: 'custom-header' },
    ],
  },
  {
    key: 'Trims',
    api: fetchTrims,
    columns: [
      { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
      { field: 'bomId', headerName: 'BOM ID', flex: 1, headerClassName: 'custom-header' },
      { field: 'trimsName', headerName: 'Trim Name', flex: 1, headerClassName: 'custom-header' },
      { field: 'trimsSize', headerName: 'Trim Size', flex: 1, headerClassName: 'custom-header' },
      { field: 'trimsColor', headerName: 'Trim Color', flex: 1, headerClassName: 'custom-header' },
      { field: 'trimsCode', headerName: 'Trim Code', flex: 1, headerClassName: 'custom-header' },
      { field: 'hsn', headerName: 'HSN', flex: 1, headerClassName: 'custom-header' },
      { field: 'uom', headerName: 'UOM', flex: 1, headerClassName: 'custom-header' },
      { field: 'price', headerName: 'Price', flex: 1, headerClassName: 'custom-header' },
      { field: 'actions', headerName: 'Actions', flex: 1, sortable: false, headerClassName: 'custom-header' },
    ],
  },
  {
    key: 'Accessories',
    api: fetchAccessories,
    columns: [
      { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
      { field: 'bomId', headerName: 'BOM ID', flex: 1, headerClassName: 'custom-header' },
      { field: 'accessoriesName', headerName: 'Accessories Name', flex: 1, headerClassName: 'custom-header' },
      { field: 'accessoriesSize', headerName: 'Accessories Size', flex: 1, headerClassName: 'custom-header' },
      { field: 'accessoriesColor', headerName: 'Accessories Color', flex: 1, headerClassName: 'custom-header' },
      { field: 'accessoriesCode', headerName: 'Accessories Code', flex: 1, headerClassName: 'custom-header' },
      { field: 'hsn', headerName: 'HSN', flex: 1, headerClassName: 'custom-header' },
      { field: 'uom', headerName: 'UOM', flex: 1, headerClassName: 'custom-header' },
      { field: 'price', headerName: 'Price', flex: 1, headerClassName: 'custom-header' },
      { field: 'actions', headerName: 'Actions', flex: 1, sortable: false, headerClassName: 'custom-header' },
    ],
  },
];

const DEFAULT_IMAGE = '/no-image.png';

const BOM = () => {
  const userType = useSelector(selectCurrentUserType);
  const canEdit = ['superadmin', 'supermerchandiser', 'admin'].includes(userType);
  const navigate = useNavigate();
  const { selectedTab, setSelectedTab } = useContext(TabConfigContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeout = useRef(null);

  const currentTab = tabConfig[selectedTab] || tabConfig[0];

  const fetchData = useCallback(async () => {
    setLoading(true);
    const limit = paginationModel.pageSize;
    const page = paginationModel.page + 1;

    try {
      let response;
      if (searchQuery) {
        response = await searchBOM(currentTab.key.toLowerCase(), page, limit, searchQuery);
      } else {
        response = await currentTab.api(page, limit);
      }

      if (response) {
        const items = response.items || [];
        // If searching and an exact BOM ID match exists, prefer showing only exact matches
        if (searchQuery) {
          const q = String(searchQuery).trim().toLowerCase();
          const exactMatches = items.filter((row) =>
            String(row?.bomId ?? '')?.toLowerCase() === q,
          );
          if (exactMatches.length > 0) {
            setData(exactMatches);
            setTotalProducts(exactMatches.length);
            return;
          }
        }

        setData(items);
        setTotalProducts(response.pagination?.total || items.length);
      }
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [currentTab, paginationModel, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ pageSize: 5, page: 0 });
    setSearchQuery('');
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      fetchData();
    }, 1500);
  };

  const handleBomDelete = async (bomId) => {
    try {
      const response = await bomDelete(bomId);
      if (response && response.status === 200) {
        toast.success('BOM deleted successfully');
        fetchData();
      }
    } catch {
      toast.error('Delete Failed');
    }
  };

  return (
    <PageContainer title="BOM" description="Manage BOM">
      <Breadcrumb title="BOM" items={BCrumb} />

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          {tabConfig.map((tab) => (
            <Tab label={tab.key} key={tab.key} />
          ))}
        </Tabs>

        {canEdit && (
          <Button variant="contained" color="primary" onClick={() => navigate(`/${userType}/bom/create`)}>
            Add BOM
          </Button>
        )}
      </Stack>

      <TextField
        fullWidth
        size="small"
        label="Search BOM"
        variant="outlined"
        onChange={handleSearch}
        value={searchQuery}
        sx={{ mb: 2 }}
      />

      <CustomTable
        rows={data}
        columns={currentTab.columns.map((column) =>
          column.field === 'actions'
            ? {
                ...column,
                renderCell: (params) => (
                  <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center' }}>
                    <Tooltip title="View Image">
                      <Fab variant="contained" color="info" size="small">
                        <CustomDialog title="Image">
                          <Box sx={{ padding: '1rem' }}>
                            {params.row.image ? (
                              <a href={params.row.image} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={params.row.image}
                                  alt="BOM"
                                  style={{
                                    maxWidth: '100%',
                                    height: 300,
                                    objectFit: 'contain',
                                    border: '1px solid #eee',
                                    borderRadius: 4,
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = DEFAULT_IMAGE;
                                  }}
                                />
                              </a>
                            ) : (
                              <span>No image available</span>
                            )}
                          </Box>
                        </CustomDialog>
                      </Fab>
                    </Tooltip>

                    {canEdit && (
                      <>
                        <Tooltip title="Edit BOM">
                          <Fab
                            color="warning"
                            size="small"
                            onClick={() => navigate(`/${userType}/bom/edit/${params.row._id}`)}
                          >
                            <IconEdit size={16} />
                          </Fab>
                        </Tooltip>

                        <Tooltip title="Delete BOM">
                          <Fab color="error" size="small">
                            <CustomDialog
                              title="Confirm Delete"
                              icon="delete"
                              handleClickDelete={() => handleBomDelete(params.row._id)}
                            />
                          </Fab>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                ),
              }
            : column
        )}
        loading={loading}
        totalProducts={totalProducts}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
    </PageContainer>
  );
};

export default BOM;
