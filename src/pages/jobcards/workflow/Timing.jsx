import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

// Helper function to format ISO date strings
const formatDate = (dateString) => {
  if (!dateString) return 'Not Provided';
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) ? date.toLocaleString() : 'Invalid Date';
};

const TimingComponent = ({ timing }) => {
  // Check if timing and pauseResumePairs exist and are valid
  //   console.log('Received Timing:', timing);

  const startTime = timing?.startTime ? formatDate(timing.startTime) : 'Not Started';
  const manPower = timing?.manPower ? timing.manPower : 'no man Power';
  const pauseResumePairs = timing?.pauseResumePairs || [];
  const finishTime = timing?.finishTime ? formatDate(timing.finishTime) : 'Not Finished';

  return (
    <>
      <Typography>Start Time: {startTime}</Typography>
      <Typography>Man Power: {manPower}</Typography>
      {pauseResumePairs.length > 0 ? (
        <div>
          {pauseResumePairs.map((pair, index) => (
            <Typography key={index}>
              Paused at: {formatDate(pair.pausedAt)}, Resumed at: {formatDate(pair.resumedAt)}
            </Typography>
          ))}
        </div>
      ) : (
        <Typography>Pause/Resume Data: None</Typography>
      )}
      <Typography>Finish Time: {finishTime}</Typography>
    </>
  );
};

TimingComponent.propTypes = {
  timing: PropTypes.shape({
    startTime: PropTypes.any,
    manPower: PropTypes.any,
    pauseResumePairs: PropTypes.array,
    finishTime: PropTypes.any,
  }),
};

export default TimingComponent;
