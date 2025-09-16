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
  Tabs,
  Tab,
  Link,
  Box as MuiBox,
} from '@mui/material';
import { getFinalPIById } from '@/api/finalpi.api.js';
import { getAllFinalPO } from '@/api/finalpo.api.js';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ParentCard from '@/components/shared/ParentCard';
import Spinner from '@/components/common/spinner/Spinner';
import CompanyInfoBox from '@/components/shared/CompanyInfoBox';
import ProformaInvoicePDF from './ProformaInvoicePDF';

const FinalPiPoView = () => {
  const { finalPiPoId } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [piData, setPiData] = useState(null);
  const [poData, setPoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('PI');

  const handleTabChange = (event, newValue) => setTab(newValue);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [piId, poId] = finalPiPoId.split('-');
        let piRes = null,
          poRes = null;

        if (piId && piId !== 'null') {
          try {
            piRes = await getFinalPIById(piId);
            setPiData(piRes.data);
          } catch (e) {
            setPiData(null);
          }
        } else {
          setPiData(null);
        }

        if (poId && poId !== 'null') {
          try {
            const allPOs = await getAllFinalPO();
            const foundPO = (allPOs.data || []).find((po) => po._id === poId);
            setPoData(foundPO || null);
          } catch (e) {
            setPoData(null);
          }
        } else {
          setPoData(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [finalPiPoId]);

  if (loading) return <Spinner />;
  if (!piData && !poData) return <Typography color="error">Not found</Typography>;

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/quotation`, title: 'Quotation' },
    { title: 'View Final PI&PO' },
  ];

  return (
    <PageContainer title="View Final PI&PO" description="">
      <Breadcrumb title="View Final PI&PO" items={BCrumb} />
      <ParentCard>
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="PI" value="PI" />
          <Tab label="PO" value="PO" />
        </Tabs>

        {tab === 'PI' &&
          (piData ? (
            <>
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
                  Invoice No: {piData.invoiceNo}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Date: {piData.invoiceDate?.slice(0, 10)}
                </Typography>
              </Box>

              {/* PDF Download Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <ProformaInvoicePDF piData={piData} />
              </Box>

              <CompanyInfoBox />

              <Typography variant="subtitle1" mb={2}>
                <b>Quotation ID:</b>{' '}
                {typeof piData.quotationId === 'object' && piData.quotationId !== null
                  ? piData.quotationId.qtnNo || piData.quotationId._id
                  : piData.quotationId}
              </Typography>

              <Box sx={{ mb: 3, p: 2, bgcolor: '#fafbfc', borderRadius: 2, boxShadow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <b>Delivery Note:</b> {piData.deliveryNote}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Mode/Terms of Payment:</b> {piData.modeOrTermsOfPayment}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Reference No. & Date:</b> {piData.referenceNoAndDate}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Other References:</b> {piData.otherReferences}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Buyer's Order No.:</b> {piData.buyersOrderNo}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Buyer's Order Date:</b> {piData.buyersOrderDate}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Dispatch Doc No.:</b> {piData.dispatchDocNo}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Delivery Note Date:</b> {piData.deliveryNoteDate}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Dispatched Through:</b> {piData.dispatchedThrough}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <b>Destination:</b> {piData.destination}
                  </Grid>
                  <Grid item xs={12}>
                    <b>Terms of Delivery:</b> {piData.termsOfDelivery}
                  </Grid>
                  <Grid item xs={12}>
                    <b>Consignee (Ship to):</b> {piData.consignee}
                  </Grid>
                  <Grid item xs={12}>
                    <b>Buyer (Bill to):</b> {piData.buyer}
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ borderTop: '1px solid #e0e0e0', my: 3 }} />

              <Typography variant="h6" mt={2} mb={1} color="primary.main">
                Goods
              </Typography>

              <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 2, boxShadow: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                    <TableRow>
                      <TableCell>
                        <b>Description</b>
                      </TableCell>
                      <TableCell>
                        <b>HSN/SAC</b>
                      </TableCell>
                      <TableCell>
                        <b>Quantity</b>
                      </TableCell>
                      <TableCell>
                        <b>Rate</b>
                      </TableCell>
                      <TableCell>
                        <b>Per</b>
                      </TableCell>
                      <TableCell>
                        <b>Amount</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(piData.goods || []).map((item, idx) => (
                      <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.hsnOrSac}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.rate}</TableCell>
                        <TableCell>{item.per}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              No PI data available for this quotation.
            </Typography>
          ))}

        {tab === 'PO' &&
          (poData && poData.poFileUrl ? (
            <MuiBox sx={{ mt: 2, textAlign: 'center' }}>
              <Link
                href={poData.poFileUrl.replace(/^\/public/, '')}
                target="_blank"
                rel="noopener"
                variant="h6"
              >
                Download PO Document
              </Link>
            </MuiBox>
          ) : (
            <Typography color="warning.main" sx={{ mt: 2 }}>
              No PO document uploaded for this quotation.
            </Typography>
          ))}

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

export default FinalPiPoView;
