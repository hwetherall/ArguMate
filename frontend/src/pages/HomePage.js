import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Paper,
  Box
} from '@mui/material';

function HomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4
        }}
      >
        <Paper 
          elevation={3}
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
              color: '#1976d2'
            }}
          >
            ArguMate
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Innovation Logic Model Analysis Tool
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/profile')}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontSize: '1.2rem'
            }}
          >
            Start Analysis
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default HomePage; 