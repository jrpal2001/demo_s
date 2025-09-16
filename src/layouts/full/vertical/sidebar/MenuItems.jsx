import { useSelector } from 'react-redux';
import { selectUserType } from '@/store/auth/AuthSlice';
import {
  AdminMenuItems,
  MerchandiserMenuItems,
  SuperMerchandiserMenuItems,
  AdministrationMenuItems,
  AccountsMenuItems,
  PurchaseMenuItems,
  TrimsAndMachinePartsStoreMenuItems,
  FabricMenuItems,
  TrimsMenuItems,
  CuttingMenuItems,
  ProductionMenuItems,
  PartsProductionMenuItems,
  FinishingMenuItems,
  FgStoreMenuItems,
  FgStoreInwardMenuItems,
  FgStoreOutwardMenuItems,
  EmbroideryMenuItems,
  OrderManagementMenuItems,
  AssetMenuItems,
  AccessoriesMenuItems,
  MaintenanceMenuItems,
  OtherStoresMenuItems,
  LeadManagerMenuItems,
  SalesMenuItems,
  QualityMenuItems,
} from './MenuItems/MenuItems';
import departmentAccessRules from '@/utils/departmentAccessRules'; // (You will need to create this file with the provided JSON)

// useMenuItems Hook
const useMenuItems = () => {
  const userType = useSelector(selectUserType);
  let Menuitems;

  // Aligning departments with their respective menu items
  switch (userType[0]) {
    case 'Quality':
    case 'quality':
      Menuitems = QualityMenuItems;
      break;
    case 'SuperAdmin':
    case 'superAdmin':
      Menuitems = AdminMenuItems;
      break;
    case 'Merchandiser':
    case 'merchandiser':
      Menuitems = MerchandiserMenuItems;
      break;
    case 'SuperMerchandiser':
    case 'superMerchandiser':
      Menuitems = SuperMerchandiserMenuItems;
      break;
    case 'Administration':
    case 'administration':
      Menuitems = AdministrationMenuItems;
      break;
    case 'Accounts':
    case 'accounts':
      Menuitems = AccountsMenuItems;
      break;
    case 'Purchase':
    case 'purchase':
      Menuitems = PurchaseMenuItems;
      break;
    case 'TrimsAndMachinePartsStore':
    case 'trimsAndMachinePartsStore':
    case 'trimsandmachinepartsstore':
      Menuitems = TrimsAndMachinePartsStoreMenuItems;
      break;
    case 'Fabric':
    case 'fabric':
      Menuitems = FabricMenuItems;
      break;
    case 'TrimsAndAccessories':
    case 'trimsAndAccessories':
      Menuitems = TrimsMenuItems;
      break;
    case 'Cutting':
    case 'cutting':
      Menuitems = CuttingMenuItems;
      break;
    case 'Production':
    case 'production':
      Menuitems = ProductionMenuItems;
      break;
    case 'PartsProduction':
    case 'partsProduction':
      Menuitems = PartsProductionMenuItems;
      break;
    case 'Finishing':
    case 'finishing':
      Menuitems = FinishingMenuItems;
      break;
    case 'FGstore':
    case 'fgstore':
      Menuitems = FgStoreMenuItems;
      break;
    case 'FGstoreInward':
    case 'fgstoreInward':
      Menuitems = FgStoreInwardMenuItems;
      break;
    case 'FGstoreOutward':
    case 'fgstoreOutward':
      Menuitems = FgStoreOutwardMenuItems;
      break;
    case 'Embroidery':
    case 'embroidery':
      Menuitems = EmbroideryMenuItems;
      break;
    case 'OrderManagement':
    case 'orderManagement':
    case 'ordermanagement':
      Menuitems = OrderManagementMenuItems;
      break;
    case 'Asset':
    case 'asset':
      Menuitems = AssetMenuItems;
      break;
    case 'Accessories':
    case 'accessories':
      Menuitems = AccessoriesMenuItems;
      break;
    case 'Maintenance':
    case 'maintenance':
      Menuitems = MaintenanceMenuItems;
      break;
    case 'OtherStores':
    case 'otherStores':
    case 'otherstores':
      Menuitems = OtherStoresMenuItems;
      break;
    case 'LeadManager':
    case 'leadManager':
    case 'leadmanager':
      Menuitems = LeadManagerMenuItems;
      break;
    case 'SalesExecutive':
    case 'salesexecutive':
    case 'salesExecutive':
      Menuitems = SalesMenuItems;
      break;
    default:
      Menuitems = [];
  }

  // Get access rules for this department
  const access =
    departmentAccessRules[userType[0]] || departmentAccessRules[userType[0]?.toLowerCase()] || {};
  const noAccess = access.noAccess || [];

  // Helper to recursively filter menu items
  function filterMenu(items) {
    return items
      .filter((item) => !noAccess.includes(item.title))
      .map((item) => (item.children ? { ...item, children: filterMenu(item.children) } : item));
  }

  return filterMenu(Menuitems);
};

export default useMenuItems;
