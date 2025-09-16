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
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { getFabricQcReportById, updateFabricQcReport } from '@/api/fabricQcReport.api';
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

const EditFabricQcReport = () => {
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [qcParameters, setQcParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFabricQcReportById(id);
        setForm({ ...response.data });
        setQcParameters(
          response.data.qcParameters ||
            qcParametersList.map(() => ({
              tolerance: '',
              variation: '',
              accepted: 0,
              rejected: 0,
              remarks: '',
            })),
        );
      } catch (err) {
        setError('Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQcParamChange = (idx, field, value) => {
    setQcParameters(qcParameters.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      // Clean MongoDB-specific fields from the form data
      const { _id, createdAt, updatedAt, __v, ...cleanForm } = form;

      const payload = {
        ...cleanForm,
        qcParameters: qcParametersList.map((param, idx) => ({
          label: param.label,
          tolerance: qcParameters[idx].tolerance || '',
          variation: qcParameters[idx].variation || '',
          accepted: qcParameters[idx].accepted || 0,
          rejected: qcParameters[idx].rejected || 0,
          remarks: qcParameters[idx].remarks || '',
        })),
      };

      // Ensure all required fields are present
      if (
        !payload.receptionSite ||
        !payload.reportRef ||
        !payload.origin ||
        !payload.qcNo ||
        !payload.date ||
        !payload.invNo ||
        !payload.invDate ||
        !payload.commodityDescription ||
        !payload.qcBy ||
        !payload.verifiedBy ||
        !payload.approvedBy ||
        !payload.qcSignature ||
        !payload.verifiedSignature ||
        !payload.approvedSignature ||
        !payload.qcDate ||
        !payload.verifiedDate ||
        !payload.approvedDate ||
        !payload.ccTo
      ) {
        setError('Please fill in all required fields');
        setSaving(false);
        return;
      }

      console.log('Submitting payload:', payload);
      await updateFabricQcReport(id, payload);
      navigate(`/${userType}/fabric-qc-report`);
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to update report';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!form) return null;

  return (
    <>
      <Breadcrumb
        title="Edit Fabric QC Report"
        items={[
          { title: 'Home', to: `/${userType}/dashboard` },
          { title: 'Fabric QC Reports', to: `/${userType}/fabric-qc-report` },
          { title: 'Edit Report' },
        ]}
      />
      <Box sx={{ p: 3, width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Paper sx={{ p: 4, border: '1px solid #eee', borderRadius: 2, boxShadow: 3 }}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Typography variant="h5" align="center" fontWeight={700} mb={3} color="primary">
              Edit Quality Check (QC) Report
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid2 container spacing={3} mb={3}>
              <Grid2 xs={12}>
                <TextField
                  label="Reception Site / Warehouse"
                  name="receptionSite"
                  value={form.receptionSite}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  variant="outlined"
                />
              </Grid2>
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
              <Grid2 container spacing={3}>
                <Grid2 xs={6} md={3}>
                  <TextField
                    label="Date"
                    name="date"
                    type="date"
                    value={form.date?.split('T')[0]}
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
                    value={form.invDate?.split('T')[0]}
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
            <TableContainer
              component={Paper}
              sx={{ mb: 3, border: '1px solid #eee', boxShadow: 1 }}
            >
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
                  {qcParametersList.map((param, idx) => (
                    <TableRow key={param.label}>
                      <TableCell>{param.label}</TableCell>
                      <TableCell>
                        <TextField
                          name={`tolerance_${idx}`}
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx]?.tolerance || ''}
                          onChange={(e) => handleQcParamChange(idx, 'tolerance', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          name={`variation_${idx}`}
                          size="small"
                          variant="outlined"
                          fullWidth
                          value={qcParameters[idx]?.variation || ''}
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
                          value={qcParameters[idx]?.accepted || 0}
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
                          value={qcParameters[idx]?.rejected || 0}
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
                          value={qcParameters[idx]?.remarks || ''}
                          onChange={(e) => handleQcParamChange(idx, 'remarks', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                  value={form.qcDate?.split('T')[0]}
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
                  value={form.verifiedDate?.split('T')[0]}
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
                  value={form.approvedDate?.split('T')[0]}
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button variant="outlined" color="primary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Update'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default EditFabricQcReport;
