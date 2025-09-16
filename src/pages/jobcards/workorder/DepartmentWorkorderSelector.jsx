'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Grid, Button, Divider } from '@mui/material';
import {
  Fabric,
  ContentCut,
  Brush,
  Settings,
  Inventory,
  CheckCircle,
  ViewModule,
} from '@mui/icons-material';

import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const DepartmentSelector = ({ workOrderId, assignedDepartments = [] }) => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [hoveredDept, setHoveredDept] = useState(null);

  // Define departments with their icons and paths
  const departments = [
    {
      id: 'fabric',
      name: 'Fabric',
      icon: <Fabric fontSize="large" />,
      description: 'Manage fabric details including weight and relaxing hours',
      path: `/${userType}/work-orders/${workOrderId}/department/fabric`,
    },
    {
      id: 'cutting',
      name: 'Cutting',
      icon: <ContentCut fontSize="large" />,
      description: 'Track cutting quantities and add remarks',
      path: `/${userType}/work-orders/${workOrderId}/department/cutting`,
    },
    {
      id: 'embroidery',
      name: 'Embroidery',
      icon: <Brush fontSize="large" />,
      description: 'Manage embroidery details and production',
      path: `/${userType}/work-orders/${workOrderId}/department/embroidery`,
    },
    {
      id: 'operationparts',
      name: 'Operation Parts',
      icon: <Settings fontSize="large" />,
      description: 'Track operation parts details and production',
      path: `/${userType}/work-orders/${workOrderId}/department/operationparts`,
    },
    {
      id: 'trims',
      name: 'Trims',
      icon: <Inventory fontSize="large" />,
      description: 'Manage trims details and quantities',
      path: `/${userType}/work-orders/${workOrderId}/department/trims`,
    },
    {
      id: 'stitching',
      name: 'Stitching',
      icon: <Settings fontSize="large" />,
      description: 'Track stitching production and details',
      path: `/${userType}/work-orders/${workOrderId}/department/stitching`,
    },
    {
      id: 'finishing',
      name: 'Finishing',
      icon: <CheckCircle fontSize="large" />,
      description: 'Manage finishing process and final inspection',
      path: `/${userType}/work-orders/${workOrderId}/department/finishing`,
    },
    {
      id: 'production',
      name: 'Production',
      icon: <ViewModule fontSize="large" />,
      description: 'View operation parts and stitching together',
      path: `/${userType}/work-orders/${workOrderId}/department/production`,
    },
    {
      id: 'all',
      name: 'All Departments',
      icon: <ViewModule fontSize="large" />,
      description: 'View and manage all department details',
      path: `/${userType}/work-orders/${workOrderId}/department/all`,
    },
  ];

  const handleDepartmentClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Select Department
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {departments.map((dept) => {
          const isAssigned =
            assignedDepartments.includes(dept.id) || dept.id === 'all' || dept.id === 'production';

          return (
            <Grid item xs={12} sm={6} md={4} key={dept.id}>
              <Card
                sx={{
                  height: '100%',
                  opacity: isAssigned ? 1 : 0.6,
                  transform: hoveredDept === dept.id ? 'translateY(-5px)' : 'none',
                  transition: 'all 0.3s ease',
                  cursor: isAssigned ? 'pointer' : 'not-allowed',
                  boxShadow:
                    hoveredDept === dept.id
                      ? '0 8px 16px rgba(0,0,0,0.1)'
                      : '0 2px 4px rgba(0,0,0,0.05)',
                  '&:hover': {
                    boxShadow: isAssigned
                      ? '0 8px 16px rgba(0,0,0,0.1)'
                      : '0 2px 4px rgba(0,0,0,0.05)',
                  },
                }}
                onMouseEnter={() => isAssigned && setHoveredDept(dept.id)}
                onMouseLeave={() => setHoveredDept(null)}
                onClick={() => isAssigned && handleDepartmentClick(dept.path)}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{dept.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {dept.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {dept.description}
                  </Typography>
                  <Button variant="outlined" color="primary" disabled={!isAssigned} fullWidth>
                    {isAssigned ? 'Manage' : 'Not Assigned'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DepartmentSelector;
