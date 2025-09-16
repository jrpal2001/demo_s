import React from 'react';
import { Grid } from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

const Trims = ({ formik }) => {
    const { values, handleChange, touched, errors } = formik;

    return (
        <>
            {/* Trim Name */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="trimsName">Trim Name</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="trimsName"
                    name="trimsName"
                    value={values.trimsName}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter trim name"
                    error={touched.trimsName && Boolean(errors.trimsName)}
                    helperText={touched.trimsName && errors.trimsName}
                />
            </Grid>

            {/* Trim Color */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="trimsColor">Trim Color</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="trimsColor"
                    name="trimsColor"
                    value={values.trimsColor}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter trim color"
                    error={touched.trimsColor && Boolean(errors.trimsColor)}
                    helperText={touched.trimsColor && errors.trimsColor}
                />
            </Grid>

            {/* Trim Size */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="trimsSize">Trim Size</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="trimsSize"
                    name="trimsSize"
                    value={values.trimsSize}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter trim size"
                    error={touched.trimsSize && Boolean(errors.trimsSize)}
                    helperText={touched.trimsSize && errors.trimsSize}
                />
            </Grid>

            {/* Trim Code */}
            <Grid item xs={3}>
                <CustomFormLabel htmlFor="trimsCode">Trim Code</CustomFormLabel>
            </Grid>
            <Grid item xs={9}>
                <CustomTextField
                    id="trimsCode"
                    name="trimsCode"
                    value={values.trimsCode}
                    onChange={handleChange}
                    fullWidth
                    placeholder="Enter trim code"
                    error={touched.trimsCode && Boolean(errors.trimsCode)}
                    helperText={touched.trimsCode && errors.trimsCode}
                />
            </Grid>
        </>
    );
};

export default Trims;