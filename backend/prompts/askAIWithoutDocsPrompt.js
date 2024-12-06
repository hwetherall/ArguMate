module.exports = function askAIWithoutDocsPrompt(companyProfile, claim) {
    return `
  You are an AI assistant evaluating a claim about a product concept.
  
  Company Profile:
  - Problem Statement: ${companyProfile.problemStatement}
  - Product Description: ${companyProfile.productDescription}
  - Additional Context: ${companyProfile.additionalInfo}
  
  Claim: "${claim}"
  
  Based on the complete company profile above, provide evidence, reasoning, or justification supporting or refuting this claim. Consider:
  1. Market dynamics and potential
  2. Technical feasibility
  3. Competitive landscape
  4. Business viability
  5. Any relevant industry trends or data points
  
  Provide a thorough, evidence-based analysis in 2-3 sentences.
  `;
  };
  