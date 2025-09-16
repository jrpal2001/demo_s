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
import { storeWorkOrderData, getLastCreatedWorkOrder } from '@/api/workorder.api';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';
import { fetchProductImagesBySkuCode, fetchProducableBySku } from '@/api/productmaster.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const CreateWorkOrder = () => {
  const userType = useSelector(selectCurrentUserType);

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/job-cards`, title: 'Work Orders' },
    { title: 'Add' },
  ];
  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log('🚀 ~ CreateWorkOrder ~ rowData:', rowData);
  const [productImages, setProductImages] = useState([]);
  const [producableBreakdown, setProducableBreakdown] = useState([]);
  const [totalProducable, setTotalProducable] = useState(null);

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
      assignedDepartments: [],
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
  const [lastWorkOrder, setLastWorkOrder] = useState(null);
  const printRef = useRef();
  const { jobCardId } = useParams(); // Get jobCardId from URL params
  console.log('🚀 ~ CreateWorkOrder ~ jobCardId:', jobCardId);

  const dateObj = new Date();
  const dateToday = `${dateObj.getFullYear()}-${
    dateObj.getMonth() + 1 > 9 ? dateObj.getMonth() + 1 : `0${dateObj.getMonth() + 1}`
  }-${dateObj.getDate() + 1 > 9 ? dateObj.getDate() + 1 : `0${dateObj.getDate() + 1}`}`;
  const navigate = useNavigate();

  // Fetch the last created work order for this job card
  useEffect(() => {
    const fetchLastWorkOrder = async () => {
      if (jobCardId) {
        try {
          const imageUrls = await fetchProductImagesBySkuCode(rowData.skuCode);
          console.log('🚀 ~ handleSkuChange ~ imageUrls:', imageUrls);
          setProductImages(imageUrls);

          // Fetch producable breakdown
          const producableData = await fetchProducableBySku(rowData.skuCode);
          console.log('🚀 ~ fetchLastWorkOrder ~ producableData:', producableData);
          setProducableBreakdown(producableData.breakdown || []);
          setTotalProducable(producableData.totalProducable ?? null);

          const lastWorkOrderData = await getLastCreatedWorkOrder(jobCardId);
          console.log('🚀 ~ fetchLastWorkOrder ~ lastWorkOrderData:', lastWorkOrderData);
          setLastWorkOrder(lastWorkOrderData);
        } catch {
          // console.error('Error fetching last work order:', error);
          // toast.error('Failed to fetch last work order');
        }
      }
    };

    fetchLastWorkOrder();
  }, [jobCardId]);

  // Add this useEffect to populate form data from rowData
  useEffect(() => {
    if (rowData) {
      // Set jobCardNo
      setValue('jobCardNo', rowData.jobCardNo);

      // Set productId from skuCode
      setValue('productId', rowData.skuCode);

      // Set quantity from total
      setValue('quantityToBeProduced', rowData.total);

      // Set size specifications
      setValue('sizeSpecification.xs', rowData.xs || 0);
      setValue('sizeSpecification.s', rowData.s || 0);
      setValue('sizeSpecification.m', rowData.m || 0);
      setValue('sizeSpecification.l', rowData.l || 0);
      setValue('sizeSpecification.xl', rowData.xl || 0);
      setValue('sizeSpecification.2xl', rowData['2xl'] || 0);
      setValue('sizeSpecification.3xl', rowData['3xl'] || 0);
      setValue('sizeSpecification.4xl', rowData['4xl'] || 0);
      setValue('sizeSpecification.5xl', rowData['5xl'] || 0);
    }
  }, [rowData, setValue]);

  const sizeKeys = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const sizeValues = watch(sizeKeys.map((size) => `sizeSpecification.${size}`));
  const totalQuantity =
    sizeValues?.map((v) => Number(v) || 0).reduce((acc, curr) => acc + curr, 0) || 0;

  useEffect(() => {
    setValue('quantityToBeProduced', totalQuantity);
  }, [totalQuantity, setValue]);

  const onSubmit = async (data) => {
    console.log('Data before submit:', data);
    setIsSubmitting(true);

    // Add jobCardRef to the form data
    const formData = {
      ...data,
      jobCardRef: jobCardId,
    };

    try {
      const response = await storeWorkOrderData(formData);
      if (response) {
        toast.success('Work order created successfully');
        console.log('🚀 ~ onSubmit ~ response:', response);
        navigate(`/${userType}/job-card/workorder/${jobCardId}/view`, {
          state: { rowData: rowData },
        });
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error);
      console.log('Error:', error.message);
      error.data?.map((err) => {
        setError(err.field, { type: 'manual', message: err.message });
      });
      // toast.error('Failed to create work order');
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
    navigate(-1);
  };

  return (
    <PageContainer title="Create Work Order" description="Create a new work order">
      <Breadcrumb title="Create Work Order" items={BCrumb} />
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
                  defaultValue={dateToday}
                  {...register('startDate')}
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
                WORK ORDER
              </Typography>
            </Grid2>
            <Grid2 size={4} sx={{ border: '2px solid black', padding: '1rem' }}>
              <Typography>
                Last Created Work Order: {lastWorkOrder?.workOrderId || 'None'}
              </Typography>
              <CustomTextField
                id="workOrderId"
                name="workOrderId"
                label="Work Order ID"
                variant="outlined"
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                value={`${rowData?.jobCardNo || 'job'}-WO${
                  parseInt(lastWorkOrder?.workOrderId?.split('WO')[1] || '0') + 1
                }`}
                helperText="This will be auto-generated"
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
                defaultValue={rowData?.jobCardNo || ''}
                {...register('jobCardNo', { required: 'Job Card No is required' })}
                error={!!errors.jobCardNo}
                helperText={errors.jobCardNo?.message}
              />
              <Typography variant="h5" textAlign="center">
                Work Order ID
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
                sx={{ marginBottom: '1rem' }}
                {...register('purpose')}
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
                      <MenuItem value="bitchecking" disabled>
                        Bitchecking
                      </MenuItem>
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
                sx={{ marginBottom: '1rem' }}
                defaultValue={rowData?.skuCode || ''}
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
              {producableBreakdown && producableBreakdown.length > 0 ? (
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
              ) : (
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 2, color: 'red', fontWeight: 'bold' }}
                >
                  Not Producable
                </Typography>
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
              Create Work Order
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

export default CreateWorkOrder;
