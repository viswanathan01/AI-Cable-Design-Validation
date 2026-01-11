'use client';

import React from 'react';
import { Box, Container, Typography, Button, Stack, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'radial-gradient(circle at 50% 10%, rgba(0, 229, 255, 0.1) 0%, #0a1929 60%)',
        overflow: 'hidden'
      }}
    >
      {/* Header / Nav */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1 }}>
              VN
            </Typography>
          </Box>
          <Link href="/design-validator" passHref>
            <Button variant="outlined" color="primary">
              Member Login
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  left: -50,
                  width: 200,
                  height: 200,
                  background: 'rgba(0, 229, 255, 0.2)',
                  borderRadius: '50%',
                  filter: 'blur(80px)',
                  zIndex: 0
                }}
              />
              <Typography
                variant="overline"
                color="secondary"
                fontWeight="bold"
                sx={{ letterSpacing: 2, zIndex: 1, position: 'relative' }}
              >
                NEXT-GEN ENGINEERING
              </Typography>
              <Typography
                variant="h1"
                fontWeight="900"
                sx={{
                  mt: 2,
                  mb: 3,
                  background: 'linear-gradient(to right, #ffffff, #81d4fa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  zIndex: 1,
                  position: 'relative'
                }}
              >
                AI-Driven Cable <br /> Design Validation
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, maxWidth: 500 }}>
                Instantly validate power cable designs against IEC 60502-1 standards.
                Detect compliance issues, plausible optimizations, and engineering risks in seconds.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Link href="/design-validator" passHref>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
                  >
                    Launch Validator
                  </Button>
                </Link>

              </Stack>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Abstract / Scientific Illustration Placeholder */}
            <Box
              sx={{
                position: 'relative',
                height: 500,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle, rgba(41, 121, 255, 0.1) 0%, rgba(10, 25, 41, 0) 70%)',
                  animation: 'pulse 3s infinite ease-in-out'
                }}
              />
              <Stack spacing={4} sx={{ zIndex: 2, width: '100%', alignItems: 'center' }}>
                <FeatureCard
                  icon={<SecurityIcon fontSize="large" color="primary" />}
                  title="IEC Compliance"
                  desc="Automated checks against IEC 60502-1 and industry standards."
                />
                <FeatureCard
                  icon={<AutoAwesomeIcon fontSize="large" color="secondary" />}
                  title="AI Reasoning"
                  desc="Deep heuristic analysis of conductor, insulation, and ratings."
                  align="right"
                />
                <FeatureCard
                  icon={<SpeedIcon fontSize="large" sx={{ color: '#ff4081' }} />}
                  title="Instant Results"
                  desc="Reduce validation time from hours to milliseconds."
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function FeatureCard({ icon, title, desc, align = 'left' }: { icon: React.ReactNode, title: string, desc: string, align?: 'left' | 'right' }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        background: 'rgba(19, 47, 76, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        width: '80%',
        alignSelf: align === 'left' ? 'flex-start' : 'flex-end',
        transform: 'perspective(1000px) rotateY(-5deg)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
          background: 'rgba(19, 47, 76, 0.6)',
          borderColor: 'rgba(0, 229, 255, 0.3)'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(0,0,0,0.2)',
            display: 'flex'
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
