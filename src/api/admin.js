import { api } from '../utils/axios';

// -----fabric------
export const storeFabric = async (data) => {
  let response;
  try {
    response = await api.post('/admin/products/fabrics', data);
  } catch (error) {
    throw error;
  }
  return response.data;
};

export const getFabricById = async (id) => {
  let response;
  try {
    response = await api.get(`/admin/products/fabrics/${id}`);
  } catch (error) {
    throw error;
  }
  return response.data.data;
};

export const updateFabric = async (id, data) => {
  let response;
  try {
    response = await api.put(`/admin/products/fabrics/${id}`, data);
  } catch (error) {
    throw error;
  }
  return response.data;
};

// -----accessories------

export const storeAccessories = async (data) => {
  let response;
  try {
    response = await api.post('/admin/products/accessories', data);
  } catch (error) {
    throw error;
  }
  return response.data;
};

export const fetchFabric = async (page = 1, pageSize = 10) => {
  let response;
  try {
    response = await api.get(`/admin/bom`, {
      params: {
        category: 'fabric',
        page: page,
        pageSize: pageSize,
      },
    });

    return response?.data?.data; // Assuming the data is under 'data' in the response
  } catch (error) {
    throw error;
  }
};

export const fetchTrims = async (page = 1, pageSize = 10) => {
  let response;
  try {
    response = await api.get(`/admin/bom`, {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        category: 'trims',
        page: page, // Passing page number
        pageSize: pageSize, // Passing page size
      },
    });
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAccessories = async (page = 1, pageSize = 10) => {
  let response;
  try {
    response = await api.get(`/admin/bom`, {
      params: {
        category: 'accessories',
        page: page,
        pageSize: pageSize,
      },
    });
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const getAccessoriesById = async (id) => {
  let response;
  try {
    response = await api.get(`/admin/products/accessories/${id}`);
  } catch (error) {
    throw error;
  }
  return response.data.data;
};

export const updateAccessories = async (id, data) => {
  let response;
  try {
    response = await api.put(`/admin/products/accessories/${id}`, data);
  } catch (error) {
    throw error;
  }
  return response.data;
};

// -----packing------

export const storePacking = async (data) => {
  let response;
  try {
    response = await api.post('/admin/products/packing', data);
  } catch (error) {
    throw error;
  }
  return response.data;
};

export const getPackingById = async (id) => {
  let response;
  try {
    response = await api.get(`/admin/products/packing/${id}`);
  } catch (error) {
    throw error;
  }
  return response.data.data;
};

export const updatePacking = async (id, data) => {
  let response;
  try {
    response = await api.put(`/admin/products/packing/${id}`, data);
  } catch (error) {
    throw error;
  }
  return response.data;
};

// User
export const userAdd = async (data) => {
  console.log("🚀 ~ userAdd ~ data:", data)
  try {
    const response = await api.post('/admin/userview', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userData = async (currentPage, limit) => {
  try {
    const response = await api.get('/admin/userview/', {
      params: {
        page: currentPage + 1,
        limit: limit,
      },
    });
    if (response) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const userView = async (id) => {
  try {
    const response = await api.get(`/admin/userview/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userEdit = async (id, data) => {
  try {
    const response = await api.put(`/admin/userview/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const userDelete = async (id) => {
  try {
    const response = await api.delete(`/admin/userview/${id}`);
    if (response) {
      console.log(response);
      return response?.status;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

// Vendor
export const vendorSearch = async (page = 1, limit = 5, search) => {
  try {
    const response = await api.get(`admin/vendor/search`, {
      params: {
        search: search,
        page: page + 1,
        limit: limit,
      },
    });
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
    console.log(error);
  }
};

export const vendorView = async (page, size) => {
  try {
    const response = await api.get(`admin/vendor`, {
      params: {
        page: page,
        limit: size,
      },
    });
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const fetchVendor = async (id) => {
  try {
    const response = await api.get(`/admin/vendor/${id}`);
    if (response) {
      return response.data?.data;
    }
  } catch (error) {
    throw error;
  }
};

export const UpdateVendor = async (id, data) => {
  try {
    const response = await api.put(`/admin/vendor/${id}`, data);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const fetchLastVendorCode = async () => {
  try {
    const response = await api.get('/admin/vendor/last-vendor');
    console.log('🚀 ~ fetchLastVendorCode ~ response:', response.data);
    if (response) {
      return response.data; // This will return the last vendor code or default one
    }
  } catch (error) {
    throw error;
  }
};

// Dealer
export const dealerSearch = async (page = 1, limit = 5, search) => {
  try {
    const response = await api.get(`admin/dealer/search`, {
      params: {
        search: search,
        page: page + 1,
        limit: limit,
      },
    });
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const dealerView = async (page, size) => {
  try {
    const response = await api.get(`admin/dealer/?page=${page + 1}&limit=${size}`);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const dealerViewById = async (id, data) => {
  try {
    const response = await api.get(`/admin/dealer/${id}`);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const dealerStore = async (data) => {
  try {
    const response = await api.post(`admin/dealer`, data);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const dealerUpdate = async (id, data) => {
  try {
    const response = await api.put(`admin/dealer/${id}`, data);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const dealerEdit = async (id, data) => {
  try {
    const response = await api.put(`/admin/dealer/${id}`, data);
    if (response) {
      return response.data?.data;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Job Card
export const searchJobCard = async (page, limit, search) => {
  try {
    const response = await api.get(
      `/admin/jobcard/search?search=${search}&page=${page}&limit=${limit}`,
    );
    if (response) {
      return response?.data?.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const fetchJobCardsData = async (page, limit) => {
  try {
    const response = await api.get(`/admin/jobcard/view-all?page=${page}&limit=${limit}`);
    if (response) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const createJobCard = async (data) => {
  try {
    const response = await api.post(`/admin/jobcard`, data);

    if (response) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.log('i am error');

    throw error;
  }
};

export const fetchJobCardDataById = async (id) => {
  try {
    const response = await api.get(`/admin/jobcard/${id}`);
    if (response) {
      return response.data?.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const updateJobCard = async (id, data) => {
  try {
    const response = await api.put(`/admin/jobcard/${id}`, data);
    if (response) {
      return response?.data?.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const fetchLastJobCardNo = async () => {
  try {
    const response = await api.get('/admin/jobcard/last');
    if (response && response.data && response.data.data) {
      return response.data.data.jobCardNo;
    }
    return null;
  } catch (error) {
    console.error('Error fetching last job card number:', error);
    return null;
  }
};

export const fetchWorkflowForJobCard = async (jobCardNo) => {
  try {
    const response = await api.get(`/admin/workflow/${jobCardNo}`);
    if (response) {
      return response.data; // Assuming the response contains workflow data
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const updateTiming = async ({ jobCardNo, department, action, manpower = 0, workorderId }) => {
  console.log("🚀 ~ updateTiming ~ jobCardNo:", jobCardNo);
  try {
    const response = await api.post('admin/workflow/update-timing', {
      department,
      jobCardNo,
      action,
      manpower,
      workorderId
    });
    
    console.log("🚀 ~ updateTiming ~ response.data:", response);
    if (response) {
      return response;
    }

    return null;
  } catch (error) {
    console.error('Error updating timing:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateSizesAndRemarks = async (
  jobCardNo,
  department,
  sizes,
  remarks,
  pass,
  reject,
  line,
  total,
  workorderId
) => {
  try {
    const data = { sizes, remarks, department, pass, reject, line, total, workorderId };

    console.log("🚀 ~ data:", data)
    console.log("🚀 ~ updateSizesAndRemarks ~ department:", department);

    const response = await api.put(`admin/workflow/update-quantity/${jobCardNo}`, data);

    console.log("🚀 ~ updateSizesAndRemarks ~ response:", response);

    if (response.status === 200) {
      console.log('Sizes and remarks updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update sizes and remarks:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error updating sizes and remarks:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const manageProcessCompletion = async (workorderId,department, jobCardNo, completedBy, handoverTo,remarks) => {
  try {
    const data = { department, jobCardNo, completedBy, handoverTo, workorderId,remarks };

    console.log("🚀 ~ manageProcessCompletion ~ workorderId:", workorderId)
    const response = await api.post('admin/workflow/manage-completion', data);

    if (response.status === 200) {
      console.log('Process completion details updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update process completion details:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error updating process completion details:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const updateReceivedQuantities = async (workorderId, department, received, batchNo, receivedBy, remarks) => {
  try {
    const data = { workorderId, department, received, batchNo, receivedBy, remarks };

    console.log("🚀 ~ updateReceivedQuantities ~ workorderId:", workorderId, "department:", department, "received:", received, "batchNo:", batchNo);
    const response = await api.put('admin/workflow/update-received', data);

    if (response.status === 200) {
      console.log('Received quantities updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update received quantities:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error updating received quantities:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const updateSentQuantities = async (workorderId, department, sent, batchNo, sentBy, sentTo, remarks) => {
  try {
    const data = { workorderId, department, sent, batchNo, sentBy, sentTo, remarks };

    console.log("🚀 ~ updateSentQuantities ~ workorderId:", workorderId, "department:", department, "sent:", sent, "batchNo:", batchNo);
    const response = await api.put('admin/workflow/update-sent', data);

    if (response.status === 200) {
      console.log('Sent quantities updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update sent quantities:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error updating sent quantities:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const viewDepartment = async (department, limit) => {
  try {
    const response = await api.get(
      `admin/jobcard/view-department?currentDept=${department}&limit=${limit}`,
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch department details:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching department details:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// order management
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/admin/order/create', orderData);

    if (response.status === 201) {
      console.log('Order created successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to create order:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error creating order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch all orders
export const fetchOrders = async (page, limit, searchQuery = '') => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (searchQuery) {
      params.append('search', searchQuery);
    }

    const response = await api.get(`/admin/order?${params.toString()}`);

    if (response.status === 200) {
      console.log('Orders fetched successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch orders:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching orders:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Fetch a specific order by ID
export const fetchOrderById = async (orderId) => {
  try {
    const response = await api.get(`/admin/order/${orderId}`);

    if (response.status === 200) {
      console.log('Order fetched successfully', response.data);
      return response.data.order;
    } else {
      console.error('Order not found:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchAllOrderIds = async (orderId) => {
  try {
    const response = await api.get('/admin/order/allOrderId', {
      params: { orderId: String(orderId) },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Failed to fetch order IDs:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching order IDs:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Update a specific order by ID
export const updateOrder = async (orderId, updates) => {
  try {
    const response = await api.put(`/admin/order/${orderId}`, updates);

    if (response.status === 200) {
      console.log('Order updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update order:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error updating order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Delete an order by ID
export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/admin/order/${orderId}`);

    if (response.status === 200) {
      console.log('Order deleted successfully');
      return response.data;
    } else {
      console.error('Failed to delete order:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Error deleting order:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Update availability of a specific SKU in an order
export const updateOrderItemAvailability = async (orderId, skuCode) => {
  try {
    const response = await api.put(`/admin/order/${orderId}/item/${skuCode}`);

    if (response.status === 200) {
      console.log('Order item availability updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update order item availability:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error updating order item availability:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Check and update availability of all items in an order
export const updateAllOrderItemsAvailability = async (orderId) => {
  try {
    const response = await api.put(`/admin/order/${orderId}/update-all`);

    if (response.status === 200) {
      console.log('All order items availability updated successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to update all order items availability:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error updating all order items availability:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Fetch all product inventory
export const fetchAllInventory = async () => {
  console.log('🚀 ~ fetchAllInventory ~ fetchAllInventory:');
  try {
    const response = await api.get('/admin/product-inventory');
    console.log('🚀 ~ fetchAllInventory ~ response:', response);

    if (response.status === 200) {
      console.log('Product inventory fetched successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch product inventory:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching product inventory:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// defects inventory

// Fetch all product inventory
export const fetchAllDefectsInventory = async () => {
  try {
    console.log('🚀 ~ fetchAllDefectsInventory ~ fetchAllDefectsInventory:');
    const response = await api.get('/admin/product-defects');

    if (response.status === 200) {
      console.log('Product inventory fetched successfully', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch product inventory:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching product inventory:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Fetch SKU codes with optional search query
export const fetchSkuCodes = async (searchQuery = '') => {
  console.log('🚀 ~ fetchSkuCodes ~ searchQuery:', searchQuery);
  try {
    const response = await api.get('/admin/product-inventory/skucodes', {
      params: { query: searchQuery },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      console.error('Failed to fetch SKU codes:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching SKU codes:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Fetch availability based on SKU code, color, and gender
export const fetchAvailability = async (skuCode, color, gender) => {
  console.log('🚀 ~ fetchAvailability ~ skuCode:', skuCode, 'color:', color, 'gender:', gender);

  try {
    const response = await api.get('/admin/product-inventory/check-availability', {
      params: { skuCode, color, gender },
    });
    console.log('🚀 ~ fetchAvailability ~ response:', response);

    if (response.status === 200) {
      return response.data.data;
    } else {
      console.error('Failed to fetch availability:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching availability:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

// Fetch Vendor codes with optional search query
export const fetchVendorCodes = async (vendorCode = '') => {
  console.log('🚀 ~ fetchVendorCodes ~ vendorCode:', vendorCode);
  try {
    const response = await api.get('/admin/vendor/all-vendor', {
      params: { vendorCode: vendorCode },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      console.error('Failed to fetch Vendor codes:', response.data);
      return null;
    }
  } catch (error) {
    console.error(
      'Error fetching Vendor codes:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

//BOM

export const fetchBOM = async (BomId) => {
  try {
    const response = await api.get(`/admin/bom/${BomId}`);
    if (response) {
      return response?.data?.data;
    }
  } catch (error) {
    throw error;
  }
};

export const bomDelete = async (bomId) => {
  try {
    const response = await api.delete(`/admin/bom/delete/${bomId}`);
    if (response) {
      return response;
    }
  } catch (error) {
    throw error;
  }
};

export const fetchBomCodes = async (category) => {
  try {
    const response = await api.get(`/admin/bom/bomcodes/${category}`);
    if (response && response.status == 200) {
      return response.data?.data;
    }
  } catch (error) {
    throw Error(error);
  }
};

// search bom

export const searchBOM = async (category, page = 1, limit = 20, query = "", inventoryModel) => {
  try {
    const response = await api.get(`/admin/bom/search`, {
      params: {
        category,           // fabric | trims | accessories
        query,              // search keyword
        page,               // page number (1-based)
        pageSize: limit,    // items per page
        ...(inventoryModel ? { inventoryModel } : {}),
      },
    });

    if (response && response.status === 200) {
      return {
        items: response.data?.data?.boms || [],
        pagination: response.data?.data?.pagination || {},
      };
    }
    return null;
  } catch (error) {
    throw error;
  }
};


// search bom
