'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import InputPanel from '@/components/DesignValidator/InputPanel';
import ResultsPanel from '@/components/DesignValidator/ResultsPanel';
import ReasoningDrawer from '@/components/DesignValidator/ReasoningDrawer';
import { validateDesign, ValidationResponse } from '@/services/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function DesignValidatorPage() {
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<ValidationResponse | null>(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleValidate = async (data: any) => {
        setLoading(true);
        setResult(null);
        try {
            const res = await validateDesign(data);
            setResult(res);
            // Auto-open drawer if low confidence or warnings? Maybe just show chips.
            // Let's just keep it closed unless user wants to see logic.
        } catch (error) {
            console.error(error);
            alert('Validation Failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                pt: 4,
                pb: 4,
                background: 'radial-gradient(circle at 10% 20%, rgba(0, 229, 255, 0.1) 0%, rgba(10, 25, 41, 0) 40%)'
            }}
        >
            <Container maxWidth="xl">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h3" fontWeight="bold" sx={{ background: 'linear-gradient(to right, #fff, #90caf9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Cable Design Validator
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            AI-Driven Compliance Engineering
                        </Typography>
                    </Box>
                    {result && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setDrawerOpen(true)}
                            startIcon={<AutoAwesomeIcon />}
                        >
                            View AI Reasoning
                        </Button>
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputPanel onValidate={handleValidate} loading={loading} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {loading ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                height={400}
                                sx={{
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 4,
                                    bgcolor: 'rgba(19, 47, 76, 0.4)'
                                }}
                            >
                                <CircularProgress size={60} thickness={4} color="secondary" />
                                <Typography mt={2} color="text.secondary" sx={{ animation: 'pulse 1.5s infinite' }}>
                                    Analyzing Compliance...
                                </Typography>
                            </Box>
                        ) : result ? (
                            <ResultsPanel results={result.validation} />
                        ) : (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height={400}
                                sx={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 4 }}
                            >
                                <Typography color="text.secondary">
                                    Enter design parameters to begin validation
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                <ReasoningDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    data={result}
                />
            </Container>
        </Box>
    );
}
