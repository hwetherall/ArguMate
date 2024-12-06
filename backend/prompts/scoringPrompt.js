module.exports = function scoringPrompt(problemStatement, productDescription, claimsAndEvidence) {
    // claimsAndEvidence is expected to be an array of { claim: "", evidence: "" }
    const claimsText = claimsAndEvidence.map((ce, i) => {
      return `${i+1}. Claim: "${ce.claim}"\n   Evidence: ${ce.evidence}\n`;
    }).join('\n');
  
    return `
  You are an AI assistant helping to finalize an evaluation of a product idea.
  
  Context:
  - Problem Statement: ${problemStatement}
  - Product Description: ${productDescription}
  
  Claims and Evidence:
  ${claimsText}
  
  Your Task:
  1. Assign a score (1 to 5) to each claim based on the strength and clarity of the evidence provided.
  2. Sum these scores.
  3. Write a short summary stating if the argument is supported. If low score, advise caution; if high, advise moving forward.
  
  Output:
  - List each claim with its score.
  - Then provide the total score.
  - Then a short summary.
  `;
  };
  