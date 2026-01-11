'use client';

import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Chip, Paper, Typography, Box, Tooltip, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ValidationResult } from '@/services/api';

interface ResultsPanelProps {
    results: ValidationResult[];
}

const getStatusChip = (status: string) => {
    switch (status) {
        case 'PASS':
            return <Chip icon={<CheckCircleIcon />} label="PASS" color="success" variant="outlined" size="small" sx={{ fontWeight: 'bold', borderRadius: '4px' }} />;
        case 'WARN':
            return <Chip icon={<WarningIcon />} label="WARN" color="warning" variant="outlined" size="small" sx={{ fontWeight: 'bold', borderRadius: '4px' }} />;
        case 'FAIL':
            return <Chip icon={<ErrorIcon />} label="FAIL" color="error" variant="filled" size="small" sx={{ fontWeight: 'bold', borderRadius: '4px' }} />;
        default:
            return <Chip label={status} size="small" />;
    }
};

const renderText = (params: GridRenderCellParams) => (
    <Box sx={{ whiteSpace: 'normal', lineHeight: '1.5em', py: 1.5, color: 'text.primary' }}>
        {params.value}
    </Box>
);

const columns: GridColDef[] = [
    {
        field: 'field',
        headerName: 'Attribute',
        flex: 1,
        minWidth: 160,
        renderCell: (params) => (
            <Box display="flex" alignItems="center" height="100%" gap={1}>
                <Typography variant="body2" fontWeight="600" sx={{ textTransform: 'capitalize', color: 'primary.light' }}>
                    {params.value.replace(/_/g, ' ')}
                </Typography>
                <Tooltip title={`Validation logic for ${params.value.replace(/_/g, ' ')}`} arrow placement="right">
                    <InfoOutlinedIcon fontSize="inherit" color="disabled" sx={{ fontSize: 14, cursor: 'help' }} />
                </Tooltip>
            </Box>
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params: GridRenderCellParams) => (
            <Box display="flex" alignItems="center" height="100%">
                {getStatusChip(params.value)}
            </Box>
        )
    },
    {
        field: 'expected',
        headerName: 'Expected / Standard',
        flex: 1.5,
        minWidth: 200,
        renderCell: renderText
    },
    {
        field: 'comment',
        headerName: 'AI Assessment',
        flex: 2,
        minWidth: 320,
        renderCell: renderText
    },
];

export default function ResultsPanel({ results }: ResultsPanelProps) {
    const rows = results.map((r, idx) => ({ id: idx, ...r }));

    return (
        <Paper
            elevation={0}
            sx={{
                p: 0,
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <Box p={2} bgcolor="rgba(19, 47, 76, 0.4)" borderBottom="1px solid rgba(255,255,255,0.05)">
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Detailed Validation Results
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Breakdown of design parameters against IEC 60502-1 requirements
                </Typography>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                getRowHeight={() => 'auto'}
                autoHeight
                initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                    border: 'none',
                    '& .MuiDataGrid-row:nth-of-type(odd)': {
                        bgcolor: 'rgba(255, 255, 255, 0.01)',
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        alignItems: 'flex-start',
                        display: 'flex',
                        paddingTop: '12px !important',
                        paddingBottom: '12px !important',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem',
                        letterSpacing: '0.5px',
                        color: 'text.secondary',
                        borderBottom: '1px solid rgba(255,255,255,0.1)'
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04) !important',
                    },
                    // Status coloring for rows (optional, keeps it subtle)
                    '& .MuiDataGrid-cell[data-field="status"]': {
                        // specialized styles if needed
                    }
                }}
            />
        </Paper>
    );
}
