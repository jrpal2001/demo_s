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

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const partsProductionRoutes = [
  // Add route for root path to redirect to partsproduction dashboard
  { path: '/', element: <Navigate to="/partsproduction/dashboard" /> },
  {
    path: '/partsproduction',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/partsproduction', element: <Navigate to="/partsproduction/dashboard" /> },
      { path: '/partsproduction/dashboard', element: <Dashboard /> },
      { path: '/partsproduction/indent', element: <PurchaseIndent /> },
      { path: '/partsproduction/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/partsproduction/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/partsproduction/inward', element: <InwardMaterialAll /> },
      { path: '/partsproduction/inward/create', element: <CreateMaterialInward /> },
      { path: '/partsproduction/inward/:id', element: <ViewMaterialInward /> },
      { path: '/partsproduction/outward', element: <OutwardManagement /> },
      { path: '/partsproduction/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/partsproduction/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/partsproduction/job-cards', element: <JobCards /> },
      { path: '/partsproduction/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/partsproduction/job-cards/create', element: <CreateJobCard /> },
      { path: '/partsproduction/job-cards/edit/:id', element: <EditJobCard /> },

      // SRS Job Card routes
      { path: '/partsproduction/srs-jobcard', element: <SrsJobCards /> },
      { path: '/partsproduction/srs-jobcard/view/:id', element: <ViewSrsJobCard /> },
      { path: '/partsproduction/srs-jobcard/create', element: <CreateSrsJobCard /> },
      { path: '/partsproduction/srs-jobcard/edit/:id', element: <EditSrsJobCard /> },
      { path: '/partsproduction/srs-jobcard/workorders/:id', element: <SrsJobCardWorkOrders /> },
      {
        path: '/partsproduction/srs-jobcard/workorder/create/:jobCardId',
        element: <CreateSrsWorkOrder />,
      },
      {
        path: '/partsproduction/srs-jobcard/workorder/view/:jobCardId',
        element: <ViewSrsWorkOrders />,
      },
      { path: '/partsproduction/inventory', element: <ProductInventory /> },
      { path: '/partsproduction/dept-management', element: <Users /> },
      { path: '/partsproduction/dept-management/create', element: <AddUser /> },
      { path: '/partsproduction/dept-management/edit/:id', element: <EditUser /> },

      // Product Master Routes
      { path: '/partsproduction/productmaster', element: <IndexUpdate /> },
      { path: '/partsproduction/productmaster/create', element: <ProductCreation /> },
      { path: '/partsproduction/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/partsproduction/productmaster/edit/:id', element: <EditProduct /> },

      // partsproduction/purchaseindent
      { path: '/partsproduction/purchaseindent', element: <PurchaseIndent /> },
      { path: '/partsproduction/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/partsproduction/quality-reports', element: <QualityReports /> },

      // Employee Performance Routes
      { path: '/partsproduction/employee-performance', element: <Navigate to="/partsproduction/employee-performance/chart" /> },
      { path: '/partsproduction/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/partsproduction/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/partsproduction/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/partsproduction/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/partsproduction/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/partsproduction/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/partsproduction/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/partsproduction/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/partsproduction/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/partsproduction/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default partsProductionRoutes;
