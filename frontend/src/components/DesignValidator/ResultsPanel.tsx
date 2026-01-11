
import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Chip, Paper, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { ValidationResult } from '@/services/api';

interface ResultsPanelProps {
    results: ValidationResult[];
}

const getStatusChip = (status: string) => {
    switch (status) {
        case 'PASS':
            return <Chip icon={<CheckCircleIcon />} label="PASS" color="success" variant="outlined" size="small" />;
        case 'WARN':
            return <Chip icon={<WarningIcon />} label="WARN" color="warning" variant="outlined" size="small" />;
        case 'FAIL':
            return <Chip icon={<ErrorIcon />} label="FAIL" color="error" variant="filled" size="small" />;
        default:
            return <Chip label={status} size="small" />;
    }
};

const renderText = (params: GridRenderCellParams) => (
    <Box sx={{ whiteSpace: 'normal', scale: '0.95', lineHeight: '1.4em', py: 1 }}>
        {params.value}
    </Box>
);

const columns: GridColDef[] = [
    {
        field: 'field',
        headerName: 'Attribute',
        flex: 0.8,
        minWidth: 140,
        renderCell: (params) => (
            <Typography variant="body2" fontWeight="bold" sx={{ textTransform: 'capitalize', color: 'primary.main', py: 1 }}>
                {params.value.replace(/_/g, ' ')}
            </Typography>
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 110,
        renderCell: (params: GridRenderCellParams) => (
            <Box display="flex" alignItems="center" height="100%">
                {getStatusChip(params.value)}
            </Box>
        )
    },
    {
        field: 'expected',
        headerName: 'Expected / Standard',
        flex: 1.2,
        minWidth: 180,
        renderCell: renderText
    },
    {
        field: 'comment',
        headerName: 'Engineer Comment',
        flex: 2,
        minWidth: 300,
        renderCell: renderText
    },
];

export default function ResultsPanel({ results }: ResultsPanelProps) {
    const rows = results.map((r, idx) => ({ id: idx, ...r }));

    return (
        <Paper sx={{ p: 2, minHeight: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom color="primary">
                Validation Results
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowHeight={() => 'auto'}
                autoHeight
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        alignItems: 'flex-start', // Align text to top for multi-line
                        display: 'flex',
                        paddingTop: '8px !important',
                        paddingBottom: '8px !important',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: '1px',
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    }
                }}
            />
        </Paper>
    );
}
