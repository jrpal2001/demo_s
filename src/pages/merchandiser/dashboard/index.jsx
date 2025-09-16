import PageContainer from '@/components/container/PageContainer';
import Expence from '@/components/dashboards/ecommerce/Expence';
import Sales from '@/components/dashboards/ecommerce/Sales';
import WelcomeCard from '@/components/dashboards/ecommerce/WelcomeCard';
import { Box, Grid, Grid2 } from '@mui/material';
import React from 'react';
import JobCards from '@/components/dashboards/custom/DashboardJobCardSummary';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <WelcomeCard />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Expence />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Sales />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            <JobCards />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
