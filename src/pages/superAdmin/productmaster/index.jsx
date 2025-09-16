import { useEffect, useState } from 'react';
import { Box, Button, Fab, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import CustomDialog from '@/components/CustomDialog';
import CustomTable from '@/components/shared/CustomTable';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { deleteProductMaster, fetchProductMaster } from '@/api/productmaster.api.js';
import { IconEdit, IconTrash } from '@tabler/icons';
import { toast } from 'react-toastify';

const ProductMaster = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const handleClickDelete = async (id) => {
    try {
      const response = await deleteProductMaster(id);
      if (response) {
        fetchData();
        toast.success('Product deleted successfully');
      }
    } catch (error) {
      toast.error('Product delete failed');
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchProductMaster({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      console.log('🚀 ~ fetchData ~ response:', response);
      if (response) {
        setData(response.productMaster);
        setTotalProducts(response.dataCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer title="Admin - Product Master" description="This is the product master page">
      <Breadcrumb title="Product Master" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'absolute', top: '0.5rem', right: '1rem', zIndex: 1 }}
          onClick={handleClickProductCreation}
        >
          Product Creation
        </Button>
        <CustomTable
          columns={columns.map((col) => {
            if (col.field === 'actions') {
              return {
                ...col,
                renderCell: (params) => {
                  return (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                      }}
                    >
                      <Fab color="primary" size="small">
                        <CustomDialog title="Image">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                            }}
                          >
                            {params?.row?.images?.map((image) => {
                              return (
                                <img
                                  key={image.id} //key
                                  src={`${import.meta.env.VITE_APP_SERVER_URL}/${image}`}
                                  alt="product-master-image"
                                  height="200px"
                                  style={{ marginBottom: '0.2rem' }}
                                />
                              );
                            })}
                          </div>
                        </CustomDialog>
                      </Fab>
                      <Fab color="warning" size="small">
                        <IconEdit onClick={() => handleClickEdit(params.row._id)} />
                      </Fab>
                      <Fab color="error" size="small">
                        <CustomDialog
                          title="Confirm Delete"
                          icon="delete"
                          handleClickDelete={() => handleClickDelete(params.row._id)}
                        ></CustomDialog>
                      </Fab>
                    </Box>
                  );
                },
              };
            } else {
              return col;
            }
          })}
          rows={data}
          loading={loading}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </PageContainer>
  );
};

export default ProductMaster;
