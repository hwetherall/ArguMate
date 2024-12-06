const fs = require('fs');
const csv = require('csv-parser');

module.exports = function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        // Convert results to a text representation
        const text = results.map(row => JSON.stringify(row)).join('\n');
        resolve(text);
      })
      .on('error', (err) => reject(err));
  });
};
