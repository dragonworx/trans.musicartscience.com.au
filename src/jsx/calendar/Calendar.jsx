import React from 'react'
//import ReactDOM from 'react-dom'
import query from '../../query.js'
import Month from './Month.jsx'
import Details from './Details.jsx'
import Search from './Search.jsx'
import util from '../../../util.js'

const monthNames = Month.monthNames;

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    let accountNames = [];
    for (var key in this.props.config.accounts) {
      accountNames.push(key);
    }

    this.state = {
      transactions: [],
      accountNames: accountNames
    };
  }
  
  renderDays(key) {
    let days = [];
    for (var i = 0; i < 31; i++) {
      let j = util.padNum(i + 1);
      days.push(<option value={j} key={key + j}>{j}</option>);
    }
    return days;
  }
  
  renderMonths(key) {
    let months = [];
    for (var i = 0; i < 12; i++) {
      let monthName = monthNames[i];
      months.push(<option value={monthName} key={key + monthName}>{monthName}</option>);
    }
    return months;
  }
  
  renderYears(key) {
    let thisYear = (new Date()).getFullYear();
    let years = [];
    for (var i = thisYear - 5; i < thisYear + 5; i++) {
      years.push(<option value={i} key={key + i}>{i}</option>);
    }
    return years;
  }

  onSelectChange(key) {
    localStorage[key] = this.refs[key].value;
  }

  renderSelect(key, fn, defaultValue) {
    return <select ref={key}
            defaultValue={localStorage[key] ? localStorage[key] : defaultValue}
            onChange={this.onSelectChange.bind(this, key)}>
      {fn(key)}</select>
  }

  setToToday(key) {
    let d = new Date();
    this.refs[key + '_day'].value = util.padNum(d.getDate());
    this.refs[key + '_month'].value = monthNames[d.getMonth()];
    this.refs[key + '_year'].value = d.getFullYear();
    this.onSelectChange(key + '_day');
    this.onSelectChange(key + '_month');
    this.onSelectChange(key + '_year');
  }
  
  load() {
    var fromDate = new Date(parseInt(this.refs.from_year.value, 10), parseInt(monthNames.indexOf(this.refs.from_month.value) + 1, 10), parseInt(this.refs.from_day.value, 10)).getTime();
    var toDate = new Date(parseInt(this.refs.to_year.value, 10), parseInt(monthNames.indexOf(this.refs.to_month.value) + 1, 10), parseInt(this.refs.to_day.value, 10)).getTime();

    query.byDateRange(fromDate, toDate, this.refs.account.value).then((transactions) => {
      var mapByYearMonth = new Map();

      for (var transaction of transactions) {
        let keyByYearMonth = transaction.date.getFullYear() + '.' + (transaction.date.getMonth() + 1);
        if (!mapByYearMonth.has(keyByYearMonth)) {
          mapByYearMonth.set(keyByYearMonth, new Map());
        }
        let mapByDay = mapByYearMonth.get(keyByYearMonth);
        let day = transaction.date.getDate();
        if (!mapByDay.has(day)) {
          mapByDay.set(day, []);
        }
        let array = mapByDay.get(day);
        array.push(transaction);
      }

      this.props.app.setState({
        selectedDay: null,
        selectedMonth: null,
        searchText: null,
        searchMatches: null
      });
      
      this.setState({
        transactions: transactions,
        map: mapByYearMonth
      });
    });
  }

  getAccount() {
    return this.refs.account.value;
  }

  render() {
    let months = [];

    if (this.state.map) {
      let index = 0;
      for (let [keyByYearMonth, mapByDay] of this.state.map.entries()) {
        let [year, month] = keyByYearMonth.split('.');
        year = parseInt(year, 10);
        month = parseInt(month, 10);
        months.push(<Month app={this.props.app} year={year} month={month} transactions={mapByDay} key={keyByYearMonth} index={index} indexLength={this.state.map.size} />);
        index++;
      }
    }

    return (
      <calendar>
        <div className="range">
          <label>Account:
            <select ref="account"
                    onChange={() => localStorage['account'] = this.refs.account.value}
                    defaultValue={localStorage['account'] ? localStorage['account'] : this.state.accountNames[0]}>
              {this.state.accountNames.map((accountName) => <option value={accountName} key={'account_' + accountName}>{accountName}</option>)}
            </select>
          </label>
          <label>From:
            {this.renderSelect('from_day', this.renderDays.bind(this), util.padNum(1))}
            {this.renderSelect('from_month', this.renderMonths.bind(this), monthNames[new Date().getMonth()])}
            {this.renderSelect('from_year', this.renderYears.bind(this), new Date().getFullYear())}
          </label>
          <label>To:<a title="Set to today"><button className="today" onClick={this.setToToday.bind(this, 'to')} /></a>
            {this.renderSelect('to_day', this.renderDays.bind(this), util.padNum(new Date().getDate()))}
            {this.renderSelect('to_month', this.renderMonths.bind(this), monthNames[new Date().getMonth()])}
            {this.renderSelect('to_year', this.renderYears.bind(this), new Date().getFullYear())}
          </label>
          <button id="load" onClick={this.load.bind(this)}>Load</button>
        </div>
        <div className="data">
          <div className="options">
            Calendar
            <Search app={this.props.app} transactions={this.state.map}></Search>
          </div>
          <div className="months">
            {months}
          </div>
          <Details app={this.props.app} />
        </div>
      </calendar>
    );
  }
}

export default Calendar;