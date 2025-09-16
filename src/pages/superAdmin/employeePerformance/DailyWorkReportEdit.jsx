import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDailyWorkReportById, updateDailyWorkReport } from '@/api/dailyWorkReport.api';
import { Box, Button, Typography, CircularProgress, Grid } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { SectionPaper, SectionHeader } from './FormComponents';
import { toast } from 'react-toastify';
import { cleanMongoFields } from '@/utils/cleanMongoFields';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const topInfoFields = [
  { name: 'department', label: 'Department' },
  { name: 'headOfDepartment', label: 'Head of the Department' },
  { name: 'date', label: 'Date' },
  { name: 'workerName', label: 'Worker Name' },
  { name: 'workerId', label: 'Worker ID' },
  { name: 'jobRoll', label: 'Job Roll' },
];

const summaryFields = [
  { name: 'totalWorkingHour', label: 'Total Working Hour' },
  { name: 'totalProductionQuantity', label: 'Total Production Quantity' },
  { name: 'target', label: 'Target' },
];

const DailyWorkReportEdit = () => {
    const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/employee-performance/daily-work-report/list', title: 'Daily Work Report` },
    { title: 'Edit Report' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDailyWorkReportById(id);
        setForm(res);
      } catch (err) {
        setError(err.message || 'Not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Frontend validation for required fields
    const requiredFields = ['department', 'date', 'workerName', 'workerId'];
    for (const field of requiredFields) {
      if (!form[field] || form[field].trim() === '') {
        toast.error(`Field '${field}' is required.`);
        setSaving(false);
        return;
      }
    }
    setSaving(true);
    try {
      // Remove internal MongoDB fields before sending to backend
      const formData = cleanMongoFields(form);
      await updateDailyWorkReport(id, formData);
      toast.success('Daily Work Report updated successfully');
      navigate(`/${userType}/employee-performance/daily-work-report/list`);
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleClickCancel = () => {
    navigate(-1);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!form) return null;

  return (
    <PageContainer title="Admin - Edit Daily Work Report" description="">
      <Breadcrumb title="Daily Work Report" items={BCrumb} />
      <ParentCard title="Edit Daily Work Report">
        <form onSubmit={handleSubmit}>
          <SectionPaper>
            <SectionHeader title="Employee Information" />
            <Grid container spacing={3}>
              {topInfoFields.map(({ name, label }) => (
                <Grid item xs={12} md={4} key={name}>
                  <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                  <CustomTextField id={name} name={name} value={form[name] || ''} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                </Grid>
              ))}
            </Grid>
          </SectionPaper>
          <SectionPaper>
            <SectionHeader title="Summary" />
            <Grid container spacing={3}>
              {summaryFields.map(({ name, label }) => (
                <Grid item xs={12} md={4} key={name}>
                  <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                  <CustomTextField id={name} name={name} value={form[name] || ''} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                </Grid>
              ))}
            </Grid>
          </SectionPaper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button type="submit" variant="contained" color="primary" disabled={saving} sx={{ minWidth: 120 }}>Save</Button>
            <Button variant="outlined" onClick={handleClickCancel} sx={{ minWidth: 120 }}>Cancel</Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default DailyWorkReportEdit; 