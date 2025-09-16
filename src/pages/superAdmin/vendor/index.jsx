import { useState, useEffect } from 'react';
import { Button, TextField, Box, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEdit, IconEye } from '@tabler/icons';
import { vendorSearch, vendorView } from '@/api/admin';
import CustomDialog from '@/components/CustomDialog';
import { toast } from 'react-toastify';
import { deleteVendorData } from '@/api/vendor.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const Vendor = () => {
  const userType = useSelector(selectCurrentUserType);
  const canEdit = ['superadmin', 'admin', 'supermerchandiser', 'purchase', 'accounts'].includes(userType);
  const canViewOnly = userType === 'merchandiser';
  const [vendors, setVendors] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Track whether we are in search mode
  const navigate = useNavigate();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Vendors', to: `/${userType}/vendor` },
  ];

  const handleClickCreateVendor = () => {
    navigate(`/${userType}/vendor/create`);
  };

  const handleSearchChange = async (event) => {
    const search = event.target.value;
    setSearchQuery(search);

    if (!search) {
      // Clear search results and reset to normal fetching
      setIsSearching(false);
      fetchVendors(paginationModel.page, paginationModel.pageSize);
      return;
    }

    setIsSearching(true);

    try {
      const response = await vendorSearch(paginationModel.page, paginationModel.pageSize, search);
      if (response) {
        setVendors(response.vendors);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleClickDelete = async (id) => {
    try {
      let response = await deleteVendorData(id);
      if (response) {
        toast.success('Vendor delete successful');
        fetchVendors();
      }
    } catch (error) {
      toast.error('Failed to delete vendor');
    }
  };

  const fetchVendors = async (page = 0, limit = 5) => {
    if (isSearching) return;

    setIsLoading(true);
    try {
      let response = await vendorView(page, limit);
      if (response) {
        setVendors(response.vendors);
        setTotalData(response.pagination.totalDocuments);
      }
    } catch {
      toast.error('Failed to fetch vendor data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSearching) {
      handleSearchChange({ target: { value: searchQuery } });
    } else {
      fetchVendors(paginationModel.page, paginationModel.pageSize);
    }
  }, [paginationModel]);

  const columns = [
    { field: 'id', headerName: 'Sl No', headerClassName: 'custom-header' },
    { field: 'vendorName', headerName: 'VENDOR NAME', headerClassName: 'custom-header', flex: 1 },
    { field: 'companyName', headerName: 'COMPANY NAME', headerClassName: 'custom-header', flex: 1 },
    { field: 'address', headerName: 'ADDRESS', headerClassName: 'custom-header', flex: 1 },
    { field: 'phoneNumber', headerName: 'PHONE NUMBER', headerClassName: 'custom-header', flex: 1 },
    { field: 'emailId', headerName: 'EMAIL ID', headerClassName: 'custom-header', flex: 1 },
    { field: 'vendorPriority', headerName: 'PRIORITY', headerClassName: 'custom-header', flex: 1 },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
  ];

  return (
    <PageContainer title="Vendor Management" description="Manage available vendors for the samurai">
      <Breadcrumb title="Vendor Management" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <TextField
          label="Search Vendors"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button
          onClick={handleClickCreateVendor}
          sx={{ position: 'relative', zIndex: 2 }}
          disabled={!canEdit}
          style={{ display: canEdit ? 'inline-flex' : 'none' }}
        >
          Add Vendor
        </Button>
        <CustomTable
          rows={vendors}
          columns={columns.map((column) => {
            if (column.field == 'actions') {
              return {
                ...column,
                renderCell: (params) => (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}
                  >
                    {(canEdit || canViewOnly) && (
                      <Fab
                        color="info"
                        size="small"
                        style={{ padding: '2px 6px' }}
                        onClick={() => navigate(`/${userType}/vendors/view/${params.row._id}`)}
                      >
                        <IconEye />
                      </Fab>
                    )}
                    {canEdit && (
                      <Fab
                        color="warning"
                        size="small"
                        style={{ padding: '2px 6px' }}
                        onClick={() => navigate(`/${userType}/vendor/edit/${params.row._id}`)}
                      >
                        <IconEdit size="16" />
                      </Fab>
                    )}
                    {canEdit && (
                      <Fab color="error" size="small" style={{ padding: '2px 6px' }}>
                        <CustomDialog
                          title={'Delete Vendor'}
                          icon="delete"
                          handleClickDelete={() => handleClickDelete(params.row._id)}
                        ></CustomDialog>
                      </Fab>
                    )}
                  </Box>
                ),
              };
            } else {
              return column;
            }
          })}
          loading={isLoading}
          totalProducts={totalData ?? 0}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </PageContainer>
  );
};

export default Vendor;
