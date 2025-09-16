import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { createFabricQcReport } from '@/api/fabricQcReport.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const qcParametersList = [
  { label: 'GSM (A)' },
  { label: 'Colour fastness (B)' },
  { label: 'Structure (C)' },
  { label: 'Dia (D)' },
  { label: 'Shade Matching (E)' },
  { label: 'Handfeel (F)' },
];

const FabricQcReportForm = () => {
  const userType = useSelector(selectCurrentUserType);
  const theme = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    receptionSite: '',
    reportRef: '',
    origin: '',
    qcNo: '',
    date: '',
    invNo: '',
    invDate: '',
    commodityDescription: '',
    qcBy: '',
    verifiedBy: '',
    approvedBy: '',
    qcSignature: '',
    verifiedSignature: '',
    approvedSignature: '',
    qcDate: '',
    verifiedDate: '',
    approvedDate: '',
    ccTo: '',
  });
  const [qcParameters, setQcParameters] = useState(
    qcParametersList.map(() => ({
      tolerance: '',
      variation: '',
      accepted: 0,
      rejected: 0,
      remarks: '',
    })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQcParamChange = (idx, field, value) => {
    setQcParameters(qcParameters.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...form,
        qcParameters: qcParametersList.map((param, idx) => ({
          label: param.label,
          tolerance: qcParameters[idx].tolerance,
          variation: qcParameters[idx].variation,
          accepted: qcParameters[idx].accepted,
          rejected: qcParameters[idx].rejected,
          remarks: qcParameters[idx].remarks,
        })),
      };
      await createFabricQcReport(payload);
      navigate(`/${userType}/fabric-qc-report`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        title="Add Fabric QC Report"
        items={[
          { title: 'Home', to: `/${userType}/dashboard` },
          { title: 'Fabric QC Reports', to: `/${userType}/fabric-qc-report` },
          { title: 'Add Report' },
        ]}
      />
      <Box
        sx={{
          p: 3,
          width: '100%',
          maxWidth: theme.breakpoints.values.lg,
          mx: 'auto',
        }}
      >
        <Paper
          sx={{
            p: 4,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <form onSubmit={handleSubmit} autoComplete="off">
            <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary">
              Quality Check (QC) Report
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {/* Redesigned Header Section */}
            <Grid2 container spacing={3} mb={3}>
              {/* Reception Site - Full width */}
              <Grid2 xs={12}>
                <TextField
                  label="Reception Site / Warehouse"
                  name="receptionSite"
                  value={form.receptionSite}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid2>
              {/* First Row */}
              <Grid2 container spacing={3}>
                <Grid2 xs={12} md={6}>
                  <TextField
                    label="Report Ref."
                    name="reportRef"
                    value={form.reportRef}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                  />
                </Grid2>
                <Grid2 xs={6} md={3}>
                  <TextField
                    label="Origin"
                    name="origin"
                    value={form.origin}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                  />
                </Grid2>
                <Grid2 xs={6} md={3}>
                  <TextField
                    label="QC No"
                    name="qcNo"
                    value={form.qcNo}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                  />
                </Grid2>
              </Grid2>
              {/* Second Row */}
              <Grid2 container spacing={3}>
                <Grid2 xs={6} md={3}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>
                <Grid2 xs={6} md={3}>
                  <TextField
                    label="INV. No."
                    name="invNo"
                    value={form.invNo}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                  />
                </Grid2>
                <Grid2 xs={6} md={3}>
                  <TextField
                    label="Invoice Date"
                    name="invDate"
                    type="date"
                    value={form.invDate}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>
              </Grid2>
            </Grid2>
            <TextField
              label="Commodity Description"
              name="commodityDescription"
              value={form.commodityDescription}
              onChange={handleChange}
              fullWidth
              size="small"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            {/* QC Parameters Table */}
            <TableContainer
              component={Paper}
              sx={{
                mb: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
              }}
            >
              <Table size="small">
                <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
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
                  {qcParametersList.map((param, idx) => (
                    <TableRow
                      key={param.label}
                      sx={{ '&:nth-of-type(odd)': { bgcolor: theme.palette.action.hover } }}
                    >
                      <TableCell>{param.label}</TableCell>
                      <TableCell>
                        <TextField
                          name={`tolerance_${idx}`}
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx].tolerance}
                          onChange={(e) => handleQcParamChange(idx, 'tolerance', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name={`variation_${idx}`}
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx].variation}
                          onChange={(e) => handleQcParamChange(idx, 'variation', e.target.value)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          name={`accepted_${idx}`}
                          type="number"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx].accepted}
                          onChange={(e) =>
                            handleQcParamChange(idx, 'accepted', Number(e.target.value))
                          }
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          name={`rejected_${idx}`}
                          type="number"
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx].rejected}
                          onChange={(e) =>
                            handleQcParamChange(idx, 'rejected', Number(e.target.value))
                          }
                          inputProps={{ min: 0 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name={`remarks_${idx}`}
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx].remarks}
                          onChange={(e) => handleQcParamChange(idx, 'remarks', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              variant="body2"
              sx={{
                mb: 3,
                fontStyle: 'italic',
                color: theme.palette.text.secondary,
              }}
            >
              We the undersigned declare that the products and commodities listed were QC tested as
              mentioned above.
            </Typography>
            <Grid2 container spacing={3} mb={2}>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="QC By"
                  name="qcBy"
                  value={form.qcBy}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="Verified By"
                  name="verifiedBy"
                  value={form.verifiedBy}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="Approved By"
                  name="approvedBy"
                  value={form.approvedBy}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </Grid2>
            </Grid2>
            <Grid2 container spacing={3} mb={2}>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="QC Signature"
                  name="qcSignature"
                  value={form.qcSignature}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="Verified Signature"
                  name="verifiedSignature"
                  value={form.verifiedSignature}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </Grid2>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="Approved Signature"
                  name="approvedSignature"
                  value={form.approvedSignature}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                />
              </Grid2>
            </Grid2>
            <Grid2 container spacing={3} mb={2}>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="QC Date"
                  name="qcDate"
                  type="date"
                  value={form.qcDate}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="Verified Date"
                  name="verifiedDate"
                  type="date"
                  value={form.verifiedDate}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              <Grid2 xs={12} md={4} sx={{ minWidth: 250, mb: 2 }}>
                <TextField
                  label="Approved Date"
                  name="approvedDate"
                  type="date"
                  value={form.approvedDate}
                  onChange={handleChange}
                  fullWidth
                  size="medium"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
            </Grid2>
            <TextField
              label="CC to"
              name="ccTo"
              value={form.ccTo}
              onChange={handleChange}
              fullWidth
              size="medium"
              variant="outlined"
              sx={{ mb: 3, mt: 2 }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ px: 4, py: 1 }}
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Saving...' : 'Submit'}
              </Button>
              <Button
                variant="outlined"
                sx={{ px: 4, py: 1 }}
                onClick={() => navigate(`/${userType}/fabric-qc-report`)}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default FabricQcReportForm;
