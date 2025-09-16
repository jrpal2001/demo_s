import { Fab } from "@mui/material";
import { IconEdit, IconEye } from "@tabler/icons";

export const rows = [
    { id: 1, orderedBy: 'Snow', designation: 'Jon', email: 'abc@gmail.comm' },
    { id: 2, orderedBy: 'Lannister', designation: 'Cersei', email: 'abc@gmail.comm' },
    { id: 3, orderedBy: 'Lannister', designation: 'Jaime', email: 'abc@gmail.comm' },
    { id: 4, orderedBy: 'Stark', designation: 'Arya', email: 'abc@gmail.comm' },
    { id: 5, orderedBy: 'Targaryen', designation: 'Daenerys', email: 'abc@gmail.comm' },
    { id: 6, orderedBy: 'Melisandre', designation: null, email: 'abc@gmail.comm' },
    { id: 7, orderedBy: 'Clifford', designation: 'Ferrara', email: 'abc@gmail.comm' },
    { id: 8, orderedBy: 'Frances', designation: 'Rossini', email: 'abc@gmail.comm' },
    { id: 9, orderedBy: 'Roxie', designation: 'Harvey', email: 'abc@gmail.comm' },
];

export const columns = [
    { field: 'id', headerName: 'Sl No', width: 70, headerClassName: 'custom-header' },
    { field: 'orderedBy', headerName: 'Ordered By', width: 130, flex: 1, headerClassName: 'custom-header' },
    {
        field: 'designation',
        headerName: 'Designation',
        width: 130,
        flex: 1,
        headerClassName: 'custom-header',
    },
    {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        headerClassName: 'custom-header',
    },
    {
        field: 'phone',
        headerName: 'Phone',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        flex: 1,
        valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        headerClassName: 'custom-header',
    },
    {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        sortable: false,
        headerClassName: 'custom-header',
        renderCell: (params) => (
            <>
                <Fab
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ padding: '2px 2px', marginRight: 4 }}
                    onClick={() => console.log(`View clicked for ID ${params.id}`)}
                >
                    <IconEye size="16" />
                </Fab>
                <Fab
                    color="secondary"
                    size="small"
                    style={{ padding: '2px 6px' }}
                    onClick={() => console.log(`Edit clicked for ID ${params.id}`)}
                >
                    <IconEdit size="16" />
                </Fab>
            </>
        ),
    },
];
