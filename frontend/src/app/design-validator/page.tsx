'use client';

import React from 'react';
import { useAuth, UserButton, SignIn } from '@clerk/nextjs';
import InputPanel from '@/components/DesignValidator/InputPanel';
import ResultsPanel from '@/components/DesignValidator/ResultsPanel';
import AIReviewSummary from '@/components/DesignValidator/AIReviewSummary';
import ReasoningDrawer from '@/components/DesignValidator/ReasoningDrawer';
import { validateDesign, ValidationResponse, getValidationHistory, deleteHistoryItem } from '@/services/api';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogTitle, List, ListItem, ListItemText, Chip, Box, Container, Grid, Typography, Button, IconButton, CircularProgress, Paper } from '@mui/material';

export default function DesignValidatorPage() {
    const { isLoaded, userId, getToken } = useAuth();
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState<ValidationResponse | null>(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [historyOpen, setHistoryOpen] = React.useState(false);
    const [history, setHistory] = React.useState<any[]>([]);
    const [selectedHistoryItem, setSelectedHistoryItem] = React.useState<any | null>(null);
    const [loadedInput, setLoadedInput] = React.useState<any>(null);
    const [loadingMessage, setLoadingMessage] = React.useState('Analyzing Compliance...');

    // Dynamic loading messages
    React.useEffect(() => {
        if (!loading) return;
        const messages = [
            'Parsing design parameters...',
            'Checking against IEC 60502-1...',
            'Evaluating conductor plausibility...',
            'Assessing insulation adequacy...',
            'Generating engineering feedback...'
        ];
        let i = 0;
        const interval = setInterval(() => {
            setLoadingMessage(messages[i % messages.length]);
            i++;
        }, 1500);
        return () => clearInterval(interval);
    }, [loading]);

    // Initial check while Auth loads
    if (!isLoaded) return <Box display="flex" justifyContent="center" height="100vh" alignItems="center"><CircularProgress /></Box>;

    // Auth redirect
    if (!userId) return <Box display="flex" justifyContent="center" height="100vh" alignItems="center"><SignIn routing="hash" forceRedirectUrl="/design-validator" /></Box>;

    const handleValidate = async (data: any) => {
        setLoading(true);
        setResult(null);
        try {
            const token = await getToken();
            const res = await validateDesign(data, token || '');
            setResult(res);
        } catch (error) {
            console.error(error);
            alert('Validation Failed. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenHistory = async () => {
        setHistoryOpen(true);
        setSelectedHistoryItem(null); // Reset detail view
        try {
            const token = await getToken();
            const data = await getValidationHistory(token || '');
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent opening the detail view
        if (!confirm('Are you sure you want to delete this history item?')) return;

        try {
            const token = await getToken();
            await deleteHistoryItem(id, token || '');
            // Refresh local list
            setHistory(prev => prev.filter(item => item._id !== id));
            if (selectedHistoryItem?._id === id) setSelectedHistoryItem(null);
        } catch (error) {
            console.error('Failed to delete history item', error);
            alert('Failed to delete item.');
        }
    };

    const handleLoadWorkspace = (item: any) => {
        setResult(item.aiResult);
        setLoadedInput(item.inputPayload); // Pass input payload to InputPanel
        setHistoryOpen(false);
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
                    <Box display="flex" gap={2} alignItems="center">
                        {result && (
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setResult(null);
                                    setLoadedInput(null);
                                }}
                            >
                                New Validation
                            </Button>
                        )}
                        <Button startIcon={<HistoryIcon />} variant="outlined" onClick={handleOpenHistory}>
                            History
                        </Button>
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
                        <UserButton afterSignOutUrl="/" />
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <InputPanel
                            onValidate={handleValidate}
                            loading={loading}
                            initialData={loadedInput}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        {loading ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                height={300}
                                sx={{
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: 4,
                                    bgcolor: 'rgba(19, 47, 76, 0.4)'
                                }}
                            >
                                <CircularProgress size={50} thickness={4} color="secondary" />
                                <Typography mt={3} variant="h6" color="text.secondary" sx={{ animation: 'pulse 1.5s infinite' }}>
                                    {loadingMessage}
                                </Typography>
                            </Box>
                        ) : result ? (
                            <Box>
                                <AIReviewSummary data={result} />
                                <ResultsPanel results={result.validation} />
                            </Box>
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

                <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} fullWidth maxWidth="lg">
                    <DialogTitle>
                        {selectedHistoryItem ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                    onClick={() => setSelectedHistoryItem(null)}
                                    startIcon={<HistoryIcon />}
                                    size="small"
                                >
                                    Back to List
                                </Button>
                                <Typography variant="h6">Validation Details</Typography>
                            </Box>
                        ) : (
                            "Validation History"
                        )}
                    </DialogTitle>
                    <Box p={0}>
                        {selectedHistoryItem ? (
                            <Box p={2}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                                            <Box flex={1}>
                                                <Typography variant="overline" color="text.secondary">
                                                    {new Date(selectedHistoryItem.createdAt).toLocaleString()}
                                                </Typography>
                                                <Box mt={1}>
                                                    <Typography variant="subtitle2" color="primary">Original Input:</Typography>
                                                    <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'rgba(0,0,0,0.2)' }}>
                                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                                            {selectedHistoryItem.inputType === 'structured'
                                                                ? JSON.stringify(selectedHistoryItem.inputPayload.structuredData, null, 2)
                                                                : selectedHistoryItem.inputPayload.freeText
                                                            }
                                                        </Typography>
                                                    </Paper>
                                                </Box>
                                            </Box>
                                            <Box display="flex" gap={1} ml={2}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={(e) => handleDeleteHistory(selectedHistoryItem._id, e)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleLoadWorkspace(selectedHistoryItem)}
                                                >
                                                    Load into Workspace
                                                </Button>
                                            </Box>
                                        </Box>
                                        <ResultsPanel results={selectedHistoryItem.aiResult.validation} />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant="h6" mt={2} gutterBottom>AI Reasoning</Typography>
                                        <Typography variant="body2" gutterBottom>
                                            <strong>Confidence:</strong> {(selectedHistoryItem.aiResult.confidence.overall * 100).toFixed(0)}%
                                        </Typography>
                                        <Typography variant="subtitle2">Assumptions:</Typography>
                                        <List dense>
                                            {selectedHistoryItem.aiResult.assumptions?.map((a: string, i: number) => (
                                                <ListItem key={i}><ListItemText primary={a} /></ListItem>
                                            )) || <Typography variant="body2" color="text.secondary">None</Typography>}
                                        </List>
                                    </Grid>
                                </Grid>
                            </Box>
                        ) : (
                            <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                                {history.map((record: any) => (
                                    <ListItem
                                        key={record._id}
                                        divider
                                        component="div"
                                        onClick={() => setSelectedHistoryItem(record)}
                                        sx={{
                                            width: '100%',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                                        }}
                                    >
                                        <ListItemText
                                            primary={new Date(record.createdAt).toLocaleString()}
                                            secondary={`Input: ${record.inputType === 'structured' ? JSON.stringify(record.inputPayload.structuredData) : record.inputPayload.freeText}`}
                                            primaryTypographyProps={{ fontWeight: 'bold', color: 'primary.main' }}
                                            secondaryTypographyProps={{
                                                noWrap: true,
                                                sx: { maxWidth: '80%' }
                                            }}
                                        />
                                        <Box display="flex" gap={1} alignItems="center">
                                            <Chip label={`Pass: ${record.statusSummary.passCount}`} color="success" size="small" />
                                            <Chip label={`Warn: ${record.statusSummary.warnCount}`} color="warning" size="small" />
                                            <Chip label={`Fail: ${record.statusSummary.failCount}`} color="error" size="small" />
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => handleDeleteHistory(record._id, e)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                </Dialog>
            </Container >
        </Box >
    );
}
