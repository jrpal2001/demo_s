'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Box,
  Stack,
  Button,
  Fab,
  MenuItem,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import { IconEdit, IconPlus, IconTrash,IconEye } from '@tabler/icons';

import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTable from '@/components/shared/CustomTable';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';

import { assetAPI, maintenanceAPI, otherStoreAPI } from '@/api/assetmanagementERP';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Asset Management' }];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const AssetManagementSystem = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Assets state
  const [assets, setAssets] = useState([]);
  const [assetType, setAssetType] = useState('MACHINERY');
  const [assetLoading, setAssetLoading] = useState(true);
  const [assetPaginationModel, setAssetPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [totalAssets, setTotalAssets] = useState(0);

  // Maintenance state
  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [maintenanceType, setMaintenanceType] = useState('BUSINESSLICENSE');
  const [maintenanceLoading, setMaintenanceLoading] = useState(true);
  const [maintenancePaginationModel, setMaintenancePaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [totalMaintenance, setTotalMaintenance] = useState(0);

  // Other Store state
  const [otherStoreItems, setOtherStoreItems] = useState([]);
  const [otherStoreType, setOtherStoreType] = useState('TOOLS&SPAREPARTS');
  const [otherStoreLoading, setOtherStoreLoading] = useState(true);
  const [otherStorePaginationModel, setOtherStorePaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });
  const [totalOtherStore, setTotalOtherStore] = useState(0);

  // Modal and dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Asset type options
  const assetTypes = [
    { value: 'MACHINERY', label: 'Machinery' },
    { value: 'ELECTRICALS', label: 'Electricals' },
    { value: 'ELECTRONICS', label: 'Electronics' },
    { value: 'FURNITURE&FIXTURES', label: 'Furniture & Fixtures' },
    { value: 'IMMOVABLE PROPERTIES', label: 'Immovable Properties' },
    { value: 'VEHICLES', label: 'Vehicles' },
    { value: 'SOFTWARES&LICENSES', label: 'Software & Licenses' },
  ];

  const maintenanceTypes = [
    { value: 'BUSINESSLICENSE', label: 'Business Licenses' },
    { value: 'WEIGHTS&MEASUREMENTS', label: 'Weights & Measurements' },
    { value: 'SAFETYEQUIPMENT', label: 'Safety Equipment' },
    { value: 'AMC', label: 'AMC' },
    { value: 'INSURANCE', label: 'Insurance' },
    { value: 'AGREEMENTS', label: 'Agreements' },
  ];

  const otherStoreTypes = [
    { value: 'TOOLS&SPAREPARTS', label: 'Tools & Spare Parts' },
    { value: 'STATIONERY&HOUSEKEEPING', label: 'Stationery & Housekeeping' },
    { value: 'EMBROIDERYSTORE', label: 'Embroidery Store' },
  ];

  // Ultra-safe helper functions
  const safeGet = (obj, field, fallback = 'N/A') => {
    try {
      if (!obj || typeof obj !== 'object') return fallback;
      const value = obj[field];
      if (value === null || value === undefined || value === '' || value === 0) return fallback;
      return value;
    } catch (error) {
      console.error(`Error accessing field ${field}:`, error);
      return fallback;
    }
  };

  const formatCurrency = (value) => {
    try {
      if (!value || value === 'N/A' || value === null || value === undefined) return 'N/A';
      const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
      if (isNaN(numValue)) return 'N/A';
      return `₹${numValue.toLocaleString()}`;
    } catch (error) {
      return 'N/A';
    }
  };

  const formatDate = (value) => {
    try {
      if (!value || value === 'N/A' || value === null || value === undefined) return 'N/A';
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Safe render functions for complex cells
  const renderStatusChip = (status, defaultStatus = 'Active') => {
    try {
      const finalStatus = status || defaultStatus;
      let color = 'default';

      if (finalStatus === 'Active' || finalStatus === 'In Use' || finalStatus === 'Approved') {
        color = 'success';
      } else if (
        finalStatus === 'Inactive' ||
        finalStatus === 'Expired' ||
        finalStatus === 'Rejected' ||
        finalStatus === 'Damaged' ||
        finalStatus === 'Out of service'
      ) {
        color = 'error';
      } else {
        color = 'warning';
      }

      return <Chip label={finalStatus} size="small" color={color} />;
    } catch (error) {
      return <Chip label="Unknown" size="small" color="default" />;
    }
  };

  // View item handler
  const handleViewItem = (id, type) => {
    // Navigate to view page with id and type as query parameters
    navigate(`/${userType}/viewoneassetmanagement/${id}?type=${activeTab}&subType=${type}`);
  };

  // Delete confirmation handler
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  // Delete item handler
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      setDeleteLoading(true);
      let response;

      if (activeTab === 0) {
        response = await assetAPI.deleteAsset(itemToDelete._id);
      } else if (activeTab === 1) {
        response = await maintenanceAPI.deleteMaintenance(itemToDelete._id);
      } else if (activeTab === 2) {
        response = await otherStoreAPI.deleteOtherStore(itemToDelete._id);
      }

      if (response?.success) {
        // Refresh the appropriate data
        if (activeTab === 0) {
          handleAssetRefresh();
        } else if (activeTab === 1) {
          handleMaintenanceRefresh();
        } else if (activeTab === 2) {
          handleOtherStoreRefresh();
        }

        setDeleteConfirmOpen(false);
        setItemToDelete(null);
        // You can add a success toast notification here
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // You can add an error toast notification here
    } finally {
      setDeleteLoading(false);
    }
  };

  // Close handlers
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  // Dynamic Asset Columns based on exact schema fields
  const getAssetColumns = (type) => {
    const baseColumns = [
      {
        field: 'id',
        headerName: 'Sl No',
        width: 70,
        headerClassName: 'custom-header',
        renderCell: (params) => params.row?.id || 'N/A',
      },
    ];

    const actionColumn = {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 120,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        try {
          if (!params?.row?._id) return null;
          return (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Fab
                sx={{ boxShadow: 3, '&:hover': { boxShadow: 8 } }}
                color="warning"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => handleViewItem(params.row._id, assetType)}
              >
                <IconEye size="16" />
              </Fab>
              <Fab
                sx={{ boxShadow: 3, '&:hover': { boxShadow: 8 } }}
                color="error"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => handleDeleteClick(params.row)}
              >
                <IconTrash size="16" />
              </Fab>
            </Box>
          );
        } catch (error) {
          console.error('Error rendering asset actions:', error);
          return null;
        }
      },
    };

    let specificColumns = [];

    switch (type) {
      case 'MACHINERY':
        // Based on machinerySchema from your backend
        specificColumns = [
          {
            field: 'machineName',
            headerName: 'MACHINE NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'machineName'),
          },
          {
            field: 'machineId',
            headerName: 'MACHINE ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'machineId'),
          },
          {
            field: 'manufacturer',
            headerName: 'MANUFACTURER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'manufacturer'),
          },
          {
            field: 'modelNumber',
            headerName: 'MODEL NUMBER',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'modelNumber'),
          },
          {
            field: 'serialNumber',
            headerName: 'SERIAL NUMBER',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'serialNumber'),
          },
          {
            field: 'department',
            headerName: 'DEPARTMENT',
            width: 130,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'department'),
          },
          {
            field: 'currentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'currentStatus')),
          },
          {
            field: 'Price',
            headerName: 'Price',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatCurrency(safeGet(params?.row, 'price')),
          },
        ];
        break;

      case 'ELECTRICALS':
        // Based on electricalSchema from your backend
        specificColumns = [
          {
            field: 'assetName',
            headerName: 'ASSET NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assetName'),
          },
          {
            field: 'assetId',
            headerName: 'ASSET ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assetId'),
          },
          {
            field: 'manufacturer',
            headerName: 'MANUFACTURER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'manufacturer'),
          },
          {
            field: 'modelNumber',
            headerName: 'MODEL NUMBER',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'modelNumber'),
          },
          {
            field: 'supplierName',
            headerName: 'SUPPLIER',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'supplierName'),
          },
          {
            field: 'department',
            headerName: 'DEPARTMENT',
            width: 130,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'department'),
          },
          {
            field: 'currentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'currentStatus')),
          },
          {
            field: 'warrantyExpiryDate',
            headerName: 'WARRANTY EXPIRY',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'warrantyExpiryDate')),
          },
        ];
        break;

      case 'ELECTRONICS':
        // Based on electronicsSchema from your backend
        specificColumns = [
          {
            field: 'assetName',
            headerName: 'ASSET NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assetName'),
          },
          {
            field: 'assetId',
            headerName: 'ASSET ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assetId'),
          },
          {
            field: 'manufacturer',
            headerName: 'MANUFACTURER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'manufacturer'),
          },
          {
            field: 'modelNumber',
            headerName: 'MODEL NUMBER',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'modelNumber'),
          },
          {
            field: 'supplierName',
            headerName: 'SUPPLIER',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'supplierName'),
          },
          {
            field: 'department',
            headerName: 'DEPARTMENT',
            width: 130,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'department'),
          },
          {
            field: 'currentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'currentStatus')),
          },
          {
            field: 'warrantyExpiryDate',
            headerName: 'WARRANTY EXPIRY',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'warrantyExpiryDate')),
          },
        ];
        break;

      case 'FURNITURE&FIXTURES':
        // Based on furnitureSchema from your backend
        specificColumns = [
          {
            field: 'assetName',
            headerName: 'ASSET NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assetName'),
          },
          {
            field: 'assetId',
            headerName: 'ASSET ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assetId'),
          },
          {
            field: 'manufacturer',
            headerName: 'MANUFACTURER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'manufacturer'),
          },
          {
            field: 'supplierName',
            headerName: 'SUPPLIER',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'supplierName'),
          },
          {
            field: 'dateOfPurchase',
            headerName: 'PURCHASE DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'dateOfPurchase')),
          },
          {
            field: 'department',
            headerName: 'DEPARTMENT',
            width: 130,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'department'),
          },
          {
            field: 'currentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'currentStatus')),
          },
          {
            field: 'warrantyExpiryDate',
            headerName: 'WARRANTY EXPIRY',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'warrantyExpiryDate')),
          },
        ];
        break;

      case 'IMMOVABLE PROPERTIES':
        // Based on propertySchema from your backend
        specificColumns = [
          {
            field: 'propertyName',
            headerName: 'PROPERTY NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'propertyName'),
          },
          {
            field: 'propertyId',
            headerName: 'PROPERTY ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'propertyId'),
          },
          {
            field: 'address',
            headerName: 'ADDRESS',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'address'),
          },
          {
            field: 'location',
            headerName: 'LOCATION',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'location'),
          },
          {
            field: 'ownershipType',
            headerName: 'OWNERSHIP TYPE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'ownershipType'),
          },
          {
            field: 'ownerName',
            headerName: 'OWNER NAME',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'ownerName'),
          },
          {
            field: 'currentMarketValue',
            headerName: 'MARKET VALUE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatCurrency(safeGet(params?.row, 'currentMarketValue')),
          },
          {
            field: 'usage',
            headerName: 'USAGE',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'usage'),
          },
        ];
        break;

      case 'VEHICLES':
        // Based on vehicleSchema from your backend
        specificColumns = [
          {
            field: 'name',
            headerName: 'VEHICLE NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'name'),
          },
          {
            field: 'registrationNumber',
            headerName: 'REGISTRATION NO',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'registrationNumber'),
          },
          {
            field: 'make',
            headerName: 'MAKE',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'make'),
          },
          {
            field: 'model',
            headerName: 'MODEL',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'model'),
          },
          {
            field: 'yearOfManufacturer',
            headerName: 'YEAR',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'yearOfManufacturer'),
          },
          {
            field: 'colour',
            headerName: 'COLOR',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'colour'),
          },
          {
            field: 'currentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'currentStatus')),
          },
          {
            field: 'assignedTo',
            headerName: 'ASSIGNED TO',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assignedTo'),
          },
        ];
        break;

      case 'SOFTWARES&LICENSES':
        // Based on softwareSchema from your backend
        specificColumns = [
          {
            field: 'softwareName',
            headerName: 'SOFTWARE NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'softwareName'),
          },
          {
            field: 'vendorPublisher',
            headerName: 'VENDOR/PUBLISHER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'vendorPublisher'),
          },
          {
            field: 'version',
            headerName: 'VERSION',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'version'),
          },
          {
            field: 'licenseType',
            headerName: 'LICENSE TYPE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'licenseType'),
          },
          {
            field: 'numberOfLicenses',
            headerName: 'TOTAL LICENSES',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'numberOfLicenses', '0'),
          },
          {
            field: 'licensesInUse',
            headerName: 'IN USE',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'licensesInUse', '0'),
          },
          {
            field: 'licenseExpiryDate',
            headerName: 'EXPIRY DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'licenseExpiryDate')),
          },
          {
            field: 'currentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'currentStatus')),
          },
        ];
        break;

      default:
        specificColumns = [
          {
            field: 'name',
            headerName: 'NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const row = params?.row;
              return (
                safeGet(row, 'machineName') ||
                safeGet(row, 'assetName') ||
                safeGet(row, 'propertyName') ||
                safeGet(row, 'name') ||
                safeGet(row, 'softwareName')
              );
            },
          },
        ];
    }

    return [...baseColumns, ...specificColumns, actionColumn];
  };

  // Dynamic Maintenance Columns based on exact schema fields
  const getMaintenanceColumns = (type) => {
    const baseColumns = [
      {
        field: 'id',
        headerName: 'Sl No',
        width: 70,
        headerClassName: 'custom-header',
        renderCell: (params) => params.row?.id || 'N/A',
      },
    ];

    const actionColumn = {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 120,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        try {
          if (!params?.row?._id) return null;
          return (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Fab
                sx={{ boxShadow: 3, '&:hover': { boxShadow: 8 } }}
                color="warning"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => handleViewItem(params.row._id, maintenanceType)}
              >
                <IconEdit size="16" />
              </Fab>
              <Fab
                sx={{ boxShadow: 3, '&:hover': { boxShadow: 8 } }}
                color="error"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => handleDeleteClick(params.row)}
              >
                <IconTrash size="16" />
              </Fab>
            </Box>
          );
        } catch (error) {
          console.error('Error rendering maintenance actions:', error);
          return null;
        }
      },
    };

    let specificColumns = [];

    switch (type) {
      case 'BUSINESSLICENSE':
        // Based on businessLicenseSchema from your backend
        specificColumns = [
          {
            field: 'licenseId',
            headerName: 'LICENSE ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'licenseId'),
          },
          {
            field: 'licenseType',
            headerName: 'LICENSE TYPE',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'licenseType'),
          },
          {
            field: 'businessName',
            headerName: 'BUSINESS NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'businessName'),
          },
          {
            field: 'licenseHolderName',
            headerName: 'HOLDER NAME',
            width: 180,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'licenseHolderName'),
          },
          {
            field: 'licenseStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'licenseStatus')),
          },
          {
            field: 'licenseExpiryDate',
            headerName: 'EXPIRY DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'licenseExpiryDate')),
          },
          {
            field: 'licenseCost',
            headerName: 'COST',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => formatCurrency(safeGet(params?.row, 'licenseCost')),
          },
        ];
        break;

      case 'WEIGHTS&MEASUREMENTS':
        // Based on weightsAndMeasurementsSchema from your backend
        specificColumns = [
          {
            field: 'weighMachineId',
            headerName: 'MACHINE ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'weighMachineId'),
          },
          {
            field: 'machineType',
            headerName: 'MACHINE TYPE',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'machineType'),
          },
          {
            field: 'manufacturer',
            headerName: 'MANUFACTURER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'manufacturer'),
          },
          {
            field: 'capacity',
            headerName: 'CAPACITY',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'capacity'),
          },
          {
            field: 'accuracy',
            headerName: 'ACCURACY',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'accuracy'),
          },
          {
            field: 'machineStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'machineStatus')),
          },
          {
            field: 'calibrationDate',
            headerName: 'CALIBRATION DATE',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'calibrationDate')),
          },
          {
            field: 'nextServiceDate',
            headerName: 'NEXT SERVICE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'nextServiceDate')),
          },
        ];
        break;

      case 'SAFETYEQUIPMENT':
        // Based on safetyEquipmentSchema from your backend
        specificColumns = [
          {
            field: 'safetyEquipmentId',
            headerName: 'EQUIPMENT ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'safetyEquipmentId'),
          },
          {
            field: 'safetyEquipmentName',
            headerName: 'EQUIPMENT NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'safetyEquipmentName'),
          },
          {
            field: 'equipmentCategory',
            headerName: 'CATEGORY',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'equipmentCategory'),
          },
          {
            field: 'manufacturer',
            headerName: 'MANUFACTURER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'manufacturer'),
          },
          {
            field: 'location',
            headerName: 'LOCATION',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'location'),
          },
          {
            field: 'assignedTo',
            headerName: 'ASSIGNED TO',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'assignedTo'),
          },
          {
            field: 'equipmentStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) =>
              renderStatusChip(safeGet(params?.row, 'equipmentStatus'), 'In Use'),
          },
          {
            field: 'warrantyExpiryDate',
            headerName: 'WARRANTY EXPIRY',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'warrantyExpiryDate')),
          },
        ];
        break;

      case 'AMC':
        // Based on amcSchema from your backend
        specificColumns = [
          {
            field: 'amcId',
            headerName: 'AMC ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'amcId'),
          },
          {
            field: 'amcType',
            headerName: 'AMC TYPE',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'amcType'),
          },
          {
            field: 'vendorDetails',
            headerName: 'VENDOR',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'vendorDetails'),
          },
          {
            field: 'amcStartDate',
            headerName: 'START DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'amcStartDate')),
          },
          {
            field: 'amcEndDate',
            headerName: 'END DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'amcEndDate')),
          },
          {
            field: 'amcStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'amcStatus')),
          },
          {
            field: 'totalAmcCost',
            headerName: 'COST',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => formatCurrency(safeGet(params?.row, 'totalAmcCost')),
          },
          {
            field: 'responseTime',
            headerName: 'RESPONSE TIME',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'responseTime'),
          },
        ];
        break;

      case 'INSURANCE':
        // Based on insuranceSchema from your backend
        specificColumns = [
          {
            field: 'insuranceId',
            headerName: 'INSURANCE ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'insuranceId'),
          },
          {
            field: 'insurancePolicyNumber',
            headerName: 'POLICY NUMBER',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'insurancePolicyNumber'),
          },
          {
            field: 'insuranceType',
            headerName: 'INSURANCE TYPE',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'insuranceType'),
          },
          {
            field: 'insuranceProvider',
            headerName: 'PROVIDER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'insuranceProvider'),
          },
          {
            field: 'policyStartDate',
            headerName: 'START DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'policyStartDate')),
          },
          {
            field: 'policyEndDate',
            headerName: 'END DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'policyEndDate')),
          },
          {
            field: 'policyStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'policyStatus')),
          },
          {
            field: 'premiumAmount',
            headerName: 'PREMIUM',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => formatCurrency(safeGet(params?.row, 'premiumAmount')),
          },
        ];
        break;

      case 'AGREEMENTS':
        // Based on agreementsSchema from your backend
        specificColumns = [
          {
            field: 'agreementId',
            headerName: 'AGREEMENT ID',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'agreementId'),
          },
          {
            field: 'agreementType',
            headerName: 'AGREEMENT TYPE',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'agreementType'),
          },
          {
            field: 'partiesInvolved',
            headerName: 'PARTIES INVOLVED',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'partiesInvolved'),
          },
          {
            field: 'agreementStartDate',
            headerName: 'START DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'agreementStartDate')),
          },
          {
            field: 'agreementEndDate',
            headerName: 'END DATE',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'agreementEndDate')),
          },
          {
            field: 'approvalStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) =>
              renderStatusChip(safeGet(params?.row, 'approvalStatus'), 'Approved'),
          },
          {
            field: 'agreementValue',
            headerName: 'VALUE',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => formatCurrency(safeGet(params?.row, 'agreementValue')),
          },
          {
            field: 'signatories',
            headerName: 'SIGNATORIES',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'signatories'),
          },
        ];
        break;

      default:
        specificColumns = [
          {
            field: 'title',
            headerName: 'TITLE',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const row = params?.row;
              return (
                safeGet(row, 'licenseType') ||
                safeGet(row, 'machineType') ||
                safeGet(row, 'safetyEquipmentName') ||
                safeGet(row, 'amcType') ||
                safeGet(row, 'insuranceType') ||
                safeGet(row, 'agreementType')
              );
            },
          },
        ];
    }

    return [...baseColumns, ...specificColumns, actionColumn];
  };

  // Dynamic Other Store Columns based on exact schema fields
  const getOtherStoreColumns = (type) => {
    const baseColumns = [
      {
        field: 'id',
        headerName: 'Sl No',
        width: 70,
        headerClassName: 'custom-header',
        renderCell: (params) => params.row?.id || 'N/A',
      },
    ];

    const actionColumn = {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 120,
      sortable: false,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        try {
          if (!params?.row?._id) return null;
          return (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}
            >
              <Fab
                sx={{ boxShadow: 3, '&:hover': { boxShadow: 8 } }}
                color="warning"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => handleViewItem(params.row._id, otherStoreType)}
              >
                <IconEdit size="16" />
              </Fab>
              <Fab
                sx={{ boxShadow: 3, '&:hover': { boxShadow: 8 } }}
                color="error"
                size="small"
                style={{ padding: '2px 6px' }}
                onClick={() => handleDeleteClick(params.row)}
              >
                <IconTrash size="16" />
              </Fab>
            </Box>
          );
        } catch (error) {
          console.error('Error rendering other store actions:', error);
          return null;
        }
      },
    };

    let specificColumns = [];

    switch (type) {
      case 'TOOLS&SPAREPARTS':
        // Based on toolsAndSparePartsSchema from your backend
        specificColumns = [
          {
            field: 'itemName',
            headerName: 'ITEM NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const row = params?.row;
              return safeGet(row, 'itemName') || safeGet(row, 'partsName');
            },
          },
          {
            field: 'itemCode',
            headerName: 'ITEM CODE',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const row = params?.row;
              return safeGet(row, 'itemCode') || safeGet(row, 'partsId');
            },
          },
          {
            field: 'category',
            headerName: 'CATEGORY',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'category'),
          },
          {
            field: 'brandManufacturer',
            headerName: 'BRAND',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'brandManufacturer'),
          },
          {
            field: 'modelNumber',
            headerName: 'MODEL NUMBER',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'modelNumber'),
          },
          {
            field: 'serialNumber',
            headerName: 'SERIAL NUMBER',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'serialNumber'),
          },
          {
            field: 'condition',
            headerName: 'CONDITION',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => renderStatusChip(safeGet(params?.row, 'condition'), 'New'),
          },
          {
            field: 'quantity',
            headerName: 'QUANTITY',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const qty = safeGet(params?.row, 'quantity', '0');
              return qty === 'N/A' ? '0' : qty;
            },
          },
          {
            field: 'location',
            headerName: 'LOCATION',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'location'),
          },
          {
            field: 'supplier',
            headerName: 'SUPPLIER',
            width: 150,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'supplier'),
          },
        ];
        break;

      case 'STATIONERY&HOUSEKEEPING':
        // Based on stationeryAndHousekeepingSchema from your backend
        specificColumns = [
          {
            field: 'itemName',
            headerName: 'ITEM NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'itemName'),
          },
          {
            field: 'itemCode',
            headerName: 'ITEM CODE',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'itemCode'),
          },
          {
            field: 'category',
            headerName: 'CATEGORY',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'category'),
          },
          {
            field: 'description',
            headerName: 'DESCRIPTION',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'description'),
          },
          {
            field: 'quantity',
            headerName: 'QUANTITY',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const qty = safeGet(params?.row, 'quantity', '0');
              return qty === 'N/A' ? '0' : qty;
            },
          },
          {
            field: 'unit',
            headerName: 'UNIT',
            width: 80,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'unit', 'pcs'),
          },
          {
            field: 'location',
            headerName: 'LOCATION',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'location'),
          },
          {
            field: 'frequency',
            headerName: 'FREQUENCY',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'frequency'),
          },
          {
            field: 'lastPurchasedDate',
            headerName: 'LAST PURCHASED',
            width: 130,
            headerClassName: 'custom-header',
            renderCell: (params) => formatDate(safeGet(params?.row, 'lastPurchasedDate')),
          },
        ];
        break;

      case 'EMBROIDERYSTORE':
        // Based on embroideryStoreSchema from your backend
        specificColumns = [
          {
            field: 'itemName',
            headerName: 'DESIGN NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const row = params?.row;
              return safeGet(row, 'itemName') || safeGet(row, 'designName');
            },
          },
          {
            field: 'itemCode',
            headerName: 'ITEM CODE',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'itemCode'),
          },
          {
            field: 'description',
            headerName: 'DESCRIPTION',
            width: 150,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'description'),
          },
          {
            field: 'quantity',
            headerName: 'QUANTITY',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const qty = safeGet(params?.row, 'quantity', '0');
              return qty === 'N/A' ? '0' : qty;
            },
          },
          {
            field: 'unit',
            headerName: 'UNIT',
            width: 80,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'unit', 'pcs'),
          },
          {
            field: 'designStatus',
            headerName: 'STATUS',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) =>
              renderStatusChip(safeGet(params?.row, 'designStatus'), 'Approved'),
          },
          {
            field: 'priority',
            headerName: 'PRIORITY',
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => {
              const priority = safeGet(params?.row, 'priority', 'Medium');
              const color =
                priority === 'High' ? 'error' : priority === 'Low' ? 'success' : 'warning';
              return <Chip label={priority} size="small" color={color} />;
            },
          },
          {
            field: 'location',
            headerName: 'LOCATION',
            width: 120,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'location'),
          },
        ];
        break;

      default:
        specificColumns = [
          {
            field: 'itemName',
            headerName: 'ITEM NAME',
            width: 200,
            flex: 1,
            headerClassName: 'custom-header',
            renderCell: (params) => safeGet(params?.row, 'itemName'),
          },
        ];
    }

    return [...baseColumns, ...specificColumns, actionColumn];
  };

  // Refresh handlers
  const handleAssetRefresh = () => {
    if (assets.length === 1 && assetPaginationModel.page > 0) {
      setAssetPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchAssets();
    }
  };

  const handleMaintenanceRefresh = () => {
    if (maintenanceItems.length === 1 && maintenancePaginationModel.page > 0) {
      setMaintenancePaginationModel((prev) => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchMaintenanceItems();
    }
  };

  const handleOtherStoreRefresh = () => {
    if (otherStoreItems.length === 1 && otherStorePaginationModel.page > 0) {
      setOtherStorePaginationModel((prev) => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchOtherStoreItems();
    }
  };

  // Fetch functions with better error handling
  const fetchAssets = async () => {
    try {
      setAssetLoading(true);
      console.log('Fetching assets:', assetType, assetPaginationModel);
      const response = await assetAPI.getAssetsByType(
        assetType,
        assetPaginationModel.page,
        assetPaginationModel.pageSize,
      );
      console.log('Assets response:', response);
      if (response?.success && response?.data?.assets) {
        const assetsWithId = response.data.assets.map((asset, index) => ({
          ...asset,
          id: assetPaginationModel.page * assetPaginationModel.pageSize + index + 1,
        }));
        setAssets(assetsWithId);
        setTotalAssets(response.data.totalAssets || 0);
      } else {
        setAssets([]);
        setTotalAssets(0);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setAssets([]);
      setTotalAssets(0);
    } finally {
      setAssetLoading(false);
    }
  };

  const fetchMaintenanceItems = async () => {
    try {
      setMaintenanceLoading(true);
      console.log('Fetching maintenance:', maintenanceType, maintenancePaginationModel);
      const response = await maintenanceAPI.getMaintenanceByType(
        maintenanceType,
        maintenancePaginationModel.page,
        maintenancePaginationModel.pageSize,
      );
      console.log('Maintenance response:', response);
      if (response?.success && response?.data?.maintenanceItems) {
        const itemsWithId = response.data.maintenanceItems.map((item, index) => ({
          ...item,
          id: maintenancePaginationModel.page * maintenancePaginationModel.pageSize + index + 1,
        }));
        setMaintenanceItems(itemsWithId);
        setTotalMaintenance(response.data.totalItems || 0);
      } else {
        setMaintenanceItems([]);
        setTotalMaintenance(0);
      }
    } catch (error) {
      console.error('Error fetching maintenance items:', error);
      setMaintenanceItems([]);
      setTotalMaintenance(0);
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const fetchOtherStoreItems = async () => {
    try {
      setOtherStoreLoading(true);
      console.log('Fetching other store items:', otherStoreType, otherStorePaginationModel);
      const response = await otherStoreAPI.getOtherStoreByType(
        otherStoreType,
        otherStorePaginationModel.page,
        otherStorePaginationModel.pageSize,
      );
      console.log('Other store response:', response);
      console.log('Raw items from API:', response?.data?.items);

      if (response?.success && response?.data?.items) {
        const itemsWithId = response.data.items.map((item, index) => {
          console.log(`Item ${index}:`, item); // Debug each item
          return {
            ...item,
            id: otherStorePaginationModel.page * otherStorePaginationModel.pageSize + index + 1,
          };
        });
        console.log('Processed items with IDs:', itemsWithId);
        setOtherStoreItems(itemsWithId);
        setTotalOtherStore(response.data.totalItems || 0);
      } else {
        console.log('No items found or invalid response structure');
        setOtherStoreItems([]);
        setTotalOtherStore(0);
      }
    } catch (error) {
      console.error('Error fetching other store items:', error);
      setOtherStoreItems([]);
      setTotalOtherStore(0);
    } finally {
      setOtherStoreLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (activeTab === 0) {
      fetchAssets();
    }
  }, [assetType, assetPaginationModel.pageSize, assetPaginationModel.page, activeTab]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchMaintenanceItems();
    }
  }, [
    maintenanceType,
    maintenancePaginationModel.pageSize,
    maintenancePaginationModel.page,
    activeTab,
  ]);

  useEffect(() => {
    if (activeTab === 2) {
      fetchOtherStoreItems();
    }
  }, [
    otherStoreType,
    otherStorePaginationModel.pageSize,
    otherStorePaginationModel.page,
    activeTab,
  ]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PageContainer title="Asset Management" description="This is the Asset Management page">
      <Breadcrumb title="Asset Management System" items={BCrumb} />

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="asset management tabs">
            <Tab label="Assets" />
            <Tab label="Maintenance" />
            <Tab label="Other Store" />
          </Tabs>
        </Box>

        {/* Assets Tab */}
        <TabPanel value={activeTab} index={0}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4">Assets</Typography>
              <CustomSelect
                value={assetType}
                onChange={(e) => setAssetType(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {assetTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Typography fontSize="14px">{type.label}</Typography>
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
            {/* <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus />}
              onClick={() => navigate('/admin/assets/create')}
            >
              Add Asset
            </Button> */}
          </Stack>
          <CustomTable
            rows={assets}
            columns={getAssetColumns(assetType)}
            loading={assetLoading}
            totalProducts={totalAssets}
            paginationModel={assetPaginationModel}
            setPaginationModel={setAssetPaginationModel}
          />
        </TabPanel>

        {/* Maintenance Tab */}
        <TabPanel value={activeTab} index={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4">Maintenance</Typography>
              <CustomSelect
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {maintenanceTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Typography fontSize="14px">{type.label}</Typography>
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus />}
              onClick={() => navigate(`/${userType}/maintenance/create`)}
            >
              Add Maintenance
            </Button>
          </Stack>
          <CustomTable
            rows={maintenanceItems}
            columns={getMaintenanceColumns(maintenanceType)}
            loading={maintenanceLoading}
            totalProducts={totalMaintenance}
            paginationModel={maintenancePaginationModel}
            setPaginationModel={setMaintenancePaginationModel}
          />
        </TabPanel>

        {/* Other Store Tab */}
        <TabPanel value={activeTab} index={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2} mt={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h4">Other Store</Typography>
              <CustomSelect
                value={otherStoreType}
                onChange={(e) => setOtherStoreType(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {otherStoreTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Typography fontSize="14px">{type.label}</Typography>
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconPlus />}
              onClick={() => navigate(`/${userType}/other-store/create`)}
            >
              Add Item
            </Button>
          </Stack>
          <CustomTable
            rows={otherStoreItems}
            columns={getOtherStoreColumns(otherStoreType)}
            loading={otherStoreLoading}
            totalProducts={totalOtherStore}
            paginationModel={otherStorePaginationModel}
            setPaginationModel={setOtherStorePaginationModel}
          />
        </TabPanel>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleteLoading}
            variant="contained"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default AssetManagementSystem;
