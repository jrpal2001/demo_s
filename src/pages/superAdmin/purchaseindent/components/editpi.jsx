import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Autocomplete, Grid2, MenuItem } from '@mui/material';

import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { fetchBomByCategory } from '@/api/bom.api';

const PurchaseItem = ({ formik, index, disable = false }) => {
  console.log('🚀 ~ PurchaseItem ~ formik:', (formik.values.items || []).filter(Boolean));
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetchBomByCategory();
      console.log('🚀 ~ fetchData ~ response:', response);
      setData(response);
    } catch (error) {
      toast.error('Failed to fetch item data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid2
      container
      size={12}
      rowSpacing={2}
      sx={{ border: '1px solid grey', borderRadius: '10px', padding: '1rem' }}
    >
      {/* ITEM CODE */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].code`} sx={{ marginTop: 0 }}>
          Item Code
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Autocomplete
          options={data}
          autoHighlight
          disabled={disable}
          getOptionLabel={(option) => option?.bomId || ''}
          isOptionEqualToValue={(option, value) => String(option._id) === String(value?._id)}
          value={
            data.find(
              (item) =>
                String(item._id) ===
                String(
                  typeof formik.values.items?.[index]?.code === 'object'
                    ? formik.values.items?.[index]?.code._id
                    : formik.values.items?.[index]?.code,
                ),
            ) || null
          }
          onChange={(event, newValue) => {
            // Store only the _id in Formik
            formik.setFieldValue(`items[${index}].code`, newValue?._id || '');
            formik.setFieldValue(`items[${index}].uom`, newValue?.uom || 'default');
            // Optionally autofill description, etc.
            formik.setFieldValue(`items[${index}].description`, newValue?.description || '');
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder="Select Code"
              aria-label="Select Code"
              autoComplete="off"
              disabled={disable}
              name={`items[${index}].code`}
              error={
                formik.touched.items?.[index]?.code && Boolean(formik.errors.items?.[index]?.code)
              }
              helperText={formik.touched.items?.[index]?.code && formik.errors.items?.[index]?.code}
            />
          )}
        />
        {console.log('Formik value for code:', formik.values.items?.[index]?.code)}
        {console.log(
          'Matched value:',
          data.find((item) => String(item._id) === String(formik.values.items?.[index]?.code._id)),
        )}
      </Grid2>

      {/* ITEM DESCRIPTION */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].description`} sx={{ marginTop: 0 }}>
          Item Description
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`items[${index}].description`}
          name={`items[${index}].description`}
          value={formik.values.items?.[index]?.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Item Description"
          disabled={disable}
          error={
            formik.touched.items?.[index]?.description &&
            Boolean(formik.errors.items?.[index]?.description)
          }
          helperText={
            formik.touched.items?.[index]?.description && formik.errors.items?.[index]?.description
          }
        />
      </Grid2>

      {/* ITEM QUANTITY */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].quantity`} sx={{ marginTop: 0 }}>
          Quantity Required
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          id={`items[${index}].quantity`}
          name={`items[${index}].quantity`}
          type="number"
          value={formik.values.items?.[index]?.quantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Item Quantity"
          error={
            formik.touched.items?.[index]?.quantity &&
            Boolean(formik.errors.items?.[index]?.quantity)
          }
          helperText={
            formik.touched.items?.[index]?.quantity && formik.errors.items?.[index]?.quantity
          }
          disabled={disable}
        />
      </Grid2>

      {/* ITEM UOM */}
      <Grid2
        size={{ xs: 12, md: 2 }}
        sx={{
          display: 'flex',
          margin: 0,
          alignItems: 'center',
          justifyContent: { xs: 'start', md: 'center' },
        }}
      >
        <CustomFormLabel htmlFor={`items[${index}].code`} sx={{ marginTop: 0 }}>
          UOM
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 3 }}>
        <CustomSelect
          fullWidth
          id={`items[${index}].uom`}
          name={`items[${index}].uom`}
          value={formik.values.items?.[index]?.uom}
          disabled={disable}
          onChange={formik.handleChange}
          error={formik.touched.items?.[index]?.uom && Boolean(formik.errors.items?.[index]?.uom)}
          helperText={formik.touched.items?.[index]?.uom && formik.errors.items?.[index]?.uom}
        >
          <MenuItem value="default" disabled>
            Select Unit of Measurement
          </MenuItem>
          <MenuItem value="pieces" disabled>
            PCS
          </MenuItem>
          <MenuItem value="grams" disabled>
            GRAMS
          </MenuItem>
          <MenuItem value="kgs" disabled>
            KGS
          </MenuItem>
          <MenuItem value="meters" disabled>
            MTRS
          </MenuItem>
          <MenuItem value="inch" disabled>
            INCH
          </MenuItem>
          <MenuItem value="cm" disabled>
            CM
          </MenuItem>
          <MenuItem value="cones" disabled>
            CONES
          </MenuItem>
          <MenuItem value="pkts" disabled>
            PKTS
          </MenuItem>
        </CustomSelect>
        {formik.touched.items?.[index]?.uom && formik.errors.items?.[index]?.uom && (
          <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
            Please Select To Department
          </p>
        )}
      </Grid2>
    </Grid2>
  );
};

export default PurchaseItem;
