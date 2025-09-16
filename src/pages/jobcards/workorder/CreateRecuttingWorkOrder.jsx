import { useEffect, useRef, useState } from 'react';
import {
  Select,
  MenuItem,
  Button,
  Typography,
  Grid2,
  FormControl,
  InputLabel,
} from '@mui/material';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ParentCard from '@/components/shared/ParentCard';
import { Stack } from '@mui/system';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  createRecuttingWorkOrder,
  getLastCreatedRecuttingWorkOrder,
  getWorkOrderById,
} from '@/api/workorder.api';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { fetchProductImagesBySkuCode, fetchProducableBySku } from '@/api/productmaster.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateRecuttingWorkOrder = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/job-cards`, title: 'Work Orders' },
    { title: 'Create Recutting Work Order' },
  ];

  const location = useLocation();
  const rowData = location.state?.rowData;
  const [productImages, setProductImages] = useState([]);
  const [producableBreakdown, setProducableBreakdown] = useState([]);
  const [totalProducable, setTotalProducable] = useState(null);
  const [originalWorkOrder, setOriginalWorkOrder] = useState(null);
  const [lastRecuttingWorkOrder, setLastRecuttingWorkOrder] = useState(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setValue,
    setError,
    watch,
  } = useForm({
    defaultValues: {
      assignedDepartments: ['cutting', 'bitchecking'], // Default to cutting and bitchecking departments
      jobCardNo: rowData?.jobCardNo || '',
      sizeSpecification: {
        xs: rowData?.xs || 0,
        s: rowData?.s || 0,
        m: rowData?.m || 0,
        l: rowData?.l || 0,
        xl: rowData?.xl || 0,
        '2xl': rowData?.['2xl'] || 0,
        '3xl': rowData?.['3xl'] || 0,
        '4xl': rowData?.['4xl'] || 0,
        '5xl': rowData?.['5xl'] || 0,
      },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const printRef = useRef();
  const { workOrderId } = useParams(); // Get workOrderId from URL params
  console.log('🚀 ~ CreateRecuttingWorkOrder ~ workOrderId:', workOrderId);

  const dateObj = new Date();
  const dateToday = `${dateObj.getFullYear()}-${
    dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0${dateObj.getMonth() + 1}`
  }-${dateObj.getDate() + 1 > 9 ? dateObj.getDate() + 1 : `0${dateObj.getDate() + 1}`}`;
  const navigate = useNavigate();

  // Fetch the original work order and last created recutting work order
  useEffect(() => {
    const fetchData = async () => {
      if (workOrderId) {
        try {
          // Fetch original work order details
          const originalWorkOrderData = await getWorkOrderById(workOrderId);
          console.log('🚀 ~ fetchData ~ originalWorkOrderData:', originalWorkOrderData);
          setOriginalWorkOrder(originalWorkOrderData);

          // Fetch product images
          const imageUrls = await fetchProductImagesBySkuCode(
            originalWorkOrderData?.productId || rowData?.skuCode,
          );
          console.log('🚀 ~ fetchData ~ imageUrls:', imageUrls);
          setProductImages(imageUrls);

          // Fetch producable breakdown
          const producableData = await fetchProducableBySku(
            originalWorkOrderData?.productId || rowData?.skuCode,
          );
          console.log('🚀 ~ fetchData ~ producableData:', producableData);
          setProducableBreakdown(producableData.breakdown || []);
          setTotalProducable(producableData.totalProducable ?? null);

          // Fetch last created recutting work order
          const lastRecuttingWorkOrderData = await getLastCreatedRecuttingWorkOrder(workOrderId);
          console.log('🚀 ~ fetchData ~ lastRecuttingWorkOrderData:', lastRecuttingWorkOrderData);
          setLastRecuttingWorkOrder(lastRecuttingWorkOrderData);
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to fetch work order details');
        }
      }
    };

    fetchData();
  }, [workOrderId, rowData?.skuCode]);

  // Add this useEffect to populate form data from original work order
  useEffect(() => {
    if (originalWorkOrder) {
      // Set jobCardNo
      setValue('jobCardNo', originalWorkOrder.jobCardNo);

      // Set productId from original work order
      setValue('productId', originalWorkOrder.productId);

      // Set quantity from original work order
      setValue('quantityToBeProduced', originalWorkOrder.quantityToBeProduced);

      // Set size specifications from original work order
      if (originalWorkOrder.sizeSpecification) {
        setValue('sizeSpecification.xs', originalWorkOrder.sizeSpecification.xs || 0);
        setValue('sizeSpecification.s', originalWorkOrder.sizeSpecification.s || 0);
        setValue('sizeSpecification.m', originalWorkOrder.sizeSpecification.m || 0);
        setValue('sizeSpecification.l', originalWorkOrder.sizeSpecification.l || 0);
        setValue('sizeSpecification.xl', originalWorkOrder.sizeSpecification.xl || 0);
        setValue('sizeSpecification.2xl', originalWorkOrder.sizeSpecification['2xl'] || 0);
        setValue('sizeSpecification.3xl', originalWorkOrder.sizeSpecification['3xl'] || 0);
        setValue('sizeSpecification.4xl', originalWorkOrder.sizeSpecification['4xl'] || 0);
        setValue('sizeSpecification.5xl', originalWorkOrder.sizeSpecification['5xl'] || 0);
      }

      // Set other fields from original work order
      setValue('purpose', originalWorkOrder.purpose || '');
      setValue('expectedCompletionDate', originalWorkOrder.expectedCompletionDate || '');
      setValue('productionInstruction', originalWorkOrder.productionInstruction || '');
      setValue('status', originalWorkOrder.status || 'pending');
      setValue('remarks', originalWorkOrder.remarks || '');
      setValue('departmentNotes', originalWorkOrder.departmentNotes || '');
    }
  }, [originalWorkOrder, setValue]);

  // Set the generated workOrderId when it's available
  useEffect(() => {
    if (originalWorkOrder || rowData) {
      setValue('workOrderId', generateRecuttingWorkOrderId());
    }
  }, [originalWorkOrder, rowData, lastRecuttingWorkOrder, setValue]);

  const sizeKeys = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const sizeValues = watch(sizeKeys.map((size) => `sizeSpecification.${size}`));
  const totalQuantity =
    sizeValues?.map((v) => Number(v) || 0).reduce((acc, curr) => acc + curr, 0) || 0;

  // Watch form values for proper updates
  const expectedCompletionDate = watch('expectedCompletionDate');
  const purpose = watch('purpose');
  const productionInstruction = watch('productionInstruction');
  const remarks = watch('remarks');
  const departmentNotes = watch('departmentNotes');
  const productId = watch('productId');

  useEffect(() => {
    setValue('quantityToBeProduced', totalQuantity);
  }, [totalQuantity, setValue]);

  const onSubmit = async (data) => {
    console.log('Data before submit:', data);
    console.log('Size specification:', data.sizeSpecification);
    console.log('Quantity:', data.quantityToBeProduced);
    console.log('Assigned departments:', data.assignedDepartments);
    setIsSubmitting(true);

    // Validate required fields
    if (!data.quantityToBeProduced || data.quantityToBeProduced < 1) {
      toast.error('Quantity must be at least 1');
      setIsSubmitting(false);
      return;
    }

    if (!data.sizeSpecification) {
      toast.error('Size specification is required');
      setIsSubmitting(false);
      return;
    }

    // Validate that we have the original work order
    if (!originalWorkOrder) {
      toast.error('Original work order data is required');
      setIsSubmitting(false);
      return;
    }

    // Ensure sizeSpecification has all required sizes
    const requiredSizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
    const sizeSpec = {};
    requiredSizes.forEach((size) => {
      sizeSpec[size] = parseInt(data.sizeSpecification[size]) || 0;
    });

    // Validate that at least one size has a quantity > 0
    const totalSizeQuantity = Object.values(sizeSpec).reduce((sum, qty) => sum + qty, 0);
    if (totalSizeQuantity === 0) {
      toast.error('At least one size must have a quantity greater than 0');
      setIsSubmitting(false);
      return;
    }

    // Add required fields to match backend expectations
    const formData = {
      assignedDepartments:
        data.assignedDepartments && data.assignedDepartments.length > 0
          ? data.assignedDepartments
          : ['cutting', 'bitchecking'], // Default to cutting and bitchecking if no departments selected
      quantityToBeProduced: parseInt(data.quantityToBeProduced) || 0,
      sizeSpecification: sizeSpec,
      startDate: data.startDate || dateToday, // Include start date
      expectedCompletionDate: data.expectedCompletionDate || '', // Include expected completion date
      remarks: data.remarks || `Recutting work order based on ${originalWorkOrder.workOrderId}`,
      workOrderReference: workOrderId, // Reference to original work order
      jobCardRef: originalWorkOrder.jobCardRef?.toString() || originalWorkOrder.jobCardRef, // Convert ObjectId to string
      jobCardNo: originalWorkOrder.jobCardNo,
      productId: originalWorkOrder.productId,
      purpose: originalWorkOrder.purpose,
      productionInstruction: originalWorkOrder.productionInstruction,
      // The backend will get other fields from the original work order
    };

    console.log('Form data for backend:', formData);
    console.log('Original work order ID:', workOrderId);

    try {
      const response = await createRecuttingWorkOrder(workOrderId, formData);
      if (response) {
        toast.success('Recutting work order created successfully');
        console.log('🚀 ~ onSubmit ~ response:', response);
        navigate(`/${userType}/job-card/workorder/recutting/${workOrderId}`, {
          state: { rowData: rowData },
        });
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error);
      console.log('Error details:', error);
      console.log('Error response:', error.response);
      console.log('Error response data:', error.response?.data);
      console.log('Error message:', error.message);

      // Better error handling
      if (error.response?.data?.message) {
        console.log('Backend error message:', error.response.data.message);
        toast.error(`Validation failed: ${error.response.data.message}`);
      } else if (error.response?.data?.data) {
        // Handle validation errors array
        console.log('Validation errors:', error.response.data.data);
        if (Array.isArray(error.response.data.data)) {
          error.response.data.data.forEach((err) => {
            setError(err.field, { type: 'manual', message: err.message });
          });
          toast.error('Please check the form for validation errors');
        } else {
          toast.error(`Validation failed: ${JSON.stringify(error.response.data.data)}`);
        }
      } else if (error.data?.map) {
        error.data.map((err) => {
          setError(err.field, { type: 'manual', message: err.message });
        });
        toast.error('Please check the form for validation errors');
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        console.log('Unknown error structure:', error);
        toast.error('Failed to create recutting work order');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleBack = () => {
    navigate(`/${userType}/job-card/workorder/recutting/${workOrderId}`, {
      state: { rowData: rowData },
    });
  };

  // Generate recutting work order ID
  const generateRecuttingWorkOrderId = () => {
    const baseWorkOrderId = originalWorkOrder?.workOrderId || rowData?.workOrderId || 'WO';
    if (lastRecuttingWorkOrder?.workOrderId) {
      // Extract the number after 'R' and handle both formats (R01, R001, etc.)
      const match = lastRecuttingWorkOrder.workOrderId.match(/R(\d+)$/);
      const lastNumber = match ? parseInt(match[1]) : 0;
      return `${baseWorkOrderId}-R${String(lastNumber + 1).padStart(2, '0')}`;
    } else {
      return `${baseWorkOrderId}-R01`;
    }
  };

  return (
    <PageContainer
      title="Create Recutting Work Order"
      description="Create a new recutting work order"
    >
      <Breadcrumb title="Create Recutting Work Order" items={BCrumb} />
      <ParentCard title="SAMURAI EXPORTS PRIVATE LIMITED">
        <Button
          onClick={handlePrint}
          sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 1 }}
        >
          Print
        </Button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container ref={printRef}>
            {/* Row 1 */}
            <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Stack>
                <CustomTextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={watch('startDate') || dateToday}
                  {...register('startDate', { required: 'Start date is required' })}
                  error={!!errors.startDate}
                  helperText={errors.startDate?.message}
                />
                <Typography variant="h5" textAlign="center">
                  Start Date
                </Typography>
              </Stack>
            </Grid2>
            <Grid2
              size={4}
              sx={{
                borderTop: '2px solid black',
                borderBottom: '2px solid black',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h5" textAlign="center">
                RECUTTING WORK ORDER
              </Typography>
            </Grid2>
            <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Typography>
                Last Created Recutting Work Order: {lastRecuttingWorkOrder?.workOrderId || 'None'}
              </Typography>
              <CustomTextField
                id="workOrderId"
                name="workOrderId"
                label="Recutting Work Order ID"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                {...register('workOrderId', { required: 'Work Order ID is required' })}
                error={!!errors.workOrderId}
                helperText={errors.workOrderId?.message || 'This will be auto-generated'}
              />
              <CustomTextField
                id="jobCardNo"
                name="jobCardNo"
                label="Job Card No"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                defaultValue={originalWorkOrder?.jobCardNo || rowData?.jobCardNo || ''}
                {...register('jobCardNo', { required: 'Job Card No is required' })}
                error={!!errors.jobCardNo}
                helperText={errors.jobCardNo?.message}
              />
              <Typography variant="h5" textAlign="center">
                Recutting Work Order ID
              </Typography>
            </Grid2>

            {/* Row 2 */}
            <Grid2 size={6} sx={{ border: '2px solid black', borderTop: 'none', padding: '1rem' }}>
              <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                Purpose & Timeline
              </Typography>
              <CustomTextField
                id="purpose"
                name="purpose"
                label="Purpose"
                variant="outlined"
                fullWidth
                size="small"
                value={purpose || ''}
                sx={{ marginBottom: '1rem' }}
                {...register('purpose', { required: 'Purpose is required' })}
                error={!!errors.purpose}
                helperText={errors.purpose?.message}
              />
              <CustomTextField
                id="expectedCompletionDate"
                name="expectedCompletionDate"
                label="Expected Completion Date"
                type="date"
                variant="outlined"
                fullWidth
                size="small"
                value={
                  expectedCompletionDate
                    ? new Date(expectedCompletionDate).toISOString().split('T')[0]
                    : ''
                }
                sx={{ marginBottom: '1rem' }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
                {...register('expectedCompletionDate')}
                error={!!errors.expectedCompletionDate}
                helperText={errors.expectedCompletionDate?.message}
              />
              <CustomTextField
                id="productionInstruction"
                name="productionInstruction"
                label="Production Instructions"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                size="small"
                value={productionInstruction || ''}
                sx={{ marginBottom: '1rem' }}
                {...register('productionInstruction')}
                error={!!errors.productionInstruction}
                helperText={errors.productionInstruction?.message}
              />
            </Grid2>
            <Grid2
              size={6}
              sx={{
                border: '2px solid black',
                borderTop: 'none',
                borderLeft: 'none',
                padding: '1rem',
              }}
            >
              <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                Departments & Status
              </Typography>
              <FormControl fullWidth size="small" sx={{ marginBottom: '1rem' }}>
                <InputLabel id="assigned-departments-label">Assigned Departments</InputLabel>
                <Controller
                  name="assignedDepartments"
                  control={control}
                  render={({ field: { onChange, value = [], ...restField } }) => (
                    <Select
                      {...restField}
                      value={value}
                      onChange={(e) => {
                        let selected = e.target.value;

                        const includesCutting = selected.includes('cutting');
                        const prevIncludesCutting = value.includes('cutting');

                        if (includesCutting && !prevIncludesCutting) {
                          // Cutting was just selected → add dependencies
                          selected = Array.from(new Set([...selected, 'bitchecking']));
                        } else if (!includesCutting && prevIncludesCutting) {
                          // Cutting was just deselected → remove dependencies
                          selected = selected.filter((item) => item !== 'bitchecking');
                        }

                        onChange(selected);
                      }}
                      multiple
                      size="small"
                      labelId="assigned-departments-label"
                      label="Assigned Departments"
                    >
                      <MenuItem value="fabric">Fabric</MenuItem>
                      <MenuItem value="cutting">Cutting</MenuItem>
                      <MenuItem value="bitchecking">Bitchecking</MenuItem>
                      <MenuItem value="accessories">Accessories</MenuItem>
                      <MenuItem value="trims">Trims</MenuItem>
                      <MenuItem value="printing&fusing">Printing & Fusing</MenuItem>
                      <MenuItem value="embroidery">Embroidery</MenuItem>
                      <MenuItem value="operationpart">Operation Part</MenuItem>
                      <MenuItem value="stitching">Stitching</MenuItem>
                      <MenuItem value="finishing">Finishing</MenuItem>
                      <MenuItem value="fqi">FQI</MenuItem>
                      <MenuItem value="audit">Audit</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl fullWidth size="small" sx={{ marginBottom: '1rem' }}>
                <InputLabel id="status-label">Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  defaultValue="pending"
                  render={({ field }) => (
                    <Select {...field} labelId="status-label" label="Status" size="small">
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="on_hold">On Hold</MenuItem>
                      <MenuItem value="approval_required">Approval Required</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
              <CustomTextField
                id="remarks"
                name="remarks"
                label="Remarks"
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                size="small"
                value={remarks || ''}
                sx={{ marginBottom: '1rem' }}
                {...register('remarks')}
                error={!!errors.remarks}
                helperText={errors.remarks?.message}
              />
              <CustomTextField
                id="departmentNotes"
                name="departmentNotes"
                label="Department Notes"
                multiline
                rows={2}
                variant="outlined"
                fullWidth
                size="small"
                value={departmentNotes || ''}
                sx={{ marginBottom: '1rem' }}
                {...register('departmentNotes')}
                error={!!errors.departmentNotes}
                helperText={errors.departmentNotes?.message}
              />
            </Grid2>

            {/* Row 3 */}
            <Grid2 size={12} sx={{ border: '2px solid black', borderTop: 'none', padding: '1rem' }}>
              <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                Production Details
              </Typography>
              <CustomTextField
                id="productId"
                name="productId"
                label="Product ID"
                variant="outlined"
                fullWidth
                size="small"
                value={productId || ''}
                sx={{ marginBottom: '1rem' }}
                {...register('productId', { required: 'Product ID is required' })}
                error={!!errors.productId}
                helperText={errors.productId?.message}
                disabled
              />
              {productImages.length > 0 && (
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}
                >
                  {productImages.map((imgSrc, index) => (
                    <img
                      key={index}
                      src={imgSrc}
                      alt={`Product Preview ${index + 1}`}
                      style={{
                        width: '200px',
                        height: 'auto',
                        borderRadius: '4px',
                        objectFit: 'cover',
                      }}
                    />
                  ))}
                </div>
              )}
              {/* Producable Breakdown Table */}
              {producableBreakdown && producableBreakdown.length > 0 && (
                <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Producable Breakdown
                  </Typography>
                  {totalProducable !== null && (
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Total Producable: <b>{totalProducable}</b>
                    </Typography>
                  )}
                  <div style={{ overflowX: 'auto' }}>
                    <table
                      style={{ width: '100%', borderCollapse: 'collapse', background: '#fafafa' }}
                    >
                      <thead>
                        <tr>
                          <th style={{ border: '1px solid #ccc', padding: '6px' }}>Type</th>
                          <th style={{ border: '1px solid #ccc', padding: '6px' }}>Item Code</th>
                          <th style={{ border: '1px solid #ccc', padding: '6px' }}>Consumption</th>
                          <th style={{ border: '1px solid #ccc', padding: '6px' }}>
                            Current Stock
                          </th>
                          <th style={{ border: '1px solid #ccc', padding: '6px' }}>Producable</th>
                        </tr>
                      </thead>
                      <tbody>
                        {producableBreakdown.map((row, idx) => {
                          const required =
                            (parseFloat(row.consumption) || 0) * (totalQuantity || 0);
                          const isEnough = (row.currentStock || 0) >= required;
                          return (
                            <tr
                              key={idx}
                              style={{
                                background: isEnough
                                  ? '#e6faea' // light green
                                  : '#ffeaea', // light red
                              }}
                            >
                              <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                                {row.type}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                                {row.itemCode}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                                {row.consumption} × {totalQuantity} = {required}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                                {row.currentStock}
                              </td>
                              <td style={{ border: '1px solid #ccc', padding: '6px' }}>
                                {row.producable}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Grid2>

            {/* Row 4 - Size Specification */}
            <Grid2 size={12} sx={{ border: '2px solid black', borderTop: 'none', padding: '1rem' }}>
              <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                Size Specification
              </Typography>
              <Grid2 container spacing={{ xs: 1, sm: 2, md: 3 }}>
                {['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'].map((size) => (
                  <Grid2 item xs={3} sm={3} md={3} lg={3} key={size}>
                    <CustomTextField
                      id={`sizeSpecification.${size}`}
                      name={`sizeSpecification.${size}`}
                      label={size.toUpperCase()}
                      type="number"
                      variant="outlined"
                      fullWidth
                      size="small"
                      defaultValue={0}
                      inputProps={{ min: 0 }}
                      {...register(`sizeSpecification.${size}`)}
                      error={!!errors.sizeSpecification?.[size]}
                      helperText={errors.sizeSpecification?.[size]?.message}
                    />
                  </Grid2>
                ))}
              </Grid2>
              <CustomTextField
                id="quantityToBeProduced"
                name="quantityToBeProduced"
                label="Quantity to be Produced"
                type="number"
                variant="outlined"
                fullWidth
                size="small"
                sx={{ marginBottom: '1rem', mt: '2rem' }}
                value={totalQuantity}
                InputProps={{ readOnly: true }}
                {...register('quantityToBeProduced', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                })}
                error={!!errors.quantityToBeProduced}
                helperText={errors.quantityToBeProduced?.message}
                disabled
              />
            </Grid2>
          </Grid2>

          <Stack direction="row" spacing={2} justifyContent="flex-end" marginTop={3}>
            <LoadingButton loading={isSubmitting} type="submit" variant="contained" color="primary">
              Create Recutting Work Order
            </LoadingButton>
            <Button type="button" variant="outlined" onClick={handleBack}>
              Back
            </Button>
          </Stack>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default CreateRecuttingWorkOrder;
