import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import CreateMaterialInward from '@/pages/superAdmin/inwardmaterial/CreateInwardMaterial';
import ViewMaterialInward from '@/pages/superAdmin/inwardmaterial/ViewMaterialInwardByID';
import InwardMaterialAll from '@/pages/superAdmin/inwardmaterial/ViewInwardMaterials';
import CreateStockInward from '@/pages/superAdmin/stockInward/CreateStockInward';
import ViewStockInward from '../pages/superAdmin/stockInward/ViewStockInward';
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

const fgstoreInwardRoutes = [
  // Add route for root path to redirect to fgstoreinward dashboard
  { path: '/', element: <Navigate to="/fgstoreinward/dashboard" /> },
  {
    path: '/fgstoreinward',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/fgstoreinward', element: <Navigate to="/fgstoreinward/dashboard" /> },
      { path: '/fgstoreinward/dashboard', element: <Dashboard /> },
      { path: '/fgstoreinward/inward', element: <InwardMaterialAll /> },
      { path: '/fgstoreinward/inward/create', element: <CreateMaterialInward /> },
      { path: '/fgstoreinward/inward/:id', element: <ViewMaterialInward /> },
      { path: '/fgstoreinward/stockinward', element: <InwardMaterialAll /> },
      { path: '/fgstoreinward/stockinward/create', element: <CreateStockInward /> },
      { path: '/fgstoreinward/stockinward/:id', element: <ViewStockInward /> },
      { path: '/fgstoreinward/inventory', element: <ProductInventory /> },

      // Product Master Routes
      { path: '/fgstoreinward/productmaster', element: <IndexUpdate /> },
      { path: '/fgstoreinward/productmaster/create', element: <ProductCreation /> },
      { path: '/fgstoreinward/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/fgstoreinward/productmaster/edit/:id', element: <EditProduct /> },

      // fgstoreinward/purchaseindent
      { path: '/fgstoreinward/purchaseindent', element: <PurchaseIndent /> },
      { path: '/fgstoreinward/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/fgstoreinward/quality-reports', element: <QualityReports /> },

      // Fg Store Routes
      { path: '/fgstoreinward/fgstore', element: <FgStoreIndex /> },

      // Stocks Routes
      { path: '/fgstoreinward/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/fgstoreinward/employee-performance', element: <Navigate to="/fgstoreinward/employee-performance/chart" /> },
      { path: '/fgstoreinward/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/fgstoreinward/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/fgstoreinward/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/fgstoreinward/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/fgstoreinward/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/fgstoreinward/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/fgstoreinward/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/fgstoreinward/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/fgstoreinward/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/fgstoreinward/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default fgstoreInwardRoutes;
