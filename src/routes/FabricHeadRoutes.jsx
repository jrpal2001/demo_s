import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import CreateMaterialInward from '@/pages/superAdmin/inwardmaterial/CreateInwardMaterial';
import ViewMaterialInward from '@/pages/superAdmin/inwardmaterial/ViewMaterialInwardByID';
import InwardMaterialAll from '@/pages/superAdmin/inwardmaterial/ViewInwardMaterials';
import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';
import BOM from '@/pages/superAdmin/bom';
import CreateBom from '@/pages/superAdmin/bom/CreateBom';
import EditBom from '@/pages/superAdmin/bom/EditBom';
import Error from '@/pages/error/Error';

// Additional imports for missing routes
import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';
import InwardMaterialsQc from '@/pages/superAdmin/inwardmaterialqc';
import CreateInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/CreateInwardMaterialQc';
import EditInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/EditInwardMaterialQc';
import ViewInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/ViewInwardMaterialQc';
import QualityReports from '@/pages/quality/QualityReports';
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';
import FabricQcReportTable from '@/pages/fabricQcReport/FabricQcReportTable';
import FabricQcReportForm from '@/pages/fabricQcReport/FabricQcReportForm';
import EditFabricQcReport from '@/pages/fabricQcReport/EditFabricQcReport';
import ViewFabricQcReport from '@/pages/fabricQcReport/ViewFabricQcReport';
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import InventoryView from '@/pages/inventorylot/inventoryView';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const fabricHeadRoutes = [
  // Add route for root path to redirect to fabric dashboard
  { path: '/', element: <Navigate to="/fabric/dashboard" /> },
  {
    path: '/fabric',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/fabric', element: <Navigate to="/fabric/dashboard" /> },
      { path: '/fabric/dashboard', element: <Dashboard /> },
      { path: '/fabric/job-cards', element: <JobCards /> },
      { path: '/fabric/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/fabric/job-cards/create', element: <CreateJobCard /> },
      { path: '/fabric/job-cards/edit/:id', element: <EditJobCard /> },
      { path: '/fabric/purchaseindent', element: <PurchaseIndent /> },
      { path: '/fabric/purchaseindent/create', element: <PurchaseIndentCreate /> },
      { path: '/fabric/purchaseindent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/fabric/inventory', element: <ProductInventory /> },
      { path: '/fabric/inventory/create', element: <CreateInventory /> },
      { path: '/fabric/inventory/:department/:id', element: <InventoryView /> },
      { path: '/fabric/inventory/edit/:department/:id', element: <InventoryEdit /> },
      { path: '/fabric/inventory/lots/:department/:inventoryId', element: <ViewLotDetails /> },
      { path: '/fabric/material-inward', element: <InwardMaterialAll /> },
      { path: '/fabric/material-inward/create', element: <CreateMaterialInward /> },
      { path: '/fabric/material-inward/:id', element: <ViewMaterialInward /> },
      { path: '/fabric/outward', element: <OutwardManagement /> },
      { path: '/fabric/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/fabric/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/fabric/category', element: <BOM /> },
      { path: '/fabric/category/create', element: <CreateBom /> },
      { path: '/fabric/category/edit/:id', element: <EditBom /> },

      // Product Master Routes
      { path: '/fabric/productmaster', element: <IndexUpdate /> },
      { path: '/fabric/productmaster/create', element: <ProductCreation /> },
      { path: '/fabric/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/fabric/productmaster/edit/:id', element: <EditProduct /> },

      // Material Inward QC Routes
      { path: '/fabric/material-inward-qc', element: <InwardMaterialsQc /> },
      { path: '/fabric/material-inward-qc/create', element: <CreateInwardMaterialQc /> },
      { path: '/fabric/material-inward-qc/:id', element: <ViewInwardMaterialQc /> },
      { path: '/fabric/material-inward-qc/edit/:id', element: <EditInwardMaterialQc /> },

      // Fabric QC Report Routes
      { path: '/fabric/fabric-qc-report', element: <FabricQcReportTable /> },
      { path: '/fabric/fabric-qc-report/create', element: <FabricQcReportForm /> },
      { path: '/fabric/fabric-qc-report/edit/:id', element: <EditFabricQcReport /> },
      { path: '/fabric/fabric-qc-report/view/:id', element: <ViewFabricQcReport /> },

      // Quality Reports Routes
      { path: '/fabric/quality-reports', element: <QualityReports /> },

      // Stocks Routes
      { path: '/fabric/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/fabric/employee-performance', element: <Navigate to="/fabric/employee-performance/chart" /> },
      { path: '/fabric/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/fabric/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/fabric/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/fabric/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/fabric/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/fabric/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/fabric/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/fabric/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/fabric/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/fabric/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default fabricHeadRoutes;
