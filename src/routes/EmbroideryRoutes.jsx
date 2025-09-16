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
import JobCards from '@/pages/jobcards';
import ViewJobCard from '@/pages/jobcards/viewJobCard';
import CreateJobCard from '@/pages/jobcards/createJobCards';
import EditJobCard from '@/pages/jobcards/editJobCard';
import ProductInventory from '@/pages/inventory/productInventory/ProductInventory';
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

const embroideryRoutes = [
  // Add route for root path to redirect to embroidery dashboard
  { path: '/', element: <Navigate to="/embroidery/dashboard" /> },
  {
    path: '/embroidery',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/embroidery', element: <Navigate to="/embroidery/dashboard" /> },
      { path: '/embroidery/dashboard', element: <Dashboard /> },
      { path: '/embroidery/indent', element: <PurchaseIndent /> },
      { path: '/embroidery/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/embroidery/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/embroidery/inward', element: <InwardMaterialAll /> },
      { path: '/embroidery/inward/create', element: <CreateMaterialInward /> },
      { path: '/embroidery/inward/:id', element: <ViewMaterialInward /> },
      { path: '/embroidery/job-cards', element: <JobCards /> },
      { path: '/embroidery/job-cards/view/:id', element: <ViewJobCard /> },
      { path: '/embroidery/job-cards/create', element: <CreateJobCard /> },
      { path: '/embroidery/job-cards/edit/:id', element: <EditJobCard /> },
      { path: '/embroidery/inventory', element: <ProductInventory /> },

      // Product Master Routes
      { path: '/embroidery/productmaster', element: <IndexUpdate /> },
      { path: '/embroidery/productmaster/create', element: <ProductCreation /> },
      { path: '/embroidery/productmaster/view/:id', element: <ViewProduct /> },
      { path: '/embroidery/productmaster/edit/:id', element: <EditProduct /> },

      // embroidery/purchaseindent
      { path: '/embroidery/purchaseindent', element: <PurchaseIndent /> },
      { path: '/embroidery/purchaseindent/create', element: <PurchaseIndentCreate /> },

      // Quality Reports Routes
      { path: '/embroidery/quality-reports', element: <QualityReports /> },

      // Employee Performance Routes
      { path: '/embroidery/employee-performance', element: <Navigate to="/embroidery/employee-performance/chart" /> },
      { path: '/embroidery/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/embroidery/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/embroidery/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/embroidery/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/embroidery/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/embroidery/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/embroidery/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/embroidery/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/embroidery/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/embroidery/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default embroideryRoutes;
