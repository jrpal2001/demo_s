import React from 'react';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ProcessCompletionComponent = ({ processCompletion }) => {
  // Provide default values for fields
  const completedBy = processCompletion?.completedBy || 'Not Completed';
  const completionTimestamp = processCompletion?.completionTimestamp || 'Not Completed';
  const handoverTo = processCompletion?.handoverTo || 'Not Handed Over';

  // Format the completion timestamp if available
  const formattedCompletionTime =
    completionTimestamp !== 'Not Completed'
      ? new Date(completionTimestamp).toLocaleString() // Convert timestamp to readable string
      : 'Not Completed';

  return (
    <>
      <Typography>Completed By: {completedBy}</Typography>
      <Typography>Completion Time: {formattedCompletionTime}</Typography>
      <Typography>Handed Over To: {handoverTo}</Typography>
    </>
  );
};

ProcessCompletionComponent.propTypes = {
  processCompletion: PropTypes.shape({
    completedBy: PropTypes.string,
    completionTimestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    handoverTo: PropTypes.string,
  }),
};

export default ProcessCompletionComponent;
