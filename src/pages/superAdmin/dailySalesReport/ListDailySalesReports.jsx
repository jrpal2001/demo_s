import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Corrected import for React Router
import {
  getAllDailySalesReports,
  deleteDailySalesReport,
  getSalesByExecutiveId,
  getSalesSummary,
} from '@/api/dailySalesReport.api';
import { getSalesExecutives } from '@/api/user.api';
import PageContainer from '@/components/container/PageContainer';
import Breadcrumb from '@/layouts/full/shared/breadcrumb/Breadcrumb';
import CustomTable from '@/components/shared/CustomTable';
import {
  Box,
  Button,
  Typography,
  Tooltip,
  Fab,
  Dialog,
  Autocomplete,
  CircularProgress,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { toast } from 'react-toastify';
import CustomDialog from '@/components/CustomDialog';
import SalesExecutiveReportView from './SalesReportView';


const ListDailySalesReports = () => {

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

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedSalesExecutive, setSelectedSalesExecutive] = useState(null);
  const [salesExecOptions, setSalesExecOptions] = useState([]);
  const [salesExecLoading, setSalesExecLoading] = useState(false);
  const [salesExecInputValue, setSalesExecInputValue] = useState('');
  const [reportData, setReportData] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportType, setReportType] = useState('yearly');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1));
  const [selectedQuarter, setSelectedQuarter] = useState('1');
  const [filterMode, setFilterMode] = useState('date');
  const navigate = useNavigate();

  const BCrumb = [
    { to: '/', title: 'Home' },
    { title: 'Daily Sales Report', to: '/admin/daily-sales-report' },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllDailySalesReports(paginationModel.page + 1, paginationModel.pageSize);
      console.log("🚀 ~ fetchData ~ res:", res)
      // Correctly access the 'reports' array and 'total' from the response structure
      setData(res.reports || []);
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
  }, [paginationModel]);

  useEffect(() => {
    const fetchSalesExecutives = async () => {
      if (salesExecInputValue.length >= 2) {
        setSalesExecLoading(true);
        try {
          const data = await getSalesExecutives({ search: salesExecInputValue });
          setSalesExecOptions(data.data);
        } catch (error) {
          console.error('Failed to fetch Sales Executives', error);
          setSalesExecOptions([]);
        } finally {
          setSalesExecLoading(false);
        }
      } else if (salesExecInputValue === '') {
        setSalesExecOptions([]);
      }
    };
    fetchSalesExecutives();
  }, [salesExecInputValue]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await deleteDailySalesReport(id);
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

  const handleOpenReportDialog = () => {
    setShowReportDialog(true);
    setSelectedSalesExecutive(null);
    setReportData([]);
    setSalesExecInputValue('');
    setSelectedYear(String(new Date().getFullYear()));
    setSelectedMonth(String(new Date().getMonth() + 1));
    setSelectedQuarter('1');
    setReportType('yearly');
    setFilterMode('date');
  };

  const handleCloseReportDialog = () => {
    setShowReportDialog(false);
    setSelectedSalesExecutive(null);
    setReportData([]);
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportData([]);
    try {
      let res;
      let fetchedData = [];
      if (filterMode === 'executive') {
        if (!selectedSalesExecutive) {
          toast.error('Please select a Sales Executive.');
          setReportLoading(false);
          return;
        }
        res = await getSalesByExecutiveId(selectedSalesExecutive.employeeId);
        fetchedData = res.data || [];
      } else {
        const params = {
          type: reportType,
          year: selectedYear,
        };
        if (reportType === 'monthly') {
          params.month = selectedMonth;
        } else if (reportType === 'quarterly') {
          params.quarter = selectedQuarter;
        }
        res = await getSalesSummary(params);
        fetchedData = res || [];
      }
      let finalReportData = fetchedData;
      if (filterMode === 'date' && selectedSalesExecutive) {
        finalReportData = fetchedData.filter(
          (report) => report.salesExecutiveId === selectedSalesExecutive.employeeId,
        );
      }
      setReportData(finalReportData);
    } catch (err) {
      console.error('Error generating report:', err);
      toast.error('Failed to fetch sales reports for the selected criteria.');
      setReportData([]);
    } finally {
      setReportLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(0, i).toLocaleString('en-US', { month: 'long' }),
  }));
  const quarters = [
    { value: '1', label: 'Q1 (Jan-Mar)' },
    { value: '2', label: 'Q2 (Apr-Jun)' },
    { value: '3', label: 'Q3 (Jul-Sep)' },
    { value: '4', label: 'Q4 (Oct-Dec)' },
  ];

  const columns = [
    {
      field: 'id', // Changed back to 'id' to match CustomTable's internal ID generation
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
    { field: 'salesExecutiveName', headerName: 'Sales Executive', minWidth: 140, flex: 1 },
    { field: 'customerName', headerName: 'Customer', minWidth: 140, flex: 1 },
    { field: 'customerCode', headerName: 'Customer Code', width: 120 },
    { field: 'customerType', headerName: 'Customer Type', width: 120 },
    { field: 'product', headerName: 'Product', minWidth: 120, flex: 1 },
    { field: 'colour', headerName: 'Colour', width: 100 },
    { field: 'quantity', headerName: 'Quantity', width: 100 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    {
      field: 'deldate',
      headerName: 'Delivery Date',
      width: 110,
      renderCell: (params) => (
        <Typography height="100%" display="flex" alignItems="center">
          {params.row.deldate ? params.row.deldate.substring(0, 10) : '-'}
        </Typography>
      ),
    },
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
                onClick={() => navigate(`/admin/daily-sales-report/edit/${row._id}`)}
              >
                <EditIcon fontSize="small" />
              </Fab>
            </Tooltip>
            <Fab color="error" size="small">
              <CustomDialog
                title="Confirm Delete"
                icon="delete"
                handleClickDelete={() => handleDelete(row._id)}
              >
                <Typography>Are you sure you want to delete this Daily Sales Report?</Typography>
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
    <PageContainer title="Daily Sales Reports" description="">
      <Breadcrumb title="Daily Sales Reports" items={BCrumb} />
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button variant="contained" color="secondary" onClick={handleOpenReportDialog}>
          Generate Reports
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/admin/daily-sales-report/create')}
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
            Daily Sales Report Details
          </Typography>
          {selectedReport ? (
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Typography>
                <strong>Date:</strong> {selectedReport.date?.substring(0, 10) || '-'}
              </Typography>
              <Typography>
                <strong>Job Card No:</strong> {selectedReport.jobcardNo}
              </Typography>
              <Typography>
                <strong>Sales Executive Name:</strong> {selectedReport.salesExecutiveName}
              </Typography>
              <Typography>
                <strong>Sales Executive ID:</strong> {selectedReport.salesExecutiveId}
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
                <strong>Product:</strong> {selectedReport.product}
              </Typography>
              <Typography>
                <strong>Colour:</strong> {selectedReport.colour}
              </Typography>
              <Typography>
                <strong>Quantity:</strong> {selectedReport.quantity}
              </Typography>
              <Typography>
                <strong>Amount:</strong> {selectedReport.amount}
              </Typography>
              <Typography>
                <strong>Delivery Date:</strong> {selectedReport.deldate?.substring(0, 10) || '-'}
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

      {/* Report Generation Dialog */}
      <Dialog open={showReportDialog} onClose={handleCloseReportDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Generate Sales Report</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Filter By</FormLabel>
                <RadioGroup
                  row
                  name="filterMode"
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                >
                  <FormControlLabel value="date" control={<Radio />} label="Date Range" />
                  <FormControlLabel value="executive" control={<Radio />} label="Sales Executive" />
                </RadioGroup>
              </FormControl>
            </Grid>
            {filterMode === 'executive' && (
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="salesExecutive-report-autocomplete"
                  options={salesExecOptions}
                  loading={salesExecLoading}
                  getOptionLabel={(option) =>
                    option.employeeId ? `${option.employeeId} - ${option.fullName}` : ''
                  }
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  value={selectedSalesExecutive}
                  onChange={(event, newValue) => setSelectedSalesExecutive(newValue)}
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === 'input') {
                      setSalesExecInputValue(newInputValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Sales Executive"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {salesExecLoading ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  sx={{ mb: 3 }}
                />
              </Grid>
            )}
            {filterMode === 'date' && (
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <FormLabel component="legend">Report Type</FormLabel>
                  <RadioGroup
                    row
                    name="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <FormControlLabel value="yearly" control={<Radio />} label="Yearly" />
                    <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
                    <FormControlLabel value="quarterly" control={<Radio />} label="Quarterly" />
                  </RadioGroup>
                </FormControl>
                <Box display="flex" gap={2}>
                  <TextField
                    select
                    label="Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    fullWidth
                    required
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </TextField>
                  {reportType === 'monthly' && (
                    <TextField
                      select
                      label="Month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      fullWidth
                      required
                    >
                      {months.map((month) => (
                        <MenuItem key={month.value} value={month.value}>
                          {month.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  {reportType === 'quarterly' && (
                    <TextField
                      select
                      label="Quarter"
                      value={selectedQuarter}
                      onChange={(e) => setSelectedQuarter(e.target.value)}
                      fullWidth
                      required
                    >
                      {quarters.map((quarter) => (
                        <MenuItem key={quarter.value} value={quarter.value}>
                          {quarter.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={reportLoading}
            >
              {reportLoading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Generating...
                </>
              ) : (
                'Generate Report'
              )}
            </Button>
          </Box>
          {reportData.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <SalesExecutiveReportView
                reportData={reportData}
                salesExecutive={selectedSalesExecutive}
                reportType={filterMode === 'date' ? reportType : 'yearly'}
                selectedYear={filterMode === 'date' ? selectedYear : undefined}
                selectedMonth={filterMode === 'date' ? selectedMonth : undefined}
                selectedQuarter={filterMode === 'date' ? selectedQuarter : undefined}
              />
            </Box>
          )}
          {reportData.length === 0 && !reportLoading && (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
              {filterMode === 'executive' && selectedSalesExecutive
                ? 'No sales reports found for the selected executive.'
                : 'No sales reports found for the selected criteria.'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReportDialog} variant="outlined" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ListDailySalesReports;
