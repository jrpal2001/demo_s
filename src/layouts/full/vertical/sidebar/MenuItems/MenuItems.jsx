import {
  IconReportAnalytics,
  IconHome2,
  IconShoppingCart,
  IconBriefcase,
  IconClipboardList,
  IconPackage,
  IconTruck,
  IconFileInvoice,
  IconUsers,
  IconBuilding,
  IconChartBar,
  IconTarget,
  IconClipboard,
  IconSettings,
  IconEye,
  IconPlus,
  IconFileText,
  IconTool,
  IconArchive,
  IconArrowRight,
  IconArrowLeft,
} from '@tabler/icons';
import { uniqueId } from 'lodash';

export const AdminMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/admin/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Product Style Category',
    icon: IconClipboardList,
    href: '/admin/productstylecategory',
  },
  {
    id: uniqueId(),
    title: 'Material Management',
    icon: IconShoppingCart,
    href: '/admin/bom',
    children: [
      {
        id: uniqueId(),
        title: 'BOM',
        icon: IconFileText,
        href: '/admin/bom',
      },
      {
        id: uniqueId(),
        title: 'Vendor',
        icon: IconBuilding,
        href: '/admin/vendor',
      },
      {
        id: uniqueId(),
        title: 'Purchase Indent',
        icon: IconFileInvoice,
        href: '/admin/purchaseindent',
      },
      {
        id: uniqueId(),
        title: 'Purchase Order',
        icon: IconShoppingCart,
        href: '/admin/purchaseorder',
      },
      {
        id: uniqueId(),
        title: 'Inward Material QC',
        icon: IconClipboard,
        href: '/admin/material-inward-qc',
      },
      {
        id: uniqueId(),
        title: 'Inward',
        icon: IconArrowRight,
        href: '/admin/material-inward',
      },
      {
        id: uniqueId(),
        title: 'Outward',
        icon: IconArrowLeft,
        href: '/admin/outward',
      },
      {
        id: uniqueId(),
        title: 'Inventory',
        icon: IconArchive,
        href: '/admin/inventory',
      },
      {
        id: uniqueId(),
        title: 'Fabric QC Report',
        icon: IconClipboard,
        href: '/admin/fabric-qc-report',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Users',
    icon: IconUsers,
    href: '/admin/users',
  },
  {
    id: uniqueId(),
    title: 'Final QC Report',
    icon: IconClipboard,
    href: '/admin/final-qc-report',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/admin/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/admin/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Fg Store',
    icon: IconArchive,
    href: '/admin/fgstore',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/admin/inventory/stocks',
  },
  // {
  //   id: uniqueId(),
  //   title: 'Order Management',
  //   icon: IconTruck,
  //   href: '/admin/orders',
  // },
  {
    id: uniqueId(),
    title: 'Quotation',
    icon: IconFileInvoice,
    href: '/admin/quotation',
  },
  {
    id: uniqueId(),
    title: 'Lead Management',
    icon: IconTarget,
    href: '/admin/lead',
  },
  {
    id: uniqueId(),
    title: 'Sample Job Card',
    icon: IconTarget,
    href: '/admin/samplejobcard',
  },

  // {
  //   id: uniqueId(),
  //   title: 'Samples',
  //   icon: IconClipboardList,
  //   href: '/admin/samplepattern',
  //   children: [
  //     {
  //       id: uniqueId(),
  //       title: 'Sample Pattern',
  //       icon: IconClipboardList,
  //       href: '/admin/samplepattern',
  //     },
  //     {
  //       id: uniqueId(),
  //       title: 'Approved Sample',
  //       icon: IconClipboard,
  //       href: '/admin/approvedsample',
  //     },
  //   ],
  // },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/admin/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/admin/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/admin/employee-performance/daily-work-report/list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Reports',
    icon: IconChartBar,
    href: '/admin/reports',
    children: [
      {
        id: uniqueId(),
        title: 'Daily Sales Report',
        icon: IconFileText,
        href: '/admin/daily-sales-report',
      },
      {
        id: uniqueId(),
        title: 'Sample Report',
        icon: IconClipboard,
        href: '/admin/sample-report',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Asset Management',
    icon: IconSettings,
    href: '/admin/assetmanagement',
    children: [
      {
        id: uniqueId(),
        title: 'Create',
        icon: IconPlus,
        href: '/admin/assetmanagement',
      },
      {
        id: uniqueId(),
        title: 'View',
        icon: IconEye,
        href: '/admin/viewassetmanagement',
      },
      {
        id: uniqueId(),
        title: 'Asset Purchase Indent',
        icon: IconFileInvoice,
        href: '/admin/assetindent',
      },
      {
        id: uniqueId(),
        title: 'Asset Vendor',
        icon: IconBuilding,
        href: '/admin/assetvendor',
      },
      {
        id: uniqueId(),
        title: 'Asset Purchase Order',
        icon: IconShoppingCart,
        href: '/admin/assetpurchaseorder',
      },
      {
        id: uniqueId(),
        title: 'Asset Material Inward Qc',
        icon: IconClipboard,
        href: '/admin/asset-material-inward-qc',
      },
      {
        id: uniqueId(),
        title: 'Asset Inward',
        icon: IconArrowRight,
        href: '/admin/asset-inward',
      },
      {
        id: uniqueId(),
        title: 'Asset Inventory',
        icon: IconArchive,
        href: '/admin/asset-inventory',
      },
      {
        id: uniqueId(),
        title: 'Maintenance Inward',
        icon: IconTool,
        href: '/admin/maintenance-inward',
      },
      {
        id: uniqueId(),
        title: 'Maintenance Inventory',
        icon: IconTool,
        href: '/admin/maintenance-inventory',
      },
      {
        id: uniqueId(),
        title: 'OtherStores Inward',
        icon: IconArrowRight,
        href: '/admin/otherstore-inward',
      },
      {
        id: uniqueId(),
        title: 'OtherStores Inventory',
        icon: IconArchive,
        href: '/admin/otherstore-inventory',
      },
      {
        id: uniqueId(),
        title: 'Asset Outward',
        icon: IconArrowLeft,
        href: '/admin/asset-outward',
      },
    ],
  },
];

export const MerchandiserMenuItems = [
  { id: uniqueId(), title: 'Dashboard', icon: IconHome2, href: '/merchandiser/dashboard' },
  {
    id: uniqueId(),
    title: 'Product Style category',
    icon: IconClipboardList,
    href: '/merchandiser/productstylecategory',
  },
  {
    id: uniqueId(),
    title: 'Purchase indent',
    icon: IconFileInvoice,
    href: '/merchandiser/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Purchase order',
    icon: IconShoppingCart,
    href: '/merchandiser/purchaseorder',
  },
  { id: uniqueId(), title: 'Job cards', icon: IconBriefcase, href: '/merchandiser/job-cards' },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/merchandiser/quality-reports',
  }, // Placeholder
  { id: uniqueId(), title: 'Stocks', icon: IconChartBar, href: '/merchandiser/stocks' }, // Placeholder
  // { id: uniqueId(), title: 'Order Management', icon: IconTruck, href: '/merchandiser/orders' },
  {
    id: uniqueId(),
    title: 'Sample Jobcard',
    icon: IconTarget,
    href: '/merchandiser/samplejobcard',
  }, // Placeholder
  {
    id: uniqueId(),
    title: 'Samples',
    icon: IconClipboardList,
    href: '/merchandiser/samplepattern',
  }, // Placeholder
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/merchandiser/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/merchandiser/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/merchandiser/employee-performance/daily-work-report/list',
      },
    ],
  },

  // viewOnly
  {
    id: uniqueId(),
    title: 'Product master',
    icon: IconPackage,
    href: '/merchandiser/productmaster',
  },
  { id: uniqueId(), title: 'BOM', icon: IconFileText, href: '/merchandiser/bom' },
  { id: uniqueId(), title: 'Vendor', icon: IconBuilding, href: '/merchandiser/vendor' },
  { id: uniqueId(), title: 'Inventory', icon: IconArchive, href: '/merchandiser/inventory' },
  {
    id: uniqueId(),
    title: 'Fabric QC report',
    icon: IconClipboard,
    href: '/merchandiser/fabric-qc-report',
  }, // Placeholder
];

export const SuperMerchandiserMenuItems = [
  // fullAccess
  { id: uniqueId(), title: 'Dashboard', icon: IconHome2, href: '/supermerchandiser/dashboard' },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/supermerchandiser/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Product Style Category',
    icon: IconClipboardList,
    href: '/supermerchandiser/productstylecategory',
  },
  { id: uniqueId(), title: 'BOM', icon: IconFileText, href: '/supermerchandiser/bom' },
  { id: uniqueId(), title: 'Vendor', icon: IconBuilding, href: '/supermerchandiser/vendor' },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/supermerchandiser/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Purchase Order',
    icon: IconShoppingCart,
    href: '/supermerchandiser/purchaseorder',
  },
  { id: uniqueId(), title: 'Job Cards', icon: IconBriefcase, href: '/supermerchandiser/job-cards' },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/supermerchandiser/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/supermerchandiser/inventory/stocks',
  },
  // { id: uniqueId(), title: 'Order Management', icon: IconTruck, href: '/supermerchandiser/orders' },
  {
    id: uniqueId(),
    title: 'Sample Job Card',
    icon: IconTarget,
    href: '/supermerchandiser/samplejobcard',
  },
  {
    id: uniqueId(),
    title: 'Samples',
    icon: IconClipboardList,
    href: '/supermerchandiser/samplepattern',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/supermerchandiser/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/supermerchandiser/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/supermerchandiser/employee-performance/daily-work-report/list',
      },
    ],
  },

  // viewOnly
  { id: uniqueId(), title: 'Inventory', icon: IconArchive, href: '/supermerchandiser/inventory' },
  {
    id: uniqueId(),
    title: 'Fabric QC Report',
    icon: IconClipboard,
    href: '/supermerchandiser/fabric-qc-report',
  }, // Placeholder: update href if needed
];

export const AdministrationMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/administration/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Indent',
    icon: IconFileInvoice,
    href: '/administration/indent',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/administration/purchaseindent',
  },

  {
    id: uniqueId(),
    title: 'Inward',
    icon: IconArrowRight,
    href: '/administration/inward',
  },
  {
    id: uniqueId(),
    title: 'Outward',
    icon: IconArrowLeft,
    href: '/administration/outward',
  },
  {
    id: uniqueId(),
    title: 'Asset Management',
    icon: IconSettings,
    href: '/administration/asset',
  },
];

export const AccountsMenuItems = [
  { id: uniqueId(), title: 'Dashboard', icon: IconHome2, href: '/accounts/dashboard' },
  
  // BOM
  { id: uniqueId(), title: 'BOM', icon: IconFileText, href: '/accounts/bom' },
  
  // Vendor
  { id: uniqueId(), title: 'Vendor', icon: IconBuilding, href: '/accounts/vendor' },
  
  // Purchase Indent
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/accounts/purchaseindent',
  },
  
  // Purchase Order
  {
    id: uniqueId(),
    title: 'Purchase Order',
    icon: IconShoppingCart,
    href: '/accounts/purchaseorder',
  },
  
  // Material Inward QC
  {
    id: uniqueId(),
    title: 'Material Inward QC',
    icon: IconClipboard,
    href: '/accounts/material-inward-qc',
  },
  
  // Inventory
  { id: uniqueId(), title: 'Inventory', icon: IconArchive, href: '/accounts/inventory' },
  
  // Fabric QC Report
  {
    id: uniqueId(),
    title: 'Fabric QC Report',
    icon: IconClipboard,
    href: '/accounts/fabric-qc-report',
  },
  
  // Job Cards
  { id: uniqueId(), title: 'Job Cards', icon: IconBriefcase, href: '/accounts/job-cards' },
  
  // Quality Reports
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/accounts/quality-reports',
  },
  
  // Stocks
  { id: uniqueId(), title: 'Stocks', icon: IconChartBar, href: '/accounts/stocks' },
  
  // Employee Performance
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/accounts/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/accounts/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/accounts/employee-performance/daily-work-report/list',
      },
    ],
  },
  
  // Asset Management
  {
    id: uniqueId(),
    title: 'Asset Management',
    icon: IconSettings,
    href: '/accounts/assetmanagement',
  },
];

export const PurchaseMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/purchase/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/purchase/productmaster',
  },
  {
    id: uniqueId(),
    title: 'BOM',
    icon: IconFileText,
    href: '/purchase/bom',
  },
  {
    id: uniqueId(),
    title: 'Vendor',
    icon: IconBuilding,
    href: '/purchase/vendor',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/purchase/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Purchase Order',
    icon: IconShoppingCart,
    href: '/purchase/purchaseorder',
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconArchive,
    href: '/purchase/inventory',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/purchase/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/purchase/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/purchase/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/purchase/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/purchase/employee-performance/daily-work-report/list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Asset Managament',
    icon: IconSettings,
    href: '/purchase/assetmanagement',
  },
];

export const TrimsAndMachinePartsStoreMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/trimsandmachinepartsstore/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/trimsandmachinepartsstore/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/trimsandmachinepartsstore/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Material Inward',
    icon: IconArrowRight,
    href: '/trimsandmachinepartsstore/material-inward',
  },
  {
    id: uniqueId(),
    title: 'Material Outward',
    icon: IconArrowLeft,
    href: '/trimsandmachinepartsstore/outward',
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconArchive,
    href: '/trimsandmachinepartsstore/inventory',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/trimsandmachinepartsstore/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/trimsandmachinepartsstore/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/trimsandmachinepartsstore/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/trimsandmachinepartsstore/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const FabricMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/fabric/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/fabric/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/fabric/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Material Inward QC',
    icon: IconClipboard,
    href: '/fabric/material-inward-qc',
  },
  {
    id: uniqueId(),
    title: 'Material Inward',
    icon: IconArrowRight,
    href: '/fabric/material-inward',
  },
  {
    id: uniqueId(),
    title: 'Material Outward',
    icon: IconArrowLeft,
    href: '/fabric/outward',
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconArchive,
    href: '/fabric/inventory',
  },
  {
    id: uniqueId(),
    title: 'Fabric QC Report',
    icon: IconClipboard,
    href: '/fabric/fabric-qc-report',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/fabric/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/fabric/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/fabric/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/fabric/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/fabric/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const TrimsMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/trimsandaccessories/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Indent',
    icon: IconFileInvoice,
    href: '/trimsandaccessories/indent',
  },
  {
    id: uniqueId(),
    title: 'Inward',
    icon: IconArrowRight,
    href: '/trimsandaccessories/inward',
  },
  {
    id: uniqueId(),
    title: 'Outward',
    icon: IconArrowLeft,
    href: '/trimsandaccessories/outward',
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconArchive,
    href: '/trimsandaccessories/inventory',
  },
  {
    id: uniqueId(),
    title: 'Category',
    icon: IconPackage,
    href: '/trimsandaccessories/category',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/trimsandaccessories/productmaster',
  },
];

export const CuttingMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/cutting/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/cutting/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/cutting/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/cutting/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/cutting/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/cutting/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/cutting/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/cutting/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const ProductionMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/production/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/production/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/production/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/production/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/production/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/production/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/production/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/production/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/production/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const PartsProductionMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/partsproduction/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/partsproduction/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/partsproduction/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/partsproduction/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/partsproduction/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/partsproduction/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/partsproduction/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/partsproduction/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const FinishingMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/finishing/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/finishing/productmaster',
  },
  {
        id: uniqueId(),
        title: 'Purchase Indent',
        icon: IconFileInvoice,
        href: '/finishing/purchaseindent',
      },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/finishing/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/finishing/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/finishing/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/finishing/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/finishing/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const FgStoreMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/fgstore/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/fgstore/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/fgstore/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/fgstore/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/fgstore/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Fg Store',
    icon: IconArchive,
    href: '/fgstore/fgstore',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/fgstore/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/fgstore/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/fgstore/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/fgstore/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const FgStoreInwardMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/fgstoreinward/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/fgstoreinward/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/fgstoreinward/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/fgstoreinward/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Fg Store',
    icon: IconArchive,
    href: '/fgstoreinward/fgstore',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/fgstoreinward/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/fgstoreinward/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/fgstoreinward/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/fgstoreinward/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const FgStoreOutwardMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/fgstoreoutward/dashboard',
  },
  {
        id: uniqueId(),
        title: 'Purchase Indent',
        icon: IconFileInvoice,
        href: '/fgstoreoutward/purchaseindent',
    },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/fgstoreoutward/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/fgstoreoutward/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Fg Store',
    icon: IconArchive,
    href: '/fgstoreoutward/fgstore',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/fgstoreoutward/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/fgstoreoutward/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/fgstoreoutward/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/fgstoreoutward/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const EmbroideryMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/embroidery/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/embroidery/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/embroidery/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/embroidery/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/embroidery/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/embroidery/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/embroidery/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/embroidery/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const OrderManagementMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/ordermanagement/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/ordermanagement/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/ordermanagement/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Stocks',
    icon: IconChartBar,
    href: '/ordermanagement/inventory/stocks',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/ordermanagement/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/ordermanagement/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/ordermanagement/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const AssetMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
            href: '/asset/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
            href: '/asset/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
            href: '/asset/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
            href: '/asset/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
                  href: '/asset/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
                  href: '/asset/employee-performance/daily-work-report/list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Asset Managament',
    icon: IconSettings,
            href: '/asset/assetmanagement',
  },
];

export const AccessoriesMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/accessories/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/accessories/productmaster',
  },
   {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/accessories/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Material Inward',
    icon: IconArrowRight,
    href: '/accessories/material-inward',
  },
  {
    id: uniqueId(),
    title: 'Material Outward',
    icon: IconArrowLeft,
    href: '/accessories/outward',
  },
  {
    id: uniqueId(),
    title: 'Inventory',
    icon: IconArchive,
    href: '/accessories/inventory',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/accessories/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/accessories/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/accessories/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/accessories/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const MaintenanceMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/maintenance/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/maintenance/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/maintenance/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/maintenance/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/maintenance/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/maintenance/employee-performance/daily-work-report/list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Maintenance',
    icon: IconSettings,
    href: '/maintenance/maintenance',
  },
];

export const OtherStoresMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/otherstores/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/otherstores/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/otherstores/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/otherstores/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/otherstores/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/otherstores/employee-performance/daily-work-report/list',
      },
    ],
  },
  {
    id: uniqueId(),
    title: 'Other Stores',
    icon: IconSettings,
    href: '/otherstores/otherstores',
  },
];

export const LeadManagerMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/leadmanager/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Lead Management',
    icon: IconTarget,
    href: '/leadmanager/lead',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/leadmanager/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/leadmanager/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/leadmanager/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/leadmanager/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const SalesMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/salesexecutive/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/salesexecutive/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/salesexecutive/purchaseindent',
  },
      {
      id: uniqueId(),
      title: 'Job Cards',
      icon: IconBriefcase,
      href: '/salesexecutive/job-cards',
    },
    // {
    //   id: uniqueId(),
    //   title: 'Order Management',
    //   icon: IconTruck,
    //   href: '/salesexecutive/orders',
    // },
    {
      id: uniqueId(),
      title: 'Stocks',
      icon: IconChartBar,
      href: '/salesexecutive/inventory/stocks',
    },
  {
    id: uniqueId(),
    title: 'Lead Management',
    icon: IconTarget,
    href: '/salesexecutive/lead',
  },
  {
    id: uniqueId(),
    title: 'Quotation',
    icon: IconFileInvoice,
    href: '/salesexecutive/quotation',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/salesexecutive/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/salesexecutive/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/salesexecutive/employee-performance/daily-work-report/list',
      },
    ],
  },
];

export const QualityMenuItems = [
  {
    navlabel: true,
    subheader: 'Home',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconHome2,
    href: '/quality/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Product Master',
    icon: IconPackage,
    href: '/quality/productmaster',
  },
  {
    id: uniqueId(),
    title: 'Purchase Indent',
    icon: IconFileInvoice,
    href: '/quality/purchaseindent',
  },
  {
    id: uniqueId(),
    title: 'Job Cards',
    icon: IconBriefcase,
    href: '/quality/job-cards',
  },
  {
    id: uniqueId(),
    title: 'Quality Reports',
    icon: IconClipboard,
    href: '/quality/quality-reports',
  },
  {
    id: uniqueId(),
    title: 'Employee Performance',
    icon: IconReportAnalytics,
    href: '/quality/employee-performance',
    children: [
      {
        id: uniqueId(),
        title: 'Employee Performance Chart',
        icon: IconClipboardList,
        href: '/quality/employee-performance/chart/list',
      },
      {
        id: uniqueId(),
        title: 'Daily Work Report',
        icon: IconClipboardList,
        href: '/quality/employee-performance/daily-work-report/list',
      },
    ],
  },
];
