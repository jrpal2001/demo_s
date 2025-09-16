const departmentAccessRules = {
  Accounts: {
    fullAccess: [
      'Dashboard',
      'Vendor',
      'Quality Reports',
      'Stocks',
      'Order Management',
      'Employee Performance',
      'Asset Managament'
    ],
    viewOnly: [
      'BOM',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Inventory',
      'Fabric QC report',
      'Job cards'
    ],
    noAccess: [
      'Product master',
      'Product Style category',
      'Material inward',
      'Material outward',
      'FG store',
      'Quotation',
      'Lead management',
      'Users',
      'Sample Jobcard',
      'Samples'
    ]
  },
  Merchandiser: {
    fullAccess: [
      'Dashboard',
      'Product Style category',
      'Purchase indent',
      'Purchase order',
      'Job cards',
      'Quality Reports',
      'Stocks',
      'Order Management',
      'Sample Jobcard',
      'Samples',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master',
      'BOM',
      'Vendor',
      'Inventory',
      'Fabric QC report'
    ],
    noAccess: [
      'Material inward QC',
      'Material inward',
      'Material outward',
      'FG store',
      'Quotation',
      'Lead management',
      'Users',
      'Asset Managament'
    ]
  },
  SuperMerchandiser: {
    fullAccess: [
      'Dashboard',
      'Product master',
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Job cards',
      'Quality Reports',
      'Stocks',
      'Order Management',
      'Sample Jobcard',
      'Samples',
      'Employee Performance'
    ],
    viewOnly: [
      'Inventory',
      'Fabric QC report'
    ],
    noAccess: [
      'Material inward QC',
      'Material inward',
      'Material outward',
      'FG store',
      'Quotation',
      'Lead management',
      'Users',
      'Asset Managament'
    ]
  },
  Purchase: {
    fullAccess: [
      'Dashboard',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Quality Reports',
      'Stocks',
      'Employee Performance',
      'Asset Managament'
    ],
    viewOnly: [
      'Product master',
      'BOM',
      'Inventory'
    ],
    noAccess: [
      'Product Style category',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Fabric QC report',
      'Job cards',
      'Order Management',
      'Quotation',
      'Lead management',
      'Users',
      'Sample Jobcard',
      'Samples'
    ]
  },
  'Trims & Machine Parts Store': {
    fullAccess: [
      'Dashboard',
      'Material inward',
      'Material outward',
      'Inventory',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Fabric: {
    fullAccess: [
      'Dashboard',
      'Purchase indent',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Quality Reports',
      'Stocks',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase order',
      'Users',
      'Job cards',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Production: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Stocks',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master',
      'Job cards'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Cutting: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master',
      'Job cards'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Finishing: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master',
      'Job cards'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  PartsProduction: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master',
      'Job cards'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  FGstore: {
    fullAccess: [
      'Dashboard',
      'Job cards',
      'Quality Reports',
      'FG store',
      'Stocks',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  FGstoreInward: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'FG store',
      'Stocks',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  FGstoreOutward: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'FG store',
      'Stocks',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Embroidery: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  OrderManagement: {
    fullAccess: [
      'Dashboard',
      'Material inward',
      'Material outward',
      'Stocks',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'Quality Reports',
      'FG store',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Accessories: {
    fullAccess: [
      'Dashboard',
      'Inventory',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Assets: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [],
    noAccess: [
      'Product master',
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Maintenance: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [],
    noAccess: [
      'Product master',
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  'Other Stores': {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [],
    noAccess: [
      'Product master',
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  'Lead Manager': {
    fullAccess: [
      'Dashboard',
      'Job cards',
      'Order Management',
      'Lead Management',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Quality Reports',
      'FG store',
      'Stocks',
      'Quotation',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  'Sales Executive': {
    fullAccess: [
      'Dashboard',
      'Stocks',
      'Lead Management',
      'Employee Performance'
    ],
    viewOnly: [
      'Product master'
    ],
    noAccess: [
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'Quality Reports',
      'FG store',
      'Order Management',
      'Quotation',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  },
  Quality: {
    fullAccess: [
      'Dashboard',
      'Quality Reports',
      'Employee Performance'
    ],
    viewOnly: [],
    noAccess: [
      'Product master',
      'Product Style category',
      'BOM',
      'Vendor',
      'Purchase indent',
      'Purchase order',
      'Material inward QC',
      'Material inward',
      'Material outward',
      'Inventory',
      'Fabric QC report',
      'Users',
      'Job cards',
      'FG store',
      'Stocks',
      'Order Management',
      'Quotation',
      'Lead management',
      'Sample Jobcard',
      'Samples',
      'Asset Managament'
    ]
  }
};

export default departmentAccessRules; 