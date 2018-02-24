import React from 'react'
import ReactDOM from 'react-dom'
import Format from '../../format.js'

class AccountOverview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let bars = [];
    let account = window.config.accounts[window.app.getAccount()];
    let transactions = [];

    for (let [keyByYearMonth, mapByDay] of this.props.transactions.entries()) {
      mapByDay.forEach((trans, i) => {
        transactions.push({key:keyByYearMonth + this.props.monthName + i, trans:trans});
      });
    }

    if (account.limit) {
      transactions.forEach((t, i) => {
        bars.push(<div key={t.key} className="bar-outer" style={{width: 400 / transactions.length}}><a className="bar-inner" title={Format.date(t.trans.date) + ' $' + Format.toCurrency(t.trans.balance)} style={{height: (Math.abs(t.trans.balance) / account.limit) * 57}}></a></div>);
      });
    }

    let openingBalance = Format.toCurrency(transactions[0].trans.balance);
    let closingBalance = Format.toCurrency(transactions[transactions.length - 1].trans.balance);

    return (
      <div className="overview">{bars}<span className="balance opening">{openingBalance}</span><span className="balance closing">{closingBalance}</span></div>
    );
  }
}

export default AccountOverview;