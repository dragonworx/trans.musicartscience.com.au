import React from 'react'
import ReactDOM from 'react-dom'
import Format from '../../format.js'

class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onClick(e) {
    this.props.app.setState({
      selectedDay: {
        date: this.props.date,
        transactions: this.props.transactions
      },
      selectedMonth: null
    });
  }

  render() {
    let content = [];
    let transactions = this.props.transactions;
    let date = this.props.date;
    let weekDay = this.props.weekDay;
    let selectedDay = this.props.app.state.selectedDay;
    let enabled = this.props.enabled;
    let categories = {};
    let searchText = this.props.app.state.searchText;
    let searchMatches = this.props.app.state.searchMatches;
    let hasSearchMatch = false;

    // check for category color
    if (transactions && enabled !== false) {
      let account = window.config.accounts[window.app.getAccount()];

      for (let key in account.categories) {
        if (account.categories.hasOwnProperty(key)) {
          let regex = new RegExp(account.categories[key][0]);
          let type = account.categories[key][1];
          let color = account.categories[key][2];

          transactions.forEach((trans, i) => {
            let transType = trans.debit ? 'debit' : 'credit';
            if (trans.desc.match(regex) && type === transType) {
              if (!categories[key]) {
                categories[key] = {
                  name: key,
                  key: 'cat' + i + date.toString(),
                  type: type,
                  color: color
                }
              }
            }
          });
        }
      }

      let categorySummary = [];
      for (let key in categories) {
        if (categories.hasOwnProperty(key)) {
          let cat = categories[key];
          categorySummary.push(<a key={cat.key} className="category-label" title={`${cat.name}(${cat.type})`} style={{backgroundColor:cat.color}}></a>);
        }
      }

      let debits = 0;
      let credits = 0;
      let key = 0;

      transactions.forEach((transaction) => {
        if (searchText) {
          if (searchMatches.indexOf(transaction.id) > -1) {
            hasSearchMatch = true;
          }
        }
        if (transaction.debit) {
          debits += transaction.debit;
        } else if (transaction.credit) {
          credits += transaction.credit;
        }
        key++;
      });

      if (debits) {
        content.push(<span className="summary debit" key={'debit-' + date.toDateString() + key}>{Format.toCurrency(debits)}<div className="category-summary">{categorySummary}</div></span>);
      }

      if (credits) {
        content.push(<span className="summary credit" key={'credit-' + date.toDateString() + key}>{Format.toCurrency(credits)}<div className="category-summary">{categorySummary}</div></span>);
      }
    }

    return (
      <div onClick={this.onClick.bind(this)} className={`day ${!enabled ? 'disabled' : ''} ${weekDay} ${date.toDateString() === new Date().toDateString() ? 'today' : ''} ${selectedDay && selectedDay.date.toString() === date.toString() ? 'selected' : ''} ${hasSearchMatch ? 'search-match' : ''}`}>
          <a className="dayNumber" title={date.toDateString()}>{date.getDate()}</a>
        {content}
      </div>
    );
  }
}

export default Day;