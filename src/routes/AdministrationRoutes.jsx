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
import OutwardManagement from '@/pages/superAdmin/outward/OutwardManagement';
import OutwardDetails from '@/pages/superAdmin/outward/ViewOutwardDetails';
import UpdateOutward from '@/pages/superAdmin/outward/UpdateOutwardDetails';
import Assetmanagement from '@/components/assetmanagement/Assetmanagement';
import ViewAssetmanagement from '@/components/assetmanagement/viewAssetmanagement';
import ViewOneassetmanagement from '@/components/assetmanagement/viewOneassetmanagement';
import Error from '@/pages/error/Error';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));

const administrationRoutes = [
  {
    path: '/administration',
    element: (
      <TabConfigProvider>
        <FullLayout />
      </TabConfigProvider>
    ),
    children: [
      { path: '/administration', element: <Navigate to="/administration/dashboard" /> },
      { path: '/administration/dashboard', element: <Dashboard /> },
      { path: '/administration/indent', element: <PurchaseIndent /> },
      { path: '/administration/indent/create', element: <PurchaseIndentCreate /> },
      { path: '/administration/indent/edit/:id', element: <PurchaseIndentEdit /> },
      { path: '/administration/inward', element: <InwardMaterialAll /> },
      { path: '/administration/inward/create', element: <CreateMaterialInward /> },
      { path: '/administration/inward/:id', element: <ViewMaterialInward /> },
      { path: '/administration/outward', element: <OutwardManagement /> },
      { path: '/administration/outward/view/:department/:id', element: <OutwardDetails /> },
      { path: '/administration/outward/edit/:department/:id', element: <UpdateOutward /> },
      { path: '/administration/asset', element: <Assetmanagement /> },
      { path: '/administration/asset/view', element: <ViewAssetmanagement /> },
      { path: '/administration/asset/view/:id', element: <ViewOneassetmanagement /> },
      // /administration/purchaseindent
      { path: '/administration/purchaseindent', element: <PurchaseIndent /> },
      { path: '/administration/purchaseindent/create', element: <PurchaseIndentCreate /> },

      { path: '*', element: <Navigate to="/error/404" /> },
    ],
  },
  { path: '/error/404', element: <Error /> },
];

export default administrationRoutes;
