import PageContainer from "@/components/container/PageContainer";
import ParentCard from "@/components/shared/ParentCard";
import Breadcrumb from "@/layouts/full/shared/breadcrumb/Breadcrumb";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";

const BCrumb = [
    { to: '/fabric/dashboard', title: 'Home' },
    { title: 'Inventory' }
];

const rows = [
    { id: 1, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 2, slno: 2, pin: 'abc', details: "baba", quantity: 1 },
    { id: 3, slno: 3, pin: 'abc', details: "baba", quantity: 1 },
    { id: 4, slno: 4, pin: 'abc', details: "baba", quantity: 1 },
    { id: 5, slno: 5, pin: 'abc', details: "baba", quantity: 1 },
    { id: 6, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 7, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 8, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 9, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 10, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 11, slno: 1, pin: 'abc', details: "baba", quantity: 1 },
    { id: 12, slno: 12, pin: 'abc', details: "baba", quantity: 1 },
]
const columns = [
    { id: 1, field: 'slno', headerName: 'SL NO.', },
    { id: 2, field: 'pin', headerName: 'PIN', minWidth: 150, flex: 1, },
    { id: 3, field: 'details', headerName: 'DETAILS', minWidth: 150, flex: 1, },
    { id: 4, field: 'quantity', headerName: 'QUANTITY', minWidth: 150, flex: 1, },
];
const Inventory = () => {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

    return (
        <PageContainer title="Samurai Fabrics - Inventory" >
            <Breadcrumb title="Inventory" items={BCrumb} />
            <ParentCard title="Fabric Inventory" sx={{ position: 'relative' }}>
                <Button
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        zIndex: 1,
                        backgroundColor: 'blue'
                    }}
                >
                    jihif
                </Button>
                <Box sx={{ overflowX: 'auto' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pagination
                        paginationMode="server"
                        paginationModel={paginationModel}
                        pageSizeOptions={[5, 10, 20]}
                        rowCount={rows.length}
                    />
                </Box>
            </ParentCard>
        </PageContainer>
    )
}

export default Inventory;
