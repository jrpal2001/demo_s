'use client';

import { Grid, MenuItem } from '@mui/material';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';
import CustomSelect from '@/components/forms/theme-elements/CustomSelect';

const Fabric = ({ formik, edit = false, onSubCategoryChange }) => {
  console.log('🚀 ~ Fabric ~ formik:', formik);

  // Check if subcategory is collar to show collar-specific fields
  const isCollarSubcategory = formik.values.subCategory === 'colar';

  const handleSubCategoryChange = (event) => {
    const newSubCategory = event.target.value;
    formik.handleChange(event); // Update formik

    // Notify parent component about subcategory change
    if (onSubCategoryChange) {
      onSubCategoryChange(newSubCategory);
    }
  };

  return (
    <>
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="subCategory">Sub-Category</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomSelect
          fullWidth
          id="subCategory"
          name="subCategory"
          value={formik.values.subCategory}
          onChange={handleSubCategoryChange}
          error={formik.touched.subCategory && Boolean(formik.errors.subCategory)}
          helperText={formik.touched.subCategory && formik.errors.subCategory}
          disabled={edit}
        >
          <MenuItem value="mainfabric">Main Fabric</MenuItem>
          <MenuItem value="interlining">Interlining</MenuItem>
          <MenuItem value="cuff">Cuff</MenuItem>
          <MenuItem value="colar">Colar</MenuItem>
          <MenuItem value="rib">Rib</MenuItem>
          <MenuItem value="others">Others</MenuItem>
        </CustomSelect>
      </Grid>
      {/* Collar-specific fields - only show when subCategory is 'colar' */}
      {isCollarSubcategory && (
        <>
          {/* Collar Height */}
          <Grid item xs={3}>
            <CustomFormLabel htmlFor="collarHeight">Collar Height</CustomFormLabel>
          </Grid>
          <Grid item xs={9}>
            <CustomTextField
              fullWidth
              id="collarHeight"
              name="collarHeight"
              value={formik.values.collarHeight || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Collar Height"
              error={formik.touched.collarHeight && Boolean(formik.errors.collarHeight)}
              helperText={formik.touched.collarHeight && formik.errors.collarHeight}
            />
          </Grid>

          {/* Collar Length */}
          <Grid item xs={3}>
            <CustomFormLabel htmlFor="collarLength">Collar Length</CustomFormLabel>
          </Grid>
          <Grid item xs={9}>
            <CustomTextField
              fullWidth
              id="collarLength"
              name="collarLength"
              value={formik.values.collarLength || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Collar Length"
              error={formik.touched.collarLength && Boolean(formik.errors.collarLength)}
              helperText={formik.touched.collarLength && formik.errors.collarLength}
            />
          </Grid>

          {/* Tape Height */}
          <Grid item xs={3}>
            <CustomFormLabel htmlFor="tapeHeight">Tape Height</CustomFormLabel>
          </Grid>
          <Grid item xs={9}>
            <CustomTextField
              fullWidth
              id="tapeHeight"
              name="tapeHeight"
              value={formik.values.tapeHeight || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Tape Height"
              error={formik.touched.tapeHeight && Boolean(formik.errors.tapeHeight)}
              helperText={formik.touched.tapeHeight && formik.errors.tapeHeight}
            />
          </Grid>
        </>
      )}

      {/* All existing fabric fields remain the same */}
      {/* Fabric Name */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="fabricName">Fabric Name</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="fabricName"
          name="fabricName"
          value={formik.values.fabricName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Fabric Name"
          error={formik.touched.fabricName && Boolean(formik.errors.fabricName)}
          helperText={formik.touched.fabricName && formik.errors.fabricName}
        />
      </Grid>

      {/* Fabric Code */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="fabricCode">Fabric Code</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="fabricCode"
          name="fabricCode"
          value={formik.values.fabricCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Fabric Code"
          error={formik.touched.fabricCode && Boolean(formik.errors.fabricCode)}
          helperText={formik.touched.fabricCode && formik.errors.fabricCode}
        />
      </Grid>

      {/* Fabric Color */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="fabricColor">Fabric Color</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="fabricColor"
          name="fabricColor"
          value={formik.values.fabricColor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Fabric Color"
          error={formik.touched.fabricColor && Boolean(formik.errors.fabricColor)}
          helperText={formik.touched.fabricColor && formik.errors.fabricColor}
        />
      </Grid>

      {/* GSM */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="gsm">GSM</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="gsm"
          name="gsm"
          value={formik.values.gsm}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter GSM"
          error={formik.touched.gsm && Boolean(formik.errors.gsm)}
          helperText={formik.touched.gsm && formik.errors.gsm}
        />
      </Grid>

      {/* Dia */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="dia">Dia</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="dia"
          name="dia"
          value={formik.values.dia}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Dia"
          error={formik.touched.dia && Boolean(formik.errors.dia)}
          helperText={formik.touched.dia && formik.errors.dia}
        />
      </Grid>

      {/* Yarn Composition */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="yarnComposition">Yarn Composition</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="yarnComposition"
          name="yarnComposition"
          value={formik.values.yarnComposition}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Yarn Composition"
          error={formik.touched.yarnComposition && Boolean(formik.errors.yarnComposition)}
          helperText={formik.touched.yarnComposition && formik.errors.yarnComposition}
        />
      </Grid>

      {/* Fabric Structure */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="fabricStructure">Fabric Structure</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="fabricStructure"
          name="fabricStructure"
          value={formik.values.fabricStructure}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Fabric Structure"
          error={formik.touched.fabricStructure && Boolean(formik.errors.fabricStructure)}
          helperText={formik.touched.fabricStructure && formik.errors.fabricStructure}
        />
      </Grid>

      {/* Fabric Type */}
      <Grid item xs={3}>
        <CustomFormLabel htmlFor="fabricType">Fabric Type</CustomFormLabel>
      </Grid>
      <Grid item xs={9}>
        <CustomTextField
          fullWidth
          id="fabricType"
          name="fabricType"
          value={formik.values.fabricType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Fabric Type"
          error={formik.touched.fabricType && Boolean(formik.errors.fabricType)}
          helperText={formik.touched.fabricType && formik.errors.fabricType}
        />
      </Grid>
    </>
  );
};

export default Fabric;
