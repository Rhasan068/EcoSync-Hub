import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid, Chip, Divider, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AirIcon from '@mui/icons-material/Air';
import TimerIcon from '@mui/icons-material/Timer';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useAuth } from '../contexts/AuthContext';
import { getImageUrl } from '../utils/imageUtils';

const ChallengeDetail = () => {
    const { id } = useParams();
    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { api } = useAuth();

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await api.get(`/challenges/${id}`);
                setChallenge(response.data);
            } catch {
                setError('Failed to load challenge details');
            } finally {
                setLoading(false);
            }
        };
        fetchChallenge();
    }, [api, id]);

    const joinChallenge = async () => {
        try {
            await api.post(`/challenges/join/${id}`);
            alert('Mission accepted! You are now part of this eco-movement.');
        } catch {
            alert('Failed to join mission. You might be already enrolled.');
        }
    };

    if (loading) return <Box sx={{ p: 8, textAlign: 'center' }}><CircularProgress /></Box>;
    if (error) return <Box className="page-container"><Alert severity="error">{error}</Alert></Box>;
    if (!challenge) return <Box className="page-container"><Typography>Challenge not found.</Typography></Box>;

    return (
        <Box className="page-container fade-in">
            <Button
                component={Link}
                to="/challenges"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 4, fontWeight: 700 }}
            >
                Back to Missions
            </Button>

            <Card className="card" sx={{ overflow: 'hidden', mb: 8 }}>
                <Grid container>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CardMedia
                            component="img"
                            image={getImageUrl(challenge.image_url) || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'}
                            alt={challenge.title}
                            sx={{ height: '100%', minHeight: 400, objectFit: 'cover' }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                            <Chip label={challenge.category} color="primary" sx={{ fontWeight: 800, mb: 2 }} />
                            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>{challenge.title}</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                                {challenge.description}
                            </Typography>

                            <Grid container spacing={2} sx={{ mb: 6 }}>
                                <Grid size={{ xs: 4 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: '16px' }}>
                                        <EmojiEventsIcon color="primary" sx={{ mb: 0.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{challenge.points_reward}</Typography>
                                        <Typography variant="caption" color="text.secondary">Reward</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: '16px' }}>
                                        <AirIcon color="secondary" sx={{ mb: 0.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{challenge.co2_saving_kg}kg</Typography>
                                        <Typography variant="caption" color="text.secondary">CO2 Saved</Typography>
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(156, 39, 176, 0.05)', borderRadius: '16px' }}>
                                        <TimerIcon sx={{ color: '#9c27b0', mb: 0.5 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{challenge.duration_days}</Typography>
                                        <Typography variant="caption" color="text.secondary">Days</Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={joinChallenge}
                                startIcon={<FlashOnIcon />}
                                sx={{ h: 60, borderRadius: '30px', fontWeight: 900, fontSize: '1.1rem' }}
                            >
                                Start Mission
                            </Button>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>

            <Box sx={{ mb: 10 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 4 }}>Why take this challenge?</Typography>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Global Impact</Typography>
                        <Typography variant="body2" color="text.secondary">Join thousands of warriors reducing their carbon footprint through this specific action.</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Earn Hub Points</Typography>
                        <Typography variant="body2" color="text.secondary">Points can be redeemed for eco-coupons and exclusive marketplace deals.</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Skill Building</Typography>
                        <Typography variant="body2" color="text.secondary">Learn sustainable habits that last a lifetime and influence your community.</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default ChallengeDetail;
