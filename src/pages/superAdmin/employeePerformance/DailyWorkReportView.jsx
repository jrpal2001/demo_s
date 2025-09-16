import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDailyWorkReportById } from '@/api/dailyWorkReport.api';
import { Box, Typography, CircularProgress, Button, Grid, Divider } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import { SectionPaper, SectionHeader } from './FormComponents';
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

const DailyWorkReportView = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/employee-performance/daily-work-report/list', title: 'Daily Work Report` },
    { title: 'View Report' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDailyWorkReportById(id);
        setData(res);
      } catch (err) {
        setError(err.message || 'Not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  return (
    <PageContainer title="Admin - View Daily Work Report" description="">
      <Breadcrumb title="Daily Work Report" items={BCrumb} />
      <ParentCard title="Daily Work Report Details">
        <SectionPaper>
          <SectionHeader title="Employee Information" />
          <Grid container spacing={3}>
            {topInfoFields.map(({ name, label }) => (
              <Grid item xs={12} md={4} key={name}>
                <CustomFormLabel>{label}</CustomFormLabel>
                <Typography variant="body1" sx={{ pl: 1 }}>{data[name] || '-'}</Typography>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>
        <SectionPaper>
          <SectionHeader title="Summary" />
          <Grid container spacing={3}>
            {summaryFields.map(({ name, label }) => (
              <Grid item xs={12} md={4} key={name}>
                <CustomFormLabel>{label}</CustomFormLabel>
                <Typography variant="body1" sx={{ pl: 1 }}>{data[name] || '-'}</Typography>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default DailyWorkReportView; 