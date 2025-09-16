import { Box } from '@mui/material';

/**
 * Image Preview Component
 */
const ImagePreview = ({ src, alt = 'Preview', width = 150, height = 150, style = {} }) => {
  const defaultStyle = {
    borderRadius: '8px',
    objectFit: 'cover',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    ...style,
  };

  return (
    <Box display="flex" justifyContent="center">
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        width={`${width}px`}
        height={`${height}px`}
        style={defaultStyle}
      />
    </Box>
  );
};

export default ImagePreview;
