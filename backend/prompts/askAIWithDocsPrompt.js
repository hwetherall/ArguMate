module.exports = function askAIWithDocsPrompt(problemStatement, productDescription, claim, documentsText) {
    return `
  You are an AI assistant evaluating a claim about a product concept.
  
  Context:
  - Problem Statement: ${problemStatement}
  - Product Description: ${productDescription}
  
  Claim: "${claim}"
  
  Additional Resource:
  "${documentsText}"
  
  Use ONLY the above document text to provide evidence. If none is found, say so.
  `;
  };
  