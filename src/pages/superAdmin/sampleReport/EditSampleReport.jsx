import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { getSampleReportById, updateSampleReport } from '@/api/sampleReport.api';
import { getSalesExecutives } from '@/api/user.api'; // Import the API function for sales executives

const initialState = {
  date: '',
  jobcardNo: '',
  salesExecutiveId: '',
  salesExecutiveName: '',
  customerName: '',
  customerCode: '',
  customerType: '',
  quantity: '',
  amount: '',
  status: 'NEW',
};

const EditSampleReport = () => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // State for Sales Executive Autocomplete
  const [salesExecOptions, setSalesExecOptions] = useState([]);
  const [salesExecLoading, setSalesExecLoading] = useState(false);
  const [salesExecInputValue, setSalesExecInputValue] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      setFetching(true);
      try {
        const res = await getSampleReportById(id);
        const data = res.data;
        // Format dates for input fields
        data.date = data.date?.substring(0, 10);
        // Set form state with fetched data
        setForm({ ...initialState, ...data });
        // Initialize salesExecInputValue for Autocomplete
        if (data.salesExecutiveName) {
          setSalesExecInputValue(data.salesExecutiveName);
        }
      } catch (err) {
        alert('Failed to load report data.');
      } finally {
        setFetching(false);
      }
    };
    fetchReport();
  }, [id]);

  // Effect for fetching Sales Executives based on input
  useEffect(() => {
    const fetchSalesExecutives = async () => {
      // Only fetch if input value is not empty and has at least 2 characters
      if (salesExecInputValue.length >= 2) {
        setSalesExecLoading(true);
        try {
          const data = await getSalesExecutives({ search: salesExecInputValue });
          console.log('🚀 ~ EditSampleReport ~ fetched sales executives data:', data);
          setSalesExecOptions(data.data);
        } catch (error) {
          console.error('Failed to fetch Sales Executives', error);
          setSalesExecOptions([]);
        } finally {
          setSalesExecLoading(false);
        }
      } else if (salesExecInputValue === '') {
        setSalesExecOptions([]); // Clear options immediately if input is empty
      }
    };

    fetchSalesExecutives();
  }, [salesExecInputValue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('🚀 ~ handleSubmit ~ form data:', form);
    try {
      // Add basic validation for required fields before submission
      if (!form.date || !form.jobcardNo || !form.salesExecutiveId) {
        alert('Please fill in all required fields');
        setLoading(false);
        return;
      }
      await updateSampleReport(id, form);
      navigate('/admin/sample-report');
    } catch (err) {
      alert('Failed to update report.');
    } finally {
      setLoading(false);
    }
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: '/admin/sample-report', title: 'Sample Report' },
    { title: 'Edit' },
  ];

  if (fetching) return <Typography>Loading...</Typography>;

  return (
    <PageContainer title="Edit Sample Report" description="">
      <Breadcrumb title="Sample Report" items={BCrumb} />
      <ParentCard title="Edit Sample Report">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Job Card No"
                name="jobcardNo"
                value={form.jobcardNo}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Sales Executive Autocomplete Search Field */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                id="salesExecutive-autocomplete"
                options={salesExecOptions}
                loading={salesExecLoading}
                getOptionLabel={(option) =>
                  option.employeeId ? `${option.employeeId} - ${option.fullName}` : ''
                }
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={
                  salesExecOptions.find((opt) => opt.employeeId === form.salesExecutiveId) || null
                } // Match by employeeId
                onChange={(event, newValue) => {
                  setForm({
                    ...form,
                    salesExecutiveId: newValue ? newValue.employeeId : '', // Set employeeId here
                    salesExecutiveName: newValue ? newValue.fullName : '',
                  });
                }}
                onInputChange={(event, newInputValue, reason) => {
                  // Only update salesExecInputValue if the change is from user input
                  if (reason === 'input') {
                    setSalesExecInputValue(newInputValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Sales Executive (ID or Name)"
                    fullWidth
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {salesExecLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            {/* Sales Executive Name (Autofilled and Read-only) */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Sales Executive Name"
                name="salesExecutiveName"
                value={form.salesExecutiveName}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Code"
                name="customerCode"
                value={form.customerCode}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Type"
                name="customerType"
                value={form.customerType}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="NEW">NEW</MenuItem>
                <MenuItem value="EX">EX</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EditSampleReport;
