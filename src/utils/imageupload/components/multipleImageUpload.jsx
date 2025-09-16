'use client';

import { Box, Button, Typography, CircularProgress, IconButton, Chip, Grid2 } from '@mui/material';
import { Delete as DeleteIcon, DragIndicator } from '@mui/icons-material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import { ImagePreview } from '..';

/**
 * Multiple Image Upload Component - Fixed Grid2 alignment
 */
const MultipleImageUpload = ({
  label = 'Images',
  id = 'images',
  onChange,
  images = [],
  isLoading = false,
  errors = [],
  onRemove,
  onClear,
  accept = 'image/*',
  required = false,
  maxImages = 10,
  gridSize = { label: 3, field: 9 },
  canAddMore = true,
  remainingSlots = 0,
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Label Grid */}
      <Grid2
        size={{ xs: 12, md: gridSize.label }}
        sx={{ display: 'flex', margin: 0, alignItems: 'flex-start', paddingTop: 1 }}
      >
        <CustomFormLabel htmlFor={id} sx={{ marginTop: 0 }}>
          {label} {required && '*'}
          <Typography variant="caption" display="block" color="textSecondary">
            {images.length}/{maxImages} images
          </Typography>
        </CustomFormLabel>
      </Grid2>

      {/* Field Grid */}
      <Grid2 size={{ xs: 12, md: gridSize.field }}>
        {canAddMore && (
          <CustomTextField
            id={id}
            type="file"
            fullWidth
            inputProps={{ accept, multiple: true }}
            onChange={onChange}
            error={errors.length > 0}
            helperText={errors.length > 0 ? errors[0] : `You can add ${remainingSlots} more images`}
            disabled={isLoading}
          />
        )}

        {!canAddMore && (
          <Typography variant="body2" color="textSecondary">
            Maximum number of images reached ({maxImages})
          </Typography>
        )}

        {isLoading && (
          <Box display="flex" alignItems="center" mt={1}>
            <CircularProgress size={20} />
            <Typography variant="body2" ml={1}>
              Processing images...
            </Typography>
          </Box>
        )}

        {errors.length > 0 && (
          <Box mt={1}>
            {errors.map((error, index) => (
              <Typography key={index} variant="body2" color="error">
                {error}
              </Typography>
            ))}
          </Box>
        )}

        {images.length > 0 && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2">Uploaded Images</Typography>
              {onClear && (
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={onClear}>
                  Clear All
                </Button>
              )}
            </Box>

            <Grid2 container spacing={2}>
              {images.map((image, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={image.id}>
                  <Box
                    border={1}
                    borderColor="grey.300"
                    borderRadius={1}
                    p={1}
                    position="relative"
                    bgcolor="background.paper"
                  >
                    <Box display="flex" alignItems="center" mb={1}>
                      <DragIndicator fontSize="small" color="action" />
                      <Typography variant="caption" noWrap flex={1} ml={1}>
                        {image.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onRemove && onRemove(image.id)}
                        disabled={isLoading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <ImagePreview
                      src={image.previewUrl || '/placeholder.svg'}
                      alt={image.name}
                      width={120}
                      height={120}
                    />

                    <Box mt={1}>
                      <Chip label={formatFileSize(image.size)} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        )}
      </Grid2>
    </>
  );
};

export default MultipleImageUpload;
