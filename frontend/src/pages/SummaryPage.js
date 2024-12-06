import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scoreClaims } from '../services/apiClient';
import SummaryView from '../components/SummaryView';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  CircularProgress,
  Divider 
} from '@mui/material';

function SummaryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const claims = location.state?.claims;

  useEffect(() => {
    if (!claims) {
      navigate('/claims');
      return;
    }

    const getScores = async () => {
      try {
        const formattedClaims = claims.map(claim => ({
          claim: claim.text,
          evidence: claim.evidence.map(e => e.content).join(' ')
        }));
        
        const scoreResults = await scoreClaims(formattedClaims);
        setScores(scoreResults);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getScores();
  }, [claims, navigate]);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SummaryView scores={scores} />
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Start New Analysis
        </Button>
      </Box>
    </Container>
  );
}

export default SummaryPage;
