import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Tabs,
  Tab,
  InputLabel,
  Input,
  FormHelperText,
  Link,
} from '@mui/material';
import { Formik, Form, FieldArray } from 'formik';
import { createFinalPI } from '@/api/finalpi.api.js';
import { createFinalPO, uploadPoFile } from '@/api/finalpo.api.js';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import ParentCard from '@/components/shared/ParentCard';
import Spinner from '@/components/common/spinner/Spinner';
import CompanyInfoBox from '@/components/shared/CompanyInfoBox';
import { uploadSingleFile } from '@/api/upload.api';
import { CloudUpload as CloudUploadIcon, InsertDriveFile as FileIcon } from '@mui/icons-material';
import Paper from '@mui/material/Paper';
import { useRef } from 'react';
import SingleFileUpload from '@/utils/imageupload/components/singleFileUpload.jsx';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getQuotationById } from '@/api/quotation.api.js';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const FinalPiPoCreate = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { quotationId } = useParams(); // This should be the Quotation's ObjectId
  const [tab, setTab] = useState('PI');
  const [poFile, setPoFile] = useState(null);
  const [poFileUrl, setPoFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef();
  const [piFormData, setPiFormData] = useState(null); // Start as null
  const [uploadError, setUploadError] = useState(null);
  const [piSaved, setPiSaved] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [quotationNumber, setQuotationNumber] = useState('');

  useEffect(() => {
    async function fetchQuotationNumber() {
      if (quotationId) {
        try {
          const quotation = await getQuotationById(quotationId);
          setQuotationNumber(quotation.qtnNo || quotationId);
        } catch {
          setQuotationNumber(quotationId);
        }
      }
    }
    fetchQuotationNumber();
  }, [quotationId]);

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadSingleFile(file);
      setPoFile(file);
      setPoFileUrl(url);
    } catch (err) {
      setUploadError('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileChange({ target: { files: e.dataTransfer.files } }); // Upload immediately on drop
    }
  };
  const handleAreaClick = () => {
    if (!uploading && fileInputRef.current) fileInputRef.current.click();
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/quotation`, title: 'Quotation' },
    { title: 'Add Final PI&PO' },
  ];

  const initialValues = {
    invoiceNo: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    deliveryNote: '',
    modeOrTermsOfPayment: '',
    referenceNoAndDate: '',
    otherReferences: '',
    buyersOrderNo: '',
    buyersOrderDate: '',
    dispatchDocNo: '',
    deliveryNoteDate: '',
    dispatchedThrough: '',
    destination: '',
    termsOfDelivery: '',
    consignee: '',
    buyer: '',
    quotationId: '', // for reference
    goods: [{ description: '', hsnOrSac: '', quantity: '', rate: '', per: '', amount: '' }],
  };

  return (
    <PageContainer title="Add Final PI&PO" description="">
      <Breadcrumb title="Add Final PI&PO" items={BCrumb} />
      <CompanyInfoBox />
      {/* Show Quotation Number on the right above the form */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" color="primary.main">
          Quotation ID: {quotationNumber}
        </Typography>
      </Box>
      <ParentCard title="Final PI & PO">
        <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="PI" value="PI" />
          <Tab label="PO" value="PO" />
        </Tabs>
        {tab === 'PI' && (
          <>
            <Typography variant="h4" mb={2}>
              Create Final PI&PO
            </Typography>
            <Formik
              initialValues={piFormData || { ...initialValues, quotationId: quotationId || '' }}
              validate={(values) => {
                const errors = {};
                if (!values.invoiceNo) errors.invoiceNo = 'Invoice No is required';
                if (!values.invoiceDate) errors.invoiceDate = 'Invoice Date is required';
                if (!values.quotationId) errors.quotationId = 'Quotation ID is required';
                if (!values.goods || !values.goods.length) {
                  errors.goods = [
                    {
                      description: 'Required',
                      hsnOrSac: 'Required',
                      quantity: 'Required',
                      rate: 'Required',
                      per: 'Required',
                      amount: 'Required',
                    },
                  ];
                } else {
                  errors.goods = values.goods.map((item) => {
                    const itemErrors = {};
                    if (!item.description) itemErrors.description = 'Required';
                    if (!item.hsnOrSac) itemErrors.hsnOrSac = 'Required';
                    if (!item.quantity) itemErrors.quantity = 'Required';
                    if (!item.rate) itemErrors.rate = 'Required';
                    if (!item.per) itemErrors.per = 'Required';
                    if (!item.amount) itemErrors.amount = 'Required';
                    return itemErrors;
                  });
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setPiFormData({ ...values, quotationId });
                setSubmitting(false);
              }}
            >
              {({ values, handleChange, isSubmitting, handleSubmit, errors, touched }) =>
                isSubmitting ? (
                  <Spinner />
                ) : (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Quotation Number"
                          name="quotationNumber"
                          value={quotationNumber}
                          fullWidth
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Invoice No."
                          name="invoiceNo"
                          value={values.invoiceNo}
                          onChange={handleChange}
                          fullWidth
                          required
                          error={!!errors.invoiceNo && touched.invoiceNo}
                          helperText={touched.invoiceNo && errors.invoiceNo}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Dated"
                          name="invoiceDate"
                          type="date"
                          value={values.invoiceDate}
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          required
                          error={!!errors.invoiceDate && touched.invoiceDate}
                          helperText={touched.invoiceDate && errors.invoiceDate}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Delivery Note"
                          name="deliveryNote"
                          value={values.deliveryNote}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Mode/Terms of Payment"
                          name="modeOrTermsOfPayment"
                          value={values.modeOrTermsOfPayment}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Reference No. & Date"
                          name="referenceNoAndDate"
                          value={values.referenceNoAndDate}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Other References"
                          name="otherReferences"
                          value={values.otherReferences}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Buyer's Order No."
                          name="buyersOrderNo"
                          value={values.buyersOrderNo}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Buyer's Order Date"
                          name="buyersOrderDate"
                          type="date"
                          value={values.buyersOrderDate}
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Dispatch Doc No."
                          name="dispatchDocNo"
                          value={values.dispatchDocNo}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Delivery Note Date"
                          name="deliveryNoteDate"
                          type="date"
                          value={values.deliveryNoteDate}
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Dispatched Through"
                          name="dispatchedThrough"
                          value={values.dispatchedThrough}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Destination"
                          name="destination"
                          value={values.destination}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Terms of Delivery"
                          name="termsOfDelivery"
                          value={values.termsOfDelivery}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Consignee (Ship to)"
                          name="consignee"
                          value={values.consignee}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Buyer (Bill to)"
                          name="buyer"
                          value={values.buyer}
                          onChange={handleChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" mt={2}>
                          Goods
                        </Typography>
                        <FieldArray name="goods">
                          {({ push, remove }) => (
                            <Box>
                              {values.goods.map((item, idx) => (
                                <Grid container spacing={1} key={idx} alignItems="center">
                                  <Grid item xs={2}>
                                    <TextField
                                      label="Description"
                                      name={`goods[${idx}].description`}
                                      value={item.description}
                                      onChange={handleChange}
                                      fullWidth
                                      required
                                      error={
                                        !!(
                                          errors.goods &&
                                          errors.goods[idx] &&
                                          errors.goods[idx].description
                                        ) &&
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].description
                                      }
                                      helperText={
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].description &&
                                        errors.goods &&
                                        errors.goods[idx] &&
                                        errors.goods[idx].description
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <TextField
                                      label="HSN/SAC"
                                      name={`goods[${idx}].hsnOrSac`}
                                      value={item.hsnOrSac}
                                      onChange={handleChange}
                                      fullWidth
                                      required
                                      error={
                                        !!(
                                          errors.goods &&
                                          errors.goods[idx] &&
                                          errors.goods[idx].hsnOrSac
                                        ) &&
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].hsnOrSac
                                      }
                                      helperText={
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].hsnOrSac &&
                                        errors.goods &&
                                        errors.goods[idx] &&
                                        errors.goods[idx].hsnOrSac
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <TextField
                                      label="Quantity"
                                      name={`goods[${idx}].quantity`}
                                      value={item.quantity}
                                      onChange={handleChange}
                                      fullWidth
                                      required
                                      error={
                                        !!(
                                          errors.goods &&
                                          errors.goods[idx] &&
                                          errors.goods[idx].quantity
                                        ) &&
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].quantity
                                      }
                                      helperText={
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].quantity &&
                                        errors.goods &&
                                        errors.goods[idx] &&
                                        errors.goods[idx].quantity
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <TextField
                                      label="Rate"
                                      name={`goods[${idx}].rate`}
                                      value={item.rate}
                                      onChange={handleChange}
                                      fullWidth
                                      required
                                      error={
                                        !!(
                                          errors.goods &&
                                          errors.goods[idx] &&
                                          errors.goods[idx].rate
                                        ) &&
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].rate
                                      }
                                      helperText={
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].rate &&
                                        errors.goods &&
                                        errors.goods[idx] &&
                                        errors.goods[idx].rate
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={1}>
                                    <TextField
                                      label="Per"
                                      name={`goods[${idx}].per`}
                                      value={item.per}
                                      onChange={handleChange}
                                      fullWidth
                                      required
                                      error={
                                        !!(
                                          errors.goods &&
                                          errors.goods[idx] &&
                                          errors.goods[idx].per
                                        ) &&
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].per
                                      }
                                      helperText={
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].per &&
                                        errors.goods &&
                                        errors.goods[idx] &&
                                        errors.goods[idx].per
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <TextField
                                      label="Amount"
                                      name={`goods[${idx}].amount`}
                                      value={item.amount}
                                      onChange={handleChange}
                                      fullWidth
                                      required
                                      error={
                                        !!(
                                          errors.goods &&
                                          errors.goods[idx] &&
                                          errors.goods[idx].amount
                                        ) &&
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].amount
                                      }
                                      helperText={
                                        touched.goods &&
                                        touched.goods[idx] &&
                                        touched.goods[idx].amount &&
                                        errors.goods &&
                                        errors.goods[idx] &&
                                        errors.goods[idx].amount
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={1}>
                                    <Button
                                      color="error"
                                      onClick={() => remove(idx)}
                                      disabled={values.goods.length === 1}
                                    >
                                      Remove
                                    </Button>
                                  </Grid>
                                </Grid>
                              ))}
                              <Button
                                variant="outlined"
                                onClick={() =>
                                  push({
                                    description: '',
                                    hsnOrSac: '',
                                    quantity: '',
                                    rate: '',
                                    per: '',
                                    amount: '',
                                  })
                                }
                                sx={{ mt: 1 }}
                              >
                                Add Row
                              </Button>
                            </Box>
                          )}
                        </FieldArray>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                          <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            disabled={
                              !values.invoiceNo ||
                              !values.invoiceDate ||
                              !values.quotationId ||
                              (values.goods || []).some(
                                (item) =>
                                  !item.description ||
                                  !item.hsnOrSac ||
                                  !item.quantity ||
                                  !item.rate ||
                                  !item.per ||
                                  !item.amount,
                              ) ||
                              piSaved
                            }
                            onClick={async () => {
                              try {
                                const goods = (values.goods || []).map((item) => ({
                                  ...item,
                                  quantity: Number(item.quantity),
                                  rate: Number(item.rate),
                                  amount: Number(item.amount),
                                }));
                                console.log('Submitting PI values:', { ...values, goods });
                                const piRes = await createFinalPI({ ...values, goods });
                                setPiSaved(true);
                                setSnackbarMsg('PI Saved Successfully');
                                setSnackbarOpen(true);
                                setPiFormData({ ...values, quotationId });
                                // Force a soft reload of the current page to update PI/PO state, but do not redirect away
                                setTimeout(() => {
                                  window.location.reload();
                                }, 1000);
                              } catch (error) {
                                const msg = error?.message || 'Failed to save PI';
                                setSnackbarMsg(msg);
                                setSnackbarOpen(true);
                              }
                            }}
                          >
                            {piSaved ? 'PI Saved' : 'Save PI'}
                          </Button>
                          <Button variant="outlined" onClick={() => setTab('PO')}>
                            Go to PO
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Form>
                )
              }
            </Formik>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={() => setSnackbarOpen(false)}
                severity={piSaved ? 'success' : 'error'}
              >
                {snackbarMsg}
              </MuiAlert>
            </Snackbar>
          </>
        )}
        {tab === 'PO' && (
          <>
            <Paper
              elevation={3}
              sx={{
                mt: 4,
                p: 4,
                maxWidth: 400,
                mx: 'auto',
                textAlign: 'center',
                borderRadius: 3,
                border: '2px solid #1976d2',
                bgcolor: dragActive ? '#e3f2fd' : 'background.paper',
                transition: 'background 0.2s',
                cursor: uploading ? 'not-allowed' : 'pointer',
                position: 'relative',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleAreaClick}
            >
              <Grid container alignItems="center">
                <SingleFileUpload
                  label="PO Document"
                  id="po-file-upload"
                  onChange={handleFileChange}
                  fileName={poFile ? poFile.name : ''}
                  isLoading={uploading}
                  error={uploadError}
                  onClear={() => {
                    setPoFile(null);
                    setPoFileUrl('');
                    setUploadError(null);
                  }}
                  accept=".pdf,.xls,.xlsx,.csv,.doc,.docx"
                  required={false}
                />
              </Grid>
              {poFileUrl && !uploading && (
                <FormHelperText>
                  Uploaded:{' '}
                  <Link href={poFileUrl} target="_blank" rel="noopener">
                    Download File
                  </Link>
                </FormHelperText>
              )}
            </Paper>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  // Allow PO creation even if PI is empty
                  const qId = quotationId || (piFormData && piFormData.quotationId);
                  if (!qId) {
                    alert('Quotation ID is required.');
                    return;
                  }
                  try {
                    // Optionally create PI if data is filled
                    let piId = null;
                    if (piFormData && piFormData.invoiceNo) {
                      const goods = (piFormData.goods || []).map((item) => ({
                        ...item,
                        quantity: Number(item.quantity),
                        rate: Number(item.rate),
                        amount: Number(item.amount),
                      }));
                      const piRes = await createFinalPI({ ...piFormData, goods });
                      piId = piRes.data._id;
                    }
                    // Always create PO
                    console.log('Creating PO with quotationId:', qId);
                    const poRes = await createFinalPO({ quotationId: qId });
                    const poId = poRes.data._id;
                    if (poFile) {
                      await uploadPoFile(poId, poFile);
                    }
                    // Force reload to ensure table updates
                    window.location.href = `/${userType}/quotation`;
                  } catch (error) {
                    alert('Failed to create Final PI&PO');
                  }
                }}
                disabled={uploading}
              >
                Save
              </Button>
            </Box>
          </>
        )}
      </ParentCard>
    </PageContainer>
  );
};

export default FinalPiPoCreate;
