import React, { useEffect, useState } from 'react';
import { Box, Button, Fab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CustomTable from '@/components/shared/CustomTable';
import { IconEdit, IconEye } from '@tabler/icons';
import CustomDialog from '@/components/CustomDialog';
import { getAllFinalQcReports, deleteFinalQcReport } from '@/api/FQCReport.api';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/components/container/PageContainer';

const FinalQcReportTable = () => {
  const userType = useSelector(selectCurrentUserType);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ pageSize: 5, page: 0 });

  const canEditDelete =
    userType === 'admin' ||
    userType === 'superadmin' ||
    userType === 'quality' ||
    userType === 'fabric';

  const BCrumb = [
    { to: `/${userType}/dashboard`, title: 'Home' },
    { to: `/${userType}`, title: 'Material Management' },
    { title: 'Final QC Reports' },
  ];

  const columns = [
    { field: 'jcNo', headerName: 'J/c No', flex: 1, headerAlign: 'center' },
    { field: 'product', headerName: 'Product', flex: 1, headerAlign: 'center' },
    {
      field: 'dateOfCommence',
      headerName: 'Date of Commence',
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
    },
    { field: 'colour', headerName: 'Colour', flex: 1, headerAlign: 'center' },
    { field: 'workOrderNo', headerName: 'Work Order No', flex: 1, headerAlign: 'center' },
    { field: 'style', headerName: 'Style', flex: 1, headerAlign: 'center' },
    { field: 'gender', headerName: 'Gender', flex: 1, headerAlign: 'center' },
    {
      field: 'receivedQtySummary',
      headerName: 'Received Qty',
      flex: 1.5,
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const received = row.receivedQty || {};
        return Object.entries(received)
          .map(([size, qty]) => `${size}: ${qty}`)
          .join(', ');
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <Fab
            color="primary"
            size="small"
            onClick={() => navigate(`/${userType}/final-qc-report/${params.row._id}`)}
          >
            <IconEye />
          </Fab>
          {canEditDelete && (
            <>
              <Fab
                color="warning"
                size="small"
                onClick={() => navigate(`/${userType}/final-qc-report/edit/${params.row._id}`)}
              >
                <IconEdit />
              </Fab>
              <Fab color="error" size="small">
                <CustomDialog
                  title="Confirm Delete"
                  icon="delete"
                  handleClickDelete={async () => {
                    try {
                      await deleteFinalQcReport(params.row._id);
                      toast.success('Report deleted');
                      fetchData();
                    } catch (error) {
                      toast.error('Delete failed');
                    }
                  }}
                />
              </Fab>
            </>
          )}
        </Box>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllFinalQcReports({
        page: paginationModel.page,
        limit: paginationModel.pageSize,
      });
      setData(response.data);
      setTotalCount(response.totalCount);
    } catch {
      toast.error('Failed to fetch Final QC Reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  return (
    <PageContainer
      title="Admin - Final QC Reports"
      description="Manage Final Quality Check Reports"
    >
      <Breadcrumb title="Final QC Reports" items={BCrumb} />
      <Box sx={{ position: 'relative', p: 3 }}>
        {canEditDelete && (
          <Button onClick={() => navigate(`/${userType}/final-qc-report/create`)} sx={{ mb: 2 }}>
            Add Final QC Report
          </Button>
        )}
        <CustomTable
          columns={columns}
          rows={data}
          loading={loading}
          totalProducts={totalCount}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
        />
      </Box>
    </PageContainer>
  );
};

export default FinalQcReportTable;
