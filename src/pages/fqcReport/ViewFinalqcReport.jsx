import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Divider,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getFinalQcReportById } from '@/api/FQCReport.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import FinalQcReportPDF from './FinalQcReportPDF';

const sizeList = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];

const ViewFinalQcReport = () => {
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFinalQcReportById(id);
        setData(response);
      } catch (err) {
        setError('Failed to fetch Final QC Report');
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
      <Typography variant="h5" align="center" mb={3} color="primary" fontWeight={700}>
        Final Quality Check (QC) Report
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <FinalQcReportPDF qcData={data} />
      </Box>
      <Paper sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
        <Grid container spacing={2} mb={3}>
          {[
            ['J/c No', 'jcNo'],
            ['Product', 'product'],
            ['R. Card No', 'rCardNo'],
            ['J/c Date', 'jcDate'],
            ['Fabric', 'fabric'],
            ['Date of Commence', 'dateOfCommence'],
            ['J/c Qty', 'jcQty'],
            ['Colour', 'colour'],
            ['J/c Closed On', 'jcClosedOn'],
            ['Work Order No', 'workOrderNo'],
            ['Style', 'style'],
            ['Gender', 'gender'],
            ['Remarks', 'remarks'],
          ].map(([label, key]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={label}
                value={
                  key.endsWith('Date') ||
                  key === 'jcDate' ||
                  key === 'dateOfCommence' ||
                  key === 'jcClosedOn'
                    ? data[key]
                      ? data[key].split('T')[0]
                      : ''
                    : data[key]
                }
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{ readOnly: true }}
                multiline={key === 'remarks'}
                rows={key === 'remarks' ? 3 : 1}
              />
            </Grid>
          ))}
        </Grid>

        {/* Size-based quantities display */}
        {[
          ['Received Qty', 'receivedQty'],
          ['Minor Damage Qty', 'minorDamageQty'],
          ['Major Damage Qty', 'majorDamageQty'],
          ['Output Qty', 'outputQty'],
        ].map(([label, field]) => (
          <Box key={field} sx={{ mb: 3 }}>
            <Typography fontWeight={700} mb={1}>
              {label}
            </Typography>
            <Grid container spacing={1}>
              {sizeList.map((size) => (
                <Grid item xs={4} sm={2} key={size}>
                  <TextField
                    label={size}
                    value={data[field]?.[size] ?? 0}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Paper>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
    </>
  );
};

export default ViewFinalQcReport;
