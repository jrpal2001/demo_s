import { useState, useEffect } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { getStocks } from '@/api/stock.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

// Real subcategory options based on category
const subcategoryOptions = {
  men: [
    { value: 'nano-dry', label: 'Nano Dry' },
    { value: 'tipping-polo', label: 'Tipping Polo' },
    { value: 'wave-matrix', label: 'Wave Matrix' },
    { value: 'softberry', label: 'Softberry' },
    { value: 'pq-crush', label: 'PQ Crush' },
    { value: 'chambray', label: 'Chambray' },
    { value: 'rolex-print', label: 'Rolex Print' },
    { value: 'rolex-stripes', label: 'Rolex Stripes' },
    { value: 'pq-muffin-stripes', label: 'PQ Muffin Stripes' },
    { value: 'half-half', label: 'Half & Half' },
    { value: 't-cross', label: 'T-Cross' },
    { value: 'round-neck-superfine', label: 'Round Neck Superfine' },
    { value: 'jacquard-collar', label: 'Jacquard Collar' },
    { value: 'ant-print', label: 'Ant Print' },
    { value: 'flower-print', label: 'Flower Print' },
    { value: 'zipper-polo', label: 'Zipper polo' },
    { value: 'oversized', label: 'Oversized' },
    { value: 'hoodies', label: 'Hoodies' },
    { value: 'active-wear', label: 'Active Wear' },
    { value: 'full-sleeve', label: 'Full Sleeve' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'shorts', label: 'Shorts' },
  ],
  women: [
    { value: 'nano-dry', label: 'Nano Dry' },
    { value: 'flower-print', label: 'Flower Print' },
    { value: 'leaf-print', label: 'Leaf Print' },
    { value: 'zipper-polo', label: 'Zipper polo' },
    { value: 'stripes', label: 'Stripes' },
    { value: 'jacquard-collar', label: 'Jacquard Collar' },
    { value: 'crop-top', label: 'Crop Top' },
    { value: 'active-wear', label: 'Active Wear' },
  ],
  boys: [
    { value: 'nano-dry', label: 'Nano dry' },
    { value: 'round-neck', label: 'Round Neck' },
  ],
};

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

// Function to determine reorder status based on quantity and thresholds
const getReorderStatus = (quantity, reorderLevel, lowStockAlertLevel) => {
  if (quantity === 0 || quantity < lowStockAlertLevel) return 'critical';
  if (quantity < reorderLevel) return 'reorder';
  if (quantity > reorderLevel * 3) return 'overflow';
  return 'no-reorder';
};

// Helper function to get a hex color from a color name
const getColorHexFromName = (colorName) => {
  const colorMap = {
    Black: '#000000',
    White: '#FFFFFF',
    'Navy Blue': '#000080',
    'Royal Blue': '#4169E1',
    Red: '#FF0000',
    Green: '#008000',
    Yellow: '#FFFF00',
    Purple: '#800080',
    Grey: '#808080',
    'Dark Grey': '#696969',
    'Olive Green': '#808000',
    'Teal Blue': '#008080',
    Maroon: '#800000',
    Brown: '#A52A2A',
    MAUVE: '#D8BFD8',
    FAWN: '#E5AA70',
    'Apple Green': '#8DB600',
    'Light Purple': '#DDA0DD',
    Wine: '#722F37',
    RUSSET: '#80461B',
    Mustard: '#FFDB58',
    'ICE BLUE': '#87CEEB',
    'Siemens Green': '#00A693',
    'Misty Green': '#7CB342',
    'BLACK CURRANT': '#2F1B14',
    'TEAL GREEN': '#008B8B',
  };

  return colorMap[colorName] || '#CCCCCC';
};

const StockMatrix = () => {
  const userType = useSelector(selectCurrentUserType);


const BCrumb = [
  { to: '/', title: 'Home' },
  { to: `/${userType}/inventory`, title: 'Inventory' },
  { title: 'Stock Matrix' },
];
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [inventoryData, setInventoryData] = useState({ productName: '', variants: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sizes = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
  const availableSubcategories = selectedCategory ? subcategoryOptions[selectedCategory] || [] : [];

  // Reset subcategory when category changes
  useEffect(() => {
    setSelectedSubcategory('');
    setInventoryData({ productName: '', variants: [] });
  }, [selectedCategory]);

  const fetchStocks = async () => {
    if (!selectedSubcategory) return;

    setLoading(true);
    try {
      const response = await getStocks({
        category: selectedCategory,
        subcategory: selectedSubcategory,
        searchTerm,
        page: 1,
        pageSize: 100,
      });

      if (response?.records?.length > 0) {
        // Process the data to create variants format
        const variants = response.records.map((stock) => ({
          code: stock.skuCode,
          name: stock.color,
          color: getColorHexFromName(stock.color),
          quantities: stock.sizeSpecifications,
          reorderLevel: stock.reorderLevel,
          lowStockAlertLevel: stock.lowStockAlertLevel,
        }));

        const subcategoryLabel = subcategoryOptions[selectedCategory].find(
          (sub) => sub.value === selectedSubcategory,
        )?.label;

        setInventoryData({
          productName: `${selectedCategory.toUpperCase()} ${subcategoryLabel} ${
            searchTerm ? `- ${searchTerm}` : ''
          }`,
          variants,
        });
      } else {
        setInventoryData({ productName: '', variants: [] });
      }
    } catch (error) {
      console.error('Failed to fetch stocks:', error);
      setInventoryData({ productName: '', variants: [] });
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProducts = () => {
    fetchStocks();
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchTerm('');
    setInventoryData({ productName: '', variants: [] });
  };

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
      title="Stock Matrix"
      description="View detailed stock inventory matrix by category and subcategory"
    >
      <Breadcrumb title="Stock Matrix" items={BCrumb} />

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        {/* Filters */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="men">Men</MenuItem>
              <MenuItem value="women">Women</MenuItem>
              <MenuItem value="boys">Boys</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} disabled={!selectedCategory}>
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              label="Subcategory"
            >
              {availableSubcategories.map((subcategory) => (
                <MenuItem key={subcategory.value} value={subcategory.value}>
                  {subcategory.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={handleLoadProducts}
            disabled={!selectedSubcategory || loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={20} /> : 'Load Products'}
          </Button>

          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        {/* Legend */}
        {inventoryData.variants.length > 0 && (
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
        )}

        {/* Search Bar */}
        {inventoryData.variants.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Search Variants"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code or color..."
              sx={{ minWidth: 300 }}
            />
            <Button variant="contained" onClick={() => setSearchTerm('')}>
              Clear
            </Button>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : inventoryData.variants.length > 0 ? (
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
                      const reorderStatus = getReorderStatus(
                        quantity,
                        variant.reorderLevel || 50,
                        variant.lowStockAlertLevel || 20,
                      );
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
                    const reorderStatus = getReorderStatus(
                      totalQuantity,
                      variant.reorderLevel || 50,
                      variant.lowStockAlertLevel || 20,
                    );
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
        ) : selectedSubcategory ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              No Products Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No inventory data available for the selected filters.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Category and Subcategory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose a category and subcategory to view inventory data.
            </Typography>
          </Box>
        )}

        {/* Summary Information */}
        {inventoryData.variants.length > 0 && (
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">
              Total Variants: {filteredVariants.length} / {inventoryData.variants.length}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Grand Total: {calculateGrandTotal()} units
            </Typography>
          </Box>
        )}
      </Paper>
    </PageContainer>
  );
};

export default StockMatrix;
