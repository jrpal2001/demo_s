import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeePerformanceById, updateEmployeePerformance } from '@/api/employeePerformance.api';
import { Box, Button, Radio, RadioGroup, FormControlLabel, Typography, Divider, Grid, CircularProgress } from '@mui/material';
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

const ratingOptions = [
  'EXCELLENT',
  'GOOD',
  'BETTER',
  'AVERAGE',
  'NOT GOOD',
  'WORST',
];

const ratingColors = {
  EXCELLENT: '#4CAF50',
  GOOD: '#8BC34A',
  BETTER: '#CDDC39',
  AVERAGE: '#FFC107',
  'NOT GOOD': '#FF9800',
  WORST: '#F44336',
};

const employeeDetailsFields = [
  { name: 'month', label: 'Details for the Month' },
  { name: 'employeeName', label: 'Employee Name' },
  { name: 'employeeId', label: 'Employee ID' },
  { name: 'employeeDesignation', label: 'Designation' },
  { name: 'department', label: 'Department' },
];

const weeklyFields = [
  { name: 'week1', label: '1st Week' },
  { name: 'week2', label: '2nd Week' },
  { name: 'week3', label: '3rd Week' },
  { name: 'week4', label: '4th Week' },
];

const performanceFields = [
  { section: 'punctuality', title: 'Punctuality', description: 'punctualityDescribe' },
  { section: 'tasks', title: 'Tasks (Target)', weekly: true },
  { section: 'performance', title: 'Performance', description: 'performanceDescribe' },
  { section: 'behaviour', title: 'Behaviour', complaint: 'behaviourComplaint', suggestion: 'suggestion' },
];

const EmployeePerformanceChartEdit = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/employee-performance/chart/list`, title: 'Employee Performance chart' },
    { title: 'Edit Performance' },
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
        const res = await getEmployeePerformanceById(id);
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

  const handleRatingChange = (section) => (e) => {
    setForm({ ...form, [section]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Remove internal MongoDB fields before sending to backend
      const formData = cleanMongoFields(form);
      await updateEmployeePerformance(id, formData);
      toast.success('Employee Performance Chart updated successfully');
      navigate(`/${userType}/employee-performance/chart/list`);
    } catch (err) {
      toast.error(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleClickCancel = () => {
    navigate(-1);
  };

  const renderRatingRow = (section, title) => (
    <Box sx={{ mb: 4 }}>
      <SectionHeader title={title} />
      <RadioGroup
        row
        name={section}
        value={form[section] || ''}
        onChange={handleRatingChange(section)}
        sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1}}
      >
        {ratingOptions.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio sx={{ color: ratingColors[option], '&.Mui-checked': { color: ratingColors[option] } }} />}
            label={<Typography variant="body2">{option}</Typography>}
            sx={{ m: 0, px: 1.5, py: 0.5, borderRadius: 1, backgroundColor: form[section] === option ? 'rgba(25, 118, 210, 0.08)' : 'transparent', flex: '1 1 auto', minWidth: '120px' }}
          />
        ))}
      </RadioGroup>
    </Box>
  );

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!form) return null;

  return (
    <PageContainer title="Admin - Edit Employee Performance Chart" description="">
      <Breadcrumb title="Employee Performance" items={BCrumb} />
      <ParentCard title="Edit Employee Performance Chart">
        <form onSubmit={handleSubmit}>
          <SectionPaper>
            <SectionHeader title="Employee Information" />
            <Grid container spacing={3}>
              {employeeDetailsFields.map(({ name, label }) => (
                <Grid item xs={12} md={4} key={name}>
                  <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                  <CustomTextField id={name} name={name} value={form[name] || ''} onChange={handleInputChange} fullWidth variant="outlined" size="small" />
                </Grid>
              ))}
            </Grid>
          </SectionPaper>

          <SectionPaper>
            <SectionHeader title="Performance Evaluation" />
            {performanceFields.map(({ section, title, description, weekly, complaint, suggestion }) => (
              <Box key={section} sx={{ mb: 4 }}>
                {renderRatingRow(section, title)}
                {description && (
                  <>
                    <CustomFormLabel htmlFor={description}>Description</CustomFormLabel>
                    <CustomTextField id={description} name={description} value={form[description] || ''} onChange={handleInputChange} fullWidth multiline minRows={3} variant="outlined" placeholder={`Describe ${section}...`} />
                  </>
                )}
                {weekly && (
                  <Grid container spacing={2}>
                    {weeklyFields.map(({ name, label }) => (
                      <Grid item xs={12} md={6} key={name}>
                        <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                        <CustomTextField id={name} name={name} value={form[name] || ''} onChange={handleInputChange} fullWidth multiline minRows={3} variant="outlined" placeholder={`${label} details...`} />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {complaint && (
                  <>
                    <CustomFormLabel htmlFor={complaint}>Complaint Details</CustomFormLabel>
                    <CustomTextField id={complaint} name={complaint} value={form[complaint] || ''} onChange={handleInputChange} fullWidth multiline minRows={3} variant="outlined" placeholder="Complaint details..." />
                  </>
                )}
                {suggestion && (
                  <Box sx={{ mt: 4 }}>
                    <CustomFormLabel htmlFor={suggestion}>Suggestions</CustomFormLabel>
                    <CustomTextField id={suggestion} name={suggestion} value={form[suggestion] || ''} onChange={handleInputChange} fullWidth multiline minRows={3} variant="outlined" placeholder="Any suggestions for improvement..." />
                  </Box>
                )}
                {section !== 'behaviour' && <Divider sx={{ my: 4 }} />}
              </Box>
            ))}
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

export default EmployeePerformanceChartEdit; 