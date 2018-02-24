const path = require('path');
const cli = require('cli-color');
const log = require('../log.js');
const importer = require('./importer.js');

process.on('unhandledRejection', function(err) {
  log.error(err.stack);
});

log.begin('Connecting to database...\n');

require('../database.js').then(db => {
  log.ok();

  const filePath = './transactions/creditcard.csv';
//  const filePath = './transactions/debitcard.csv';
//  const filePath = './transactions/loan.csv';
//  const filePath = './transactions/savings.csv';

  log.main(`Importing transactions from: "${filePath}" ...`);

  importer(filePath).then((transactions) => {
    log.completed(`Processing ${transactions.length} transactions...`);

    let rowsAdded = 0;
    let transactionsLength = transactions.length;
    let minId = Number.MAX_VALUE;
    let maxId = Number.MIN_VALUE;

    function processTransaction(transaction) {
      db.transaction.findOne({
        where: {
          hash: transaction.hash
        }
      }).then((existingTransaction) => {
        if (existingTransaction) {
          log.warn(`Duplicate #${existingTransaction.id} for line ${transaction.line}: "${transaction.row.join(', ')}" (skipped)`);
          processNextTransaction();
        } else {
          db.transaction.create({
            bsb: transaction.bsb,
            acc: transaction.acc,
            date: transaction.date,
            desc: transaction.desc,
            cheque: transaction.cheque,
            credit: transaction.credit,
            debit: transaction.debit,
            balance: transaction.balance,
            type: transaction.type,
            account: transaction.account,
            hash: transaction.hash
          }).then((trans) => {
            minId = Math.min(minId, trans.id);
            maxId = Math.max(maxId, trans.id);
            rowsAdded++;
            processNextTransaction();
          });
        }
      });
    }

    function processNextTransaction() {
      if (transactions.length) {
        processTransaction(transactions.shift());
      } else {
        log.completed(`${Math.floor((rowsAdded / transactionsLength) * 100)}% (${rowsAdded}/${transactionsLength}) rows added, id #${minId} to #${maxId}`);
        process.exit(0);
      }
    }

    processNextTransaction();
  });
}).catch(err => {
  log.error(err);
  process.exit(-1);
});