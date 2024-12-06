import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function ClaimsList({ 
  claims, 
  onAddManualEvidence, 
  onAskAI, 
  onAskDocuments,
  setClaims,
  thinkingType
}) {
  const [manualInputs, setManualInputs] = useState({});

  const handleManualInputChange = (claimId, event) => {
    const value = event?.target?.value || '';
    
    setManualInputs(prev => ({
      ...prev,
      [claimId]: value
    }));
  };

  const handleManualSubmit = (claimId) => {
    const evidenceText = manualInputs[claimId];
    if (evidenceText?.trim()) {
      onAddManualEvidence(claimId, evidenceText.trim());
      setManualInputs(prev => ({
        ...prev,
        [claimId]: ''
      }));
    }
  };

  const handleDeleteEvidence = (claimId, evidenceIndex) => {
    setClaims(claims.map(claim => 
      claim.id === claimId 
        ? {
            ...claim,
            evidence: claim.evidence.filter((_, index) => index !== evidenceIndex)
          }
        : claim
    ));
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
              onChange={(e) => handleManualInputChange(claim.id, e)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => handleManualSubmit(claim.id)}
                disabled={!manualInputs[claim.id] || thinkingType.claimId === claim.id}
              >
                Add Manual Evidence
              </Button>
              <Button 
                variant="outlined"
                onClick={() => onAskAI(claim.id)}
                disabled={thinkingType.claimId === claim.id}
              >
                {thinkingType.claimId === claim.id && thinkingType.type === 'ai' 
                  ? "AI thinking..." 
                  : "Ask AI"}
              </Button>
              <Button 
                variant="outlined"
                onClick={() => onAskDocuments(claim.id)}
                disabled={thinkingType.claimId === claim.id}
              >
                {thinkingType.claimId === claim.id && thinkingType.type === 'documents' 
                  ? "AI analyzing documents..." 
                  : "Ask Documents"}
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
                {claim.evidence.map((evidence, evidenceIndex) => (
                  <Box 
                    key={evidenceIndex} 
                    sx={{ 
                      position: 'relative', 
                      p: 2, 
                      bgcolor: '#f5f5f5',
                      borderRadius: 1
                    }}
                  >
                    <Box sx={{ pr: 4 }}>
                      <Typography variant="body1">
                        {evidence.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mt: 1, 
                          color: 'text.secondary' 
                        }}
                      >
                        Source: {evidence.type}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8 
                      }}
                      onClick={() => handleDeleteEvidence(claim.id, evidenceIndex)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
