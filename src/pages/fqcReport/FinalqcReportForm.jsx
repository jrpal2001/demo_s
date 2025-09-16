import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createFinalQcReport } from '@/api/FQCReport.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Sizes list for quantity inputs
const sizeList = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const initialSizeQty = sizeList.reduce((acc, size) => ({ ...acc, [size]: 0 }), {});

const FinalQcReportForm = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jcNo: '',
    product: '',
    rCardNo: '',
    jcDate: '',
    fabric: '',
    dateOfCommence: '',
    jcQty: '',
    colour: '',
    jcClosedOn: '',
    workOrderNo: '',
    style: '',
    gender: '',
    remarks: '',
  });

  const [receivedQty, setReceivedQty] = useState({ ...initialSizeQty });
  const [minorDamageQty, setMinorDamageQty] = useState({ ...initialSizeQty });
  const [majorDamageQty, setMajorDamageQty] = useState({ ...initialSizeQty });
  const [outputQty, setOutputQty] = useState({ ...initialSizeQty });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    setLoading(true);
    setError(null);

    try {
      // Basic validation
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
        setLoading(false);
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

      await createFinalQcReport(payload);
      toast.success('Final QC Report created successfully.');
      navigate(`/${userType}/final-qc-report`);
    } catch (err) {
      setError(err.message || 'Failed to save report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" align="center" mb={3} color="primary" fontWeight={700}>
        Add Final QC Report
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
                  InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                />
              </Grid>
            ))}
          </Grid>

          {/* Quantity Inputs by Size */}
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
              disabled={loading}
              sx={{ px: 4, py: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ px: 4, py: 1 }}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Submit'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default FinalQcReportForm;
