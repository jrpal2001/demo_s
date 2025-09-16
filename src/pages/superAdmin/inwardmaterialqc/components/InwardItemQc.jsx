import { Grid2 } from '@mui/material';

import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

const InwardItemQc = ({ item, formik, index, disable = false }) => {
  console.log('🚀 ~ InwardItemQc ~ item:', item);
  // Helper to get code display value
  const getCodeDisplay = (code) => {
    if (!code) return '';
    if (typeof code === 'object') {
      return (
        code.bomId || code.fabricName || code.trimsName || code.accessoriesName || code._id || ''
      );
    }
    return code;
  };

  return (
    <Grid2
      container
      size={12}
      rowSpacing={2}
      sx={{ border: '1px solid grey', borderRadius: '10px', padding: '1rem', mb: 2 }}
    >
      {/* ITEM CODE */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor="code" sx={{ marginTop: 0 }}>
          Code
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id="code"
          name="code"
          disabled
          value={item.code?.bomId || ''} // display only
        />
      </Grid2>

      {/* ITEM DESCRIPTION */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor="description" sx={{ marginTop: 0 }}>
          Item Description
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id="description"
          name="description"
          value={item.description || ''}
          disabled
        />
      </Grid2>

      {/* QUANTITY ORDERED */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor="orderQuantity" sx={{ marginTop: 0 }}>
          Quantity Ordered
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          id="orderQuantity"
          name="orderQuantity"
          type="number"
          value={item.orderQuantity ?? ''}
          disabled
        />
      </Grid2>

      {/* ITEM UOM */}
      <Grid2
        size={{ xs: 12, md: 1 }}
        sx={{
          display: 'flex',
          margin: 0,
          alignItems: 'center',
          justifyContent: { xs: 'start', md: 'center' },
        }}
      >
        <CustomFormLabel htmlFor="uom" sx={{ marginTop: 0 }}>
          UOM
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <CustomTextField fullWidth id="uom" name="uom" value={item.uom || ''} disabled />
      </Grid2>

      {/* QUANTITY RECEIVED */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].quantityReceived`} sx={{ marginTop: 0 }}>
          Quantity Received *
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`items[${index}].quantityReceived`}
          name={`items[${index}].quantityReceived`}
          type="number"
          min={1}
          value={formik.values.items?.[index]?.quantityReceived}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Quantity Received"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'error.main' },
              '&:hover fieldset': { borderColor: 'error.main' },
              '&.Mui-focused fieldset': { borderColor: 'error.main' },
            },
          }}
          error={
            formik.touched.items?.[index]?.quantityReceived &&
            Boolean(formik.errors.items?.[index]?.quantityReceived)
          }
          helperText={
            formik.touched.items?.[index]?.quantityReceived &&
            formik.errors.items?.[index]?.quantityReceived
          }
          disabled={disable}
        />
      </Grid2>

      {/* QUANTITY ACCEPTED */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor="quantityAccepted" sx={{ marginTop: 0 }}>
          Quantity Accepted *
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`items[${index}].quantityAccepted`}
          name={`items[${index}].quantityAccepted`}
          type="number"
          min={0}
          value={formik.values.items?.[index]?.quantityAccepted}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Quantity Accepted"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'error.main' },
              '&:hover fieldset': { borderColor: 'error.main' },
              '&.Mui-focused fieldset': { borderColor: 'error.main' },
            },
          }}
          error={
            formik.touched.items?.[index]?.quantityAccepted &&
            Boolean(formik.errors.items?.[index]?.quantityAccepted)
          }
          helperText={
            formik.touched.items?.[index]?.quantityAccepted &&
            formik.errors.items?.[index]?.quantityAccepted
          }
          disabled={disable}
        />
      </Grid2>
    </Grid2>
  );
};

export default InwardItemQc;
