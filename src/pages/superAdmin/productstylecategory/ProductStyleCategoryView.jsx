import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '@/components/shared/ParentCard';
import { getProductStyleCategoryById } from '@/api/productstylecategory.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const ProductStyleCategoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getProductStyleCategoryById(id);
        console.log('🚀 ~ fetchData ~ res:', res);
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const BCrumb = [
    { to: '/', title: 'Home' },
    { to: `/${userType}/productstylecategory`, title: 'Product Style Category' },
    { title: 'View' },
  ];

  return (
    <PageContainer title="View Product Style Category" description="">
      <Breadcrumb title="Product Style Category" items={BCrumb} />
      <ParentCard title="Product Style Category Details">
        <Button variant="outlined" sx={{ mb: 2 }} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Paper sx={{ p: 3, mb: 2, borderRadius: 3 }} elevation={2}>
          <Grid container spacing={4} alignItems="flex-start">
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Product Style Category
                  </Typography>
                  <Typography mb={2}>{data.productStyleCategory || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Product Category
                  </Typography>
                  <Typography mb={2}>
                    {data.productCategory
                      ? data.productCategory.charAt(0).toUpperCase() + data.productCategory.slice(1)
                      : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Age Group
                  </Typography>
                  <Typography mb={2}>{data.ageGroup || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Fashion Type
                  </Typography>
                  <Typography mb={2}>{data.fashionType || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Season
                  </Typography>
                  <Typography mb={2}>{data.season || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Product Details
                  </Typography>
                  <Typography mb={2}>{data.productDetails || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Style Description
                  </Typography>
                  <Typography mb={2}>{data.styleDescription || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Material Care Description
                  </Typography>
                  <Typography mb={2}>{data.materialCareDescription || '-'}</Typography>
                </Grid>
                {/* Size Chart */}
                {data.sizeChartUrl && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Size Chart
                    </Typography>
                    <Typography mb={2}>
                      <a href={data.sizeChartUrl} target="_blank" rel="noopener noreferrer">
                        View Size Chart
                      </a>
                    </Typography>
                  </Grid>
                )}
                {/* Specifications */}
                {data.specificationsUrl && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Specifications
                    </Typography>
                    <Typography mb={2}>
                      <a href={data.specificationsUrl} target="_blank" rel="noopener noreferrer">
                        View Specifications
                      </a>
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Bullet Points
                  </Typography>
                  <ul style={{ marginTop: 0, marginBottom: 0, paddingLeft: 20 }}>
                    {data.bulletPoint1 && <li>{data.bulletPoint1}</li>}
                    {data.bulletPoint2 && <li>{data.bulletPoint2}</li>}
                    {data.bulletPoint3 && <li>{data.bulletPoint3}</li>}
                  </ul>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </ParentCard>
    </PageContainer>
  );
};

export default ProductStyleCategoryView;
