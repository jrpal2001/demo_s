import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Dashboard from '../pages/superAdmin/dashboard';
import QualityReports from '@/pages/quality/QualityReports';
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';

// SRS Job Card imports
import SrsJobCards from '@/pages/srsjobcard';
import ViewSrsJobCard from '@/pages/srsjobcard/view';
import CreateSrsJobCard from '@/pages/srsjobcard/create';
import EditSrsJobCard from '@/pages/srsjobcard/edit';
import SrsJobCardWorkOrders from '@/pages/srsjobcard/workorders';
import CreateSrsWorkOrder from '@/pages/srsjobcard/workorder/CreateSrsWorkOrder';
import ViewSrsWorkOrders from '@/pages/srsjobcard/workorder/ViewSrsWorkOrders';
import CreateWorkOrder from '@/pages/jobcards/workorder/CreateWorkorder';
import WorkOrders from '@/pages/jobcards/workorder/ViewAllWorkorders';
import RecuttingWorkOrders from '@/pages/jobcards/workorder/RecuttingWorkOrders';
import CreateRecuttingWorkOrder from '@/pages/jobcards/workorder/CreateRecuttingWorkOrder';
import ViewWorkOrderDetails from '@/pages/jobcards/workorder/ViewWorkorderDetails';
import WorkflowDetails from '@/pages/jobcards/workflow/WorkFlowDetails';
import TimingPage from '@/pages/jobcards/workflow/TimingPage';
import Error from '@/pages/error/Error';

// Additional imports for missing routes
import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const qualityRoutes = [
  // Add route for root path to redirect to quality dashboard
  { path: '/', element: <Navigate to="/quality/dashboard" /> },
  {
    path: '/quality',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/quality', element: <Navigate to="/quality/dashboard" /> },
      { path: '/quality/dashboard', element: <Dashboard /> },
      { path: '/quality/quality-reports', element: <QualityReports /> },
      // Job Card routes
      { path: '/quality/job-cards', element: <JobCards /> },
      { path: '/quality/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/quality/job-cards/create', element: <CreateJobCard /> },
      { path: '/quality/job-cards/edit/:id', element: <EditJobCard /> },

      // SRS Job Card routes
      { path: '/quality/srs-jobcard', element: <SrsJobCards /> },
      { path: '/quality/srs-jobcard/view/:id', element: <ViewSrsJobCard /> },
      { path: '/quality/srs-jobcard/create', element: <CreateSrsJobCard /> },
          { path: '/quality/srs-jobcard/edit/:id', element: <EditSrsJobCard /> },
    { path: '/quality/srs-jobcard/workorders/:id', element: <SrsJobCardWorkOrders /> },
    { path: '/quality/srs-jobcard/workorder/create/:jobCardId', element: <CreateSrsWorkOrder /> },
    { path: '/quality/srs-jobcard/workorder/view/:jobCardId', element: <ViewSrsWorkOrders /> },
      // Work Order routes
      { path: '/quality/job-card/workorder/:jobCardId', element: <CreateWorkOrder /> },
      { path: '/quality/job-card/workorder/:jobCardId/view', element: <WorkOrders /> },
      {
        path: '/quality/job-card/workorder/recutting/:workOrderId',
        element: <RecuttingWorkOrders />,
      },
      {
        path: '/quality/job-card/workorder/recutting/:workOrderId/create',
        element: <CreateRecuttingWorkOrder />,
      },
      {
        path: '/quality/job-card/workorder/:jobCardId/view/:workOrderId',
        element: <ViewWorkOrderDetails />,
      },
      // Workflow routes
      { path: '/quality/work-flow/:workorderId', element: <WorkflowDetails /> },
      { path: '/quality/work-flow/:workorderId/update', element: <TimingPage /> },

      // Product Master Routes
      { path: '/quality/productmaster', element: <IndexUpdate /> },
      { path: '/quality/productmaster/create', element: <ProductCreation /> },
      { path: '/quality/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/quality/productmaster/edit/:id', element: <EditProduct /> },

      // quality/purchaseindent
      { path: '/quality/purchaseindent', element: <PurchaseIndent /> },
      { path: '/quality/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Employee Performance Routes
      { path: '/quality/employee-performance', element: <Navigate to="/quality/employee-performance/chart" /> },
      { path: '/quality/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/quality/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/quality/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/quality/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/quality/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/quality/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/quality/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/quality/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/quality/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/quality/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default qualityRoutes;
