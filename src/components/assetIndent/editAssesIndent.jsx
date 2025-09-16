'use client';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Grid2, MenuItem, CircularProgress, Typography, Fab } from '@mui/material';
import { IconPlus } from '@tabler/icons';
import PageContainer from '@/components/container/PageContainer';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import EditableAssetItem from './EditableAssetItem';
import { toast } from 'react-toastify';
import {
  fetchAssetIndentById,
  updateAssetIndent,
  searchItemCodesRealtime,
  getRecentItemCodes,
} from '../../api/assetIndent';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Function to format date for input field
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

const EditAssetIndent = () => {
  const userType = useSelector(selectCurrentUserType);
  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/assetindent`, title: 'Asset Indent' },
    { title: 'Edit' },
  ];

  const navigate = useNavigate();
  const { id } = useParams();
  const [assetIndentData, setAssetIndentData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [items, setItems] = useState([]);

  const formik = useFormik({
    initialValues: {
      indentId: '',
      date: '',
      requestedBy: '',
      department: '',
      toDepartment: 'default',
      priority: 'default',
      remarks: '',
    },
    validationSchema: Yup.object({
      indentId: Yup.string().required('Indent ID is required'),
      date: Yup.date().required('Date is required'),
      requestedBy: Yup.string().required('Requested By is required'),
      department: Yup.string().required('Department is required'),
      toDepartment: Yup.string()
        .notOneOf(['default'], 'Please select a department')
        .required('To Department is required'),
      priority: Yup.string()
        .notOneOf(['default'], 'Please select a priority')
        .required('Priority is required'),
      remarks: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Validate items
        if (items.length === 0) {
          toast.error('At least one item is required');
          return;
        }

        // Prepare items for submission - only include allowed fields
        const formattedItems = items.map((item, itemIndex) => {
          const itemData = {
            code: typeof item.code === 'object' ? item.code._id : item.code,
            model: item.model,
            description: item.description,
            quantity: Number(item.quantity),
            uom: item.uom,
          };

          // Validate required fields
          if (
            !itemData.code ||
            !itemData.model ||
            !itemData.description ||
            !itemData.quantity ||
            !itemData.uom ||
            itemData.uom === 'default'
          ) {
            throw new Error(`Item ${itemIndex + 1} is missing required fields`);
          }

          return JSON.stringify(itemData);
        });

        // Prepare form data - exclude MongoDB fields
        const allowedFields = [
          'indentId',
          'date',
          'requestedBy',
          'department',
          'toDepartment',
          'priority',
          'remarks',
        ];
        const formData = new FormData();

        // Only include allowed fields from values
        allowedFields.forEach((field) => {
          if (values[field] !== undefined && values[field] !== null) {
            formData.append(field, values[field]);
          }
        });

        // Add items
        formattedItems.forEach((item, index) => {
          formData.append(`items[${index}]`, item);
        });

        console.log('📝 Frontend: Submitting update with allowed fields only');
        console.log(
          '📝 Frontend: Form values being submitted:',
          Object.fromEntries(formData.entries()),
        );

        const response = await updateAssetIndent(id, formData);
        if (response) {
          toast.success('Asset indent updated successfully');
          navigate(`/${userType}/assetindent`);
        } else {
          toast.error('Failed to update asset indent');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to update asset indent: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickCancel = () => {
    navigate(`/${userType}/assetindent`);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchAssetIndentById(id);
      console.log('Fetched asset indent data:', response);

      if (response) {
        setAssetIndentData(response);

        // Format the date for the input field
        const formattedData = {
          ...response,
          date: formatDateForInput(response.date),
        };

        // Set items with proper structure
        if (response.items && Array.isArray(response.items)) {
          const processedItems = response.items.map((item) => ({
            ...item,
            // Keep the original code structure for existing items
            code: item.code,
            model: item.model,
            description: item.description,
            quantity: item.quantity,
            uom: item.uom,
          }));
          setItems(processedItems);
        }

        // Remove items and MongoDB fields from formik values
        const {
          items: _,
          _id,
          __v,
          createdAt,
          updatedAt,
          mainAssetIds,
          ...formikValues
        } = formattedData;

        console.log('📝 Frontend: Setting formik values (excluding MongoDB fields):', formikValues);
        formik.setValues(formikValues);
      }
    } catch (error) {
      toast.error('Failed to fetch asset indent data');
      console.error('Error fetching asset indent:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const handleItemRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleAddItem = () => {
    const newItem = {
      code: '',
      model: '',
      description: '',
      quantity: '',
      uom: 'default',
    };
    setItems([...items, newItem]);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading && !formik.values.indentId) {
    return (
      <PageContainer title="Admin - Edit Asset Indent" description="Edit asset indent details">
        <Breadcrumb title="Edit Asset Indent" items={BCrumb} />
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Admin - Edit Asset Indent" description="Edit asset indent details">
      <Breadcrumb title="Edit Asset Indent" items={BCrumb} />
      <ParentCard title="Edit Asset Indent">
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
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{
                  shrink: true,
                }}
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
              >
                <MenuItem value="default" disabled>
                  Select Priority
                </MenuItem>
                <MenuItem value="immediate">Immediate</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
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
                multiline
                rows={3}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                helperText={formik.touched.remarks && formik.errors.remarks}
              />
            </Grid2>

            {/* ITEMS SECTION */}
            <Grid2
              container
              size={12}
              sx={{ border: '1px solid grey', borderRadius: '10px', padding: '0.5rem' }}
            >
              <Grid2 size={12} sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Items
                  {searchLoading && <CircularProgress size={20} />}
                </Typography>
              </Grid2>

              {items.length > 0 ? (
                items.map((item, index) => (
                  <Grid2 size={12} key={index}>
                    <EditableAssetItem
                      item={item}
                      index={index}
                      onItemChange={handleItemChange}
                      onItemRemove={handleItemRemove}
                      searchLoading={searchLoading}
                      setSearchLoading={setSearchLoading}
                      searchItemCodesRealtime={searchItemCodesRealtime}
                      getRecentItemCodes={getRecentItemCodes}
                      isExisting={Boolean(item.code && typeof item.code === 'object')}
                    />
                  </Grid2>
                ))
              ) : (
                <Grid2 size={12}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 3,
                      backgroundColor: '#f9f9f9',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography color="textSecondary">No items available</Typography>
                  </Box>
                </Grid2>
              )}

              <Grid2 size={12}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', gap: 1, mt: 2 }}>
                  <Fab size="medium" color="primary" onClick={handleAddItem} title="Add Item">
                    <IconPlus />
                  </Fab>
                </Box>
              </Grid2>
            </Grid2>
          </Grid2>

          {/* SUBMIT */}
          <Box
            sx={{
              margin: '2rem 1.5rem 0 0',
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
              gap: 1,
            }}
          >
            <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 100 }}>
              {loading ? <CircularProgress size={20} /> : 'Update'}
            </Button>
            <Button type="button" variant="outlined" onClick={handleClickCancel} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default EditAssetIndent;
