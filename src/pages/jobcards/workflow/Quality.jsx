import React from 'react';
import { Typography } from '@mui/material';

const QualityComponent = ({ quality }) => {
  // Provide default values for fields
  const inspectionDetails = quality?.inspectionDetails || 'No details';
  const qualityRating = quality?.qualityRating || 'Not Rated';
  const issuesFound = quality?.issuesFound || [];
  const rectified = quality?.rectified ?? false; // Use false as default if rectified is null or undefined

  return (
    <>
      <Typography>Inspection Details: {inspectionDetails}</Typography>
      <Typography>Quality Rating: {qualityRating}</Typography>
      {issuesFound.length > 0 ? (
        <div>
          {issuesFound.map((issue, index) => (
            <Typography key={index}>Issue: {issue}</Typography>
          ))}
        </div>
      ) : (
        <Typography>No issues found</Typography>
      )}
      <Typography>Rectified: {rectified ? 'Yes' : 'No'}</Typography>
    </>
  );
};

export default QualityComponent;
