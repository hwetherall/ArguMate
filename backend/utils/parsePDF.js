const fs = require('fs');
const pdfParse = require('pdf-parse');

module.exports = async function parsePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};
