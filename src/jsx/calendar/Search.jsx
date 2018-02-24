import React from 'react'
import ReactDOM from 'react-dom'

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.inputTimeout = null;
  }

  onInputKeyup(e) {
    if (this.inputTimeout) {
      clearTimeout(this.inputTimeout);
    }
    if (e.keyCode === 27) {
      this.refs.search.value = '';
      app.setState({
        searchText: null,
        searchMatches: null
      });
      return;
    }
    if (e.keyCode === 13) {
      this.search();
    } else {
      this.inputTimeout = setTimeout(this.search.bind(this), 1000);
    }
  }

  getTransactions() {
    if (!this.transactions) {
      this.transactions = [];
      for (let [keyByYearMonth, mapByDay] of this.props.transactions.entries()) {
        mapByDay.forEach((trans) => {
          this.transactions.push.apply(this.transactions, trans);
        });
      }
    }
    return this.transactions;
  }

  search() {
    let transactions = this.getTransactions();
    let value = this.refs.search.value;
    let regex = new RegExp(value, 'i');
    let matches = [];
    transactions.forEach((trans) => {
      if (trans.desc.match(regex)) {
        matches.push(trans.id);
      }
    });
    if (matches.length) {
      this.props.app.setState({
        searchText: value,
        searchMatches: matches
      });
    } else {
      this.props.app.setState({
        searchText: null,
        searchMatches: null
      });
    }
  }

  render() {
    this.transactions = null;
    return (
      <div className="search"><input type="text" onKeyUp={this.onInputKeyup.bind(this)} ref="search" defaultValue={this.props.app.state.searchText ? this.props.app.state.searchText : ''} /></div>
    );
  }
}

export default Search;