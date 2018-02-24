import React from 'react'
import ReactDOM from 'react-dom'
import Transforms from '../../transforms.js'
import Format from '../../format.js'

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 288,
      group: false,
      sort: 0 // Amount
    };
  }

  hasSearchMatch(trans) {
    let hasSearchMatch = false;
    if (this.props.app.state.searchText) {
      if (this.props.app.state.searchMatches.indexOf(trans.id) > -1) {
        hasSearchMatch = true;
      }
    }
    return hasSearchMatch;
  }

  hasSearchMatchGroup(desc) {
    let hasSearchMatch = false;
    if (this.props.app.state.searchText) {
      if (desc.match(new RegExp(this.props.app.state.searchText, 'i'))) {
        hasSearchMatch = true;
      }
    }
    return hasSearchMatch;
  }

  highlight(desc) {
    let searchText = this.props.app.state.searchText;
    if (searchText) {
      desc = desc.replace(new RegExp(searchText, 'i'), '<b>' + searchText + '</b>');
    }
    return {
      __html: desc
    };
  }

  newTransaction(trans, key) {
    return (
      <li className={`transaction ${this.hasSearchMatch(trans) ? 'search-match' : ''}`} key={key}>
        <span className="date">{Format.date(trans.date)}</span>
        <span className={`amount ${trans.debit ? 'debit' : 'credit'}`}>{Format.toCurrency(trans.debit ? trans.debit : trans.credit)}</span>
        <span className="description" dangerouslySetInnerHTML={this.highlight(Transforms.apply(trans.desc))}></span>
      </li>
    )
  }

  newTransactionGroup(desc, count, type, amount, key) {
    return (
      <li className={`transaction group ${this.hasSearchMatchGroup(desc) ? 'search-match' : ''}`} key={key}>
        <span className="count">{count}</span>
        <span className={`amount ${type}`}>{Format.toCurrency(amount)}</span>
        <span className="description" dangerouslySetInnerHTML={this.highlight(Transforms.apply(desc))}></span>
      </li>
    )
  }

  render() {
    let transactions = [];
    let selectedDay = this.props.app.state.selectedDay;
    let selectedMonth = this.props.app.state.selectedMonth;

    if (selectedDay && selectedDay.transactions) {
      // show transactions for selected day
      selectedDay.transactions.forEach((trans, i) => {
        transactions.push(trans);
      });
    } else if (selectedMonth && selectedMonth.transactions) {
      // show transactions for selected month
      for (let [keyByYearMonth, mapByDay] of selectedMonth.transactions.entries()) {
        mapByDay.forEach((trans) => {
          transactions.push(trans);
        });
      }
    }

    // find categories
    let categorySummary = [];
    if (selectedDay || selectedMonth) {
      let account = window.config.accounts[window.app.getAccount()];
      let categories = {};

      for (let key in account.categories) {
        if (account.categories.hasOwnProperty(key)) {
          let regex = new RegExp(account.categories[key][0]);
          let type = account.categories[key][1];
          let color = account.categories[key][2];
          transactions.forEach((trans) => {
            let transType = trans.debit ? 'debit' : 'credit';
            if (trans.desc.match(regex) && type === transType) {
              if (!categories[key]) {
                categories[key] = {
                  amount: 0,
                  count: 0,
                  color: color,
                  type: type
                }
              }
              categories[key].amount += trans.debit ? trans.debit : trans.credit;
              categories[key].count++;
            }
          });
        }
      }

      for (let key in categories) {
        if (categories.hasOwnProperty(key)) {
          let cat = categories[key];
          categorySummary.push(<li key={key} className="category"><span className="label" style={cat.color ? {backgroundColor:cat.color} : {}}></span><span className="count">{cat.count}</span><span className={`amount ${cat.type}`}>{Format.toCurrency(cat.amount)}</span><span className="desc">{key}</span></li>);
        }
      }
    }

    if (this.state.group) {
      // first, group transactions by description (by debit or credit)
      let map = new Map();
      transactions.forEach((trans) => {
        let desc = Transforms.apply(trans.desc);
        let key = desc + (trans.debit ? 'debit' : 'credit');
        if (!map.has(key)) {
          map.set(key, {
            desc: desc,
            count: 0,
            debit: 0,
            credit: 0
          });
        }
        let info = map.get(key);
        info.count++;
        info.credit += trans.credit;
        info.debit += trans.debit;
      });

      // then create array and sort by total cost (descending)
      let temp = [];
      let i = 0;

      for (let [key, info] of map.entries()) {
        info.key = key + 1;
        info.type = info.debit < 0 ? 'debit' : 'credit';
        info.total = info.type === 'debit' ? info.debit : info.credit;
        temp.push(info);
        i++;
      }

      temp.sort((a, b) => {
        if (this.state.sort === 0) {
          // Amount
          if (a.total < b.total) {
            return 1;
          } else if (a.total > b.total) {
            return -1;
          }
        } else if (this.state.sort === 1) {
          // Description
          if (a.desc < b.desc) {
            return -1;
          } else if (a.desc > b.desc) {
            return 1;
          }
        } else if (this.state.sort === 2) {
          // Count
          if (a.count < b.count) {
            return 1;
          } else if (a.count > b.count) {
            return -1;
          }
        }
        return 0;
      });

      temp = temp.map((info) => this.newTransactionGroup(info.desc, info.count, info.type, info.total, info.key));

      transactions = temp;
    } else {
      transactions = transactions.map((trans, i) => this.newTransaction(trans, 'trans-' + i));
    }

    // display options
    let checkbox = <input type="checkbox" onChange={(e) => this.setState({group:e.target.checked})} />;
    let select = <select onChange={(e) => this.setState({sort:parseInt(e.target.value)})}>
      <option value="0">Amount</option>
      <option value="1">Description</option>
      <option value="2">Count</option>
    </select>;

    let detailsDownY;
    let detailsDownHeight = this.state.height;

    let self = this;

    window.onmousemove = (e) => {
      if (detailsDownY) {
        let deltaY = detailsDownY - e.screenY;
        console.log(deltaY);
        self.setState({
          height: detailsDownHeight + deltaY
        })
      }
    };

    return (
      <div id="details" className="details" style={{"height":this.state.height}}>
        <input id="focus" style={{position:'absolute',width:0,height:0,border:'none','backgroundColor':'transparent',display:'hidden'}} />
        <div className="options">Details<label>sort by: {select}</label><label>group: {checkbox}</label></div>
        <div className="transactions-container">
          <label style={{display:categorySummary.length ? 'block' : 'none'}}>Categories:</label>
          <ul className="categories">{categorySummary}</ul>
          <label style={{display:transactions.length ? 'block' : 'none'}}>Transactions:</label>
          <ul className="transactions">{transactions}</ul>
        </div>
        <div className="shadow"></div>
        <div className="divider" onMouseDown={(e) => {
          detailsDownY = e.screenY;
          detailsDownHeight = self.state.height;

          setTimeout(() => {
            let focus = document.getElementById('focus');
            focus.style.display = 'block';
            focus.focus();
          }, 1);
        }} onMouseUp={(e) => {
          let focus = document.getElementById('focus');
          focus.style.display = 'hidden';
        }}></div>
      </div>
    );
  }
}

export default Details;