import { Select } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.divider,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));

const CustomSelectWithMenu = (props) => {
  const { MenuProps, ...otherProps } = props;

  return (
    <CustomSelect
      {...otherProps}
      MenuProps={{
        ...MenuProps,
        PaperProps: {
          ...MenuProps?.PaperProps,
          sx: {
            maxHeight: 200,
            backgroundColor: 'background.paper',
            '& .MuiMenuItem-root': {
              color: '#000000 !important', // Force black text color
              backgroundColor: '#ffffff !important', // Force white background
              minHeight: '48px',
              fontSize: '14px',
              '&:hover': {
                backgroundColor: '#f5f5f5 !important', // Light gray on hover
                color: '#000000 !important',
              },
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd !important', // Light blue when selected
                color: '#000000 !important',
                '&:hover': {
                  backgroundColor: '#bbdefb !important',
                  color: '#000000 !important',
                },
              },
              '&.Mui-disabled': {
                color: '#999999 !important',
                backgroundColor: '#f9f9f9 !important',
              },
            },
            ...MenuProps?.PaperProps?.sx,
          },
        },
      }}
    />
  );
};

export default CustomSelectWithMenu;
