import React, { useState } from 'react';
import { Box, Button, IconButton, Typography, TextField, Grid, InputAdornment, Divider } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import { Add, Remove, PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ParentCard from '@/components/shared/ParentCard';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { SectionPaper, SectionHeader } from './FormComponents';
import { createDailyWorkReport } from '@/api/dailyWorkReport.api';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';



const initialJob = {
  operation: '',
  machine: '',
  target: '',
  achievedQuantity: '',
  startTime: '',
  endTime: '',
  producedPerHour: '',
};

const topInfoFields = [
  { name: 'department', label: 'Department', type: 'text' },
  { name: 'headOfDepartment', label: 'Head of the Department', type: 'text' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'workerName', label: 'Worker Name', type: 'text' },
  { name: 'workerId', label: 'Worker ID', type: 'text' },
  { name: 'jobRoll', label: 'Job Roll', type: 'text' },
];

const summaryFields = [
  { name: 'totalWorkingHour', label: 'Total Working Hour' },
  { name: 'totalProductionQuantity', label: 'Total Production Quantity' },
];

const DailyWorkReport = () => {
    const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/employee-performance/daily-work-report/list`, title: 'Daily Work Report' },
    { title: 'add Report' },
  ];
  const [form, setForm] = useState({
    department: '',
    headOfDepartment: '',
    date: '',
    workerName: '',
    workerId: '',
    jobRoll: '',
    jobs: [ { ...initialJob } ],
    totalWorkingHour: '',
    totalProductionQuantity: '',
    target: 0
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJobChange = (idx, field) => (e) => {
    const jobs = [...form.jobs];
    jobs[idx][field] = e.target.value;
    setForm({ ...form, jobs });
  };

  const handleAddJob = () => {
    setForm({ ...form, jobs: [...form.jobs, { ...initialJob }] });
  };

  const handleRemoveJob = (idx) => {
    const jobs = form.jobs.filter((_, i) => i !== idx);
    setForm({ ...form, jobs });
  };

  const handleTargetChange = (delta) => {
    setForm({ ...form, target: Math.max(0, form.target + delta) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDailyWorkReport(form);
      toast.success('Daily Work Report submitted successfully!');
      navigate(`/${userType}/employee-performance/daily-work-report/list`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit Daily Work Report');
    }
  };

  const handleClickCancel = () => {
    navigate(-1);
  };

  return (
    <PageContainer title="Admin - Daily Work Report" description="">
      <Breadcrumb title="Employee Performance" items={BCrumb} />
      <ParentCard title="Daily Work Report">
        <form onSubmit={handleSubmit}>
          {/* Top Section */}
          <SectionPaper>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
              {/* Details on the right */}
              <Box sx={{ flex: 1 }}>
                <SectionHeader title="Employee Information" />
                <Grid2 container spacing={3}>
                  {topInfoFields.map(({ name, label, type }) => (
                    <Grid2 xs={12} md={6} key={name}>
                      <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                      <CustomTextField
                        id={name}
                        name={name}
                        type={type}
                        value={form[name]}
                        onChange={handleInputChange}
                        fullWidth
                        size="small"
                        InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </Box>
            </Box>
          </SectionPaper>

          <SectionPaper>
            <SectionHeader title="Job Details" />
            {form.jobs.map((job, idx) => (
              <Box key={idx} sx={{ mb: 3, position: 'relative', p: 2, border: '1px solid #eee', borderRadius: 2, bgcolor: 'grey.50' }}>
                <Grid2 container spacing={3}>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>Operation</CustomFormLabel>
                    <CustomTextField value={job.operation} onChange={handleJobChange(idx, 'operation')} fullWidth size="small" />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>Machine</CustomFormLabel>
                    <CustomTextField value={job.machine} onChange={handleJobChange(idx, 'machine')} fullWidth size="small" />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>Target</CustomFormLabel>
                    <CustomTextField value={job.target} onChange={handleJobChange(idx, 'target')} fullWidth size="small" />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>Achieved Quantity</CustomFormLabel>
                    <CustomTextField value={job.achievedQuantity} onChange={handleJobChange(idx, 'achievedQuantity')} fullWidth size="small" />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>Start Time</CustomFormLabel>
                    <CustomTextField value={job.startTime} onChange={handleJobChange(idx, 'startTime')} fullWidth size="small" type="time" InputLabelProps={{ shrink: true }} />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>End Time</CustomFormLabel>
                    <CustomTextField value={job.endTime} onChange={handleJobChange(idx, 'endTime')} fullWidth size="small" type="time" InputLabelProps={{ shrink: true }} />
                  </Grid2>
                  <Grid2 xs={12} md={6}>
                    <CustomFormLabel>Produced Quantity Per Hour</CustomFormLabel>
                    <CustomTextField value={job.producedPerHour} onChange={handleJobChange(idx, 'producedPerHour')} fullWidth size="small" />
                  </Grid2>
                </Grid2>
                {form.jobs.length > 1 && (
                  <IconButton onClick={() => handleRemoveJob(idx)} sx={{ position: 'absolute', top: 8, right: 8 }} color="error">
                    <Remove />
                  </IconButton>
                )}
              </Box>
            ))}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
              <Button variant="contained" startIcon={<Add />} onClick={handleAddJob} size="medium">
                Add One More Job
              </Button>
            </Box>
          </SectionPaper>

          <SectionPaper>
            <SectionHeader title="Summary" />
            <Grid2 container spacing={3}>
              {summaryFields.map(({ name, label }) => (
                <Grid2 xs={12} md={6} key={name}>
                  <CustomFormLabel>{label}</CustomFormLabel>
                  <CustomTextField name={name} value={form[name]} onChange={handleInputChange} fullWidth size="small" />
                </Grid2>
              ))}
              <Grid2 xs={12} md={6}>
                <CustomFormLabel>Target</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleTargetChange(-1)}><Remove /></IconButton>
                  <CustomTextField value={form.target} inputProps={{ readOnly: true, style: { textAlign: 'center' } }} sx={{ mx: 1, width: 80 }} />
                  <IconButton onClick={() => handleTargetChange(1)}><Add /></IconButton>
                </Box>
              </Grid2>
            </Grid2>
          </SectionPaper>

          {/* Submit/Cancel Buttons */}
          <Box sx={{ margin: '1rem 1.5rem 0 0', display: 'flex', justifyContent: 'end', width: '100%' }}>
            <Button type="submit" sx={{ marginRight: '0.5rem' }} variant="contained" color="primary">
              Submit
            </Button>
            <Button type="button" onClick={handleClickCancel} variant="outlined">
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default DailyWorkReport; 