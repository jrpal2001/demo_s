import React from 'react';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '0.8',
  },
  '& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder': {
    color: theme.palette.text.secondary,
    opacity: '1',
  },
  '& .Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[200],
  },
}));

const CustomTextField = React.forwardRef((props, ref) => {
  return <StyledTextField inputRef={ref} {...props} />;
});

export default CustomTextField;
