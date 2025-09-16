import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  createToolsAndSpareParts,
  createStationeryAndHousekeeping,
  createEmbroideryStore,
} from '../../api/assetmanagementERP';
import SingleFileUpload from '../../utils/imageupload/components/singleFileUpload';
import { useSingleFileUpload } from '../../utils/imageupload/hooks/usesinglefileupload';

const OtherStoresComponent = ({ subCategory, loading, setLoading, showSnackbar }) => {
  // Other Stores form data states
  const [toolsAndSparePartsData, setToolsAndSparePartsData] = useState({
    partsId: '',
    partsName: '',
    category: '',
    brandManufacturer: '',
    modelNumber: '',
    serialNumber: '',
    supplier: '',
    purchaseDate: null,
    warrantyPeriod: '',
    reorderPointReminder: '',
    leadTime: '',
    location: '',
    uom: '',
    usageFrequency: '',
    condition: 'New',
    maintenanceDate: null,
    maintenanceHistory: '',
    nextMaintenanceDate: null,
    userManual: null,
    maintenanceLog: '',
    repairHistory: '',
    sparePartsUsed: '',
    serviceProvider: '',
    unitCost: '',
    totalValue: '',
    lastPurchaseDate: null,
    lastUsageDate: null,
    stockMovements: [],
    currentStock: '',
    minimumStock: '',
    maximumStock: '',
    attachments: [],
    price: '',
    reportAttachment: null,
  });

  const [stationeryAndHousekeepingData, setStationeryAndHousekeepingData] = useState({
    itemName: '',
    itemCode: '',
    category: '',
    description: '',
    uom: '',
    reorderLevel: '',
    frequency: '',
    location: '',
    maintenanceHistory: '',
    lastPurchasedDate: null,
    unitCost: '',
    totalValue: '',
    supplier: '',
    supplierContact: '',
    preferredBrand: '',
    shelfLife: '',
    expiryDate: null,
    monthlyConsumption: '',
    yearlyConsumption: '',
    lastIssueDate: null,
    issuedTo: '',
    stockMovements: [],
    currentStock: '',
    minimumStock: '',
    maximumStock: '',
    attachments: [],
    price: '',
    reportAttachment: null,
  });

  const [embroideryStoreData, setEmbroideryStoreData] = useState({
    jobCardId: '',
    designName: '',
    designId: '',
    description: '',
    threadColour: '',
    threadCode: '',
    designStatus: 'Approved',
    designFileUpload: null,
    approvedBy: '',
    designCategory: '',
    designComplexity: '',
    estimatedTime: '',
    actualTime: '',
    threadDetails: [],
    productionStartDate: null,
    productionEndDate: null,
    assignedOperator: '',
    machineUsed: '',
    qualityCheck: '',
    customerName: '',
    orderNumber: '',
    orderDate: null,
    deliveryDate: null,
    priority: 'Medium',
    materialCost: '',
    laborCost: '',
    totalCost: '',
    sellingPrice: '',
    location: '',
    currentStock: '',
    minimumStock: '',
    maximumStock: '',
    attachments: [],
    price: '',
    reportAttachment: null,
  });

  // File upload states
  const [toolsUserManual, setToolsUserManual] = useState(null);
  const [embroideryDesignFile, setEmbroideryDesignFile] = useState(null);

  // Tools & Spare Parts user manual upload hook
  const {
    fileName: toolsUserManualName,
    isLoading: toolsUserManualLoading,
    error: toolsUserManualError,
    handleFileChange: handleToolsUserManualChange,
    clearFile: clearToolsUserManual,
  } = useSingleFileUpload((file) => setToolsUserManual(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  });

  // Embroidery design file upload hook
  const {
    fileName: embroideryDesignFileName,
    isLoading: embroideryDesignFileLoading,
    error: embroideryDesignFileError,
    handleFileChange: handleEmbroideryDesignFileChange,
    clearFile: clearEmbroideryDesignFile,
  } = useSingleFileUpload((file) => setEmbroideryDesignFile(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'application/postscript',
    ],
  });

  // Generic change handler for form fields
  const handleChange = (setter, field, value) => {
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form data based on category
  const resetFormData = (category) => {
    switch (category) {
      case 'TOOLS AND SPARE PARTS':
        setToolsAndSparePartsData({
          partsId: '',
          partsName: '',
          category: '',
          brandManufacturer: '',
          modelNumber: '',
          serialNumber: '',
          supplier: '',
          purchaseDate: null,
          warrantyPeriod: '',
          reorderPointReminder: '',
          leadTime: '',
          location: '',
          uom: '',
          usageFrequency: '',
          condition: 'New',
          maintenanceDate: null,
          maintenanceHistory: '',
          nextMaintenanceDate: null,
          userManual: null,
          maintenanceLog: '',
          repairHistory: '',
          sparePartsUsed: '',
          serviceProvider: '',
          unitCost: '',
          totalValue: '',
          lastPurchaseDate: null,
          lastUsageDate: null,
          stockMovements: [],
          currentStock: '',
          minimumStock: '',
          maximumStock: '',
          attachments: [],
          price: '',
          reportAttachment: null,
        });
        clearToolsUserManual();
        break;
      case 'STATIONARY&HOUSEKEEPING':
        setStationeryAndHousekeepingData({
          itemName: '',
          itemCode: '',
          category: '',
          description: '',
          uom: '',
          reorderLevel: '',
          frequency: '',
          location: '',
          maintenanceHistory: '',
          lastPurchasedDate: null,
          unitCost: '',
          totalValue: '',
          supplier: '',
          supplierContact: '',
          preferredBrand: '',
          shelfLife: '',
          expiryDate: null,
          monthlyConsumption: '',
          yearlyConsumption: '',
          lastIssueDate: null,
          issuedTo: '',
          stockMovements: [],
          currentStock: '',
          minimumStock: '',
          maximumStock: '',
          attachments: [],
          price: '',
          reportAttachment: null,
        });
        break;
      case 'EMBROIDERY STORE':
        setEmbroideryStoreData({
          jobCardId: '',
          designName: '',
          designId: '',
          description: '',
          threadColour: '',
          threadCode: '',
          designStatus: 'Approved',
          designFileUpload: null,
          approvedBy: '',
          designCategory: '',
          designComplexity: '',
          estimatedTime: '',
          actualTime: '',
          threadDetails: [],
          productionStartDate: null,
          productionEndDate: null,
          assignedOperator: '',
          machineUsed: '',
          qualityCheck: '',
          customerName: '',
          orderNumber: '',
          orderDate: null,
          deliveryDate: null,
          priority: 'Medium',
          materialCost: '',
          laborCost: '',
          totalCost: '',
          sellingPrice: '',
          location: '',
          currentStock: '',
          minimumStock: '',
          maximumStock: '',
          attachments: [],
          price: '',
          reportAttachment: null,
        });
        clearEmbroideryDesignFile();
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let currentData;
      let fileToUpload = null;
      let fileFieldName = '';
      let categoryType;
      let apiFunction;
      let successMessage;

      switch (subCategory) {
        case 'TOOLS AND SPARE PARTS':
          currentData = toolsAndSparePartsData;
          fileToUpload = toolsUserManual;
          fileFieldName = 'userManual';
          categoryType = 'TOOLS&SPAREPARTS';
          apiFunction = createToolsAndSpareParts;
          successMessage = 'Tools and spare parts created successfully!';
          break;
        case 'STATIONARY&HOUSEKEEPING':
          currentData = stationeryAndHousekeepingData;
          categoryType = 'STATIONERY&HOUSEKEEPING';
          apiFunction = createStationeryAndHousekeeping;
          successMessage = 'Stationery and housekeeping item created successfully!';
          break;
        case 'EMBROIDERY STORE':
          currentData = embroideryStoreData;
          fileToUpload = embroideryDesignFile;
          fileFieldName = 'designFileUpload';
          categoryType = 'EMBROIDERYSTORE';
          apiFunction = createEmbroideryStore;
          successMessage = 'Embroidery store item created successfully!';
          break;
        default:
          throw new Error('Please select a valid other store type');
      }

      // Validate that we have data to submit
      if (!currentData || Object.keys(currentData).length === 0) {
        throw new Error('No form data to submit');
      }

      // Add common fields
      const preparedData = {
        ...currentData,
        itemType: categoryType,
        createdBy: 'system',
      };

      // Handle specific field mappings for different store types
      if (categoryType === 'TOOLS&SPAREPARTS') {
        // Map partsName to itemName if itemName doesn't exist
        if (preparedData.partsName && !preparedData.itemName) {
          preparedData.itemName = preparedData.partsName;
        }
        // Map partsId to itemCode if itemCode doesn't exist
        if (preparedData.partsId && !preparedData.itemCode) {
          preparedData.itemCode = preparedData.partsId;
        }
      } else if (categoryType === 'EMBROIDERYSTORE') {
        // Map designName to itemName if itemName doesn't exist
        if (preparedData.designName && !preparedData.itemName) {
          preparedData.itemName = preparedData.designName;
        }
        // Map designId to itemCode if itemCode doesn't exist
        if (preparedData.designId && !preparedData.itemCode) {
          preparedData.itemCode = preparedData.designId;
        }
      }

      // Ensure we have required fields
      if (!preparedData.itemName) {
        throw new Error('Item name is required');
      }

      console.log('🚀 ~ handleSubmit ~ preparedData:', preparedData);

      // Always create FormData for consistency
      const dataToSubmit = new FormData();

      // Append all data to FormData, excluding file fields and empty values
      Object.entries(preparedData).forEach(([key, value]) => {
        if (key === fileFieldName) return; // Skip file field, handle separately

        if (value instanceof Date) {
          dataToSubmit.append(key, value.toISOString());
        } else if (value !== null && value !== undefined && value !== '') {
          // Convert arrays and objects to JSON strings
          if (typeof value === 'object') {
            dataToSubmit.append(key, JSON.stringify(value));
          } else {
            dataToSubmit.append(key, String(value));
          }
        }
      });

      // Add file if present
      if (fileToUpload) {
        dataToSubmit.append(fileFieldName, fileToUpload);
      }

      // Log FormData contents for debugging
      console.log('🚀 ~ handleSubmit ~ FormData contents:');
      for (let pair of dataToSubmit.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Execute the API call - always send FormData
      await apiFunction(dataToSubmit);
      showSnackbar(successMessage, 'success');
      resetFormData(subCategory);
    } catch (error) {
      console.error('Error submitting form:', error);
      showSnackbar(error.message || 'Failed to create item', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render Tools and Spare Parts Form
  const renderToolsAndSparePartsForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">TOOLS AND SPARE PARTS</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PARTS ID"
                  value={toolsAndSparePartsData.partsId}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'partsId', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PARTS NAME"
                  value={toolsAndSparePartsData.partsName}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'partsName', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CATEGORY"
                  value={toolsAndSparePartsData.category}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'category', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="BRAND/MANUFACTURER"
                  value={toolsAndSparePartsData.brandManufacturer}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'brandManufacturer', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MODEL NUMBER"
                  value={toolsAndSparePartsData.modelNumber}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'modelNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SERIAL NUMBER"
                  value={toolsAndSparePartsData.serialNumber}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'serialNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SUPPLIER"
                  value={toolsAndSparePartsData.supplier}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'supplier', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="PURCHASE DATE"
                  value={toolsAndSparePartsData.purchaseDate}
                  onChange={(date) => handleChange(setToolsAndSparePartsData, 'purchaseDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="WARRANTY PERIOD"
                  value={toolsAndSparePartsData.warrantyPeriod}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'warrantyPeriod', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REORDER POINT REMINDER"
                  value={toolsAndSparePartsData.reorderPointReminder}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'reorderPointReminder', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LEAD TIME"
                  value={toolsAndSparePartsData.leadTime}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'leadTime', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LOCATION"
                  value={toolsAndSparePartsData.location}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'location', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UOM"
                  value={toolsAndSparePartsData.uom}
                  onChange={(e) => handleChange(setToolsAndSparePartsData, 'uom', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="USAGE FREQUENCY"
                  value={toolsAndSparePartsData.usageFrequency}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'usageFrequency', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>CONDITION</InputLabel>
                  <Select
                    value={toolsAndSparePartsData.condition}
                    label="CONDITION"
                    onChange={(e) =>
                      handleChange(setToolsAndSparePartsData, 'condition', e.target.value)
                    }
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Used">Used</MenuItem>
                    <MenuItem value="Refurbished">Refurbished</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="MAINTENANCE DATE"
                  value={toolsAndSparePartsData.maintenanceDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'maintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={toolsAndSparePartsData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'maintenanceHistory', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={toolsAndSparePartsData.nextMaintenanceDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'nextMaintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE LOG"
                  value={toolsAndSparePartsData.maintenanceLog}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'maintenanceLog', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REPAIR HISTORY"
                  value={toolsAndSparePartsData.repairHistory}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'repairHistory', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SPARE PARTS USED"
                  value={toolsAndSparePartsData.sparePartsUsed}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'sparePartsUsed', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SERVICE PROVIDER"
                  value={toolsAndSparePartsData.serviceProvider}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'serviceProvider', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UNIT COST"
                  type="number"
                  value={toolsAndSparePartsData.unitCost}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'unitCost', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="TOTAL VALUE"
                  type="number"
                  value={toolsAndSparePartsData.totalValue}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'totalValue', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST PURCHASE DATE"
                  value={toolsAndSparePartsData.lastPurchaseDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'lastPurchaseDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST USAGE DATE"
                  value={toolsAndSparePartsData.lastUsageDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'lastUsageDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT STOCK"
                  value={toolsAndSparePartsData.currentStock}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'currentStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MINIMUM STOCK"
                  value={toolsAndSparePartsData.minimumStock}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'minimumStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAXIMUM STOCK"
                  value={toolsAndSparePartsData.maximumStock}
                  onChange={(e) =>
                    handleChange(setToolsAndSparePartsData, 'maximumStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={toolsAndSparePartsData.price}
                  onChange={(e) => handleChange(setToolsAndSparePartsData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <SingleFileUpload
                  label="User Manual (PDF)"
                  id="toolsUserManual"
                  onChange={handleToolsUserManualChange}
                  fileName={toolsUserManualName}
                  isLoading={toolsUserManualLoading}
                  error={toolsUserManualError}
                  onClear={clearToolsUserManual}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required={false}
                  gridSize={{ label: 3, field: 9 }}
                  showClearButton={true}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </LocalizationProvider>
  );

  // Render Stationery and Housekeeping Form
  const renderStationeryAndHousekeepingForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">STATIONERY AND HOUSEKEEPING</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ITEM NAME"
                  value={stationeryAndHousekeepingData.itemName}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'itemName', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ITEM CODE"
                  value={stationeryAndHousekeepingData.itemCode}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'itemCode', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CATEGORY"
                  value={stationeryAndHousekeepingData.category}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'category', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={stationeryAndHousekeepingData.description}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'description', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UOM"
                  value={stationeryAndHousekeepingData.uom}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'uom', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REORDER LEVEL"
                  value={stationeryAndHousekeepingData.reorderLevel}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'reorderLevel', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="FREQUENCY"
                  value={stationeryAndHousekeepingData.frequency}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'frequency', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LOCATION"
                  value={stationeryAndHousekeepingData.location}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'location', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={stationeryAndHousekeepingData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(
                      setStationeryAndHousekeepingData,
                      'maintenanceHistory',
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST PURCHASED DATE"
                  value={stationeryAndHousekeepingData.lastPurchasedDate}
                  onChange={(date) =>
                    handleChange(setStationeryAndHousekeepingData, 'lastPurchasedDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="UNIT COST"
                  type="number"
                  value={stationeryAndHousekeepingData.unitCost}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'unitCost', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="TOTAL VALUE"
                  type="number"
                  value={stationeryAndHousekeepingData.totalValue}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'totalValue', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SUPPLIER"
                  value={stationeryAndHousekeepingData.supplier}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'supplier', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SUPPLIER CONTACT"
                  value={stationeryAndHousekeepingData.supplierContact}
                  onChange={(e) =>
                    handleChange(
                      setStationeryAndHousekeepingData,
                      'supplierContact',
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PREFERRED BRAND"
                  value={stationeryAndHousekeepingData.preferredBrand}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'preferredBrand', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SHELF LIFE"
                  value={stationeryAndHousekeepingData.shelfLife}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'shelfLife', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="EXPIRY DATE"
                  value={stationeryAndHousekeepingData.expiryDate}
                  onChange={(date) =>
                    handleChange(setStationeryAndHousekeepingData, 'expiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MONTHLY CONSUMPTION"
                  value={stationeryAndHousekeepingData.monthlyConsumption}
                  onChange={(e) =>
                    handleChange(
                      setStationeryAndHousekeepingData,
                      'monthlyConsumption',
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="YEARLY CONSUMPTION"
                  value={stationeryAndHousekeepingData.yearlyConsumption}
                  onChange={(e) =>
                    handleChange(
                      setStationeryAndHousekeepingData,
                      'yearlyConsumption',
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST ISSUE DATE"
                  value={stationeryAndHousekeepingData.lastIssueDate}
                  onChange={(date) =>
                    handleChange(setStationeryAndHousekeepingData, 'lastIssueDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ISSUED TO"
                  value={stationeryAndHousekeepingData.issuedTo}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'issuedTo', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT STOCK"
                  value={stationeryAndHousekeepingData.currentStock}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'currentStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MINIMUM STOCK"
                  value={stationeryAndHousekeepingData.minimumStock}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'minimumStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAXIMUM STOCK"
                  value={stationeryAndHousekeepingData.maximumStock}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'maximumStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={stationeryAndHousekeepingData.price}
                  onChange={(e) =>
                    handleChange(setStationeryAndHousekeepingData, 'price', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </LocalizationProvider>
  );

  // Render Embroidery Store Form
  const renderEmbroideryStoreForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">EMBROIDERY STORE</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="JOB CARD ID"
                  value={embroideryStoreData.jobCardId}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'jobCardId', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DESIGN NAME"
                  value={embroideryStoreData.designName}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'designName', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DESIGN ID"
                  value={embroideryStoreData.designId}
                  onChange={(e) => handleChange(setEmbroideryStoreData, 'designId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={embroideryStoreData.description}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'description', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="THREAD COLOUR"
                  value={embroideryStoreData.threadColour}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'threadColour', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="THREAD CODE"
                  value={embroideryStoreData.threadCode}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'threadCode', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>DESIGN STATUS</InputLabel>
                  <Select
                    value={embroideryStoreData.designStatus}
                    label="DESIGN STATUS"
                    onChange={(e) =>
                      handleChange(setEmbroideryStoreData, 'designStatus', e.target.value)
                    }
                  >
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="APPROVED BY"
                  value={embroideryStoreData.approvedBy}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'approvedBy', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DESIGN CATEGORY"
                  value={embroideryStoreData.designCategory}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'designCategory', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DESIGN COMPLEXITY"
                  value={embroideryStoreData.designComplexity}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'designComplexity', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ESTIMATED TIME"
                  value={embroideryStoreData.estimatedTime}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'estimatedTime', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ACTUAL TIME"
                  value={embroideryStoreData.actualTime}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'actualTime', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="PRODUCTION START DATE"
                  value={embroideryStoreData.productionStartDate}
                  onChange={(date) =>
                    handleChange(setEmbroideryStoreData, 'productionStartDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="PRODUCTION END DATE"
                  value={embroideryStoreData.productionEndDate}
                  onChange={(date) =>
                    handleChange(setEmbroideryStoreData, 'productionEndDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSIGNED OPERATOR"
                  value={embroideryStoreData.assignedOperator}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'assignedOperator', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MACHINE USED"
                  value={embroideryStoreData.machineUsed}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'machineUsed', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="QUALITY CHECK"
                  value={embroideryStoreData.qualityCheck}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'qualityCheck', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CUSTOMER NAME"
                  value={embroideryStoreData.customerName}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'customerName', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ORDER NUMBER"
                  value={embroideryStoreData.orderNumber}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'orderNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="ORDER DATE"
                  value={embroideryStoreData.orderDate}
                  onChange={(date) => handleChange(setEmbroideryStoreData, 'orderDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="DELIVERY DATE"
                  value={embroideryStoreData.deliveryDate}
                  onChange={(date) => handleChange(setEmbroideryStoreData, 'deliveryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>PRIORITY</InputLabel>
                  <Select
                    value={embroideryStoreData.priority}
                    label="PRIORITY"
                    onChange={(e) =>
                      handleChange(setEmbroideryStoreData, 'priority', e.target.value)
                    }
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MATERIAL COST"
                  type="number"
                  value={embroideryStoreData.materialCost}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'materialCost', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LABOR COST"
                  type="number"
                  value={embroideryStoreData.laborCost}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'laborCost', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="TOTAL COST"
                  type="number"
                  value={embroideryStoreData.totalCost}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'totalCost', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SELLING PRICE"
                  type="number"
                  value={embroideryStoreData.sellingPrice}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'sellingPrice', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LOCATION"
                  value={embroideryStoreData.location}
                  onChange={(e) => handleChange(setEmbroideryStoreData, 'location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT STOCK"
                  value={embroideryStoreData.currentStock}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'currentStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MINIMUM STOCK"
                  value={embroideryStoreData.minimumStock}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'minimumStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAXIMUM STOCK"
                  value={embroideryStoreData.maximumStock}
                  onChange={(e) =>
                    handleChange(setEmbroideryStoreData, 'maximumStock', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={embroideryStoreData.price}
                  onChange={(e) => handleChange(setEmbroideryStoreData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <SingleFileUpload
                  label="Design File Upload"
                  id="embroideryDesignFile"
                  onChange={handleEmbroideryDesignFileChange}
                  fileName={embroideryDesignFileName}
                  isLoading={embroideryDesignFileLoading}
                  error={embroideryDesignFileError}
                  onClear={clearEmbroideryDesignFile}
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.eps,image/*,application/pdf,application/postscript"
                  required={false}
                  gridSize={{ label: 3, field: 9 }}
                  showClearButton={true}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </LocalizationProvider>
  );

  // Render form based on selected subcategory
  const renderForm = () => {
    if (!subCategory) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="textSecondary">
              Please select a subcategory to view the form
            </Typography>
          </CardContent>
        </Card>
      );
    }

    switch (subCategory) {
      case 'TOOLS AND SPARE PARTS':
        return renderToolsAndSparePartsForm();
      case 'STATIONARY&HOUSEKEEPING':
        return renderStationeryAndHousekeepingForm();
      case 'EMBROIDERY STORE':
        return renderEmbroideryStoreForm();
      default:
        return null;
    }
  };

  return renderForm();
};

export default OtherStoresComponent;
