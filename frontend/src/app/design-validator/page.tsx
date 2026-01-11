'use client';

import React from 'react';
import { useAuth, UserButton, SignIn } from '@clerk/nextjs';
import InputPanel from '@/components/DesignValidator/InputPanel';
import ResultsPanel from '@/components/DesignValidator/ResultsPanel';
import { updateHistoryName } from '@/services/api';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Input, Tooltip } from '@mui/material';

// ... existing imports ...

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
    const [viewingHistoryId, setViewingHistoryId] = React.useState<string | null>(null);

    // Edit Name State
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editNameValue, setEditNameValue] = React.useState('');

    // ... useEffect ...

    // ... auth checks ...

    const handleValidate = async (data: any) => {
        setLoading(true);
        setResult(null);
        setViewingHistoryId(null); // Clear history view if re-validating (technically button disabled, but safely)
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

    // ... handleOpenHistory ...

    const handleUpdateName = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!editNameValue.trim()) return;

        try {
            const token = await getToken();
            await updateHistoryName(id, editNameValue, token || '');

            setHistory(prev => prev.map(item =>
                item._id === id ? { ...item, name: editNameValue } : item
            ));
            if (selectedHistoryItem?._id === id) {
                setSelectedHistoryItem((prev: any) => ({ ...prev, name: editNameValue }));
            }
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update name', error);
            alert('Failed to update name');
        }
    };

    const startEditing = (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        setEditingId(item._id);
        setEditNameValue(item.name || `Validation ${new Date(item.createdAt).toLocaleDateString()}`);
    };

    const cancelEditing = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingId(null);
    };

    const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
        // ... existing implementation ...
    };

    const handleLoadWorkspace = (item: any) => {
        setResult(item.aiResult);
        setLoadedInput(item.inputPayload);
        setViewingHistoryId(item._id); // Set view mode
        setHistoryOpen(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', pt: 4, pb: 4, background: 'radial-gradient(circle at 10% 20%, rgba(0, 229, 255, 0.1) 0%, rgba(10, 25, 41, 0) 40%)' }}>
            <Container maxWidth="xl">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        {viewingHistoryId && (
                            <Chip
                                label="Historical View"
                                color="warning"
                                size="small"
                                sx={{ mb: 1 }}
                                onDelete={() => {
                                    setResult(null);
                                    setLoadedInput(null);
                                    setViewingHistoryId(null);
                                }}
                            />
                        )}
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
                                    setViewingHistoryId(null);
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
                            viewOnly={!!viewingHistoryId}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        {loading ? (
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height={300} sx={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, bgcolor: 'rgba(19, 47, 76, 0.4)' }}>
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
                            <Box display="flex" justifyContent="center" alignItems="center" height={400} sx={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 4 }}>
                                <Typography color="text.secondary">
                                    Enter design parameters to begin validation
                                </Typography>
                            </Box>
                        )}
                    </Grid>
                </Grid>
                <ReasoningDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} data={result} />

                <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} fullWidth maxWidth="lg">
                    <DialogTitle>
                        {selectedHistoryItem ? (
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button onClick={() => setSelectedHistoryItem(null)} startIcon={<HistoryIcon />} size="small">
                                    Back to List
                                </Button>
                                <Typography variant="h6">Validation Details</Typography>
                            </Box>
                        ) : "Validation History"}
                    </DialogTitle>
                    <Box p={0}>
                        {selectedHistoryItem ? (
                            <Box p={2}>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                                            <Box flex={1}>
                                                <Typography variant="h6" color="primary">
                                                    {selectedHistoryItem.name || 'Untitled Validation'}
                                                </Typography>
                                                <Typography variant="overline" color="text.secondary">
                                                    {new Date(selectedHistoryItem.createdAt).toLocaleString()}
                                                </Typography>
                                                {/* Details Content... */}
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
                                                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={(e) => handleDeleteHistory(selectedHistoryItem._id, e)}>Delete</Button>
                                                <Button variant="contained" size="small" onClick={() => handleLoadWorkspace(selectedHistoryItem)}>Load into Workspace</Button>
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
                                        sx={{ width: '100%', cursor: 'pointer', display: 'flex', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                                        secondaryAction={
                                            <Box display="flex" gap={1} alignItems="center">
                                                <Chip label={`Pass: ${record.statusSummary.passCount}`} color="success" size="small" />
                                                <Chip label={`Warn: ${record.statusSummary.warnCount}`} color="warning" size="small" />
                                                <Chip label={`Fail: ${record.statusSummary.failCount}`} color="error" size="small" />
                                                <IconButton size="small" color="error" onClick={(e) => handleDeleteHistory(record._id, e)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        }
                                    >
                                        <Box flex={1} display="flex" flexDirection="column" pr={2}>
                                            <Box display="flex" alignItems="center" gap={1} onClick={(e) => e.stopPropagation()}>
                                                {editingId === record._id ? (
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <Input
                                                            value={editNameValue}
                                                            onChange={(e) => setEditNameValue(e.target.value)}
                                                            autoFocus
                                                            sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleUpdateName(e as any, record._id);
                                                                if (e.key === 'Escape') cancelEditing(e as any);
                                                            }}
                                                        />
                                                        <IconButton size="small" color="success" onClick={(e) => handleUpdateName(e, record._id)}><CheckIcon fontSize="small" /></IconButton>
                                                        <IconButton size="small" color="default" onClick={cancelEditing}><CloseIcon fontSize="small" /></IconButton>
                                                    </Box>
                                                ) : (
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                                                            {record.name || 'Untitled Validation'}
                                                        </Typography>
                                                        <Tooltip title="Rename">
                                                            <IconButton size="small" onClick={(e) => startEditing(e, record)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                                                <EditIcon fontSize="small" style={{ fontSize: 16 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(record.createdAt).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '90%', mt: 0.5 }}>
                                                Input: {record.inputType === 'structured' ? JSON.stringify(record.inputPayload.structuredData) : record.inputPayload.freeText}
                                            </Typography>
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
