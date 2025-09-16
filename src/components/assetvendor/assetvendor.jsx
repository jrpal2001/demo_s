import { useState, useEffect } from 'react';
import { Button, TextField, Box, Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEdit, IconEye } from '@tabler/icons';
import { assetVendorSearch, assetVendorView, deleteAssetVendorData } from '../../api/assetvendor';
import CustomDialog from '@/components/CustomDialog';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const columns = [
  { field: 'id', headerName: 'Sl No', headerClassName: 'custom-header' },
  { field: 'vendorId', headerName: 'VENDOR ID', headerClassName: 'custom-header', flex: 1 },
  { field: 'vendorName', headerName: 'VENDOR NAME', headerClassName: 'custom-header', flex: 1 },
  { field: 'companyName', headerName: 'COMPANY NAME', headerClassName: 'custom-header', flex: 1 },
  { field: 'companyType', headerName: 'COMPANY TYPE', headerClassName: 'custom-header', flex: 1 },
  { field: 'businessType', headerName: 'BUSINESS TYPE', headerClassName: 'custom-header', flex: 1 },
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

const AssetVendor = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Vendors' }];
  const [vendors, setVendors] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleClickCreateVendor = () => {
    navigate(`/${userType}/assetvendor/create`);
  };

  const handleSearchChange = async (event) => {
    const search = event.target.value;
    setSearchQuery(search);

    if (!search) {
      setIsSearching(false);
      fetchVendors(paginationModel.page, paginationModel.pageSize);
      return;
    }

    setIsSearching(true);

    try {
      const response = await assetVendorSearch(
        paginationModel.page,
        paginationModel.pageSize,
        search,
      );
      if (response) {
        setVendors(response.vendors);
      }
    } catch (error) {
      console.error('Error during search:', error);
      toast.error('Failed to search asset vendors');
    }
  };

  const handleClickDelete = async (id) => {
    try {
      const response = await deleteAssetVendorData(id);
      if (response) {
        toast.success('Asset vendor deleted successfully');
        fetchVendors();
      }
    } catch (error) {
      toast.error('Failed to delete asset vendor');
    }
  };

  const fetchVendors = async (page = 0, limit = 5) => {
    if (isSearching) return;

    setIsLoading(true);
    try {
      const response = await assetVendorView(page, limit);
      if (response) {
        setVendors(response.vendors);
        setTotalData(response.pagination.totalDocuments);
      }
    } catch (error) {
      toast.error('Failed to fetch asset vendor data');
      console.log(error);
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

  return (
    <PageContainer
      title="Asset Vendor Management"
      description="Manage asset vendors for the system"
    >
      <Breadcrumb title="Asset Vendor Management" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button onClick={handleClickCreateVendor} sx={{ position: 'relative', zIndex: 2 }}>
          Add Asset Vendor
        </Button>
        <TextField
          label="Search Asset Vendors"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
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
                    <Fab
                      color="info"
                      size="small"
                      style={{ padding: '2px 6px' }}
                      onClick={() => navigate(`/${userType}/assetvendor/view/${params.row._id}`)}
                    >
                      <IconEye />
                    </Fab>
                    <Fab
                      color="warning"
                      size="small"
                      style={{ padding: '2px 6px' }}
                      onClick={() => navigate(`/${userType}/assetvendor/edit/${params.row._id}`)}
                    >
                      <IconEdit size="16" />
                    </Fab>
                    <Fab color="error" size="small" style={{ padding: '2px 6px' }}>
                      <CustomDialog
                        title={'Delete Asset Vendor'}
                        icon="delete"
                        handleClickDelete={() => handleClickDelete(params.row._id)}
                      ></CustomDialog>
                    </Fab>
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

export default AssetVendor;
