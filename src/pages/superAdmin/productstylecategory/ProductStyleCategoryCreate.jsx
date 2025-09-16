import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid, Typography, TextField, Paper } from '@mui/material';
import ParentCard from '@/components/shared/ParentCard';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { createProductStyleCategory } from '@/api/productstylecategory.api';
import { toast } from 'react-toastify';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ProductStyleCategoryCreate = () => {
  const initialState = {
    ageGroup: '',
    fashionType: '',
    season: '',
    productDetails: '',
    styleDescription: '',
    materialCareDescription: '',
    bulletPoint1: '',
    bulletPoint2: '',
    bulletPoint3: '',
    productStyleCategory: '',
    productCategory: '',
  };

  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [sizeChartFile, setSizeChartFile] = useState(null);
  const [sizeChartFileName, setSizeChartFileName] = useState('');
  const [specificationsFile, setSpecificationsFile] = useState(null);
  const [specificationsFileName, setSpecificationsFileName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChartChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSizeChartFile(file);
      setSizeChartFileName(file.name);
    }
    e.target.value = '';
  };

  const removeSizeChart = () => {
    setSizeChartFile(null);
    setSizeChartFileName('');
  };

  const handleSpecificationsChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSpecificationsFile(file);
      setSpecificationsFileName(file.name);
    }
    e.target.value = '';
  };

  const removeSpecifications = () => {
    setSpecificationsFile(null);
    setSpecificationsFileName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      if (sizeChartFile) {
        formData.append('sizeChart', sizeChartFile);
      }
      if (specificationsFile) {
        formData.append('specifications', specificationsFile);
      }
      await createProductStyleCategory(formData);
      toast.success('Product Style Category created successfully');
      navigate(`/${userType}/productstylecategory`);
    } catch (err) {
      toast.error(err.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/productstylecategory`, title: 'Product Style Category' },
    { title: 'Create' },
  ];

  return (
    <PageContainer title="Create Product Style Category" description="">
      <Breadcrumb title="Product Style Category" items={BCrumb} />
      <ParentCard title="Create Product Style Category">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            {/* Size Chart */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" mb={1}>
                Size Chart
              </Typography>
              <Button variant="outlined" component="label">
                Upload Size Chart
                <input type="file" accept=".pdf,image/*" hidden onChange={handleSizeChartChange} />
              </Button>
              {sizeChartFileName && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{sizeChartFileName}</Typography>
                  <Button size="small" color="error" onClick={removeSizeChart}>
                    Remove
                  </Button>
                </Box>
              )}
            </Grid>
            {/* Specifications */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" mb={1}>
                Specifications
              </Typography>
              <Button variant="outlined" component="label">
                Upload Specifications
                <input
                  type="file"
                  accept=".pdf,image/*"
                  hidden
                  onChange={handleSpecificationsChange}
                />
              </Button>
              {specificationsFileName && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{specificationsFileName}</Typography>
                  <Button size="small" color="error" onClick={removeSpecifications}>
                    Remove
                  </Button>
                </Box>
              )}
            </Grid>
            {/* Age Group */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Age Group"
                name="ageGroup"
                value={form.ageGroup}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Select Age Group</MenuItem>
                <MenuItem value="Kids">Kids</MenuItem>
                <MenuItem value="Adult">Adult</MenuItem>
                <MenuItem value="Senior">Senior</MenuItem>
              </TextField>
            </Grid>
            {/* Fashion Type */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Fashion Type"
                name="fashionType"
                value={form.fashionType}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Season */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Season"
                name="season"
                value={form.season}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Product Style Category */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Style Category"
                name="productStyleCategory"
                value={form.productStyleCategory}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            {/* Product Category */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Product Category"
                name="productCategory"
                value={form.productCategory}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="men">Men</MenuItem>
                <MenuItem value="women">Women</MenuItem>
                <MenuItem value="boys">Boys</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </TextField>
            </Grid>
            {/* Product Details */}
            <Grid item xs={12}>
              <TextField
                label="Product Details"
                name="productDetails"
                value={form.productDetails}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            {/* Style Description */}
            <Grid item xs={12}>
              <TextField
                label="Style Description"
                name="styleDescription"
                value={form.styleDescription}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            {/* Material Care Description */}
            <Grid item xs={12}>
              <TextField
                label="Material Care Description"
                name="materialCareDescription"
                value={form.materialCareDescription}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            {/* Bullet Points */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Bullet Point 1"
                name="bulletPoint1"
                value={form.bulletPoint1}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Bullet Point 2"
                name="bulletPoint2"
                value={form.bulletPoint2}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Bullet Point 3"
                name="bulletPoint3"
                value={form.bulletPoint3}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </ParentCard>
    </PageContainer>
  );
};

export default ProductStyleCategoryCreate;
