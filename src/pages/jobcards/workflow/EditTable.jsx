import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function EditableSizeTable({ rows, columns, loading, onCellEditCommit }) {

  // Add a specific class for remarks columns
  const updatedColumns = columns.map((col) => ({
    ...col,
    disableColumnMenu: true,
    cellClassName: col.field.toLowerCase().includes('remarks') ? 'remarks-cell' : '',
    editable: true, // Make each cell editable
  }));

  const handleCellEditCommit = (params) => {
    // Pass the updated data to the parent component
    onCellEditCommit(params);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <DataGrid
        rows={rows}
        columns={updatedColumns}
        pagination={false} // Disable pagination
        loading={loading}
        disableSelectionOnClick // Disable row selection
        autoHeight // Automatically adjusts height to fit all rows
        getRowHeight={() => 'auto'} // Dynamically adjust row height
        sx={{
          border: 0,
          '& .MuiDataGrid-root': {
            overflow: 'hidden', // Prevent scrolling
          },
          '& .MuiDataGrid-virtualScroller': {
            overflow: 'hidden !important', // Ensure no scrollbars are rendered
          },
          '& .MuiDataGrid-row': {
            '&:nth-of-type(odd)': {
              backgroundColor: '#f9f9f9', // Light gray for odd rows
            },
            '&:nth-of-type(even)': {
              backgroundColor: '#ffffff', // White for even rows
            },
          },
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '2px solid #ccc', // Border for header
            fontSize: '0.9rem',
            fontWeight: 'bold',
            backgroundColor: '#f0f0f0', // Header background color
          },
          '& .MuiDataGrid-cell': {
            whiteSpace: 'normal', // Allow text wrapping
            wordWrap: 'break-word', // Break long words
            display: 'block', // Override default flex layout
            padding: '12px', // Add padding for better readability
            lineHeight: 1.5, // Adjust line height
          },
          '& .MuiDataGrid-columnHeader': {
            padding: '10px 10px', // Reduce padding in headers
          },
          '& .MuiDataGrid-cellContent': {
            fontSize: '0.8rem', // Optional: Adjust font size
          },
          '& .remarks-cell': {
            whiteSpace: 'normal', // Enable text wrapping
            wordWrap: 'break-word', // Break long words
            lineHeight: 1.5, // Optional: Adjust line height
          },
        }}
        processRowUpdate={handleCellEditCommit} // Use the processRowUpdate method for cell editing
      />
    </Paper>
  );
}
