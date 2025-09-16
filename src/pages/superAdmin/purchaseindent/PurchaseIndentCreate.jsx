import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Box, Button, Fab, Grid2, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { IconMinus, IconPlus } from '@tabler/icons';
import { toast } from 'react-toastify';
import { storePurchaseIndent } from '@/api/purchaseindent.api';
import PurchaseItem from './components/itemspurchaseindent';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const PurchaseIndentCreate = () => {
  const today = new Date().toISOString().split('T')[0];

  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/purchaseindent`, title: 'Purchase Indent' },
    { title: 'Create' },
  ];

  const navigate = useNavigate();
  const [itemCode, setItemCode] = useState(1);
  const formik = useFormik({
    initialValues: {
      indentId: '',
      date: today,
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
          quantity: Yup.string().required('Quantity is required'),
          uom: Yup.string().notOneOf(['default'], 'UOM is required').required('UOM is required'),
        }),
      ),
      priority: Yup.string()
        .notOneOf(['default'], 'Please select a priority')
        .required('Priority is required'),
      remarks: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.entries(values).map(([key, value]) => {
          if (key == 'items') {
            value.map((val, index) => {
              let theKey = `items[${index}]`;
              if (typeof val === 'object') {
                const newValue = JSON.stringify(val);
                formData.append(theKey, newValue);
              }
            });
          } else {
            formData.append(key, value);
          }
        });

        const response = await storePurchaseIndent(formData);
        if (response) {
          toast.success('Purchase indent created');
          navigate(`/${userType}/purchaseindent`);
        }
      } catch (error) {
        toast.error('Creating purchase indent failed');
      }
    },
  });

  const handleClickAddition = () => {
    setItemCode((prev) => {
      prev = prev + 1;
      return prev;
    });
    formik.setFieldValue('items', [
      ...formik.values.items,
      { code: '', description: '', quantity: '', uom: 'default' }, // Add new empty object to fabric array
    ]);
  };

  const handleClickSubtraction = () => {
    setItemCode((prev) => {
      if (prev > 1) {
        prev = prev - 1;
        return prev;
      }
    });
    formik.setFieldValue('fabric', formik.values.items.slice(0, -1));
  };

  const handleClickCancel = () => {
    navigate(`/${userType}/purchaseindent`);
  };

  return (
    <PageContainer title="Admin - Purchase Indent" description="">
      <Breadcrumb title="Purchase Indent" items={BCrumb} />
      <ParentCard title="Create Purchase Indent">
        <form action="" method="POST" onSubmit={formik.handleSubmit}>
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
                type="date"
                variant="outlined"
                value={formik.values.date}
                onChange={formik.handleChange} // optionally remove if fully locked
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputProps={{ readOnly: true }} // makes input readonly
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

            {/*  TO DEPARTMENT */}
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

            {/* ITEM */}
            <Grid2
              container
              size={12}
              sx={{ border: '1px solid grey', borderRadius: '10px', padding: '0.5rem' }}
            >
              {Array.from({ length: itemCode } || 1).map((item, index) => {
                return <PurchaseItem formik={formik} index={index} key={index}></PurchaseItem>;
              })}
              <Grid2 size={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                  <Fab
                    size="medium"
                    color="primary"
                    onClick={handleClickAddition}
                    sx={{ marginRight: '1rem' }}
                  >
                    <IconPlus></IconPlus>
                  </Fab>
                  {itemCode > 1 && (
                    <Fab size="medium" color="error" onClick={handleClickSubtraction}>
                      <IconMinus></IconMinus>
                    </Fab>
                  )}
                </Box>
              </Grid2>
            </Grid2>

            {/*  PRIORITY */}
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
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
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
            <Button type="submit" sx={{ marginRight: '0.5rem' }}>
              Submit
            </Button>
            <Button type="reset" onClick={handleClickCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default PurchaseIndentCreate;
