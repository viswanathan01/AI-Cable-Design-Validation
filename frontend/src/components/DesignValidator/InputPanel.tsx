'use client';

import React from 'react';
import { Box, TextField, Button, Typography, Paper, Tab, Tabs } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface InputPanelProps {
    onValidate: (data: any) => void;
    loading: boolean;
    initialData?: any;
}

export default function InputPanel({ onValidate, loading, initialData }: InputPanelProps) {
    const [tabIndex, setTabIndex] = React.useState(0);
    const [freeText, setFreeText] = React.useState('');
    const [structured, setStructured] = React.useState({
        voltage: '',
        conductor: '',
        insulation: '',
        standard: 'IEC 60502-1'
    });

    React.useEffect(() => {
        if (initialData) {
            if (initialData.structuredData) {
                setTabIndex(0);
                setStructured(initialData.structuredData);
            } else if (initialData.freeText) {
                setTabIndex(1);
                setFreeText(initialData.freeText);
            }
        }
    }, [initialData]);

    const handleStructuredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStructured({ ...structured, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (tabIndex === 0) {
            onValidate({ structuredData: structured });
        } else {
            onValidate({ freeText });
        }
    };

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
                Design Inputs
            </Typography>

            <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} sx={{ mb: 2 }}>
                <Tab label="Structured" />
                <Tab label="Free Text" />
            </Tabs>

            {tabIndex === 0 ? (
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Standard"
                        name="standard"
                        value={structured.standard}
                        onChange={handleStructuredChange}
                        fullWidth variant="outlined"
                    />
                    <TextField
                        label="Voltage Rating"
                        name="voltage"
                        value={structured.voltage}
                        onChange={handleStructuredChange}
                        placeholder="e.g. 0.6/1 kV"
                        fullWidth
                    />
                    <TextField
                        label="Conductor"
                        name="conductor"
                        value={structured.conductor}
                        onChange={handleStructuredChange}
                        placeholder="e.g. Copper 240mm2 Class 2"
                        fullWidth
                    />
                    <TextField
                        label="Insulation"
                        name="insulation"
                        value={structured.insulation}
                        onChange={handleStructuredChange}
                        placeholder="e.g. XLPE"
                        fullWidth
                    />
                </Box>
            ) : (
                <TextField
                    multiline
                    rows={6}
                    fullWidth
                    placeholder="Paste full cable description here (e.g. '3x240+120 mm2 Cu XLPE/PVC 0.6/1kV IEC 60502-1')"
                    value={freeText}
                    onChange={(e) => setFreeText(e.target.value)}
                />
            )}

            <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                    size="large"
                >
                    {loading ? 'Validating...' : 'Validate Design'}
                </Button>
            </Box>
        </Paper>
    );
}
