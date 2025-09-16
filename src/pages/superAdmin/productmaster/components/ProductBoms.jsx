'use client';

import { fetchBomCodes } from '@/api/admin';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { Autocomplete, Grid2, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ProductBoms = ({ title, formik, index }) => {
  console.log('🚀 ~ ProductBoms ~ formik:', formik.values.fabric);
  const category = title.toLowerCase();
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetchBomCodes(category);
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setData(response);
      }
    } catch (error) {
      toast.error('Data fetch failed');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid2
      container
      rowSpacing={2}
      columnSpacing={2}
      size={12}
      sx={{ border: '1px solid grey', borderRadius: '10px', padding: '0.5rem' }}
    >
      {/* CODE */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor="code" sx={{ marginTop: 0 }}>
          {title} Code
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Autocomplete
          options={data}
          autoHighlight
          getOptionLabel={(option) => option.bomId}
          // Set the current value based on Formik
          value={
            data.find(
              (item) =>
                String(item._id) ===
                String(
                  typeof formik.values[category]?.[index]?.code === 'object'
                    ? formik.values[category]?.[index]?.code._id
                    : formik.values[category]?.[index]?.code,
                ),
            ) || null
          }
          // Update Formik when user selects an option
          onChange={(event, newValue) => {
            console.log('🚀 ~ ProductBoms ~ newValue:', newValue);
            formik.setFieldValue(`${category}[${index}].code`, newValue?._id || '');
            formik.setFieldValue(`${category}[${index}].uom`, newValue?.uom || 'default');
            // Auto-set the cost from the selected BOM item's price
            formik.setFieldValue(`${category}[${index}].cost`, newValue?.price || 0);
          }}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder="Select Code"
              aria-label="Select Code"
              autoComplete="off"
              name={`${category}[${index}].code`}
              error={
                formik.touched[category]?.[index]?.code &&
                Boolean(formik.errors[category]?.[index]?.code)
              }
              helperText={
                formik.touched[category]?.[index]?.code && formik.errors[category]?.[index]?.code
              }
            />
          )}
        />
      </Grid2>

      {/* CONSUMPTION */}
      <Grid2
        size={{ xs: 12, md: 3, lg: 3 }}
        sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
      >
        <CustomFormLabel htmlFor="consumption" sx={{ marginTop: 0 }}>
          {title} Consumption
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9, lg: 4 }}>
        <CustomTextField
          fullWidth
          id="consumption"
          name={`${category}[${index}][consumption]`}
          value={formik.values[category]?.[index]?.consumption || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Consumption"
          error={
            formik.touched[category]?.[index]?.consumption &&
            Boolean(formik.errors[category]?.[index]?.consumption)
          }
          helperText={
            formik.touched[category]?.[index]?.consumption &&
            formik.errors[category]?.[index]?.consumption
          }
        />
      </Grid2>

      {/* UOM */}
      <Grid2
        size={{ xs: 12, md: 3, lg: 1 }}
        sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
      >
        <CustomFormLabel htmlFor="uom" sx={{ marginTop: 0 }}>
          UOM
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9, lg: 4 }}>
        <CustomSelect
          fullWidth
          id="uom"
          name={`${category}[${index}][uom]`}
          value={formik.values[category]?.[index]?.uom || 'default'}
          onChange={formik.handleChange}
          disabled={true} // Disabled since it's auto-filled from BOM selection
        >
          <MenuItem value="default" disabled>
            Select Unit of Measurement
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
        {formik.touched[category]?.[index]?.uom && formik.errors[category]?.[index]?.uom && (
          <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
            Please Select The Unit of Measurement
          </p>
        )}
      </Grid2>

      {/* COST - Auto-filled and disabled */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor="cost" sx={{ marginTop: 0 }}>
          {title} Cost
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id="cost"
          name={`${category}[${index}][cost]`}
          type="number"
          value={formik.values[category]?.[index]?.cost || ''}
          placeholder="Auto-filled from selected BOM"
          error={
            formik.touched[category]?.[index]?.cost &&
            Boolean(formik.errors[category]?.[index]?.cost)
          }
          helperText={
            formik.touched[category]?.[index]?.cost && formik.errors[category]?.[index]?.cost
          }
          disabled={true} // Disabled - auto-filled from BOM price
          sx={{
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000',
              fontWeight: 'bold',
            },
          }}
        />
      </Grid2>
    </Grid2>
  );
};

export default ProductBoms;
