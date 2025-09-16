import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Dashboard from '../pages/superAdmin/dashboard';

// Import components for Account routes
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import InventoryView from '@/pages/inventorylot/inventoryView';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';

// BOM
import BOM from '@/pages/superAdmin/bom';
import CreateBom from '@/pages/superAdmin/bom/CreateBom';
import EditBom from '@/pages/superAdmin/bom/EditBom';

// Vendor
import Vendor from '@/pages/superAdmin/vendor';
import AddVendor from '@/pages/superAdmin/vendor/AddVendor';
import EditVendor from '@/pages/superAdmin/vendor/EditVendor';
import ViewVendor from '@/pages/superAdmin/vendor/ViewVendor';

// Purchase Indent
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';

// Purchase Order
import PurchaseOrder from '@/pages/superAdmin/purchaseorder';
import CreatePurchaseOrder from '@/pages/superAdmin/purchaseorder/CreatePurchaseOrder';
import EditPurchaseOrder from '@/pages/superAdmin/purchaseorder/EditPurchaseOrder';
import ViewPurchaseOrder from '@/pages/superAdmin/purchaseorder/ViewPurchaseOrder';

// Material Inward QC
import CreateInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/CreateInwardMaterialQc';
import InwardMaterialsQc from '@/pages/superAdmin/inwardmaterialqc';
import EditInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/EditInwardMaterialQc';
import ViewInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/ViewInwardMaterialQc';

// Fabric QC Report
import FabricQcReportTable from '@/pages/fabricQcReport/FabricQcReportTable';
import FabricQcReportForm from '@/pages/fabricQcReport/FabricQcReportForm';
import EditFabricQcReport from '@/pages/fabricQcReport/EditFabricQcReport';
import ViewFabricQcReport from '@/pages/fabricQcReport/ViewFabricQcReport';

// Job Cards
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';
import WorkflowDetails from '@/pages/jobcards/workflow/WorkFlowDetails';
import CreateWorkOrder from '@/pages/jobcards/workorder/CreateWorkorder';
import WorkOrders from '@/pages/jobcards/workorder/ViewAllWorkorders';
import ViewWorkOrderDetails from '@/pages/jobcards/workorder/ViewWorkorderDetails';
import WorkorderDepartmentPage from '@/pages/jobcards/workorder/WorkorderDepartmentPage';
import ReturnGoods from '@/pages/jobcards/workorder/ReturnGoods';
import TimingPage from '@/pages/jobcards/workflow/TimingPage';

// Quality Reports
import QualityReports from '@/pages/quality/QualityReports';

// Stocks
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';
import FGstore from '@/pages/superAdmin/fgstore/FgstoreIndex';
import FGStoreRequest from '@/pages/superAdmin/fgstore/FgStoreRequest';
import FGstoreStocks from '@/pages/superAdmin/fgstore/FgstoreStocks';
import FGStoreDefects from '@/pages/superAdmin/fgstore/FgStoreDefects';
import CreateStockInward from '@/pages/superAdmin/stockInward/CreateStockInward';
import ViewStockInward from '@/pages/superAdmin/stockInward/ViewStockInward';
import CreateStockOutward from '@/pages/superAdmin/stockOutward/CreateStockOutward';
import StockOutward from '@/pages/superAdmin/stockOutward/StockOutward';
import ViewStockOutward from '@/pages/superAdmin/stockOutward/ViewStockOutward';

// Employee Performance
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';

// Asset Management
import Assetmanagement from '@/components/assetmanagement/Assetmanagement';
import ViewAssetmanagement from '@/components/assetmanagement/viewAssetmanagement';
import ViewOneassetmanagement from '@/components/assetmanagement/viewOneassetmanagement';
import AssetInventory from '@/pages/superAdmin/assetinventory/assetInventory';
import AssetInventoryEdit from '@/pages/superAdmin/assetinventory/assetInventoryEdit';
import AssetInventoryView from '@/pages/superAdmin/assetinventory/assetInventoryView';
import AssetLotDetails from '@/pages/superAdmin/assetinventory/assetLotDetails';
import AssetIndent from '@/components/assetIndent/assetindent';
import Assetindentcreate from '@/components/assetIndent/assetindentcreate';
import EditAssesIndent from '@/components/assetIndent/editAssesIndent';
import AssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrder';
import AssetPurchaseOrderCreate from '@/components/assetPurchaseOrder/assetPurchaseOrderCreate';
import ViewAssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrderView';
import EditAssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrderEdit';
import Assetvendor from '@/components/assetvendor/assetvendor';
import AssetvendorCreate from '@/components/assetvendor/assetvendorCreate';
import AssetVendorView from '@/components/assetvendor/assetvendorview';
import AssetVendoredit from '@/components/assetvendor/assetVendoredit';
import CreateAssetInward from '@/pages/superAdmin/assetinward/createassetInward';
import ViewAssetInward from '@/pages/superAdmin/assetinward/viewAssetInward';
import AssetInwardAll from '@/pages/superAdmin/assetinward/assetinward';
import CreateAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/createassetmaterialinwardqc';
import ViewAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/viewassetmaterialinwardqc';
import AssetMaterialInwardQcAll from '@/pages/superAdmin/assetmaterialinwardqc/assetmaterialinwardqc';
import NewOutwardManagement from '@/pages/superAdmin/assetoutward/outwardManagement';
import NewOutwardDetails from '@/pages/superAdmin/assetoutward/outwardDetails';
import UpdateNewOutward from '@/pages/superAdmin/assetoutward/updateOutward';
import CreateNewOutward from '@/pages/superAdmin/assetoutward/createAssetoutward';

// Error page
import Error from '@/pages/error/Error';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const accountRoutes = [
  {
    path: '/accounts',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/accounts', element: <Navigate to="/accounts/dashboard" /> },
      { path: '/accounts/dashboard', element: <Dashboard /> },

      // BOM Routes
      { path: '/accounts/bom', element: <BOM /> },
      { path: '/accounts/bom/create', element: <CreateBom /> },
      { path: '/accounts/bom/edit/:id', element: <EditBom /> },

      // Vendor Routes
      { path: '/accounts/vendor', element: <Vendor /> },
      { path: '/accounts/vendor/:id', element: <ViewVendor /> },
      { path: '/accounts/vendor/create', element: <AddVendor /> },
      { path: '/accounts/vendor/edit/:id', element: <EditVendor /> },

      // Purchase Indent Routes
      { path: '/accounts/purchaseindent/', element: <PurchaseIndent /> },
      { path: '/accounts/purchaseindent/create', element: <PurchaseIndentCreate /> },
      { path: '/accounts/purchaseindent/edit/:id', element: <PurchaseIndentEdit /> },

      // Purchase Order Routes
      { path: '/accounts/purchaseorder/', element: <PurchaseOrder /> },
      { path: '/accounts/purchaseorder/create', element: <CreatePurchaseOrder /> },
      { path: '/accounts/purchaseorder/:id', element: <ViewPurchaseOrder /> },
      { path: '/accounts/purchaseorder/edit/:id', element: <EditPurchaseOrder /> },

      // Material Inward QC Routes
      { path: '/accounts/material-inward-qc', element: <InwardMaterialsQc /> },
      { path: '/accounts/material-inward-qc/:id', element: <ViewInwardMaterialQc /> },
      { path: '/accounts/material-inward-qc/create', element: <CreateInwardMaterialQc /> },
      { path: '/accounts/material-inward-qc/edit/:id', element: <EditInwardMaterialQc /> },

      // Inventory Routes
      { path: '/accounts/inventory', element: <ProductInventory /> },
      { path: '/accounts/inventory/create', element: <CreateInventory /> },
      { path: '/accounts/inventory/lots/:department/:inventoryId', element: <ViewLotDetails /> },
      { path: '/accounts/inventory/:department/:id', element: <InventoryView /> },
      { path: '/accounts/inventory/edit/:department/:id', element: <InventoryEdit /> },

      // Fabric QC Report Routes
      { path: '/accounts/fabric-qc-report', element: <FabricQcReportTable /> },
      { path: '/accounts/fabric-qc-report/create', element: <FabricQcReportForm /> },
      { path: '/accounts/fabric-qc-report/edit/:id', element: <EditFabricQcReport /> },
      { path: '/accounts/fabric-qc-report/:id', element: <ViewFabricQcReport /> },

      // Job Cards Routes
      { path: '/accounts/job-cards', element: <JobCards /> },
      { path: '/accounts/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/accounts/job-cards/create', element: <CreateJobCard /> },
      { path: '/accounts/job-cards/edit/:id', element: <EditJobCard /> },
      { path: '/accounts/job-card/workorder/:jobCardId', element: <CreateWorkOrder /> },
      { path: '/accounts/job-card/workorder/:jobCardId/view', element: <WorkOrders /> },
      { path: '/accounts/job-card/workorder/return-goods/:workOrderId', element: <ReturnGoods /> },
      { path: '/accounts/job-card/workorder/:jobCardId/view/:workOrderId', element: <ViewWorkOrderDetails /> },
      { path: '/accounts/job-card/workorder/:workOrderId/department/:department', element: <WorkorderDepartmentPage /> },
      { path: '/accounts/work-flow/:workorderId', element: <WorkflowDetails /> },
      { path: '/accounts/work-flow/:workorderId/update', element: <TimingPage /> },

      // Quality Reports Routes
      { path: '/accounts/quality-reports', element: <QualityReports /> },

      // Stocks Routes
      { path: '/accounts/stocks', element: <StockMatrixPage /> },
      { path: '/accounts/fgstore', element: <FGstore /> },
      { path: '/accounts/fgstore/requests', element: <FGStoreRequest /> },
      { path: '/accounts/fgstore/defects', element: <FGStoreDefects /> },
      { path: '/accounts/fgstore/stocks', element: <FGstoreStocks /> },
      { path: '/accounts/fgstore/outward', element: <StockOutward /> },
      { path: '/accounts/fgstore/create/stockoutward', element: <CreateStockOutward /> },
      { path: '/accounts/fgstore/create/stockinward', element: <CreateStockInward /> },
      { path: '/accounts/fgstore/stockinward/:id', element: <ViewStockInward /> },
      { path: '/accounts/fgstore/stockoutward/:id', element: <ViewStockOutward /> },

      // Employee Performance Routes
      { path: '/accounts/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/accounts/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/accounts/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/accounts/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/accounts/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/accounts/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/accounts/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/accounts/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/accounts/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/accounts/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      // Asset Management Routes
      { path: '/accounts/assetmanagement', element: <Assetmanagement /> },
      { path: '/accounts/viewassetmanagement', element: <ViewAssetmanagement /> },
      { path: '/accounts/viewoneassetmanagement/:id', element: <ViewOneassetmanagement /> },

      // Asset Inventory Routes
      { path: '/accounts/asset-inventory', element: <AssetInventory /> },
      { path: '/accounts/asset-inventory/:assetType/:id', element: <AssetInventoryView /> },
      { path: '/accounts/asset-inventory/edit/:assetType/:id', element: <AssetInventoryEdit /> },
      { path: '/accounts/asset-inventory/lots/:assetType/:inventoryId', element: <AssetLotDetails /> },

      // Asset Indent Routes
      { path: '/accounts/assetindent', element: <AssetIndent /> },
      { path: '/accounts/assetindent/create', element: <Assetindentcreate /> },
      { path: '/accounts/assetindent/edit/:id', element: <EditAssesIndent /> },

      // Asset Vendor Routes
      { path: '/accounts/assetvendor', element: <Assetvendor /> },
      { path: '/accounts/assetvendor/create', element: <AssetvendorCreate /> },
      { path: '/accounts/assetvendor/view/:id', element: <AssetVendorView /> },
      { path: '/accounts/assetvendor/edit/:id', element: <AssetVendoredit /> },

      // Asset Purchase Order Routes
      { path: '/accounts/assetpurchaseorder', element: <AssetPurchaseOrder /> },
      { path: '/accounts/assetpurchaseorder/create', element: <AssetPurchaseOrderCreate /> },
      { path: '/accounts/assetpurchaseorder/view/:id', element: <ViewAssetPurchaseOrder /> },
      { path: '/accounts/assetpurchaseorder/edit/:id', element: <EditAssetPurchaseOrder /> },

      // Asset Inward Routes
      { path: '/accounts/asset-inward/create', element: <CreateAssetInward /> },
      { path: '/accounts/asset-inward/:id', element: <ViewAssetInward /> },
      { path: '/accounts/asset-inward', element: <AssetInwardAll /> },

      // Asset Material Inward QC Routes
      { path: '/accounts/asset-material-inward-qc/create', element: <CreateAssetMaterialInwardQc /> },
      { path: '/accounts/asset-material-inward-qc/:id', element: <ViewAssetMaterialInwardQc /> },
      { path: '/accounts/asset-material-inward-qc', element: <AssetMaterialInwardQcAll /> },

      // Asset Outward Routes
      { path: '/accounts/asset-outward', element: <NewOutwardManagement /> },
      { path: '/accounts/asset-outward/create/:department', element: <CreateNewOutward /> },
      { path: '/accounts/asset-outward/view/:department/:id', element: <NewOutwardDetails /> },
      { path: '/accounts/asset-outward/edit/:department/:id', element: <UpdateNewOutward /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/', element: <Navigate to="/accounts/dashboard" /> },
  { path: '/login', element: <Navigate to="/accounts/dashboard" /> },
  { path: '/error/404', element: <Error /> },
];

export default accountRoutes; 