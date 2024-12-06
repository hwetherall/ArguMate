import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Typography,
  CircularProgress
} from '@mui/material';
import { generateClaims, getAIEvidence, getDocumentEvidence, uploadDocument } from '../services/apiClient';
import ClaimsList from '../components/ClaimsList';

function ClaimsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const companyProfile = location.state?.companyProfile || {
    problemStatement: '',
    productDescription: '',
    additionalInfo: ''
  };

  const [loading, setLoading] = useState(false);
  const [claims, setClaims] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [thinkingType, setThinkingType] = useState({ claimId: null, type: null });

  const handleGenerateClaims = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const generatedClaims = await generateClaims(
        companyProfile.problemStatement, 
        companyProfile.productDescription
      );
      
      const claimsArray = Array.isArray(generatedClaims) 
        ? generatedClaims 
        : [generatedClaims];

      setClaims(
        claimsArray.map((claim, index) => ({
          id: `claim-${index}`,
          text: typeof claim === 'string' ? claim : claim.text || 'Invalid claim',
          type: 'generated',
          evidence: []
        }))
      );
    } catch (error) {
      alert('Failed to generate claims. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualEvidence = (claimId, evidence) => {
    setClaims(claims.map(claim => 
      claim.id === claimId 
        ? { ...claim, evidence: [...(claim.evidence || []), { type: 'manual', content: evidence }] }
        : claim
    ));
  };

  const handleAskAI = async (claimId) => {
    setThinkingType({ claimId, type: 'ai' });
    try {
      const claim = claims.find(c => c.id === claimId);
      const evidence = await getAIEvidence(claim.text, companyProfile);
      
      setClaims(claims.map(c => 
        c.id === claimId 
          ? { ...c, evidence: [...(c.evidence || []), { type: 'ai', content: evidence }] }
          : c
      ));
    } catch (error) {
      alert(error.message);
    } finally {
      setThinkingType({ claimId: null, type: null });
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    try {
      const uploadedDoc = await uploadDocument(file);
      setDocuments([...documents, {
        ...uploadedDoc,
        name: file.name
      }]);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAskDocuments = async (claimId) => {
    if (documents.length === 0) {
      alert('Please upload documents first');
      return;
    }

    setThinkingType({ claimId, type: 'documents' });
    try {
      const claim = claims.find(c => c.id === claimId);
      const evidence = await getDocumentEvidence(claim.text, documents.map(d => d.id));
      
      setClaims(claims.map(c => 
        c.id === claimId 
          ? { ...c, evidence: [...(c.evidence || []), { type: 'document', content: evidence }] }
          : c
      ));
    } catch (error) {
      alert(error.message);
    } finally {
      setThinkingType({ claimId: null, type: null });
    }
  };

  const handleProceedToSummary = () => {
    // Check if all claims have evidence
    const allClaimsHaveEvidence = claims.every(claim => 
      claim.evidence && claim.evidence.length > 0
    );

    if (allClaimsHaveEvidence) {
      navigate('/summary', { state: { claims } });
    } else {
      alert('Please provide evidence for all claims before proceeding');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {claims.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Generate Claims
          </Typography>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Company Profile Summary
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Problem Statement:</strong> {companyProfile.problemStatement}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Product Description:</strong> {companyProfile.productDescription}
            </Typography>
            {companyProfile.additionalInfo && (
              <Typography variant="body1" paragraph>
                <strong>Additional Information:</strong> {companyProfile.additionalInfo}
              </Typography>
            )}
          </Box>
          <Button 
            onClick={handleGenerateClaims}
            variant="contained" 
            size="large"
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate Claims'}
          </Button>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Claims Analysis
          </Typography>
          <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Upload Supporting Documents
              </Typography>
              <Button
                variant="contained"
                component="label"
                sx={{ mr: 2, mb: 2 }}
              >
                Upload File
                <input
                  type="file"
                  hidden
                  accept=".pdf,.csv"
                  onChange={handleFileUpload}
                />
              </Button>
              {documents.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Files:
                  </Typography>
                  {documents.map((doc, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        pl: 2,
                        py: 0.5
                      }}
                    >
                      • {doc.name}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            <ClaimsList
              claims={claims}
              onAddManualEvidence={handleAddManualEvidence}
              onAskAI={handleAskAI}
              onAskDocuments={handleAskDocuments}
              setClaims={setClaims}
              thinkingType={thinkingType}
            />
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="contained"
                onClick={handleProceedToSummary}
                disabled={loading || !claims.every(claim => claim.evidence?.length > 0)}
                size="large"
              >
                Proceed to Summary
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

export default ClaimsPage;