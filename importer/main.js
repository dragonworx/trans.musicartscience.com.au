const path = require('path');

const importer = require('./importer.js');
const db = require('./db.js');

const filePath = './transactions/creditcard.csv';

importer(filePath).then((transactions) => {
  db.connect();

  db.deleteAll('transactions').then(() => {
    let rowsAdded = 0;

    transactions.forEach(function (transaction) {
      let dateFields = transaction.date.split('/');
      let date = dateFields[2] + dateFields[1] + dateFields[0];

      let query = `INSERT INTO transactions (bsb, acc, transactions.date, transactions.desc, cheque, debit, credit, balance, type, account) VALUES(       
            "${transaction.bsb}",
            "${transaction.acc}",
            "${date}",
            "${transaction.desc}",
            ${transaction.cheque || 0},
            ${transaction.debit || 0},
            ${transaction.credit || 0},
            ${transaction.balance || 0},
            "${transaction.type}",
            "${path.basename(filePath, '.csv')}"
          )`;
      
      db.query(query).then((result) => {
        console.log('insertId: ' + result.insertId);
        rowsAdded++;
        if (rowsAdded === transactions.length) {
          process.exit(0);
        }
      });
    });

  });

}).catch((error) => {
  db.end();
  throw new Error(error.toString());
});