'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeePerformanceById } from '@/api/employeePerformance.api';
import { Box, Typography, CircularProgress, Button, Grid, Divider } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import { SectionPaper, SectionHeader } from './FormComponents';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';


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
  {
    section: 'behaviour',
    title: 'Behaviour',
    complaint: 'behaviourComplaint',
    suggestion: 'suggestion',
  },
];

const EmployeePerformanceChartView = () => {
    const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/employee-performance/chart/list`, title: 'Employee Performance chart' },
    { title: 'View Performance' },
  ];
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getEmployeePerformanceById(id);
        setData(res);
      } catch (err) {
        setError(err.message || 'Not found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const handleDownloadReport = () => {
    if (!data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Helper function to draw checkbox with solid fill for selected options
    const drawCheckbox = (x, y, isChecked = false) => {
      // Draw the checkbox border
      doc.setDrawColor(0, 0, 0); // Black border
      doc.setLineWidth(0.5);
      doc.rect(x, y, 5, 5); // Made slightly larger (5x5 instead of 4x4)

      // Fill the checkbox if it's selected
      if (isChecked) {
        doc.setFillColor(0, 0, 0); // Black fill
        doc.rect(x + 0.8, y + 0.8, 3.4, 3.4, 'F'); // Fill with slight margin
      }
    };

    // Helper function to draw rating scale with better spacing
    const drawRatingScale = (startY, selectedRating = '') => {
      const ratings = ['EXCELLENT', 'GOOD', 'BETTER', 'AVERAGE', 'NOT GOOD', 'WORST'];
      let currentY = startY;

      // First row: EXCELLENT, GOOD, BETTER
      let currentX = 25;
      for (let i = 0; i < 3; i++) {
        const rating = ratings[i];
        const isSelected = selectedRating.toUpperCase() === rating;
        drawCheckbox(currentX, currentY, isSelected);
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0); // Ensure text is black
        doc.text(rating, currentX + 7, currentY + 2.8);
        currentX += 58; // Slightly more spacing between options
      }

      currentY += 14; // Move to next line

      // Second row: AVERAGE, NOT GOOD, WORST
      currentX = 25;
      for (let i = 3; i < 6; i++) {
        const rating = ratings[i];
        const isSelected = selectedRating.toUpperCase() === rating;
        drawCheckbox(currentX, currentY, isSelected);
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0); // Ensure text is black
        doc.text(rating, currentX + 7, currentY + 2.8);
        currentX += 58; // Slightly more spacing between options
      }

      return currentY + 16;
    };

    const ensureSpace = (neededHeight = 30) => {
      if (yPosition + neededHeight > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    const title = 'EMPLOYEE PERFORMANCE CHART';
    const titleWidth =
      (doc.getStringUnitWidth(title) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
    yPosition += 20;

    // Employee Details Section
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(`DETAILS FOR THE MONTH OF : ${data.month || '_______________'}`, 20, yPosition);
    yPosition += 12;

    doc.text(`EMPLOYEE NAME: ${data.employeeName || '_______________'}`, 20, yPosition);
    yPosition += 10;

    doc.text(`EMPLOYEE ID: ${data.employeeId || '_______________'}`, 20, yPosition);
    yPosition += 10;

    doc.text(
      `EMPLOYEE DESIGNATION: ${data.employeeDesignation || '_______________'}`,
      20,
      yPosition,
    );
    yPosition += 10;

    doc.text(`DEPARTMENT: ${data.department || '_______________'}`, 20, yPosition);
    yPosition += 18;

    // 1. PUNCTUALITY
    ensureSpace(30);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`1. PUNCTUALITY : ${data.punctuality || '-'}`, 20, yPosition);
    yPosition += 12;

    yPosition = drawRatingScale(yPosition, data.punctuality);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('DESCRIBE:', 20, yPosition);
    yPosition += 8;
    doc.setFont(undefined, 'normal');
    const punctualityDesc = data.punctualityDescribe || '_______________';
    // Split long text into multiple lines if needed
    const splitText = doc.splitTextToSize(punctualityDesc, 170);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 6 + 15;

    // 2. TASKS (TARGET)
    ensureSpace(40);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`2. TASKS (TARGET) : ${data.tasks || '-'}`, 20, yPosition);
    yPosition += 12;

    yPosition = drawRatingScale(yPosition, data.tasks);

    // Weekly breakdown with better formatting
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');

    // Create a 2x2 grid for weekly data
    const weeklyData = [
      { label: '1ST WEEK', value: data.week1 || '___' },
      { label: '2ND WEEK', value: data.week2 || '___' },
      { label: '3RD WEEK', value: data.week3 || '___' },
      { label: '4TH WEEK', value: data.week4 || '___' },
    ];

    // First row
    doc.text(`${weeklyData[0].label}: ${weeklyData[0].value}`, 25, yPosition);
    doc.text(`${weeklyData[1].label}: ${weeklyData[1].value}`, 120, yPosition);
    yPosition += 10;

    // Second row
    doc.text(`${weeklyData[2].label}: ${weeklyData[2].value}`, 25, yPosition);
    doc.text(`${weeklyData[3].label}: ${weeklyData[3].value}`, 120, yPosition);
    yPosition += 18;

    // 3. PERFORMANCE (WORK QUALITY)
    ensureSpace(30);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`3. PERFORMANCE (WORK QUALITY) : ${data.performance || '-'}`, 20, yPosition);
    yPosition += 12;

    yPosition = drawRatingScale(yPosition, data.performance);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('DESCRIBE:', 20, yPosition);
    yPosition += 8;
    doc.setFont(undefined, 'normal');
    const performanceDesc = data.performanceDescribe || '_______________';
    const splitPerformanceText = doc.splitTextToSize(performanceDesc, 170);
    doc.text(splitPerformanceText, 20, yPosition);
    yPosition += splitPerformanceText.length * 6 + 15;

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = 20;
    }

    // 4. BEHAVIOUR
    ensureSpace(30);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`4. BEHAVIOUR: ${data.behaviour || '-'}`, 20, yPosition);
    yPosition += 12;

    yPosition = drawRatingScale(yPosition, data.behaviour);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('COMPLAINT :', 20, yPosition);
    yPosition += 8;
    doc.setFont(undefined, 'normal');
    const complaint = data.behaviourComplaint || '_______________';
    const splitComplaintText = doc.splitTextToSize(complaint, 170);
    doc.text(splitComplaintText, 20, yPosition);
    yPosition += splitComplaintText.length * 6 + 15;

    // 5. SUGGESTION
    ensureSpace(30);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`5. IF ANY SUGGESTION: ${data.suggestion || '-'}`, 20, yPosition);
    yPosition += 8;
    doc.setFont(undefined, 'normal');
    const suggestion = data.suggestion || '_______________';
    const splitSuggestionText = doc.splitTextToSize(suggestion, 170);
    doc.text(splitSuggestionText, 20, yPosition);
    yPosition += splitSuggestionText.length * 6 + 25;

    // Ensure signature section is at the bottom
    const signatureY = Math.max(yPosition, pageHeight - 40);

    // Signature section
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Department Head Signature', 30, signatureY);
    doc.text('HR Manager', 140, signatureY);

    // Save the PDF
    doc.save(`Employee_Performance_${data.employeeName || 'Report'}.pdf`);
  };

  return (
    <PageContainer title="Admin - View Employee Performance Chart" description="">
      <Breadcrumb title="Employee Performance" items={BCrumb} />
      <ParentCard title="Employee Performance Chart Details">
        <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleDownloadReport}>
          Download Performance Report
        </Button>

        <SectionPaper>
          <SectionHeader title="Employee Information" />
          <Grid container spacing={3}>
            {employeeDetailsFields.map(({ name, label }) => (
              <Grid item xs={12} md={4} key={name}>
                <CustomFormLabel>{label}</CustomFormLabel>
                <Typography variant="body1" sx={{ pl: 1 }}>
                  {data[name] || '-'}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </SectionPaper>

        <SectionPaper>
          <SectionHeader title="Performance Evaluation" />
          {performanceFields.map(
            ({ section, title, description, weekly, complaint, suggestion }) => (
              <Box key={section} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ pl: 1, mb: 1 }}>
                  {data[section] || '-'}
                </Typography>

                {description && (
                  <>
                    <CustomFormLabel>Description</CustomFormLabel>
                    <Typography variant="body2" sx={{ pl: 1, mb: 1 }}>
                      {data[description] || '-'}
                    </Typography>
                  </>
                )}

                {weekly && (
                  <Grid container spacing={2}>
                    {weeklyFields.map(({ name, label }) => (
                      <Grid item xs={12} md={6} key={name}>
                        <CustomFormLabel>{label}</CustomFormLabel>
                        <Typography variant="body2" sx={{ pl: 1, mb: 1 }}>
                          {data[name] || '-'}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {complaint && (
                  <>
                    <CustomFormLabel>Complaint Details</CustomFormLabel>
                    <Typography variant="body2" sx={{ pl: 1, mb: 1 }}>
                      {data[complaint] || '-'}
                    </Typography>
                  </>
                )}

                {suggestion && (
                  <Box sx={{ mt: 2 }}>
                    <CustomFormLabel>Suggestions</CustomFormLabel>
                    <Typography variant="body2" sx={{ pl: 1, mb: 1 }}>
                      {data[suggestion] || '-'}
                    </Typography>
                  </Box>
                )}

                {section !== 'behaviour' && <Divider sx={{ my: 4 }} />}
              </Box>
            ),
          )}
        </SectionPaper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      </ParentCard>
    </PageContainer>
  );
};

export default EmployeePerformanceChartView;
