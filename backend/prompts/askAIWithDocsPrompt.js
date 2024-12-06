module.exports = function askAIWithDocsPrompt(problemStatement, productDescription, claim, documentsText) {
    return `
  You are an AI assistant evaluating a claim about a product concept.
  
  Context:
  - Problem Statement: ${problemStatement}
  - Product Description: ${productDescription}
  
  Claim: "${claim}"
  
  Additional Resource:
  "${documentsText}"
  
  Analyze the document text and provide evidence that supports or refutes the claim. 
  Limit your response to two concise paragraphs. If no relevant evidence is found in the documents, say so briefly.
  `;
  };
  