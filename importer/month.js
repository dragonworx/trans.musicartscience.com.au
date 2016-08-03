const headers = require('./headers.js');

class Month {
  constructor(month, year) {
    this.month = month;
    this.year = year;
    this.transactions = [];
  }

  hasDate(date) {
    return date.getMonth() === this.month && date.getFullYear() === this.year;
  }

  add(transaction) {
    this.transactions.push(transaction);
  }

  openingBalance() {
    return this.transactions[this.transactions.length - 1].balance;
  }

  closingBalance() {
    return this.transactions[0].balance;
  }
}

function parseDate(dateStr) {
  let dateFields = dateStr.split('/');
  return new Date(parseInt(dateFields[2]), parseInt(dateFields[1]), parseInt(dateFields[0]));
}

Month.getMonths = function (transactions) {
  let index = {};
  let months = [];
  transactions.forEach((transaction) => {
    let date = parseDate(transaction.date);
    let monthKey = (date.getMonth() + 1).toString();
    monthKey = monthKey.length === 1 ? '0' + monthKey : monthKey;
    let key = `${date.getFullYear()}_${monthKey}`;
    if (!index[key]) {
      let month = new Month(date.getMonth(), date.getFullYear());
      months.push(month);
      index[key] = month;
    }
    let month = index[key];
    if (month.hasDate(date)) {
      month.add(transaction);
    }
  });
  return months;
};

module.exports = Month;