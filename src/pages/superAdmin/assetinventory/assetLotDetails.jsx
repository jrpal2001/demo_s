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
import { fetchAssetInventoryById } from '@/api/assetinventory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const AssetLotDetails = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/asset-inventory`, title: 'Asset Inventory' },
    { title: 'Lot Details' },
  ];

  const { assetType, inventoryId } = useParams();
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [assetInventory, setAssetInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      console.log('🚀 ~ fetchData ~ assetType:', assetType);
      console.log('🚀 ~ fetchData ~ inventoryId:', inventoryId);

      if (!inventoryId) {
        setError('Missing inventory ID parameter');
        setLoading(false);
        return;
      }

      try {
        // Fetch the asset inventory item to get lot details
        const response = await fetchAssetInventoryById(inventoryId);
        console.log('🚀 ~ fetchData ~ response:', response);

        if (response && response.data) {
          const assetData = response.data;
          setAssetInventory(assetData);

          // Convert lots Map/Object to array format
          const lotsArray = [];
          if (assetData.lots && typeof assetData.lots === 'object') {
            Object.entries(assetData.lots).forEach(([lotName, quantity], index) => {
              lotsArray.push({
                _id: `${inventoryId}_${lotName}_${index}`,
                assetCode: assetData.assetCode,
                assetId: inventoryId,
                itemId: inventoryId,
                lotNo: lotName,
                quantity: quantity,
                receivedDate: assetData.createdAt,
                invoiceNo: 'N/A', // You might want to add this to your schema
                storageLocation: assetData.storageLocation || 'N/A',
                inspectionStatus: 'Approved', // Default status
                createdAt: assetData.createdAt,
                updatedAt: assetData.updatedAt,
              });
            });
          }

          if (lotsArray.length > 0) {
            setLots(lotsArray);
            setTotalCount(lotsArray.length);
          } else {
            setError('No lots found for this asset inventory item');
            toast.info('No lots found for this asset inventory item');
          }
        } else {
          setError('Asset inventory item not found');
          toast.error('Asset inventory item not found');
        }
      } catch (error) {
        console.error('Error fetching asset lot details:', error);
        setError(error.message || 'Failed to fetch asset lot details');
        toast.error('Failed to fetch asset lot details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [inventoryId, page, rowsPerPage]);

  const handleGoBack = () => {
    navigate(`/${userType}/asset-inventory`);
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

  // Get the current page's lots
  const getCurrentPageLots = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return lots.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <PageContainer title="Loading Asset Lot Details" description="Loading...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6">Loading asset lot details...</Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Error" description="Error loading asset lot details">
        <Box display="flex" flexDirection="column" alignItems="center" minHeight="60vh" p={3}>
          <Typography variant="h6" color="error" gutterBottom>
            Error Loading Asset Lot Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2 }}>
            Go Back to Asset Inventory
          </Button>
        </Box>
      </PageContainer>
    );
  }

  const displayAssetType = assetType || assetInventory?.assetType || 'Asset';

  return (
    <PageContainer
      title="Asset Lot Details"
      description={`Viewing lots for ${displayAssetType} asset inventory`}
    >
      <Breadcrumb title={`${displayAssetType.toUpperCase()} Asset Lot Details`} items={BCrumb} />
      <Box mb={3}>
        <Button variant="outlined" onClick={handleGoBack}>
          Back to Asset Inventory
        </Button>
      </Box>
      <ParentCard
        title={`Asset Lots for ${assetInventory?.assetName || 'Asset'} (${
          assetInventory?.assetCode || inventoryId
        })`}
      >
        {lots.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No lots found for this asset inventory item
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This asset inventory item doesn't have any lots configured.
            </Typography>
          </Box>
        ) : (
          <>
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                Showing {lots.length} lot{lots.length !== 1 ? 's' : ''} for asset:{' '}
                {assetInventory?.assetName}
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="asset lot details table">
                <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      ASSET CODE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      LOT NUMBER
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>QUANTITY</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>UOM</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      CREATED DATE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      STORAGE LOCATION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>STATUS</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCurrentPageLots().map((lot) => (
                    <TableRow key={lot._id}>
                      <TableCell align="center">{lot.assetCode || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.lotNo || 'N/A'}</TableCell>
                      <TableCell align="center">{lot.quantity || 'N/A'}</TableCell>
                      <TableCell align="center">{assetInventory?.uom || 'N/A'}</TableCell>
                      <TableCell align="center">{formatDate(lot.createdAt)}</TableCell>
                      <TableCell align="center">{lot.storageLocation || 'N/A'}</TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'success.main',
                            fontWeight: 'medium',
                          }}
                        >
                          {lot.inspectionStatus || 'Active'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            // You can add individual lot view functionality here
                            toast.info(`Viewing details for lot: ${lot.lotNo}`);
                          }}
                        >
                          <IconEye />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {lots.length > rowsPerPage && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default AssetLotDetails;
