'use client';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import {
  Box,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { getQuotationById } from '@/api/quotation.api.js';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ParentCard from '@/components/shared/ParentCard';
import Spinner from '@/components/common/spinner/Spinner';
import QuotationPDF from './QuotationPDF';

const ViewQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getQuotationById(id);
        setData(response);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <Spinner />;
  if (!data) return <Typography color="error">Not found</Typography>;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    return dateObj.toLocaleDateString();
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/quotation`, title: 'Quotation' },
    { title: 'View Quotation' },
  ];

  return (
    <PageContainer title="View Quotation" description="">
      <Breadcrumb title="View Quotation" items={BCrumb} />
      <ParentCard>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#f5f7fa',
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" fontWeight={700} color="primary.main">
            Quotation No: {data.qtnNo}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Date: {formatDate(data.date)}
          </Typography>
        </Box>

        {/* PDF Download Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <QuotationPDF quotationData={data} />
        </Box>

        <Box sx={{ mb: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <b>To:</b> {data.to}
            </Grid>
            <Grid item xs={12} sm={6}>
              <b>GSTIN:</b> {data.gstin}
            </Grid>
            <Grid item xs={12} sm={6}>
              <b>GST Rate:</b> {data.gstRate}
            </Grid>
            <Grid item xs={12} sm={6}>
              <b>Note:</b> {data.note}
            </Grid>
            <Grid item xs={12} sm={6}>
              <b>Date:</b> {formatDate(data.date)}
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ borderTop: '1px solid #e0e0e0', my: 3 }} />

        <Typography variant="h6" mt={2} mb={1} color="primary.main">
          Items
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 2, boxShadow: 2 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f0f4f8' }}>
              <TableRow>
                <TableCell>
                  <b>Particulars</b>
                </TableCell>
                <TableCell>
                  <b>Brand</b>
                </TableCell>
                <TableCell>
                  <b>MRP</b>
                </TableCell>
                <TableCell>
                  <b>Rate</b>
                </TableCell>
                <TableCell>
                  <b>Quantity</b>
                </TableCell>
                <TableCell>
                  <b>Total</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.items || []).map((item, idx) => (
                <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <TableCell>{item.particulars}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.mrp}</TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ borderTop: '1px solid #e0e0e0', my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'flex-end',
            p: 2,
            bgcolor: '#fafbfc',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle1">
            <b>Total:</b> {data.total}
          </Typography>
          <Typography variant="subtitle1">
            <b>GST:</b> {data.gst}
          </Typography>
          <Typography variant="subtitle1">
            <b>Rounded Off:</b> {data.roundedOff}
          </Typography>
          <Typography variant="h6" color="primary.main">
            <b>Grand Total:</b> {data.grandTotal}
          </Typography>
        </Box>

        <Button
          sx={{ mt: 3 }}
          variant="outlined"
          onClick={() => navigate(`/${userType}/quotation`)}
        >
          Back to Quotations
        </Button>
      </ParentCard>
    </PageContainer>
  );
};

export default ViewQuotation;
