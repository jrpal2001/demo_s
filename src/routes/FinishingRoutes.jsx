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

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const finishingRoutes = [
  // Add route for root path to redirect to finishing dashboard
  { path: '/', element: <Navigate to="/finishing/dashboard" /> },
  {
    path: '/finishing',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/finishing', element: <Navigate to="/finishing/dashboard" /> },
      { path: '/finishing/dashboard', element: <Dashboard /> },
      { path: '/finishing/indent', element: <PurchaseIndent /> },
      { path: '/finishing/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/finishing/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/finishing/inward', element: <InwardMaterialAll /> },
      { path: '/finishing/inward/create', element: <CreateMaterialInward /> },
      { path: '/finishing/inward/:id', element: <ViewMaterialInward /> },
      { path: '/finishing/outward', element: <OutwardManagement /> },
      { path: '/finishing/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/finishing/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/finishing/job-cards', element: <JobCards /> },
      { path: '/finishing/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/finishing/job-cards/create', element: <CreateJobCard /> },
      { path: '/finishing/job-cards/edit/:id', element: <EditJobCard /> },
      { path: '/finishing/inventory', element: <ProductInventory /> },
      { path: '/finishing/dept-management', element: <Users /> },
      { path: '/finishing/dept-management/create', element: <AddUser /> },
      { path: '/finishing/dept-management/edit/:id', element: <EditUser /> },

      // Product Master Routes
      { path: '/finishing/productmaster', element: <IndexUpdate /> },
      { path: '/finishing/productmaster/create', element: <ProductCreation /> },
      { path: '/finishing/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/finishing/productmaster/edit/:id', element: <EditProduct /> },

      // /finishing/purchaseindent
      { path: '/finishing/purchaseindent', element: <PurchaseIndent /> },
      { path: '/finishing/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/finishing/quality-reports', element: <QualityReports /> },

      // Employee Performance Routes
      { path: '/finishing/employee-performance', element: <Navigate to="/finishing/employee-performance/chart" /> },
      { path: '/finishing/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/finishing/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/finishing/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/finishing/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/finishing/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/finishing/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/finishing/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/finishing/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/finishing/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/finishing/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default finishingRoutes;
