import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { updateTiming } from '@/api/admin';
import { updateReceivedQuantities, updateSentQuantities } from '@/api/admin';
import { useNavigate, useLocation } from 'react-router-dom';
import ProcessCompletionModal from './ProcessCompletionModal';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', 'Total'];

const sizeLabel = (size) =>
  size
    .toUpperCase()
    .replace('XL', 'XL ')
    .replace('2XL', '2XL ')
    .replace('3XL', '3XL ')
    .replace('4XL', '4XL ')
    .replace('5XL', '5XL ')
    .replace(/\s+$/, '');

// Function to generate next batch number
const generateNextBatchNumber = (existingBatches, prefix = 'BT') => {
  if (!existingBatches || existingBatches.length === 0) {
    return `${prefix}001`;
  }

  const lastBatch = existingBatches[existingBatches.length - 1];
  const lastNumber = parseInt(lastBatch.batchNo.replace(prefix, ''), 10);
  const nextNumber = lastNumber + 1;
  return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
};

// Move BatchDialog outside the main component to prevent re-creation
const BatchDialog = ({
  open,
  onClose,
  title,
  form,
  setForm,
  onSubmit,
  loading,
  isReceive = true,
}) => {
  // Memoize form handlers to prevent unnecessary re-renders
  const handleBatchNoChange = useCallback(
    (e) => {
      setForm((prev) => ({ ...prev, batchNo: e.target.value }));
    },
    [setForm],
  );

  const handleUserChange = useCallback(
    (e) => {
      setForm((prev) => ({
        ...prev,
        [isReceive ? 'receivedBy' : 'sentBy']: e.target.value,
      }));
    },
    [setForm, isReceive],
  );

  const handleSentToChange = useCallback(
    (e) => {
      setForm((prev) => ({ ...prev, sentTo: e.target.value }));
    },
    [setForm],
  );

  const handleRemarksChange = useCallback(
    (e) => {
      setForm((prev) => ({ ...prev, remarks: e.target.value }));
    },
    [setForm],
  );

  const handleQuantityChange = useCallback(
    (size) => (e) => {
      setForm((prev) => {
        const newQuantities = {
          ...prev.quantities,
          [size]: e.target.value,
        };

        // Auto-calculate total
        const total = SIZES.filter((s) => s !== 'Total').reduce((sum, s) => {
          const value = parseInt(newQuantities[s] || 0);
          return sum + value;
        }, 0);

        return {
          ...prev,
          quantities: {
            ...newQuantities,
            Total: total.toString(),
          },
        };
      });
    },
    [setForm],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Batch Number"
              value={form.batchNo}
              onChange={handleBatchNoChange}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={isReceive ? 'Received By' : 'Sent By'}
              value={isReceive ? form.receivedBy : form.sentBy}
              onChange={handleUserChange}
              fullWidth
            />
          </Grid>
          {!isReceive && (
            <Grid item xs={12} md={6}>
              <TextField
                label="Sent To"
                value={form.sentTo}
                onChange={handleSentToChange}
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Remarks"
              value={form.remarks}
              onChange={handleRemarksChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quantities
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Size</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SIZES.map((size) => (
                    <TableRow key={size}>
                      <TableCell>{sizeLabel(size)}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={form.quantities[size] || ''}
                          onChange={handleQuantityChange(size)}
                          size="small"
                          inputProps={{ min: 0 }}
                          disabled={size === 'Total'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TimingPage = () => {
  const [showProcessCompletion, setShowProcessCompletion] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(false);
  const [showReceiveDialog, setShowReceiveDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [receiveForm, setReceiveForm] = useState({
    batchNo: '',
    receivedBy: '',
    remarks: '',
    quantities: {},
  });
  const [sendForm, setSendForm] = useState({
    batchNo: '',
    sentBy: '',
    sentTo: '',
    remarks: '',
    quantities: {},
  });

  const navigate = useNavigate();
  const location = useLocation();
  const {
    department,
    data = {},
    jobCardNo,
    workorderId,
    previousDepartmentData,
    departmentData,
  } = location.state || {};
  console.log('🚀 ~ TimingPage ~ departmentData:', departmentData);

  console.log('🚀 ~ TimingPage ~ previousDepartmentData:', previousDepartmentData);
  const [manpower, setManpower] = useState(data.manPower || '');
  const [workflowData, setWorkflowData] = useState(data);

  const pauseResumePairs = Array.isArray(data.pauseResumePairs) ? data.pauseResumePairs : [];

  // Helper function to get previous department name
  const getPreviousDepartmentName = () => {
    const departmentOrder = [
      'fabric',
      'cutting',
      'bitchecking',
      'recutting',
      'trims',
      'accessories',
      'embroidery',
      'printing&fusing',
      'operationpart',
      'stitching',
      'finishing',
      'fqi',
      'audit',
    ];

    const currentIndex = departmentOrder.indexOf(department);
    if (currentIndex > 0) {
      return departmentOrder[currentIndex - 1];
    }
    return 'Previous';
  };

  // Initialize batch numbers when dialogs open
  useEffect(() => {
    if (showReceiveDialog) {
      const nextBatchNo = generateNextBatchNumber(departmentData?.receivedBatches || []);
      setReceiveForm((prev) => ({ ...prev, batchNo: nextBatchNo }));
    }
  }, [showReceiveDialog, departmentData?.receivedBatches]);

  useEffect(() => {
    if (showSendDialog) {
      const nextBatchNo = generateNextBatchNumber(departmentData?.sentBatches || []);
      setSendForm((prev) => ({ ...prev, batchNo: nextBatchNo }));
    }
  }, [showSendDialog, departmentData?.sentBatches]);

  const handleStart = async () => {
    if (!data.startTime) {
      try {
        const response = await updateTiming({
          workorderId,
          jobCardNo,
          department,
          action: 'start',
          manpower,
        });
        if (response.status === 200) navigate(-1);
      } catch {
        /* intentionally empty */
      }
    }
  };

  const handleFinish = async () => {
    if (!data.finishTime) {
      try {
        const response = await updateTiming({ workorderId, jobCardNo, department, action: 'stop' });
        if (response.status === 200) navigate(-1);
      } catch {
        /* intentionally empty */
      }
    }
  };

  const handlePause = async () => {
    try {
      const response = await updateTiming({ workorderId, jobCardNo, department, action: 'pause' });
      if (response.status === 200) navigate(-1);
    } catch {
      /* intentionally empty */
    }
  };

  const handleResume = async () => {
    try {
      const response = await updateTiming({ workorderId, jobCardNo, department, action: 'resume' });
      if (response.status === 200) navigate(-1);
    } catch {
      /* intentionally empty */
    }
  };

  // Handler for confirming start
  const handleStartConfirm = async () => {
    setShowStartConfirm(false);
    await handleStart();
  };

  const handleReceiveBatch = async () => {
    setReceiveLoading(true);
    try {
      const response = await updateReceivedQuantities(
        workorderId,
        department,
        receiveForm.quantities,
        receiveForm.batchNo,
        receiveForm.receivedBy,
        receiveForm.remarks,
      );
      if (response) {
        setShowReceiveDialog(false);
        setReceiveForm({ batchNo: '', receivedBy: '', remarks: '', quantities: {} });
        // Navigate back to refresh data
        navigate(-1);
      }
    } catch (error) {
      console.error('Error receiving batch:', error);
    } finally {
      setReceiveLoading(false);
    }
  };

  const handleSendBatch = async () => {
    setSendLoading(true);
    try {
      const response = await updateSentQuantities(
        workorderId,
        department,
        sendForm.quantities,
        sendForm.batchNo,
        sendForm.sentBy,
        sendForm.sentTo,
        sendForm.remarks,
      );
      if (response) {
        setShowSendDialog(false);
        setSendForm({ batchNo: '', sentBy: '', sentTo: '', remarks: '', quantities: {} });
        // Navigate back to refresh data
        navigate(-1);
      }
    } catch (error) {
      console.error('Error sending batch:', error);
    } finally {
      setSendLoading(false);
    }
  };

  const BatchTable = ({ batches, title, type, showAddButton = true }) => {
    const batchCount = batches?.length || 0;
    const displayTitle = title ? `${title} (${batchCount})` : `(${batchCount})`;

    return (
      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography fontWeight={600}>{displayTitle}</Typography>
            {showAddButton && (
              <Tooltip
                title={!data.startTime ? 'Start work first to manage batches' : `Add ${type} batch`}
                placement="top"
              >
                <span>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      if (type === 'received') {
                        setShowReceiveDialog(true);
                      } else {
                        setShowSendDialog(true);
                      }
                    }}
                    size="small"
                    disabled={!data.startTime}
                    sx={{
                      backgroundColor: !data.startTime ? '#ccc' : 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: !data.startTime ? '#ccc' : 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: '#ccc',
                        color: '#666',
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {batches && batches.length > 0 ? (
            <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>Batch No</TableCell>
                    <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>Date</TableCell>
                    <TableCell sx={{ minWidth: 80, maxWidth: 120 }}>By</TableCell>
                    {type === 'sent' && (
                      <TableCell sx={{ minWidth: 80, maxWidth: 120 }}>To</TableCell>
                    )}
                    <TableCell sx={{ minWidth: 100, maxWidth: 150 }}>Remarks</TableCell>
                    {SIZES.map((size) => (
                      <TableCell key={size} align="center" sx={{ minWidth: 50, maxWidth: 60 }}>
                        {sizeLabel(size)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {batches.map((batch, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>{batch.batchNo}</TableCell>
                      <TableCell sx={{ minWidth: 80, maxWidth: 100 }}>
                        {new Date(
                          batch[type === 'received' ? 'receivedAt' : 'sentAt'],
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell sx={{ minWidth: 80, maxWidth: 120 }}>
                        {batch[type === 'received' ? 'receivedBy' : 'sentBy']}
                      </TableCell>
                      {type === 'sent' && (
                        <TableCell sx={{ minWidth: 80, maxWidth: 120 }}>{batch.sentTo}</TableCell>
                      )}
                      <TableCell sx={{ minWidth: 100, maxWidth: 150 }}>{batch.remarks}</TableCell>
                      {SIZES.map((size) => (
                        <TableCell key={size} align="center" sx={{ minWidth: 50, maxWidth: 60 }}>
                          {batch[size] || 0}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary">No {type} batches available.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <>
      {/* Process Completion Modal */}
      {showProcessCompletion && (
        <ProcessCompletionModal
          isOpen={showProcessCompletion}
          onClose={() => setShowProcessCompletion(false)}
          jobCardNo={jobCardNo}
          department={department}
          workorderId={workorderId}
          handleFinishToggle={handleFinish}
        />
      )}

      {/* Start Confirmation Dialog */}
      <Dialog open={showStartConfirm} onClose={() => setShowStartConfirm(false)}>
        <DialogTitle>Confirm Start</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to start?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartConfirm(false)}>Cancel</Button>
          <Button onClick={handleStartConfirm} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receive Batch Dialog */}
      <BatchDialog
        open={showReceiveDialog}
        onClose={() => setShowReceiveDialog(false)}
        title="Receive Batch"
        form={receiveForm}
        setForm={setReceiveForm}
        onSubmit={handleReceiveBatch}
        loading={receiveLoading}
        isReceive={true}
      />

      {/* Send Batch Dialog */}
      <BatchDialog
        open={showSendDialog}
        onClose={() => setShowSendDialog(false)}
        title="Send Batch"
        form={sendForm}
        setForm={setSendForm}
        onSubmit={handleSendBatch}
        loading={sendLoading}
        isReceive={false}
      />

      {/* Main Page Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" mb={3}>
          {department?.toUpperCase()} Timing
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column - Timing Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                Timing Management
              </Typography>

              <Box mb={2}>
                <TextField
                  label="Manpower"
                  type="number"
                  value={manpower}
                  onChange={(e) => setManpower(e.target.value)}
                  fullWidth
                />
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Start Time</Typography>
                <Switch
                  checked={!!data.startTime}
                  onChange={() => setShowStartConfirm(true)}
                  disabled={!!data.startTime || !manpower}
                />
                <Typography variant="body2" color="textSecondary">
                  {data.startTime ? new Date(data.startTime).toLocaleString() : 'Not Started'}
                </Typography>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Pause/Resume</Typography>
                <Grid container spacing={1}>
                  {(pauseResumePairs.length === 0 ||
                    (pauseResumePairs.length > 0 &&
                      pauseResumePairs[pauseResumePairs.length - 1].resumedAt)) && (
                    <Grid item>
                      <Button variant="outlined" color="warning" onClick={handlePause}>
                        Pause
                      </Button>
                    </Grid>
                  )}
                  {pauseResumePairs.map((pair, idx) => (
                    <Grid item xs={12} key={idx}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          Paused: {pair.pausedAt ? new Date(pair.pausedAt).toLocaleString() : 'N/A'}
                          {', '}Resumed:{' '}
                          {pair.resumedAt ? new Date(pair.resumedAt).toLocaleString() : 'N/A'}
                        </Typography>
                        {pair.resumedAt == null && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={handleResume}
                          >
                            Resume
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle1">Finish Time</Typography>
                <Switch
                  checked={!!data.finishTime}
                  onChange={() => setShowProcessCompletion(true)}
                  disabled={!!data.finishTime || !data.startTime}
                />
                <Typography variant="body2" color="textSecondary">
                  {data.finishTime ? new Date(data.finishTime).toLocaleString() : 'Not Finished'}
                </Typography>
              </Box>

              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button onClick={() => navigate(-1)} variant="outlined">
                  Back
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Batch Management */}
          {department !== 'fabric' && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Batch Management
                  {(() => {
                    const totalBatches =
                      (previousDepartmentData?.sentBatches?.length || 0) +
                      (departmentData?.receivedBatches?.length || 0) +
                      (departmentData?.sentBatches?.length || 0);
                    return totalBatches > 0 ? ` (${totalBatches})` : '';
                  })()}
                </Typography>

                {/* Previous Department Sent Batches */}
                {previousDepartmentData && (
                  <Box sx={{ mb: 3 }}>
                    <BatchTable
                      batches={previousDepartmentData?.sentBatches || []}
                      title={`Previous Department (${getPreviousDepartmentName()}) Sent`}
                      type="sent"
                      showAddButton={false}
                    />
                  </Box>
                )}

                {/* Received Batches - Only show for departments other than cutting */}
                {department !== 'cutting' && (
                  <BatchTable
                    batches={departmentData?.receivedBatches || []}
                    title="Received Batches"
                    type="received"
                  />
                )}

                {/* Sent Batches */}
                <BatchTable
                  batches={departmentData?.sentBatches || []}
                  title="Sent Batches"
                  type="sent"
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default TimingPage;
