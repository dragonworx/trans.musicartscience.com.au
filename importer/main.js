const path = require('path');

const log = require('./log.js');
const importer = require('./importer.js');
const db = require('./db.js');

const filePath = './transactions/creditcard.csv';

log.main(`Importing transactions from: "${filePath}" ...`);

importer(filePath).then((transactions) => {
  log.begin('Connecting to database...');
  db.connect();
  log.ok();


  log.begin('Purging existing data...');
  db.deleteAll('transactions').then(() => {
    log.ok();
    let rowsAdded = 0;

    transactions.forEach(function (transaction) {
      let dateFields = transaction.date.split('/');
      let date = dateFields[2] + dateFields[1] + dateFields[0];

      let query = `INSERT INTO transactions (bsb, acc, transactions.date, transactions.desc, cheque, debit, credit, balance, type) VALUES(       
            "${transaction.bsb}",
            "${transaction.acc}",
            "${date}",
            "${transaction.desc}",
            ${transaction.cheque || 0},
            ${transaction.debit || 0},
            ${transaction.credit || 0},
            ${transaction.balance || 0},
            "${transaction.type}"
          )`;
      
      db.query(query).then((result) => {
        rowsAdded++;
        if (rowsAdded === transactions.length) {
          log.completed(`(${rowsAdded}) rows added.`);
          process.exit(0);
        }
      });
    });

  });

}).catch((error) => {
  db.end();
  throw new Error(error.toString());
});