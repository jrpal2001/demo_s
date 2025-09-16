import React from 'react';
import { styled, Select } from '@mui/material';

const CustomSelect = React.forwardRef((props, ref) => {
  return <Select {...props} ref={ref} />;
});

export default styled(CustomSelect)``;
