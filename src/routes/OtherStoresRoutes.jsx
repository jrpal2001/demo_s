import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import CreateOtherStoreInward from '@/pages/superAdmin/otherstores/createOtherstoresInward';
import ViewOtherStoreInward from '@/pages/superAdmin/otherstores/viewOtherstoreInward';
import OtherStoreInwardAll from '@/pages/superAdmin/otherstores/otherstoresInwardAll';
import OtherStoreInventory from '@/pages/superAdmin/otherstores/otherstoresInventoryAll';
import OtherStoreInventoryView from '@/pages/superAdmin/otherstores/otherstoresInventoryView';
import OtherStoreInventoryEdit from '@/pages/superAdmin/otherstores/otherstoresInventoryEdit';
import OtherStoreLotDetails from '@/pages/superAdmin/otherstores/otherstoresLotDetails';
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

const otherStoresRoutes = [
  // Add route for root path to redirect to otherstores dashboard
  { path: '/', element: <Navigate to="/otherstores/dashboard" /> },
  {
    path: '/otherstores',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/otherstores', element: <Navigate to="/otherstores/dashboard" /> },
      { path: '/otherstores/dashboard', element: <Dashboard /> },
      { path: '/otherstores/inward', element: <OtherStoreInwardAll /> },
      { path: '/otherstores/inward/create', element: <CreateOtherStoreInward /> },
      { path: '/otherstores/inward/:id', element: <ViewOtherStoreInward /> },
      { path: '/otherstores/inventory', element: <OtherStoreInventory /> },
      { path: '/otherstores/inventory/:itemType/:id', element: <OtherStoreInventoryView /> },
      { path: '/otherstores/inventory/edit/:itemType/:id', element: <OtherStoreInventoryEdit /> },
      {
        path: '/otherstores/inventory/lots/:itemType/:inventoryId',
        element: <OtherStoreLotDetails />,
      },

      // Quality Reports Routes
      { path: '/otherstores/quality-reports', element: <QualityReports /> },

      // otherstores/purchaseindent
      { path: '/otherstores/purchaseindent', element: <PurchaseIndent /> },
      { path: '/otherstores/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Employee Performance Routes
      { path: '/otherstores/employee-performance', element: <Navigate to="/otherstores/employee-performance/chart" /> },
      { path: '/otherstores/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/otherstores/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/otherstores/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/otherstores/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/otherstores/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/otherstores/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/otherstores/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/otherstores/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/otherstores/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/otherstores/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      // Other Stores Routes
      { path: '/otherstores/otherstores', element: <AssetManagement /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default otherStoresRoutes;
