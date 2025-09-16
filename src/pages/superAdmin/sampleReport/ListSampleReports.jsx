{
  ('use client');
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import { Box, Button, Typography, Tooltip, Fab, Dialog, CircularProgress } from '@mui/material';
import { IconEdit } from '@tabler/icons';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/CustomDialog';
import {
  getAllSampleReports,
  deleteSampleReport,
  getAllSampleReportsNoPagination,
} from '@/api/sampleReport.api';

// Helper function to format dates to YYYY-MM-DD
const formatIsoDate = (dateInput) => {
  if (!dateInput) return '-'; // For display, return '-'

  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    // Attempt to create a Date object from the input string
    date = new Date(dateInput);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn('Invalid date encountered for formatting:', dateInput); // Log the problematic input
    return '-'; // Return a fallback if the date is invalid
  }
  return date.toISOString().split('T')[0]; // Formats as YYYY-MM-DD
};

const ListSampleReports = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Sample Report', to: '/admin/sample-report' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllSampleReports(paginationModel.page + 1, paginationModel.pageSize);
      console.log('🚀 ~ fetchData ~ raw API response samples:', res.samples);
      setData(res.samples || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      toast.error('Failed to fetch reports');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationModel]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await deleteSampleReport(id);
        toast.success('Deleted successfully');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete report.');
      }
    }
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const handleDownloadCsv = async () => {
    setDownloading(true);
    try {
      const allSamples = await getAllSampleReportsNoPagination();
      console.log('🚀 ~ handleDownloadCsv ~ allSamples for CSV:', allSamples);

      if (!allSamples || allSamples.length === 0) {
        toast.info('No data to download.');
        setDownloading(false);
        return;
      }

      // Define the columns for CSV export, matching your provided schema.
      const csvColumns = [
        { field: 'date', header: 'Date' },
        { field: 'jobcardNo', header: 'Job Card No' },
        { field: 'salesExecutiveId', header: 'Sales Executive ID' },
        { field: 'salesExecutiveName', header: 'Sales Executive Name' },
        { field: 'customerName', header: 'Customer Name' },
        { field: 'customerCode', header: 'Customer Code' },
        { field: 'customerType', header: 'Customer Type' },
        { field: 'quantity', header: 'Quantity' },
        { field: 'amount', header: 'Amount' },
        { field: 'status', header: 'Status' },
      ];

      // Create CSV header row
      const headerRow = csvColumns.map((col) => col.header).join(',');

      // Create CSV data rows
      const csvRows = allSamples.map((row) =>
        csvColumns
          .map((col) => {
            let value = row[col.field];
            // Format date fields using the helper function for CSV
            if (col.field === 'date') {
              return formatIsoDate(value);
            }
            return `"${String(value || '').replace(/"/g, '""')}"`;
          })
          .join(','),
      );

      const csvContent = [headerRow, ...csvRows].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'sample_reports.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Sample reports downloaded successfully!');
      } else {
        toast.error('Your browser does not support downloading files directly.');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download reports.');
    } finally {
      setDownloading(false);
    }
  };

  const columns = [
    {
      field: 'id',
      headerName: 'SERIAL NUMBER',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 110,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {formatIsoDate(params.row.date)}
        </Typography>
      ),
    },
    { field: 'jobcardNo', headerName: 'Job Card No', minWidth: 120, flex: 1 },
    { field: 'salesExecutiveId', headerName: 'Sales Executive ID', minWidth: 120, flex: 1 },
    { field: 'salesExecutiveName', headerName: 'Sales Executive Name', minWidth: 140, flex: 1 },
    { field: 'customerName', headerName: 'Customer Name', minWidth: 140, flex: 1 },
    { field: 'customerCode', headerName: 'Customer Code', width: 120 },
    { field: 'customerType', headerName: 'Customer Type', width: 120 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'status', headerName: 'Status', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      align: 'center',
      minWidth: 160,
      maxWidth: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Tooltip title="View">
              <Fab color="info" size="small" onClick={() => handleOpenModal(row)}>
                <VisibilityIcon fontSize="small" />
              </Fab>
            </Tooltip>
            <Tooltip title="Edit">
              <Fab
                color="warning"
                size="small"
                onClick={() => navigate(`/admin/sample-report/edit/${row._id}`)}
              >
                <IconEdit size="16" />
              </Fab>
            </Tooltip>
            <Fab color="error" size="small">
              <CustomDialog
                title="Confirm Delete"
                icon="delete"
                handleClickDelete={() => handleDelete(row._id)}
              >
                <Typography>Are you sure you want to delete this Sample Report?</Typography>
                <Typography variant="caption" color="error">
                  This action cannot be undone.
                </Typography>
              </CustomDialog>
            </Fab>
          </Box>
        );
      },
      className: 'custom-header',
      headerClassName: 'custom-header',
    },
  ];

  return (
    <PageContainer title="Sample Reports" description="">
      <Breadcrumb title="Sample Reports" items={BCrumb} />
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadCsv}
          disabled={downloading || loading}
        >
          {downloading ? (
            <>
              <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Downloading...
            </>
          ) : (
            'Download All (CSV)'
          )}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/sample-report/create')}
        >
          + Create New
        </Button>
      </Box>
      <CustomTable
        rows={data}
        columns={columns}
        loading={loading}
        totalProducts={total}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
      {/* Details Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <Box p={3}>
          <Typography variant="h6" gutterBottom>
            Sample Report Details
          </Typography>
          {selectedReport ? (
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Typography>
                <strong>Date:</strong> {formatIsoDate(selectedReport.date)}
              </Typography>
              <Typography>
                <strong>Job Card No:</strong> {selectedReport.jobcardNo}
              </Typography>
              <Typography>
                <strong>Sales Executive ID:</strong> {selectedReport.salesExecutiveId}
              </Typography>
              <Typography>
                <strong>Sales Executive Name:</strong> {selectedReport.salesExecutiveName}
              </Typography>
              <Typography>
                <strong>Customer Name:</strong> {selectedReport.customerName}
              </Typography>
              <Typography>
                <strong>Customer Code:</strong> {selectedReport.customerCode}
              </Typography>
              <Typography>
                <strong>Customer Type:</strong> {selectedReport.customerType}
              </Typography>
              <Typography>
                <strong>Quantity:</strong> {selectedReport.quantity}
              </Typography>
              <Typography>
                <strong>Amount:</strong> {selectedReport.amount}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedReport.status}
              </Typography>
            </Box>
          ) : (
            <Typography>No data to display.</Typography>
          )}
          <Box mt={3} textAlign="right">
            <Button onClick={handleCloseModal} variant="outlined" color="primary">
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </PageContainer>
  );
};

export default ListSampleReports;
