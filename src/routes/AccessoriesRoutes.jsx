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
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import BOM from '@/pages/superAdmin/bom';
import CreateBom from '@/pages/superAdmin/bom/CreateBom';
import EditBom from '@/pages/superAdmin/bom/EditBom';
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

const accessoriesRoutes = [
  // Add route for root path to redirect to accessories dashboard
  { path: '/', element: <Navigate to="/accessories/dashboard" /> },
  {
    path: '/accessories',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/accessories', element: <Navigate to="/accessories/dashboard" /> },
      { path: '/accessories/dashboard', element: <Dashboard /> },

      { path: '/accessories/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/accessories/material-inward', element: <InwardMaterialAll /> },
      { path: '/accessories/material-inward/create', element: <CreateMaterialInward /> },
      { path: '/accessories/material-inward/:id', element: <ViewMaterialInward /> },
      { path: '/accessories/outward', element: <OutwardManagement /> },
      { path: '/accessories/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/accessories/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/accessories/inventory', element: <ProductInventory /> },
      { path: '/accessories/category', element: <BOM /> },
      { path: '/accessories/category/create', element: <CreateBom /> },
      { path: '/accessories/category/edit/:id', element: <EditBom /> },

      // Product Master Routes
      { path: '/accessories/productmaster', element: <IndexUpdate /> },
      { path: '/accessories/productmaster/create', element: <ProductCreation /> },
      { path: '/accessories/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/accessories/productmaster/edit/:id', element: <EditProduct /> },

      // Quality Reports Routes
      { path: '/accessories/quality-reports', element: <QualityReports /> },

      // accessories/purchaseindent
      { path: '/accessories/purchaseindent', element: <PurchaseIndent /> },
      { path: '/accessories/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Employee Performance Routes
      { path: '/accessories/employee-performance', element: <Navigate to="/accessories/employee-performance/chart" /> },
      { path: '/accessories/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/accessories/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/accessories/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/accessories/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/accessories/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/accessories/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/accessories/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/accessories/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/accessories/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/accessories/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default accessoriesRoutes;
