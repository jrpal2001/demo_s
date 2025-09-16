import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button, Box, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import {
  createQuotation,
  getQuotationById,
  updateQuotation,
  getLastQuotationNumber,
} from '@/api/quotation.api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Initial item structure for quotation items
const initialItem = {
  description: '',
  quantity: '',
  rate: '',
  total: 0,
};

// Validation schema for quotation form
const validationSchema = Yup.object().shape({
  to: Yup.string().required('Recipient is required'),
  date: Yup.date().required('Date is required'),
  qtnNo: Yup.string().required('Quotation number is required'),
  gstin: Yup.string().required('GSTIN is required'),
  gstRate: Yup.number().min(0, 'GST Rate must be 0 or greater').required('GST Rate is required'),
  items: Yup.array().of(
    Yup.object().shape({
      particulars: Yup.string().required('Particulars is required'),
      rate: Yup.number().min(0, 'Rate must be 0 or greater').required('Rate is required'),
      quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
    })
  ).min(1, 'At least one item is required'),
  note: Yup.string(),
});

// Helper function to clean payload data
const deepClean = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClean(item)).filter(item => item !== null && item !== undefined);
  }
  
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = deepClean(value);
    }
  }
  return cleaned;
};

const QuotationCreate = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = React.useState(false);
  const [lastQuotationNumber, setLastQuotationNumber] = React.useState(null);
  const [loadingLastNumber, setLoadingLastNumber] = React.useState(false);
  const [initialValues, setInitialValues] = React.useState({
    to: '',
    date: new Date().toISOString().split('T')[0],
    qtnNo: '',
    gstin: '29AAZCS6489F1Z8',
    items: [initialItem],
    note: '',
  });

  // Fetch last quotation number when creating new quotation
  React.useEffect(() => {
    if (!isEditMode) {
      const fetchLastQuotationNumber = async () => {
        try {
          setLoadingLastNumber(true);
          const lastQtnNo = await getLastQuotationNumber();
          setLastQuotationNumber(lastQtnNo);
        } catch (error) {
          console.error('Error fetching last quotation number:', error);
        } finally {
          setLoadingLastNumber(false);
        }
      };
      fetchLastQuotationNumber();
    }
  }, [isEditMode]);

  // Helper function to generate next quotation number
  const generateNextQuotationNumber = (lastNumber) => {
    if (!lastNumber) return 'QTN-001';

    // Extract the numeric part
    const match = lastNumber.match(/(\d+)$/);
    if (match) {
      const num = parseInt(match[1]) + 1;
      const prefix = lastNumber.replace(/\d+$/, '');
      return `${prefix}${num.toString().padStart(3, '0')}`;
    }

    // If no pattern found, append a number
    return `${lastNumber}-001`;
  };

  const handleAutoFillQuotationNumber = () => {
    if (lastQuotationNumber) {
      const nextNumber = generateNextQuotationNumber(lastQuotationNumber);
      formik.setFieldValue('qtnNo', nextNumber);
    }
  };

  React.useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      getQuotationById(id)
        .then((data) => {
          if (data.date) {
            data.date = data.date.split('T')[0];
          }
          setInitialValues({ ...data });
        })
        .catch(() => {
          toast.error('Failed to fetch quotation');
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [id]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setLoading(true);
        // Calculate totals as required by backend
        const total = values.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
        const gstRate = parseFloat(values.gstRate) || 0;
        const gst = total * (gstRate / 100);
        const roundedOff = 0; // You can add rounding logic if needed
        const grandTotal = total + gst + roundedOff;

        let payload = {
          ...values,
          total,
          gst,
          roundedOff,
          grandTotal,
        };
        payload = deepClean(payload);

        if (isEditMode) {
          await updateQuotation(id, payload);
          toast.success('Quotation updated successfully!');
        } else {
          await createQuotation(payload);
          toast.success('Quotation created successfully!');
        }
        resetForm();
        navigate(`/${userType}/quotation`);
      } catch (error) {
        toast.error(
          error.message ||
            (isEditMode ? 'Failed to update quotation' : 'Failed to create quotation'),
        );
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  // Calculate totals for each item and overall
  const calculateTotals = (items) => {
    if (!items || !Array.isArray(items)) return { updatedItems: [], total: 0 };

    let total = 0;
    const updatedItems = items.map((item) => {
      const rate = Number(item.rate) || 0;
      const quantity = Number(item.quantity) || 0;
      const rowTotal = rate * quantity;
      total += rowTotal;
      return { ...item, rate, quantity, total: rowTotal };
    });
    return { updatedItems, total };
  };

  React.useEffect(() => {
    try {
      const { updatedItems } = calculateTotals(formik.values.items);
      if (JSON.stringify(updatedItems) !== JSON.stringify(formik.values.items)) {
        formik.setFieldValue('items', updatedItems, false);
      }
    } catch (error) {
      console.error('Error calculating totals:', error);
    }
    // eslint-disable-next-line
  }, [formik.values.items]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/quotation`, title: 'Quotation' },
    { title: isEditMode ? 'Edit' : 'Create' },
  ];

  return (
    <PageContainer title="Admin - Quotation" description="">
      <Breadcrumb title="Quotation" items={BCrumb} />
      <ParentCard title={isEditMode ? 'Edit Quotation' : 'Create Quotation'}>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* TO */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="to" sx={{ marginTop: 0 }}>
                To
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="to"
                name="to"
                value={formik.values.to}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter recipient name or company"
                error={formik.touched.to && Boolean(formik.errors.to)}
                helperText={formik.touched.to && formik.errors.to}
              />
            </Grid2>

            {/* DATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="date" sx={{ marginTop: 0 }}>
                Date
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="date"
                name="date"
                type="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </Grid2>

            {/* QTN NO */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="qtnNo" sx={{ marginTop: 0 }}>
                Quotation No
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              {/* Quotation number input with auto-fill and last number reference */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CustomTextField
                  sx={{ flex: 1 }}
                  id="qtnNo"
                  name="qtnNo"
                  value={formik.values.qtnNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter Quotation Number"
                  error={formik.touched.qtnNo && Boolean(formik.errors.qtnNo)}
                  helperText={formik.touched.qtnNo && formik.errors.qtnNo}
                />
                {!isEditMode && lastQuotationNumber && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAutoFillQuotationNumber}
                    disabled={loadingLastNumber}
                    sx={{ minWidth: 'auto', px: 2, whiteSpace: 'nowrap' }}
                  >
                    Auto Fill
                  </Button>
                )}
                {!isEditMode && lastQuotationNumber && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      bgcolor: 'info.main',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      color: 'info.contrastText',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Last qtn no:{' '}
                    <strong style={{ marginLeft: '4px' }}>{lastQuotationNumber}</strong>
                  </Box>
                )}
                {!isEditMode && loadingLastNumber && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Loading...
                  </Box>
                )}
              </Box>
            </Grid2>

            {/* GSTIN */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="gstin" sx={{ marginTop: 0 }}>
                Our GSTIN
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="gstin"
                name="gstin"
                value={formik.values.gstin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter GSTIN"
                error={formik.touched.gstin && Boolean(formik.errors.gstin)}
                helperText={formik.touched.gstin && formik.errors.gstin}
              />
            </Grid2>

            {/* GST RATE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="gstRate" sx={{ marginTop: 0 }}>
                GST Rate (%)
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="gstRate"
                name="gstRate"
                type="number"
                value={formik.values.gstRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter GST Rate"
                error={formik.touched.gstRate && Boolean(formik.errors.gstRate)}
                helperText={formik.touched.gstRate && formik.errors.gstRate}
              />
            </Grid2>

            {/* ITEMS TABLE */}
            <Grid2 xs={12}>
              <Box mt={3}>
                <Box>
                  <Box mb={1} fontWeight="bold">
                    Items
                  </Box>
                  {(formik.values.items || []).map((item, idx) => (
                    <Grid2 container spacing={2} key={idx} alignItems="center" mb={1}>
                      <Grid2 xs={1}>{idx + 1}</Grid2>
                      <Grid2 xs={2}>
                        <CustomTextField
                          fullWidth
                          name={`items[${idx}].particulars`}
                          value={item?.particulars || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Particulars"
                          error={
                            formik.touched.items?.[idx]?.particulars &&
                            Boolean(formik.errors.items?.[idx]?.particulars)
                          }
                          helperText={
                            formik.touched.items?.[idx]?.particulars &&
                            formik.errors.items?.[idx]?.particulars
                          }
                        />
                      </Grid2>
                      <Grid2 xs={2}>
                        <CustomTextField
                          fullWidth
                          name={`items[${idx}].brand`}
                          value={item?.brand || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Brand"
                        />
                      </Grid2>
                      <Grid2 xs={1.5}>
                        <CustomTextField
                          fullWidth
                          name={`items[${idx}].mrp`}
                          value={item?.mrp || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="MRP"
                          type="number"
                        />
                      </Grid2>
                      <Grid2 xs={1.5}>
                        <CustomTextField
                          fullWidth
                          name={`items[${idx}].rate`}
                          value={item?.rate || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Rate"
                          type="number"
                          error={
                            formik.touched.items?.[idx]?.rate &&
                            Boolean(formik.errors.items?.[idx]?.rate)
                          }
                          helperText={
                            formik.touched.items?.[idx]?.rate && formik.errors.items?.[idx]?.rate
                          }
                        />
                      </Grid2>
                      <Grid2 xs={1.5}>
                        <CustomTextField
                          fullWidth
                          name={`items[${idx}].quantity`}
                          value={item?.quantity || ''}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Quantity"
                          type="number"
                          error={
                            formik.touched.items?.[idx]?.quantity &&
                            Boolean(formik.errors.items?.[idx]?.quantity)
                          }
                          helperText={
                            formik.touched.items?.[idx]?.quantity &&
                            formik.errors.items?.[idx]?.quantity
                          }
                        />
                      </Grid2>
                      <Grid2 xs={1.5}>
                        <CustomTextField
                          fullWidth
                          name={`items[${idx}].total`}
                          value={typeof item?.total === 'number' ? item.total : ''}
                          placeholder="Total"
                          type="number"
                          disabled
                        />
                      </Grid2>
                      <Grid2 xs={1}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            const newItems = formik.values.items.filter(
                              (_, index) => index !== idx,
                            );
                            formik.setFieldValue('items', newItems);
                          }}
                          disabled={formik.values.items.length === 1}
                        >
                          Remove
                        </Button>
                        {idx === formik.values.items.length - 1 && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              const newItems = [...formik.values.items, initialItem];
                              formik.setFieldValue('items', newItems);
                            }}
                            sx={{ ml: 1 }}
                          >
                            Add
                          </Button>
                        )}
                      </Grid2>
                    </Grid2>
                  ))}
                  {formik.touched.items && typeof formik.errors.items === 'string' && (
                    <div style={{ color: 'red' }}>{formik.errors.items}</div>
                  )}
                </Box>
              </Box>
            </Grid2>

            {/* NOTE */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="note" sx={{ marginTop: 0 }}>
                Note
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="note"
                name="note"
                value={formik.values.note}
                onChange={formik.handleChange}
                placeholder="e.g. Sizes 3XL-4XL, Rs. 100/- EXTRA"
              />
            </Grid2>

            {/* SUBMIT BUTTON */}
            <Grid2 xs={12} display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                sx={{ width: 'auto', minWidth: 120, alignSelf: 'flex-end' }}
              >
                Submit Quotation
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default QuotationCreate;
