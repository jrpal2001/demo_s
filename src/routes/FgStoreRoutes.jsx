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
import FgStoreIndex from '@/pages/superAdmin/fgstore/FgstoreIndex';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const fgstoreRoutes = [
  // Add route for root path to redirect to fgstore dashboard
  { path: '/', element: <Navigate to="/fgstore/dashboard" /> },
  {
    path: '/fgstore',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/fgstore', element: <Navigate to="/fgstore/dashboard" /> },
      { path: '/fgstore/dashboard', element: <Dashboard /> },
      { path: '/fgstore/indent', element: <PurchaseIndent /> },
      { path: '/fgstore/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/fgstore/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/fgstore/inward', element: <InwardMaterialAll /> },
      { path: '/fgstore/inward/create', element: <CreateMaterialInward /> },
      { path: '/fgstore/inward/:id', element: <ViewMaterialInward /> },
      { path: '/fgstore/outward', element: <OutwardManagement /> },
      { path: '/fgstore/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/fgstore/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/fgstore/job-cards', element: <JobCards /> },
      { path: '/fgstore/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/fgstore/job-cards/create', element: <CreateJobCard /> },
      { path: '/fgstore/job-cards/edit/:id', element: <EditJobCard /> },
      { path: '/fgstore/inventory', element: <ProductInventory /> },
      { path: '/fgstore/dept-user', element: <Users /> },
      { path: '/fgstore/dept-user/create', element: <AddUser /> },
      { path: '/fgstore/dept-user/edit/:id', element: <EditUser /> },

      // Product Master Routes
      { path: '/fgstore/productmaster', element: <IndexUpdate /> },
      { path: '/fgstore/productmaster/create', element: <ProductCreation /> },
      { path: '/fgstore/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/fgstore/productmaster/edit/:id', element: <EditProduct /> },

      // /fgstore/purchaseindent
      { path: '/fgstore/purchaseindent', element: <PurchaseIndent /> },
      { path: '/fgstore/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/fgstore/quality-reports', element: <QualityReports /> },

      // Fg Store Routes
      { path: '/fgstore/fgstore', element: <FgStoreIndex /> },

      // Stocks Routes
      { path: '/fgstore/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/fgstore/employee-performance', element: <Navigate to="/fgstore/employee-performance/chart" /> },
      { path: '/fgstore/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/fgstore/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/fgstore/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/fgstore/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/fgstore/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/fgstore/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/fgstore/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/fgstore/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/fgstore/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/fgstore/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default fgstoreRoutes;
