import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import CreateMaintenanceInward from '@/pages/superAdmin/maintenance/createMaintenanceInward';
import ViewMaintenanceInward from '@/pages/superAdmin/maintenance/viewmaintenanceInward';
import MaintenanceInwardAll from '@/pages/superAdmin/maintenance/maintenanceInwardAll';
import MaintenanceInventory from '@/pages/superAdmin/maintenance/maintenanceInventory';
import MaintenanceInventoryEdit from '@/pages/superAdmin/maintenance/maintenanceInventoryEdit';
import MaintenanceInventoryView from '@/pages/superAdmin/maintenance/maintenanceInventoryView';
import MaintenanceLotDetails from '@/pages/superAdmin/maintenance/maintenanceLotDetails';
import Error from '@/pages/error/Error';

// Additional imports for missing routes
import QualityReports from '@/pages/quality/QualityReports';
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';
import AssetManagement from '@/components/assetmanagement/Assetmanagement';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const maintenanceRoutes = [
  // Add route for root path to redirect to maintenance dashboard
  { path: '/', element: <Navigate to="/maintenance/dashboard" /> },
  {
    path: '/maintenance',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/maintenance', element: <Navigate to="/maintenance/dashboard" /> },
      { path: '/maintenance/dashboard', element: <Dashboard /> },
      { path: '/maintenance/inward', element: <MaintenanceInwardAll /> },
      { path: '/maintenance/inward/create', element: <CreateMaintenanceInward /> },
      { path: '/maintenance/inward/:id', element: <ViewMaintenanceInward /> },
      { path: '/maintenance/inventory', element: <MaintenanceInventory /> },
      {
        path: '/maintenance/inventory/:maintenanceType/:id',
        element: <MaintenanceInventoryView />,
      },
      {
        path: '/maintenance/inventory/edit/:maintenanceType/:id',
        element: <MaintenanceInventoryEdit />,
      },
      {
        path: '/maintenance/inventory/lots/:maintenanceType/:inventoryId',
        element: <MaintenanceLotDetails />,
      },

      // Quality Reports Routes
      { path: '/maintenance/quality-reports', element: <QualityReports /> },

      // maintenance/purchaseindent
      { path: '/maintenance/purchaseindent', element: <PurchaseIndent /> },
      { path: '/maintenance/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Employee Performance Routes
      { path: '/maintenance/employee-performance', element: <Navigate to="/maintenance/employee-performance/chart" /> },
      { path: '/maintenance/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/maintenance/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/maintenance/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/maintenance/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/maintenance/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/maintenance/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/maintenance/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/maintenance/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/maintenance/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/maintenance/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      // Maintenance Routes
      { path: '/maintenance/maintenance', element: <AssetManagement /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default maintenanceRoutes;
