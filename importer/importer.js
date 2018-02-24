const md5 = require('md5');
const path = require('path');
const cli = require('cli-color');

const headers = {
  'BSB Number': 'bsb',
  'Account Number': 'acc',
  'Transaction Date': 'date',
  'Narration': 'desc',
  'Cheque': 'cheque',
  'Debit': 'debit',
  'Credit': 'credit',
  'Balance': 'balance',
  'Transaction Type': 'type'
};

module.exports = function importer(filePath) {
  return new Promise((resolve) => {
    var basicCSV = require("basic-csv");
    var transactions = [];
    var headerRow;

    basicCSV.readCSV(filePath, {
      /* dropHeader: true */
    }, (error, rows) => {
      if (error) {
        console.log(cli.red(error.stack));
        process.exit(-1);
      }

      rows.forEach((row, i) => {
        if (i === 0) {
          headerRow = row;
        } else {
          var transaction = {};
          headerRow.forEach((header, j) => {
            transaction[headers[header]] = row[j];
          });
          let dateFields = transaction.date.split('/').map((field) => parseInt(field, 10));
          transaction.date = new Date(dateFields[2], dateFields[1] - 1, dateFields[0]);
          transaction.account = path.basename(filePath, '.csv');
          transaction.hash = md5(transaction.account + row.join(''));
          transaction.row = row;
          transaction.headers = headers;
          transaction.line = i + 1;
          transaction.cheque = transaction.cheque ? transaction.cheque : 0;
          transaction.credit = transaction.credit ? transaction.credit : 0;
          transaction.debit = transaction.debit ? transaction.debit : 0;
          transactions.push(transaction);
        }
      });
      
      resolve(transactions);
    });
  });
};