import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';

// Product Master
import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';

// Job Cards
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';
import WorkflowDetails from '@/pages/jobcards/workflow/WorkFlowDetails';
import CreateWorkOrder from '@/pages/jobcards/workorder/CreateWorkorder';
import WorkOrders from '@/pages/jobcards/workorder/ViewAllWorkorders';
import ViewWorkOrderDetails from '@/pages/jobcards/workorder/ViewWorkorderDetails';
import WorkorderDepartmentPage from '@/pages/jobcards/workorder/WorkorderDepartmentPage';
import ReturnGoods from '@/pages/jobcards/workorder/ReturnGoods';
import TimingPage from '@/pages/jobcards/workflow/TimingPage';

// Quality Reports
import QualityReports from '@/pages/quality/QualityReports';

// Employee Performance
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';

// Inventory
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import InventoryView from '@/pages/inventorylot/inventoryView';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';

// Material Management
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';
import CreateMaterialInward from '@/pages/superAdmin/inwardmaterial/CreateInwardMaterial';
import ViewMaterialInward from '@/pages/superAdmin/inwardmaterial/ViewMaterialInwardByID';
import InwardMaterialAll from '@/pages/superAdmin/inwardmaterial/ViewInwardMaterials';
import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';

// User Management
import Users from '@/pages/superAdmin/users';
import AddUser from '@/pages/superAdmin/users/addUser';
import EditUser from '@/pages/superAdmin/users/editUser';

// Error
import Error from '@/pages/error/Error';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const cuttingRoutes = [
  // Add route for root path to redirect to cutting dashboard
  { path: '/', element: <Navigate to="/cutting/dashboard" /> },
  {
    path: '/cutting',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/cutting', element: <Navigate to="/cutting/dashboard" /> },
      { path: '/cutting/dashboard', element: <Dashboard /> },

      // Product Master Routes
      { path: '/cutting/productmaster', element: <IndexUpdate /> },
      { path: '/cutting/productmaster/create', element: <ProductCreation /> },
      { path: '/cutting/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/cutting/productmaster/edit/:id', element: <EditProduct /> },

      // /cutting/purchaseindent
      { path: '/cutting/purchaseindent', element: <PurchaseIndent /> },
      { path: '/cutting/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Job Cards Routes
      { path: '/cutting/job-cards', element: <JobCards /> },
      { path: '/cutting/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/cutting/job-cards/create', element: <CreateJobCard /> },
      { path: '/cutting/job-cards/edit/:id', element: <EditJobCard /> },
      { path: '/cutting/job-card/workorder/:jobCardId', element: <CreateWorkOrder /> },
      { path: '/cutting/job-card/workorder/:jobCardId/view', element: <WorkOrders /> },
      { path: '/cutting/job-card/workorder/return-goods/:workOrderId', element: <ReturnGoods /> },
      {
        path: '/cutting/job-card/workorder/:jobCardId/view/:workOrderId',
        element: <ViewWorkOrderDetails />,
      },
      {
        path: '/cutting/job-card/workorder/:workOrderId/department/:department',
        element: <WorkorderDepartmentPage />,
      },
      { path: '/cutting/work-flow/:workorderId', element: <WorkflowDetails /> },
      { path: '/cutting/work-flow/:workorderId/update', element: <TimingPage /> },

      // Quality Reports Routes
      { path: '/cutting/quality-reports', element: <QualityReports /> },

      // Employee Performance Routes
      { path: '/cutting/employee-performance', element: <Navigate to="/cutting/employee-performance/chart" /> },
      { path: '/cutting/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/cutting/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/cutting/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      {
        path: '/cutting/employee-performance/daily-work-report/list',
        element: <DailyWorkReportList />,
      },
      { path: '/cutting/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      {
        path: '/cutting/employee-performance/daily-work-report/create',
        element: <DailyWorkReport />,
      },
      {
        path: '/cutting/employee-performance/chart/view/:id',
        element: <EmployeePerformanceChartView />,
      },
      {
        path: '/cutting/employee-performance/chart/edit/:id',
        element: <EmployeePerformanceChartEdit />,
      },
      {
        path: '/cutting/employee-performance/daily-work-report/view/:id',
        element: <DailyWorkReportView />,
      },
      {
        path: '/cutting/employee-performance/daily-work-report/edit/:id',
        element: <DailyWorkReportEdit />,
      },

      // Inventory Routes
      { path: '/cutting/inventory', element: <ProductInventory /> },
      { path: '/cutting/inventory/create', element: <CreateInventory /> },
      { path: '/cutting/inventory/lots/:department/:inventoryId', element: <ViewLotDetails /> },
      { path: `/cutting/inventory/:department/:id`, element: <InventoryView /> },
      { path: '/cutting/inventory/edit/:department/:id', element: <InventoryEdit /> },

      // Material Management Routes
      // { path: '/cutting/indent', element: <PurchaseIndent /> },
      // { path: '/cutting/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/cutting/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/cutting/inward', element: <InwardMaterialAll /> },
      { path: '/cutting/inward/create', element: <CreateMaterialInward /> },
      { path: '/cutting/inward/:id', element: <ViewMaterialInward /> },
      { path: '/cutting/outward', element: <OutwardManagement /> },
      { path: '/cutting/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/cutting/outward/edit/:department/:id', element: <UpdateOutward /> },

      // Department Management Routes
      { path: '/cutting/department-management', element: <Users /> },
      { path: '/cutting/department-management/create', element: <AddUser /> },
      { path: '/cutting/department-management/edit/:id', element: <EditUser /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default cuttingRoutes;
