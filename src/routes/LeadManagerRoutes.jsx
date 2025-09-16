import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { TabConfigProvider } from '@/context/TabConfigContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import Dashboard from '../pages/superAdmin/dashboard';
import LeadList from '@/pages/superAdmin/lead/LeadManagement';
import LeadCreate from '@/pages/superAdmin/lead/LeadCreate';
import LeadEdit from '@/pages/superAdmin/lead/LeadEdit';
import SamplePatternList from '@/pages/superAdmin/samplepattern/SamplepatternList';
import SamplePatternCreate from '@/pages/superAdmin/samplepattern/SamplepatternCreate';
import SamplePatternEdit from '@/pages/superAdmin/samplepattern/SamplepatternEdit';
import ApprovedSampleCreate from '@/pages/superAdmin/approvedsample/ApprovedsampleCreate';
import ApprovedSampleEdit from '@/pages/superAdmin/approvedsample/ApprovedsampleEdit';
import ApprovedSampleList from '@/pages/superAdmin/approvedsample/ApprovedsampleList';
import Error from '@/pages/error/Error';

// Additional imports for missing routes
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

const leadManagerRoutes = [
  // Add route for root path to redirect to leadmanager dashboard
  { path: '/', element: <Navigate to="/leadmanager/dashboard" /> },
  {
    path: '/leadmanager',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/leadmanager', element: <Navigate to="/leadmanager/dashboard" /> },
      { path: '/leadmanager/dashboard', element: <Dashboard /> },
      { path: '/leadmanager/lead', element: <LeadList /> },
      { path: '/leadmanager/lead/create', element: <LeadCreate /> },
      { path: '/leadmanager/lead/edit/:id', element: <LeadEdit /> },
      { path: '/leadmanager/samplepattern', element: <SamplePatternList /> },
      { path: '/leadmanager/samplepattern/create', element: <SamplePatternCreate /> },
      { path: '/leadmanager/samplepattern/edit/:id', element: <SamplePatternEdit /> },
      { path: '/leadmanager/approvedsample', element: <ApprovedSampleList /> },
      { path: '/leadmanager/approvedsample/create', element: <ApprovedSampleCreate /> },
      { path: '/leadmanager/approvedsample/edit/:id', element: <ApprovedSampleEdit /> },

      // Employee Performance Routes
      { path: '/leadmanager/employee-performance', element: <Navigate to="/leadmanager/employee-performance/chart" /> },
      { path: '/leadmanager/employee-performance/chart', element: <EmployeePerformanceChart /> },
      { path: '/leadmanager/employee-performance/chart/list', element: <EmployeePerformanceChartList /> },
      { path: '/leadmanager/employee-performance/chart/create', element: <EmployeePerformanceChart /> },
      { path: '/leadmanager/employee-performance/chart/view/:id', element: <EmployeePerformanceChartView /> },
      { path: '/leadmanager/employee-performance/chart/edit/:id', element: <EmployeePerformanceChartEdit /> },
      { path: '/leadmanager/employee-performance/daily-work-report', element: <DailyWorkReport /> },
      { path: '/leadmanager/employee-performance/daily-work-report/list', element: <DailyWorkReportList /> },
      { path: '/leadmanager/employee-performance/daily-work-report/create', element: <DailyWorkReport /> },
      { path: '/leadmanager/employee-performance/daily-work-report/view/:id', element: <DailyWorkReportView /> },
      { path: '/leadmanager/employee-performance/daily-work-report/edit/:id', element: <DailyWorkReportEdit /> },

      // leadmanager/purchaseindent
      { path: '/leadmanager/purchaseindent', element: <PurchaseIndent /> },
      { path: '/leadmanager/purchaseindent/create', element: <PurchaseIndentCreate /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default leadManagerRoutes;
