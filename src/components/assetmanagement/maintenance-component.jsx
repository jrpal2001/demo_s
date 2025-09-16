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
  createBusinessLicense,
  createWeightsAndMeasurements,
  createSafetyEquipment,
  createAMC,
  createInsurance,
  createAgreements,
  prepareMaintenanceData,
} from '../../api/assetmanagementERP';
import SingleFileUpload from '../../utils/imageupload/components/singleFileUpload';
import { useSingleFileUpload } from '../../utils/imageupload/hooks/usesinglefileupload';

const MaintenanceComponent = ({ subCategory, loading, setLoading, showSnackbar }) => {
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

  // File upload states
  const [businessLicenseComplianceDoc, setBusinessLicenseComplianceDoc] = useState(null);
  const [weightsCalibrationDoc, setWeightsCalibrationDoc] = useState(null);
  const [insuranceCertificate, setInsuranceCertificate] = useState(null);
  const [agreementsDocument, setAgreementsDocument] = useState(null);

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
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let dataToSubmit;
      let currentData;
      let fileToUpload = null;
      let fileFieldName = '';
      let categoryType;
      let apiFunction;
      let successMessage;

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

  // Render Business License Form
  const renderBusinessLicenseForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  onChange={(e) =>
                    handleChange(setBusinessLicenseData, 'licenseId', e.target.value)
                  }
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
                <DatePicker
                  label="LICENSE ISSUE DATE"
                  value={businessLicenseData.licenseIssueDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licenseIssueDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LICENSE EXPIRY DATE"
                  value={businessLicenseData.licenseExpiryDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licenseExpiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                <DatePicker
                  label="LICENSE RENEWAL DATE"
                  value={businessLicenseData.licenseRenewalDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licenseRenewalDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                    <MenuItem value="Expired">Expired</MenuItem>
                    <MenuItem value="Pending renewal">Pending renewal</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
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
                <DatePicker
                  label="LICENSE PAYMENT DUE DATE"
                  value={businessLicenseData.licensePaymentDueDate}
                  onChange={(date) =>
                    handleChange(setBusinessLicenseData, 'licensePaymentDueDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                    <MenuItem value="In person">In person</MenuItem>
                    <MenuItem value="Via mail">Via mail</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LICENSE TERMS AND CONDITIONS"
                  value={businessLicenseData.licenseTermsAndConditions}
                  onChange={(e) =>
                    handleChange(
                      setBusinessLicenseData,
                      'licenseTermsAndConditions',
                      e.target.value,
                    )
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
                <DatePicker
                  label="LAST AUDIT"
                  value={businessLicenseData.lastAudit}
                  onChange={(date) => handleChange(setBusinessLicenseData, 'lastAudit', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
    </LocalizationProvider>
  );

  // Render Weights and Measurements Form
  const renderWeightsAndMeasurementsForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <DatePicker
                  label="CALIBRATION DATE"
                  value={weightsAndMeasurementsData.calibrationDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'calibrationDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                    handleChange(
                      setWeightsAndMeasurementsData,
                      'calibrationInterval',
                      e.target.value,
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="CALIBRATION RESULTS"
                  value={weightsAndMeasurementsData.calibrationResults}
                  onChange={(e) =>
                    handleChange(
                      setWeightsAndMeasurementsData,
                      'calibrationResults',
                      e.target.value,
                    )
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
                    <MenuItem value="Out of service">Out of service</MenuItem>
                    <MenuItem value="Under maintenance">Under maintenance</MenuItem>
                    <MenuItem value="In calibration">In calibration</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="LAST SERVICE DATE"
                  value={weightsAndMeasurementsData.lastServiceDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'lastServiceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT SERVICE DATE"
                  value={weightsAndMeasurementsData.nextServiceDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'nextServiceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={weightsAndMeasurementsData.warrantyExpiryDate}
                  onChange={(date) =>
                    handleChange(setWeightsAndMeasurementsData, 'warrantyExpiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
    </LocalizationProvider>
  );

  // Render Safety Equipment Form
  const renderSafetyEquipmentForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <DatePicker
                  label="PURCHASE DATE"
                  value={safetyEquipmentData.purchaseDate}
                  onChange={(date) => handleChange(setSafetyEquipmentData, 'purchaseDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                <DatePicker
                  label="WARRANTY EXPIRY DATE"
                  value={safetyEquipmentData.warrantyExpiryDate}
                  onChange={(date) =>
                    handleChange(setSafetyEquipmentData, 'warrantyExpiryDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                  onChange={(e) =>
                    handleChange(setSafetyEquipmentData, 'assignedTo', e.target.value)
                  }
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
                    <MenuItem value="In storage">In storage</MenuItem>
                    <MenuItem value="Under maintenance">Under maintenance</MenuItem>
                    <MenuItem value="Expired">Expired</MenuItem>
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
                <DatePicker
                  label="LAST MAINTENANCE DATE"
                  value={safetyEquipmentData.lastMaintenanceDate}
                  onChange={(date) =>
                    handleChange(setSafetyEquipmentData, 'lastMaintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="NEXT MAINTENANCE DATE"
                  value={safetyEquipmentData.nextMaintenanceDate}
                  onChange={(date) =>
                    handleChange(setSafetyEquipmentData, 'nextMaintenanceDate', date)
                  }
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
    </LocalizationProvider>
  );

  // Render AMC Form
  const renderAMCForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <DatePicker
                  label="AMC START DATE"
                  value={amcData.amcStartDate}
                  onChange={(date) => handleChange(setAmcData, 'amcStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="AMC END DATE"
                  value={amcData.amcEndDate}
                  onChange={(date) => handleChange(setAmcData, 'amcEndDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                    <MenuItem value="Pending renewal">Pending renewal</MenuItem>
                    <MenuItem value="Under review">Under review</MenuItem>
                    <MenuItem value="Terminated">Terminated</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
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
                <DatePicker
                  label="NEXT SERVICE DATE"
                  value={amcData.nextServiceDate}
                  onChange={(date) => handleChange(setAmcData, 'nextServiceDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
    </LocalizationProvider>
  );

  // Render Insurance Form
  const renderInsuranceForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                <DatePicker
                  label="POLICY START DATE"
                  value={insuranceData.policyStartDate}
                  onChange={(date) => handleChange(setInsuranceData, 'policyStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="POLICY END DATE"
                  value={insuranceData.policyEndDate}
                  onChange={(date) => handleChange(setInsuranceData, 'policyEndDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                  onChange={(e) =>
                    handleChange(setInsuranceData, 'deductibleAmount', e.target.value)
                  }
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
                <DatePicker
                  label="RENEWAL DATE"
                  value={insuranceData.renewalDate}
                  onChange={(date) => handleChange(setInsuranceData, 'renewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
    </LocalizationProvider>
  );

  // Render Agreements Form
  const renderAgreementsForm = () => (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  onChange={(e) =>
                    handleChange(setAgreementsData, 'partiesInvolved', e.target.value)
                  }
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="AGREEMENT START DATE"
                  value={agreementsData.agreementStartDate}
                  onChange={(date) => handleChange(setAgreementsData, 'agreementStartDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="AGREEMENT END DATE"
                  value={agreementsData.agreementEndDate}
                  onChange={(date) => handleChange(setAgreementsData, 'agreementEndDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
                  onChange={(e) =>
                    handleChange(setAgreementsData, 'agreementValue', e.target.value)
                  }
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
                <DatePicker
                  label="REVIEW/RENEWAL DATE"
                  value={agreementsData.reviewRenewalDate}
                  onChange={(date) => handleChange(setAgreementsData, 'reviewRenewalDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
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
  };

  return renderForm();
};

export default MaintenanceComponent;
