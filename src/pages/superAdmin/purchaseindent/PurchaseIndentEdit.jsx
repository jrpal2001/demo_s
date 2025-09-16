'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Fab, Grid2, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import PurchaseItem from './components/editpi';
import { IconMinus, IconPlus } from '@tabler/icons';
import { toast } from 'react-toastify';
import { fetchPurchaseIndentById, updatePurchaseIndent } from '@/api/purchaseindent.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const PurchaseIndentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [itemCode, setItemCode] = useState(1);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      indentId: '',
      date: null,
      requestedBy: '',
      department: '',
      toDepartment: 'default',
      items: [
        {
          code: '',
          description: '',
          quantity: '',
          uom: 'default',
        },
      ],
      priority: 'default',
      remarks: '',
    },
    validationSchema: Yup.object({
      indentId: Yup.string().required('Indent ID is required'),
      date: Yup.date().required('Date is required'),
      requestedBy: Yup.string().required('Requested by is required'),
      department: Yup.string().required('Department is required'),
      toDepartment: Yup.string()
        .notOneOf(['default'], 'Please select a department')
        .required('Department is required'),
      items: Yup.array().of(
        Yup.object().shape({
          code: Yup.string().required('Item Code is required'),
          description: Yup.string().required('Item Description is required'),
          quantity: Yup.number()
            .positive('Quantity must be positive')
            .required('Quantity is required'),
          uom: Yup.string().notOneOf(['default'], 'UOM is required').required('UOM is required'),
          _id: Yup.string().nullable().notRequired(),
        }),
      ),
      priority: Yup.string()
        .notOneOf(['default'], 'Please select a priority')
        .required('Priority is required'),
      remarks: Yup.string(),
    }),
    onSubmit: async (values) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);

        // Clean and prepare the data
        const cleanedData = {
          indentId: values.indentId,
          date: values.date,
          requestedBy: values.requestedBy,
          department: values.department,
          toDepartment: values.toDepartment,
          priority: values.priority,
          remarks: values.remarks || '',
          items: values.items
            .filter((item) => item && item.code && item.description) // Filter out empty items
            .map((item) => ({
              code: item.code,
              description: item.description,
              quantity: Number(item.quantity),
              uom: item.uom,
              // Only include _id for existing items
              ...(item._id && { _id: item._id }),
            })),
        };

        console.log('Submitting cleaned data:', cleanedData);

        const response = await updatePurchaseIndent(id, cleanedData);

        if (response) {
          toast.success('Purchase indent updated successfully');
          navigate(`/${userType}/purchaseindent`);
        }
      } catch (error) {
        console.error('Submit error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update purchase indent';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClickAddition = () => {
    setItemCode((prev) => prev + 1);
    formik.setFieldValue('items', [
      ...formik.values.items.filter(Boolean),
      { code: '', description: '', quantity: '', uom: 'default' },
    ]);
  };

  const handleClickSubtraction = () => {
    if (itemCode > 1) {
      setItemCode((prev) => prev - 1);
      const newItems = formik.values.items.filter(Boolean).slice(0, -1);
      formik.setFieldValue('items', newItems);
    }
  };

  const handleClickCancel = () => {
    navigate(`/${userType}/purchaseindent`);
  };

  const fetchData = async () => {
    try {
      const response = await fetchPurchaseIndentById(id);
      console.log('🚀 ~ fetchData ~ response:', response);

      if (response) {
        const res = {
          ...response,
          date: response.date?.split('T')[0],
        };

        // Normalize code to _id string and ensure proper data structure
        if (res.items && Array.isArray(res.items)) {
          res.items = res.items.map((item) => ({
            ...item,
            code: typeof item.code === 'object' ? item.code._id : item.code,
            quantity: Number(item.quantity), // Ensure quantity is a number
            // Preserve _id for existing items
            _id: item._id,
          }));
        }

        setData(res);
        formik.setValues(res);
        setItemCode(res.items?.length || 1);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch purchase indent');
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/purchaseindent`, title: 'Purchase Indent' },
    { title: 'Edit' },
  ];

  return (
    <PageContainer title="Admin - Purchase Indent" description="">
      <Breadcrumb title="Purchase Indent" items={BCrumb} />
      <ParentCard title="Edit Purchase Indent">
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container rowSpacing={2}>
            {/* INDENT ID */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="indentId" sx={{ marginTop: 0 }}>
                Indent ID
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="indentId"
                name="indentId"
                value={formik.values.indentId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Indent ID"
                error={formik.touched.indentId && Boolean(formik.errors.indentId)}
                helperText={formik.touched.indentId && formik.errors.indentId}
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
                variant="outlined"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
              />
            </Grid2>

            {/* REQUESTED BY & DEPARTMENT */}
            <Grid2 container size={12}>
              {/* REQUESTED BY */}
              <Grid2
                size={{ xs: 12, md: 3 }}
                sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
              >
                <CustomFormLabel htmlFor="requestedBy" sx={{ marginTop: 0 }}>
                  Requested By
                </CustomFormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 4 }}>
                <CustomTextField
                  fullWidth
                  id="requestedBy"
                  name="requestedBy"
                  value={formik.values.requestedBy}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter requested by"
                  error={formik.touched.requestedBy && Boolean(formik.errors.requestedBy)}
                  helperText={formik.touched.requestedBy && formik.errors.requestedBy}
                />
              </Grid2>

              {/* DEPARTMENT */}
              <Grid2
                size={{ xs: 12, md: 2 }}
                sx={{
                  display: 'flex',
                  margin: 0,
                  alignItems: 'center',
                  justifyContent: { xs: 'start', md: 'center' },
                }}
              >
                <CustomFormLabel htmlFor="department" sx={{ marginTop: 0 }}>
                  Department
                </CustomFormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <CustomTextField
                  fullWidth
                  id="department"
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter department"
                  error={formik.touched.department && Boolean(formik.errors.department)}
                  helperText={formik.touched.department && formik.errors.department}
                />
              </Grid2>
            </Grid2>

            {/* TO DEPARTMENT */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="toDepartment" sx={{ marginTop: 0 }}>
                To Department
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="toDepartment"
                name="toDepartment"
                value={formik.values.toDepartment}
                onChange={formik.handleChange}
                error={formik.touched.toDepartment && Boolean(formik.errors.toDepartment)}
                helperText={formik.touched.toDepartment && formik.errors.toDepartment}
              >
                <MenuItem value="default" disabled>
                  Select To Department
                </MenuItem>
                <MenuItem value="fabric-store">Fabric Store</MenuItem>
                <MenuItem value="trims-machine-parts-store">Trims & Machine Parts Store</MenuItem>
                <MenuItem value="packing-accessories-store">Packing Accessories Store</MenuItem>
                <MenuItem value="asset-management">Asset Management</MenuItem>
                <MenuItem value="maintanance">Maintenance</MenuItem>
                <MenuItem value="other-stores">Other Stores</MenuItem>
              </CustomSelect>
              {formik.touched.toDepartment && formik.errors.toDepartment && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select To Department
                </p>
              )}
            </Grid2>

            {/* ITEMS */}
            <Grid2
              container
              size={12}
              sx={{ border: '1px solid grey', borderRadius: '10px', padding: '0.5rem' }}
            >
              {Array.from({ length: itemCode }).map((item, index) => {
                return <PurchaseItem formik={formik} index={index} key={index} />;
              })}
              <Grid2 size={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                  <Fab
                    size="medium"
                    color="primary"
                    onClick={handleClickAddition}
                    sx={{ marginRight: '1rem' }}
                    disabled={isSubmitting}
                  >
                    <IconPlus />
                  </Fab>
                  {itemCode > 1 && (
                    <Fab
                      size="medium"
                      color="error"
                      onClick={handleClickSubtraction}
                      disabled={isSubmitting}
                    >
                      <IconMinus />
                    </Fab>
                  )}
                </Box>
              </Grid2>
            </Grid2>

            {/* PRIORITY */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="priority" sx={{ marginTop: 0 }}>
                Priority
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomSelect
                fullWidth
                id="priority"
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                error={formik.touched.priority && Boolean(formik.errors.priority)}
                helperText={formik.touched.priority && formik.errors.priority}
              >
                <MenuItem value="default" disabled>
                  Select Priority
                </MenuItem>
                <MenuItem value="immediate">Immediate</MenuItem>
                <MenuItem value="week">In A Week</MenuItem>
                <MenuItem value="month">In A Month</MenuItem>
              </CustomSelect>
              {formik.touched.priority && formik.errors.priority && (
                <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                  Please Select Priority
                </p>
              )}
            </Grid2>

            {/* REMARKS */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel htmlFor="remarks" sx={{ marginTop: 0 }}>
                Remarks
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 9 }}>
              <CustomTextField
                fullWidth
                id="remarks"
                name="remarks"
                value={formik.values.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter Remarks"
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
              />
            </Grid2>
          </Grid2>

          {/* SUBMIT */}
          <Box
            sx={{
              margin: '1rem 1.5rem 0 0',
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <Button type="submit" sx={{ marginRight: '0.5rem' }} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Submit'}
            </Button>
            <Button type="button" onClick={handleClickCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default PurchaseIndentEdit;
