import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import BOM from '@/pages/superAdmin/bom';
import CreateBom from '@/pages/superAdmin/bom/CreateBom';
import EditBom from '@/pages/superAdmin/bom/EditBom';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';

// SRS Job Card imports
import SrsJobCards from '@/pages/srsjobcard';
import ViewSrsJobCard from '@/pages/srsjobcard/view';
import CreateSrsJobCard from '@/pages/srsjobcard/create';
import EditSrsJobCard from '@/pages/srsjobcard/edit';
import SrsJobCardWorkOrders from '@/pages/srsjobcard/workorders';
import CreateSrsWorkOrder from '@/pages/srsjobcard/workorder/CreateSrsWorkOrder';
import ViewSrsWorkOrders from '@/pages/srsjobcard/workorder/ViewSrsWorkOrders';
import CreateWorkOrder from '@/pages/jobcards/workorder/CreateWorkorder';
import WorkOrders from '@/pages/jobcards/workorder/ViewAllWorkorders';
import RecuttingWorkOrders from '@/pages/jobcards/workorder/RecuttingWorkOrders';
import CreateRecuttingWorkOrder from '@/pages/jobcards/workorder/CreateRecuttingWorkOrder';
import ViewWorkOrderDetails from '@/pages/jobcards/workorder/ViewWorkorderDetails';
import WorkorderDepartmentPage from '@/pages/jobcards/workorder/WorkorderDepartmentPage';
import ReturnGoods from '@/pages/jobcards/workorder/ReturnGoods';
import WorkflowDetails from '@/pages/jobcards/workflow/WorkFlowDetails';

import Vendor from '@/pages/superAdmin/vendor';
import AddVendor from '@/pages/superAdmin/vendor/AddVendor';
import EditVendor from '@/pages/superAdmin/vendor/EditVendor';
import ViewVendor from '@/pages/superAdmin/vendor/ViewVendor';

import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';

import PurchaseOrder from '@/pages/superAdmin/purchaseorder';
import CreatePurchaseOrder from '@/pages/superAdmin/purchaseorder/CreatePurchaseOrder';
import ViewPurchaseOrder from '@/pages/superAdmin/purchaseorder/ViewPurchaseOrder';
import EditPurchaseOrder from '@/pages/superAdmin/purchaseorder/EditPurchaseOrder';
import FabricPO from '@/pages/superAdmin/purchaseorder/reports/FabricReport';

import InwardMaterialsQc from '@/pages/superAdmin/inwardmaterialqc';
import ViewInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/ViewInwardMaterialQc';
import CreateInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/CreateInwardMaterialQc';
import EditInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/EditInwardMaterialQc';

import CreateMaterialInward from '@/pages/superAdmin/inwardmaterial/CreateInwardMaterial';
import ViewMaterialInward from '@/pages/superAdmin/inwardmaterial/ViewMaterialInwardByID';
import InwardMaterialAll from '@/pages/superAdmin/inwardmaterial/ViewInwardMaterials';

import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import ViewStockOutward from '@/pages/superAdmin/stockOutward/ViewStockOutward';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';

import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
import InventoryView from '@/pages/inventorylot/inventoryView';
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';

import Users from '@/pages/superAdmin/users';
import AddUser from '@/pages/superAdmin/users/addUser';
import EditUser from '@/pages/superAdmin/users/editUser';

// Product Style Category imports
import ProductStyleCategoryList from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryList';
import ProductStyleCategoryCreate from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryCreate';
import ProductStyleCategoryView from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryView';
import ProductStyleCategoryEdit from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryEdit';

// Additional imports for missing routes
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
import SamplePatternList from '@/pages/superAdmin/samplepattern/SamplepatternList';
import SamplePatternCreate from '@/pages/superAdmin/samplepattern/SamplepatternCreate';
import SamplePatternEdit from '@/pages/superAdmin/samplepattern/SamplepatternEdit';
import SampleJobCardList from '@/pages/superAdmin/sample-job-card/SampleJobCardList';
import SampleJobCardCreate from '@/pages/superAdmin/sample-job-card/SampleJobCardCreate';
import SampleJobCardEdit from '@/pages/superAdmin/sample-job-card/SampleJobCardEdit';
import AllOrders from '@/pages/order/AllOrders';
import CreateOrderPage from '@/pages/order/OrderCreation';
import ViewOrder from '@/pages/order/ViewOrder';
import EditOrder from '@/pages/order/EditOrder';
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';

import Error from '@/pages/error/Error';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const superMerchandiserRoutes = [
  // Add route for root path to redirect to supermerchandiser dashboard
  { path: '/', element: <Navigate to="/supermerchandiser/dashboard" /> },
  {
    path: '/supermerchandiser',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/supermerchandiser', element: <Navigate to="/supermerchandiser/dashboard" /> },
      { path: '/supermerchandiser/dashboard', element: <Dashboard /> },

      { path: '/supermerchandiser/bom', element: <BOM /> },
      { path: '/supermerchandiser/bom/create', element: <CreateBom /> },
      { path: '/supermerchandiser/bom/edit/:id', element: <EditBom /> },

      { path: '/supermerchandiser/purchaseindent', element: <PurchaseIndent /> },
      { path: '/supermerchandiser/purchaseindent/create', element: <PurchaseIndentCreate /> },
      { path: '/supermerchandiser/purchaseindent/edit/:id', element: <PurchaseIndentEdit /> },

      { path: '/supermerchandiser/vendor', element: <Vendor /> },
      { path: '/supermerchandiser/vendor/:id', element: <ViewVendor /> },
      { path: '/supermerchandiser/vendor/create', element: <AddVendor /> },
      { path: '/supermerchandiser/vendor/edit/:id', element: <EditVendor /> },

      { path: '/supermerchandiser/job-cards', element: <JobCards /> },
      { path: '/supermerchandiser/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/supermerchandiser/job-cards/create', element: <CreateJobCard /> },
      { path: '/supermerchandiser/job-cards/edit/:id', element: <EditJobCard /> },

      // SRS Job Card routes
      { path: '/supermerchandiser/srs-jobcard', element: <SrsJobCards /> },
      { path: '/supermerchandiser/srs-jobcard/view/:id', element: <ViewSrsJobCard /> },
      { path: '/supermerchandiser/srs-jobcard/create', element: <CreateSrsJobCard /> },
      { path: '/supermerchandiser/srs-jobcard/edit/:id', element: <EditSrsJobCard /> },
      { path: '/supermerchandiser/srs-jobcard/workorders/:id', element: <SrsJobCardWorkOrders /> },
      {
        path: '/supermerchandiser/srs-jobcard/workorder/create/:jobCardId',
        element: <CreateSrsWorkOrder />,
      },
      {
        path: '/supermerchandiser/srs-jobcard/workorder/view/:jobCardId',
        element: <ViewSrsWorkOrders />,
      },

      { path: '/supermerchandiser/job-card/workorder/:jobCardId', element: <CreateWorkOrder /> },
      { path: '/supermerchandiser/job-card/workorder/:jobCardId/view', element: <WorkOrders /> },
      {
        path: '/supermerchandiser/job-card/workorder/return-goods/:workOrderId',
        element: <ReturnGoods />,
      },
      {
        path: '/supermerchandiser/job-card/workorder/recutting/:workOrderId',
        element: <RecuttingWorkOrders />,
      },
      {
        path: '/supermerchandiser/job-card/workorder/recutting/:workOrderId/create',
        element: <CreateRecuttingWorkOrder />,
      },
      {
        path: '/supermerchandiser/job-card/workorder/:jobCardId/view/:workOrderId',
        element: <ViewWorkOrderDetails />,
      },
      {
        path: '/supermerchandiser/job-card/workorder/:workOrderId/department/:department',
        element: <WorkorderDepartmentPage />,
      },

      { path: '/supermerchandiser/work-flow/:workorderId', element: <WorkflowDetails /> },

      { path: '/supermerchandiser/productmaster/', element: <IndexUpdate /> },
      { path: '/supermerchandiser/productmaster/create', element: <ProductCreation /> },
      { path: '/supermerchandiser/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/supermerchandiser/productmaster/edit/:id', element: <EditProduct /> },

      { path: '/supermerchandiser/purchaseorder/', element: <PurchaseOrder /> },
      { path: '/supermerchandiser/purchaseorder/create', element: <CreatePurchaseOrder /> },
      { path: '/supermerchandiser/purchaseorder/:id', element: <ViewPurchaseOrder /> },
      { path: '/supermerchandiser/purchaseorder/:id/report', element: <FabricPO /> },
      { path: '/supermerchandiser/purchaseorder/edit/:id', element: <EditPurchaseOrder /> },

      { path: '/supermerchandiser/material-inward-qc', element: <InwardMaterialsQc /> },
      { path: '/supermerchandiser/material-inward-qc/:id', element: <ViewInwardMaterialQc /> },
      { path: '/supermerchandiser/material-inward-qc/create', element: <CreateInwardMaterialQc /> },
      { path: '/supermerchandiser/material-inward-qc/edit/:id', element: <EditInwardMaterialQc /> },

      { path: '/supermerchandiser/material-inward/create', element: <CreateMaterialInward /> },
      { path: '/supermerchandiser/material-inward/:id', element: <ViewMaterialInward /> },
      { path: '/supermerchandiser/material-inward', element: <InwardMaterialAll /> },

      { path: '/supermerchandiser/outward', element: <OutwardManagement /> },
      { path: '/supermerchandiser/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/supermerchandiser/outward/edit/:department/:id', element: <UpdateOutward /> },

      { path: '/supermerchandiser/inventory', element: <ProductInventory /> },
      { path: '/supermerchandiser/inventory/create', element: <CreateInventory /> },
      {
        path: '/supermerchandiser/inventory/lots/:department/:inventoryId',
        element: <ViewLotDetails />,
      },
      {
        path: '/supermerchandiser/inventory/:department/:id',
        element: <InventoryView />,
      },
      {
        path: '/supermerchandiser/inventory/edit/:department/:id',
        element: <InventoryEdit />,
      },

      { path: '/supermerchandiser/users', element: <Users /> },
      { path: '/supermerchandiser/users/create', element: <AddUser /> },
      { path: '/supermerchandiser/users/edit/:id', element: <EditUser /> },

      // Product Style Category Routes
      { path: '/supermerchandiser/productstylecategory', element: <ProductStyleCategoryList /> },
      { path: '/supermerchandiser/productstylecategory/create', element: <ProductStyleCategoryCreate /> },
      { path: '/supermerchandiser/productstylecategory/view/:id', element: <ProductStyleCategoryView /> },
      { path: '/supermerchandiser/productstylecategory/edit/:id', element: <ProductStyleCategoryEdit /> },

      // Quality Reports Routes
      { path: '/supermerchandiser/quality-reports', element: <QualityReports /> },

      // Stocks Routes
      { path: '/supermerchandiser/inventory/stocks', element: <StockMatrixPage /> },

      // Order Management Routes
      { path: '/supermerchandiser/orders', element: <AllOrders /> },
      { path: '/supermerchandiser/orders/create', element: <CreateOrderPage /> },
      { path: '/supermerchandiser/orders/view/:id', element: <ViewOrder /> },
      { path: '/supermerchandiser/orders/edit/:id', element: <EditOrder /> },

      // Sample Job Card Routes
      { path: '/supermerchandiser/samplejobcard', element: <SampleJobCardList /> },
      { path: '/supermerchandiser/samplejobcard/create', element: <SampleJobCardCreate /> },
      { path: '/supermerchandiser/samplejobcard/edit/:id', element: <SampleJobCardEdit /> },

      // Samples Routes
      { path: '/supermerchandiser/samplepattern', element: <SamplePatternList /> },
      { path: '/supermerchandiser/samplepattern/create', element: <SamplePatternCreate /> },
      { path: '/supermerchandiser/samplepattern/edit/:id', element: <SamplePatternEdit /> },

      // Employee Performance Routes
      { path: '/supermerchandiser/employee-performance', element: <Navigate to="/supermerchandiser/employee-performance/chart" /> },
      { path: '/supermerchandiser/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/supermerchandiser/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/supermerchandiser/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/supermerchandiser/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/supermerchandiser/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/supermerchandiser/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/supermerchandiser/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/supermerchandiser/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/supermerchandiser/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/supermerchandiser/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      // Fabric QC Report Routes
      { path: '/supermerchandiser/fabric-qc-report', element: <FabricQcReportTable /> },
      { path: '/supermerchandiser/fabric-qc-report/create', element: <FabricQcReportForm /> },
      { path: '/supermerchandiser/fabric-qc-report/edit/:id', element: <EditFabricQcReport /> },
      { path: '/supermerchandiser/fabric-qc-report/view/:id', element: <ViewFabricQcReport /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default superMerchandiserRoutes;
