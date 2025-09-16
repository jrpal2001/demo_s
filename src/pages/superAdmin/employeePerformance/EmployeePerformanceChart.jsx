
'use client';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { useNavigate } from 'react-router-dom';
import { SectionPaper, SectionHeader } from './FormComponents';
import { createEmployeePerformance } from '@/api/employeePerformance.api';
import { toast } from 'react-toastify';
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

const EmployeePerformanceChart = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/employee-performance/chart/list`, title: 'Employee Performance Chart' },
    { title: 'Add Performance' },
  ];

  const validationSchema = Yup.object({
    month: Yup.string().required('Details for the Month is required'),
    employeeName: Yup.string().required('Employee Name is required'),
    employeeId: Yup.string().required('Employee ID is required'),
    employeeDesignation: Yup.string().required('Designation is required'),
    department: Yup.string().required('Department is required'),
    punctuality: Yup.string().required('Punctuality rating is required'),
    tasks: Yup.string().required('Tasks (Target) rating is required'),
    performance: Yup.string().required('Performance rating is required'),
    behaviour: Yup.string().required('Behaviour rating is required'),
    punctualityDescribe: Yup.string(),
    week1: Yup.string(),
    week2: Yup.string(),
    week3: Yup.string(),
    week4: Yup.string(),
    performanceDescribe: Yup.string(),
    behaviourComplaint: Yup.string(),
    suggestion: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      month: '',
      employeeName: '',
      employeeId: '',
      employeeDesignation: '',
      department: '',
      punctuality: '',
      punctualityDescribe: '',
      tasks: '',
      week1: '',
      week2: '',
      week3: '',
      week4: '',
      performance: '',
      performanceDescribe: '',
      behaviour: '',
      behaviourComplaint: '',
      suggestion: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createEmployeePerformance(values);
        toast.success('Employee Performance Chart submitted successfully!');
        navigate(`/${userType}/employee-performance/chart/list`);
      } catch (error) {
        toast.error(error.message || 'Failed to submit Employee Performance Chart');
      }
    },
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const errors = await formik.validateForm();

    // Mark all fields as touched to show inline helper texts
    const allTouched = Object.keys(formik.values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    formik.setTouched(allTouched, true);

    if (Object.keys(errors).length > 0) {
      // Show a toast for each validation error
      Object.values(errors).forEach((message) => {
        if (typeof message === 'string') {
          toast.error(message);
        }
      });
      return;
    }

    // No errors, proceed with submission
    formik.submitForm();
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
        value={formik.values[section]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}
      >
        {ratingOptions.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio sx={{ color: ratingColors[option], '&.Mui-checked': { color: ratingColors[option] } }} />}
            label={<Typography variant="body2">{option}</Typography>}
            sx={{
              m: 0,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: formik.values[section] === option ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              flex: '1 1 auto',
              minWidth: '120px',
            }}
          />
        ))}
      </RadioGroup>
      {formik.touched[section] && formik.errors[section] && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
          {formik.errors[section]}
        </Typography>
      )}
    </Box>
  );

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

  return (
    <PageContainer title="Admin - Employee Performance Chart" description="">
      <Breadcrumb title="Employee Performance" items={BCrumb} />
      <ParentCard title="Employee Performance Chart">
        <form onSubmit={handleFormSubmit}>
          <SectionPaper>
            <SectionHeader title="Employee Information" />
            <Grid container spacing={3}>
              {employeeDetailsFields.map(({ name, label }) => (
                <Grid item xs={12} md={4} key={name}>
                  <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                  <CustomTextField
                    id={name}
                    name={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth
                    variant="outlined"
                    size="small"
                    error={formik.touched[name] && Boolean(formik.errors[name])}
                    helperText={formik.touched[name] && formik.errors[name]}
                  />
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
                    <CustomTextField
                      id={description}
                      name={description}
                      value={formik.values[description]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      multiline
                      minRows={3}
                      variant="outlined"
                      placeholder={`Describe ${section}...`}
                      error={formik.touched[description] && Boolean(formik.errors[description])}
                      helperText={formik.touched[description] && formik.errors[description]}
                    />
                  </>
                )}
                {weekly && (
                  <Grid container spacing={2}>
                    {weeklyFields.map(({ name, label }) => (
                      <Grid item xs={12} md={6} key={name}>
                        <CustomFormLabel htmlFor={name}>{label}</CustomFormLabel>
                        <CustomTextField
                          id={name}
                          name={name}
                          value={formik.values[name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          fullWidth
                          multiline
                          minRows={3}
                          variant="outlined"
                          placeholder={`${label} details...`}
                          error={formik.touched[name] && Boolean(formik.errors[name])}
                          helperText={formik.touched[name] && formik.errors[name]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
                {complaint && (
                  <>
                    <CustomFormLabel htmlFor={complaint}>Complaint Details</CustomFormLabel>
                    <CustomTextField
                      id={complaint}
                      name={complaint}
                      value={formik.values[complaint]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      multiline
                      minRows={3}
                      variant="outlined"
                      placeholder="Complaint details..."
                      error={formik.touched[complaint] && Boolean(formik.errors[complaint])}
                      helperText={formik.touched[complaint] && formik.errors[complaint]}
                    />
                  </>
                )}
                {suggestion && (
                  <Box sx={{ mt: 4 }}>
                    <CustomFormLabel htmlFor={suggestion}>Suggestions</CustomFormLabel>
                    <CustomTextField
                      id={suggestion}
                      name={suggestion}
                      value={formik.values[suggestion]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      fullWidth
                      multiline
                      minRows={3}
                      variant="outlined"
                      placeholder="Any suggestions for improvement..."
                      error={formik.touched[suggestion] && Boolean(formik.errors[suggestion])}
                      helperText={formik.touched[suggestion] && formik.errors[suggestion]}
                    />
                  </Box>
                )}
                {section !== 'behaviour' && <Divider sx={{ my: 4 }} />}
              </Box>
            ))}
          </SectionPaper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
              Submit
            </Button>
            <Button onClick={handleClickCancel} variant="outlined" sx={{ minWidth: 120 }}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EmployeePerformanceChart;