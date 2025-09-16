import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Fab, Typography, CircularProgress } from '@mui/material';
import { IconEdit } from '@tabler/icons';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import CustomDialog from '@/components/CustomDialog';
import { getAllQuotations, deleteQuotation } from '@/api/quotation.api';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAllFinalPI } from '@/api/finalpi.api.js';
import { getAllFinalPO } from '@/api/finalpo.api.js';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

const QuotationList = () => {
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });
  const [error, setError] = useState(null);
  const [finalPiPoMap, setFinalPiPoMap] = useState({ piMap: {}, poMap: {} });

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Quotation', to: `/${userType}/quotation` },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Error';
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'SERIAL NO',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
    },
    {
      field: 'qtnNo',
      headerName: 'QUOTATION NO',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
    },
    {
      field: 'to',
      headerName: 'TO',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
    },
    {
      field: 'date',
      headerName: 'DATE',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: 'grandTotal',
      headerName: 'GRAND TOTAL',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
    },
    {
      field: 'finalPiPo',
      headerName: 'FINAL PI&PO',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => {
        const pi = finalPiPoMap.piMap[params.row._id];
        const po = finalPiPoMap.poMap[params.row._id];
        if (po && po.poFileUrl && pi) {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                height: '100%',
              }}
            >
              <CheckCircleIcon color="success" />
              <Button
                onClick={() => handleViewFinalPiPo({ piId: pi._id, poId: po._id })}
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
              >
                View
              </Button>
            </Box>
          );
        } else if (pi) {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                height: '100%',
              }}
            >
              <CheckCircleIcon color="warning" />
              <Button
                onClick={() => handleViewFinalPiPo({ piId: pi._id })}
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
              >
                View
              </Button>
              <Typography variant="caption" color="warning.main">
                No PO
              </Typography>
            </Box>
          );
        } else if (po && po.poFileUrl && !pi) {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                height: '100%',
              }}
            >
              <CheckCircleIcon color="warning" />
              <Button
                onClick={() => handleViewFinalPiPo({ poId: po._id })}
                variant="outlined"
                size="small"
                startIcon={<VisibilityIcon />}
              >
                View
              </Button>
              <Typography variant="caption" color="warning.main">
                No PI
              </Typography>
            </Box>
          );
        }
        return (
          <Button
            onClick={() => handleAddFinalPiPo(params.row._id)}
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
          >
            Add
          </Button>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      headerAlign: 'center',
      align: 'center',
      flex: 1,
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            height: '100%',
          }}
        >
          <Fab color="primary" size="small" onClick={() => handleViewQuotation(params.row._id)}>
            <VisibilityIcon />
          </Fab>
          <Fab color="warning" size="small" onClick={() => handleClickEdit(params.row._id)}>
            <IconEdit />
          </Fab>
          <Fab color="error" size="small">
            <CustomDialog
              title="Confirm Delete"
              icon="delete"
              handleClickDelete={() => handleClickDelete(params.row._id)}
            >
              <Typography>Are you sure you want to delete this quotation?</Typography>
              <Typography variant="caption" color="error">
                This action cannot be undone.
              </Typography>
            </CustomDialog>
          </Fab>
        </Box>
      ),
    },
  ];

  const handleClickCreate = () => {
    navigate(`/${userType}/quotation/create`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/quotation/edit/${id}`);
  };

  const handleClickDelete = async (id) => {
    try {
      setLoading(true);
      await deleteQuotation(id);
      fetchData();
    } catch (error) {
      setError(error.message || 'Failed to delete quotation');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFinalPiPo = (id) => {
    navigate(`/${userType}/quotation/finalpipo/create/${id}`);
  };

  const handleViewFinalPiPo = ({ piId, poId }) => {
    // Pass both IDs as params (or just one if only one exists)
    navigate(`/${userType}/quotation/finalpipo/view/${piId || 'null'}-${poId || 'null'}`);
  };

  const handleViewQuotation = (id) => {
    navigate(`/${userType}/quotation/view/${id}`);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllQuotations({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });
      if (response && response.data) {
        const mappedData = response.data.map((item, index) => ({
          ...item,
          id: index + 1 + paginationModel.page * paginationModel.pageSize,
        }));
        setData(mappedData);
        setTotalProducts(response.total || 0);
      } else {
        setData([]);
        setTotalProducts(0);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch quotations');
      setData([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinalPiPoMap = async () => {
    try {
      const [piRes, poRes] = await Promise.all([getAllFinalPI(), getAllFinalPO()]);
      const piMap = {};
      (piRes.data || []).forEach((item) => {
        const qId =
          typeof item.quotationId === 'object' && item.quotationId !== null
            ? item.quotationId._id
            : item.quotationId;
        if (qId) piMap[qId] = item;
      });
      console.log('PI Map:', piMap); // Debug log
      const poMap = {};
      (poRes.data || []).forEach((item) => {
        if (item.quotationId) poMap[item.quotationId] = item;
      });
      setFinalPiPoMap({ piMap, poMap });
    } catch (e) {
      setFinalPiPoMap({ piMap: {}, poMap: {} });
    }
  };

  useEffect(() => {
    fetchData();
    fetchFinalPiPoMap();
    // eslint-disable-next-line
  }, [paginationModel, location]);

  return (
    <PageContainer title="Admin - Quotation" description="This is the quotation page">
      <Breadcrumb title="Quotation" items={BCrumb} />
      <Box sx={{ position: 'relative' }}>
        <Button
          sx={{ position: 'relative', zIndex: 1 }}
          onClick={handleClickCreate}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Create Quotation
        </Button>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ my: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">Error: {error}</Typography>
          </Box>
        )}
        <CustomTable
          columns={columns}
          rows={data}
          loading={loading}
          totalProducts={totalProducts}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          getRowId={(row) => row._id || row.id}
        />
      </Box>
    </PageContainer>
  );
};

export default QuotationList;
