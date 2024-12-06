module.exports = function generateClaimsPrompt(problemStatement, productDescription) {
  return `
You are an AI assistant helping to evaluate a potential product idea.

Context:
- This product is being developed by Mitsubishi's Innovation Lab.
- Problem Statement: ${problemStatement}
- Product Description: ${productDescription}

Return exactly these five questions in this exact format, maintaining the exact quotation marks and formatting:

1. "Is the target market for this product sufficiently large?"
2. "Is the target market for this product growing at a significant rate?"
3. "Is the product technically feasible?"
4. "Does the product offer a distinct competitive advantage over existing solutions?"

Important: 
- Return ONLY the numbered list with exactly these 5 questions
- Questions 1-4 must be exactly as written above
- Only question 5 should be generated
- Do not modify or rephrase questions 1-4
- Do not add any additional text or explanation
`;
};
