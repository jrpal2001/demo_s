import { useState } from 'react';
import Modal from 'react-modal';
import {
  Box,
  Typography,
  Button,
  TextField,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from '@mui/material';
import { updateTiming } from '@/api/admin';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');

const TimingPageModal = ({
  isOpen,
  onClose,
  department,
  data,
  jobCardNo,
  workorderId,
  onUpdateTimingData,
}) => {
  console.log('TimingPageModal rendered', isOpen);
  // Always use fallback values for empty data
  const [manpower, setManpower] = useState(data.manPower || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [pauseIndex, setPauseIndex] = useState(null);
  const [error, setError] = useState('');

  // For Pause/Resume
  const pauseResumePairs = Array.isArray(data.pauseResumePairs) ? data.pauseResumePairs : [];

  // Handlers
  const handleConfirm = (action, index = null) => {
    setConfirmAction(action);
    setPauseIndex(index);
    setShowConfirm(true);
  };

  const handleConfirmAction = async () => {
    setShowConfirm(false);
    if (confirmAction === 'start') {
      if (!manpower) {
        setError('Manpower is required before starting');
        return;
      }
      setError('');
      await handleStart();
    } else if (confirmAction === 'finish') {
      await handleFinish();
    } else if (confirmAction === 'pause') {
      await handlePause();
    } else if (confirmAction === 'resume') {
      await handleResume(pauseIndex);
    }
  };

  // API actions
  const handleStart = async () => {
    if (!data.startTime) {
      const newData = { ...data, startTime: new Date(), manPower: manpower };
      try {
        const response = await updateTiming({
          workorderId,
          jobCardNo,
          department,
          action: 'start',
          manpower,
        });
        if (response.status === 200) onUpdateTimingData(newData);
      } catch (err) {
        /* handle error */
      }
    }
  };
  const handleFinish = async () => {
    if (!data.finishTime) {
      const newData = { ...data, finishTime: new Date() };
      try {
        const response = await updateTiming({ workorderId, jobCardNo, department, action: 'stop' });
        if (response.status === 200) onUpdateTimingData(newData);
      } catch (err) {
        /* handle error */
      }
    }
  };
  const handlePause = async () => {
    // Add a new pause entry
    const updatedPairs = [...pauseResumePairs, { pausedAt: new Date(), resumedAt: null }];
    const newData = { ...data, pauseResumePairs: updatedPairs };
    try {
      const response = await updateTiming({ jobCardNo, department, action: 'pause' });
      if (response.status === 200) onUpdateTimingData(newData);
    } catch (err) {
      /* handle error */
    }
  };
  const handleResume = async (index) => {
    // Set resumedAt for the given index
    const updatedPairs = pauseResumePairs.map((pair, i) =>
      i === index ? { ...pair, resumedAt: new Date() } : pair,
    );
    const newData = { ...data, pauseResumePairs: updatedPairs };
    try {
      const response = await updateTiming({ jobCardNo, department, action: 'resume' });
      if (response.status === 200) onUpdateTimingData(newData);
    } catch (err) {
      /* handle error */
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Timing Page Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <style>{`
        .overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: rgba(0, 0, 0, 0.5); z-index: 9999;
          display: flex; justify-content: center; align-items: center;
        }
        .modal {
          background-color: #fff; border-radius: 8px; padding: 24px;
          max-width: 480px; width: 100%; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
          position: relative; z-index: 10000;
        }
      `}</style>
      <Typography variant="h5" mb={2}>
        {department?.toUpperCase()} Timing
      </Typography>
      <Box mb={2}>
        <TextField
          label="Manpower"
          type="number"
          value={manpower}
          onChange={(e) => setManpower(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">Start Time</Typography>
        <Switch
          checked={!!data.startTime}
          onChange={() => handleConfirm('start')}
          disabled={!!data.startTime || !manpower}
        />
        <Typography variant="body2" color="textSecondary">
          {data.startTime ? new Date(data.startTime).toLocaleString() : 'Not Started'}
        </Typography>
      </Box>
      <Box mb={2}>
        <Typography variant="subtitle1">Pause/Resume</Typography>
        <Grid container spacing={1}>
          {pauseResumePairs.length === 0 && (
            <Grid item>
              <Button variant="outlined" color="warning" onClick={() => handleConfirm('pause')}>
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
                    onClick={() => handleConfirm('resume', idx)}
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
          onChange={() => handleConfirm('finish')}
          disabled={!!data.finishTime || !data.startTime}
        />
        <Typography variant="body2" color="textSecondary">
          {data.finishTime ? new Date(data.finishTime).toLocaleString() : 'Not Finished'}
        </Typography>
      </Box>
      <Box mt={3} display="flex" justifyContent="flex-end">
        <Button onClick={onClose} color="error" variant="outlined">
          Close
        </Button>
      </Box>
      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to {confirmAction}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary" variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Modal>
  );
};

TimingPageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  department: PropTypes.string.isRequired,
  data: PropTypes.shape({
    manPower: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startTime: PropTypes.any,
    finishTime: PropTypes.any,
    pauseResumePairs: PropTypes.array,
  }).isRequired,
  jobCardNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  workorderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onUpdateTimingData: PropTypes.func.isRequired,
};

export default TimingPageModal;
