import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, Tab, Box, Button, Fab, Chip } from '@mui/material';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectCurrentUserType } from '@/store/auth/AuthSlice';

import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { fetchAllOutwards } from '@/api/outward.api';

const OutwardManagement = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [outwards, setOutwards] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const navigate = useNavigate();
  const userType = useSelector(selectCurrentUserType);

  // Map tab index to department name
  const departments = ['fabric', 'trims', 'accessories'];
  const currentDepartment = departments[selectedTab];

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Outward Management', to: `/${userType}/outward` },
  ];

  const handleClickView = (id) => {
    navigate(`/${userType}/outward/view/${currentDepartment}/${id}`);
  };

  const handleClickEdit = (id) => {
    navigate(`/${userType}/outward/edit/${currentDepartment}/${id}`);
  };

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPaginationModel({ page: 0, pageSize: 10 });
  };

  useEffect(() => {
    fetchOutwardData();
  }, [selectedTab, paginationModel]);

  const fetchOutwardData = async () => {
    try {
      setLoading(true);
      setOutwards([]);

      const response = await fetchAllOutwards(currentDepartment);
      console.log('🚀 ~ fetchOutwardData ~ response:', response);

      if (response) {
        // Ensure we have an array of data
        const outwardData = Array.isArray(response) ? response : [response];
        console.log('🚀 ~ fetchOutwardData ~ outwardData:', outwardData);

        if (outwardData.length === 0) {
          console.warn('No data received from API');
          setOutwards([]);
          setTotalPages(0);
          return;
        }

        // Create a simpler, flatter data structure for the table
        const flattenedData = outwardData.map((item) => {
          // Extract values from nested objects if needed
          const workOrderRefValue =
            typeof item.workOrderRef === 'object' && item.workOrderRef
              ? item.workOrderRef.workOrderId || item.workOrderRef._id || ''
              : item.workOrderRef || '';

          const jobCardRefValue =
            typeof item.workOrderRef === 'object' && item.workOrderRef
              ? item.workOrderRef.jobCardNo || ''
              : '';

          const deptWorkOrderRefValue =
            typeof item.departmentWorkOrderRef === 'object' && item.departmentWorkOrderRef
              ? item.departmentWorkOrderRef.orderNumber || item.departmentWorkOrderRef._id || ''
              : item.departmentWorkOrderRef || '';

          // Create a flat object with all needed fields
          return {
            _id: item._id,
            workOrderRef: workOrderRefValue,
            jobCardRef: jobCardRefValue,
            departmentWorkOrderRef: deptWorkOrderRefValue,
            requestedOn: item.requestedOn ? formatDate(item.requestedOn) : '-',
            itemsCount: item.items ? item.items.length : 0,
            issued: item.issued || false,
            status: item.issued ? 'Issued' : 'Pending',
            statusColor: item.issued ? 'success' : 'warning',
            issuedOn: item.issuedOn ? formatDate(item.issuedOn) : '-',
            issuedBy: item.issuedBy || '-',
          };
        });

        console.log('Flattened data for table:', flattenedData);
        setOutwards(flattenedData);
        setTotalPages(flattenedData.length || 0);
      } else {
        console.warn('No response from API');
        setOutwards([]);
        setTotalPages(0);
      }
    } catch (error) {
      toast.error(`Error fetching ${currentDepartment} outward records: ${error.message}`);
      console.error('API Error:', error);
      setOutwards([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    // Implement delete functionality or show confirmation dialog
    console.log(`Delete outward record with ID: ${id}`);
    // After confirmation, you would call an API to delete the record
    // and then refresh the data
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return '-';
    }
  };

  // Simplified column definitions that directly access the flattened data
  const getColumns = () => [
    { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
    {
      field: 'workOrderRef',
      headerName: 'WORK ORDER',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'jobCardRef',
      headerName: 'JOB CARD',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'requestedOn',
      headerName: 'REQUESTED DATE',
      flex: 1,
      minWidth: 130,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'itemsCount',
      headerName: 'ITEMS COUNT',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      type: 'number',
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 1,
      minWidth: 100,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        if (!params || !params.row) return <Chip label="Pending" color="warning" size="small" />;
        return <Chip label={params.row.status} color={params.row.statusColor} size="small" />;
      },
    },
    {
      field: 'issuedOn',
      headerName: 'ISSUED DATE',
      flex: 1,
      minWidth: 130,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'issuedBy',
      headerName: 'ISSUED BY',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => {
        if (!params || !params.row || !params.row._id) return null;

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
            <Fab color="warning" size="small">
              <IconEdit onClick={() => handleClickEdit(params.row._id)} />
            </Fab>
            <Fab color="error" size="small">
              <IconTrash onClick={() => handleDelete(params.row._id)} />
            </Fab>
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer title="Outward Management" description="Outward Management">
      <Breadcrumb title="Outward Management" items={BCrumb} />
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={selectedTab} onChange={handleChange} aria-label="outward tabs">
            <Tab label="Fabric" />
            <Tab label="Trim" />
            <Tab label="Accessories" />
          </Tabs>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {outwards.length === 0 && !loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              No outward records found for {currentDepartment}
            </Box>
          ) : null}

          <CustomTable
            rows={outwards}
            columns={getColumns()}
            totalProducts={totalPages}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            loading={loading}
            getRowId={(row) =>
              row?.id || row?._id || `temp-${Math.random().toString(36).substring(2, 9)}`
            }
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default OutwardManagement;
