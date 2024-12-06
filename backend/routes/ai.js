const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const generateClaimsPrompt = require('../prompts/generateClaimsPrompt');
const askAIWithoutDocsPrompt = require('../prompts/askAIWithoutDocsPrompt');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('API Key:', process.env.OPENAI_API_KEY);

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

// ... other routes ...

module.exports = router;
