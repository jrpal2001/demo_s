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
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import InventoryView from '@/pages/inventorylot/inventoryView';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const trimsAndMachinePartsStoreRoutes = [
  // Add route for root path to redirect to trimsandmachinepartsstore dashboard
  { path: '/', element: <Navigate to="/trimsandmachinepartsstore/dashboard" /> },
  {
    path: '/trimsandmachinepartsstore',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      {
        path: '/trimsandmachinepartsstore',
        element: <Navigate to="/trimsandmachinepartsstore/dashboard" />,
      },
      { path: '/trimsandmachinepartsstore/dashboard', element: <Dashboard /> },
      { path: '/trimsandmachinepartsstore/indent', element: <PurchaseIndent /> },
      { path: '/trimsandmachinepartsstore/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/trimsandmachinepartsstore/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/trimsandmachinepartsstore/material-inward', element: <InwardMaterialAll /> },
      { path: '/trimsandmachinepartsstore/material-inward/create', element: <CreateMaterialInward /> },
      { path: '/trimsandmachinepartsstore/material-inward/:id', element: <ViewMaterialInward /> },
      { path: '/trimsandmachinepartsstore/outward', element: <OutwardManagement /> },
      {
        path: '/trimsandmachinepartsstore/outward/view/:department/:id',
        element: <OutwardDetails />,
      },
      {
        path: '/trimsandmachinepartsstore/outward/edit/:department/:id',
        element: <UpdateOutward />,
      },
      { path: '/trimsandmachinepartsstore/inventory', element: <ProductInventory /> },
      { path: '/trimsandmachinepartsstore/inventory/create', element: <CreateInventory /> },
      { path: '/trimsandmachinepartsstore/inventory/:department/:id', element: <InventoryView /> },
      { path: '/trimsandmachinepartsstore/inventory/edit/:department/:id', element: <InventoryEdit /> },
      { path: '/trimsandmachinepartsstore/inventory/lots/:department/:inventoryId', element: <ViewLotDetails /> },
      { path: '/trimsandmachinepartsstore/category', element: <BOM /> },
      { path: '/trimsandmachinepartsstore/category/create', element: <CreateBom /> },
      { path: '/trimsandmachinepartsstore/category/edit/:id', element: <EditBom /> },

      // Product Master Routes
      { path: '/trimsandmachinepartsstore/productmaster', element: <IndexUpdate /> },
      { path: '/trimsandmachinepartsstore/productmaster/create', element: <ProductCreation /> },
      { path: '/trimsandmachinepartsstore/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/trimsandmachinepartsstore/productmaster/edit/:id', element: <EditProduct /> },

      // trimsandmachinepartsstore/purchaseindent
      { path: '/trimsandmachinepartsstore/purchaseindent', element: <PurchaseIndent /> },
      { path: '/trimsandmachinepartsstore/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/trimsandmachinepartsstore/quality-reports', element: <QualityReports /> },

      // Employee Performance Routes
      { path: '/trimsandmachinepartsstore/employee-performance', element: <Navigate to="/trimsandmachinepartsstore/employee-performance/chart" /> },
      { path: '/trimsandmachinepartsstore/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/trimsandmachinepartsstore/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/trimsandmachinepartsstore/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/trimsandmachinepartsstore/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/trimsandmachinepartsstore/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/trimsandmachinepartsstore/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/trimsandmachinepartsstore/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/trimsandmachinepartsstore/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/trimsandmachinepartsstore/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/trimsandmachinepartsstore/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default trimsAndMachinePartsStoreRoutes;
