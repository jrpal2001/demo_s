import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';
import CreateStockOutward from '@/pages/superAdmin/stockOutward/CreateStockOutward';
import StockOutward from '@/pages/superAdmin/stockOutward/StockOutward';
import ViewStockOutward from '@/pages/superAdmin/stockOutward/ViewStockOutward';
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
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
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const fgstoreOutwardRoutes = [
  // Add route for root path to redirect to fgstoreoutward dashboard
  { path: '/', element: <Navigate to="/fgstoreoutward/dashboard" /> },
  {
    path: '/fgstoreoutward',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/fgstoreoutward', element: <Navigate to="/fgstoreoutward/dashboard" /> },
      { path: '/fgstoreoutward/dashboard', element: <Dashboard /> },
      { path: '/fgstoreoutward/outward', element: <OutwardManagement /> },
      { path: '/fgstoreoutward/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/fgstoreoutward/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/fgstoreoutward/stockoutward', element: <StockOutward /> },
      { path: '/fgstoreoutward/stockoutward/create', element: <CreateStockOutward /> },
      { path: '/fgstoreoutward/stockoutward/:id', element: <ViewStockOutward /> },
      { path: '/fgstoreoutward/inventory', element: <ProductInventory /> },

      // purchaseindet
      { path: '/fgstoreoutward/purchaseindent', element: <PurchaseIndent /> },
      { path: '/fgstoreoutward/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Product Master Routes
      { path: '/fgstoreoutward/productmaster', element: <IndexUpdate /> },
      { path: '/fgstoreoutward/productmaster/create', element: <ProductCreation /> },
      { path: '/fgstoreoutward/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/fgstoreoutward/productmaster/edit/:id', element: <EditProduct /> },

      // Quality Reports Routes
      { path: '/fgstoreoutward/quality-reports', element: <QualityReports /> },

      // Fg Store Routes
      { path: '/fgstoreoutward/fgstore', element: <FgStoreIndex /> },

      // Stocks Routes
      { path: '/fgstoreoutward/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/fgstoreoutward/employee-performance', element: <Navigate to="/fgstoreoutward/employee-performance/chart" /> },
      { path: '/fgstoreoutward/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/fgstoreoutward/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/fgstoreoutward/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/fgstoreoutward/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/fgstoreoutward/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/fgstoreoutward/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/fgstoreoutward/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/fgstoreoutward/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/fgstoreoutward/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/fgstoreoutward/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default fgstoreOutwardRoutes;
