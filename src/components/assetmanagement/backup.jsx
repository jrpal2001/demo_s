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
  Paper,
  Select,
  TextField,
  Typography,
  Container,
  FormLabel,
  Input,
  Box,
  Tabs,
  Tab,
  Alert,
  Snackbar,
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
  createBusinessLicense,
  createWeightsAndMeasurements,
  createSafetyEquipment,
  createAMC,
  createInsurance,
  createAgreements,
  prepareMaintenanceData,
  createToolsAndSpareParts,
  createStationeryAndHousekeeping,
  createEmbroideryStore,
} from '../../api/assetmanagementERP';
import SingleFileUpload from '../../utils/imageupload/components/singleFileUpload';
import MultipleImageUpload from '../../utils/imageupload/components/multipleImageUpload';
import { useMultipleImageUpload } from '../../utils/imageupload/hooks/usemultipleimageupload';
import { useSingleFileUpload } from '../../utils/imageupload/hooks/usesinglefileupload';

const AssetManagementSystem = () => {
  // State for selected tab and subcategory
  const [selectedTab, setSelectedTab] = useState(0);
  const [subCategory, setSubCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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

  // Maintenance form data states
  const [businessLicenseData, setBusinessLicenseData] = useState({
    licenseId: '',
    licenseType: '',
    licenseHolderName: '',
    businessName: '',
    licenseIssueDate: null,
    licenseExpiryDate: null,
    licenseRenewalFrequency: '',
    licenseRenewalDate: null,
    licenseStatus: 'Active',
    businessLocationAddress: '',
    licenseDescription: '',
    licenseCost: '',
    licensePaymentDueDate: null,
    complianceDocumentation: null,
    authorizedSignature: '',
    licenseIssuanceMethod: 'Online',
    licenseTermsAndConditions: '',
    licenseRelatedContacts: '',
    licenseTransferability: '',
    tinOrBusinessNumber: '',
    businessActivity: '',
    lastAudit: null,
    expirationReminder: '',
    documents: [],
    price: '',
  });

  const [weightsAndMeasurementsData, setWeightsAndMeasurementsData] = useState({
    weighMachineId: '',
    machineType: '',
    modelNumber: '',
    manufacturer: '',
    supplierDetails: '',
    contactPerson: '',
    contactNumber: '',
    capacity: '',
    accuracy: '',
    scaleDivision: '',
    measurementsUnits: '',
    calibrationDate: null,
    calibrationCertificateNumber: '',
    calibrationInterval: '',
    calibrationResults: '',
    calibrationDocumentation: null,
    machineStatus: 'Active',
    lastServiceDate: null,
    nextServiceDate: null,
    serviceProvider: '',
    serviceHistory: '',
    warrantyExpiryDate: null,
    calibrationAndServiceReminder: '',
    documents: [],
    price: '',
  });

  const [safetyEquipmentData, setSafetyEquipmentData] = useState({
    safetyEquipmentId: '',
    safetyEquipmentName: '',
    equipmentCategory: '',
    manufacturer: '',
    modelNumber: '',
    certifications: '',
    supplierName: '',
    supplierContact: '',
    purchaseDate: null,
    purchaseOrderNumber: '',
    warrantyPeriod: '',
    warrantyExpiryDate: null,
    location: '',
    assignedTo: '',
    equipmentStatus: 'In Use',
    usageHistory: '',
    lastMaintenanceDate: null,
    nextMaintenanceDate: null,
    maintenanceLog: '',
    equipmentHistory: '',
    documents: [],
    price: '',
  });

  const [amcData, setAmcData] = useState({
    amcId: '',
    vendorId: '',
    vendorDetails: '',
    amcType: '',
    amcStartDate: null,
    amcEndDate: null,
    amcStatus: 'Active',
    totalAmcCost: '',
    paymentTerms: '',
    serviceCovered: '',
    responseTime: '',
    maintenanceFrequency: '',
    serviceHistory: '',
    nextServiceDate: null,
    warranty: '',
    contactExpiryAlerts: '',
    documents: [],
    price: '',
  });

  const [insuranceData, setInsuranceData] = useState({
    insuranceId: '',
    insurancePolicyNumber: '',
    insuranceType: '',
    insuranceProvider: '',
    policyStartDate: null,
    policyEndDate: null,
    policyDuration: '',
    premiumAmount: '',
    paymentTerms: '',
    coverageAmount: '',
    insuredAsset: '',
    assetId: '',
    deductibleAmount: '',
    claimProcess: '',
    claimHistory: '',
    exclusions: '',
    renewalDate: null,
    renewalTerms: '',
    policyStatus: 'Active',
    certificateOfInsurance: null,
    insuranceProviderContactInfo: '',
    documents: [],
    price: '',
  });

  const [agreementsData, setAgreementsData] = useState({
    agreementId: '',
    agreementType: '',
    partiesInvolved: '',
    agreementStartDate: null,
    agreementEndDate: null,
    agreementDuration: '',
    renewalTerms: '',
    agreementValue: '',
    scopeOfAgreement: '',
    obligations: '',
    termsAndConditions: '',
    penaltyClause: '',
    confidentialityClause: '',
    terminationClause: '',
    signatories: '',
    designations: '',
    modificationHistory: '',
    approvalStatus: 'Approved',
    agreementDocument: null,
    reviewRenewalDate: null,
    complianceAssessment: '',
    documents: [],
    price: '',
  });

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

  // Add file/image upload state for each asset type, maintenance, and other stores
  const [machineryImages, setMachineryImages] = useState([]);
  const [machineryUserManual, setMachineryUserManual] = useState(null);
  const [electricalImages, setElectricalImages] = useState([]);
  const [electricalUploadFile, setElectricalUploadFile] = useState(null);
  const [softwareLicenseAgreement, setSoftwareLicenseAgreement] = useState(null);
  const [businessLicenseComplianceDoc, setBusinessLicenseComplianceDoc] = useState(null);
  const [weightsCalibrationDoc, setWeightsCalibrationDoc] = useState(null);
  const [insuranceCertificate, setInsuranceCertificate] = useState(null);
  const [agreementsDocument, setAgreementsDocument] = useState(null);
  const [toolsUserManual, setToolsUserManual] = useState(null);
  const [embroideryDesignFile, setEmbroideryDesignFile] = useState(null);

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

  // Business license compliance document upload hook
  const {
    fileName: businessLicenseComplianceDocName,
    isLoading: businessLicenseComplianceDocLoading,
    error: businessLicenseComplianceDocError,
    handleFileChange: handleBusinessLicenseComplianceDocChange,
    clearFile: clearBusinessLicenseComplianceDoc,
  } = useSingleFileUpload((file) => setBusinessLicenseComplianceDoc(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  });

  // Weights & Measurements calibration document upload hook
  const {
    fileName: weightsCalibrationDocName,
    isLoading: weightsCalibrationDocLoading,
    error: weightsCalibrationDocError,
    handleFileChange: handleWeightsCalibrationDocChange,
    clearFile: clearWeightsCalibrationDoc,
  } = useSingleFileUpload((file) => setWeightsCalibrationDoc(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  });

  // Insurance certificate upload hook
  const {
    fileName: insuranceCertificateName,
    isLoading: insuranceCertificateLoading,
    error: insuranceCertificateError,
    handleFileChange: handleInsuranceCertificateChange,
    clearFile: clearInsuranceCertificate,
  } = useSingleFileUpload((file) => setInsuranceCertificate(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  });

  // Agreements document upload hook
  const {
    fileName: agreementsDocumentName,
    isLoading: agreementsDocumentLoading,
    error: agreementsDocumentError,
    handleFileChange: handleAgreementsDocumentChange,
    clearFile: clearAgreementsDocument,
  } = useSingleFileUpload((file) => setAgreementsDocument(file), {
    maxSize: 10 * 1024 * 1024,
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  });

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

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSubCategory('');
  };

  // Handle subcategory change
  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Reset form data based on type and category
  const resetFormData = (type, category) => {
    if (type === 'asset') {
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
    } else if (type === 'maintenance') {
      switch (category) {
        case 'BUSINESS LICENSES':
          setBusinessLicenseData({
            licenseId: '',
            licenseType: '',
            licenseHolderName: '',
            businessName: '',
            licenseIssueDate: null,
            licenseExpiryDate: null,
            licenseRenewalFrequency: '',
            licenseRenewalDate: null,
            licenseStatus: 'Active',
            businessLocationAddress: '',
            licenseDescription: '',
            licenseCost: '',
            licensePaymentDueDate: null,
            complianceDocumentation: null,
            authorizedSignature: '',
            licenseIssuanceMethod: 'Online',
            licenseTermsAndConditions: '',
            licenseRelatedContacts: '',
            licenseTransferability: '',
            tinOrBusinessNumber: '',
            businessActivity: '',
            lastAudit: null,
            expirationReminder: '',
            documents: [],
            price: '',
          });
          clearBusinessLicenseComplianceDoc();
          break;
        case 'WEIGHTS&MEASUREMENTS':
          setWeightsAndMeasurementsData({
            weighMachineId: '',
            machineType: '',
            modelNumber: '',
            manufacturer: '',
            supplierDetails: '',
            contactPerson: '',
            contactNumber: '',
            capacity: '',
            accuracy: '',
            scaleDivision: '',
            measurementsUnits: '',
            calibrationDate: null,
            calibrationCertificateNumber: '',
            calibrationInterval: '',
            calibrationResults: '',
            calibrationDocumentation: null,
            machineStatus: 'Active',
            lastServiceDate: null,
            nextServiceDate: null,
            serviceProvider: '',
            serviceHistory: '',
            warrantyExpiryDate: null,
            calibrationAndServiceReminder: '',
            documents: [],
            price: '',
          });
          clearWeightsCalibrationDoc();
          break;
        case 'SAFETY EQUIPMENTS':
          setSafetyEquipmentData({
            safetyEquipmentId: '',
            safetyEquipmentName: '',
            equipmentCategory: '',
            manufacturer: '',
            modelNumber: '',
            certifications: '',
            supplierName: '',
            supplierContact: '',
            purchaseDate: null,
            purchaseOrderNumber: '',
            warrantyPeriod: '',
            warrantyExpiryDate: null,
            location: '',
            assignedTo: '',
            equipmentStatus: 'In Use',
            usageHistory: '',
            lastMaintenanceDate: null,
            nextMaintenanceDate: null,
            maintenanceLog: '',
            equipmentHistory: '',
            documents: [],
            price: '',
          });
          break;
        case 'AMC':
          setAmcData({
            amcId: '',
            vendorId: '',
            vendorDetails: '',
            amcType: '',
            amcStartDate: null,
            amcEndDate: null,
            amcStatus: 'Active',
            totalAmcCost: '',
            paymentTerms: '',
            serviceCovered: '',
            responseTime: '',
            maintenanceFrequency: '',
            serviceHistory: '',
            nextServiceDate: null,
            warranty: '',
            contactExpiryAlerts: '',
            documents: [],
            price: '',
          });
          break;
        case 'INSURANCE':
          setInsuranceData({
            insuranceId: '',
            insurancePolicyNumber: '',
            insuranceType: '',
            insuranceProvider: '',
            policyStartDate: null,
            policyEndDate: null,
            policyDuration: '',
            premiumAmount: '',
            paymentTerms: '',
            coverageAmount: '',
            insuredAsset: '',
            assetId: '',
            deductibleAmount: '',
            claimProcess: '',
            claimHistory: '',
            exclusions: '',
            renewalDate: null,
            renewalTerms: '',
            policyStatus: 'Active',
            certificateOfInsurance: null,
            insuranceProviderContactInfo: '',
            documents: [],
            price: '',
          });
          clearInsuranceCertificate();
          break;
        case 'AGREEMENTS':
          setAgreementsData({
            agreementId: '',
            agreementType: '',
            partiesInvolved: '',
            agreementStartDate: null,
            agreementEndDate: null,
            agreementDuration: '',
            renewalTerms: '',
            agreementValue: '',
            scopeOfAgreement: '',
            obligations: '',
            termsAndConditions: '',
            penaltyClause: '',
            confidentialityClause: '',
            terminationClause: '',
            signatories: '',
            designations: '',
            modificationHistory: '',
            approvalStatus: 'Approved',
            agreementDocument: null,
            reviewRenewalDate: null,
            complianceAssessment: '',
            documents: [],
            price: '',
          });
          clearAgreementsDocument();
          break;
        default:
          break;
      }
    } else if (type === 'otherStore') {
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
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let dataToSubmit;
      let categoryType;
      let apiFunction;
      let successMessage;

      // Asset Management subcategories
      if (selectedTab === 0) {
        dataToSubmit = new FormData(); // Always create FormData for assets
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
      }
      // Maintenance subcategories
      else if (selectedTab === 1) {
        let currentData;
        let fileToUpload = null;
        let fileFieldName = '';

        switch (subCategory) {
          case 'BUSINESS LICENSES':
            currentData = businessLicenseData;
            fileToUpload = businessLicenseComplianceDoc;
            fileFieldName = 'complianceDocumentation';
            categoryType = 'BUSINESS LICENSES';
            apiFunction = createBusinessLicense;
            successMessage = 'Business license created successfully!';
            break;
          case 'WEIGHTS&MEASUREMENTS':
            currentData = weightsAndMeasurementsData;
            fileToUpload = weightsCalibrationDoc;
            fileFieldName = 'calibrationDocumentation';
            categoryType = 'WEIGHTS&MEASUREMENTS';
            apiFunction = createWeightsAndMeasurements;
            successMessage = 'Weights & measurements equipment created successfully!';
            break;
          case 'SAFETY EQUIPMENTS':
            currentData = safetyEquipmentData;
            categoryType = 'SAFETY EQUIPMENTS';
            apiFunction = createSafetyEquipment;
            successMessage = 'Safety equipment created successfully!';
            break;
          case 'AMC':
            currentData = amcData;
            categoryType = 'AMC';
            apiFunction = createAMC;
            successMessage = 'AMC created successfully!';
            break;
          case 'INSURANCE':
            currentData = insuranceData;
            fileToUpload = insuranceCertificate;
            fileFieldName = 'certificateOfInsurance';
            categoryType = 'INSURANCE';
            apiFunction = createInsurance;
            successMessage = 'Insurance created successfully!';
            break;
          case 'AGREEMENTS':
            currentData = agreementsData;
            fileToUpload = agreementsDocument;
            fileFieldName = 'agreementDocument';
            categoryType = 'AGREEMENTS';
            apiFunction = createAgreements;
            successMessage = 'Agreement created successfully!';
            break;
          default:
            throw new Error('Please select a valid maintenance type');
        }

        if (fileToUpload) {
          dataToSubmit = new FormData();
          Object.entries(currentData).forEach(([key, value]) => {
            if (key !== fileFieldName) {
              if (value instanceof Date) {
                dataToSubmit.append(key, value.toISOString());
              } else if (value !== null && value !== undefined) {
                dataToSubmit.append(key, value);
              }
            }
          });
          dataToSubmit.append(fileFieldName, fileToUpload);
          dataToSubmit.append('maintenanceType', categoryType);
          dataToSubmit.append('createdBy', 'system');
        } else {
          dataToSubmit = prepareMaintenanceData(currentData, categoryType, 'system');
        }
      }
      // Other Stores subcategories
      else if (selectedTab === 2) {
        dataToSubmit = new FormData();
        let currentData;
        let fileToUpload = null;
        let fileFieldName = '';

        switch (subCategory) {
          case 'TOOLS AND SPARE PARTS':
            currentData = toolsAndSparePartsData;
            fileToUpload = toolsUserManual;
            fileFieldName = 'reportAttachment';
            categoryType = 'TOOLS AND SPARE PARTS';
            apiFunction = createToolsAndSpareParts;
            successMessage = 'Tools and spare parts created successfully!';
            break;
          case 'STATIONARY&HOUSEKEEPING':
            currentData = stationeryAndHousekeepingData;
            categoryType = 'STATIONARY&HOUSEKEEPING';
            apiFunction = createStationeryAndHousekeeping;
            successMessage = 'Stationery and housekeeping item created successfully!';
            break;
          case 'EMBROIDERY STORE':
            currentData = embroideryStoreData;
            fileToUpload = embroideryDesignFile;
            fileFieldName = 'designFileUpload';
            categoryType = 'EMBROIDERY STORE';
            apiFunction = createEmbroideryStore;
            successMessage = 'Embroidery store item created successfully!';
            break;
          default:
            throw new Error('Please select a valid other store type');
        }

        // Prepare data with proper field mapping
        const tempPreparedData = { ...currentData };
        tempPreparedData.itemType = categoryType;
        tempPreparedData.createdBy = 'system';

        // Handle specific field mappings for other stores
        if (categoryType === 'TOOLS AND SPARE PARTS') {
          // Ensure partsName is mapped to itemName for backend
          if (tempPreparedData.partsName) {
            tempPreparedData.itemName = tempPreparedData.partsName;
          }
          if (tempPreparedData.partsId) {
            tempPreparedData.itemCode = tempPreparedData.partsId;
          }
        } else if (categoryType === 'STATIONARY&HOUSEKEEPING') {
          // Ensure itemName exists
          if (!tempPreparedData.itemName) {
            tempPreparedData.itemName = 'Unnamed Stationery Item';
          }
        } else if (categoryType === 'EMBROIDERY STORE') {
          // Ensure designName is mapped to itemName for backend
          if (tempPreparedData.designName) {
            tempPreparedData.itemName = tempPreparedData.designName;
          }
          if (tempPreparedData.designId) {
            tempPreparedData.itemCode = tempPreparedData.designId;
          }
          if (tempPreparedData.jobCardId) {
            tempPreparedData.jobCardId = tempPreparedData.jobCardId;
          }
        }

        // Ensure itemName exists
        if (!tempPreparedData.itemName) {
          tempPreparedData.itemName = 'Unnamed Item';
        }
        console.log('🚀 ~ handleSubmit ~ currentData:', currentData);

        // Append all data to FormData
        Object.entries(tempPreparedData).forEach(([key, value]) => {
          if (value instanceof Date) {
            dataToSubmit.append(key, value.toISOString());
          } else if (value !== null && value !== undefined && key !== fileFieldName) {
            dataToSubmit.append(key, value);
          }
        });

        for (let pair of dataToSubmit.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        if (fileToUpload) {
          dataToSubmit.append(fileFieldName, fileToUpload);
        }
      }

      // Execute the API call
      await apiFunction(dataToSubmit);
      showSnackbar(successMessage, 'success');

      // Reset form data based on the tab and category
      if (selectedTab === 0) {
        resetFormData('asset', subCategory);
      } else if (selectedTab === 1) {
        resetFormData('maintenance', subCategory);
      } else if (selectedTab === 2) {
        resetFormData('otherStore', subCategory);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showSnackbar(error.message || 'Failed to create item', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generic change handler for form fields
  const handleChange = (setter, field, value) => {
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // File change handler
  const handleFileChange = (setter, field, event) => {
    setter((prev) => ({
      ...prev,
      [field]: event.target.files[0],
    }));
  };

  // Get subcategory options based on selected tab
  const getSubCategoryOptions = () => {
    if (selectedTab === 0) {
      return [
        { value: 'MACHINERY', label: 'MACHINERY' },
        { value: 'ELECTRICALS', label: 'ELECTRICALS' },
        { value: 'ELECTRONICS', label: 'ELECTRONICS' },
        { value: 'FURNITURE&FIXTURES', label: 'FURNITURE & FIXTURES' },
        { value: 'IMMOVABLE PROPERTIES', label: 'IMMOVABLE PROPERTIES' },
        { value: 'VEHICLES', label: 'VEHICLES' },
        { value: 'SOFTWARES&LICENSES', label: 'SOFTWARES & LICENSES' },
      ];
    } else if (selectedTab === 1) {
      return [
        { value: 'BUSINESS LICENSES', label: 'BUSINESS LICENSES' },
        { value: 'WEIGHTS&MEASUREMENTS', label: 'WEIGHTS & MEASUREMENTS' },
        { value: 'SAFETY EQUIPMENTS', label: 'SAFETY EQUIPMENTS' },
        { value: 'AMC', label: 'AMC' },
        { value: 'INSURANCE', label: 'INSURANCE' },
        { value: 'AGREEMENTS', label: 'AGREEMENTS' },
      ];
    } else if (selectedTab === 2) {
      return [
        { value: 'TOOLS AND SPARE PARTS', label: 'TOOLS AND SPARE PARTS' },
        { value: 'STATIONARY&HOUSEKEEPING', label: 'STATIONARY & HOUSEKEEPING' },
        { value: 'EMBROIDERY STORE', label: 'EMBROIDERY STORE' },
      ];
    }
    return [];
  };

  // Render Machinery Form
  const renderMachineryForm = () => (
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={machineryData.dateOfPurchase}
                  onChange={(date) => handleChange(setMachineryData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={machineryData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setMachineryData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                  onChange={(e) => handleChange(setMachineryData, 'currentStatus', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={machineryData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setMachineryData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={machineryData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setMachineryData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                onChange={(e) => handleChange(setMachineryData, 'serviceProvider', e.target.value)}
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
  );

  // Render Electrical Form
  const renderElectricalForm = () => (
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={electricalData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setElectricalData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                  onChange={(e) => handleChange(setElectricalData, 'currentStatus', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={electricalData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setElectricalData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={electricalData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setElectricalData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                onChange={(e) => handleChange(setElectricalData, 'maintenanceLog', e.target.value)}
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
                onChange={(e) => handleChange(setElectricalData, 'sparePartsUsed', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SERVICE PROVIDER"
                value={electricalData.serviceProvider}
                onChange={(e) => handleChange(setElectricalData, 'serviceProvider', e.target.value)}
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
  );

  // Render Electronics Form
  const renderElectronicsForm = () => (
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={electronicsData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setElectronicsData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={electronicsData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setElectronicsData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={electronicsData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setElectronicsData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                onChange={(e) => handleChange(setElectronicsData, 'maintenanceLog', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="REPAIR HISTORY"
                value={electronicsData.repairHistory}
                onChange={(e) => handleChange(setElectronicsData, 'repairHistory', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SPARE PARTS USED"
                value={electronicsData.sparePartsUsed}
                onChange={(e) => handleChange(setElectronicsData, 'sparePartsUsed', e.target.value)}
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
  );

  // Render Furniture Form
  const renderFurnitureForm = () => (
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={furnitureData.dateOfPurchase}
                  onChange={(date) => handleChange(setFurnitureData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={furnitureData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setFurnitureData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                  onChange={(e) => handleChange(setFurnitureData, 'currentStatus', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Retired">Retired</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={furnitureData.lastMaintenanceDate}
                  onChange={(date) => handleChange(setFurnitureData, 'lastMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={furnitureData.nextMaintenanceDate}
                  onChange={(date) => handleChange(setFurnitureData, 'nextMaintenanceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                onChange={(e) => handleChange(setFurnitureData, 'serviceProvider', e.target.value)}
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
  );

  // Render Property Form
  const renderPropertyForm = () => (
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
                fullWidth
                label="OWNERSHIP TYPE"
                value={propertyData.ownershipType}
                onChange={(e) => handleChange(setPropertyData, 'ownershipType', e.target.value)}
              />
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DATE OF ACQUISITION"
                  value={propertyData.dateOfAcquisition}
                  onChange={(date) => handleChange(setPropertyData, 'dateOfAcquisition', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
  );

  // Render Vehicle Form
  const renderVehicleForm = () => (
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
                onChange={(e) => handleChange(setVehicleData, 'yearOfManufacturer', e.target.value)}
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
                onChange={(e) => handleChange(setVehicleData, 'registrationNumber', e.target.value)}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={vehicleData.dateOfPurchase}
                  onChange={(date) => handleChange(setVehicleData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={vehicleData.warrantyExpiryDate}
                  onChange={(date) => handleChange(setVehicleData, 'warrantyExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="INSURANCE RENEWAL DATE"
                  value={vehicleData.insuranceRenewalDate}
                  onChange={(date) => handleChange(setVehicleData, 'insuranceRenewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MAINTENANCE HISTORY"
                value={vehicleData.maintenanceHistory}
                onChange={(e) => handleChange(setVehicleData, 'maintenanceHistory', e.target.value)}
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
                onChange={(e) => handleChange(setVehicleData, 'currentMarketValue', e.target.value)}
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
                onChange={(e) => handleChange(setVehicleData, 'inchargeEmployeeId', e.target.value)}
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
  );

  // Render Software Form
  const renderSoftwareForm = () => (
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
                fullWidth
                label="LICENSE TYPE"
                value={softwareData.licenseType}
                onChange={(e) => handleChange(setSoftwareData, 'licenseType', e.target.value)}
              />
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DATE OF PURCHASE"
                  value={softwareData.dateOfPurchase}
                  onChange={(date) => handleChange(setSoftwareData, 'dateOfPurchase', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LICENSE START DATE"
                  value={softwareData.licenseStartDate}
                  onChange={(date) => handleChange(setSoftwareData, 'licenseStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LICENSE EXPIRY DATE"
                  value={softwareData.licenseExpiryDate}
                  onChange={(date) => handleChange(setSoftwareData, 'licenseExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NUMBER OF LICENSES"
                type="number"
                value={softwareData.numberOfLicenses}
                onChange={(e) => handleChange(setSoftwareData, 'numberOfLicenses', e.target.value)}
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
                onChange={(e) => handleChange(setSoftwareData, 'licensesAvailable', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="RENEWAL DATE"
                  value={softwareData.renewalDate}
                  onChange={(date) => handleChange(setSoftwareData, 'renewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="SUPPORT EXPIRY DATE"
                  value={softwareData.supportExpiryDate}
                  onChange={(date) => handleChange(setSoftwareData, 'supportExpiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
  );

  // Render Business License Form
  const renderBusinessLicenseForm = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">BUSINESS LICENSE</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LICENSE ID"
                value={businessLicenseData.licenseId}
                onChange={(e) => handleChange(setBusinessLicenseData, 'licenseId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LICENSE TYPE"
                value={businessLicenseData.licenseType}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseType', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LICENSE HOLDER NAME"
                value={businessLicenseData.licenseHolderName}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseHolderName', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="BUSINESS NAME"
                value={businessLicenseData.businessName}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'businessName', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LICENSE ISSUE DATE"
                  value={businessLicenseData.licenseIssueDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licenseIssueDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LICENSE EXPIRY DATE"
                  value={businessLicenseData.licenseExpiryDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licenseExpiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LICENSE RENEWAL FREQUENCY"
                value={businessLicenseData.licenseRenewalFrequency}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseRenewalFrequency', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LICENSE RENEWAL DATE"
                  value={businessLicenseData.licenseRenewalDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licenseRenewalDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>LICENSE STATUS</InputLabel>
                <Select
                  value={businessLicenseData.licenseStatus}
                  label="LICENSE STATUS"
                  onChange={(e) =>
                    handleChange(setBusinessLicenseData, 'licenseStatus', e.target.value)
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Pending Renewal">Pending Renewal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="BUSINESS LOCATION ADDRESS"
                value={businessLicenseData.businessLocationAddress}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'businessLocationAddress', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LICENSE DESCRIPTION"
                value={businessLicenseData.licenseDescription}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseDescription', e.target.value)
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LICENSE COST"
                type="number"
                value={businessLicenseData.licenseCost}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseCost', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LICENSE PAYMENT DUE DATE"
                  value={businessLicenseData.licensePaymentDueDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licensePaymentDueDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AUTHORIZED SIGNATURE"
                value={businessLicenseData.authorizedSignature}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'authorizedSignature', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>LICENSE ISSUANCE METHOD</InputLabel>
                <Select
                  value={businessLicenseData.licenseIssuanceMethod}
                  label="LICENSE ISSUANCE METHOD"
                  onChange={(e) =>
                    handleChange(setBusinessLicenseData, 'licenseIssuanceMethod', e.target.value)
                  }
                >
                  <MenuItem value="Online">Online</MenuItem>
                  <MenuItem value="Offline">Offline</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LICENSE TERMS AND CONDITIONS"
                value={businessLicenseData.licenseTermsAndConditions}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseTermsAndConditions', e.target.value)
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="LICENSE RELATED CONTACTS"
                value={businessLicenseData.licenseRelatedContacts}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseRelatedContacts', e.target.value)
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LICENSE TRANSFERABILITY"
                value={businessLicenseData.licenseTransferability}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'licenseTransferability', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TIN OR BUSINESS NUMBER"
                value={businessLicenseData.tinOrBusinessNumber}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'tinOrBusinessNumber', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="BUSINESS ACTIVITY"
                value={businessLicenseData.businessActivity}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'businessActivity', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST AUDIT"
                  value={businessLicenseData.lastAudit}
                  onChange={(date) => handleChange(setBusinessLicenseData, 'lastAudit', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="EXPIRATION REMINDER"
                value={businessLicenseData.expirationReminder}
                onChange={(e) =>
                  handleChange(setBusinessLicenseData, 'expirationReminder', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <SingleFileUpload
                label="Compliance Documentation"
                id="businessLicenseComplianceDoc"
                onChange={handleBusinessLicenseComplianceDocChange}
                fileName={businessLicenseComplianceDocName}
                isLoading={businessLicenseComplianceDocLoading}
                error={businessLicenseComplianceDocError}
                onClear={clearBusinessLicenseComplianceDoc}
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
  );

  // Render Weights and Measurements Form
  const renderWeightsAndMeasurementsForm = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">WEIGHTS AND MEASUREMENTS</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WEIGH MACHINE ID"
                value={weightsAndMeasurementsData.weighMachineId}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'weighMachineId', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MACHINE TYPE"
                value={weightsAndMeasurementsData.machineType}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'machineType', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MODEL NUMBER"
                value={weightsAndMeasurementsData.modelNumber}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'modelNumber', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MANUFACTURER"
                value={weightsAndMeasurementsData.manufacturer}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'manufacturer', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SUPPLIER DETAILS"
                value={weightsAndMeasurementsData.supplierDetails}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'supplierDetails', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CONTACT PERSON"
                value={weightsAndMeasurementsData.contactPerson}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'contactPerson', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CONTACT NUMBER"
                value={weightsAndMeasurementsData.contactNumber}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'contactNumber', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CAPACITY"
                value={weightsAndMeasurementsData.capacity}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'capacity', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ACCURACY"
                value={weightsAndMeasurementsData.accuracy}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'accuracy', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SCALE DIVISION"
                value={weightsAndMeasurementsData.scaleDivision}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'scaleDivision', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MEASUREMENTS UNITS"
                value={weightsAndMeasurementsData.measurementsUnits}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'measurementsUnits', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="CALIBRATION DATE"
                  value={weightsAndMeasurementsData.calibrationDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'calibrationDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CALIBRATION CERTIFICATE NUMBER"
                value={weightsAndMeasurementsData.calibrationCertificateNumber}
                onChange={(e) =>
                  handleChange(
                    setWeightsAndMeasurementsData,
                    'calibrationCertificateNumber',
                    e.target.value,
                  )
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CALIBRATION INTERVAL"
                value={weightsAndMeasurementsData.calibrationInterval}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'calibrationInterval', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CALIBRATION RESULTS"
                value={weightsAndMeasurementsData.calibrationResults}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'calibrationResults', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>MACHINE STATUS</InputLabel>
                <Select
                  value={weightsAndMeasurementsData.machineStatus}
                  label="MACHINE STATUS"
                  onChange={(e) =>
                    handleChange(setWeightsAndMeasurementsData, 'machineStatus', e.target.value)
                  }
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Out of Service">Out of Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST SERVICE DATE"
                  value={weightsAndMeasurementsData.lastServiceDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'lastServiceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT SERVICE DATE"
                  value={weightsAndMeasurementsData.nextServiceDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'nextServiceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SERVICE PROVIDER"
                value={weightsAndMeasurementsData.serviceProvider}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'serviceProvider', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SERVICE HISTORY"
                value={weightsAndMeasurementsData.serviceHistory}
                onChange={(e) =>
                  handleChange(setWeightsAndMeasurementsData, 'serviceHistory', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={weightsAndMeasurementsData.warrantyExpiryDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'warrantyExpiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CALIBRATION AND SERVICE REMINDER"
                value={weightsAndMeasurementsData.calibrationAndServiceReminder}
                onChange={(e) =>
                  handleChange(
                    setWeightsAndMeasurementsData,
                    'calibrationAndServiceReminder',
                    e.target.value,
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <SingleFileUpload
                label="Calibration Documentation"
                id="weightsCalibrationDoc"
                onChange={handleWeightsCalibrationDocChange}
                fileName={weightsCalibrationDocName}
                isLoading={weightsCalibrationDocLoading}
                error={weightsCalibrationDocError}
                onClear={clearWeightsCalibrationDoc}
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
  );

  // Render Safety Equipment Form
  const renderSafetyEquipmentForm = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">SAFETY EQUIPMENTS</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SAFETY EQUIPMENT ID"
                value={safetyEquipmentData.safetyEquipmentId}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'safetyEquipmentId', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SAFETY EQUIPMENT NAME"
                value={safetyEquipmentData.safetyEquipmentName}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'safetyEquipmentName', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="EQUIPMENT CATEGORY"
                value={safetyEquipmentData.equipmentCategory}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'equipmentCategory', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MANUFACTURER"
                value={safetyEquipmentData.manufacturer}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'manufacturer', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MODEL NUMBER"
                value={safetyEquipmentData.modelNumber}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'modelNumber', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CERTIFICATIONS"
                value={safetyEquipmentData.certifications}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'certifications', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SUPPLIER NAME"
                value={safetyEquipmentData.supplierName}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'supplierName', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SUPPLIER CONTACT"
                value={safetyEquipmentData.supplierContact}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'supplierContact', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="PURCHASE DATE"
                  value={safetyEquipmentData.purchaseDate}
                  onChange={(date) => handleChange(setSafetyEquipmentData, 'purchaseDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PURCHASE ORDER NUMBER"
                value={safetyEquipmentData.purchaseOrderNumber}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'purchaseOrderNumber', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="WARRANTY PERIOD"
                value={safetyEquipmentData.warrantyPeriod}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'warrantyPeriod', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={safetyEquipmentData.warrantyExpiryDate}
                  onChange={(date) =>
                    handleChange(setSafetyEquipmentData, 'warrantyExpiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LOCATION"
                value={safetyEquipmentData.location}
                onChange={(e) => handleChange(setSafetyEquipmentData, 'location', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ASSIGNED TO"
                value={safetyEquipmentData.assignedTo}
                onChange={(e) => handleChange(setSafetyEquipmentData, 'assignedTo', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>EQUIPMENT STATUS</InputLabel>
                <Select
                  value={safetyEquipmentData.equipmentStatus}
                  label="EQUIPMENT STATUS"
                  onChange={(e) =>
                    handleChange(setSafetyEquipmentData, 'equipmentStatus', e.target.value)
                  }
                >
                  <MenuItem value="In Use">In Use</MenuItem>
                  <MenuItem value="In Storage">In Storage</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                  <MenuItem value="Out of Service">Out of Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="USAGE HISTORY"
                value={safetyEquipmentData.usageHistory}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'usageHistory', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={safetyEquipmentData.lastMaintenanceDate}
                  onChange={(date) =>
                    handleChange(setSafetyEquipmentData, 'lastMaintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={safetyEquipmentData.nextMaintenanceDate}
                  onChange={(date) =>
                    handleChange(setSafetyEquipmentData, 'nextMaintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MAINTENANCE LOG"
                value={safetyEquipmentData.maintenanceLog}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'maintenanceLog', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="EQUIPMENT HISTORY"
                value={safetyEquipmentData.equipmentHistory}
                onChange={(e) =>
                  handleChange(setSafetyEquipmentData, 'equipmentHistory', e.target.value)
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
  );

  // Render AMC Form
  const renderAMCForm = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">AMC</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AMC ID"
                value={amcData.amcId}
                onChange={(e) => handleChange(setAmcData, 'amcId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="VENDOR ID"
                value={amcData.vendorId}
                onChange={(e) => handleChange(setAmcData, 'vendorId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="VENDOR DETAILS"
                value={amcData.vendorDetails}
                onChange={(e) => handleChange(setAmcData, 'vendorDetails', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AMC TYPE"
                value={amcData.amcType}
                onChange={(e) => handleChange(setAmcData, 'amcType', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="AMC START DATE"
                  value={amcData.amcStartDate}
                  onChange={(date) => handleChange(setAmcData, 'amcStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="AMC END DATE"
                  value={amcData.amcEndDate}
                  onChange={(date) => handleChange(setAmcData, 'amcEndDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>AMC STATUS</InputLabel>
                <Select
                  value={amcData.amcStatus}
                  label="AMC STATUS"
                  onChange={(e) => handleChange(setAmcData, 'amcStatus', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Pending Renewal">Pending Renewal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TOTAL AMC COST"
                type="number"
                value={amcData.totalAmcCost}
                onChange={(e) => handleChange(setAmcData, 'totalAmcCost', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PAYMENT TERMS"
                value={amcData.paymentTerms}
                onChange={(e) => handleChange(setAmcData, 'paymentTerms', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SERVICE COVERED"
                value={amcData.serviceCovered}
                onChange={(e) => handleChange(setAmcData, 'serviceCovered', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="RESPONSE TIME"
                value={amcData.responseTime}
                onChange={(e) => handleChange(setAmcData, 'responseTime', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="MAINTENANCE FREQUENCY"
                value={amcData.maintenanceFrequency}
                onChange={(e) => handleChange(setAmcData, 'maintenanceFrequency', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SERVICE HISTORY"
                value={amcData.serviceHistory}
                onChange={(e) => handleChange(setAmcData, 'serviceHistory', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT SERVICE DATE"
                  value={amcData.nextServiceDate}
                  onChange={(date) => handleChange(setAmcData, 'nextServiceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="WARRANTY"
                value={amcData.warranty}
                onChange={(e) => handleChange(setAmcData, 'warranty', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CONTACT EXPIRY ALERTS"
                value={amcData.contactExpiryAlerts}
                onChange={(e) => handleChange(setAmcData, 'contactExpiryAlerts', e.target.value)}
                multiline
                rows={3}
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
  );

  // Render Insurance Form
  const renderInsuranceForm = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">INSURANCE</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="INSURANCE ID"
                value={insuranceData.insuranceId}
                onChange={(e) => handleChange(setInsuranceData, 'insuranceId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="INSURANCE POLICY NUMBER"
                value={insuranceData.insurancePolicyNumber}
                onChange={(e) =>
                  handleChange(setInsuranceData, 'insurancePolicyNumber', e.target.value)
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="INSURANCE TYPE"
                value={insuranceData.insuranceType}
                onChange={(e) => handleChange(setInsuranceData, 'insuranceType', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="INSURANCE PROVIDER"
                value={insuranceData.insuranceProvider}
                onChange={(e) =>
                  handleChange(setInsuranceData, 'insuranceProvider', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="POLICY START DATE"
                  value={insuranceData.policyStartDate}
                  onChange={(date) => handleChange(setInsuranceData, 'policyStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="POLICY END DATE"
                  value={insuranceData.policyEndDate}
                  onChange={(date) => handleChange(setInsuranceData, 'policyEndDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="POLICY DURATION"
                value={insuranceData.policyDuration}
                onChange={(e) => handleChange(setInsuranceData, 'policyDuration', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PREMIUM AMOUNT"
                type="number"
                value={insuranceData.premiumAmount}
                onChange={(e) => handleChange(setInsuranceData, 'premiumAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="PAYMENT TERMS"
                value={insuranceData.paymentTerms}
                onChange={(e) => handleChange(setInsuranceData, 'paymentTerms', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="COVERAGE AMOUNT"
                type="number"
                value={insuranceData.coverageAmount}
                onChange={(e) => handleChange(setInsuranceData, 'coverageAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="INSURED ASSET"
                value={insuranceData.insuredAsset}
                onChange={(e) => handleChange(setInsuranceData, 'insuredAsset', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="ASSET ID"
                value={insuranceData.assetId}
                onChange={(e) => handleChange(setInsuranceData, 'assetId', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="DEDUCTIBLE AMOUNT"
                type="number"
                value={insuranceData.deductibleAmount}
                onChange={(e) => handleChange(setInsuranceData, 'deductibleAmount', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CLAIM PROCESS"
                value={insuranceData.claimProcess}
                onChange={(e) => handleChange(setInsuranceData, 'claimProcess', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CLAIM HISTORY"
                value={insuranceData.claimHistory}
                onChange={(e) => handleChange(setInsuranceData, 'claimHistory', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="EXCLUSIONS"
                value={insuranceData.exclusions}
                onChange={(e) => handleChange(setInsuranceData, 'exclusions', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="RENEWAL DATE"
                  value={insuranceData.renewalDate}
                  onChange={(date) => handleChange(setInsuranceData, 'renewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="RENEWAL TERMS"
                value={insuranceData.renewalTerms}
                onChange={(e) => handleChange(setInsuranceData, 'renewalTerms', e.target.value)}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>POLICY STATUS</InputLabel>
                <Select
                  value={insuranceData.policyStatus}
                  label="POLICY STATUS"
                  onChange={(e) => handleChange(setInsuranceData, 'policyStatus', e.target.value)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Expired">Expired</MenuItem>
                  <MenuItem value="Pending Renewal">Pending Renewal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="INSURANCE PROVIDER CONTACT INFO"
                value={insuranceData.insuranceProviderContactInfo}
                onChange={(e) =>
                  handleChange(setInsuranceData, 'insuranceProviderContactInfo', e.target.value)
                }
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <SingleFileUpload
                label="Certificate of Insurance"
                id="insuranceCertificate"
                onChange={handleInsuranceCertificateChange}
                fileName={insuranceCertificateName}
                isLoading={insuranceCertificateLoading}
                error={insuranceCertificateError}
                onClear={clearInsuranceCertificate}
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
  );

  // Render Agreements Form (FIXED - corrected handleChange calls)
  const renderAgreementsForm = () => (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">AGREEMENTS</Typography>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AGREEMENT ID"
                value={agreementsData.agreementId}
                onChange={(e) => handleChange(setAgreementsData, 'agreementId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AGREEMENT TYPE"
                value={agreementsData.agreementType}
                onChange={(e) => handleChange(setAgreementsData, 'agreementType', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PARTIES INVOLVED"
                value={agreementsData.partiesInvolved}
                onChange={(e) => handleChange(setAgreementsData, 'partiesInvolved', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="AGREEMENT START DATE"
                  value={agreementsData.agreementStartDate}
                  onChange={(date) => handleChange(setAgreementsData, 'agreementStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="AGREEMENT END DATE"
                  value={agreementsData.agreementEndDate}
                  onChange={(date) => handleChange(setAgreementsData, 'agreementEndDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AGREEMENT DURATION"
                value={agreementsData.agreementDuration}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'agreementDuration', e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="RENEWAL TERMS"
                value={agreementsData.renewalTerms}
                onChange={(e) => handleChange(setAgreementsData, 'renewalTerms', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="AGREEMENT VALUE"
                type="number"
                value={agreementsData.agreementValue}
                onChange={(e) => handleChange(setAgreementsData, 'agreementValue', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SCOPE OF AGREEMENT"
                value={agreementsData.scopeOfAgreement}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'scopeOfAgreement', e.target.value)
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="OBLIGATIONS"
                value={agreementsData.obligations}
                onChange={(e) => handleChange(setAgreementsData, 'obligations', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TERMS AND CONDITIONS"
                value={agreementsData.termsAndConditions}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'termsAndConditions', e.target.value)
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="PENALTY CLAUSE"
                value={agreementsData.penaltyClause}
                onChange={(e) => handleChange(setAgreementsData, 'penaltyClause', e.target.value)}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CONFIDENTIALITY CLAUSE"
                value={agreementsData.confidentialityClause}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'confidentialityClause', e.target.value)
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TERMINATION CLAUSE"
                value={agreementsData.terminationClause}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'terminationClause', e.target.value)
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="SIGNATORIES"
                value={agreementsData.signatories}
                onChange={(e) => handleChange(setAgreementsData, 'signatories', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DESIGNATIONS"
                value={agreementsData.designations}
                onChange={(e) => handleChange(setAgreementsData, 'designations', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MODIFICATION HISTORY"
                value={agreementsData.modificationHistory}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'modificationHistory', e.target.value)
                }
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>APPROVAL STATUS</InputLabel>
                <Select
                  value={agreementsData.approvalStatus}
                  label="APPROVAL STATUS"
                  onChange={(e) =>
                    handleChange(setAgreementsData, 'approvalStatus', e.target.value)
                  }
                >
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Pending approval">Pending approval</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <SingleFileUpload
                label="Agreement Document"
                id="agreementsDocument"
                onChange={handleAgreementsDocumentChange}
                fileName={agreementsDocumentName}
                isLoading={agreementsDocumentLoading}
                error={agreementsDocumentError}
                onClear={clearAgreementsDocument}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                required={false}
                gridSize={{ label: 3, field: 9 }}
                showClearButton={true}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="REVIEW/RENEWAL DATE"
                  value={agreementsData.reviewRenewalDate}
                  onChange={(date) => handleChange(setAgreementsData, 'reviewRenewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="COMPLIANCE ASSESSMENT"
                value={agreementsData.complianceAssessment}
                onChange={(e) =>
                  handleChange(setAgreementsData, 'complianceAssessment', e.target.value)
                }
                multiline
                rows={2}
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
  );

  // Render Tools and Spare Parts Form (FIXED)
  const renderToolsAndSparePartsForm = () => (
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
                onChange={(e) => handleChange(setToolsAndSparePartsData, 'partsId', e.target.value)}
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="PURCHASE DATE"
                  value={toolsAndSparePartsData.purchaseDate}
                  onChange={(date) => handleChange(setToolsAndSparePartsData, 'purchaseDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="MAINTENANCE DATE"
                  value={toolsAndSparePartsData.maintenanceDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'maintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={toolsAndSparePartsData.nextMaintenanceDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'nextMaintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST PURCHASE DATE"
                  value={toolsAndSparePartsData.lastPurchaseDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'lastPurchaseDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST USAGE DATE"
                  value={toolsAndSparePartsData.lastUsageDate}
                  onChange={(date) =>
                    handleChange(setToolsAndSparePartsData, 'lastUsageDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
  );

  // Render Stationery and Housekeeping Form (FIXED)
  const renderStationeryAndHousekeepingForm = () => (
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST PURCHASED DATE"
                  value={stationeryAndHousekeepingData.lastPurchasedDate}
                  onChange={(date) =>
                    handleChange(setStationeryAndHousekeepingData, 'lastPurchasedDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
                  handleChange(setStationeryAndHousekeepingData, 'supplierContact', e.target.value)
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="EXPIRY DATE"
                  value={stationeryAndHousekeepingData.expiryDate}
                  onChange={(date) =>
                    handleChange(setStationeryAndHousekeepingData, 'expiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="LAST ISSUE DATE"
                  value={stationeryAndHousekeepingData.lastIssueDate}
                  onChange={(date) =>
                    handleChange(setStationeryAndHousekeepingData, 'lastIssueDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
  );

  // Render Embroidery Store Form (FIXED)
  const renderEmbroideryStoreForm = () => (
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
                onChange={(e) => handleChange(setEmbroideryStoreData, 'jobCardId', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="DESIGN NAME"
                value={embroideryStoreData.designName}
                onChange={(e) => handleChange(setEmbroideryStoreData, 'designName', e.target.value)}
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
                onChange={(e) => handleChange(setEmbroideryStoreData, 'threadCode', e.target.value)}
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
                onChange={(e) => handleChange(setEmbroideryStoreData, 'approvedBy', e.target.value)}
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
                onChange={(e) => handleChange(setEmbroideryStoreData, 'actualTime', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="PRODUCTION START DATE"
                  value={embroideryStoreData.productionStartDate}
                  onChange={(date) =>
                    handleChange(setEmbroideryStoreData, 'productionStartDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="PRODUCTION END DATE"
                  value={embroideryStoreData.productionEndDate}
                  onChange={(date) =>
                    handleChange(setEmbroideryStoreData, 'productionEndDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
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
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="ORDER DATE"
                  value={embroideryStoreData.orderDate}
                  onChange={(date) => handleChange(setEmbroideryStoreData, 'orderDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="DELIVERY DATE"
                  value={embroideryStoreData.deliveryDate}
                  onChange={(date) => handleChange(setEmbroideryStoreData, 'deliveryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>PRIORITY</InputLabel>
                <Select
                  value={embroideryStoreData.priority}
                  label="PRIORITY"
                  onChange={(e) => handleChange(setEmbroideryStoreData, 'priority', e.target.value)}
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
                onChange={(e) => handleChange(setEmbroideryStoreData, 'laborCost', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="TOTAL COST"
                type="number"
                value={embroideryStoreData.totalCost}
                onChange={(e) => handleChange(setEmbroideryStoreData, 'totalCost', e.target.value)}
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
  );

  // Render form based on selected tab and subcategory
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

    // Asset Management forms
    if (selectedTab === 0) {
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
    }
    // Maintenance forms
    else if (selectedTab === 1) {
      switch (subCategory) {
        case 'BUSINESS LICENSES':
          return renderBusinessLicenseForm();
        case 'WEIGHTS&MEASUREMENTS':
          return renderWeightsAndMeasurementsForm();
        case 'SAFETY EQUIPMENTS':
          return renderSafetyEquipmentForm();
        case 'AMC':
          return renderAMCForm();
        case 'INSURANCE':
          return renderInsuranceForm();
        case 'AGREEMENTS':
          return renderAgreementsForm();
        default:
          return null;
      }
    }
    // Other Stores forms
    else if (selectedTab === 2) {
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
    }

    return null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Asset Management System
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
              <Tab label="Asset Management" />
              <Tab label="Maintenance" />
              <Tab label="Other Stores" />
            </Tabs>
          </Box>

          {/* Subcategory Selection */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={subCategory}
                label="Select Category"
                onChange={handleSubCategoryChange}
              >
                {getSubCategoryOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Form */}
          {renderForm()}

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default AssetManagementSystem;
