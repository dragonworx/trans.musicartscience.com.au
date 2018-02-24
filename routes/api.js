const express = require('express');
const router = express.Router();
const log = require('../log.js');

process.on('unhandledRejection', function(err) {
  log.error(err.stack);
});

require('../database.js').then((db) => {
  router.get('/getTransactions', (req, res, next) => {
    let fromDate = new Date(parseInt(req.query.from, 10));
    let toDate = new Date(parseInt(req.query.to, 10));
    let account = req.query.account;
    if (toDate < fromDate) {
      let temp = fromDate;
      fromDate = toDate;
      toDate = temp;
    }

    db.transaction.findAll({
      where: {
        date: {
          $between: [fromDate, toDate]
        },
        account: account
      },
      order: 't_date'
    }).then((transactions) => {
      transactions.forEach((transaction) => {
        transaction.balance = parseFloat(transaction.balance);
        transaction.cheque = parseFloat(transaction.cheque);
        transaction.debit = parseFloat(transaction.debit);
        transaction.credit = parseFloat(transaction.credit);
      });
      res.send(JSON.stringify(transactions));
    });
  });
});

module.exports = router;
