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
import Error from '@/pages/error/Error';

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

import ViewWorkOrderDetails from '@/pages/jobcards/workorder/ViewWorkorderDetails';
import WorkorderDepartmentPage from '@/pages/jobcards/workorder/WorkorderDepartmentPage';
import ReturnGoods from '@/pages/jobcards/workorder/ReturnGoods';
import CreateWorkOrder from '@/pages/jobcards/workorder/CreateWorkorder';
import WorkOrders from '@/pages/jobcards/workorder/ViewAllWorkorders';
import RecuttingWorkOrders from '@/pages/jobcards/workorder/RecuttingWorkOrders';
import CreateRecuttingWorkOrder from '@/pages/jobcards/workorder/CreateRecuttingWorkOrder';
import WorkflowDetails from '@/pages/jobcards/workflow/WorkFlowDetails';

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
import ProductStyleCategoryList from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryList';
import ProductStyleCategoryCreate from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryCreate';
import ProductStyleCategoryView from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryView';
import ProductStyleCategoryEdit from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryEdit';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const merchandiserRoutes = [
  // Add route for root path to redirect to merchandiser dashboard
  { path: '/', element: <Navigate to="/merchandiser/dashboard" /> },
  {
    path: '/merchandiser',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/merchandiser', element: <Navigate to="/merchandiser/dashboard" /> },
      { path: '/merchandiser/dashboard', element: <Dashboard /> },

      { path: '/merchandiser/bom', element: <BOM /> },
      { path: '/merchandiser/bom/create', element: <CreateBom /> },
      { path: '/merchandiser/bom/edit/:id', element: <EditBom /> },

      { path: '/merchandiser/purchaseindent', element: <PurchaseIndent /> },
      { path: '/merchandiser/purchaseindent/create', element: <PurchaseIndentCreate /> },
      { path: '/merchandiser/purchaseindent/edit/:id', element: <PurchaseIndentEdit /> },

      { path: '/merchandiser/vendor', element: <Vendor /> },
      { path: '/merchandiser/vendor/:id', element: <ViewVendor /> },
      { path: '/merchandiser/vendor/create', element: <AddVendor /> },
      { path: '/merchandiser/vendor/edit/:id', element: <EditVendor /> },

      { path: '/merchandiser/job-cards', element: <JobCards /> },
      { path: '/merchandiser/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/merchandiser/job-cards/create', element: <CreateJobCard /> },
      { path: '/merchandiser/job-cards/edit/:id', element: <EditJobCard /> },

      // SRS Job Card routes
      { path: '/merchandiser/srs-jobcard', element: <SrsJobCards /> },
      { path: '/merchandiser/srs-jobcard/view/:id', element: <ViewSrsJobCard /> },
      { path: '/merchandiser/srs-jobcard/create', element: <CreateSrsJobCard /> },
      { path: '/merchandiser/srs-jobcard/edit/:id', element: <EditSrsJobCard /> },
      { path: '/merchandiser/srs-jobcard/workorders/:id', element: <SrsJobCardWorkOrders /> },
      {
        path: '/merchandiser/srs-jobcard/workorder/create/:jobCardId',
        element: <CreateSrsWorkOrder />,
      },
      {
        path: '/merchandiser/srs-jobcard/workorder/view/:jobCardId',
        element: <ViewSrsWorkOrders />,
      },
      { path: '/merchandiser/job-card/workorder/:jobCardId', element: <CreateWorkOrder /> },
      { path: '/merchandiser/job-card/workorder/:jobCardId/view', element: <WorkOrders /> },
      {
        path: '/merchandiser/job-card/workorder/return-goods/:workOrderId',
        element: <ReturnGoods />,
      },
      {
        path: '/merchandiser/job-card/workorder/recutting/:workOrderId',
        element: <RecuttingWorkOrders />,
      },
      {
        path: '/merchandiser/job-card/workorder/recutting/:workOrderId/create',
        element: <CreateRecuttingWorkOrder />,
      },
      {
        path: '/merchandiser/job-card/workorder/:jobCardId/view/:workOrderId',
        element: <ViewWorkOrderDetails />,
      },
      {
        path: '/merchandiser/job-card/workorder/:workOrderId/department/:department',
        element: <WorkorderDepartmentPage />,
      },

      { path: '/merchandiser/work-flow/:workorderId', element: <WorkflowDetails /> },

      { path: '/merchandiser/productmaster/', element: <IndexUpdate /> }, // own
      //test
      { path: '/merchandiser/productmaster/create', element: <ProductCreation /> },
      { path: '/merchandiser/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/merchandiser/productmaster/edit/:id', element: <EditProduct /> },

      { path: '/merchandiser/purchaseorder/', element: <PurchaseOrder /> },
      { path: '/merchandiser/purchaseorder/create', element: <CreatePurchaseOrder /> },
      { path: '/merchandiser/purchaseorder/:id', element: <ViewPurchaseOrder /> },
      { path: '/merchandiser/purchaseorder/:id/report', element: <FabricPO /> },
      { path: '/merchandiser/purchaseorder/edit/:id', element: <EditPurchaseOrder /> },

      { path: '/merchandiser/material-inward-qc', element: <InwardMaterialsQc /> },
      { path: '/merchandiser/material-inward-qc/:id', element: <ViewInwardMaterialQc /> },
      { path: '/merchandiser/material-inward-qc/create', element: <CreateInwardMaterialQc /> },
      { path: '/merchandiser/material-inward-qc/edit/:id', element: <EditInwardMaterialQc /> },

      { path: '/merchandiser/material-inward/create', element: <CreateMaterialInward /> },
      { path: '/merchandiser/material-inward/:id', element: <ViewMaterialInward /> },
      { path: '/merchandiser/material-inward', element: <InwardMaterialAll /> },

      { path: '/merchandiser/outward', element: <OutwardManagement /> },
      { path: '/merchandiser/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/merchandiser/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/merchandiser/inventory', element: <ProductInventory /> },
      { path: '/merchandiser/inventory/create', element: <CreateInventory /> },
      {
        path: '/merchandiser/inventory/lots/:department/:inventoryId',
        element: <ViewLotDetails />,
      }, //own

      //own
      { path: `/merchandiser/inventory/:department/:id`, element: <InventoryView /> },
      { path: '/merchandiser/inventory/edit/:department/:id', element: <InventoryEdit /> },

      // Quality Reports Routes
      { path: '/merchandiser/quality-reports', element: <QualityReports /> },

      // Employee Performance Routes
      { path: '/merchandiser/employee-performance', element: <Navigate to="/merchandiser/employee-performance/chart" /> },
      { path: '/merchandiser/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/merchandiser/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/merchandiser/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      {
        path: '/merchandiser/employee-performance/daily-work-report/list',
        element: <DailyWorkReportList />,
      },
      { path: '/merchandiser/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      {
        path: '/merchandiser/employee-performance/daily-work-report/create',
        element: <DailyWorkReport />,
      },
      {
        path: '/merchandiser/employee-performance/chart/view/:id',
        element: <EmployeePerformanceChartView />,
      },
      {
        path: '/merchandiser/employee-performance/chart/edit/:id',
        element: <EmployeePerformanceChartEdit />,
      },
      {
        path: '/merchandiser/employee-performance/daily-work-report/view/:id',
        element: <DailyWorkReportView />,
      },
      {
        path: '/merchandiser/employee-performance/daily-work-report/edit/:id',
        element: <DailyWorkReportEdit />,
      },

      // Fabric QC Report Routes
      { path: '/merchandiser/fabric-qc-report', element: <FabricQcReportTable /> },
      { path: '/merchandiser/fabric-qc-report/create', element: <FabricQcReportForm /> },
      { path: '/merchandiser/fabric-qc-report/edit/:id', element: <EditFabricQcReport /> },
      { path: '/merchandiser/fabric-qc-report/view/:id', element: <ViewFabricQcReport /> },
      { path: '/merchandiser/fabric-qc-report/:id', element: <ViewFabricQcReport /> },

      // Sample Pattern Routes
      { path: '/merchandiser/samplepattern', element: <SamplePatternList /> },
      { path: '/merchandiser/samplepattern/create', element: <SamplePatternCreate /> },
      { path: '/merchandiser/samplepattern/edit/:id', element: <SamplePatternEdit /> },

      // Sample Job Card Routes
      { path: '/merchandiser/samplejobcard', element: <SampleJobCardList /> },
      { path: '/merchandiser/samplejobcard/create', element: <SampleJobCardCreate /> },
      { path: '/merchandiser/samplejobcard/edit/:id', element: <SampleJobCardEdit /> },

      // Order Management Routes
      { path: '/merchandiser/orders', element: <AllOrders /> },
      { path: '/merchandiser/orders/create', element: <CreateOrderPage /> },
      { path: '/merchandiser/orders/view/:id', element: <ViewOrder /> },
      { path: '/merchandiser/orders/edit/:id', element: <EditOrder /> },

      // Stocks Routes
      { path: '/merchandiser/stocks', element: <StockMatrixPage /> },

      // Product Style Category Routes
      { path: '/merchandiser/productstylecategory', element: <ProductStyleCategoryList /> },
      { path: '/merchandiser/productstylecategory/create', element: <ProductStyleCategoryCreate /> },
      { path: '/merchandiser/productstylecategory/view/:id', element: <ProductStyleCategoryView /> },
      { path: '/merchandiser/productstylecategory/edit/:id', element: <ProductStyleCategoryEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default merchandiserRoutes;
