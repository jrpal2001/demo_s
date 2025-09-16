import { useEffect, useState } from 'react';
import { Box, Button, Fab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { deleteMaterialInwardQc, fetchMaterialInwardQcsData } from '@/api/inwardMaterialQc.api';
import CustomTable from '@/components/shared/CustomTable';
import { IconEdit, IconEye } from '@tabler/icons';
import CustomDialog from '@/components/CustomDialog';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const BCrumb = [{ to: '/', title: 'Home' }, { title: 'Material Inward QC' }];

const columns = [
  {
    field: 'id',
    headerName: 'SERIAL NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'purchaseOrderNumber',
    headerName: 'PO NUMBER',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Typography>{params.row.purchaseOrderNumber?.purchaseOrderNumber}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'indentId',
    headerName: 'INDENT ID',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography>{params.row.purchaseOrderNumber?.indentId?.indentId}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'totalAmount',
    headerName: 'TOTAL AMOUNT',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'inspectionStatus',
    headerName: 'STATUS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'inspectionRemarks',
    headerName: 'REMARKS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'inspectionDate',
    headerName: 'INSPECTED DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography>{params.row.inspectedDate?.split('T')[0]}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'actions',
    headerName: 'ACTIONS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
];

const InwardMaterialsQc = () => {
  const userType = useSelector(selectCurrentUserType);
  const canEditDelete = userType === 'admin' || userType === 'superadmin' || userType === 'fabric';
  const canViewOnly = userType === 'accounts';
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const handleClickCreate = () => {
    navigate(`/${userType}/material-inward-qc/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/material-inward-qc/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/material-inward-qc/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      const response = await deleteMaterialInwardQc(id);
      if (response) {
        toast.success(' deleted');
        fetchData();
      }
    } catch (error) {
      toast.error('Purchase order delete failed');
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetchMaterialInwardQcsData(
        paginationModel.page,
        paginationModel.pageSize,
      );
      if (response.data?.materialInwardQc?.length > 0) {
        setData(response.data.materialInwardQc);
        setTotalProducts(response.data.totalCount);
      } else {
        setData(response.data.materialInwardQc);
        setTotalProducts(response.data.totalCount);
        toast.warning(response.message);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  return (
    <PageContainer title="Admin - Material Inward QC" description="This is material inward qc page">
      <Breadcrumb title="Material Inward QC" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        {canEditDelete && (
          <Button
            sx={{ position: 'relative', zIndex: 1 }}
            onClick={handleClickCreate}
          >
            Complete Material Inward QC
          </Button>
        )}
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
                        <IconEye onClick={() => handleClickView(params.row._id)} />
                      </Fab>
                      {canEditDelete && (
                        <>
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
                        </>
                      )}
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

export default InwardMaterialsQc;
