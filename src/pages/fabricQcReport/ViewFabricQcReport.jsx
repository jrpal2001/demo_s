import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { getFabricQcReportById } from '@/api/fabricQcReport.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import FabricQcReportPDF from './FabricPdf';

const qcParametersList = [
  { label: 'GSM (A)' },
  { label: 'Colour fastness (B)' },
  { label: 'Structure (C)' },
  { label: 'Dia (D)' },
  { label: 'Shade Matching (E)' },
  { label: 'Handfeel (F)' },
];

const ViewFabricQcReport = () => {
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFabricQcReportById(id);
        setData(response.data);
      } catch {
        setError('Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return null;

  return (
    <>
      <Breadcrumb
        title="View Fabric QC Report"
        items={[
          { title: 'Home', to: `/${userType}/dashboard` },
          { title: 'Fabric QC Reports', to: `/${userType}/fabric-qc-report` },
          { title: 'View Report' },
        ]}
      />
      <Box sx={{ p: 3, width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: 4, border: '1px solid #eee', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary">
            Quality Check (QC) Report
          </Typography>
          {/* PDF Download Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <FabricQcReportPDF qcData={data} />
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid2 container spacing={3} mb={3}>
            <Grid2 xs={12}>
              <TextField
                label="Reception Site / Warehouse"
                value={data.receptionSite}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
            </Grid2>
            <Grid2 container spacing={3}>
              <Grid2 xs={12} md={6}>
                <TextField
                  label="Report Ref."
                  value={data.reportRef}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid2>
              <Grid2 xs={6} md={3}>
                <TextField
                  label="Origin"
                  value={data.origin}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid2>
              <Grid2 xs={6} md={3}>
                <TextField
                  label="QC No"
                  value={data.qcNo}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid2>
            </Grid2>
            <Grid2 container spacing={3}>
              <Grid2 xs={6} md={3}>
                <TextField
                  label="Date"
                  value={data.date?.split('T')[0]}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid2>
              <Grid2 xs={6} md={3}>
                <TextField
                  label="INV. No."
                  value={data.invNo}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid2>
              <Grid2 xs={6} md={3}>
                <TextField
                  label="Invoice Date"
                  value={data.invDate?.split('T')[0]}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                />
              </Grid2>
            </Grid2>
          </Grid2>
          <TextField
            label="Commodity Description"
            value={data.commodityDescription}
            fullWidth
            size="small"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 3 }}
          />
          <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #eee', boxShadow: 1 }}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>QC Parameter</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tolerance (%)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>% of Variation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Accepted</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rejected</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data.qcParameters || qcParametersList).map((param, idx) => (
                  <TableRow key={param.label || idx}>
                    <TableCell>{param.label}</TableCell>
                    <TableCell>{param.tolerance}</TableCell>
                    <TableCell>{param.variation}</TableCell>
                    <TableCell align="center">{param.accepted}</TableCell>
                    <TableCell align="center">{param.rejected}</TableCell>
                    <TableCell>{param.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid2 container spacing={3} mb={2}>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="QC By"
                value={data.qcBy}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="Verified By"
                value={data.verifiedBy}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="Approved By"
                value={data.approvedBy}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3} mb={2}>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="QC Signature"
                value={data.qcSignature}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="Verified Signature"
                value={data.verifiedSignature}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="Approved Signature"
                value={data.approvedSignature}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3} mb={2}>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="QC Date"
                value={data.qcDate?.split('T')[0]}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="Verified Date"
                value={data.verifiedDate?.split('T')[0]}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
            <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
              <TextField
                label="Approved Date"
                value={data.approvedDate?.split('T')[0]}
                fullWidth
                size="medium"
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
            </Grid2>
          </Grid2>
          <TextField
            label="CC to"
            value={data.ccTo}
            fullWidth
            size="medium"
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{ mb: 3, mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
              Back
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default ViewFabricQcReport;
