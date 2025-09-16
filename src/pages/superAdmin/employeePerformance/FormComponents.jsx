import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const SectionPaper = ({ children, ...props }) => (
  <Paper 
    sx={{ 
      p: 4, 
      mb: 4, 
      borderRadius: 2,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
      border: '1px solid',
      borderColor: 'divider',
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Paper>
);

const SectionHeader = ({ title }) => (
  <Typography variant="h6" sx={{ 
    mb: 3,
    fontWeight: 600,
    color: 'primary.main'
  }}>
    {title}
  </Typography>
);

export { SectionPaper, SectionHeader }; 