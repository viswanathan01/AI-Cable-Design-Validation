'use client';
import { createTheme } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e5ff', // Cyan
        },
        secondary: {
            main: '#76ff03', // Lime Green
        },
        background: {
            default: '#0a1929', // Deep dark blue
            paper: '#132f4c',
        },
        text: {
            primary: '#fff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(19, 47, 76, 0.6)', // Semi-transparent
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #00e5ff 30%, #2979ff 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                    color: '#000',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderBottom: '1px solid rgba(255,255,255,0.2)',
                    },
                },
            },
        },
    },
});

export default theme;
