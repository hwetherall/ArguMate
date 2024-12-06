import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Collapse,
  Divider,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function SummaryView({ scores }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!scores) return null;

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'PROCEED': return 'success';
      case 'NEEDS_WORK': return 'warning';
      case 'DO_NOT_PROCEED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analysis Results
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Overall Score: {scores.overallScore}/10
        </Typography>
        <Chip 
          label={scores.recommendation.replace(/_/g, ' ')}
          color={getRecommendationColor(scores.recommendation)}
          sx={{ mb: 2 }}
        />
      </Box>

      <Typography variant="body1" paragraph>
        {scores.summary}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6" color="success.main" gutterBottom>
          Strongest Point
        </Typography>
        <Typography paragraph>{scores.strongestPoint}</Typography>

        <Typography variant="h6" color="error.main" gutterBottom>
          Weakest Point
        </Typography>
        <Typography paragraph>{scores.weakestPoint}</Typography>
      </Box>

      <Button
        onClick={() => setShowDetails(!showDetails)}
        endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        sx={{ mb: 2 }}
      >
        {showDetails ? 'Hide Detailed Scores' : 'Show Detailed Scores'}
      </Button>

      <Collapse in={showDetails}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Detailed Claim Analysis
        </Typography>
        {scores.detailedScores.map((item, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Claim {index + 1} - Score: {item.score}/10
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.claim}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {item.explanation}
            </Typography>
          </Box>
        ))}
      </Collapse>
    </Paper>
  );
}

export default SummaryView;
