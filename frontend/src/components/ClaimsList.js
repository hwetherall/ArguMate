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
  const [manualInputs, setManualInputs] = useState({});
  const [loadingClaimId, setLoadingClaimId] = useState(null);

  const handleManualInputChange = (claimId, value) => {
    setManualInputs(prev => ({
      ...prev,
      [claimId]: value
    }));
  };

  const handleManualSubmit = (claimId) => {
    if (manualInputs[claimId]) {
      onAddManualEvidence(claimId, manualInputs[claimId]);
      setManualInputs(prev => ({
        ...prev,
        [claimId]: ''
      }));
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
              rows={2}
              variant="outlined"
              placeholder="Add manual evidence..."
              value={manualInputs[claim.id] || ''}
              onChange={(e) => handleManualInputChange(claim.id, e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              onClick={() => handleManualSubmit(claim.id)}
              disabled={!manualInputs[claim.id]}
              sx={{ mr: 1 }}
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
