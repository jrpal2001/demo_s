//input format ///////////

// import { useEffect, useState } from 'react';
// import { Box, Grid, Button, Typography } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';
// import PageContainer from '@/components/container/PageContainer';
// import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
// import { toast } from 'react-toastify';
// import ParentCard from '@/components/shared/ParentCard';
// import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
// import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
// import { fetchLotsByInventory } from '@/api/lot.api';

// const BCrumb = [
//   { to: '/', title: 'Home' },
//   { to: '/admin/inventory', title: 'Inventory' },
//   { title: 'Lot Details' },
// ];

// const ViewLotDetails = () => {
//   const { department, inventoryId } = useParams();
//   const navigate = useNavigate();
//   const [lots, setLots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       if (!department || !inventoryId) {
//         setError('Missing required parameters');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetchLotsByInventory(department, inventoryId);
//         console.log(response);

//         if (response?.lots?.length > 0) {
//           setLots(response.lots);
//         } else {
//           setError('No lots found for this inventory item');
//           toast.info('No lots found for this inventory item');
//         }
//       } catch (error) {
//         console.error('Error fetching lot details:', error);
//         setError(error.message || 'Failed to fetch lot details');
//         toast.error('Failed to fetch lot details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [department, inventoryId]);

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
//   };

//   const handleGoBack = () => {
//     navigate(-1);
//   };

//   if (loading) {
//     return (
//       <PageContainer title="Loading Lot Details" description="Loading...">
//         <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
//           <Typography variant="h6">Loading lot details...</Typography>
//         </Box>
//       </PageContainer>
//     );
//   }

//   if (error) {
//     return (
//       <PageContainer title="Error" description="Error loading lot details">
//         <Box display="flex" flexDirection="column" alignItems="center" minHeight="60vh" p={3}>
//           <Typography variant="h6" color="error" gutterBottom>
//             Error Loading Lot Details
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             {error}
//           </Typography>
//           <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
//             Go Back
//           </Button>
//         </Box>
//       </PageContainer>
//     );
//   }

//   const editDetails = () => {
//     console.log('Details are Edited');
//   };

//   return (
//     <PageContainer title="Lot Details" description={`Viewing lots for ${department} inventory`}>
//       <Breadcrumb title={`${department?.toUpperCase()} Lot Details`} items={BCrumb} />

//       <Box mb={3}>
//         <Button variant="outlined" onClick={handleGoBack}>
//           Back to Inventory
//         </Button>
//       </Box>

//       <ParentCard title={`Lots for Inventory Item (${inventoryId})`}>
//         {lots.length === 0 ? (
//           <Typography>No lots found for this inventory item</Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {lots.map((lot) => (
//               <Grid item xs={12} key={lot._id}>
//                 <Box border={1} borderColor="divider" borderRadius={2} p={3}>
//                   <Grid container spacing={2}>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Item ID</CustomFormLabel>
//                       <CustomTextField fullWidth value={lot.itemId || 'N/A'} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Lot Number</CustomFormLabel>
//                       <CustomTextField fullWidth value={lot.lotNo || 'N/A'} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Quantity</CustomFormLabel>
//                       <CustomTextField fullWidth value={lot.quantity || 'N/A'} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Received Date</CustomFormLabel>
//                       <CustomTextField fullWidth value={formatDate(lot.receivedDate)} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Invoice Number</CustomFormLabel>
//                       <CustomTextField fullWidth value={lot.invoiceNo || 'N/A'} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Storage Location</CustomFormLabel>
//                       <CustomTextField fullWidth value={lot.storageLocation || 'N/A'} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Inspection Status</CustomFormLabel>
//                       <CustomTextField fullWidth value={lot.inspectionStatus || 'N/A'} disabled />
//                     </Grid>
//                     <Grid item xs={12} md={3}>
//                       <CustomFormLabel>Created At</CustomFormLabel>
//                       <CustomTextField fullWidth value={formatDate(lot.createdAt)} disabled />
//                     </Grid>
//                     <Grid item xs={12}>
//                       <CustomFormLabel>Remarks</CustomFormLabel>
//                       <CustomTextField
//                         fullWidth
//                         multiline
//                         rows={2}
//                         value={lot.remarks || 'No remarks'}
//                         disabled
//                       />
//                     </Grid>
//                   </Grid>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//         <Box display="flex" justifyContent="center" mt={3}>
//           <Button
//             variant="contained"
//             onClick={editDetails}
//             sx={{
//               backgroundColor: 'fuchsia.600',
//               color: 'white',
//               fontWeight: 'bold',
//               px: 5,
//               py: 1.5,
//               borderRadius: '16px',
//               '&:hover': {
//                 backgroundColor: 'fuchsia.700',
//               },
//             }}
//           >
//             Edit
//           </Button>
//         </Box>
//       </ParentCard>
//     </PageContainer>
//   );
// };

// export default ViewLotDetails;

//table format //////////
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import ParentCard from '@/components/shared/ParentCard';
import { fetchLotsByInventory } from '@/api/lot.api';
import { IconEye } from '@tabler/icons';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';


const ViewLotDetails = () => {
  
  
const userType = useSelector(selectCurrentUserType);

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: `/${userType}/inventory`, title: 'Inventory' },
  { title: 'Lot Details' },
];
  const { department, inventoryId } = useParams();
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!department || !inventoryId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchLotsByInventory(department, inventoryId);
        console.log("🚀 ~ fetchData ~ response:", response)

        if (response?.lots?.length > 0) {
          setLots(response.lots);
        } else {
          setError('No lots found for this inventory item');
          toast.info('No lots found for this inventory item');
        }
      } catch (error) {
        console.error('Error fetching lot details:', error);
        setError(error.message || 'Failed to fetch lot details');
        toast.error('Failed to fetch lot details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, inventoryId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <PageContainer title="Loading Lot Details" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Loading lot details...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading lot details">
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="60vh" p={3}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Lot Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Lot Details" description={`Viewing lots for ${department} inventory`}>
      <Breadcrumb title={`${department?.toUpperCase()} Lot Details`} items={BCrumb} />

      <Box mb={3}>
        <Button variant="outlined" onClick={handleGoBack}>
          Back to Inventory
        </Button>
      </Box>

      <ParentCard title={`Lots for Inventory Item`}>
        {lots.length === 0 ? (
          <Typography align="center">No lots found for this inventory item</Typography>
        ) : (
          <>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="lot details table">
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      LOT NUMBER
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>QUANTITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? lots.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : lots
                  ).map((lot) => (
                    <TableRow key={lot._id}>
                      <TableCell align="center">{lot.lotNo || lot.lotName || '-'}</TableCell>
                      <TableCell align="center">{lot.quantity || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={lots.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default ViewLotDetails;
