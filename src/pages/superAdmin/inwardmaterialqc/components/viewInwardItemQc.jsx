'use client';

import { Grid2, Box, Typography, Chip } from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

/**
 * Enhanced InwardItemQc component that handles merged QC data
 */
const InwardItemQc = ({ item, formik, index, disable = false }) => {
  console.log('🚀 ~ InwardItemQc ~ item:', item);
  // Calculate derived values
  const quantityRejected = Math.max(0, (item.quantityReceived || 0) - (item.quantityAccepted || 0));
  const acceptanceRate =
    item.quantityReceived > 0
      ? Math.round(((item.quantityAccepted || 0) / item.quantityReceived) * 10000) / 100
      : 0;

  const getStatusColor = (rate) => {
    if (rate >= 95) return 'success';
    if (rate >= 80) return 'warning';
    return 'error';
  };

  return (
    <>
      {/* Item Header with BOM ID and Status */}
      <Grid2 size={{ xs: 12 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1,
            mb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" color="primary">
            Item {index + 1}: {item.bomId}
          </Typography>
          <Box display="flex" gap={1}>
            <Chip
              label={item.hasQcData ? 'QC Complete' : 'QC Pending'}
              color={item.hasQcData ? 'success' : 'warning'}
              size="small"
            />
            {item.hasQcData && (
              <Chip
                label={`${acceptanceRate}% Accepted`}
                color={getStatusColor(acceptanceRate)}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Grid2>

      {/* BOM ID */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`bomId-${index}`} sx={{ marginTop: 0 }}>
          BOM ID
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`bomId-${index}`}
          name={`items[${index}].bomId`}
          value={item.bomId || ''}
          disabled={true}
          placeholder="BOM ID"
        />
      </Grid2>

      {/* Description */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`description-${index}`} sx={{ marginTop: 0 }}>
          Description
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`description-${index}`}
          name={`items[${index}].description`}
          value={item.description || ''}
          disabled={true}
          placeholder="Item Description"
        />
      </Grid2>

      {/* Ordered Quantity */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`quantity-${index}`} sx={{ marginTop: 0 }}>
          Ordered Quantity
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Box display="flex" gap={2}>
          <CustomTextField
            fullWidth
            id={`quantity-${index}`}
            name={`items[${index}].quantity`}
            type="number"
            value={item.quantity || 0}
            disabled={true}
            placeholder="Ordered Quantity"
          />
          <CustomTextField
            sx={{ minWidth: 100 }}
            id={`uom-${index}`}
            name={`items[${index}].uom`}
            value={item.uom || ''}
            disabled={true}
            placeholder="UOM"
          />
        </Box>
      </Grid2>

      {/* Quantity Received */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`quantityReceived-${index}`} sx={{ marginTop: 0 }}>
          Quantity Received
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`quantityReceived-${index}`}
          name={`items[${index}].quantityReceived`}
          type="number"
          value={formik.values.items?.[index]?.quantityReceived || item.quantityReceived || 0}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={disable}
          placeholder="Enter Quantity Received"
          error={
            formik.touched.items?.[index]?.quantityReceived &&
            Boolean(formik.errors.items?.[index]?.quantityReceived)
          }
          helperText={
            formik.touched.items?.[index]?.quantityReceived &&
            formik.errors.items?.[index]?.quantityReceived
          }
        />
      </Grid2>

      {/* Quantity Accepted */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`quantityAccepted-${index}`} sx={{ marginTop: 0 }}>
          Quantity Accepted
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`quantityAccepted-${index}`}
          name={`items[${index}].quantityAccepted`}
          type="number"
          value={formik.values.items?.[index]?.quantityAccepted || item.quantityAccepted || 0}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={disable}
          placeholder="Enter Quantity Accepted"
          error={
            formik.touched.items?.[index]?.quantityAccepted &&
            Boolean(formik.errors.items?.[index]?.quantityAccepted)
          }
          helperText={
            formik.touched.items?.[index]?.quantityAccepted &&
            formik.errors.items?.[index]?.quantityAccepted
          }
        />
      </Grid2>

      {/* Quantity Rejected (Calculated) */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel sx={{ marginTop: 0 }}>Quantity Rejected</CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          value={quantityRejected}
          disabled={true}
          placeholder="Calculated Automatically"
          sx={{
            '& .MuiInputBase-input': {
              color: quantityRejected > 0 ? 'error.main' : 'text.primary',
              fontWeight: quantityRejected > 0 ? 'bold' : 'normal',
            },
          }}
        />
      </Grid2>

      {/* QC Summary */}
      {item.hasQcData && (
        <>
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel sx={{ marginTop: 0 }}>QC Summary</CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <Box
              sx={{
                p: 2,
                bgcolor:
                  acceptanceRate >= 95
                    ? 'success.light'
                    : acceptanceRate >= 80
                    ? 'warning.light'
                    : 'error.light',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2">
                <strong>Acceptance Rate:</strong> {acceptanceRate}% ({item.quantityAccepted}/
                {item.quantityReceived})
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{' '}
                {acceptanceRate >= 95
                  ? 'Excellent'
                  : acceptanceRate >= 80
                  ? 'Good'
                  : 'Needs Review'}
              </Typography>
            </Box>
          </Grid2>
        </>
      )}

      {/* Divider */}
      <Grid2 size={{ xs: 12 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', my: 2 }} />
      </Grid2>
    </>
  );
};

export default InwardItemQc;
