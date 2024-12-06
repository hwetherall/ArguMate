import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

console.log('API Client initialized with base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(request => {
  console.log('Making request to:', request.url);
  return request;
});

export const generateClaims = async (problemStatement, productDescription) => {
  try {
    const response = await apiClient.post('/api/ai/generate-claims', {
      problemStatement,
      productDescription,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to generate claims: ' + error.message);
  }
};

export const getAIEvidence = async (claim, companyProfile) => {
  try {
    const response = await apiClient.post('/api/ai/ask-ai', {
      claim,
      companyProfile
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get AI evidence: ' + error.message);
  }
};

export const getDocumentEvidence = async (claim, documentIds) => {
  try {
    const response = await apiClient.post('/api/ai/ask-docs', {
      claim,
      documentIds,
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to get document evidence: ' + error.message);
  }
};

export const scoreClaims = async (claims) => {
  try {
    const response = await apiClient.post('/api/ai/score', { claims });
    return response.data;
  } catch (error) {
    throw new Error('Failed to score claims: ' + error.message);
  }
};

export const uploadDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await apiClient.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to upload document: ' + error.message);
  }
};

export const getClaimEvidence = async (claim, problemStatement, productDescription) => {
  try {
    const response = await apiClient.post('/api/ai/get-claim-evidence', {
      claim,
      problemStatement,
      productDescription
    });
    return response.data.evidence;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw new Error(`Failed to get AI evidence: ${error.message}`);
  }
};
