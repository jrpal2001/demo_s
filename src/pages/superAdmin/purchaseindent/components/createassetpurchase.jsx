import { Grid as Grid2, MenuItem, Typography } from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

const PurchaseItem = ({ formik, index, disable = false }) => {
  const item = formik.values.items?.[index] || {};

  // Display name above
  const displayName =
    item?.code?.mainAssetId || item?.code?.mainMaintenanceId || item?.code?.mainItemCode || '';

  // _id to be shown in the Item Code field
  const displayCode = item?.code?._id || item?.code || '';
  console.log('🚀 ~ PurchaseItem ~ displayCode:', displayCode);

  return (
    <Grid2
      container
      spacing={2}
      sx={{ border: '1px solid grey', borderRadius: '10px', padding: '1rem' }}
    >
      {/* Display Code Label (above everything) */}
      {displayName && (
        <Grid2 item xs={12}>
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {displayName}
          </Typography>
        </Grid2>
      )}

      {/* ITEM CODE */}
      <Grid2 item xs={12} md={6}>
        <CustomFormLabel htmlFor={`items[${index}].code`} sx={{ marginTop: 0 }}>
          Item Code
        </CustomFormLabel>
        <CustomTextField fullWidth value={displayCode} disabled placeholder="Item Code (_id)" />
      </Grid2>

      {/* ITEM DESCRIPTION */}
      <Grid2 item xs={12} md={6}>
        <CustomFormLabel htmlFor={`items[${index}].description`} sx={{ marginTop: 0 }}>
          Item Description
        </CustomFormLabel>
        <CustomTextField
          fullWidth
          value={item.description || ''}
          disabled
          placeholder="Item Description"
        />
      </Grid2>

      {/* QUANTITY */}
      <Grid2 item xs={12} md={6}>
        <CustomFormLabel htmlFor={`items[${index}].quantity`} sx={{ marginTop: 0 }}>
          Quantity Required
        </CustomFormLabel>
        <CustomTextField
          fullWidth
          type="number"
          value={item.quantity || ''}
          disabled
          placeholder="Item Quantity"
        />
      </Grid2>

      {/* UOM */}
      <Grid2 item xs={12} md={6}>
        <CustomFormLabel htmlFor={`items[${index}].uom`} sx={{ marginTop: 0 }}>
          UOM
        </CustomFormLabel>
        <CustomSelect fullWidth value={item.uom || ''} disabled>
          <MenuItem value="default" disabled>
            Select UOM
          </MenuItem>
          <MenuItem value="pieces">PCS</MenuItem>
          <MenuItem value="grams">GRAMS</MenuItem>
          <MenuItem value="kgs">KGS</MenuItem>
          <MenuItem value="meters">MTRS</MenuItem>
          <MenuItem value="inch">INCH</MenuItem>
          <MenuItem value="cm">CM</MenuItem>
          <MenuItem value="cones">CONES</MenuItem>
          <MenuItem value="pkts">PKTS</MenuItem>
        </CustomSelect>
      </Grid2>
    </Grid2>
  );
};

export default PurchaseItem;
