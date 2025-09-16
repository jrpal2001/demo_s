import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserType } from '@/store/auth/AuthSlice';

import adminRoutes from '@/routes/AdminRoutes';
import guestRoutes from '@/routes/GuestRoutes';
import merchandiserRoutes from '@/routes/MerchandiserRoutes';
import superMerchandiserRoutes from '@/routes/SuperMerchandiserRoutes';
import purchaseRoutes from './PurchaseRoutes';
import trimsAndMachinePartsStoreRoutes from './TrimsAndMachinePartsStoreRoutes';
import fabricHeadRoutes from './FabricHeadRoutes';
import administrationRoutes from '@/routes/AdministrationRoutes';
import accountRoutes from '@/routes/AccountRoutes';
import trimsandaccessoriesRoutes from './TrimsAndMachinePartsStoreRoutes';
import cuttingRoutes from './CuttingRoutes';
import productionRoutes from './ProductionRoutes';
import partsProductionRoutes from './PartsProductionRoutes';
import embroideryRoutes from './EmbroideryRoutes';
import finishingRoutes from './FinishingRoutes';
import fgstoreRoutes from './FgStoreRoutes';
import fgstoreInwardRoutes from './FgStoreInwardRoutes';
import fgstoreOutwardRoutes from './FgStoreOutwardRoutes';
import ordermanagementRoutes from './OrderManagementRoutes';
import assetRoutes from './AssetRoutes';
import accessoriesRoutes from './AccessoriesRoutes';
import maintenanceRoutes from './MaintenanceRoutes';
import otherStoresRoutes from './OtherStoresRoutes';
import leadManagerRoutes from './LeadManagerRoutes';
import salesRoutes from './SalesRoutes';
import qualityRoutes from './QualityRoutes';

function RouteLoader() {
  const userType = useSelector(selectUserType);
  console.log('🚀 ~ RouteLoader ~ userType:', userType);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log('🚀 ~ RouteLoader ~ isAuthenticated:', isAuthenticated);

  let routes;

  const user = userType[0]?.toLowerCase();
  console.log('🚀 ~ RouteLoader ~ user:', user);

  if (!isAuthenticated) {
    routes = guestRoutes;
  } else if (user === 'superadmin') {
    routes = adminRoutes;
  } else if (user === 'merchandiser') {
    routes = merchandiserRoutes;
  } else if (user === 'supermerchandiser') {
    routes = superMerchandiserRoutes;
  } else if (user === 'purchase') {
    routes = purchaseRoutes;
  } else if (user === 'trimsandmachinepartsstore') {
    routes = trimsAndMachinePartsStoreRoutes;
  } else if (user === 'fabric') {
    routes = fabricHeadRoutes;
  } else if (user === 'administration') {
    routes = administrationRoutes;
  } else if (user === 'accounts') {
    routes = accountRoutes;
  } else if (user === 'trimsandaccessories') {
    routes = trimsandaccessoriesRoutes;
  } else if (user === 'cutting') {
    routes = cuttingRoutes;
  } else if (user === 'production') {
    routes = productionRoutes;
  } else if (user === 'partsproduction') {
    routes = partsProductionRoutes;
  } else if (user === 'finishing') {
    routes = finishingRoutes;
  } else if (user === 'embroidery') {
    routes = embroideryRoutes;
  } else if (user === 'fgstore') {
    routes = fgstoreRoutes;
  } else if (user === 'fgstoreinward') {
    routes = fgstoreInwardRoutes;
  } else if (user === 'fgstoreoutward') {
    routes = fgstoreOutwardRoutes;
  } else if (user === 'ordermanagement') {
    routes = ordermanagementRoutes;
  } else if (user === 'asset') {
    routes = assetRoutes;
  } else if (user === 'accessories') {
    routes = accessoriesRoutes;
  } else if (user === 'maintenance') {
    routes = maintenanceRoutes;
  } else if (user === 'otherstores') {
    routes = otherStoresRoutes;
  } else if (user === 'leadmanager') {
    routes = leadManagerRoutes;
  } else if (user === 'salesexecutive') {
    routes = salesRoutes;
  } else if (user === 'quality') {
    routes = qualityRoutes;
  } else {
    routes = []; // Handle unknown user types or unauthorized access
  }

  return useRoutes(routes);
}

export default RouteLoader;
