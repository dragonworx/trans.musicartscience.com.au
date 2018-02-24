export default {
  byDateRange: function (fromDate, toDate, account) {
    return json('/api/getTransactions', {from: fromDate, to: toDate, account:account}).then((transactions) => {
      // convert db date string to Date obj
      transactions.forEach((trans) => trans.date = new Date(trans.date));

      return Promise.resolve(transactions);
    });
  }
};