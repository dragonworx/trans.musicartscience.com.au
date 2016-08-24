const headers = require('./headers.js');

module.exports = function importer(filePath) {
  return new Promise((resolve, reject) => {
    var basicCSV = require("basic-csv");
    var transactions = [];
    var headerRow;

    basicCSV.readCSV(filePath, {
      /* dropHeader: true */
    }, (error, rows) => {
      if (error) {
        reject(error);
      }

      rows.forEach((row, i) => {
        if (i === 0) {
          headerRow = row;
        } else {
          var transaction = {};
          headerRow.forEach((header, j) => {
            transaction[headers[header]] = row[j];
          });
          transactions.push(transaction);
        }
      });
      
      resolve(transactions);
    });
  });
};