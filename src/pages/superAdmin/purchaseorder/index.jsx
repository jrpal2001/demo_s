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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import {
  deletePurchaseOrder,
  fetchPurchaseOrders,
  updatePurchaseOrderApproval,
} from '@/api/purchaseorder.api';
import CustomDialog from '@/components/CustomDialog';
import { IconEdit, IconEye } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Purchase Order' }];

const PurchaseOrder = () => {
  const userType = useSelector(selectCurrentUserType);
  const canEdit = ['superadmin', 'supermerchandiser', 'merchandiser', 'purchase', 'admin'].includes(
    userType,
  );
  const canViewOnly = userType === 'accounts';
  console.log('🚀 ~ userType:', userType);

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
      headerName: 'PO NUMBER',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      flex: 1,
    },
    {
      field: 'indentId',
      headerName: 'INDENT ID',
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
      headerName: 'VENDOR ID',
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
    ...(userType === 'supermerchandiser' ||
    userType === 'superAdmin' ||
    userType === 'admin' ||
    userType === 'merchandiser'
      ? [
          {
            field: 'approval',
            headerName: 'APPROVAL',
            headerAlign: 'center',
            headerClassName: 'custom-header',
            flex: 1,
          },
        ]
      : []),
  ];

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

  const handleClickCreate = () => {
    navigate(`/${userType}/purchaseorder/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/purchaseorder/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/purchaseorder/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      const response = await deletePurchaseOrder(id);
      if (response) {
        toast.success('Purchase orders deleted');
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error('Purchase order delete failed');
    }
  };

  // Open approval dialog
  const handleOpenApprovalDialog = (order) => {
    setSelectedOrder(order);
    setApprovalData({
      superAdminStatus: order.superAdminStatus || 'pending',
      superMerchandiserStatus: order.superMerchandiserStatus || 'pending',
    });
    setApprovalDialogOpen(true);
  };

  // Close approval dialog
  const handleCloseApprovalDialog = () => {
    setApprovalDialogOpen(false);
    setSelectedOrder(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchPurchaseOrders(paginationModel.page, paginationModel.pageSize);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setData(response.purchaseOrders);
        setTotalProducts(response.totalDocuments);
      }
    } catch {
      return toast.error('Fetching purchase orders failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingApproval, setPendingApproval] = useState({ field: '', status: '' });

  // Handler to open confirmation dialog
  const handleApprovalClick = (field, status) => {
    setPendingApproval({ field, status });
    setConfirmDialogOpen(true);
  };

  // Handler for confirm/cancel
  const handleConfirmApproval = async () => {
    // Update local state
    setApprovalData((prev) => ({
      ...prev,
      [pendingApproval.field]: pendingApproval.status,
    }));
    setConfirmDialogOpen(false);
    // Save immediately
    if (!selectedOrder) return;
    try {
      await updatePurchaseOrderApproval(selectedOrder._id, {
        ...approvalData,
        [pendingApproval.field]: pendingApproval.status,
      });
      toast.success('Approval status updated successfully');
      fetchData();
      handleCloseApprovalDialog();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update approval status');
    } finally {
    }
  };
  const handleCancelApproval = () => {
    setPendingApproval({ field: '', status: '' });
    setConfirmDialogOpen(false);
  };

  return (
    <PageContainer title="Admin - Purchase Order" description="This is the purchase order page">
      <Breadcrumb title="Purchase Order" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        {canEdit && (
          <Button
            sx={{ position: 'relative', top: '0.5rem', zIndex: 1 }}
            onClick={handleClickCreate}
          >
            Create Purchase Order
          </Button>
        )}
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
                      {(canEdit || canViewOnly) && (
                        <Fab color="primary" size="small">
                          <IconEye onClick={() => handleClickView(params.row._id)} />
                        </Fab>
                      )}
                      {canEdit && (
                        <>
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
                        </>
                      )}
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
                PO: {selectedOrder.purchaseOrderNumber}
              </Typography>

              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Admin</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                                            {(userType === 'supermerchandiser' ||
                        userType === 'superAdmin' ||
                        userType === 'admin') && (
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Action</TableCell>)}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Super Admin Row */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          Super Admin
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approvalData.superAdminStatus?.toUpperCase() || 'PENDING'}
                          color={
                            approvalData.superAdminStatus === 'approved'
                              ? 'success'
                              : approvalData.superAdminStatus === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      {(userType === 'superAdmin' || userType === 'admin') && (
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleApprovalClick('superAdminStatus', 'approved')}
                            disabled={approvalData.superAdminStatus === 'approved'}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleApprovalClick('superAdminStatus', 'rejected')}
                            disabled={approvalData.superAdminStatus === 'rejected'}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>

                    {/* Super Merchandiser Row */}
                    <TableRow>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          Super Merchandiser
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={approvalData.superMerchandiserStatus?.toUpperCase() || 'PENDING'}
                          color={
                            approvalData.superMerchandiserStatus === 'approved'
                              ? 'success'
                              : approvalData.superMerchandiserStatus === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      {(userType === 'supermerchandiser' ||
                        userType === 'superAdmin' ||
                        userType === 'admin') && (
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() =>
                              handleApprovalClick('superMerchandiserStatus', 'approved')
                            }
                            disabled={approvalData.superMerchandiserStatus === 'approved'}
                            sx={{ mr: 1 }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleApprovalClick('superMerchandiserStatus', 'rejected')
                            }
                            disabled={approvalData.superMerchandiserStatus === 'rejected'}
                          >
                            Reject
                          </Button>
                        </TableCell>
                      )}
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
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Approve/Reject */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelApproval}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {pendingApproval.status === 'approved' ? 'approve' : 'reject'}{' '}
            this order as{' '}
            {pendingApproval.field === 'superAdminStatus' ? 'Super Admin' : 'Super Merchandiser'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelApproval} color="inherit">
            No
          </Button>
          <Button
            onClick={handleConfirmApproval}
            color={pendingApproval.status === 'approved' ? 'success' : 'error'}
            variant="contained"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default PurchaseOrder;
