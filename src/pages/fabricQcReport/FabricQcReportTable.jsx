import { useEffect, useState } from 'react';
import { Box, Button, Fab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import { toast } from 'react-toastify';
import { fetchFabricQcReportsData, deleteFabricQcReport } from '@/api/fabricQcReport.api';
import CustomTable from '@/components/shared/CustomTable';
import { IconEdit, IconEye } from '@tabler/icons';
import CustomDialog from '@/components/CustomDialog';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const columns = [
  {
    field: 'id',
    headerName: 'SERIAL NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'qcNo',
    headerName: 'QC NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'date',
    headerName: 'DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>
          {params.row.date ? new Date(params.row.date).toLocaleDateString() : ''}
        </Typography>
      </Box>
    ),
  },
  {
    field: 'origin',
    headerName: 'ORIGIN',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'invNo',
    headerName: 'INVOICE NO',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },
  {
    field: 'invDate',
    headerName: 'INVOICE DATE',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
    renderCell: (params) => (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>
          {params.row.invDate ? new Date(params.row.invDate).toLocaleDateString() : ''}
        </Typography>
      </Box>
    ),
  },

  {
    field: 'qcBy',
    headerName: 'QC BY',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1,
  },

  {
    field: 'qcParametersSummary',
    headerName: 'QC STATUS',
    headerAlign: 'center',
    headerClassName: 'custom-header',
    flex: 1.5,
    renderCell: (params) => {
      // Show count of accepted/rejected parameters as a quick summary
      const paramsArr = params.row.qcParameters || [];
      const accepted = paramsArr.filter((p) => p.accepted).length;
      const rejected = paramsArr.filter((p) => p.rejected).length;
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography color="success.main">Accepted: {accepted}</Typography>
          <Typography color="error.main">Rejected: {rejected}</Typography>
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

const FabricQcReportTable = () => {
  const userType = useSelector(selectCurrentUserType);
  const canEditDelete =
    userType === 'admin' ||
    userType === 'superadmin' ||
    userType === 'quality' ||
    userType === 'fabric';
  const BCrumb = [
    { to: `/${userType}/dashboard`, title: 'Home' },
    { to: `/${userType}`, title: 'Material Management' },
    { title: 'Fabric QC Reports' },
  ];

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchFabricQcReportsData(
        paginationModel.page,
        paginationModel.pageSize,
      );
      setData(response?.data || []);
      setTotalProducts(response?.totalCount || 0);
    } catch (error) {
      toast.error('Failed to fetch Fabric QC Reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [paginationModel]);

  const handleClickAdd = () => {
    navigate(`/${userType}/fabric-qc-report/create`);
  };

  const handleClickView = (id) => {
    navigate(`/${userType}/fabric-qc-report/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/fabric-qc-report/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      await deleteFabricQcReport(id);
      toast.success('Report deleted');
      fetchData();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <PageContainer
      title="Admin - Fabric QC Reports"
      description="This is the fabric QC report page"
    >
      <Breadcrumb title="Fabric QC Reports" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        {canEditDelete && (
          <Button
            sx={{ position: 'relative', zIndex: 1 }}
            onClick={handleClickAdd}
          >
            Add Report
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

export default FabricQcReportTable;
