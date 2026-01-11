import React from 'react';
import { Drawer, Box, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Alert, LinearProgress } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LabelIcon from '@mui/icons-material/Label';
import { ValidationResponse } from '@/services/api';

interface ReasoningDrawerProps {
    open: boolean;
    onClose: () => void;
    data: ValidationResponse | null;
}

export default function ReasoningDrawer({ open, onClose, data }: ReasoningDrawerProps) {
    if (!data) return null;

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: 400, p: 3, backdropFilter: 'blur(20px)', backgroundColor: 'rgba(10, 25, 41, 0.95)' }
            }}
        >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
                <PsychologyIcon fontSize="large" color="secondary" />
                <Typography variant="h5" fontWeight="bold">
                    AI Reasoning
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                CONFIDENCE SCORE
            </Typography>
            <Box display="flex" alignItems="center" gap={2} mb={4}>
                <Box flex={1}>
                    <LinearProgress
                        variant="determinate"
                        value={data.confidence.overall * 100}
                        color={data.confidence.overall > 0.8 ? "success" : "warning"}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>
                <Typography variant="h6">
                    {(data.confidence.overall * 100).toFixed(0)}%
                </Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ASSUMPTIONS MADE
            </Typography>
            <List>
                {data.assumptions.length === 0 && <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'grey.500' }}>No explicit assumptions made.</Typography>}
                {data.assumptions.map((assumption, idx) => (
                    <ListItem key={idx} alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 35 }}>
                            <LabelIcon color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={assumption} secondaryTypographyProps={{ color: 'text.secondary' }} />
                    </ListItem>
                ))}
            </List>

            <Box mt={4}>
                <Alert severity="info" variant="outlined">
                    The AI acts as an assistant. Engineering review is required for all designs marked with WARN status.
                </Alert>
            </Box>
        </Drawer>
    );
}
