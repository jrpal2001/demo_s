'use client';

import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Link as MuiLink,
  Container,
  CircularProgress,
} from '@mui/material';
import WorkorderDepartmentDetails from './WorkorderDepartmentDetails';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';


const WorkorderDepartmentPage = () => {
  const userType = useSelector(selectCurrentUserType);
  const { workOrderId, department } = useParams();
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState('Department Details');

    const location = useLocation();
    const rowData = location.state?.rowData;

  useEffect(() => {
    // Set page title based on department
    if (department) {
      let title = '';
      switch (department) {
        case 'fabric':
          title = 'Fabric Department Details';
          break;
        case 'cutting':
          title = 'Cutting Department Details';
          break;
        case 'operationparts':
          title = 'Operation Parts Details';
          break;
        case 'embroidery':
          title = 'Embroidery Department Details';
          break;
        case 'trims':
          title = 'Trims Department Details';
          break;
        case 'stitching':
          title = 'Stitching Department Details';
          break;
        case 'finishing':
          title = 'Finishing Department Details';
          break;
        case 'production':
          title = 'Production Department Details';
          break;
        case 'all':
          title = 'All Departments Details';
          break;
        default:
          title = 'Department Details';
      }
      setPageTitle(title);
    }
    setLoading(false);
  }, [department]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Breadcrumb
          title={pageTitle}
          items={[
            { to: `/${userType}/dashboard`, title: 'Dashboard' },
            { to: `/${userType}/work-orders`, title: 'Work Orders' },
            { to: `/${userType}/work-orders/${workOrderId}`, title: 'Work Order Details' },
          ]}
        />
        <Typography variant="h4" component="h1" gutterBottom mt={2}>
          {pageTitle}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Work Order ID: {workOrderId}
        </Typography>
      </Box>

      <WorkorderDepartmentDetails
        workOrderId={workOrderId}
        department={department}
        departmentWorkOrderRef={rowData.departmentWorkOrderRef}
      />
    </Container>
  );
};

export default WorkorderDepartmentPage;
