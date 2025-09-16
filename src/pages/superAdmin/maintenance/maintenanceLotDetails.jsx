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
import { fetchLotsByMaintenanceInventory } from '@/api/maintenanceLot.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const MaintenanceLotDetails = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/maintenance-inventory`, title: 'Maintenance Inventory' },
    { title: 'Lot Details' },
  ];
  const { maintenanceType, inventoryId } = useParams();
  const navigate = useNavigate();
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

      if (!maintenanceType || !inventoryId) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        const response = await fetchLotsByMaintenanceInventory(
          maintenanceType,
          inventoryId,
          page,
          rowsPerPage,
        );
        console.log("🚀 ~ fetchData ~ response:", response)

        if (response?.lots?.length > 0) {
          setLots(response.lots);
          setTotalCount(response.totalCount || 0);
        } else {
          setError('No lots found for this maintenance inventory item');
          toast.info('No lots found for this maintenance inventory item');
        }
      } catch (error) {
        console.error('Error fetching maintenance lot details:', error);
        setError(error.message || 'Failed to fetch maintenance lot details');
        toast.error('Failed to fetch maintenance lot details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maintenanceType, inventoryId, page, rowsPerPage]);

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

  if (loading) {
    return (
      <PageContainer title="Loading Maintenance Lot Details" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Loading maintenance lot details...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading maintenance lot details">
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="60vh" p={3}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Maintenance Lot Details
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
      title="Maintenance Lot Details"
      description={`Viewing lots for ${maintenanceType} maintenance inventory`}
    >
      <Breadcrumb
        title={`${maintenanceType?.toUpperCase()} Maintenance Lot Details`}
        items={BCrumb}
      />

      <Box mb={3}>
        <Button variant="outlined" onClick={handleGoBack}>
          Back to Maintenance Inventory
        </Button>
      </Box>

      <ParentCard title={`Maintenance Lots for Inventory Item (${inventoryId})`}>
        {lots.length === 0 ? (
          <Typography align="center">No lots found for this maintenance inventory item</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="maintenance lot details table">
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      MAINTENANCE ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      LOT NUMBER
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
                      VALIDITY START
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      VALIDITY END
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      INSPECTION STATUS
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lots.map((lot) => (
                    <TableRow key={lot._id}>
                      <TableCell align="center">{lot.maintenanceCode || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.lotNo || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.quantity || 'N/A'}</TableCell>
                      <TableCell align="center">{formatDate(lot.receivedDate)}</TableCell>
                      <TableCell align="center">{lot.invoiceNo || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.storageLocation || 'N/A'}</TableCell>
                      <TableCell align="center">{formatDate(lot.validityStartDate)}</TableCell>
                      <TableCell align="center">{formatDate(lot.validityEndDate)}</TableCell>
                      <TableCell align="center">{lot.inspectionStatus || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.status || 'N/A'}</TableCell>
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

export default MaintenanceLotDetails;
