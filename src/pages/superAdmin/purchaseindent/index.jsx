'use client';

import { deletePurchaseIndent, fetchPurchaseIndent } from '@/api/purchaseindent.api';
import PageContainer from '@/components/container/PageContainer';
import CustomDialog from '@/components/CustomDialog';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { Box, Button, Fab, Grid2, Typography, CircularProgress } from '@mui/material';
import { IconEdit } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Purchase Indent' }];

// Function to format date - used directly in the component
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Error';
  }
};

// Function to capitalize first letter
const capitalize = (str) => {
  if (!str) return 'N/A';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const PurchaseIndent = () => {
  const userType = useSelector(selectCurrentUserType);
  const canEdit = ['superadmin', 'admin', 'supermerchandiser', 'merchandiser', 'purchase'].includes(
    userType,
  );
  console.log('🚀 ~ PurchaseIndent ~ userType:', userType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [error, setError] = useState(null);

  // Common cell style for centering content
  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  };

  // Define columns with direct rendering and centered content
  const columns = [
    {
      field: 'id',
      headerName: 'SERIAL NO',
      headerAlign: 'center',
      align: 'center', // This aligns the content
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value}</div>,
    },
    {
      field: 'indentId',
      headerName: 'INDENT ID',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'date',
      headerName: 'DATE',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => {
        console.log('Date cell value:', params.value);
        return <div style={cellStyle}>{formatDate(params.value)}</div>;
      },
    },
    {
      field: 'toDepartment',
      headerName: 'TO DEPARTMENT',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'priority',
      headerName: 'PRIORITY',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => {
        console.log('Priority cell value:', params.value);
        return <div style={cellStyle}>{capitalize(params.value)}</div>;
      },
    },
    {
      field: 'remarks',
      headerName: 'REMARKS',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => <div style={cellStyle}>{params.value || 'N/A'}</div>,
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'custom-header',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
              <Fab color="primary" size="small">
                <CustomDialog title="Item Details">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    {params?.row?.items?.length > 0 ? (
                      params.row.items.map((item, index) => (
                        <div key={index}>
                          <Grid2
                            container
                            sx={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid grey',
                              borderRadius: '10px',
                              marginBottom: '1rem',
                            }}
                          >
                            {/* IMAGE */}
                            <Grid2 size={12} sx={{ textAlign: 'center' }}>
                              {item?.code?.image ? (
                                <img
                                  src={item.code.image[0]}
                                  alt="Item"
                                  height={100}
                                  onError={(e) => {
                                    console.error('Image failed to load');
                                    e.target.src = '/placeholder-image.png'; // Fallback image
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    height: 100,
                                    width: 100,
                                    bgcolor: 'grey.300',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                  }}
                                >
                                  No Image
                                </Box>
                              )}
                            </Grid2>

                            {/* ITEM CODE */}
                            <Grid2 size={{ xs: 11, md: 4 }}>
                              <Typography>ITEM CODE </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 1 }}>:</Grid2>
                            <Grid2 size={{ xs: 12, md: 7 }}>
                              <Typography>{item?.code?.bomId || item.codeId || 'N/A'}</Typography>
                            </Grid2>

                            {/* ITEM DESCRIPTION */}
                            <Grid2 size={{ xs: 11, md: 4 }}>
                              <Typography>ITEM DESCRIPTION </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 1 }}>:</Grid2>
                            <Grid2 size={{ xs: 12, md: 7 }}>
                              <Typography>
                                {item.description ? item.description.toUpperCase() : 'N/A'}
                              </Typography>
                            </Grid2>

                            {/* ITEM QUANTITY */}
                            <Grid2 size={{ xs: 11, md: 4 }}>
                              <Typography>ITEM QUANTITY</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 1 }}>:</Grid2>
                            <Grid2 size={{ xs: 12, md: 7 }}>
                              <Typography>{item.quantity || 'N/A'}</Typography>
                            </Grid2>

                            {/* ITEM UOM */}
                            <Grid2 size={{ xs: 11, md: 4 }}>
                              <Typography>ITEM UOM</Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 1 }}>:</Grid2>
                            <Grid2 size={{ xs: 12, md: 7 }}>
                              <Typography>{item.uom ? item.uom.toUpperCase() : 'N/A'}</Typography>
                            </Grid2>
                          </Grid2>
                        </div>
                      ))
                    ) : (
                      <Typography>No items available</Typography>
                    )}
                  </div>
                </CustomDialog>
              </Fab>
            {/* Edit/Delete only for canEdit */}
            {canEdit && (
              <>
                <Fab color="warning" size="small" onClick={() => handleClickEdit(params.row._id)}>
                  <IconEdit />
                </Fab>
                <Fab color="error" size="small">
                  <CustomDialog
                    title="Confirm Delete"
                    icon="delete"
                    handleClickDelete={() => handleClickDelete(params.row._id)}
                  >
                    <Typography>Are you sure you want to delete this purchase indent?</Typography>
                    <Typography variant="caption" color="error">
                      This action cannot be undone.
                    </Typography>
                  </CustomDialog>
                </Fab>
              </>
            )}
          </Box>
        );
      },
    },
  ];

  const handleClickCreate = () => {
    navigate(`/${userType}/purchaseindent/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/purchaseindent/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deletePurchaseIndent(id);
      if (response) {
        toast.success('Purchase indent deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete purchase indent');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPurchaseIndent(paginationModel.page, paginationModel.pageSize);

      if (response && response.purchaseIndent) {
        console.log('Purchase indent data:', response.purchaseIndent);

        // Check the first item's date and priority for debugging
        if (response.purchaseIndent.length > 0) {
          console.log('First item date:', response.purchaseIndent[0].date);
          console.log('First item priority:', response.purchaseIndent[0].priority);
        }

        // Map the data to include an id field for the table
        const mappedData = response.purchaseIndent.map((item, index) => {
          // Create a new object with all properties and add the id
          const newItem = {
            ...item,
            id: index + 1 + paginationModel.page * paginationModel.pageSize,
          };

          // Ensure date and priority are properly handled
          if (newItem.date) {
            console.log(`Item ${index} original date:`, newItem.date);
          }

          if (newItem.priority) {
            console.log(`Item ${index} original priority:`, newItem.priority);
          }

          return newItem;
        });

        setData(mappedData);
        setTotalProducts(response.totalCount);
      } else {
        console.warn('No purchase indent data received or invalid format');
        setData([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message || 'Failed to fetch purchase indents');
      toast.error(error.message || 'Failed to fetch purchase indents');
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer title="Admin - Purchase Indent" description="This is the purchase indent page">
      <Breadcrumb title="Purchase Indent" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        
          <Button
            sx={{ position: 'relative', top: '0.5rem', zIndex: 1 }}
            onClick={handleClickCreate}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            Create Purchase Indent
          </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        )}

        <CustomTable
          columns={columns}
          rows={data}
          loading={loading}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getRowId={(row) => row._id || row.id}
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
        />
      </Box>
    </PageContainer>
  );
};

export default PurchaseIndent;
