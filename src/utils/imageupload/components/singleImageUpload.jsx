'use client';

import { Grid, Box, Button, Typography, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import ImagePreview from './imagePreview';

/**
 * Single Image Upload Component
 */
const SingleImageUpload = ({
  label = 'Image',
  id = 'image',
  onChange,
  previewUrl,
  isLoading = false,
  error = null,
  onClear,
  accept = 'image/*',
  required = false,
  gridSize = { label: 3, field: 9 },
  showClearButton = true,
}) => {
  return (
    <>
      <Grid item xs={gridSize.label}>
        <CustomFormLabel htmlFor={id}>
          {label} {required && '*'}
        </CustomFormLabel>
      </Grid>
      <Grid item xs={gridSize.field}>
        <CustomTextField
          id={id}
          type="file"
          fullWidth
          inputProps={{ accept, multiple: false }}
          onChange={onChange}
          error={!!error}
          helperText={error}
          disabled={isLoading}
        />

        {isLoading && (
          <Box display="flex" alignItems="center" mt={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" ml={1}>
              Processing image...
            </Typography>
          </Box>
        )}

        {previewUrl && (
          <Box mt={2}>
            <ImagePreview src={previewUrl || '/placeholder.svg'} alt={`${label} Preview`} />
            {showClearButton && onClear && (
              <Box mt={1}>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={onClear}
                  disabled={isLoading}
                >
                  Remove Image
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Grid>
    </>
  );
};

export default SingleImageUpload;
