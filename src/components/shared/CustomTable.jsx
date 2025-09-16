import * as React from 'react';
import {
  DataGrid,
  GridToolbar,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

export default function CustomTable({
  rows,
  columns,
  loading,
  totalProducts,
  paginationModel, // required
  setPaginationModel,
}) {
  const handlePageChange = (newPage) => {
    setPaginationModel(newPage);
  };

  // to remove the options from each column
  const updatedColumns = columns.map((col) => ({
    ...col,
    disableColumnMenu: true,
  }));

  const CustomToolbar = () => (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0.5rem' }}>
      {/* <GridToolbarFilterButton />
      <GridToolbarExport /> */}
    </div>
  );

  const handleFilterChange = (filterModel) => {
  };
  const pageCurrent = paginationModel.pageSize * paginationModel.page;
  
  return (
    // <Paper sx={{ height: 400, width: '100%' }}>
    //   <DataGrid
    //     rows={rows.map((item, index) => ({ id: pageCurrent + index + 1, ...item }))}
    //     columns={updatedColumns}
    //     pagination
    //     paginationMode="server"
    //     rowCount={totalProducts}
    //     paginationModel={paginationModel}
    //     onPaginationModelChange={handlePageChange}
    //     pageSizeOptions={[5, 10, 20]}
    //     onFilterModelChange={handleFilterChange}
    //     slots={{
    //       toolbar: CustomToolbar,
    //     }}
    //     sx={{
    //       border: 0,
    //       '& .custom-header': {
    //         fontSize: '0.9rem',
    //         fontWeight: 'bold',
    //         backgroundColor: '#f0f0f0',
    //         padding: '',
    //       },
    //     }}
    //     loading={loading}
    //   />
    // </Paper>
    <Paper
  sx={{
    height: 400,
    width: '100%',
    overflowX: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'visible' }, // scroll on md and below
  }}
>
  <DataGrid
    rows={rows.map((item, index) => ({ id: pageCurrent + index + 1, ...item }))}
    columns={updatedColumns}
    pagination
    paginationMode="server"
    rowCount={totalProducts}
    paginationModel={paginationModel}
    onPaginationModelChange={handlePageChange}
    pageSizeOptions={[5, 10, 20]}
    onFilterModelChange={handleFilterChange}
    slots={{
      toolbar: CustomToolbar,
    }}
    sx={{
      border: 0,
      minWidth: { xs: 600, sm: 700, md: 800 }, // force width on smaller screens so scroll kicks in
      '& .custom-header': {
        fontSize: '0.9rem',
        fontWeight: 'bold',
        backgroundColor: '#f0f0f0',
      },
    }}
    loading={loading}
  />
</Paper>

  );
}
