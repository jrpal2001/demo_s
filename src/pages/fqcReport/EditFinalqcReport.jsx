import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Divider,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getFinalQcReportById, updateFinalQcReport } from '@/api/FQCReport.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const sizeList = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const initialSizeQty = sizeList.reduce((acc, size) => ({ ...acc, [size]: 0 }), {});

const EditFinalQcReport = () => {
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [receivedQty, setReceivedQty] = useState({ ...initialSizeQty });
  const [minorDamageQty, setMinorDamageQty] = useState({ ...initialSizeQty });
  const [majorDamageQty, setMajorDamageQty] = useState({ ...initialSizeQty });
  const [outputQty, setOutputQty] = useState({ ...initialSizeQty });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFinalQcReportById(id);
        const data = response;

        setForm({
          jcNo: data.jcNo || '',
          product: data.product || '',
          rCardNo: data.rCardNo || '',
          jcDate: data.jcDate ? data.jcDate.split('T')[0] : '',
          fabric: data.fabric || '',
          dateOfCommence: data.dateOfCommence ? data.dateOfCommence.split('T')[0] : '',
          jcQty: data.jcQty || '',
          colour: data.colour || '',
          jcClosedOn: data.jcClosedOn ? data.jcClosedOn.split('T')[0] : '',
          workOrderNo: data.workOrderNo || '',
          style: data.style || '',
          gender: data.gender || '',
          remarks: data.remarks || '',
        });

        setReceivedQty(data.receivedQty || { ...initialSizeQty });
        setMinorDamageQty(data.minorDamageQty || { ...initialSizeQty });
        setMajorDamageQty(data.majorDamageQty || { ...initialSizeQty });
        setOutputQty(data.outputQty || { ...initialSizeQty });
      } catch (err) {
        setError('Failed to fetch Final QC Report');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQtyChange = (setter) => (e) => {
    const { name, value } = e.target;
    setter((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Basic required fields validation
      if (
        !form.jcNo ||
        !form.product ||
        !form.rCardNo ||
        !form.jcDate ||
        !form.fabric ||
        !form.dateOfCommence ||
        !form.jcQty ||
        !form.colour ||
        !form.jcClosedOn ||
        !form.workOrderNo ||
        !form.style ||
        !form.gender
      ) {
        setError('Please fill in all required fields.');
        setSaving(false);
        return;
      }

      const payload = {
        ...form,
        jcQty: Number(form.jcQty),
        receivedQty,
        minorDamageQty,
        majorDamageQty,
        outputQty,
      };

      await updateFinalQcReport(id, payload);
      toast.success('Final QC Report updated successfully');
      navigate(`/${userType}/final-qc-report`);
    } catch (err) {
      setError(err.message || 'Failed to update report');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!form) {
    return null;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" align="center" mb={3} color="primary" fontWeight={700}>
        Edit Final QC Report
      </Typography>
      <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit} autoComplete="off">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} mb={3}>
            {[
              ['jcNo', 'J/c No'],
              ['product', 'Product'],
              ['rCardNo', 'R. Card No'],
              ['jcDate', 'J/c Date', 'date'],
              ['fabric', 'Fabric'],
              ['dateOfCommence', 'Date of Commence', 'date'],
              ['jcQty', 'J/c Qty', 'number'],
              ['colour', 'Colour'],
              ['jcClosedOn', 'J/c Closed On', 'date'],
              ['workOrderNo', 'Work Order No'],
              ['style', 'Style'],
              ['gender', 'Gender'],
              ['remarks', 'Remarks', 'text'],
            ].map(([field, label, type = 'text']) => (
              <Grid item xs={12} sm={type === 'text' && field === 'remarks' ? 12 : 6} key={field}>
                <TextField
                  label={label}
                  name={field}
                  type={type}
                  value={form[field]}
                  onChange={handleChange}
                  fullWidth
                  multiline={field === 'remarks'}
                  rows={field === 'remarks' ? 3 : 1}
                  size="small"
                  variant="outlined"
                  required={field !== 'remarks'}
                />
              </Grid>
            ))}
          </Grid>

          {[
            ['Received Qty', receivedQty, setReceivedQty],
            ['Minor Damage Qty', minorDamageQty, setMinorDamageQty],
            ['Major Damage Qty', majorDamageQty, setMajorDamageQty],
            ['Output Qty', outputQty, setOutputQty],
          ].map(([label, values, setter]) => (
            <Box key={label} mb={3}>
              <Typography fontWeight={700} mb={1}>
                {label}
              </Typography>
              <Grid container spacing={1}>
                {sizeList.map((size) => (
                  <Grid item xs={4} sm={2} key={size}>
                    <TextField
                      label={size}
                      name={size}
                      type="number"
                      value={values[size] || 0}
                      onChange={handleQtyChange(setter)}
                      inputProps={{ min: 0 }}
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={saving}
              sx={{ px: 4, py: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={saving}
              sx={{ px: 4, py: 1 }}
            >
              {saving ? 'Saving...' : 'Update'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditFinalQcReport;
