import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Fab,
  Grid2,
  Typography,
} from '@mui/material';
import { IconChevronDown, IconMinus, IconPlus } from '@tabler/icons';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ProductBoms from './ProductBoms';

const TRIM_TYPES = [
  'EMBROIDERY THREAD',
  'BUTTON',
  'THERMAL SIZE LABEL',
  'STITCHING SIZE LABEL',
  'WASHCARE LABEL',
  'TAPE',
  'WOVEN BADGE',
  'THREAD',
  'OTHER',
];

const ProductAccordian = ({ title, formik, code = 0 }) => {
  const [expanded, setExpanded] = useState(code > 0);
  const [productCode, setProductCode] = useState(code);

  const handleClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleClickProductAddition = () => {
    setProductCode((prev) => {
      prev = prev + 1;
      return prev;
    });
    formik.setFieldValue(title?.toLowerCase(), [
      ...formik.values[title?.toLowerCase()],
      { code: '', consumption: '', uom: '', cost: '' }, // Add new empty object to fabric array
    ]);
  };

  const handleClickProductSubstraction = () => {
    setProductCode((prev) => {
      if (prev > 0) {
        prev = prev - 1;
        return prev;
      }
    });
    formik.setFieldValue('fabric', formik.values.fabric.slice(0, -1));
  };

  useEffect(() => {
    setProductCode(code);
    setExpanded(code > 0);
  }, [code]);

  // For Trims: group trims by type
  const trimsByType = {};
  if (title === 'Trims' && Array.isArray(formik.values.trims)) {
    formik.values.trims.forEach((trim, idx) => {
      const type = trim.type || 'OTHER';
      if (!trimsByType[type]) trimsByType[type] = [];
      trimsByType[type].push(idx); // store index for ProductBoms
    });
  }

  return (
    <Accordion elevation={9} sx={{ mb: 2 }} expanded={expanded} onChange={handleClick}>
      <AccordionSummary
        expandIcon={<IconChevronDown size="20" />}
        aria-controls="panel3a-content"
        id="panel3a-header"
      >
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {/* Custom Trims UI */}
        {title === 'Trims' && (
          <Box sx={{ mb: 2 }}>
            {/* Each trim type heading on its own line, with add button and count */}
            {TRIM_TYPES.map((type) => {
              const typeTrims = Array.isArray(formik.values.trims)
                ? formik.values.trims
                    .map((trim, idx) => ({ ...trim, _idx: idx }))
                    .filter((trim) => trim.type === type)
                : [];
              return (
                <Box key={type} sx={{ mb: 2, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ flex: 1 }}>
                      {type}
                    </Typography>
                    <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
                      ({typeTrims.length})
                    </Typography>
                    <Fab
                      size="small"
                      color="primary"
                      onClick={() => {
                        const currentTrims = Array.isArray(formik.values.trims)
                          ? [...formik.values.trims]
                          : [];
                        formik.setFieldValue('trims', [...currentTrims, { type }]);
                      }}
                      sx={{ minWidth: 0, width: 28, height: 28 }}
                    >
                      <IconPlus size={16} />
                    </Fab>
                  </Box>
                  {/* Show all trims of this type inside this box */}
                  {typeTrims.length > 0 && (
                    <Box>
                      {typeTrims.map((trim) => (
                        <Box
                          key={trim._idx}
                          sx={{
                            position: 'relative',
                            mb: 2,
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            p: 1,
                          }}
                        >
                          <ProductBoms title="Trims" formik={formik} index={trim._idx} />
                          <Fab
                            size="small"
                            color="error"
                            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
                            onClick={() => {
                              const newTrims = [...formik.values.trims];
                              newTrims.splice(trim._idx, 1);
                              formik.setFieldValue('trims', newTrims);
                            }}
                          >
                            <IconMinus size={18} />
                          </Fab>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
        {/* Default for other sections */}
        {title !== 'Trims' && (
          <Grid2 container rowSpacing={2} columnSpacing={2} size={12}>
            {Array.from({ length: productCode }).map((_, index) => (
              <ProductBoms title={title} formik={formik} key={index} index={index} />
            ))}
            <Grid2 size={12}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                <Fab
                  size="medium"
                  color="primary"
                  onClick={handleClickProductAddition}
                  sx={{ marginRight: '1rem' }}
                >
                  <IconPlus></IconPlus>
                </Fab>
                {productCode > 0 && (
                  <Fab size="medium" color="error" onClick={handleClickProductSubstraction}>
                    <IconMinus></IconMinus>
                  </Fab>
                )}
              </Box>
            </Grid2>
          </Grid2>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

ProductAccordian.propTypes = {
  title: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  code: PropTypes.number,
};

export default ProductAccordian;
