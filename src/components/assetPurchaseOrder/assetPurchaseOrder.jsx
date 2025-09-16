'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Fab,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  styled,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import {
  deleteAssetPurchaseOrder,
  fetchAssetPurchaseOrders,
  updateAssetPurchaseOrderApproval,
} from '@/api/assetpurchaseorder.api';
import CustomDialog from '@/components/CustomDialog';
import { IconEdit, IconEye } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Purchase Order' }];

// Styled components for better UI
const ApprovalToggle = styled(Box)(({ theme, approved }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2.5),
  borderRadius: 12,
  backgroundColor: approved
    ? alpha(theme.palette.success.main, 0.1)
    : alpha(theme.palette.warning.main, 0.1),
  border: `1px solid ${approved ? theme.palette.success.main : theme.palette.warning.main}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: approved
      ? alpha(theme.palette.success.main, 0.15)
      : alpha(theme.palette.warning.main, 0.15),
  },
}));

const ApprovalStatus = styled(Box)(({ theme, approved }) => ({
  display: 'flex',
  alignItems: 'center',
  color: approved ? theme.palette.success.main : theme.palette.warning.main,
  fontWeight: 'bold',
  '& svg': {
    marginRight: theme.spacing(1),
  },
}));

// Define columns - approval is after actions
const columns = [
  {
    field: 'id',
    headerName: 'SERIAL NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'purchaseOrderNumber',
    headerName: 'APO NUMBER',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'indentId',
    headerName: 'ASSET INDENT ID',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography>{params.row.indentId?.indentId}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'vendorId',
    headerName: 'ASSET VENDOR ID',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography>{params.row.vendorId?.vendorId}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'grandTotal',
    headerName: 'GRAND TOTAL',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'STATUS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row?.status?.toUpperCase()}</Typography>
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
  {
    field: 'approval',
    headerName: 'APPROVAL',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
];

const AssetPurchaseOrder = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  // State for approval dialog
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [approvalData, setApprovalData] = useState({
    superAdminOne: false,
    superAdminTwo: false,
  });
  const [updatingApproval, setUpdatingApproval] = useState(false);

  const handleClickCreate = () => {
    navigate(`/${userType}/assetpurchaseorder/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/assetpurchaseorder/view/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/assetpurchaseorder/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      const response = await deleteAssetPurchaseOrder(id);
      if (response) {
        toast.success('Asset purchase order deleted');
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error('Asset purchase order delete failed');
    }
  };

  // Open approval dialog
  const handleOpenApprovalDialog = (order) => {
    setSelectedOrder(order);
    setApprovalData({
      superAdminOne: order.superAdminOne || false,
      superAdminTwo: order.superAdminTwo || false,
    });
    setApprovalDialogOpen(true);
  };

  // Close approval dialog
  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
    setSelectedOrder(null);
  };

  // Toggle approval status
  const toggleApproval = (field) => {
    setApprovalData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Save approval status changes
  const handleSaveApproval = async () => {
    if (!selectedOrder) return;

    try {
      setUpdatingApproval(true);
      await updateAssetPurchaseOrderApproval(selectedOrder._id, approvalData);
      toast.success('Approval status updated successfully');
      fetchData(); // Refresh data
      handleCloseApprovalDialog();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update approval status');
    } finally {
      setUpdatingApproval(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchAssetPurchaseOrders(
        paginationModel.page,
        paginationModel.pageSize,
      );
      if (response) {
        setData(response.assetPurchaseOrders || response.purchaseOrders || response);
        setTotalProducts(response.totalDocuments || response.length);
      }
    } catch (error) {
      return toast.error('Fetching asset purchase orders failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer
      title="Admin - Asset Purchase Order"
      description="This is the asset purchase order page"
    >
      <Breadcrumb title="Asset Purchase Order" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
        >
          Create Asset Purchase Order
        </Button>
        <CustomTable
          columns={columns.map((col) => {
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
                        justifyContent: 'space-around',
                      }}
                    >
                      <Fab color="primary" size="small">
                        <IconEye onClick={() => handleClickView(params.row._id)} />
                      </Fab>
                      <Fab color="warning" size="small">
                        <IconEdit onClick={() => handleClickEdit(params.row._id)} />
                      </Fab>
                      <Fab color="error" size="small">
                        <CustomDialog
                          title="Confirm Delete"
                          icon="delete"
                          handleClickDelete={() => handleClickDelete(params.row._id)}
                        ></CustomDialog>
                      </Fab>
                    </Box>
                  );
                },
              };
            } else if (col.field === 'approval') {
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
                      <Button
                        variant="contained"
                        color="info"
                        size="small"
                        onClick={() => handleOpenApprovalDialog(params.row)}
                        sx={{
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          fontWeight: 'bold',
                        }}
                      >
                        Track
                      </Button>
                    </Box>
                  );
                },
              };
            } else {
              return col;
            }
          })}
          rows={data}
          loading={loading}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>

      {/* Modified Approval Dialog with 3-column table */}
      <Dialog
        open={approvalDialogOpen}
        onClose={handleCloseApprovalDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            py: 2.5,
            px: 3,
            fontWeight: 'bold',
            fontSize: '1.25rem',
          }}
        >
          Super Admin Approval Status
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                APO: {selectedOrder.purchaseOrderNumber}
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Admin</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Super Admin One Row */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          Super Admin One
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {approvalData.superAdminOne ? (
                            <>
                              <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                              <Typography color="success.main" fontWeight="medium">
                                Approved
                              </Typography>
                            </>
                          ) : (
                            <>
                              <PendingIcon sx={{ color: 'warning.main', mr: 1 }} />
                              <Typography color="warning.main" fontWeight="medium">
                                Pending
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={approvalData.superAdminOne ? 'error' : 'success'}
                          size="small"
                          onClick={() => toggleApproval('superAdminOne')}
                        >
                          {approvalData.superAdminOne ? 'Reject' : 'Approve'}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Super Admin Two Row */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          Super Admin Two
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {approvalData.superAdminTwo ? (
                            <>
                              <CheckCircleIcon sx={{ color: 'success.main', mr: 1 }} />
                              <Typography color="success.main" fontWeight="medium">
                                Approved
                              </Typography>
                            </>
                          ) : (
                            <>
                              <PendingIcon sx={{ color: 'warning.main', mr: 1 }} />
                              <Typography color="warning.main" fontWeight="medium">
                                Pending
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color={approvalData.superAdminTwo ? 'error' : 'success'}
                          size="small"
                          onClick={() => toggleApproval('superAdminTwo')}
                        >
                          {approvalData.superAdminTwo ? 'Reject' : 'Approve'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{ p: 3, justifyContent: 'flex-end', backgroundColor: 'background.default' }}
        >
          <Button
            onClick={handleCloseApprovalDialog}
            color="inherit"
            variant="outlined"
            sx={{
              borderRadius: '8px',
              mr: 1,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveApproval}
            color="primary"
            variant="contained"
            disabled={updatingApproval}
            sx={{
              borderRadius: '8px',
              px: 3,
              fontWeight: 'bold',
            }}
          >
            {updatingApproval ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AssetPurchaseOrder;
