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
  Button,
} from '@mui/material';
import { IconSearch, IconX, IconTrash } from '@tabler/icons';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import { MenuItem } from '@mui/material';

const EditableAssetItem = ({
  item,
  index,
  onItemChange,
  onItemRemove,
  searchLoading,
  setSearchLoading,
  searchItemCodesRealtime,
  getRecentItemCodes,
  isExisting = false,
}) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(!isExisting);
  const hasFetchedRef = useRef(false);

  // Load recent items when input is focused (only once)
  const handleFocus = async () => {
    if (hasFetchedRef.current) return;
    try {
      setSearchLoading(true);
      console.log('📥 Frontend: Loading recent items on focus...');
      const results = await getRecentItemCodes(10);
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

    if (newValue) {
      onItemChange(index, {
        code: newValue._id,
        model: newValue.model,
        description: newValue.name,
        quantity: item.quantity || '',
        uom: item.uom || 'default',
      });
    }

    // Clear input value to prevent additional searches
    setInputValue('');
  };

  // Clear search
  const clearSearch = () => {
    setInputValue('');
    setSelectedItem(null);
    onItemChange(index, {
      ...item,
      code: '',
      model: '',
      description: '',
    });
  };

  // Get model color for chip
  const getModelColor = (model) => {
    const colors = {
      Asset: 'primary',
      Maintenance: 'secondary',
      OtherStore: 'success',
    };
    return colors[model] || 'default';
  };

  // Get display value for existing items
  const getDisplayValue = () => {
    if (isExisting && item.code && typeof item.code === 'object') {
      return (
        item.code.mainAssetId ||
        item.code.mainMaintenanceId ||
        item.code.mainItemCode ||
        item.code._id
      );
    }
    return selectedItem ? `${selectedItem.id} - ${selectedItem.name}` : '';
  };

  // Get actual code value for submission
  const getCodeValue = () => {
    if (isExisting && item.code && typeof item.code === 'object') {
      return item.code._id;
    }
    return item.code || '';
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        p: 2,
        mb: 2,
        backgroundColor: isExisting ? '#f8f9fa' : '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Item {index + 1} {isExisting && '(Existing)'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isExisting && !isEditing && (
            <Button size="small" variant="outlined" onClick={() => setIsEditing(true)}>
              Edit Item
            </Button>
          )}
          <IconButton
            size="small"
            color="error"
            onClick={() => onItemRemove(index)}
            title="Remove Item"
          >
            <IconTrash size={16} />
          </IconButton>
        </Box>
      </Box>

      <Grid2 container spacing={2}>
        {/* ITEM CODE WITH SEARCH */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CustomFormLabel htmlFor={`items[${index}].code`}>Item Code</CustomFormLabel>

          {isExisting && !isEditing ? (
            // Display mode for existing items
            <Box>
              <TextField
                fullWidth
                value={getDisplayValue()}
                disabled
                sx={{ backgroundColor: '#f5f5f5' }}
                InputProps={{
                  endAdornment: item.model && (
                    <InputAdornment position="end">
                      <Chip
                        label={item.model}
                        size="small"
                        color={getModelColor(item.model)}
                        variant="outlined"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          ) : (
            // Edit mode - autocomplete search
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
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Click to see recent items or start typing to search..."
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
          )}

          {/* Show selected item model for new items */}
          {!isExisting && selectedItem && (
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
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CustomFormLabel htmlFor={`items[${index}].description`}>
            Item Description
          </CustomFormLabel>
          <CustomTextField
            fullWidth
            id={`items[${index}].description`}
            value={item.description || ''}
            onChange={(e) => onItemChange(index, { ...item, description: e.target.value })}
            placeholder="Enter Item Description"
          />
        </Grid2>

        {/* ITEM QUANTITY */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CustomFormLabel htmlFor={`items[${index}].quantity`}>Item Quantity</CustomFormLabel>
          <CustomTextField
            fullWidth
            id={`items[${index}].quantity`}
            type="number"
            value={item.quantity || ''}
            onChange={(e) => onItemChange(index, { ...item, quantity: e.target.value })}
            placeholder="Enter Item Quantity"
          />
        </Grid2>

        {/* ITEM UOM */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <CustomFormLabel htmlFor={`items[${index}].uom`}>UOM</CustomFormLabel>
          <CustomSelect
            fullWidth
            id={`items[${index}].uom`}
            value={item.uom || 'default'}
            onChange={(e) => onItemChange(index, { ...item, uom: e.target.value })}
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
        </Grid2>
      </Grid2>

      {/* Hidden input to store actual code value for submission */}
      {/* <input
        type="hidden"
        name={`items[${index}].code`}
        value={getCodeValue()}
      />
      <input
        type="hidden"
        name={`items[${index}].model`}
        value={item.model || ''}
      /> */}
    </Box>
  );
};

export default EditableAssetItem;
