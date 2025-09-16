'use client';
import { useState, useRef } from 'react';
import {
  Box,
  Grid2,
  Autocomplete,
  TextField,
  InputAdornment,
  CircularProgress,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { MenuItem } from '@mui/material';

const AssetItem = ({
  formik,
  index,
  searchLoading,
  setSearchLoading,
  searchItemCodesRealtime,
  getRecentItemCodes,
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const hasFetchedRef = useRef(false);

  // Load recent items when input is focused (only once)
  const handleFocus = async () => {
    if (hasFetchedRef.current) return;
    try {
      setSearchLoading(true);
      console.log('📥 Frontend: Loading recent items on focus...');
      const results = await getRecentItemCodes(10);
      console.log("🚀 ~ handleFocus ~ results:", results)
      console.log('📥 Frontend: Recent items loaded:', results?.length || 0, 'items');
      setOptions(results || []);
      hasFetchedRef.current = true;
    } catch (error) {
      console.error('❌ Frontend: Error loading recent items:', error);
      setOptions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search when typing
  const handleInputChange = async (event, newValue) => {
    setInputValue(newValue);
    if (newValue && newValue.trim() !== '') {
      try {
        setSearchLoading(true);
        console.log('🔍 Frontend: Searching for:', newValue);
        const results = await searchItemCodesRealtime(newValue);
        console.log("🚀 ~ handleInputChange ~ results:", results)
        console.log('🔍 Frontend: Search results:', results?.length || 0, 'items');
        setOptions(results || []);
      } catch (error) {
        console.error('❌ Frontend: Search error:', error);
        setOptions([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  // Handle selection
  const handleSelectionChange = (event, newValue) => {
    console.log('🔍 Frontend: Item selected:', newValue);
    setSelectedItem(newValue);

    // Update formik values with model information
    formik.setFieldValue(`items[${index}].code`, newValue ? newValue._id : '');
    formik.setFieldValue(`items[${index}].model`, newValue ? newValue.model : '');

    if (newValue) {
      formik.setFieldValue(`items[${index}].description`, newValue.name);
    }

    // Clear input value to prevent additional searches
    setInputValue('');
  };

  // Clear search
  const clearSearch = () => {
    setInputValue('');
    setSelectedItem(null);
    formik.setFieldValue(`items[${index}].code`, '');
    formik.setFieldValue(`items[${index}].model`, '');
    formik.setFieldValue(`items[${index}].description`, '');
  };

  // Get model color for chip
  const getModelColor = (model) => {
    const colors = {
      Asset: 'primary',
      Maintenance: 'secondary',
      BOM: 'success',
      Inventory: 'warning',
    };
    return colors[model] || 'default';
  };

  return (
    <Grid2 container size={12} sx={{ marginBottom: '1rem' }}>
      {/* ITEM CODE WITH SEARCH */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].code`} sx={{ marginTop: 0 }}>
          Item Code
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Autocomplete
          id={`items[${index}].code`}
          options={options}
          getOptionLabel={(option) => `${option.id} - ${option.name}`}
          value={selectedItem}
          onChange={handleSelectionChange}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          loading={searchLoading}
          loadingText="Loading items..."
          noOptionsText={
            inputValue
              ? `No items found for "${inputValue}"`
              : 'Click to see recent items or start typing to search...'
          }
          filterOptions={(x) => x} // Disable client-side filtering
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Click to see recent items or start typing to search..."
              error={
                formik.touched.items?.[index]?.code && Boolean(formik.errors.items?.[index]?.code)
              }
              helperText={formik.touched.items?.[index]?.code && formik.errors.items?.[index]?.code}
              onFocus={handleFocus}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {inputValue && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={clearSearch} sx={{ padding: '4px' }}>
                          <IconX size={16} />
                        </IconButton>
                      </InputAdornment>
                    )}
                    {searchLoading && (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {option.id} - {option.name}
                </Typography>
                <Chip
                  label={option.model}
                  size="small"
                  color={getModelColor(option.model)}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        />

        {/* Show selected item model */}
        {selectedItem && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={`Type: ${selectedItem.model}`}
              size="small"
              color={getModelColor(selectedItem.model)}
              variant="filled"
            />
          </Box>
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
          value={formik.values.items[index].description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Item Description"
          error={
            formik.touched.items?.[index]?.description &&
            Boolean(formik.errors.items?.[index]?.description)
          }
          helperText={
            formik.touched.items?.[index]?.description && formik.errors.items?.[index]?.description
          }
        />
      </Grid2>

      {/* ITEM QUANTITY & UOM */}
      <Grid2 container size={12}>
        {/* ITEM QUANTITY */}
        <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
          <CustomFormLabel htmlFor={`items[${index}].quantity`} sx={{ marginTop: 0 }}>
            Item Quantity
          </CustomFormLabel>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <CustomTextField
            fullWidth
            id={`items[${index}].quantity`}
            name={`items[${index}].quantity`}
            value={formik.values.items[index].quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Item Quantity"
            type="number"
            error={
              formik.touched.items?.[index]?.quantity &&
              Boolean(formik.errors.items?.[index]?.quantity)
            }
            helperText={
              formik.touched.items?.[index]?.quantity && formik.errors.items?.[index]?.quantity
            }
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
          <CustomFormLabel htmlFor={`items[${index}].uom`} sx={{ marginTop: 0 }}>
            UOM
          </CustomFormLabel>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 3 }}>
          <CustomSelect
            fullWidth
            id={`items[${index}].uom`}
            name={`items[${index}].uom`}
            value={formik.values.items[index].uom}
            onChange={formik.handleChange}
            error={formik.touched.items?.[index]?.uom && Boolean(formik.errors.items?.[index]?.uom)}
          >
            <MenuItem value="default" disabled>
              Select UOM
            </MenuItem>
            <MenuItem value="pcs">PCS</MenuItem>
            <MenuItem value="kg">KG</MenuItem>
            <MenuItem value="m">M</MenuItem>
            <MenuItem value="cm">CM</MenuItem>
            <MenuItem value="l">L</MenuItem>
            <MenuItem value="ml">ML</MenuItem>
            <MenuItem value="box">BOX</MenuItem>
            <MenuItem value="set">SET</MenuItem>
            <MenuItem value="pair">PAIR</MenuItem>
            <MenuItem value="dozen">DOZEN</MenuItem>
            <MenuItem value="gram">GRAM</MenuItem>
            <MenuItem value="ton">TON</MenuItem>
          </CustomSelect>
          {formik.touched.items?.[index]?.uom && formik.errors.items?.[index]?.uom && (
            <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
              UOM is required
            </p>
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
};

export default AssetItem;
