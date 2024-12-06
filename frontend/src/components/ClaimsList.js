import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';

function ClaimsList({ claims, onAddManualEvidence, onAskAI, onAskDocuments }) {
  const [manualEvidence, setManualEvidence] = useState('');
  const [loadingClaimId, setLoadingClaimId] = useState(null);

  const handleSubmitManualEvidence = (claimId) => {
    if (manualEvidence.trim()) {
      onAddManualEvidence(claimId, manualEvidence);
      setManualEvidence('');
    }
  };

  const handleAskAI = async (claimId) => {
    setLoadingClaimId(claimId);
    await onAskAI(claimId);
    setLoadingClaimId(null);
  };

  return (
    <Box className="claims-list">
      {claims.map(claim => (
        <Paper 
          key={claim.id} 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3,
            bgcolor: claim.type === 'fixed' ? '#f8f9fa' : 'white'
          }}
        >
          <Typography variant="h6" gutterBottom>
            {claim.text}
          </Typography>
          
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={manualEvidence}
              onChange={(e) => setManualEvidence(e.target.value)}
              placeholder="Enter manual evidence..."
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained"
                onClick={() => handleSubmitManualEvidence(claim.id)}
              >
                Add Manual Evidence
              </Button>
              <Button 
                variant="outlined"
                onClick={() => handleAskAI(claim.id)}
                disabled={loadingClaimId === claim.id}
                startIcon={loadingClaimId === claim.id ? <CircularProgress size={20} /> : null}
              >
                {loadingClaimId === claim.id ? 'AI Thinking...' : 'Ask AI'}
              </Button>
              <Button 
                variant="outlined"
                onClick={() => onAskDocuments(claim.id)}
              >
                Ask Documents
              </Button>
            </Box>
          </Box>

          {claim.evidence && claim.evidence.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Evidence:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {claim.evidence.map((evidence, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      bgcolor: '#f5f5f5',
                      borderRadius: 1,
                      position: 'relative'
                    }}
                  >
                    <Chip
                      label={evidence.type}
                      size="small"
                      sx={{ 
                        position: 'absolute',
                        top: 8,
                        right: 8
                      }}
                    />
                    <Typography variant="body2">
                      {evidence.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default ClaimsList;
