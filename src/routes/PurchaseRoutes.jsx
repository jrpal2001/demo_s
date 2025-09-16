import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';
import PurchaseOrder from '@/pages/superAdmin/purchaseorder';
import CreatePurchaseOrder from '@/pages/superAdmin/purchaseorder/CreatePurchaseOrder';
import EditPurchaseOrder from '@/pages/superAdmin/purchaseorder/EditPurchaseOrder';
import ViewPurchaseOrder from '@/pages/superAdmin/purchaseorder/ViewPurchaseOrder';
import Vendor from '@/pages/superAdmin/vendor';
import AddVendor from '@/pages/superAdmin/vendor/AddVendor';
import EditVendor from '@/pages/superAdmin/vendor/EditVendor';
import ViewVendor from '@/pages/superAdmin/vendor/ViewVendor';
import InwardMaterialsQc from '@/pages/superAdmin/inwardmaterialqc';
import CreateInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/CreateInwardMaterialQc';
import EditInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/EditInwardMaterialQc';
import ViewInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/ViewInwardMaterialQc';
import Error from '@/pages/error/Error';
import BOM from '@/pages/superAdmin/bom';

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
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import InventoryView from '@/pages/inventorylot/inventoryView';
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';
import AssetManagement from '@/components/assetmanagement/Assetmanagement';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const purchaseRoutes = [
  // Add route for root path to redirect to purchase dashboard
  { path: '/', element: <Navigate to="/purchase/dashboard" /> },
  {
    path: '/purchase',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/purchase', element: <Navigate to="/purchase/dashboard" /> },
      { path: '/purchase/dashboard', element: <Dashboard /> },

      { path: '/purchase/bom', element: <BOM /> },

      { path: '/purchase/purchaseindent', element: <PurchaseIndent /> },
      { path: '/purchase/purchaseindent/create', element: <PurchaseIndentCreate /> },
      { path: '/purchase/purchaseindent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/purchase/purchaseorder', element: <PurchaseOrder /> },
      { path: '/purchase/purchaseorder/create', element: <CreatePurchaseOrder /> },
      { path: '/purchase/purchaseorder/:id', element: <ViewPurchaseOrder /> },
      { path: '/purchase/purchaseorder/edit/:id', element: <EditPurchaseOrder /> },
      { path: '/purchase/vendor', element: <Vendor /> },
      { path: '/purchase/vendor/:id', element: <ViewVendor /> },
      { path: '/purchase/vendor/create', element: <AddVendor /> },
      { path: '/purchase/vendor/edit/:id', element: <EditVendor /> },
      { path: '/purchase/grn', element: <InwardMaterialsQc /> },
      { path: '/purchase/grn/:id', element: <ViewInwardMaterialQc /> },
      { path: '/purchase/grn/create', element: <CreateInwardMaterialQc /> },
      { path: '/purchase/grn/edit/:id', element: <EditInwardMaterialQc /> },
      { path: '/purchase/payment', element: <InwardMaterialsQc /> },

      // Product Master Routes
      { path: '/purchase/productmaster', element: <IndexUpdate /> },
      { path: '/purchase/productmaster/create', element: <ProductCreation /> },
      { path: '/purchase/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/purchase/productmaster/edit/:id', element: <EditProduct /> },

      // Inventory Routes
      { path: '/purchase/inventory', element: <ProductInventory /> },
      { path: '/purchase/inventory/create', element: <CreateInventory /> },
      { path: '/purchase/inventory/lots/:department/:inventoryId', element: <ViewLotDetails /> },
      { path: '/purchase/inventory/:department/:id', element: <InventoryView /> },
      { path: '/purchase/inventory/edit/:department/:id', element: <InventoryEdit /> },

      // Quality Reports Routes
      { path: '/purchase/quality-reports', element: <QualityReports /> },

      // Stocks Routes
      { path: '/purchase/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/purchase/employee-performance', element: <Navigate to="/purchase/employee-performance/chart" /> },
      { path: '/purchase/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/purchase/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/purchase/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/purchase/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/purchase/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/purchase/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/purchase/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/purchase/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/purchase/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/purchase/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      // Asset Management Routes
      { path: '/purchase/assetmanagement', element: <AssetManagement /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default purchaseRoutes;
