'use client';

import React from 'react';
import { Paper, Box, Typography, Chip, LinearProgress, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { ValidationResponse } from '@/services/api';
import { motion } from 'framer-motion';

interface AIReviewSummaryProps {
    data: ValidationResponse;
}

export default function AIReviewSummary({ data }: AIReviewSummaryProps) {
    const failCount = data.validation.filter(v => v.status === 'FAIL').length;
    const warnCount = data.validation.filter(v => v.status === 'WARN').length;

    let overallStatus: 'PASS' | 'WARN' | 'FAIL' = 'PASS';
    let statusColor: 'success' | 'warning' | 'error' = 'success';
    let summaryText = "Design appears compliant with specified standards.";

    if (failCount > 0) {
        overallStatus = 'FAIL';
        statusColor = 'error';
        summaryText = `Critical issues detected. ${failCount} attributes failed validation against the standard.`;
    } else if (warnCount > 0) {
        overallStatus = 'WARN';
        statusColor = 'warning';
        summaryText = `Design is acceptable but contains ${warnCount} warnings that require engineering review.`;
    }

    const confidencePercent = Math.round(data.confidence.overall * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 3,
                    background: overallStatus === 'FAIL'
                        ? 'linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(10, 25, 41, 1) 100%)'
                        : overallStatus === 'WARN'
                            ? 'linear-gradient(135deg, rgba(237, 108, 2, 0.1) 0%, rgba(10, 25, 41, 1) 100%)'
                            : 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(10, 25, 41, 1) 100%)',
                    borderLeft: `6px solid ${overallStatus === 'FAIL' ? '#d32f2f' : overallStatus === 'WARN' ? '#ed6c02' : '#2e7d32'
                        }`
                }}
            >
                <Grid container spacing={3} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Typography variant="overline" color="text.secondary" fontWeight="bold" letterSpacing={1.5}>
                                AI VALIDATION VERDICT
                            </Typography>
                            <Chip
                                label={overallStatus}
                                color={statusColor}
                                variant="filled"
                                icon={
                                    overallStatus === 'PASS' ? <CheckCircleIcon /> :
                                        overallStatus === 'WARN' ? <WarningIcon /> : <ErrorIcon />
                                }
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>
                        <Typography variant="h5" fontWeight="500" gutterBottom>
                            {summaryText}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            The system has analyzed {data.validation.length} parameters against International Standards (IEC 60502-1).
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                            <Box display="flex" justifyItems="space-between" justifyContent="space-between" mb={1}>
                                <Typography variant="caption" color="text.secondary">
                                    AI CONFIDENCE
                                </Typography>
                                <Typography variant="caption" fontWeight="bold" color={
                                    confidencePercent > 80 ? 'success.main' : confidencePercent > 50 ? 'warning.main' : 'error.main'
                                }>
                                    {confidencePercent}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={confidencePercent}
                                color={confidencePercent > 80 ? 'success' : 'warning'}
                                sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)' }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                                Based on model certainty & data extraction quality
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </motion.div>
    );
}
