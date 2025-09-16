import { useState, useEffect } from 'react';
import { Button, TextField, Box, Fab, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import CustomTable from '@/components/shared/CustomTable';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { IconEdit, IconEye } from '@tabler/icons';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { dealerSearch, dealerView, vendorSearch, vendorView } from '@/api/admin';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import CustomDialog from '@/components/shared/CustomDialog';

const Vendors = () => {
  const userType = useSelector(selectCurrentUserType);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const { tabId } = useParams();
  const [tabValue, setTabValue] = useState(tabId ?? '1');
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalVendors, setTotalVendors] = useState(0);
  const [isSearching, setIsSearching] = useState(false); // Track whether we are in search mode
  const navigate = useNavigate();

  const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Vendors', to: `/${userType}/vendors` }];

  const column1 = [
    { field: 'id', headerName: 'Sl No', headerClassName: 'custom-header' },
    { field: 'companyName', headerName: 'COMPANY NAME', headerClassName: 'custom-header', flex: 1 },
    { field: 'companyType', headerName: 'COMPANY TYPE', headerClassName: 'custom-header', flex: 1 },
    {
      field: 'companyWebsite',
      headerName: 'COMPANY WEBSITE',
      headerClassName: 'custom-header',
      flex: 1,
    },
    { field: 'phoneNo', headerName: 'PHONE', headerClassName: 'custom-header', flex: 1 },
    { field: 'address', headerName: 'ADDRESS', headerClassName: 'custom-header', flex: 1 },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
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
            onClick={() => navigate(`/${userType}/vendors/view/${params.row._id}`)}
          >
            <IconEye />
          </Fab>
          <Fab
            color="warning"
            size="small"
            style={{ padding: '2px 6px' }}
            onClick={() => navigate(`/${userType}/vendors/edit/${params.row._id}`)}
          >
            <IconEdit size="16" />
          </Fab>
          <Fab color="error" size="small" style={{ padding: '2px 6px' }}>
            <CustomDialog
              title={'Delete Vendor'}
              icon="delete"
              handleClickDelete={() => handleClickDelete(params.row._id)}
            ></CustomDialog>
          </Fab>
        </Box>
      ),
    },
  ];

  const column2 = [
    { field: 'id', headerName: 'Sl No', headerClassName: 'custom-header' },
    { field: 'dealerName', headerName: 'DEALER NAME', headerClassName: 'custom-header', flex: 1 },
    { field: 'telephone', headerName: 'MOBILE', headerClassName: 'custom-header', flex: 1 },
    { field: 'email', headerName: 'EMAIL', headerClassName: 'custom-header', flex: 1 },
    {
      field: 'typeOfEntity',
      headerName: 'ENTITY',
      headerClassName: 'custom-header',
      flex: 1,
      valueFormatter: (params) => {
        if (params) {
          return params.charAt(0).toUpperCase() + params.slice(1).toLowerCase();
        }
        return '';
      },
    },
    {
      field: 'ACTIONS',
      headerName: 'Edit',
      flex: 1,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
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
            onClick={() => navigate(`/${userType}/dealers/view/${params.row._id}`)}
          >
            <IconEye />
          </Fab>
          <Fab
            color="warning"
            size="small"
            style={{ padding: '2px 6px' }}
            onClick={() => navigate(`/${userType}/dealers/edit/${params.row._id}`)}
          >
            <IconEdit size="16" />
          </Fab>
        </Box>
      ),
    },
  ];

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
      let response;
      if (tabValue === '1') {
        response = await vendorSearch(paginationModel.page, paginationModel.pageSize, search);
      } else {
        response = await dealerSearch(paginationModel.page, paginationModel.pageSize, search);
      }
      if (response) {
        setVendors(response.vendors || response.dealers);
        setTotalVendors(response.pagination.total);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchQuery(''); // Reset search query when tab changes
    setIsSearching(false); // Reset search mode
  };

  const fetchVendors = async (page = 1, limit = 5) => {
    if (isSearching) return; // Skip fetching normal data when in search mode

    setIsLoading(true);
    try {
      let response;
      if (tabValue === '1') {
        response = await vendorView(page, limit);
        if (response) {
          setVendors(response.vendors);
          setTotalVendors(response.pagination.totalDocuments);
        }
      } else {
        response = await dealerView(page, limit);
        if (response) {
          console.log(response);

          setVendors(response.dealers);
          setTotalVendors(response.pagination.totalDocuments);
        }
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
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
  }, [paginationModel.page, paginationModel.pageSize, tabValue]);

  const handleClickCreateVendor = () => {
    navigate(`/${userType}/vendors/create`);
  };

  return (
    <PageContainer title="Vendor Management" description="Manage available vendors for the samurai">
      <Breadcrumb title="Vendor Management" items={BCrumb} />
      <Box>
        <TabContext value={tabValue}>
          <Box sx={{ position: 'relative' }}>
            <TabList onChange={handleChange}>
              <Tab label="Vendor" value="1" />
              <Tab label="Dealer" value="2" />
            </TabList>
            <Button
              sx={{ position: 'absolute', top: '20%', right: '2%' }}
              onClick={handleClickCreateVendor}
            >
              Add {tabValue === '1' ? 'Vendor' : 'Dealer'}
            </Button>
          </Box>
          <TabPanel value="1">
            <TextField
              label="Search Vendors"
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <CustomTable
              rows={vendors}
              columns={column1}
              loading={isLoading}
              totalProducts={totalVendors ?? 0}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          </TabPanel>
          <TabPanel value="2">
            <TextField
              label="Search Dealers"
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <CustomTable
              rows={vendors}
              columns={column2}
              loading={isLoading}
              totalProducts={totalVendors ?? 0}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </PageContainer>
  );
};

export default Vendors;
