/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography, Skeleton, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomDialog from '@/components/CustomDialog';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import {
  deleteProductMaster,
  fetchProductMaster,
  fetchRecentProductMasters,
} from '@/api/productmaster.api.js';
import { IconEdit, IconTrash, IconPlus, IconChevronLeft, IconChevronRight } from '@tabler/icons';
import { toast } from 'react-toastify';
import { getAllStyleCategories } from '@/api/productstylecategory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ProductMaster = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  // const canEditDelete = userType === 'admin' || userType === 'supermerchandiser';
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 12,
    page: 0,
  });
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productDeleted, setProductDeleted] = useState(false);
  // Removed unused deletionResponse state
  const [productCategory, setProductCategory] = useState('');
  const [styleCategory, setStyleCategory] = useState('');
  const [styleCategories, setStyleCategories] = useState([]);
  const [search, setSearch] = useState('');

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Product Master', to: `/${userType}/productmaster` },
  ];

  const handleClickProductCreation = () => {
    navigate(`/${userType}/productmaster/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/productmaster/edit/${id}`);
  };

  const openDeleteDialog = async (id) => {
    if (!id) {
      console.error('Invalid product ID for deletion:', id);
      toast.error('Cannot delete: Invalid product ID');
      return;
    }

    console.log('Opening delete dialog for product ID:', id);
    const response = await deleteProductMaster(id);
    console.log('Delete API response:', response);

    setProductToDelete(id);
    setDeleteDialogOpen(true);
    toast.success('Product deleted successfully');
    window.location.reload();
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) {
      toast.error('No product selected for deletion');
      handleCloseDeleteDialog();
      return;
    }

    console.log('Starting delete operation for product ID:', productToDelete);
    setIsDeleting(true);
    try {
      const loadingToastId = toast.loading('Deleting product...');
      setProductDeleted(true);
      toast.dismiss(loadingToastId);
    } catch (error) {
      console.error('Delete operation failed:', error.message);
      toast.error(`Failed to delete product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    console.log('🚀 ~ fetchData ~ Starting API call for cutting user');
    try {
      const response = await fetchProductMaster({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });

      console.log('🚀 ~ fetchData ~ API response received:', response);
      if (response) {
        console.log('API response:', response);
        setData(response.productMaster || []);
        setTotalProducts(response.dataCount || 0);
      } else {
        console.log('🚀 ~ fetchData ~ No response data received');
        setData([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('🚀 ~ fetchData ~ Error fetching product data:', error);
      console.error('🚀 ~ fetchData ~ Error details:', error.response?.data);
      toast.error('Failed to load products');
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If filters are set, fetch filtered products on page change
    if (productCategory && styleCategory) {
      fetchFilteredProducts(productCategory, styleCategory, search, paginationModel.page + 1);
    } else {
      fetchData();
    }
  }, [paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    if (productDeleted) {
      setProductDeleted(false);
      fetchData();
    }
  }, [productDeleted]);

  // Handle product category change
  const handleProductCategoryChange = async (e) => {
    const value = e.target.value;
    setProductCategory(value);
    setStyleCategory('');
    setSearch('');
    // Do not clear product data here
    if (value) {
      try {
        const styles = await getAllStyleCategories(value);
        setStyleCategories(styles || []);
      } catch {
        setStyleCategories([]);
      }
    } else {
      setStyleCategories([]);
    }
  };

  // Handle style category change
  const handleStyleCategoryChange = async (e) => {
    const value = e.target.value;
    setStyleCategory(value);
    setData([]);
    setTotalProducts(0);
    if (productCategory && value) {
      fetchFilteredProducts(productCategory, value, search, 1);
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // Always search, with whatever filters are set
    fetchFilteredProducts(productCategory, styleCategory, value, 1);
  };

  // Fetch products with filters
  const fetchFilteredProducts = async (category, style, searchValue, page) => {
    setLoading(true);
    try {
      const params = {
        page: page || 1,
        limit: paginationModel.pageSize,
        search: searchValue,
      };
      if (category) params.productCategory = category;
      if (style) params.stylecategory = style;
      const response = await fetchRecentProductMasters(params);
      console.log('🚀 ~ fetchFilteredProducts ~ response:', response);
      setData(response?.productMasters || []);
      setTotalProducts(response?.dataCount || 0);
    } catch {
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setProductCategory('');
    setStyleCategory('');
    setSearch('');
    fetchData();
  };

  const handleCardClick = (id) => {
    navigate(`/${userType}/productmaster/view/${id}`);
  };

  const canEditDelete = userType === 'admin' || userType === 'supermerchandiser';

  return (
    <PageContainer title="Admin - Product Master" description="This is the product master page">
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Breadcrumb title="Product Master" items={BCrumb} />
        </Box>

        {/* Filter Dropdowns and Search Box - Improved UI */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: '#f8fafc',
            borderRadius: 3,
            boxShadow: '0 2px 12px 0 rgba(30, 41, 59, 0.07)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            alignItems: 'flex-end',
            border: '1px solid #e2e8f0',
          }}
        >
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#2563eb', fontWeight: 600 }}>
              Product Category
            </Typography>
            <select
              value={productCategory}
              onChange={handleProductCategoryChange}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #2563eb',
                minWidth: 160,
                background: '#fff',
                color: '#1e293b',
                fontWeight: 500,
                outline: 'none',
                boxShadow: '0 1px 2px 0 #e0e7ef',
              }}
            >
              <option value="">Select Category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="boys">Boys</option>
              <option value="others">Others</option>
            </select>
          </Box>
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#2563eb', fontWeight: 600 }}>
              Style Category
            </Typography>
            <select
              value={styleCategory}
              onChange={handleStyleCategoryChange}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #2563eb',
                minWidth: 160,
                background: styleCategory ? '#f0f9ff' : '#fff',
                color: '#1e293b',
                fontWeight: 500,
                outline: 'none',
                boxShadow: '0 1px 2px 0 #e0e7ef',
              }}
              disabled={!productCategory || styleCategories.length === 0}
            >
              <option value="">Select Style</option>
              {styleCategories.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </Box>
          <Box sx={{ minWidth: 220 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#2563eb', fontWeight: 600 }}>
              Search
            </Typography>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: '2px solid #2563eb',
                minWidth: 200,
                background: search ? '#f0f9ff' : '#fff',
                color: '#1e293b',
                fontWeight: 500,
                outline: 'none',
                boxShadow: '0 1px 2px 0 #e0e7ef',
              }}
            />
          </Box>
          <Box sx={{ minWidth: 160, display: 'flex', alignItems: 'center', height: '100%' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleResetFilters}
              sx={{
                height: 44,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: '#f59e42',
                color: '#fff',
                boxShadow: '0 1px 2px 0 #e0e7ef',
                '&:hover': { bgcolor: '#ea580c' },
                ml: 2,
              }}
            >
              Reset All Filters
            </Button>
          </Box>
          {canEditDelete && (
            <Box sx={{ minWidth: 160, display: 'flex', alignItems: 'center', height: '100%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickProductCreation}
                startIcon={<IconPlus size={18} />}
                sx={{
                  height: 44,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: '#3b82f6',
                  color: '#fff',
                  boxShadow: '0 1px 2px 0 #e0e7ef',
                  fontSize: '1rem',
                  px: 2.5,
                  '&:hover': {
                    bgcolor: '#2563eb',
                  },
                }}
              >
                Add Product
              </Button>
            </Box>
          )}
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            mb: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: '#1e293b' }}>
            Product Catalog
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Showing {data.length} of {totalProducts} products
          </Typography>

          {loading ? (
            <Grid container spacing={3}>
              {Array.from(new Array(3)).map((_, index) => (
                <Grid item xs={12} md={4} key={`skeleton-${index}`}>
                  <Box sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Skeleton variant="rectangular" height={280} />
                    <Box sx={{ p: 1.5 }}>
                      <Skeleton width="80%" height={24} sx={{ mb: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Skeleton width="60%" height={18} sx={{ mb: 0.5 }} />
                          <Skeleton width="40%" height={20} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : data.length > 0 ? (
            <Grid container spacing={3}>
              {data.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                  <ProductCard
                    product={product}
                    onClick={() => handleCardClick(product._id)}
                    onEdit={() => handleClickEdit(product._id)}
                    onDelete={() => openDeleteDialog(product._id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Click &quot;Add Product&quot; to create your first product
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalProducts > paginationModel.pageSize && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 3,
                gap: 2,
                p: 2,
                borderRadius: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                disabled={paginationModel.page === 0}
                onClick={() => setPaginationModel((prev) => ({ ...prev, page: prev.page - 1 }))}
                startIcon={<IconChevronLeft size={18} />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderColor: 'transparent',
                  px: 2,
                  py: 0.8,
                  '&:hover': {
                    borderColor: 'transparent',
                    bgcolor: '#f0f9ff',
                  },
                }}
              >
                Previous
              </Button>
              <Typography variant="body1" color="text.secondary" sx={{ px: 1.5 }}>
                Page {paginationModel.page + 1} of{' '}
                {Math.ceil(totalProducts / paginationModel.pageSize)}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                disabled={(paginationModel.page + 1) * paginationModel.pageSize >= totalProducts}
                onClick={() => setPaginationModel((prev) => ({ ...prev, page: prev.page + 1 }))}
                endIcon={<IconChevronRight size={18} />}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  borderColor: '#e2e8f0',
                  px: 2,
                  py: 0.8,
                  '&:hover': {
                    borderColor: '#93c5fd',
                    bgcolor: '#f0f9ff',
                  },
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <CustomDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        title="Confirm Delete"
        content={`Are you sure you want to delete this product? This action cannot be undone. (ID: ${productToDelete})`}
        actions={
          <>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
              sx={{
                textTransform: 'none',
                px: 2,
                py: 0.8,
                color: '#64748b',
                borderRadius: '8px',
                mr: 1.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              sx={{
                textTransform: 'none',
                px: 2,
                py: 0.8,
                borderRadius: '8px',
                bgcolor: isDeleting ? '#f1f5f9' : '#ef4444',
                color: 'white',
                '&:hover': {
                  bgcolor: isDeleting ? '#f1f5f9' : '#dc2626',
                },
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </>
        }
      />
    </PageContainer>
  );
};

function ProductCard({ product, className, onClick, onEdit, onDelete }) {
  const { name, category, skuCode, images, color } = product;
  const userType = useSelector(selectCurrentUserType); // <-- add this
  console.log('🚀 ~ ProductCard ~ images:', images);
  const formattedCategory = category?.charAt(0)?.toUpperCase() + category?.slice(1);
  const imgSrc = images[0];

  // Only show edit/delete for admin and supermerchandiser
  const canEditDelete = userType === 'admin' || userType === 'supermerchandiser';

  return (
    <div
      className={`group relative rounded-lg overflow-hidden transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {/* Product Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Image Container - Full width */}
        <div className="relative w-full">
          <img
            src={imgSrc || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full aspect-[1/1.2]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/preview.webp';
            }}
          />

          {/* Edit/Delete buttons - Only visible for admin and supermerchandiser */}
          {canEditDelete && (
            <div className="absolute bottom-0 left-0 right-0 bg-white py-3 opacity-100 transition-all duration-300 flex justify-center gap-3">
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <IconEdit size={18} /> Edit
              </button>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  backgroundColor: '#0d6efd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <IconTrash size={18} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Product Details - All below the image */}
        <div className="p-3 bg-white text-center">
          {/* Category */}
          <div className="mb-1">
            <Typography variant="subtitle2" className="text-blue-600 font-medium">
              {formattedCategory || 'Category'}
            </Typography>
          </div>

          {/* Product Name */}
          <Typography variant="h5" className="font-semibold text-gray-800 line-clamp-2 mb-1">
            {name || 'Product Name'}
          </Typography>

          {/* Color */}
          <Typography variant="h6" className="text-gray-600 mb-1">
            Color: {color || 'N/A'}
          </Typography>

          {/* Description - Limited to 2 lines */}
          {/* <Typography variant="body2" className="text-gray-700 line-clamp-2 mb-2">
            {description || 'No description available'}
          </Typography> */}

          {/* Cost Information */}
          {/* <div className="flex items-center justify-center gap-2">
            <Typography variant="body2" className="text-gray-700">
              Branding Cost: ₹{product.brandingcost?.toLocaleString('en-IN') || '0'}
            </Typography>
            <span className="text-gray-400">|</span>
            <Typography variant="body2" className="text-gray-700">
              Making Cost: ₹{product.makingcost?.toLocaleString('en-IN') || '0'}
            </Typography>
          </div> */}

          {/* SKU */}
          <Typography variant="caption" className="text-gray-400 block mt-2">
            SKU: {skuCode || 'N/A'}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default ProductMaster;
