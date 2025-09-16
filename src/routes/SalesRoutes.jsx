import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import LeadList from '@/pages/superAdmin/lead/LeadManagement';
import LeadCreate from '@/pages/superAdmin/lead/LeadCreate';
import LeadEdit from '@/pages/superAdmin/lead/LeadEdit';
import QuotationList from '@/pages/superAdmin/quotation/QuotationList';
import QuotationCreate from '@/pages/superAdmin/quotation/Quotation';
import ViewQuotation from '@/pages/superAdmin/quotation/ViewQuotation';
import FinalPiPoCreate from '@/pages/superAdmin/quotation/FinalPiPoCreate';
import FinalPiPoView from '@/pages/superAdmin/quotation/FinalPiPoView';
import Error from '@/pages/error/Error';
import Dashboard from '@/pages/superAdmin/dashboard';

// Additional imports for missing routes
import IndexUpdate from '@/pages/superAdmin/productmaster/indexUpdate';
import ProductCreation from '@/pages/superAdmin/productmaster/ProductCreation';
import EditProduct from '@/pages/superAdmin/productmaster/EditProduct';
import ViewProduct from '@/pages/superAdmin/productmaster/ViewProduct';
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';
import { EmployeePerformanceChart, DailyWorkReport } from '@/pages/superAdmin/employeePerformance';
import EmployeePerformanceChartList from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartList';
import DailyWorkReportList from '@/pages/superAdmin/employeePerformance/DailyWorkReportList';
import EmployeePerformanceChartView from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartView';
import EmployeePerformanceChartEdit from '@/pages/superAdmin/employeePerformance/EmployeePerformanceChartEdit';
import DailyWorkReportView from '@/pages/superAdmin/employeePerformance/DailyWorkReportView';
import DailyWorkReportEdit from '@/pages/superAdmin/employeePerformance/DailyWorkReportEdit';
import StockMatrixPage from '@/pages/superAdmin/fgstore/StocksMatrix';
import AllOrders from '@/pages/order/AllOrders';
import CreateOrderPage from '@/pages/order/OrderCreation';
import EditOrder from '@/pages/order/EditOrder';
import PurchaseIndent from '@/pages/superAdmin/purchaseindent';
import PurchaseIndentCreate from '@/pages/superAdmin/purchaseindent/PurchaseIndentCreate';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const salesRoutes = [
  // Add route for root path to redirect to salesexecutive dashboard
  { path: '/', element: <Navigate to="/salesexecutive/dashboard" /> },
  {
    path: '/salesexecutive',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/salesexecutive', element: <Navigate to="/salesexecutive/dashboard" /> },
      { path: '/salesexecutive/dashboard', element: <Dashboard /> },
      { path: '/salesexecutive/lead', element: <LeadList /> },
      { path: '/salesexecutive/lead/create', element: <LeadCreate /> },
      { path: '/salesexecutive/lead/edit/:id', element: <LeadEdit /> },
      { path: '/salesexecutive/quotation', element: <QuotationList /> },
      { path: '/salesexecutive/quotation/create', element: <QuotationCreate /> },
      { path: '/salesexecutive/quotation/edit/:id', element: <QuotationCreate /> },
      { path: '/salesexecutive/quotation/view/:id', element: <ViewQuotation /> },
      {
        path: '/salesexecutive/quotation/finalpipo/create/:quotationId',
        element: <FinalPiPoCreate />,
      },
      { path: '/salesexecutive/quotation/finalpipo/view/:finalPiPoId', element: <FinalPiPoView /> },

      // Product Master Routes
      { path: '/salesexecutive/productmaster', element: <IndexUpdate /> },
      { path: '/salesexecutive/productmaster/create', element: <ProductCreation /> },
      { path: '/salesexecutive/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/salesexecutive/productmaster/edit/:id', element: <EditProduct /> },

      // salesexecutive/purchaseindent
      { path: '/salesexecutive/purchaseindent', element: <PurchaseIndent /> },
      { path: '/salesexecutive/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Job Cards Routes
      { path: '/salesexecutive/job-cards', element: <JobCards /> },
      { path: '/salesexecutive/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/salesexecutive/job-cards/create', element: <CreateJobCard /> },
      { path: '/salesexecutive/job-cards/edit/:id', element: <EditJobCard /> },

      // Order Management Routes
      { path: '/salesexecutive/orders', element: <AllOrders /> },
      { path: '/salesexecutive/orders/create', element: <CreateOrderPage /> },
      { path: '/salesexecutive/orders/edit/:id', element: <EditOrder /> },

      // Stocks Routes
      { path: '/salesexecutive/inventory/stocks', element: <StockMatrixPage /> },

      // Employee Performance Routes
      { path: '/salesexecutive/employee-performance', element: <Navigate to="/salesexecutive/employee-performance/chart" /> },
      { path: '/salesexecutive/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/salesexecutive/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/salesexecutive/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/salesexecutive/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/salesexecutive/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/salesexecutive/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/salesexecutive/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/salesexecutive/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/salesexecutive/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/salesexecutive/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default salesRoutes;
