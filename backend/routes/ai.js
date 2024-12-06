const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const generateClaimsPrompt = require('../prompts/generateClaimsPrompt');
const askAIWithoutDocsPrompt = require('../prompts/askAIWithoutDocsPrompt');
const askAIWithDocsPrompt = require('../prompts/askAIWithDocsPrompt');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Remove or comment out this line
// console.log('API Key:', process.env.OPENAI_API_KEY);

router.post('/generate-claims', async (req, res) => {
  try {
    const { problemStatement, productDescription } = req.body;
    
    // Use our custom prompt
    const prompt = generateClaimsPrompt(problemStatement, productDescription);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are an AI assistant helping to evaluate product ideas for Mitsubishi's Innovation Lab. Provide clear, specific claims."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the claims from the response and ensure it's an array
    const responseText = completion.choices[0].message.content;
    
    // Split the response into individual claims and clean them up
    const claims = responseText
      .split(/\d+\.|[\n\r]+/)  // Split by numbers followed by dots or newlines
      .map(claim => claim.trim())
      .filter(claim => claim.length > 0)
      .filter(claim => claim.includes('"')); // Only take claims with quotation marks

    if (claims.length !== 5) {
      throw new Error('Failed to generate exactly 5 claims');
    }

    res.json(claims);
  } catch (error) {
    console.error('Error generating claims:', error);
    res.status(500).json({ error: 'Failed to generate claims' });
  }
});

// Add new endpoint for getting evidence for a claim
router.post('/ask-ai', async (req, res) => {
  try {
    const { claim, companyProfile } = req.body;
    
    const prompt = askAIWithoutDocsPrompt(companyProfile, claim);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an analytical AI assistant evaluating product claims for Mitsubishi's Innovation Lab. Your responses should be evidence-based, specific, and directly address the claim using the provided company information."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    res.json(completion.choices[0].message.content.trim());
    
  } catch (error) {
    console.error('Error getting claim evidence:', error);
    res.status(500).json({ error: 'Failed to get claim evidence' });
  }
});

router.post('/ask-docs', async (req, res) => {
  console.log('Received ask-docs request:', req.body);
  const { claim, documentIds } = req.body;

  try {
    if (!claim || !documentIds || !Array.isArray(documentIds)) {
      return res.status(400).json({ 
        error: 'Invalid request. Required: claim (string) and documentIds (array)' 
      });
    }

    // Get the document content from the uploaded documents
    const documentsCollection = global.uploadedDocuments || {};
    const documentContent = documentIds
      .map(id => documentsCollection[id]?.content || '')
      .join('\n\n');

    if (!documentContent) {
      return res.status(404).json({ 
        error: 'No document content found for the provided IDs' 
      });
    }

    // Use the prompt with OpenAI
    const prompt = askAIWithDocsPrompt(
      req.body.companyProfile?.problemStatement || '',
      req.body.companyProfile?.productDescription || '',
      claim,
      documentContent
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an analytical AI assistant evaluating product claims. Analyze the provided documents and provide specific evidence that supports or refutes the claim."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const evidence = completion.choices[0].message.content.trim();
    console.log('Generated evidence:', evidence);
    res.json(evidence);

  } catch (error) {
    console.error('Error processing document evidence request:', error);
    res.status(500).json({ error: error.message });
  }
});

// ... other routes ...

module.exports = router;
