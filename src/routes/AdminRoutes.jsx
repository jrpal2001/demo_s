import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import Dashboard from '../pages/superAdmin/dashboard';

import Users from '@/pages/superAdmin/users';
import AddUser from '@/pages/superAdmin/users/addUser';
import EditUser from '@/pages/superAdmin/users/editUser';

import Vendors from '@/pages/superAdmin/vendors';
import ViewVendor from '@/pages/superAdmin/vendor/ViewVendor';

import ViewDealers from '@/pages/superAdmin/dealers/ViewDealer';
import AddDealers from '@/pages/superAdmin/dealers/AddDealers';
import EditDealers from '@/pages/superAdmin/dealers/EditDealer';

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

import WorkflowDetails from '@/pages/jobcards/workflow/WorkFlowDetails';

import AllOrders from '@/pages/order/AllOrders';
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';

import Error from '@/pages/error/Error';
import CreateOrderPage from '@/pages/order/OrderCreation';
import ViewOrder from '@/pages/order/ViewOrder';
import EditOrder from '@/pages/order/EditOrder';

// SP
import Vendor from '@/pages/superAdmin/vendor';
import AddVendor from '@/pages/superAdmin/vendor/AddVendor';
import EditVendor from '@/pages/superAdmin/vendor/EditVendor';

import BOM from '@/pages/superAdmin/bom';
import CreateBom from '@/pages/superAdmin/bom/CreateBom';
import EditBom from '@/pages/superAdmin/bom/EditBom';

import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';

import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';
import PurchaseIndentEdit from '@/pages/superAdmin/purchaseindent/PurchaseIndentEdit';

import PurchaseOrder from '@/pages/superAdmin/purchaseorder';
import CreatePurchaseOrder from '@/pages/superAdmin/purchaseorder/CreatePurchaseOrder';
import EditPurchaseOrder from '@/pages/superAdmin/purchaseorder/EditPurchaseOrder';
import ViewPurchaseOrder from '@/pages/superAdmin/purchaseorder/ViewPurchaseOrder';
import CreateInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/CreateInwardMaterialQc';
import InwardMaterialsQc from '@/pages/superAdmin/inwardmaterialqc';
import EditInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/EditInwardMaterialQc';
import ViewInwardMaterialQc from '@/pages/superAdmin/inwardmaterialqc/ViewInwardMaterialQc';
import CreateMaterialInward from '@/pages/superAdmin/inwardmaterial/CreateInwardMaterial';
import ViewMaterialInward from '@/pages/superAdmin/inwardmaterial/ViewMaterialInwardByID';
import InwardMaterialAll from '@/pages/superAdmin/inwardmaterial/ViewInwardMaterials';
import InventoryEdit from '@/pages/inventorylot/inventoryedit';
import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ViewLotDetails from '@/pages/inventorylot/viewlotdetails';
import CreateWorkOrder from '@/pages/jobcards/workorder/CreateWorkorder';
import WorkOrders from '@/pages/jobcards/workorder/ViewAllWorkorders';
import RecuttingWorkOrders from '@/pages/jobcards/workorder/RecuttingWorkOrders';
import CreateRecuttingWorkOrder from '@/pages/jobcards/workorder/CreateRecuttingWorkOrder';
import FGstore from '@/pages/superAdmin/fgstore/FgstoreIndex';
import FGStoreRequest from '@/pages/superAdmin/fgstore/FgStoreRequest';
import CreateStockInward from '@/pages/superAdmin/stockInward/CreateStockInward';
import FGstoreStocks from '@/pages/superAdmin/fgstore/FgstoreStocks';
import ViewStockInward from '../pages/superAdmin/stockInward/ViewStockInward';
import CreateStockOutward from '@/pages/superAdmin/stockOutward/CreateStockOutward';
import StockOutward from '@/pages/superAdmin/stockOutward/StockOutward';
import ViewWorkOrderDetails from '@/pages/jobcards/workorder/ViewWorkorderDetails';
import WorkorderDepartmentPage from '@/pages/jobcards/workorder/WorkorderDepartmentPage';
import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import ViewStockOutward from '@/pages/superAdmin/stockOutward/ViewStockOutward';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';
import Assetmanagement from '@/components/assetmanagement/Assetmanagement';
import ViewAssetmanagement from '@/components/assetmanagement/viewAssetmanagement';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';
import FGStoreDefects from '@/pages/superAdmin/fgstore/FgStoreDefects';
import ReturnGoods from '@/pages/jobcards/workorder/ReturnGoods';
import SamplePatternList from '@/pages/superAdmin/samplepattern/SamplepatternList';
import SamplePatternCreate from '@/pages/superAdmin/samplepattern/SamplepatternCreate';
import SamplePatternEdit from '@/pages/superAdmin/samplepattern/SamplepatternEdit';
import ApprovedSampleCreate from '@/pages/superAdmin/approvedsample/ApprovedsampleCreate';
import ApprovedSampleEdit from '@/pages/superAdmin/approvedsample/ApprovedsampleEdit';
import ApprovedSampleList from '@/pages/superAdmin/approvedsample/ApprovedsampleList';
import LeadList from '@/pages/superAdmin/lead/LeadManagement';
import LeadCreate from '@/pages/superAdmin/lead/LeadCreate';
import LeadEdit from '@/pages/superAdmin/lead/LeadEdit';
import AssetIndent from '@/components/assetIndent/assetindent';
import Assetindentcreate from '@/components/assetIndent/assetindentcreate';
import ViewAssetIndent from '@/components/assetIndent/ViewAssetIndent';
import AssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrder';
import AssetPurchaseOrderCreate from '@/components/assetPurchaseOrder/assetPurchaseOrderCreate';
import Assetvendor from '@/components/assetvendor/assetvendor';
import AssetvendorCreate from '@/components/assetvendor/assetvendorCreate';
import AssetVendorView from '@/components/assetvendor/assetvendorview';
import ViewOneassetmanagement from '@/components/assetmanagement/viewOneassetmanagement';
import EditAssesIndent from '@/components/assetIndent/editAssesIndent';
import AssetVendoredit from '@/components/assetvendor/assetVendoredit';
import ViewAssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrderView';
import EditAssetPurchaseOrder from '@/components/assetPurchaseOrder/assetPurchaseOrderEdit';
import CreateAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/createassetmaterialinwardqc';
import ViewAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/viewassetmaterialinwardqc';
import AssetMaterialInwardQcAll from '@/pages/superAdmin/assetmaterialinwardqc/assetmaterialinwardqc';
import AssetInventory from '@/pages/superAdmin/assetinventory/assetInventory';
import AssetInventoryEdit from '@/pages/superAdmin/assetinventory/assetInventoryEdit';
import AssetInventoryView from '@/pages/superAdmin/assetinventory/assetInventoryView';
import AssetLotDetails from '@/pages/superAdmin/assetinventory/assetLotDetails';
import CreateAssetInward from '@/pages/superAdmin/assetinward/createassetInward';
import ViewAssetInward from '@/pages/superAdmin/assetinward/viewAssetInward';
import AssetInwardAll from '@/pages/superAdmin/assetinward/assetinward';
import { createMaintenanceInward } from '@/api/maintenanceInward.api';
import ViewMaintenanceInward from '@/pages/superAdmin/maintenance/viewmaintenanceInward';
import MaintenanceInwardAll from '@/pages/superAdmin/maintenance/maintenanceInwardAll';
import MaintenanceInventory from '@/pages/superAdmin/maintenance/maintenanceInventory';
import MaintenanceInventoryEdit from '@/pages/superAdmin/maintenance/maintenanceInventoryEdit';
import MaintenanceInventoryView from '@/pages/superAdmin/maintenance/maintenanceInventoryView';
import MaintenanceLotDetails from '@/pages/superAdmin/maintenance/maintenanceLotDetails';
import CreateMaintenanceInward from '@/pages/superAdmin/maintenance/createMaintenanceInward';
import { createOtherStoreInward } from '@/api/otherstoresInward.api';
import ViewOtherStoreInward from '@/pages/superAdmin/otherstores/viewOtherstoreInward';
import OtherStoreInwardAll from '@/pages/superAdmin/otherstores/otherstoresInwardAll';
import OtherStoreInventory from '@/pages/superAdmin/otherstores/otherstoresInventoryAll';
import OtherStoreInventoryView from '@/pages/superAdmin/otherstores/otherstoresInventoryView';
import OtherStoreInventoryEdit from '@/pages/superAdmin/otherstores/otherstoresInventoryEdit';
import OtherStoreLotDetails from '@/pages/superAdmin/otherstores/otherstoresLotDetails';
import CreateOtherStoreInward from '@/pages/superAdmin/otherstores/createOtherstoresInward';
import NewOutwardManagement from '@/pages/superAdmin/assetoutward/outwardManagement';
import NewOutwardDetails from '@/pages/superAdmin/assetoutward/outwardDetails';
import UpdateNewOutward from '@/pages/superAdmin/assetoutward/updateOutward';
import CreateNewOutward from '@/pages/superAdmin/assetoutward/createAssetoutward';
import InventoryView from '@/pages/inventorylot/inventoryView';
import CreateInventory from '@/pages/inventorylot/inventoryCreate';
import TrimsReport from '@/pages/superAdmin/purchaseorder/reports/TrimsReport';
import FabricPO from '@/pages/superAdmin/purchaseorder/reports/FabricReport';
import SampleJobCardCreate from '@/pages/superAdmin/sample-job-card/SampleJobCardCreate';
import SampleJobCardEdit from '@/pages/superAdmin/sample-job-card/SampleJobCardEdit';
import SampleJobCardList from '@/pages/superAdmin/sample-job-card/SampleJobCardList';
import QuotationList from '@/pages/superAdmin/quotation/QuotationList';
import QuotationCreate from '@/pages/superAdmin/quotation/Quotation';
import ProductStyleCategoryList from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryList';
import ProductStyleCategoryCreate from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryCreate';
import ProductStyleCategoryView from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryView';
import ProductStyleCategoryEdit from '@/pages/superAdmin/productstylecategory/ProductStyleCategoryEdit';
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';
import FinalPiPoCreate from '@/pages/superAdmin/quotation/FinalPiPoCreate';
import FinalPiPoView from '@/pages/superAdmin/quotation/FinalPiPoView';
import ViewQuotation from '@/pages/superAdmin/quotation/ViewQuotation';
import QualityReports from '@/pages/quality/QualityReports';
import TimingPage from '@/pages/jobcards/workflow/TimingPage';
import AllNotifications from '@/pages/notifications/AllNotifications';
import FabricQcReportTable from '@/pages/fabricQcReport/FabricQcReportTable';
import FabricQcReportForm from '@/pages/fabricQcReport/FabricQcReportForm';
import EditFabricQcReport from '@/pages/fabricQcReport/EditFabricQcReport';
import ViewFabricQcReport from '@/pages/fabricQcReport/ViewFabricQcReport';

// ✅ Sample Report
import ListSampleReports from '@/pages/superAdmin/sampleReport/ListSampleReports';
import CreateSampleReport from '@/pages/superAdmin/sampleReport/CreateSampleReport';
import EditSampleReport from '@/pages/superAdmin/sampleReport/EditSampleReport';

// ✅ Daily Sales Report
import ListDailySalesReports from '@/pages/superAdmin/dailySalesReport/ListDailySalesReports';
import CreateDailySalesReport from '@/pages/superAdmin/dailySalesReport/CreateDailySalesReport';
import EditDailySalesReport from '@/pages/superAdmin/dailySalesReport/EditDailySalesReport';
import EditAssetMaterialInwardQc from '@/pages/superAdmin/assetmaterialinwardqc/editmaterialinwardqc';
import CreateAssetInventory from '@/pages/superAdmin/assetinventory/assetInventoryCreate';
import CreateMaintenanceInventory from '@/pages/superAdmin/maintenance/createMaintenanceInventory';
import CreateOtherStoreInventory from '@/pages/superAdmin/otherstores/CreateOtherstoresInventory';
import CreateStock from '@/pages/superAdmin/stock/createstock';
import ViewStock from '@/pages/superAdmin/stock/viewstock';
import UpdateLotDetailsPage from '@/pages/srsjobcard/workorder/UpdateLotDetailsPage';
import FinalQcReportTable from '@/pages/fqcReport/FinalqcReport';
import FinalQcReportForm from '@/pages/fqcReport/FinalqcReportForm';
import EditFinalQcReport from '@/pages/fqcReport/EditFinalqcReport';
import ViewFinalQcReport from '@/pages/fqcReport/ViewFinalqcReport';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const adminRoutes = [
  {
    path: '/admin',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/admin', element: <Navigate to="/admin/dashboard" /> },
      { path: '/admin/dashboard', element: <Dashboard /> },

      { path: '/admin/vendor', element: <Vendor /> },
      { path: '/admin/vendor/:id', element: <ViewVendor /> },
      { path: '/admin/vendor/create', element: <AddVendor /> },
      { path: '/admin/vendor/edit/:id', element: <EditVendor /> },

      { path: '/admin/bom', element: <BOM /> },
      { path: '/admin/bom/create', element: <CreateBom /> },
      { path: '/admin/bom/edit/:id', element: <EditBom /> },

      { path: '/admin/productmaster/', element: <IndexUpdate /> }, // own
      //test
      { path: '/admin/productmaster/create', element: <ProductCreation /> },
      { path: '/admin/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/admin/productmaster/edit/:id', element: <EditProduct /> },

      { path: '/admin/purchaseindent/', element: <PurchaseIndent /> },
      { path: '/admin/purchaseindent/create', element: <PurchaseIndentCreate /> },
      { path: '/admin/purchaseindent/edit/:id', element: <PurchaseIndentEdit /> },

      { path: '/admin/purchaseorder/', element: <PurchaseOrder /> },
      { path: '/admin/purchaseorder/create', element: <CreatePurchaseOrder /> },
      { path: '/admin/purchaseorder/:id', element: <ViewPurchaseOrder /> },
      { path: '/admin/purchaseorder/:id/report', element: <FabricPO /> },
      { path: '/admin/purchaseorder/edit/:id', element: <EditPurchaseOrder /> },

      { path: '/admin/material-inward-qc', element: <InwardMaterialsQc /> },
      { path: '/admin/material-inward-qc/:id', element: <ViewInwardMaterialQc /> },
      { path: '/admin/material-inward-qc/create', element: <CreateInwardMaterialQc /> },
      { path: '/admin/material-inward-qc/edit/:id', element: <EditInwardMaterialQc /> },

      // Fabric QC Report
      { path: '/admin/fabric-qc-report', element: <FabricQcReportTable /> },
      { path: '/admin/fabric-qc-report/create', element: <FabricQcReportForm /> },
      { path: '/admin/fabric-qc-report/edit/:id', element: <EditFabricQcReport /> },
      { path: '/admin/fabric-qc-report/:id', element: <ViewFabricQcReport /> },

      // Final QC Report routes
      { path: '/admin/final-qc-report', element: <FinalQcReportTable /> },
      { path: '/admin/final-qc-report/create', element: <FinalQcReportForm /> },
      { path: '/admin/final-qc-report/edit/:id', element: <EditFinalQcReport /> },
      { path: '/admin/final-qc-report/:id', element: <ViewFinalQcReport /> },

      { path: '/admin/material-inward/create', element: <CreateMaterialInward /> },
      { path: '/admin/material-inward/:id', element: <ViewMaterialInward /> },
      { path: '/admin/material-inward', element: <InwardMaterialAll /> },

      { path: '/admin/asset-inward/create', element: <CreateAssetInward /> },
      { path: '/admin/asset-inward/:id', element: <ViewAssetInward /> },
      { path: '/admin/asset-inward', element: <AssetInwardAll /> },

      { path: '/admin/users', element: <Users /> },
      { path: '/admin/users/create', element: <AddUser /> },
      { path: '/admin/users/edit/:id', element: <EditUser /> },

      { path: '/admin/vendors/:tabId?', element: <Vendors /> },
      { path: '/admin/vendors/create', element: <AddVendor /> },
      { path: '/admin/vendors/edit/:id', element: <EditVendor /> },
      // VIEW VENDOR
      { path: '/admin/vendors/view/:id', element: <ViewVendor /> },

      { path: '/admin/dealers/create', element: <AddDealers /> },
      { path: '/admin/dealers/edit/:id', element: <EditDealers /> },
      { path: '/admin/dealers/view/:id', element: <ViewDealers /> },

      { path: '/admin/job-cards', element: <JobCards /> },
      { path: '/admin/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/admin/job-cards/create', element: <CreateJobCard /> },
      { path: '/admin/job-cards/edit/:id', element: <EditJobCard /> },

      // SRS Job Card routes
      { path: '/admin/srs-jobcard', element: <SrsJobCards /> },
      { path: '/admin/srs-jobcard/view/:id', element: <ViewSrsJobCard /> },
      { path: '/admin/srs-jobcard/create', element: <CreateSrsJobCard /> },
      { path: '/admin/srs-jobcard/edit/:id', element: <EditSrsJobCard /> },
      { path: '/admin/srs-jobcard/workorders/:id', element: <SrsJobCardWorkOrders /> },
      { path: '/admin/srs-jobcard/workorder/create/:jobCardId', element: <CreateSrsWorkOrder /> },
      { path: '/admin/srs-jobcard/workorder/view/:jobCardId', element: <ViewSrsWorkOrders /> },
      {
        path: '/admin/srs-jobcard/workorder/view/:jobCardId/lots',
        element: <UpdateLotDetailsPage />,
      },

      { path: '/admin/quality-reports', element: <QualityReports /> },
      { path: '/admin/job-card/workorder/:jobCardId', element: <CreateWorkOrder /> },
      { path: '/admin/job-card/workorder/:jobCardId/view', element: <WorkOrders /> },
      { path: '/admin/job-card/workorder/return-goods/:workOrderId', element: <ReturnGoods /> },
      {
        path: '/admin/job-card/workorder/recutting/:workOrderId',
        element: <RecuttingWorkOrders />,
      },
      {
        path: '/admin/job-card/workorder/recutting/:workOrderId/create',
        element: <CreateRecuttingWorkOrder />,
      },
      {
        path: '/admin/job-card/workorder/:jobCardId/view/:workOrderId',
        element: <ViewWorkOrderDetails />,
      },
      {
        path: '/admin/job-card/workorder/:workOrderId/department/:department',
        element: <WorkorderDepartmentPage />,
      },

      // fgstore
      { path: '/admin/inventory/stocks', element: <StockMatrixPage /> },

      { path: '/admin/fgstore', element: <FGstore /> },
      { path: '/admin/fgstore/requests', element: <FGStoreRequest /> },
      { path: '/admin/fgstore/defects', element: <FGStoreDefects /> },
      { path: '/admin/fgstore/stocks', element: <FGstoreStocks /> },
      { path: '/admin/fgstore/stocks/:id', element: <ViewStock /> },
      { path: '/admin/fgstore/stocks/create', element: <CreateStock /> },
      { path: '/admin/fgstore/outward', element: <StockOutward /> },
      { path: '/admin/fgstore/create/stockoutward', element: <CreateStockOutward /> },
      { path: '/admin/fgstore/create/stockinward', element: <CreateStockInward /> },
      { path: '/admin/fgstore/stockinward/:id', element: <ViewStockInward /> },

      { path: '/admin/inventory', element: <ProductInventory /> },
      { path: '/admin/inventory/create', element: <CreateInventory /> },
      { path: '/admin/inventory/lots/:department/:inventoryId', element: <ViewLotDetails /> }, //own

      //own
      { path: `/admin/inventory/:department/:id`, element: <InventoryView /> },
      { path: '/admin/inventory/edit/:department/:id', element: <InventoryEdit /> },

      { path: '/admin/outward', element: <OutwardManagement /> },
      { path: '/admin/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/admin/outward/edit/:department/:id', element: <UpdateOutward /> },

      // Main Asset Inventory listing page
      { path: '/admin/asset-inventory', element: <AssetInventory /> },
      { path: '/admin/asset-inventory/create', element: <CreateAssetInventory /> },

      // View Asset Inventory details
      { path: '/admin/asset-inventory/:assetType/:id', element: <AssetInventoryView /> },

      // Edit Asset Inventory
      { path: '/admin/asset-inventory/edit/:assetType/:id', element: <AssetInventoryEdit /> },

      // View Asset Lot details
      { path: '/admin/asset-inventory/lots/:assetType/:inventoryId', element: <AssetLotDetails /> },

      // Maintenance routes
      { path: '/admin/maintenance-inward/create', element: <CreateMaintenanceInward /> },
      { path: '/admin/maintenance-inward/:id', element: <ViewMaintenanceInward /> },
      { path: '/admin/maintenance-inward', element: <MaintenanceInwardAll /> },
      { path: '/admin/maintenance-inventory', element: <MaintenanceInventory /> },
      { path: '/admin/maintenance-inventory/create', element: <CreateMaintenanceInventory /> },
      {
        path: '/admin/maintenance-inventory/:maintenanceType/:id',
        element: <MaintenanceInventoryView />,
      },
      {
        path: '/admin/maintenance-inventory/edit/:maintenanceType/:id',
        element: <MaintenanceInventoryEdit />,
      },
      {
        path: '/admin/maintenance-inventory/lots/:maintenanceType/:inventoryId',
        element: <MaintenanceLotDetails />,
      },

      { path: '/admin/otherstore-inward/create', element: <CreateOtherStoreInward /> },
      { path: '/admin/otherstore-inward/:id', element: <ViewOtherStoreInward /> },
      { path: '/admin/otherstore-inward', element: <OtherStoreInwardAll /> },
      { path: '/admin/otherstore-inventory', element: <OtherStoreInventory /> },
      { path: '/admin/otherstore-inventory/create', element: <CreateOtherStoreInventory /> },
      { path: '/admin/otherstore-inventory/:itemType/:id', element: <OtherStoreInventoryView /> },

      {
        path: '/admin/otherstore-inventory/edit/:itemType/:id',
        element: <OtherStoreInventoryEdit />,
      },
      {
        path: '/admin/otherstore-inventory/lots/:itemType/:inventoryId',
        element: <OtherStoreLotDetails />,
      },

      { path: '/admin/work-flow/:workorderId', element: <WorkflowDetails /> },
      { path: '/admin/work-flow/:workorderId/update', element: <TimingPage /> },

      { path: '/admin/orders', element: <AllOrders /> },
      { path: '/admin/orders/create', element: <CreateOrderPage /> },
      { path: '/admin/orders/view/:id', element: <ViewOrder /> },
      { path: '/admin/orders/edit/:id', element: <EditOrder /> },

      //asset management
      { path: '/admin/assetmanagement', element: <Assetmanagement /> },
      { path: '/admin/viewassetmanagement', element: <ViewAssetmanagement /> },
      { path: '/admin/viewoneassetmanagement/:id', element: <ViewOneassetmanagement /> },

      //asset indent
      { path: '/admin/assetindent', element: <AssetIndent /> },
      { path: '/admin/assetindent/create', element: <Assetindentcreate /> },
      { path: '/admin/assetindent/edit/:id', element: <EditAssesIndent /> },
      { path: '/admin/assetindent/view/:id', element: <ViewAssetIndent /> },

      //asset vendor
      { path: '/admin/assetvendor', element: <Assetvendor /> },
      { path: '/admin/assetvendor/create', element: <AssetvendorCreate /> },
      { path: '/admin/assetvendor/view/:id', element: <AssetVendorView /> },
      { path: '/admin/assetvendor/edit/:id', element: <AssetVendoredit /> },

      //Asset Purchase Order
      { path: '/admin/assetpurchaseorder', element: <AssetPurchaseOrder /> },
      { path: '/admin/assetpurchaseorder/create', element: <AssetPurchaseOrderCreate /> },
      { path: '/admin/assetpurchaseorder/view/:id', element: <ViewAssetPurchaseOrder /> },
      { path: '/admin/assetpurchaseorder/edit/:id', element: <EditAssetPurchaseOrder /> },

      // assetmaterialinwardqc
      { path: '/admin/asset-material-inward-qc/create', element: <CreateAssetMaterialInwardQc /> },
      { path: '/admin/asset-material-inward-qc/:id', element: <ViewAssetMaterialInwardQc /> },
      { path: '/admin/asset-material-inward-qc/edit/:id', element: <EditAssetMaterialInwardQc /> },
      { path: '/admin/asset-material-inward-qc', element: <AssetMaterialInwardQcAll /> },

      // Sample Pattern Routes
      { path: '/admin/samplepattern', element: <SamplePatternList /> },
      { path: '/admin/samplepattern/create', element: <SamplePatternCreate /> },
      { path: '/admin/samplepattern/edit/:id', element: <SamplePatternEdit /> },

      // Approved Sample Routes
      { path: '/admin/approvedsample', element: <ApprovedSampleList /> },
      { path: '/admin/approvedsample/create', element: <ApprovedSampleCreate /> },
      { path: '/admin/approvedsample/edit/:id', element: <ApprovedSampleEdit /> },

      // ✅ Sample Report routes
      { path: '/admin/sample-report', element: <ListSampleReports /> },
      { path: '/admin/sample-report/create', element: <CreateSampleReport /> },
      { path: '/admin/sample-report/edit/:id', element: <EditSampleReport /> },

      // ✅ Daily Sales Report routes
      { path: '/admin/daily-sales-report', element: <ListDailySalesReports /> },
      { path: '/admin/daily-sales-report/create', element: <CreateDailySalesReport /> },
      { path: '/admin/daily-sales-report/edit/:id', element: <EditDailySalesReport /> },

      // All Notifications
      { path: '/admin/all-notifications', element: <AllNotifications /> },

      { path: '/admin/lead', element: <LeadList /> },
      { path: '/admin/lead/create', element: <LeadCreate /> },
      { path: '/admin/lead/edit/:id', element: <LeadEdit /> },

      { path: '/admin/samplejobcard', element: <SampleJobCardList /> },
      { path: '/admin/samplejobcard/create', element: <SampleJobCardCreate /> },
      { path: '/admin/samplejobcard/edit/:id', element: <SampleJobCardEdit /> },

      { path: '/admin/asset-outward', element: <NewOutwardManagement /> },
      { path: '/admin/asset-outward/create/:department', element: <CreateNewOutward /> },
      { path: '/admin/asset-outward/view/:department/:id', element: <NewOutwardDetails /> },
      { path: '/admin/asset-outward/edit/:department/:id', element: <UpdateNewOutward /> },

      { path: '/admin/quotation', element: <QuotationList /> },
      { path: '/admin/quotation/create', element: <QuotationCreate /> },
      { path: '/admin/quotation/edit/:id', element: <QuotationCreate /> },
      { path: '/admin/quotation/finalpipo/create/:quotationId', element: <FinalPiPoCreate /> },
      { path: '/admin/quotation/finalpipo/view/:finalPiPoId', element: <FinalPiPoView /> },
      { path: '/admin/quotation/view/:id', element: <ViewQuotation /> },

      { path: '/admin/productstylecategory', element: <ProductStyleCategoryList /> },
      { path: '/admin/productstylecategory/create', element: <ProductStyleCategoryCreate /> },
      { path: '/admin/productstylecategory/view/:id', element: <ProductStyleCategoryView /> },
      { path: '/admin/productstylecategory/edit/:id', element: <ProductStyleCategoryEdit /> },

      { path: '/admin/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/admin/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/admin/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      {
        path: '/admin/employee-performance/daily-work-report/list',
        element: <DailyWorkReportList />,
      },
      { path: '/admin/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      {
        path: '/admin/employee-performance/daily-work-report/create',
        element: <DailyWorkReport />,
      },
      {
        path: '/admin/employee-performance/chart/view/:id',
        element: <EmployeePerformanceChartView />,
      },
      {
        path: '/admin/employee-performance/chart/edit/:id',
        element: <EmployeePerformanceChartEdit />,
      },
      {
        path: '/admin/employee-performance/daily-work-report/view/:id',
        element: <DailyWorkReportView />,
      },
      {
        path: '/admin/employee-performance/daily-work-report/edit/:id',
        element: <DailyWorkReportEdit />,
      },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/', element: <Navigate to="/admin/dashboard" /> },
  { path: '/login', element: <Navigate to="/admin/dashboard" /> },
  { path: '/error/404', element: <Error /> },
];
export default adminRoutes;
