import PageContainer from '@/components/container/PageContainer';
import DashboardJobCardSummary from '@/components/dashboards/custom/DashboardJobCardSummary';
import WorkOrderDashboardSummary from '@/components/dashboards/custom/WorkorderDashboard';
import QualityDashboardSummary from '@/components/dashboards/custom/QualityDashboardSummary';
import QuotationLeadDashboard from '@/components/dashboards/custom/QuotationLeadDashboard';
import PurchaseOrderDashboardSummary from '@/components/dashboards/custom/PurchaseOrderDashboardSummary';
import { Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const departmentOrder = [
  'superAdmin',
  'admin',
  // "administration",
  'merchandiser',
  'supermerchandiser',
  'purchase',
  // "trimsAndAccessories",
  'trimsAndMachinePartsStore',
  'fabric',
  // "fabrics",
  'cutting',
  'production',
  'partsProduction',
  'finishing',
  'fgstore',
  'fgstoreInward',
  'fgstoreOutward',
  'embroidery',
  'orderManagement',
  'asset',
  'accessories',
  'maintenance',
  'otherStores',
  'leadManager',
  'salesExecutive',
  'accounts',
  'quality',
];

const Dashboard = () => {
  // const user = useSelector((state) => state.auth);
  const userType = useSelector(selectCurrentUserType);

  return (
    <PageContainer title="Dashboard" description="Dashboard">
      <Box mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* <WelcomeCard /> */}
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {/* <Expence /> */}
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* <Sales /> */}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} lg={8}>
            <DashboardJobCardSummary />
          </Grid>
          <Grid item xs={12} lg={4}>
            <WorkOrderDashboardSummary />
          </Grid>
          <Grid item xs={12} lg={4}>
            <QualityDashboardSummary />
          </Grid>
          <Grid item xs={12} lg={4}>
            <QuotationLeadDashboard />
          </Grid>
          <Grid item xs={12} lg={4}>
            <PurchaseOrderDashboardSummary />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
