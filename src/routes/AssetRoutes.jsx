import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import Assetmanagement from '@/components/assetmanagement/Assetmanagement';
import ViewAssetmanagement from '@/components/assetmanagement/viewAssetmanagement';
import ViewOneassetmanagement from '@/components/assetmanagement/viewOneassetmanagement';
import AssetIndent from '@/components/assetIndent/assetindent';
import Assetindentcreate from '@/components/assetIndent/assetindentcreate';
import EditAssesIndent from '@/components/assetIndent/editAssesIndent';
import Assetvendor from '@/components/assetvendor/assetvendor';
import AssetvendorCreate from '@/components/assetvendor/assetvendorCreate';
import AssetVendorView from '@/components/assetvendor/assetvendorview';
import AssetVendoredit from '@/components/assetvendor/assetVendoredit';
import AssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrder';
import AssetPurchaseOrderCreate from '@/components/assetPurchaseOrder/assetPurchaseOrderCreate';
import ViewAssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrderView';
import EditAssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrderEdit';
import CreateAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/createassetmaterialinwardqc';
import ViewAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/viewassetmaterialinwardqc';
import AssetMaterialInwardQcAll from '@/pages/superAdmin/assetmaterialinwardqc/assetmaterialinwardqc';
import CreateAssetInward from '@/pages/superAdmin/assetinward/createassetInward';
import ViewAssetInward from '@/pages/superAdmin/assetinward/viewAssetInward';
import AssetInwardAll from '@/pages/superAdmin/assetinward/assetinward';
import AssetInventory from '@/pages/superAdmin/assetinventory/assetInventory';
import AssetInventoryEdit from '@/pages/superAdmin/assetinventory/assetInventoryEdit';
import AssetInventoryView from '@/pages/superAdmin/assetinventory/assetInventoryView';
import AssetLotDetails from '@/pages/superAdmin/assetinventory/assetLotDetails';
import NewOutwardManagement from '@/pages/superAdmin/assetoutward/outwardManagement';
import NewOutwardDetails from '@/pages/superAdmin/assetoutward/outwardDetails';
import UpdateNewOutward from '@/pages/superAdmin/assetoutward/updateOutward';
import CreateNewOutward from '@/pages/superAdmin/assetoutward/createAssetoutward';
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
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const assetRoutes = [
  // Add route for root path to redirect to asset dashboard
  { path: '/', element: <Navigate to="/asset/dashboard" /> },
  {
    path: '/asset',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/asset', element: <Navigate to="/asset/dashboard" /> },
      { path: '/asset/dashboard', element: <Dashboard /> },
      { path: '/asset/assetmanagement', element: <Assetmanagement /> },
      { path: '/asset/management', element: <Assetmanagement /> },
      { path: '/asset/management/view', element: <ViewAssetmanagement /> },
      { path: '/asset/management/view/:id', element: <ViewOneassetmanagement /> },
      { path: '/asset/indent', element: <AssetIndent /> },
      { path: '/asset/indent/create', element: <Assetindentcreate /> },
      { path: '/asset/indent/edit/:id', element: <EditAssesIndent /> },
      { path: '/asset/vendor', element: <Assetvendor /> },
      { path: '/asset/vendor/create', element: <AssetvendorCreate /> },
      { path: '/asset/vendor/view/:id', element: <AssetVendorView /> },
      { path: '/asset/vendor/edit/:id', element: <AssetVendoredit /> },
      { path: '/asset/purchaseorder', element: <AssetPurchaseOrder /> },
      { path: '/asset/purchaseorder/create', element: <AssetPurchaseOrderCreate /> },
      { path: '/asset/purchaseorder/view/:id', element: <ViewAssetPurchaseOrder /> },
      { path: '/asset/purchaseorder/edit/:id', element: <EditAssetPurchaseOrder /> },
      { path: '/asset/material-inward-qc', element: <AssetMaterialInwardQcAll /> },
      { path: '/asset/material-inward-qc/create', element: <CreateAssetMaterialInwardQc /> },
      { path: '/asset/material-inward-qc/:id', element: <ViewAssetMaterialInwardQc /> },
      { path: '/asset/inward', element: <AssetInwardAll /> },
      { path: '/asset/inward/create', element: <CreateAssetInward /> },
      { path: '/asset/inward/:id', element: <ViewAssetInward /> },
      { path: '/asset/inventory', element: <AssetInventory /> },
      { path: '/asset/inventory/:assetType/:id', element: <AssetInventoryView /> },
      { path: '/asset/inventory/edit/:assetType/:id', element: <AssetInventoryEdit /> },
      { path: '/asset/inventory/lots/:assetType/:inventoryId', element: <AssetLotDetails /> },
      { path: '/asset/outward', element: <NewOutwardManagement /> },
      { path: '/asset/outward/create/:department', element: <CreateNewOutward /> },
      { path: '/asset/outward/view/:department/:id', element: <NewOutwardDetails /> },
      { path: '/asset/outward/edit/:department/:id', element: <UpdateNewOutward /> },

      // Quality Reports Routes
      { path: '/asset/quality-reports', element: <QualityReports /> },

      // asset/purchaseindent
      { path: '/asset/purchaseindent', element: <PurchaseIndent /> },
      { path: '/asset/purchaseindent/create', element: <PurchaseIndentCreate /> },


      // Employee Performance Routes
      { path: '/asset/employee-performance', element: <Navigate to="/asset/employee-performance/chart" /> },
      { path: '/asset/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/asset/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/asset/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/asset/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/asset/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/asset/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/asset/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/asset/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/asset/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/asset/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default assetRoutes;
