'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Grid2,
  MenuItem,
  Box,
  Typography,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { fetchBomByCategory } from '@/api/bom.api';
import PropTypes from 'prop-types';

const ViewPurchaseItem = ({ formik, index, disable = false, view = false }) => {
  // Removed unused data state

  const fetchData = async () => {
    try {
      const response = await fetchBomByCategory();
      console.log('🚀 ~ fetchData ~ response:', response);
      // setData(response); // This line was removed as per the edit hint
    } catch (error) {
      toast.error('Failed to fetch item data');
    }
  };

  useEffect(() => {
    if (!view) {
      fetchData();
    }
  }, []);

  // Get the current item's code object (BOM details)
  const currentItem = formik.values.items?.[index];
  const bomDetails = currentItem?.code;

  // Check if collar fields exist (only for fabric category)
  const hasCollarFields =
    bomDetails &&
    bomDetails.category === 'fabric' &&
    (bomDetails.collarHeight || bomDetails.collarLength || bomDetails.tapeHeight);

  // Get category-specific color scheme
  const getCategoryColor = (category) => {
    switch (category) {
      case 'fabric':
        return { primary: 'primary', secondary: 'info' };
      case 'trims':
        return { primary: 'secondary', secondary: 'warning' };
      case 'accessories':
        return { primary: 'success', secondary: 'teal' };
      default:
        return { primary: 'default', secondary: 'default' };
    }
  };

  const categoryColors = bomDetails
    ? getCategoryColor(bomDetails.category)
    : { primary: 'default', secondary: 'default' };

  // Render essential fields for each category
  const renderEssentialFields = () => {
    if (!bomDetails) return null;

    switch (bomDetails.category) {
      case 'fabric':
        return (
          <>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Fabric Name
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.fabricName || ''}
                disabled
                sx={{ backgroundColor: '#f0f8ff', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Fabric Code
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.fabricCode || ''}
                disabled
                sx={{ backgroundColor: '#f0f8ff', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Color</CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.fabricColor || ''}
                disabled
                sx={{ backgroundColor: '#f0f8ff', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Sub Category
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.subCategory?.toUpperCase() || ''}
                disabled
                sx={{ backgroundColor: '#f0f8ff', mt: 1 }}
              />
            </Grid2>
          </>
        );
      case 'trims':
        return (
          <>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Trims Name
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.trimsName || ''}
                disabled
                sx={{ backgroundColor: '#f3e5f5', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Trims Code
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.trimsCode || ''}
                disabled
                sx={{ backgroundColor: '#f3e5f5', mt: 1 }}
              />
            </Grid2>
          </>
        );
      case 'accessories':
        return (
          <>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Accessories Name
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.accessoriesName || ''}
                disabled
                sx={{ backgroundColor: '#e8f5e8', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                Accessories Code
              </CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.accessoriesCode || ''}
                disabled
                sx={{ backgroundColor: '#e8f5e8', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Color</CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.accessoriesColor || ''}
                disabled
                sx={{ backgroundColor: '#e8f5e8', mt: 1 }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Size</CustomFormLabel>
              <CustomTextField
                fullWidth
                value={bomDetails.accessoriesSize || ''}
                disabled
                sx={{ backgroundColor: '#e8f5e8', mt: 1 }}
              />
            </Grid2>
          </>
        );
      default:
        return null;
    }
  };

  // Render additional details in accordion
  const renderAdditionalDetails = () => {
    if (!bomDetails) return null;

    const hasAdditionalDetails =
      bomDetails.hsn ||
      bomDetails.gsm ||
      bomDetails.dia ||
      bomDetails.yarnComposition ||
      bomDetails.fabricStructure ||
      bomDetails.fabricType;

    if (!hasAdditionalDetails) return null;

    return (
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f5f5f5' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            📋 Additional Technical Details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2 container spacing={2}>
            {bomDetails.hsn && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                  HSN Code
                </CustomFormLabel>
                <CustomTextField
                  fullWidth
                  value={bomDetails.hsn}
                  disabled
                  sx={{ backgroundColor: '#f9f9f9', mt: 1 }}
                />
              </Grid2>
            )}

            {bomDetails.trimsColor && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Color</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  value={bomDetails.trimsColor}
                  disabled
                  sx={{ backgroundColor: '#f3e5f5', mt: 1 }}
                />
              </Grid2>
            )}

            {bomDetails.trimsSize && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Size</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  value={bomDetails.trimsSize}
                  disabled
                  sx={{ backgroundColor: '#f3e5f5', mt: 1 }}
                />
              </Grid2>
            )}

            {bomDetails.category === 'fabric' && (
              <>
                {bomDetails.gsm && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>GSM</CustomFormLabel>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.gsm}
                      disabled
                      sx={{ backgroundColor: '#f9f9f9', mt: 1 }}
                    />
                  </Grid2>
                )}

                {bomDetails.dia && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Dia</CustomFormLabel>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.dia}
                      disabled
                      sx={{ backgroundColor: '#f9f9f9', mt: 1 }}
                    />
                  </Grid2>
                )}

                {bomDetails.yarnComposition && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                      Yarn Composition
                    </CustomFormLabel>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.yarnComposition}
                      disabled
                      sx={{ backgroundColor: '#f9f9f9', mt: 1 }}
                    />
                  </Grid2>
                )}

                {bomDetails.fabricStructure && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                      Fabric Structure
                    </CustomFormLabel>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.fabricStructure}
                      disabled
                      sx={{ backgroundColor: '#f9f9f9', mt: 1 }}
                    />
                  </Grid2>
                )}

                {bomDetails.fabricType && (
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                      Fabric Type
                    </CustomFormLabel>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.fabricType}
                      disabled
                      sx={{ backgroundColor: '#f9f9f9', mt: 1 }}
                    />
                  </Grid2>
                )}
              </>
            )}
          </Grid2>
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Grid2
      container
      size={12}
      rowSpacing={2}
      sx={{
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        backgroundColor: '#fafafa',
      }}
    >
      {/* HEADER WITH ITEM INDEX */}
      <Grid2 size={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            label={`Item ${index + 1}`}
            color="primary"
            variant="filled"
            sx={{ mr: 2, fontWeight: 'bold' }}
          />
          {bomDetails && (
            <Chip label={bomDetails.category?.toUpperCase()} color="black" variant="outlined" />
          )}
        </Box>
      </Grid2>

      {/* BOM DETAILS SECTION */}
      {bomDetails && (
        <>
          {/* BOM ID - Prominent Display */}
          <Grid2 size={12}>
            <Box
              sx={{
                backgroundColor: `${categoryColors.primary}.main`,
                p: 2,
                borderRadius: 2,
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                BOM ID: {bomDetails.bomId}
              </Typography>
            </Box>
          </Grid2>

          {/* ESSENTIAL CATEGORY-SPECIFIC FIELDS */}
          {renderEssentialFields()}

          {/* COLLAR FIELDS - Always visible when present (high priority) */}
          {hasCollarFields && (
            <>
              <Grid2 size={12}>
                <Box
                  sx={{
                    backgroundColor: 'warning.light',
                    p: 2,
                    borderRadius: 2,
                    mt: 2,
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
                    📏 Collar Specifications
                  </Typography>
                </Box>
              </Grid2>

              {bomDetails.collarHeight && (
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'warning.dark' }}>
                    Collar Height
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={bomDetails.collarHeight}
                    disabled
                    sx={{ backgroundColor: '#fff8e1', mt: 1, border: '2px solid #ffb74d' }}
                  />
                </Grid2>
              )}

              {bomDetails.collarLength && (
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'warning.dark' }}>
                    Collar Length
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={bomDetails.collarLength}
                    disabled
                    sx={{ backgroundColor: '#fff8e1', mt: 1, border: '2px solid #ffb74d' }}
                  />
                </Grid2>
              )}

              {bomDetails.tapeHeight && (
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'warning.dark' }}>
                    Tape Height
                  </CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    value={bomDetails.tapeHeight}
                    disabled
                    sx={{ backgroundColor: '#fff8e1', mt: 1, border: '2px solid #ffb74d' }}
                  />
                </Grid2>
              )}
            </>
          )}

          {/* PRICING INFORMATION - Essential */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'success.main' }}>
              Unit Price
            </CustomFormLabel>
            <CustomTextField
              fullWidth
              value={`₹${bomDetails.price || ''}`}
              disabled
              sx={{ backgroundColor: '#e8f5e8', mt: 1, fontWeight: 'bold' }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'success.main' }}>
              BOM UOM
            </CustomFormLabel>
            <CustomTextField
              fullWidth
              value={bomDetails.uom?.toUpperCase() || ''}
              disabled
              sx={{ backgroundColor: '#e8f5e8', mt: 1, fontWeight: 'bold' }}
            />
          </Grid2>

          {/* ADDITIONAL DETAILS ACCORDION */}
          {renderAdditionalDetails()}

          <Grid2 size={12}>
            <Divider sx={{ my: 2 }} />
          </Grid2>
        </>
      )}

      {/* PURCHASE ORDER DETAILS */}
      <Grid2 size={12}>
        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
          🛒 Purchase Order Details
        </Typography>
      </Grid2>

      {/* ITEM DESCRIPTION */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].description`} sx={{ marginTop: 0 }}>
          Description
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <CustomTextField
          fullWidth
          id={`items[${index}].description`}
          name={`items[${index}].description`}
          value={formik.values.items?.[index]?.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter Item Description"
          disabled={disable}
          error={
            formik.touched.items?.[index]?.description &&
            Boolean(formik.errors.items?.[index]?.description)
          }
          helperText={
            formik.touched.items?.[index]?.description && formik.errors.items?.[index]?.description
          }
        />
      </Grid2>

      {/* QUANTITY AND UOM */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].indentQuantity`} sx={{ marginTop: 0 }}>
          Indent Quantity
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 4 }}>
        <CustomTextField
          fullWidth
          id={`items[${index}].indentQuantity`}
          name={`items[${index}].indentQuantity`}
          type="number"
          value={formik.values.items?.[index]?.indentQuantity}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.items?.[index]?.indentQuantity &&
            Boolean(formik.errors.items?.[index]?.indentQuantity)
          }
          helperText={
            formik.touched.items?.[index]?.indentQuantity &&
            formik.errors.items?.[index]?.indentQuantity
          }
          disabled={disable}
        />
      </Grid2>

      <Grid2
        size={{ xs: 12, md: 2 }}
        sx={{
          display: 'flex',
          margin: 0,
          alignItems: 'center',
          justifyContent: { xs: 'start', md: 'center' },
        }}
      >
        <CustomFormLabel htmlFor={`items[${index}].uom`} sx={{ marginTop: 0 }}>
          UOM
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 3 }}>
        <CustomSelect
          fullWidth
          id={`items[${index}].uom`}
          name={`items[${index}].uom`}
          value={formik.values.items?.[index]?.uom}
          disabled={disable}
          onChange={formik.handleChange}
          error={formik.touched.items?.[index]?.uom && Boolean(formik.errors.items?.[index]?.uom)}
          helperText={formik.touched.items?.[index]?.uom && formik.errors.items?.[index]?.uom}
        >
          <MenuItem value="default" disabled>
            Select UOM
          </MenuItem>
          <MenuItem value="pieces">PCS</MenuItem>
          <MenuItem value="grams">GRAMS</MenuItem>
          <MenuItem value="kgs">KGS</MenuItem>
          <MenuItem value="meters">MTRS</MenuItem>
          <MenuItem value="inch">INCH</MenuItem>
          <MenuItem value="cm">CM</MenuItem>
          <MenuItem value="cones">CONES</MenuItem>
          <MenuItem value="pkts">PKTS</MenuItem>
        </CustomSelect>
      </Grid2>

      {/* ESTIMATED TOTAL */}
      {bomDetails &&
        bomDetails.price &&
        (formik.values.items?.[index]?.indentQuantity ||
          formik.values.items?.[index]?.orderQuantity) && (
          <>
            {/* Show Order Quantity with label and custom color */}
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'info.main' }}>
                Order Quantity
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <CustomTextField
                fullWidth
                value={
                  formik.values.items[index].orderQuantity ??
                  formik.values.items[index].indentQuantity
                }
                disabled
                sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold', fontSize: '1.1rem' }}
              />
            </Grid2>
            <Grid2
              size={{ xs: 12, md: 3 }}
              sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
            >
              <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'success.main' }}>
                Estimated Total
              </CustomFormLabel>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CustomTextField
                  fullWidth
                  value={`₹${(
                    Number.parseFloat(bomDetails.price) *
                    Number.parseFloat(
                      formik.values.items[index].orderQuantity ??
                        formik.values.items[index].indentQuantity,
                    )
                  ).toFixed(2)}`}
                  disabled
                  sx={{ backgroundColor: '#e8f5e8', fontWeight: 'bold', fontSize: '1.1rem' }}
                />
              </Box>
            </Grid2>
          </>
        )}
    </Grid2>
  );
};

ViewPurchaseItem.propTypes = {
  formik: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  disable: PropTypes.bool,
  view: PropTypes.bool,
};

export default ViewPurchaseItem;
