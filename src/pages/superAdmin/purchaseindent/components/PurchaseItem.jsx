'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Autocomplete, Grid2, MenuItem, Typography, Divider } from '@mui/material';
import PropTypes from 'prop-types';

import CustomSelect from '@/components/forms/theme-elements/CustomSelect';
import CustomFormLabel from '@/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@/components/forms/theme-elements/CustomTextField';

import { fetchBomByCategory } from '@/api/bom.api';

const PurchaseItem = ({ formik, index, disable = false, view = false }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetchBomByCategory();
      setData(response);
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

  // Check if collar fields exist
  const hasCollarFields =
    bomDetails && (bomDetails.collarHeight || bomDetails.collarLength || bomDetails.tapeHeight);

  return (
    <Grid2
      container
      size={12}
      rowSpacing={2}
      sx={{ border: '1px solid grey', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}
    >
      {/* ITEM CODE */}
      <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
        <CustomFormLabel htmlFor={`items[${index}].code`} sx={{ marginTop: 0 }}>
          Item Code
        </CustomFormLabel>
      </Grid2>
      <Grid2 size={{ xs: 12, md: 9 }}>
        <Autocomplete
          options={[]} // No options
          freeSolo
          disabled={disable}
          value={formik.values.items?.[index]?.code?._id || ''}
          getOptionLabel={(option) => (typeof option === 'string' ? option : '')}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              placeholder="Select Code"
              aria-label="Select Code"
              autoComplete="off"
              name={`items[${index}].code`}
              error={
                formik.touched.items?.[index]?.code && Boolean(formik.errors.items?.[index]?.code)
              }
              helperText={formik.touched.items?.[index]?.code && formik.errors.items?.[index]?.code}
              disabled={disable}
            />
          )}
          onChange={() => {}} // Do nothing on change
        />
      </Grid2>
      {/* ITEM DESCRIPTION, QUANTITY REQUIRED, ORDER QUANTITY, UOM - ALWAYS FULL WIDTH ROW */}
      <Grid2 size={{ xs: 12, md: 12 }}>
        <Grid2 container justifyContent="space-around" spacing={2} sx={{ mt: 2 }}>
          <Grid2 item xs={12} md={3}>
            <CustomFormLabel htmlFor={`items[${index}].description`} sx={{ marginTop: 0 }}>
              Item Description
            </CustomFormLabel>
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
                formik.touched.items?.[index]?.description &&
                formik.errors.items?.[index]?.description
              }
            />
          </Grid2>
          <Grid2 item xs={12} md={3}>
            <CustomFormLabel htmlFor={`items[${index}].quantity`} sx={{ marginTop: 0 }}>
              Quantity Required
            </CustomFormLabel>
            <CustomTextField
              fullWidth
              id={`items[${index}].quantity`}
              name={`items[${index}].quantity`}
              type="number"
              value={formik.values.items?.[index]?.quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Item Quantity"
              error={
                formik.touched.items?.[index]?.quantity &&
                Boolean(formik.errors.items?.[index]?.quantity)
              }
              helperText={
                formik.touched.items?.[index]?.quantity && formik.errors.items?.[index]?.quantity
              }
              disabled={disable}
            />
          </Grid2>
          <Grid2 item xs={12} md={3}>
            <CustomFormLabel
              htmlFor={`items[${index}].orderQuantity`}
              sx={{ marginTop: 0, color: 'error.main', fontWeight: 'bold' }}
            >
              Order Quantity *
            </CustomFormLabel>
            <CustomTextField
              fullWidth
              id={`items[${index}].orderQuantity`}
              name={`items[${index}].orderQuantity`}
              type="number"
              value={formik.values.items?.[index]?.orderQuantity || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter Order Quantity"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'error.main' },
                  '&:hover fieldset': { borderColor: 'error.main' },
                  '&.Mui-focused fieldset': { borderColor: 'error.main' },
                },
              }}
              error={
                formik.touched.items?.[index]?.orderQuantity &&
                Boolean(formik.errors.items?.[index]?.orderQuantity)
              }
              helperText={
                formik.touched.items?.[index]?.orderQuantity &&
                formik.errors.items?.[index]?.orderQuantity
              }
            />
          </Grid2>
          <Grid2 item xs={12} md={3}>
            <CustomFormLabel htmlFor={`items[${index}].uom`} sx={{ marginTop: 0 }}>
              UOM
            </CustomFormLabel>
            <CustomSelect
              fullWidth
              id={`items[${index}].uom`}
              name={`items[${index}].uom`}
              value={formik.values.items?.[index]?.uom}
              disabled={disable}
              onChange={formik.handleChange}
              error={
                formik.touched.items?.[index]?.uom && Boolean(formik.errors.items?.[index]?.uom)
              }
              helperText={formik.touched.items?.[index]?.uom && formik.errors.items?.[index]?.uom}
            >
              <MenuItem value="default" disabled>
                Select Unit of Measurement
              </MenuItem>
              <MenuItem value="pieces" disabled>
                PCS
              </MenuItem>
              <MenuItem value="grams" disabled>
                GRAMS
              </MenuItem>
              <MenuItem value="kgs" disabled>
                KGS
              </MenuItem>
              <MenuItem value="meters" disabled>
                MTRS
              </MenuItem>
              <MenuItem value="inch" disabled>
                INCH
              </MenuItem>
              <MenuItem value="cm" disabled>
                CM
              </MenuItem>
              <MenuItem value="cones" disabled>
                CONES
              </MenuItem>
              <MenuItem value="pkts" disabled>
                PKTS
              </MenuItem>
            </CustomSelect>
            {formik.touched.items?.[index]?.uom && formik.errors.items?.[index]?.uom && (
              <p className="MuiFormHelperText-root Mui-error MuiFormHelperText-sizeMedium MuiFormHelperText-contained css-11niil2-MuiFormHelperText-root">
                Please Select Unit of Measurement
              </p>
            )}
          </Grid2>
        </Grid2>
      </Grid2>
      {/* BOM DETAILS SECTION */}
      {bomDetails && (
        <>
          <Grid2 size={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6" color="primary">
                BOM Details
              </Typography>
            </Divider>
          </Grid2>

          {/* BOM ID */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>BOM ID</CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 9 }}>
            <CustomTextField
              fullWidth
              value={bomDetails.bomId || ''}
              disabled
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          </Grid2>

          {/* CATEGORY */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Category</CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <CustomTextField
              fullWidth
              value={bomDetails.category || ''}
              disabled
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          </Grid2>

          {/* SUB CATEGORY - Hide for trims and accessories */}
          {bomDetails.category !== 'trims' && bomDetails.category !== 'accessories' && (
            <>
              <Grid2
                size={{ xs: 12, md: 3 }}
                sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
              >
                <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                  Sub Category
                </CustomFormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <CustomTextField
                  fullWidth
                  value={bomDetails.subCategory || ''}
                  disabled
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </Grid2>
            </>
          )}

          {/* FABRIC/ITEM NAME */}
          {bomDetails.category === 'fabric' && (
            <>
              <Grid2
                size={{ xs: 12, md: 3 }}
                sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
              >
                <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                  Fabric Name
                </CustomFormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <CustomTextField
                  fullWidth
                  value={bomDetails.fabricName || ''}
                  disabled
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </Grid2>

              <Grid2
                size={{ xs: 12, md: 3 }}
                sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
              >
                <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>
                  Fabric Color
                </CustomFormLabel>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3 }}>
                <CustomTextField
                  fullWidth
                  value={bomDetails.fabricColor || ''}
                  disabled
                  sx={{ backgroundColor: '#f5f5f5' }}
                />
              </Grid2>

              {/* GSM and DIA */}
              {bomDetails.gsm && (
                <>
                  <Grid2
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                  >
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>GSM</CustomFormLabel>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.gsm}
                      disabled
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Grid2>
                </>
              )}

              {bomDetails.dia && (
                <>
                  <Grid2
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                  >
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Dia</CustomFormLabel>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.dia}
                      disabled
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Grid2>
                </>
              )}
            </>
          )}

          {/* COLLAR FIELDS SECTION */}
          {hasCollarFields && (
            <>
              <Grid2 size={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="h6" color="secondary">
                    Collar Specifications
                  </Typography>
                </Divider>
              </Grid2>

              {bomDetails.collarHeight && (
                <>
                  <Grid2
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                  >
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'secondary' }}>
                      Collar Height
                    </CustomFormLabel>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.collarHeight}
                      disabled
                      sx={{ backgroundColor: '#fff3e0' }}
                    />
                  </Grid2>
                </>
              )}

              {bomDetails.collarLength && (
                <>
                  <Grid2
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                  >
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'secondary' }}>
                      Collar Length
                    </CustomFormLabel>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.collarLength}
                      disabled
                      sx={{ backgroundColor: '#fff3e0' }}
                    />
                  </Grid2>
                </>
              )}

              {bomDetails.tapeHeight && (
                <>
                  <Grid2
                    size={{ xs: 12, md: 3 }}
                    sx={{ display: 'flex', margin: 0, alignItems: 'center' }}
                  >
                    <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold', color: 'secondary' }}>
                      Tape Height
                    </CustomFormLabel>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 3 }}>
                    <CustomTextField
                      fullWidth
                      value={bomDetails.tapeHeight}
                      disabled
                      sx={{ backgroundColor: '#fff3e0' }}
                    />
                  </Grid2>
                </>
              )}
            </>
          )}

          {/* PRICE FROM BOM */}
          <Grid2 size={{ xs: 12, md: 3 }} sx={{ display: 'flex', margin: 0, alignItems: 'center' }}>
            <CustomFormLabel sx={{ marginTop: 0, fontWeight: 'bold' }}>Price</CustomFormLabel>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 3 }}>
            <CustomTextField
              fullWidth
              value={bomDetails.price || ''}
              disabled
              sx={{ backgroundColor: '#f5f5f5' }}
            />
          </Grid2>
        </>
      )}
    </Grid2>
  );
};

PurchaseItem.propTypes = {
  formik: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  disable: PropTypes.bool,
  view: PropTypes.bool,
};

export default PurchaseItem;
