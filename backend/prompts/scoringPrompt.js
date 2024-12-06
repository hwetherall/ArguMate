module.exports = function scoringPrompt(problemStatement, productDescription, claimsAndEvidence) {
    // claimsAndEvidence is expected to be an array of { claim: "", evidence: "" }
    const claimsText = claimsAndEvidence.map((ce, i) => {
      return `${i+1}. Claim: "${ce.claim}"\n   Evidence: ${ce.evidence}\n`;
    }).join('\n');
  
    return `
You are an AI assistant helping to evaluate whether a product idea should proceed to the next stage of development.

Context:
- Problem Statement: ${problemStatement}
- Product Description: ${productDescription}

Claims and Evidence:
${claimsText}

Please analyze all claims and evidence holistically, then provide a response in the following JSON format:
{
  "overallScore": number between 1-10,
  "summary": "A comprehensive analysis of whether the product should proceed to the next stage, including key strengths and weaknesses",
  "recommendation": "PROCEED" or "NEEDS_WORK" or "DO_NOT_PROCEED",
  "strongestPoint": "Description of the strongest argument for proceeding",
  "weakestPoint": "Description of the biggest concern or risk",
  "detailedScores": [
    {
      "claim": "exact claim text",
      "score": number between 1-10,
      "explanation": "detailed explanation of the score"
    }
  ]
}

Consider:
1. The strength and clarity of evidence for each claim
2. The overall coherence of the argument for proceeding
3. The potential impact and feasibility of the product
4. Any major risks or concerns identified

Provide thorough explanations and a balanced assessment.
`;
  };
  