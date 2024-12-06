import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Paper,
  Box,
  TextField
} from '@mui/material';

function LandingPage() {
  const navigate = useNavigate();
  const [companyProfile, setCompanyProfile] = useState({
    problemStatement: 'The decline in the working population is an unavoidable social challenge, and robotics is seen as the only solution to sustain and grow current economic activities. With the rapid advancement of AI technology, robots are increasingly capable of handling more tasks. As a first step, we focus on QUGV for inspection, detection, and security tasks in harsh environments and aim to accelerate DX across industries.',
    productDescription: 'Q-UGV with various payloads provides efficient and effective operation for security, inspection, safety management, etc. The dustproof and waterproof performance, among other features, is reliable due to its proven use by the U.S. military etc.',
    additionalInfo: 'This company operates at the intersection of robotics, AI, and industrial automation, focusing on deploying Q-UGV (Quadruped Unmanned Ground Vehicles) to address critical challenges in inspection, detection, and security tasks within harsh environments. Leveraging its proven experience in defense applications and a strong technological foundation—evidenced by dustproof and waterproof capabilities tested under U.S. military standards—the company is now exploring the commercial sector. The target industries include power, chemical, oil & gas plants, as well as construction and government sectors, reflecting a potential multi-billion-dollar industrial market. A robust partner network, existing market research, and early PoC engagements further support their credibility and readiness to enter new markets.\n\nLooking ahead, the company envisions a comprehensive strategy to accelerate digital transformation (DX) across industries. Through deeper market analyses, sales strategy formation, and business architecture development, it aims to identify priority markets and tailor its product specifications to commercial needs. The team plans to cultivate a future roadmap that expands Q-UGV capabilities and fosters closer collaboration with potential customers and mentors. By refining its approach to resource allocation, customer targeting, and strategic partnerships, the company strives to create sustainable growth pathways and effectively transition from defense-oriented applications to a broader commercial market footprint.'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/claims', { state: { companyProfile } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Company Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Problem Statement"
              value={companyProfile.problemStatement}
              onChange={(e) => setCompanyProfile(prev => ({
                ...prev,
                problemStatement: e.target.value
              }))}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Product Description"
              value={companyProfile.productDescription}
              onChange={(e) => setCompanyProfile(prev => ({
                ...prev,
                productDescription: e.target.value
              }))}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              label="Additional Information"
              placeholder="Enter market research, technical specifications, competitive analysis, etc."
              value={companyProfile.additionalInfo}
              onChange={(e) => setCompanyProfile(prev => ({
                ...prev,
                additionalInfo: e.target.value
              }))}
              sx={{ mb: 3 }}
            />
            <Button 
              type="submit"
              variant="contained" 
              size="large"
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: '1.2rem'
              }}
            >
              Start Analysis
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default LandingPage;
