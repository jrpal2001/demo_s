'use client';

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
import { IconEye } from '@tabler/icons';
import { fetchLotsByOtherStoreInventory } from '@/api/otherstoresLot.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const OtherStoreLotDetails = () => {
  const { itemType, inventoryId } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (!itemType || !inventoryId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchLotsByOtherStoreInventory(
          itemType,
          inventoryId,
          page,
          rowsPerPage,
        );

        if (response?.lots?.length > 0) {
          setLots(response.lots);
          setTotalCount(response.totalCount || 0);
        } else {
          setError('No lots found for this other store inventory item');
          toast.info('No lots found for this other store inventory item');
        }
      } catch (error) {
        console.error('Error fetching other store lot details:', error);
        setError(error.message || 'Failed to fetch other store lot details');
        toast.error('Failed to fetch other store lot details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemType, inventoryId, page, rowsPerPage]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/otherstore-inventory`, title: 'Other Store Inventory' },
    { title: 'Lot Details' },
  ];

  if (loading) {
    return (
      <PageContainer title="Loading Other Store Lot Details" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Loading other store lot details...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading other store lot details">
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="60vh" p={3}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Other Store Lot Details
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
    <PageContainer
      title="Other Store Lot Details"
      description={`Viewing lots for ${itemType} other store inventory`}
    >
      <Breadcrumb title={`${itemType?.toUpperCase()} Other Store Lot Details`} items={BCrumb} />

      <Box mb={3}>
        <Button variant="outlined" onClick={handleGoBack}>
          Back to Other Store Inventory
        </Button>
      </Box>

      <ParentCard title={`Other Store Lots for Inventory Item (${inventoryId})`}>
        {lots.length === 0 ? (
          <Typography align="center">No lots found for this other store inventory item</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="other store lot details table">
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      ITEM CODE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      LOT NUMBER
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      BATCH NUMBER
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>QUANTITY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      RECEIVED DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      INVOICE NUMBER
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      STORAGE LOCATION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      MANUFACTURING DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      EXPIRY DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      CONDITION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      UNIT COST
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      TOTAL VALUE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>SUPPLIER</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>WARRANTY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lots.map((lot) => (
                    <TableRow key={lot._id}>
                      <TableCell align="center">{lot.itemCode || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.lotNo || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.batchNumber || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.quantity || 'N/A'}</TableCell>
                      <TableCell align="center">{formatDate(lot.receivedDate)}</TableCell>
                      <TableCell align="center">{lot.invoiceNo || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.storageLocation || 'N/A'}</TableCell>
                      <TableCell align="center">{formatDate(lot.manufacturingDate)}</TableCell>
                      <TableCell align="center">{formatDate(lot.expiryDate)}</TableCell>
                      <TableCell align="center">{lot.condition || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.unitCost || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.totalValue || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.supplier || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.warrantyPeriod || 'N/A'}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary">
                          <IconEye />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
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

export default OtherStoreLotDetails;
