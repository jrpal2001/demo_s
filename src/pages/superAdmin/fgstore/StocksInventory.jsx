'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Reorder status colors
const REORDER_COLORS = {
  critical: '#FF6B35', // Orange
  reorder: '#F7B801', // Yellow
  'no-reorder': '#4CAF50', // Green
  overflow: '#2196F3', // Blue
};

// Function to determine if text should be white or black based on background color
const getTextColor = (backgroundColor) => {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = Number.parseInt(hex.substr(0, 2), 16);
  const g = Number.parseInt(hex.substr(2, 2), 16);
  const b = Number.parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds, black for light backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

// Function to randomly determine reorder status (replace with actual business logic)
const getReorderStatus = (quantity, size, variantCode) => {
  // Using a simple hash to make it consistent for the same combination
  const hash = (size + variantCode).split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const statuses = ['critical', 'reorder', 'no-reorder', 'overflow'];
  const index = Math.abs(hash) % statuses.length;

  // Add some logic based on quantity for more realistic results
  if (quantity === 0) return 'critical';
  if (quantity < 30) return Math.random() > 0.5 ? 'critical' : 'reorder';
  if (quantity > 150) return Math.random() > 0.5 ? 'overflow' : 'no-reorder';

  return statuses[index];
};

// Sample data structure with enhanced data
const sampleInventoryData = {
  productName: 'STELLERS WOMEN Plain Golf T-shirts(Nano Dry Fit)',
  variants: [
    {
      code: 'STPT MU',
      name: 'MAUVE',
      color: '#D8BFD8',
      quantities: { xs: 70, s: 0, m: 17, l: 33, xl: 69, xxl: 79, '3xl': 10 },
    },
    {
      code: 'STPTDG',
      name: 'Dark Grey',
      color: '#696969',
      quantities: { xs: 92, s: 38, m: 0, l: 0, xl: 29, xxl: 66, '3xl': 25 },
    },
    {
      code: 'STPTNB',
      name: 'Navy Blue',
      color: '#000080',
      quantities: { xs: 117, s: 30, m: 0, l: 70, xl: 123, xxl: 118, '3xl': 30 },
    },
    {
      code: 'STPT FW',
      name: 'FAWN',
      color: '#E5AA70',
      quantities: { xs: 47, s: 124, m: 36, l: 48, xl: 82, xxl: 106, '3xl': 22 },
    },
    {
      code: 'STPT TB',
      name: 'TEAL BLUE',
      color: '#008080',
      quantities: { xs: 87, s: 67, m: 27, l: 59, xl: 68, xxl: 32, '3xl': 28 },
    },
    {
      code: 'STPT-Grey',
      name: 'Grey',
      color: '#808080',
      quantities: { xs: 30, s: 19, m: 7, l: 13, xl: 32, xxl: 29, '3xl': 72 },
    },
    {
      code: 'STPT BK',
      name: 'Black',
      color: '#000000',
      quantities: { xs: 146, s: 120, m: 10, l: 38, xl: 136, xxl: 114, '3xl': 30 },
    },
    {
      code: 'STPT OG',
      name: 'Olive Green',
      color: '#808000',
      quantities: { xs: 171, s: 253, m: 117, l: 150, xl: 82, xxl: 80, '3xl': 42 },
    },
    {
      code: 'STPT AG',
      name: 'Apple Green',
      color: '#8DB600',
      quantities: { xs: 38, s: 108, m: 24, l: 20, xl: 79, xxl: 34, '3xl': 30 },
    },
    {
      code: 'STPT LP',
      name: 'Light Purple',
      color: '#DDA0DD',
      quantities: { xs: 60, s: 41, m: 41, l: 88, xl: 22, xxl: 93, '3xl': 87 },
    },
    {
      code: 'STPT RB',
      name: 'Royal Blue',
      color: '#4169E1',
      quantities: { xs: 44, s: 29, m: 0, l: 0, xl: 28, xxl: 35, '3xl': 7 },
    },
    {
      code: 'STPT WN',
      name: 'Wine',
      color: '#722F37',
      quantities: { xs: 107, s: 45, m: 51, l: 42, xl: 23, xxl: 104, '3xl': 26 },
    },
    {
      code: 'STPT RST',
      name: 'RUSSET',
      color: '#80461B',
      quantities: { xs: 81, s: 61, m: 66, l: 95, xl: 81, xxl: 69, '3xl': 62 },
    },
    {
      code: 'STPT Mustard',
      name: 'Mustard',
      color: '#FFDB58',
      quantities: { xs: 137, s: 96, m: 86, l: 107, xl: 112, xxl: 137, '3xl': 12 },
    },
    {
      code: 'STPT ICE BLUE',
      name: 'ICE BLUE',
      color: '#87CEEB',
      quantities: { xs: 62, s: 30, m: 0, l: 8, xl: 38, xxl: 71, '3xl': 16 },
    },
    {
      code: 'STPT IG',
      name: 'IG',
      color: '#355E3B',
      quantities: { xs: 23, s: 60, m: 56, l: 96, xl: 29, xxl: 58, '3xl': 76 },
    },
    {
      code: 'STPT WT',
      name: 'White',
      color: '#FFFFFF',
      quantities: { xs: 71, s: 46, m: 31, l: 28, xl: 52, xxl: 17, '3xl': 23 },
    },
    {
      code: 'STPT ESD',
      name: 'ESD',
      color: '#FF6B6B',
      quantities: { xs: 123, s: 130, m: 108, l: 135, xl: 138, xxl: 120, '3xl': 28 },
    },
    {
      code: 'STPT DB',
      name: 'DB',
      color: '#FF0000',
      quantities: { xs: 72, s: 75, m: 158, l: 192, xl: 108, xxl: 85, '3xl': 100 },
    },
    {
      code: 'STPT MLRD',
      name: 'MLRD',
      color: '#DC143C',
      quantities: { xs: 64, s: 131, m: 106, l: 133, xl: 81, xxl: 42, '3xl': 92 },
    },
    {
      code: 'STPT MN',
      name: 'MN',
      color: '#800080',
      quantities: { xs: 80, s: 114, m: 76, l: 55, xl: 26, xxl: 71, '3xl': 43 },
    },
    {
      code: 'STPT MG',
      name: 'MG',
      color: '#9932CC',
      quantities: { xs: 76, s: 11, m: 7, l: 30, xl: 65, xxl: 18, '3xl': 37 },
    },
    {
      code: 'STPT SG',
      name: 'Siemens Green',
      color: '#00A693',
      quantities: { xs: 29, s: 119, m: 81, l: 60, xl: 60, xxl: 12, '3xl': 58 },
    },
    {
      code: 'STPT Misty Green',
      name: 'Misty Green',
      color: '#7CB342',
      quantities: { xs: 91, s: 52, m: 67, l: 57, xl: 41, xxl: 95, '3xl': 17 },
    },
    {
      code: 'STPT BLACK CURRANT',
      name: 'BLACK CURRANT',
      color: '#2F1B14',
      quantities: { xs: 137, s: 106, m: 36, l: 114, xl: 91, xxl: 140, '3xl': 13 },
    },
    {
      code: 'STPT TG',
      name: 'TEAL GREEN',
      color: '#008B8B',
      quantities: { xs: 3, s: 9, m: 0, l: 0, xl: 0, xxl: 0, '3xl': 19 },
    },
  ],
};

const StockInventory = () => {
  
const userType = useSelector(selectCurrentUserType);

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: `/${userType}/inventory`, title: 'Inventory' },
  { title: 'Stock Inventory' },
];
  const [inventoryData, setInventoryData] = useState(sampleInventoryData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sizes = ['xs', 's', 'm', 'l', 'xl', 'xxl', '3xl'];

  // Calculate totals for each variant
  const calculateVariantTotal = (quantities) => {
    return sizes.reduce((total, size) => total + (quantities[size] || 0), 0);
  };

  // Calculate totals for each size across all variants
  const calculateSizeTotal = (size) => {
    return inventoryData.variants.reduce(
      (total, variant) => total + (variant.quantities[size] || 0),
      0,
    );
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return inventoryData.variants.reduce(
      (total, variant) => total + calculateVariantTotal(variant.quantities),
      0,
    );
  };

  // Filter variants based on search term
  const filteredVariants = inventoryData.variants.filter(
    (variant) =>
      variant.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <PageContainer
      title="Stock Inventory"
      description="View detailed stock inventory by product variants"
    >
      <Breadcrumb title="Stock Inventory" items={BCrumb} />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {/* Legend */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ mr: 2 }}>
            Reorder Status Legend:
          </Typography>
          <Chip
            label="Critical"
            sx={{
              backgroundColor: REORDER_COLORS.critical,
              color: getTextColor(REORDER_COLORS.critical),
              fontWeight: 'bold',
            }}
          />
          <Chip
            label="Reorder"
            sx={{
              backgroundColor: REORDER_COLORS.reorder,
              color: getTextColor(REORDER_COLORS.reorder),
              fontWeight: 'bold',
            }}
          />
          <Chip
            label="No Reorder"
            sx={{
              backgroundColor: REORDER_COLORS['no-reorder'],
              color: getTextColor(REORDER_COLORS['no-reorder']),
              fontWeight: 'bold',
            }}
          />
          <Chip
            label="Overflow"
            sx={{
              backgroundColor: REORDER_COLORS.overflow,
              color: getTextColor(REORDER_COLORS.overflow),
              fontWeight: 'bold',
            }}
          />
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search Variants"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code or name..."
            sx={{ minWidth: 300 }}
          />
          <Button variant="contained" onClick={() => setSearchTerm('')}>
            Clear
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflow: 'auto' }}>
            <Table stickyHeader size="small">
              {/* Product Header */}
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={filteredVariants.length + 2}
                    sx={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      backgroundColor: '#f5f5f5',
                      border: '2px solid #000',
                      position: 'sticky',
                      top: 0,
                      zIndex: 3,
                    }}
                  >
                    {inventoryData.productName}
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* Column Headers */}
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#e0e0e0',
                      border: '1px solid #000',
                      minWidth: 80,
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      top: 48,
                    }}
                  >
                    SIZE
                  </TableCell>
                  {filteredVariants.map((variant) => (
                    <TableCell
                      key={variant.code}
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: variant.color,
                        color:
                          variant.color === '#000000' || variant.color === '#2F1B14'
                            ? '#fff'
                            : '#000',
                        border: '1px solid #000',
                        minWidth: 80,
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        padding: '4px',
                        position: 'sticky',
                        top: 48,
                        zIndex: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                          {variant.code}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                          {variant.name}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#e0e0e0',
                      border: '1px solid #000',
                      textAlign: 'center',
                      position: 'sticky',
                      right: 0,
                      zIndex: 2,
                      top: 48,
                    }}
                  >
                    TOTAL
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* Size Rows */}
              <TableBody>
                {sizes.map((size, index) => (
                  <TableRow
                    key={size}
                    sx={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#e0e0e0',
                        border: '1px solid #000',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      {size.toUpperCase()}
                    </TableCell>
                    {filteredVariants.map((variant) => {
                      const quantity = variant.quantities[size] || 0;
                      const reorderStatus = getReorderStatus(quantity, size, variant.code);
                      const backgroundColor = REORDER_COLORS[reorderStatus];
                      const textColor = getTextColor(backgroundColor);

                      return (
                        <TableCell
                          key={`${size}-${variant.code}`}
                          sx={{
                            border: '1px solid #000',
                            textAlign: 'center',
                            backgroundColor: backgroundColor,
                            fontWeight: 'bold',
                            position: 'relative',
                          }}
                        >
                          <Typography
                            sx={{
                              color: textColor,
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                            }}
                          >
                            {quantity}
                          </Typography>
                        </TableCell>
                      );
                    })}
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: '#e0e0e0',
                        border: '1px solid #000',
                        textAlign: 'center',
                        position: 'sticky',
                        right: 0,
                        zIndex: 1,
                      }}
                    >
                      {calculateSizeTotal(size)}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Total Row */}
                <TableRow sx={{ backgroundColor: '#d0d0d0' }}>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#c0c0c0',
                      border: '2px solid #000',
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                    }}
                  >
                    TOTAL
                  </TableCell>
                  {filteredVariants.map((variant) => {
                    const totalQuantity = calculateVariantTotal(variant.quantities);
                    const reorderStatus = getReorderStatus(totalQuantity, 'total', variant.code);
                    const backgroundColor = REORDER_COLORS[reorderStatus];
                    const textColor = getTextColor(backgroundColor);

                    return (
                      <TableCell
                        key={`total-${variant.code}`}
                        sx={{
                          border: '2px solid #000',
                          textAlign: 'center',
                          backgroundColor: backgroundColor,
                          fontWeight: 'bold',
                          fontSize: '1rem',
                        }}
                      >
                        <Typography
                          sx={{
                            color: textColor,
                            fontWeight: 'bold',
                            fontSize: '1rem',
                          }}
                        >
                          {totalQuantity}
                        </Typography>
                      </TableCell>
                    );
                  })}
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: '#c0c0c0',
                      border: '2px solid #000',
                      textAlign: 'center',
                      fontSize: '1.1rem',
                      position: 'sticky',
                      right: 0,
                      zIndex: 1,
                    }}
                  >
                    {calculateGrandTotal()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Summary Information */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Total Variants: {filteredVariants.length} / {inventoryData.variants.length}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Grand Total: {calculateGrandTotal()} units
          </Typography>
        </Box>
      </Paper>
    </PageContainer>
  );
};

export default StockInventory;
