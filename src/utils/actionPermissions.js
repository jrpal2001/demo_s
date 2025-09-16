const actionPermissions = {
  // Super Admin - Full access to everything
  superadmin: {
    global: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    }
  },

  // Admin - Full access like superadmin
  admin: {
    'User Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Product Master': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Product Style Category': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'BOM': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Vendor Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Indent': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Orders': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Inventory': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Fabric QC Report': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Job Cards': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Stock Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Order Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Sample Jobcard': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Samples': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Asset Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Lead Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    }
  },

  // Merchandiser - Specific permissions as outlined
  merchandiser: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Product Style Category': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'BOM': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Purchase Indent': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Orders': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Job Cards': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Stock Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Order Management': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Sample Jobcard': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: false
    },
    'Samples': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: false
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Asset Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Lead Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    }
  },

  // Super Merchandiser - Enhanced permissions
  supermerchandiser: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Product Style Category': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'BOM': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Vendor Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Indent': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Orders': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Job Cards': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Stock Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Order Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Sample Jobcard': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Samples': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Asset Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Lead Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    }
  },

  // Accounts Department
  accounts: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Product Style Category': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'BOM': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Vendor Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Orders': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Stock Management': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: true
    },
    'Order Management': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Asset Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Job Cards': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Sample Jobcard': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Samples': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Purchase Indent': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Lead Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    }
  },

  // Purchase Department
  purchase: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Product Style Category': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'BOM': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Vendor Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Indent': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Purchase Orders': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Stock Management': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Asset Management': {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Job Cards': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Order Management': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Sample Jobcard': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Samples': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Lead Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    }
  },

  // Production Department
  production: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Product Style Category': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'BOM': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Job Cards': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Stock Management': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Vendor Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Purchase Indent': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Purchase Orders': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Order Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Sample Jobcard': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Samples': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Asset Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Lead Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    }
  },

  // Quality Department
  quality: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Product Style Category': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'BOM': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Quality Reports': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Vendor Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Purchase Indent': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Purchase Orders': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Job Cards': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Stock Management': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Order Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Sample Jobcard': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Samples': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Asset Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Lead Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    }
  },

  // Sales Executive
  salesexecutive: {
    'User Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Product Master': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Product Style Category': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'BOM': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Stock Management': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Lead Management': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Employee Performance': {
      create: true,
      read: true,
      update: true,
      delete: false,
      export: true,
      import: false
    },
    'Vendor Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Purchase Indent': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Purchase Orders': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Inventory': {
      create: false,
      read: true,
      update: false,
      delete: false,
      export: true,
      import: false
    },
    'Fabric QC Report': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Job Cards': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Quality Reports': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Order Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Sample Jobcard': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Samples': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    },
    'Asset Management': {
      create: false,
      read: false,
      update: false,
      delete: false,
      export: false,
      import: false
    }
  }
};

// Helper function to check permissions
export const checkPermission = (userType, module, action) => {
  const userPermissions = actionPermissions[userType?.toLowerCase()];
  
  if (!userPermissions) {
    return false;
  }

  // Super admin has all permissions
  if (userType?.toLowerCase() === 'superadmin') {
    return true;
  }

  const modulePermissions = userPermissions[module];
  
  if (!modulePermissions) {
    return false;
  }

  return modulePermissions[action] || false;
};

// Helper function to get all permissions for a user type and module
export const getModulePermissions = (userType, module) => {
  const userPermissions = actionPermissions[userType?.toLowerCase()];
  
  if (!userPermissions) {
    return null;
  }

  // Super admin has all permissions
  if (userType?.toLowerCase() === 'superadmin') {
    return {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true,
      import: true
    };
  }

  return userPermissions[module] || null;
};

export default actionPermissions; 