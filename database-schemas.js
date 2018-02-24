const SQL = require('sequelize');

module.exports = {
  transaction: {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bsb: {
      type: SQL.TEXT
    },
    acc: {
      type: SQL.TEXT
    },
    date: {
      type: SQL.DATE,
      field: 't_date'
    },
    desc: {
      type: SQL.TEXT,
      field: 't_desc'
    },
    cheque: {
      type: SQL.DECIMAL(10, 2),
      defaultValue: 0
    },
    debit: {
      type: SQL.DECIMAL(10, 2),
      defaultValue: 0
    },
    credit: {
      type: SQL.DECIMAL(10, 2),
      defaultValue: 0
    },
    balance: {
      type: SQL.DECIMAL(10, 2),
      defaultValue: 0
    },
    type: {
      type: SQL.TEXT
    },
    account: {
      type: SQL.TEXT
    },
    hash: {
      type: SQL.TEXT
    }
  }
};