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
  createAsset,
  createMachinery,
  createVehicle,
  createSoftware,
} from '../../api/assetmanagementERP';
import SingleFileUpload from '../../utils/imageupload/components/singleFileUpload';
import MultipleImageUpload from '../../utils/imageupload/components/multipleImageUpload';
import { useMultipleImageUpload } from '../../utils/imageupload/hooks/usemultipleimageupload';
import { useSingleFileUpload } from '../../utils/imageupload/hooks/usesinglefileupload';

const AssetManagementComponent = ({ subCategory, loading, setLoading, showSnackbar }) => {
  // Form data states for each asset type
  const [machineryData, setMachineryData] = useState({
    machineId: '',
    department: '',
    inchargeEmployeeId: '',
    machineName: '',
    description: '',
    manufacturer: '',
    modelNumber: '',
    supplierName: '',
    supplierContactPerson: '',
    supplierPhoneNumber: '',
    serialNumber: '',
    dateOfPurchase: null,
    warrantyExpiryDate: null,
    price: '',
    currentValue: '',
    reportAttachment: null,
    currentStatus: 'Active',
    lastMaintenanceDate: null,
    nextMaintenanceDate: null,
    usageHours: '',
    operationalEfficiency: '',
    maintenanceHistory: '',
    maintenanceLog: '',
    repairHistory: '',
    sparePartsUsed: '',
    serviceProvider: '',
  });

  const [electricalData, setElectricalData] = useState({
    assetId: '',
    department: '',
    inchargeEmployeeId: '',
    assetName: '',
    description: '',
    manufacturer: '',
    modelNumber: '',
    supplierName: '',
    supplierContactPerson: '',
    supplierPhoneNumber: '',
    warrantyExpiryDate: null,
    price: '',
    currentValue: '',
    currentStatus: 'Active',
    lastMaintenanceDate: null,
    nextMaintenanceDate: null,
    usageHours: '',
    operationalEfficiency: '',
    maintenanceHistory: '',
    maintenanceLog: '',
    repairHistory: '',
    sparePartsUsed: '',
    serviceProvider: '',
    reportAttachment: null,
  });

  const [electronicsData, setElectronicsData] = useState({
    assetId: '',
    department: '',
    inchargeEmployeeId: '',
    assetName: '',
    description: '',
    manufacturer: '',
    modelNumber: '',
    supplierName: '',
    supplierContactPerson: '',
    supplierPhoneNumber: '',
    warrantyExpiryDate: null,
    price: '',
    currentValue: '',
    currentStatus: 'Active',
    lastMaintenanceDate: null,
    nextMaintenanceDate: null,
    usageHours: '',
    operationalEfficiency: '',
    maintenanceHistory: '',
    maintenanceLog: '',
    repairHistory: '',
    sparePartsUsed: '',
    serviceProvider: '',
    reportAttachment: null,
  });

  const [furnitureData, setFurnitureData] = useState({
    assetId: '',
    department: '',
    inchargeEmployeeId: '',
    assetName: '',
    description: '',
    manufacturer: '',
    supplierName: '',
    supplierContactPerson: '',
    supplierPhoneNumber: '',
    dateOfPurchase: null,
    warrantyExpiryDate: null,
    price: '',
    currentValue: '',
    currentStatus: 'Active',
    lastMaintenanceDate: null,
    nextMaintenanceDate: null,
    usageHours: '',
    operationalEfficiency: '',
    maintenanceHistory: '',
    maintenanceLog: '',
    repairHistory: '',
    sparePartsUsed: '',
    serviceProvider: '',
    reportAttachment: null,
  });

  const [propertyData, setPropertyData] = useState({
    propertyId: '',
    propertyName: '',
    address: '',
    location: '',
    ownershipType: '',
    ownerName: '',
    dateOfAcquisition: null,
    price: '',
    currentMarketValue: '',
    usage: '',
    department: '',
    inchargeEmployeeId: '',
    reportAttachment: null,
  });

  const [vehicleData, setVehicleData] = useState({
    name: '',
    make: '',
    model: '',
    yearOfManufacturer: '',
    vin: '',
    registrationNumber: '',
    engineNumber: '',
    chaseNumber: '',
    colour: '',
    dateOfPurchase: null,
    warrantyExpiryDate: null,
    insuranceCompany: '',
    insuranceValue: '',
    insuranceRenewalDate: null,
    maintenanceHistory: '',
    price: '',
    currentMarketValue: '',
    location: '',
    department: '',
    assignedTo: '',
    inchargeEmployeeId: '',
    reportAttachment: null,
  });

  const [softwareData, setSoftwareData] = useState({
    softwareName: '',
    vendorPublisher: '',
    version: '',
    licenseType: '',
    licenseKey: '',
    dateOfPurchase: null,
    price: '',
    currentValue: '',
    department: '',
    assignedTo: '',
    licenseStartDate: null,
    licenseExpiryDate: null,
    numberOfLicenses: '',
    licensesInUse: '',
    licensesAvailable: '',
    renewalDate: null,
    renewalCost: '',
    licenseAgreement: null,
    supportExpiryDate: null,
    inchargeEmployeeId: '',
  });

  // File upload states
  const [machineryImages, setMachineryImages] = useState([]);
  const [machineryUserManual, setMachineryUserManual] = useState(null);
  const [electricalImages, setElectricalImages] = useState([]);
  const [electricalUploadFile, setElectricalUploadFile] = useState(null);
  const [softwareLicenseAgreement, setSoftwareLicenseAgreement] = useState(null);

  // Machinery image upload hook
  const {
    images: machineryImageObjs,
    isLoading: machineryImagesLoading,
    errors: machineryImageErrors,
    addImages: addMachineryImages,
    removeImage: removeMachineryImage,
    clearAllImages: clearAllMachineryImages,
    resetImages: resetMachineryImages,
    canAddMore: canAddMoreMachineryImages,
    remainingSlots: remainingMachineryImageSlots,
  } = useMultipleImageUpload(
    (files) => setMachineryImages(files),
    {
      maxSize: 5 * 1024 * 1024, // 5MB per image
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    },
    10,
  );

  // Machinery user manual upload
  const {
    fileName: machineryUserManualFileName,
    isLoading: machineryUserManualLoading,
    error: machineryUserManualError,
    handleFileChange: handleMachineryUserManualChange,
    clearFile: clearMachineryUserManual,
  } = useSingleFileUpload((file) => setMachineryUserManual(file), {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf'],
  });

  // Electrical image upload hook
  const {
    images: electricalImageObjs,
    isLoading: electricalImagesLoading,
    errors: electricalImageErrors,
    addImages: addElectricalImages,
    removeImage: removeElectricalImage,
    clearAllImages: clearAllElectricalImages,
    resetImages: resetElectricalImages,
    canAddMore: canAddMoreElectricalImages,
    remainingSlots: remainingElectricalImageSlots,
  } = useMultipleImageUpload(
    (files) => setElectricalImages(files),
    {
      maxSize: 5 * 1024 * 1024, // 5MB per image
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    },
    10,
  );

  // Electrical upload file hook
  const {
    fileName: electricalUploadFileName,
    isLoading: electricalUploadFileLoading,
    error: electricalUploadFileError,
    handleFileChange: handleElectricalUploadFileChange,
    clearFile: clearElectricalUploadFile,
  } = useSingleFileUpload((file) => setElectricalUploadFile(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  });

  // Software license agreement upload hook
  const {
    fileName: softwareLicenseAgreementName,
    isLoading: softwareLicenseAgreementLoading,
    error: softwareLicenseAgreementError,
    handleFileChange: handleSoftwareLicenseAgreementChange,
    clearFile: clearSoftwareLicenseAgreement,
  } = useSingleFileUpload((file) => setSoftwareLicenseAgreement(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
      case 'MACHINERY':
        setMachineryData({
          machineId: '',
          department: '',
          inchargeEmployeeId: '',
          machineName: '',
          description: '',
          manufacturer: '',
          modelNumber: '',
          supplierName: '',
          supplierContactPerson: '',
          supplierPhoneNumber: '',
          serialNumber: '',
          dateOfPurchase: null,
          warrantyExpiryDate: null,
          price: '',
          currentValue: '',
          reportAttachment: null,
          currentStatus: 'Active',
          lastMaintenanceDate: null,
          nextMaintenanceDate: null,
          usageHours: '',
          operationalEfficiency: '',
          maintenanceHistory: '',
          maintenanceLog: '',
          repairHistory: '',
          sparePartsUsed: '',
          serviceProvider: '',
        });
        setMachineryImages([]);
        setMachineryUserManual(null);
        resetMachineryImages();
        clearMachineryUserManual();
        break;
      case 'ELECTRICALS':
        setElectricalData({
          assetId: '',
          department: '',
          inchargeEmployeeId: '',
          assetName: '',
          description: '',
          manufacturer: '',
          modelNumber: '',
          supplierName: '',
          supplierContactPerson: '',
          supplierPhoneNumber: '',
          warrantyExpiryDate: null,
          price: '',
          currentValue: '',
          currentStatus: 'Active',
          lastMaintenanceDate: null,
          nextMaintenanceDate: null,
          usageHours: '',
          operationalEfficiency: '',
          maintenanceHistory: '',
          maintenanceLog: '',
          repairHistory: '',
          sparePartsUsed: '',
          serviceProvider: '',
          reportAttachment: null,
        });
        clearElectricalUploadFile();
        break;
      case 'ELECTRONICS':
        setElectronicsData({
          assetId: '',
          department: '',
          inchargeEmployeeId: '',
          assetName: '',
          description: '',
          manufacturer: '',
          modelNumber: '',
          supplierName: '',
          supplierContactPerson: '',
          supplierPhoneNumber: '',
          warrantyExpiryDate: null,
          price: '',
          currentValue: '',
          currentStatus: 'Active',
          lastMaintenanceDate: null,
          nextMaintenanceDate: null,
          usageHours: '',
          operationalEfficiency: '',
          maintenanceHistory: '',
          maintenanceLog: '',
          repairHistory: '',
          sparePartsUsed: '',
          serviceProvider: '',
          reportAttachment: null,
        });
        break;
      case 'FURNITURE&FIXTURES':
        setFurnitureData({
          assetId: '',
          department: '',
          inchargeEmployeeId: '',
          assetName: '',
          description: '',
          manufacturer: '',
          supplierName: '',
          supplierContactPerson: '',
          supplierPhoneNumber: '',
          dateOfPurchase: null,
          warrantyExpiryDate: null,
          price: '',
          currentValue: '',
          currentStatus: 'Active',
          lastMaintenanceDate: null,
          nextMaintenanceDate: null,
          usageHours: '',
          operationalEfficiency: '',
          maintenanceHistory: '',
          maintenanceLog: '',
          repairHistory: '',
          sparePartsUsed: '',
          serviceProvider: '',
          reportAttachment: null,
        });
        break;
      case 'IMMOVABLE PROPERTIES':
        setPropertyData({
          propertyId: '',
          propertyName: '',
          address: '',
          location: '',
          ownershipType: '',
          ownerName: '',
          dateOfAcquisition: null,
          price: '',
          currentMarketValue: '',
          usage: '',
          department: '',
          inchargeEmployeeId: '',
          reportAttachment: null,
        });
        break;
      case 'VEHICLES':
        setVehicleData({
          name: '',
          make: '',
          model: '',
          yearOfManufacturer: '',
          vin: '',
          registrationNumber: '',
          engineNumber: '',
          chaseNumber: '',
          colour: '',
          dateOfPurchase: null,
          warrantyExpiryDate: null,
          insuranceCompany: '',
          insuranceValue: '',
          insuranceRenewalDate: null,
          maintenanceHistory: '',
          price: '',
          currentMarketValue: '',
          location: '',
          department: '',
          assignedTo: '',
          inchargeEmployeeId: '',
          reportAttachment: null,
        });
        break;
      case 'SOFTWARES&LICENSES':
        setSoftwareData({
          softwareName: '',
          vendorPublisher: '',
          version: '',
          licenseType: '',
          licenseKey: '',
          dateOfPurchase: null,
          price: '',
          currentValue: '',
          department: '',
          assignedTo: '',
          licenseStartDate: null,
          licenseExpiryDate: null,
          numberOfLicenses: '',
          licensesInUse: '',
          licensesAvailable: '',
          renewalDate: null,
          renewalCost: '',
          licenseAgreement: null,
          supportExpiryDate: null,
          inchargeEmployeeId: '',
        });
        clearSoftwareLicenseAgreement();
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
      let dataToSubmit = new FormData();
      let categoryType;
      let apiFunction;
      let successMessage;

      switch (subCategory) {
        case 'MACHINERY':
          Object.entries(machineryData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          machineryImages.forEach((file) => dataToSubmit.append('images', file));
          if (machineryUserManual) dataToSubmit.append('reportAttachment', machineryUserManual);
          categoryType = 'MACHINERY';
          apiFunction = createMachinery;
          successMessage = 'Machinery asset created successfully!';
          break;
        case 'ELECTRICALS':
          Object.entries(electricalData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          if (electricalUploadFile) dataToSubmit.append('reportAttachment', electricalUploadFile);
          categoryType = 'ELECTRICALS';
          apiFunction = createAsset;
          successMessage = 'Electrical asset created successfully!';
          break;
        case 'ELECTRONICS':
          Object.entries(electronicsData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          if (electronicsData.reportAttachment)
            dataToSubmit.append('reportAttachment', electronicsData.reportAttachment);
          categoryType = 'ELECTRONICS';
          apiFunction = createAsset;
          successMessage = 'Electronics asset created successfully!';
          break;
        case 'FURNITURE&FIXTURES':
          Object.entries(furnitureData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          if (furnitureData.reportAttachment)
            dataToSubmit.append('reportAttachment', furnitureData.reportAttachment);
          categoryType = 'FURNITURE&FIXTURES';
          apiFunction = createAsset;
          successMessage = 'Furniture asset created successfully!';
          break;
        case 'IMMOVABLE PROPERTIES':
          Object.entries(propertyData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          if (propertyData.reportAttachment)
            dataToSubmit.append('reportAttachment', propertyData.reportAttachment);
          categoryType = 'IMMOVABLE PROPERTIES';
          apiFunction = createAsset;
          successMessage = 'Property asset created successfully!';
          break;
        case 'VEHICLES':
          Object.entries(vehicleData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          if (vehicleData.reportAttachment)
            dataToSubmit.append('reportAttachment', vehicleData.reportAttachment);
          categoryType = 'VEHICLES';
          apiFunction = createVehicle;
          successMessage = 'Vehicle asset created successfully!';
          break;
        case 'SOFTWARES&LICENSES':
          Object.entries(softwareData).forEach(([key, value]) => {
            if (value instanceof Date) {
              dataToSubmit.append(key, value.toISOString());
            } else if (value !== null && value !== undefined) {
              dataToSubmit.append(key, value);
            }
          });
          if (softwareLicenseAgreement)
            dataToSubmit.append('reportAttachment', softwareLicenseAgreement);
          categoryType = 'SOFTWARES&LICENSES';
          apiFunction = createSoftware;
          successMessage = 'Software asset created successfully!';
          break;
        default:
          throw new Error('Please select a valid asset type');
      }

      // Add common fields for asset creation
      dataToSubmit.append('assetType', categoryType);
      dataToSubmit.append('createdBy', 'system');

      // Execute the API call
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

  // Render Machinery Form
  const renderMachineryForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">MACHINE ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MACHINE ID"
                  value={machineryData.machineId}
                  onChange={(e) => handleChange(setMachineryData, 'machineId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={machineryData.department}
                  onChange={(e) => handleChange(setMachineryData, 'department', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={machineryData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setMachineryData, 'inchargeEmployeeId', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MACHINE NAME"
                  value={machineryData.machineName}
                  onChange={(e) => handleChange(setMachineryData, 'machineName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={machineryData.description}
                  onChange={(e) => handleChange(setMachineryData, 'description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MANUFACTURER"
                  value={machineryData.manufacturer}
                  onChange={(e) => handleChange(setMachineryData, 'manufacturer', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MODEL NUMBER"
                  value={machineryData.modelNumber}
                  onChange={(e) => handleChange(setMachineryData, 'modelNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER NAME"
                  value={machineryData.supplierName}
                  onChange={(e) => handleChange(setMachineryData, 'supplierName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER CONTACT PERSON"
                  value={machineryData.supplierContactPerson}
                  onChange={(e) =>
                    handleChange(setMachineryData, 'supplierContactPerson', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER PHONE NUMBER"
                  value={machineryData.supplierPhoneNumber}
                  onChange={(e) =>
                    handleChange(setMachineryData, 'supplierPhoneNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SERIAL NUMBER"
                  value={machineryData.serialNumber}
                  onChange={(e) => handleChange(setMachineryData, 'serialNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={machineryData.dateOfPurchase}
                  onChange={(date) => handleChange(setMachineryData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={machineryData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setMachineryData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={machineryData.price}
                  onChange={(e) => handleChange(setMachineryData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT VALUE"
                  type="number"
                  value={machineryData.currentValue}
                  onChange={(e) => handleChange(setMachineryData, 'currentValue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <MultipleImageUpload
                  label="Machine Images"
                  id="machineryImages"
                  onChange={addMachineryImages}
                  images={machineryImageObjs}
                  isLoading={machineryImagesLoading}
                  errors={machineryImageErrors}
                  onRemove={removeMachineryImage}
                  onClear={clearAllMachineryImages}
                  required={false}
                  maxImages={10}
                  canAddMore={canAddMoreMachineryImages}
                  remainingSlots={remainingMachineryImageSlots}
                  gridSize={{ label: 3, field: 9 }}
                />
              </Grid>
              <SingleFileUpload
                label="User Manual (PDF)"
                id="machineryUserManual"
                onChange={handleMachineryUserManualChange}
                fileName={machineryUserManualFileName}
                isLoading={machineryUserManualLoading}
                error={machineryUserManualError}
                onClear={clearMachineryUserManual}
                accept="application/pdf"
                required={false}
                gridSize={{ label: 3, field: 9 }}
                showClearButton={true}
              />
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>CURRENT STATUS</InputLabel>
                  <Select
                    value={machineryData.currentStatus}
                    label="CURRENT STATUS"
                    onChange={(e) =>
                      handleChange(setMachineryData, 'currentStatus', e.target.value)
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={machineryData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setMachineryData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={machineryData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setMachineryData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="USAGE HOURS"
                  type="number"
                  value={machineryData.usageHours}
                  onChange={(e) => handleChange(setMachineryData, 'usageHours', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OPERATIONAL EFFICIENCY (%)"
                  type="number"
                  value={machineryData.operationalEfficiency}
                  onChange={(e) =>
                    handleChange(setMachineryData, 'operationalEfficiency', e.target.value)
                  }
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={machineryData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(setMachineryData, 'maintenanceHistory', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE LOG"
                  value={machineryData.maintenanceLog}
                  onChange={(e) => handleChange(setMachineryData, 'maintenanceLog', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REPAIR HISTORY"
                  value={machineryData.repairHistory}
                  onChange={(e) => handleChange(setMachineryData, 'repairHistory', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SPARE PARTS USED"
                  value={machineryData.sparePartsUsed}
                  onChange={(e) => handleChange(setMachineryData, 'sparePartsUsed', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SERVICE PROVIDER"
                  value={machineryData.serviceProvider}
                  onChange={(e) =>
                    handleChange(setMachineryData, 'serviceProvider', e.target.value)
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

  // Render Electrical Form
  const renderElectricalForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">ELECTRICAL ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSET ID"
                  value={electricalData.assetId}
                  onChange={(e) => handleChange(setElectricalData, 'assetId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={electricalData.department}
                  onChange={(e) => handleChange(setElectricalData, 'department', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={electricalData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'inchargeEmployeeId', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <SingleFileUpload
                  label="Upload File or Image (Report Attachment)"
                  id="electricalUploadFile"
                  onChange={handleElectricalUploadFileChange}
                  fileName={electricalUploadFileName}
                  isLoading={electricalUploadFileLoading}
                  error={electricalUploadFileError}
                  onClear={clearElectricalUploadFile}
                  accept="image/*,application/pdf"
                  required={false}
                  gridSize={{ label: 3, field: 9 }}
                  showClearButton={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSET NAME"
                  value={electricalData.assetName}
                  onChange={(e) => handleChange(setElectricalData, 'assetName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={electricalData.description}
                  onChange={(e) => handleChange(setElectricalData, 'description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MANUFACTURER"
                  value={electricalData.manufacturer}
                  onChange={(e) => handleChange(setElectricalData, 'manufacturer', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MODEL NUMBER"
                  value={electricalData.modelNumber}
                  onChange={(e) => handleChange(setElectricalData, 'modelNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER NAME"
                  value={electricalData.supplierName}
                  onChange={(e) => handleChange(setElectricalData, 'supplierName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER CONTACT PERSON"
                  value={electricalData.supplierContactPerson}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'supplierContactPerson', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER PHONE NUMBER"
                  value={electricalData.supplierPhoneNumber}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'supplierPhoneNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={electricalData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setElectricalData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={electricalData.price}
                  onChange={(e) => handleChange(setElectricalData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT VALUE"
                  type="number"
                  value={electricalData.currentValue}
                  onChange={(e) => handleChange(setElectricalData, 'currentValue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>CURRENT STATUS</InputLabel>
                  <Select
                    value={electricalData.currentStatus}
                    label="CURRENT STATUS"
                    onChange={(e) =>
                      handleChange(setElectricalData, 'currentStatus', e.target.value)
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={electricalData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setElectricalData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={electricalData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setElectricalData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="USAGE HOURS"
                  type="number"
                  value={electricalData.usageHours}
                  onChange={(e) => handleChange(setElectricalData, 'usageHours', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OPERATIONAL EFFICIENCY (%)"
                  type="number"
                  value={electricalData.operationalEfficiency}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'operationalEfficiency', e.target.value)
                  }
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={electricalData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'maintenanceHistory', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE LOG"
                  value={electricalData.maintenanceLog}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'maintenanceLog', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REPAIR HISTORY"
                  value={electricalData.repairHistory}
                  onChange={(e) => handleChange(setElectricalData, 'repairHistory', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SPARE PARTS USED"
                  value={electricalData.sparePartsUsed}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'sparePartsUsed', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SERVICE PROVIDER"
                  value={electricalData.serviceProvider}
                  onChange={(e) =>
                    handleChange(setElectricalData, 'serviceProvider', e.target.value)
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

  // Render Electronics Form
  const renderElectronicsForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">ELECTRONICS ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSET ID"
                  value={electronicsData.assetId}
                  onChange={(e) => handleChange(setElectronicsData, 'assetId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={electronicsData.department}
                  onChange={(e) => handleChange(setElectronicsData, 'department', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={electronicsData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'inchargeEmployeeId', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSET NAME"
                  value={electronicsData.assetName}
                  onChange={(e) => handleChange(setElectronicsData, 'assetName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={electronicsData.description}
                  onChange={(e) => handleChange(setElectronicsData, 'description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MANUFACTURER"
                  value={electronicsData.manufacturer}
                  onChange={(e) => handleChange(setElectronicsData, 'manufacturer', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MODEL NUMBER"
                  value={electronicsData.modelNumber}
                  onChange={(e) => handleChange(setElectronicsData, 'modelNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER NAME"
                  value={electronicsData.supplierName}
                  onChange={(e) => handleChange(setElectronicsData, 'supplierName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER CONTACT PERSON"
                  value={electronicsData.supplierContactPerson}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'supplierContactPerson', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER PHONE NUMBER"
                  value={electronicsData.supplierPhoneNumber}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'supplierPhoneNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={electronicsData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setElectronicsData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={electronicsData.price}
                  onChange={(e) => handleChange(setElectronicsData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT VALUE"
                  type="number"
                  value={electronicsData.currentValue}
                  onChange={(e) => handleChange(setElectronicsData, 'currentValue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>CURRENT STATUS</InputLabel>
                  <Select
                    value={electronicsData.currentStatus}
                    label="CURRENT STATUS"
                    onChange={(e) =>
                      handleChange(setElectronicsData, 'currentStatus', e.target.value)
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={electronicsData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setElectronicsData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={electronicsData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setElectronicsData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="USAGE HOURS"
                  type="number"
                  value={electronicsData.usageHours}
                  onChange={(e) => handleChange(setElectronicsData, 'usageHours', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OPERATIONAL EFFICIENCY (%)"
                  type="number"
                  value={electronicsData.operationalEfficiency}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'operationalEfficiency', e.target.value)
                  }
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={electronicsData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'maintenanceHistory', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE LOG"
                  value={electronicsData.maintenanceLog}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'maintenanceLog', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REPAIR HISTORY"
                  value={electronicsData.repairHistory}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'repairHistory', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SPARE PARTS USED"
                  value={electronicsData.sparePartsUsed}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'sparePartsUsed', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SERVICE PROVIDER"
                  value={electronicsData.serviceProvider}
                  onChange={(e) =>
                    handleChange(setElectronicsData, 'serviceProvider', e.target.value)
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

  // Render Furniture Form
  const renderFurnitureForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">FURNITURE ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSET ID"
                  value={furnitureData.assetId}
                  onChange={(e) => handleChange(setFurnitureData, 'assetId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={furnitureData.department}
                  onChange={(e) => handleChange(setFurnitureData, 'department', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={furnitureData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setFurnitureData, 'inchargeEmployeeId', e.target.value)
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSET NAME"
                  value={furnitureData.assetName}
                  onChange={(e) => handleChange(setFurnitureData, 'assetName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="DESCRIPTION"
                  value={furnitureData.description}
                  onChange={(e) => handleChange(setFurnitureData, 'description', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MANUFACTURER"
                  value={furnitureData.manufacturer}
                  onChange={(e) => handleChange(setFurnitureData, 'manufacturer', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SUPPLIER NAME"
                  value={furnitureData.supplierName}
                  onChange={(e) => handleChange(setFurnitureData, 'supplierName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER CONTACT PERSON"
                  value={furnitureData.supplierContactPerson}
                  onChange={(e) =>
                    handleChange(setFurnitureData, 'supplierContactPerson', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="SUPPLIER PHONE NUMBER"
                  value={furnitureData.supplierPhoneNumber}
                  onChange={(e) =>
                    handleChange(setFurnitureData, 'supplierPhoneNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={furnitureData.dateOfPurchase}
                  onChange={(date) => handleChange(setFurnitureData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={furnitureData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setFurnitureData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={furnitureData.price}
                  onChange={(e) => handleChange(setFurnitureData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT VALUE"
                  type="number"
                  value={furnitureData.currentValue}
                  onChange={(e) => handleChange(setFurnitureData, 'currentValue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>CURRENT STATUS</InputLabel>
                  <Select
                    value={furnitureData.currentStatus}
                    label="CURRENT STATUS"
                    onChange={(e) =>
                      handleChange(setFurnitureData, 'currentStatus', e.target.value)
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                    <MenuItem value="Retired">Retired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={furnitureData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setFurnitureData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={furnitureData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setFurnitureData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="USAGE HOURS"
                  type="number"
                  value={furnitureData.usageHours}
                  onChange={(e) => handleChange(setFurnitureData, 'usageHours', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OPERATIONAL EFFICIENCY (%)"
                  type="number"
                  value={furnitureData.operationalEfficiency}
                  onChange={(e) =>
                    handleChange(setFurnitureData, 'operationalEfficiency', e.target.value)
                  }
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={furnitureData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(setFurnitureData, 'maintenanceHistory', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE LOG"
                  value={furnitureData.maintenanceLog}
                  onChange={(e) => handleChange(setFurnitureData, 'maintenanceLog', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REPAIR HISTORY"
                  value={furnitureData.repairHistory}
                  onChange={(e) => handleChange(setFurnitureData, 'repairHistory', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SPARE PARTS USED"
                  value={furnitureData.sparePartsUsed}
                  onChange={(e) => handleChange(setFurnitureData, 'sparePartsUsed', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SERVICE PROVIDER"
                  value={furnitureData.serviceProvider}
                  onChange={(e) =>
                    handleChange(setFurnitureData, 'serviceProvider', e.target.value)
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

  // Render Property Form
  const renderPropertyForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">IMMOVABLE PROPERTY ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PROPERTY ID"
                  value={propertyData.propertyId}
                  onChange={(e) => handleChange(setPropertyData, 'propertyId', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PROPERTY NAME"
                  value={propertyData.propertyName}
                  onChange={(e) => handleChange(setPropertyData, 'propertyName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="ADDRESS"
                  value={propertyData.address}
                  onChange={(e) => handleChange(setPropertyData, 'address', e.target.value)}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LOCATION"
                  value={propertyData.location}
                  onChange={(e) => handleChange(setPropertyData, 'location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="OWNERSHIP TYPE"
                  value={propertyData.ownershipType || ''}
                  onChange={(e) => handleChange(setPropertyData, 'ownershipType', e.target.value)}
                >
                  <MenuItem value="Owned">Owned</MenuItem>
                  <MenuItem value="Leased">Leased</MenuItem>
                  <MenuItem value="Rented">Rented</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OWNER NAME"
                  value={propertyData.ownerName}
                  onChange={(e) => handleChange(setPropertyData, 'ownerName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="DATE OF ACQUISITION"
                  value={propertyData.dateOfAcquisition}
                  onChange={(date) => handleChange(setPropertyData, 'dateOfAcquisition', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={propertyData.price}
                  onChange={(e) => handleChange(setPropertyData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT MARKET VALUE"
                  type="number"
                  value={propertyData.currentMarketValue}
                  onChange={(e) =>
                    handleChange(setPropertyData, 'currentMarketValue', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="USAGE"
                  value={propertyData.usage}
                  onChange={(e) => handleChange(setPropertyData, 'usage', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={propertyData.department}
                  onChange={(e) => handleChange(setPropertyData, 'department', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={propertyData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setPropertyData, 'inchargeEmployeeId', e.target.value)
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

  // Render Vehicle Form
  const renderVehicleForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">VEHICLE ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="NAME"
                  value={vehicleData.name}
                  onChange={(e) => handleChange(setVehicleData, 'name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAKE"
                  value={vehicleData.make}
                  onChange={(e) => handleChange(setVehicleData, 'make', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MODEL"
                  value={vehicleData.model}
                  onChange={(e) => handleChange(setVehicleData, 'model', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="YEAR OF MANUFACTURER"
                  value={vehicleData.yearOfManufacturer}
                  onChange={(e) =>
                    handleChange(setVehicleData, 'yearOfManufacturer', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="VIN"
                  value={vehicleData.vin}
                  onChange={(e) => handleChange(setVehicleData, 'vin', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="REGISTRATION NUMBER"
                  value={vehicleData.registrationNumber}
                  onChange={(e) =>
                    handleChange(setVehicleData, 'registrationNumber', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ENGINE NUMBER"
                  value={vehicleData.engineNumber}
                  onChange={(e) => handleChange(setVehicleData, 'engineNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CHASE NUMBER"
                  value={vehicleData.chaseNumber}
                  onChange={(e) => handleChange(setVehicleData, 'chaseNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="COLOUR"
                  value={vehicleData.colour}
                  onChange={(e) => handleChange(setVehicleData, 'colour', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={vehicleData.dateOfPurchase}
                  onChange={(date) => handleChange(setVehicleData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={vehicleData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setVehicleData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INSURANCE COMPANY"
                  value={vehicleData.insuranceCompany}
                  onChange={(e) => handleChange(setVehicleData, 'insuranceCompany', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INSURANCE VALUE"
                  type="number"
                  value={vehicleData.insuranceValue}
                  onChange={(e) => handleChange(setVehicleData, 'insuranceValue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="INSURANCE RENEWAL DATE"
                  value={vehicleData.insuranceRenewalDate}
                  onChange={(date) => handleChange(setVehicleData, 'insuranceRenewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="MAINTENANCE HISTORY"
                  value={vehicleData.maintenanceHistory}
                  onChange={(e) =>
                    handleChange(setVehicleData, 'maintenanceHistory', e.target.value)
                  }
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={vehicleData.price}
                  onChange={(e) => handleChange(setVehicleData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT MARKET VALUE"
                  type="number"
                  value={vehicleData.currentMarketValue}
                  onChange={(e) =>
                    handleChange(setVehicleData, 'currentMarketValue', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LOCATION"
                  value={vehicleData.location}
                  onChange={(e) => handleChange(setVehicleData, 'location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={vehicleData.department}
                  onChange={(e) => handleChange(setVehicleData, 'department', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSIGNED TO"
                  value={vehicleData.assignedTo}
                  onChange={(e) => handleChange(setVehicleData, 'assignedTo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={vehicleData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setVehicleData, 'inchargeEmployeeId', e.target.value)
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

  // Render Software Form
  const renderSoftwareForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">SOFTWARE ASSET CREATION</Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="SOFTWARE NAME"
                  value={softwareData.softwareName}
                  onChange={(e) => handleChange(setSoftwareData, 'softwareName', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="VENDOR/PUBLISHER"
                  value={softwareData.vendorPublisher}
                  onChange={(e) => handleChange(setSoftwareData, 'vendorPublisher', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="VERSION"
                  value={softwareData.version}
                  onChange={(e) => handleChange(setSoftwareData, 'version', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="LICENSE TYPE"
                  value={softwareData.licenseType || ''}
                  onChange={(e) => handleChange(setSoftwareData, 'licenseType', e.target.value)}
                >
                  <MenuItem value="Perpetual">Perpetual</MenuItem>
                  <MenuItem value="Subscription">Subscription</MenuItem>
                  <MenuItem value="Open Source">Open Source</MenuItem>
                  <MenuItem value="Trial">Trial</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LICENSE KEY"
                  value={softwareData.licenseKey}
                  onChange={(e) => handleChange(setSoftwareData, 'licenseKey', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={softwareData.dateOfPurchase}
                  onChange={(date) => handleChange(setSoftwareData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="PRICE"
                  type="number"
                  value={softwareData.price}
                  onChange={(e) => handleChange(setSoftwareData, 'price', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CURRENT VALUE"
                  type="number"
                  value={softwareData.currentValue}
                  onChange={(e) => handleChange(setSoftwareData, 'currentValue', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="DEPARTMENT"
                  value={softwareData.department}
                  onChange={(e) => handleChange(setSoftwareData, 'department', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ASSIGNED TO"
                  value={softwareData.assignedTo}
                  onChange={(e) => handleChange(setSoftwareData, 'assignedTo', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LICENSE START DATE"
                  value={softwareData.licenseStartDate}
                  onChange={(date) => handleChange(setSoftwareData, 'licenseStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LICENSE EXPIRY DATE"
                  value={softwareData.licenseExpiryDate}
                  onChange={(date) => handleChange(setSoftwareData, 'licenseExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="NUMBER OF LICENSES"
                  type="number"
                  value={softwareData.numberOfLicenses}
                  onChange={(e) =>
                    handleChange(setSoftwareData, 'numberOfLicenses', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LICENSES IN USE"
                  type="number"
                  value={softwareData.licensesInUse}
                  onChange={(e) => handleChange(setSoftwareData, 'licensesInUse', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="LICENSES AVAILABLE"
                  type="number"
                  value={softwareData.licensesAvailable}
                  onChange={(e) =>
                    handleChange(setSoftwareData, 'licensesAvailable', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="RENEWAL DATE"
                  value={softwareData.renewalDate}
                  onChange={(date) => handleChange(setSoftwareData, 'renewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="RENEWAL COST"
                  type="number"
                  value={softwareData.renewalCost}
                  onChange={(e) => handleChange(setSoftwareData, 'renewalCost', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="SUPPORT EXPIRY DATE"
                  value={softwareData.supportExpiryDate}
                  onChange={(date) => handleChange(setSoftwareData, 'supportExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="INCHARGE EMPLOYEE ID"
                  value={softwareData.inchargeEmployeeId}
                  onChange={(e) =>
                    handleChange(setSoftwareData, 'inchargeEmployeeId', e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <SingleFileUpload
                  label="License Agreement"
                  id="softwareLicenseAgreement"
                  onChange={handleSoftwareLicenseAgreementChange}
                  fileName={softwareLicenseAgreementName}
                  isLoading={softwareLicenseAgreementLoading}
                  error={softwareLicenseAgreementError}
                  onClear={clearSoftwareLicenseAgreement}
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
      case 'MACHINERY':
        return renderMachineryForm();
      case 'ELECTRICALS':
        return renderElectricalForm();
      case 'ELECTRONICS':
        return renderElectronicsForm();
      case 'FURNITURE&FIXTURES':
        return renderFurnitureForm();
      case 'IMMOVABLE PROPERTIES':
        return renderPropertyForm();
      case 'VEHICLES':
        return renderVehicleForm();
      case 'SOFTWARES&LICENSES':
        return renderSoftwareForm();
      default:
        return null;
    }
  };

  return renderForm();
};

export default AssetManagementComponent;
