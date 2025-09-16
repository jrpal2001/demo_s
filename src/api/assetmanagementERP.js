import { api } from '../utils/axios';

// Helper functions for data preparation
export const prepareAssetData = (formData, assetType, createdBy) => {
  return {
    ...formData,
    assetType,
    createdBy,
  };
};

export const prepareMaintenanceData = (formData, maintenanceType, createdBy) => {
  // Map frontend maintenance types to backend expected values
  const maintenanceTypeMapping = {
    'BUSINESS LICENSES': 'BUSINESSLICENSE',
    'SAFETY EQUIPMENTS': 'SAFETYEQUIPMENT',
  };

  const mappedMaintenanceType = maintenanceTypeMapping[maintenanceType] || maintenanceType;

  return {
    ...formData,
    maintenanceType: mappedMaintenanceType,
    createdBy: createdBy || 'system',
  };
};

export const prepareOtherStoreData = (formData, itemType, createdBy) => {
  // Map frontend category names to backend expected values
  const itemTypeMapping = {
    'TOOLS AND SPARE PARTS': 'TOOLS&SPAREPARTS',
    'STATIONARY&HOUSEKEEPING': 'STATIONERY&HOUSEKEEPING',
    'EMBROIDERY STORE': 'EMBROIDERYSTORE',
  };

  const mappedItemType = itemTypeMapping[itemType] || itemType;

  // Ensure required fields are present
  const preparedData = {
    ...formData,
    itemType: mappedItemType,
    createdBy: createdBy || 'system',
  };

  // Special handling for each item type to ensure itemName is present
  if (itemType === 'TOOLS AND SPARE PARTS') {
    preparedData.itemName = formData.partsName || formData.itemName || 'Unnamed Tool/Part';
    if (formData.partsId) preparedData.itemCode = formData.partsId;
  } else if (itemType === 'STATIONARY&HOUSEKEEPING') {
    // Already has itemName and itemCode
    if (!preparedData.itemName) {
      preparedData.itemName = 'Unnamed Stationery Item';
    }
  } else if (itemType === 'EMBROIDERY STORE') {
    preparedData.itemName = formData.designName || formData.itemName || 'Unnamed Design';
    if (formData.designId) preparedData.itemCode = formData.designId;
    if (formData.jobCardId) preparedData.jobCardId = formData.jobCardId;
  }

  // Final fallback to ensure itemName is always present
  if (!preparedData.itemName) {
    preparedData.itemName = 'Unnamed Item';
  }

  console.log('Prepared data for Other Store:', preparedData);
  return preparedData;
};

// ========================
// ASSET MANAGEMENT APIs
// ========================

// Individual create functions
export const createAsset = async (formData) => {
  try {
    const response = await api.post('/admin/assetmanagementerp/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Asset creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating asset');
  }
};

export const createMachinery = async (formData) => {
  try {
    const response = await api.post('/admin/assetmanagementerp/create/machinery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Machinery creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating machinery');
  }
};

export const createVehicle = async (formData) => {
  try {
    const response = await api.post('/admin/assetmanagementerp/create/vehicle', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Vehicle creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating vehicle');
  }
};

export const createSoftware = async (formData) => {
  try {
    const response = await api.post('/admin/assetmanagementerp/create/software', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Software creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating software');
  }
};

// Asset read operations
export const getAllAssets = async (page = 0, pageSize = 10) => {
  try {
    const response = await api.get('/admin/assetmanagementerp/all', {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error('Get all assets error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching assets');
  }
};

export const getAssetsByType = async (assetType, page = 0, pageSize = 10) => {
  try {
    const response = await api.get(`/admin/assetmanagementerp/${assetType}`, {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error('Get assets by type error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching assets by type');
  }
};

export const getAssetById = async (id) => {
  try {
    const response = await api.get(`/admin/assetmanagementerp/item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get asset by ID error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching asset');
  }
};

// Asset update operations
export const updateAsset = async (id, formData) => {
  try {
    const response = await api.put(`/admin/assetmanagementerp/item/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Update asset error:', error);
    throw new Error(error.response?.data?.message || 'Error updating asset');
  }
};

// Asset delete operations
export const deleteAsset = async (id) => {
  try {
    const response = await api.delete(`/admin/assetmanagementerp/item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete asset error:', error);
    throw new Error(error.response?.data?.message || 'Error deleting asset');
  }
};

// ========================
// MAINTENANCE APIs - FIXED
// ========================

export const createMaintenance = async (formData) => {
  try {
    const response = await api.post('/admin/maintanence/create', formData);
    return response.data;
  } catch (error) {
    console.error('Maintenance creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating maintenance item');
  }
};

export const createBusinessLicense = async (formData) => {
  try {
    const response = await api.post('/admin/maintanence/create/business-license', formData);
    return response.data;
  } catch (error) {
    console.error('Business license creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating business license');
  }
};

export const createWeightsAndMeasurements = async (formData) => {
  try {
    const response = await api.post(
      '/admin/maintanence/create/weights-measurements',
      formData,
    );
    return response.data;
  } catch (error) {
    console.error('Weights and measurements creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating weights and measurements');
  }
};

export const createSafetyEquipment = async (formData) => {
  try {
    const response = await api.post('/admin/maintanence/create/safety-equipment', formData);
    return response.data;
  } catch (error) {
    console.error('Safety equipment creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating safety equipment');
  }
};

export const createAMC = async (formData) => {
  try {
    const response = await api.post('/admin/maintanence/create/amc', formData);
    return response.data;
  } catch (error) {
    console.error('AMC creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating AMC');
  }
};

export const createInsurance = async (formData) => {
  try {
    const response = await api.post('/admin/maintanence/create/insurance', formData);
    return response.data;
  } catch (error) {
    console.error('Insurance creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating insurance');
  }
};

export const createAgreements = async (formData) => {
  try {
    const response = await api.post('/admin/maintanence/create/agreements', formData);
    return response.data;
  } catch (error) {
    console.error('Agreements creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating agreements');
  }
};

// Maintenance read operations - FIXED
export const getMaintenanceByType = async (maintenanceType, page = 0, pageSize = 10) => {
  try {
    console.log('Fetching maintenance by type:', maintenanceType);

    // Map frontend maintenance types to backend expected values for GET requests
    const maintenanceTypeMapping = {
      'BUSINESS LICENSES': 'BUSINESSLICENSE',
      'SAFETY EQUIPMENTS': 'SAFETYEQUIPMENT',
    };

    const mappedMaintenanceType = maintenanceTypeMapping[maintenanceType] || maintenanceType;
    console.log('Mapped maintenance type:', mappedMaintenanceType);

    const response = await api.get(`/admin/maintanence/${mappedMaintenanceType}`, {
      params: { page, pageSize },
    });

    console.log('Maintenance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get maintenance by type error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching maintenance items');
  }
};

export const getMaintenanceById = async (id) => {
  try {
    const response = await api.get(`/admin/maintanence/item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get maintenance by ID error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching maintenance item');
  }
};

// Maintenance update operations
export const updateMaintenance = async (id, formData) => {
  try {
    const response = await api.put(`/admin/maintanence/item/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Update maintenance error:', error);
    throw new Error(error.response?.data?.message || 'Error updating maintenance item');
  }
};

// Maintenance delete operations
export const deleteMaintenance = async (id) => {
  try {
    const response = await api.delete(`/admin/maintanence/item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete maintenance error:', error);
    throw new Error(error.response?.data?.message || 'Error deleting maintenance item');
  }
};

// ========================
// OTHER STORE APIs - FIXED
// ========================

export const createOtherStore = async (formData) => {
  try {
    const response = await api.post('/admin/otherstore/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Other store creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating other store item');
  }
};

export const createToolsAndSpareParts = async (formData) => {
            console.log('🚀 ~ createToolsAndSpareParts ~ FormData Contents:');
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  try {
    const response = await api.post('/admin/otherstore/create/tools', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Tools and spare parts creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating tools and spare parts');
  }
};

export const createStationeryAndHousekeeping = async (formData) => {
  try {
    const response = await api.post('/admin/otherstore/create/stationery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Stationery and housekeeping creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating stationery and housekeeping');
  }
};

export const createEmbroideryStore = async (formData) => {
  try {
    const response = await api.post('/admin/otherstore/create/embroidery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Embroidery store creation error:', error);
    throw new Error(error.response?.data?.message || 'Error creating embroidery store');
  }
};

// Other store read operations - FIXED
export const getOtherStoreByType = async (itemType, page = 0, pageSize = 10) => {
  try {
    console.log('Fetching other store by type:', itemType);

    const response = await api.get(`/admin/otherstore/${itemType}`, {
      params: { page, pageSize },
    });

    console.log('Other store response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get other store by type error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching other store items');
  }
};

export const getOtherStoreById = async (id) => {
  try {
    const response = await api.get(`/admin/otherstore/item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get other store by ID error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching other store item');
  }
};

// Other store update operations
export const updateOtherStore = async (id, formData) => {
  try {
    const response = await api.put(`/admin/otherstore/item/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Update other store error:', error);
    throw new Error(error.response?.data?.message || 'Error updating other store item');
  }
};

// Other store delete operations
export const deleteOtherStore = async (id) => {
  try {
    const response = await api.delete(`/admin/otherstore/item/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete other store error:', error);
    throw new Error(error.response?.data?.message || 'Error deleting other store item');
  }
};

export const fetchAssetCodes = async (category) => {
  try {
    const response = await api.get(`/admin/assetmanagementerp/assettype/${category}`);
    return response.data.data;
  } catch (error) {
    console.error('Get all asset codes error:', error);
    throw new Error(error.response?.data?.message || 'Error fetching asset codes');
  }
};


// ========================
// GROUPED API OBJECTS
// ========================

export const assetAPI = {
  createAsset,
  createMachinery,
  createVehicle,
  createSoftware,
  getAllAssets,
  getAssetsByType,
  getAssetById,
  updateAsset,
  deleteAsset,
};

export const otherStoreAPI = {
  createOtherStore,
  createToolsAndSpareParts,
  createStationeryAndHousekeeping,
  createEmbroideryStore,
  getOtherStoreByType,
  getOtherStoreById,
  updateOtherStore,
  deleteOtherStore,
};

export const maintenanceAPI = {
  createMaintenance,
  createBusinessLicense,
  createWeightsAndMeasurements,
  createSafetyEquipment,
  createAMC,
  createInsurance,
  createAgreements,
  getMaintenanceByType,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
};

export default api;
//almost ok
