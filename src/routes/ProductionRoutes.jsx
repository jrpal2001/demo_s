import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';
import CreateMaterialInward from '@/pages/superAdmin/inwardmaterial/CreateInwardMaterial';
import ViewMaterialInward from '@/pages/superAdmin/inwardmaterial/ViewMaterialInwardByID';
import InwardMaterialAll from '@/pages/superAdmin/inwardmaterial/ViewInwardMaterials';
import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';
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
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import Users from '@/pages/superAdmin/users';
import AddUser from '@/pages/superAdmin/users/addUser';
import EditUser from '@/pages/superAdmin/users/editUser';
import Error from '@/pages/error/Error';

// Additional imports for missing routes
import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';
import QualityReports from '@/pages/quality/QualityReports';
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const productionRoutes = [
  // Add route for root path to redirect to production dashboard
  { path: '/', element: <Navigate to="/production/dashboard" /> },
  {
    path: '/production',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/production', element: <Navigate to="/production/dashboard" /> },
      { path: '/production/dashboard', element: <Dashboard /> },
      { path: '/production/indent', element: <PurchaseIndent /> },
      { path: '/production/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/production/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/production/inward', element: <InwardMaterialAll /> },
      { path: '/production/inward/create', element: <CreateMaterialInward /> },
      { path: '/production/inward/:id', element: <ViewMaterialInward /> },
      { path: '/production/outward', element: <OutwardManagement /> },
      { path: '/production/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/production/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/production/job-cards', element: <JobCards /> },
      { path: '/production/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/production/job-cards/create', element: <CreateJobCard /> },
      { path: '/production/job-cards/edit/:id', element: <EditJobCard /> },

      // SRS Job Card routes
      { path: '/production/srs-jobcard', element: <SrsJobCards /> },
      { path: '/production/srs-jobcard/view/:id', element: <ViewSrsJobCard /> },
      { path: '/production/srs-jobcard/create', element: <CreateSrsJobCard /> },
      { path: '/production/srs-jobcard/edit/:id', element: <EditSrsJobCard /> },
      { path: '/production/srs-jobcard/workorders/:id', element: <SrsJobCardWorkOrders /> },
      {
        path: '/production/srs-jobcard/workorder/create/:jobCardId',
        element: <CreateSrsWorkOrder />,
      },
      { path: '/production/srs-jobcard/workorder/view/:jobCardId', element: <ViewSrsWorkOrders /> },
      { path: '/production/inventory', element: <ProductInventory /> },
      { path: '/production/dept-management', element: <Users /> },
      { path: '/production/dept-management/create', element: <AddUser /> },
      { path: '/production/dept-management/edit/:id', element: <EditUser /> },

      // Product Master Routes
      { path: '/production/productmaster', element: <IndexUpdate /> },
      { path: '/production/productmaster/create', element: <ProductCreation /> },
      { path: '/production/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/production/productmaster/edit/:id', element: <EditProduct /> },

      // production/purchaseindent
      { path: '/production/purchaseindent', element: <PurchaseIndent /> },
      { path: '/production/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/production/quality-reports', element: <QualityReports /> },

      // Stocks Routes
      { path: '/production/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/production/employee-performance', element: <Navigate to="/production/employee-performance/chart" /> },
      { path: '/production/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/production/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/production/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/production/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/production/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/production/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/production/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/production/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/production/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/production/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default productionRoutes;
