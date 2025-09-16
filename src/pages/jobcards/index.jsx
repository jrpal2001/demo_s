import { useEffect, useState } from 'react';
import { Typography, Stack, Button, Box } from '@mui/material';
import { Fab } from '@mui/material';
import { IconEdit, IconEye, IconCirclePlus } from '@tabler/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchJobCardsData, searchJobCard } from '@/api/admin';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomTable from '@/components/shared/CustomTable';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const JobCards = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalPages, setTotalPages] = useState(0);
  const [jobCards, setJobCards] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const user = useSelector((state) => state.auth);
  const role =
    user.userType[0].toLowerCase() === 'superadmin' ? 'admin' : user.userType[0].toLowerCase();
  console.log('🚀 ~ JobCards ~ role:', role);

  const fetchJobCards = async () => {
    try {
      const limit = paginationModel.pageSize;
      const page = paginationModel.page + 1;

      let response;
      if (isSearching) {
        response = await searchJobCard(page, limit, searchQuery);
      } else {
        response = await fetchJobCardsData(page, limit);
        console.log('🚀 ~ fetchJobCards ~ response:', response);
      }

      if (response) {
        setJobCards(response.jobCards);
        setTotalPages(response.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching job cards:', error);
    }
  };

  const handleJobCardSearch = (event) => {
    const searchValue = event.target.value;
    setSearchQuery(searchValue);
    setIsSearching(!!searchValue);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(async () => {
        if (!searchValue) {
          fetchJobCards();
          return;
        }

        try {
          const response = await searchJobCard(
            paginationModel.page + 1,
            paginationModel.pageSize,
            searchValue,
          );
          if (response) {
            setJobCards(response.jobCards);
            setTotalPages(response.pagination.total);
          }
        } catch (error) {
          console.error('Error during search:', error);
        }
      }, 1500),
    );
  };

  useEffect(() => {
    fetchJobCards();
  }, [paginationModel.page, paginationModel.pageSize, isSearching, searchQuery]);

  const columns = [
    { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
    {
      field: 'jobCardNo',
      headerName: 'Jobcard Number',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
    },
    {
      field: 'skuCode',
      headerName: 'SKU Code',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
    },
    {
      field: 'bodyColor',
      headerName: 'Color',
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header',
    },
    {
      field: 'description',
      headerName: 'description',
      flex: 1,
      minWidth: 100,
      headerClassName: 'custom-header',
    },
    {
      field: 'deliveryDate',
      headerName: 'Delivery Date',
      flex: 1,
      minWidth: 150,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Typography height={'100%'} display={'flex'} alignItems={'center'}>
          {params.row.deliveryDate?.split('T')[0]}
        </Typography>
      ),
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
            justifyContent: 'space-evenly',
          }}
        >
          <Fab
            variant="contained"
            color="info"
            size="small"
            onClick={() => navigate(`/${role}/job-cards/view/${params.row._id}`)}
          >
            <IconEye size="16" />
          </Fab>
          {role === 'admin' ||
          role === 'merchandiser' ||
          role === 'supermerchandiser' ||
          role === 'salesexecutive' ? (
            <Fab
              color="warning"
              size="small"
              onClick={() => navigate(`/${role}/job-cards/edit/${params.row._id}`)}
            >
              <IconEdit size="16" />
            </Fab>
          ) : null}
        </Box>
      ),
    },
    // {
    //   field: 'tracking',
    //   headerName: 'TRACKING',
    //   flex: 1,
    //   headerClassName: 'custom-header',
    //   renderCell: (params) => {
    //     return (
    //       <Button
    //         sx={{ backgroundImage: 'linear-gradient(black, black)', color: 'white' }}
    //         onClick={() =>
    //           navigate(`/${role}/work-flow/${params.row._id}`, {
    //             state: { rowData: params.row },
    //           })
    //         }
    //       >
    //         Track
    //       </Button>
    //     );
    //   },
    // },
    {
      field: 'work-order',
      headerName: 'WorkOrder',
      headerAlign: 'center',
      flex: 1,
      minWidth: 130,
      sortable: false,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <Fab
              variant="contained"
              color="info"
              size="small"
              onClick={() =>
                navigate(`/${role}/job-card/workorder/${params.row._id}/view`, {
                  state: { rowData: params.row },
                })
              }
            >
              <IconEye size="16" />
            </Fab>
            {role === 'admin' ||
            role === 'merchandiser' ||
            role === 'supermerchandiser' ||
            role === 'salesexecutive' ? (
              <Fab
                color="warning"
                size="small"
                onClick={() =>
                  navigate(`/${role}/job-card/workorder/${params.row._id}`, {
                    state: { rowData: params.row },
                  })
                }
              >
                <IconCirclePlus size="16" />
              </Fab>
            ) : null}
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer title="Job Cards" description="View and manage job cards">
      <Breadcrumb
        title="Job Cards"
        items={[
          { to: '/', title: 'Home' },
          { to: `/${userType}/job-cards`, title: 'Job Cards' },
        ]}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Job Cards</Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate(`/${role}/srs-jobcard`)}
          >
            SRS Job Cards
          </Button>
          {role === 'admin' ||
          role === 'merchandiser' ||
          role === 'supermerchandiser' ||
          role === 'salesexecutive' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/${role}/job-cards/create`)}
            >
              Create Job Card
            </Button>
          ) : null}
        </Stack>
      </Stack>
      <CustomTextField
        label="Search Job Cards"
        onChange={handleJobCardSearch}
        variant="outlined"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto', // Enable horizontal scrolling on smaller screens
        }}
      >
        <CustomTable
          rows={jobCards}
          columns={columns}
          totalProducts={totalPages}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </PageContainer>
  );
};

export default JobCards;
