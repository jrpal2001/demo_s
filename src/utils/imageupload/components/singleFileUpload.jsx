'use client';

import { Grid, Box, Button, Typography, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

/**
 * Single File Upload Component
 */
const SingleFileUpload = ({
  label = 'File',
  id = 'file',
  onChange,
  fileName = '',
  isLoading = false,
  error = null,
  onClear,
  accept = '*',
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
          inputProps={{ accept }}
          onChange={onChange}
          error={!!error}
          helperText={error || fileName}
          disabled={isLoading}
        />

        {isLoading && (
          <Box display="flex" alignItems="center" mt={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" ml={1}>
              Uploading...
            </Typography>
          </Box>
        )}

        {fileName && showClearButton && onClear && (
          <Box mt={2}>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onClear}
              disabled={isLoading}
            >
              Remove File
            </Button>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default SingleFileUpload;
