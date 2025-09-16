import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import Vendor from '@/pages/superAdmin/vendor';
import AddVendor from '@/pages/superAdmin/vendor/AddVendor';
import EditVendor from '@/pages/superAdmin/vendor/EditVendor';
import ViewVendor from '@/pages/superAdmin/vendor/ViewVendor';
import AllOrders from '@/pages/order/AllOrders';
import CreateOrderPage from '@/pages/order/OrderCreation';
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
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const ordermanagementRoutes = [
  // Add route for root path to redirect to ordermanagement dashboard
  { path: '/', element: <Navigate to="/ordermanagement/dashboard" /> },
  {
    path: '/ordermanagement',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/ordermanagement', element: <Navigate to="/ordermanagement/dashboard" /> },
      { path: '/ordermanagement/dashboard', element: <Dashboard /> },
      { path: '/ordermanagement/inventory', element: <ProductInventory /> },
      { path: '/ordermanagement/vendor', element: <Vendor /> },
      { path: '/ordermanagement/vendor/:id', element: <ViewVendor /> },
      { path: '/ordermanagement/vendor/create', element: <AddVendor /> },
      { path: '/ordermanagement/vendor/edit/:id', element: <EditVendor /> },
      { path: '/ordermanagement/orders', element: <AllOrders /> },
      { path: '/ordermanagement/orders/create', element: <CreateOrderPage /> },

      // Product Master Routes
      { path: '/ordermanagement/productmaster', element: <IndexUpdate /> },
      { path: '/ordermanagement/productmaster/create', element: <ProductCreation /> },
      { path: '/ordermanagement/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/ordermanagement/productmaster/edit/:id', element: <EditProduct /> },

      // ordermanagement/purchaseindent
      { path: '/ordermanagement/purchaseindent', element: <PurchaseIndent /> },
      { path: '/ordermanagement/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Stocks Routes
      { path: '/ordermanagement/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/ordermanagement/employee-performance', element: <Navigate to="/ordermanagement/employee-performance/chart" /> },
      { path: '/ordermanagement/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/ordermanagement/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/ordermanagement/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/ordermanagement/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/ordermanagement/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/ordermanagement/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/ordermanagement/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/ordermanagement/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/ordermanagement/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/ordermanagement/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default ordermanagementRoutes;
