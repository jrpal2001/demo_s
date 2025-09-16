import React from 'react';
import { Grid } from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

const Accessories = ({ formik }) => {
    const { values, handleChange, touched, errors } = formik;

    return (
        <>
            {/* Accessories Name */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="accessoriesName">Accessories Name</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="accessoriesName"
                    name="accessoriesName"
                    value={values.accessoriesName}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter accessories name"
                    error={touched.accessoriesName && Boolean(errors.accessoriesName)}
                    helperText={touched.accessoriesName && errors.accessoriesName}
                />
            </Grid>

            {/* Accessories Color */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="accessoriesColor">Accessories Color</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="accessoriesColor"
                    name="accessoriesColor"
                    value={values.accessoriesColor}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter accessories color"
                    error={touched.accessoriesColor && Boolean(errors.accessoriesColor)}
                    helperText={touched.accessoriesColor && errors.accessoriesColor}
                />
            </Grid>

            {/* Accessories Size */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="accessoriesSize">Accessories Size</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="accessoriesSize"
                    name="accessoriesSize"
                    value={values.accessoriesSize}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter accessories size"
                    error={touched.accessoriesSize && Boolean(errors.accessoriesSize)}
                    helperText={touched.accessoriesSize && errors.accessoriesSize}
                />
            </Grid>

            {/* Accessories Code */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="accessoriesCode">Accessories Code</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="accessoriesCode"
                    name="accessoriesCode"
                    value={values.accessoriesCode}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter accessories code"
                    error={touched.accessoriesCode && Boolean(errors.accessoriesCode)}
                    helperText={touched.accessoriesCode && errors.accessoriesCode}
                />
            </Grid>
        </>
    );
};

export default Accessories;