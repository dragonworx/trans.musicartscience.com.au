import React from 'react'
import ReactDOM from 'react-dom'
import Day from './Day.jsx'
import AccountOverview from './AccountOverview.jsx'
import Format from '../../format.js'

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDay: null
    };
  }
  
  newDay(date, enabled, key) {
    return <Day app={this.props.app} date={date} enabled={enabled} key={'day-' + key} weekDay={daysOfWeek[date.getDay()]} transactions={this.props.transactions.get(date.getDate())} />
  }

  onClick(e) {
    this.props.app.setState({
      selectedDay: null,
      selectedMonth: {
        year: this.props.year,
        month: this.props.month,
        transactions: this.props.transactions
      }
    });
  }

  render() {
    let selectedMonth = this.props.app.state.selectedMonth;

    // header
    let year;
    if (this.props.month === 1 || this.props.month === 12 || this.props.index === 0 || this.props.index === this.props.indexLength - 1) {
      year = <div className={`year ${this.props.index === 0 ? 'first' : this.props.index === this.props.indexLength - 1 ? 'last' : ''}`}>{this.props.year}</div>
    }

    // days
    let days = [];
    let firstDayOfMonth = new Date(this.props.year, this.props.month - 1, 1);
    let lastDayOfMonth = new Date(this.props.year, this.props.month, 0);

    let firstDayOfWeek = firstDayOfMonth.getDay();
    let lastDayOfWeek = lastDayOfMonth.getDay();
    let leadingDaysCount = Math.max(firstDayOfWeek, 0);
    let trailingDaysCount = 7 - (lastDayOfWeek + 1);

    // leading days
    for (let i = 0; i < leadingDaysCount; i++) {
      days.push(this.newDay(new Date(this.props.year, this.props.month - 1, 1 - (leadingDaysCount - i)), false, 'leading-' + i));
    }

    // month days
    for (let i = 0; i < lastDayOfMonth.getDate(); i++) {
      days.push(this.newDay(new Date(this.props.year, this.props.month - 1, i + 1), true, 'month-' + i));
    }

    // trailing days
    for (let i = 0; i < trailingDaysCount; i++) {
      days.push(this.newDay(new Date(this.props.year, this.props.month, i + 1), false, 'trailing-' + i));
    }

    // totals
    let debits = 0;
    let credits = 0;
    for (let [keyByYearMonth, mapByDay] of this.props.transactions.entries()) {
      mapByDay.forEach((trans) => {
        if (trans.debit) {
          debits += trans.debit;
        }
        if (trans.credit) {
          credits += trans.credit;
        }
      });
    }

    return (
      <div className={`month ${selectedMonth && (selectedMonth.month === this.props.month && selectedMonth.year === this.props.year) ? 'selected' : ''}`}>
        <div className="header" onClick={this.onClick.bind(this)}>
          {year}
          <span className="total debit">{Format.toCurrency(debits)}</span>
          <div className="name">{monthNames[this.props.month - 1]}</div>
          <span className="total credit">{Format.toCurrency(credits)}</span>
        </div>
        <div className="dayOfWeek Sun">Sun</div>
        <div className="dayOfWeek Mon">Mon</div>
        <div className="dayOfWeek Tue">Tue</div>
        <div className="dayOfWeek Wed">Wed</div>
        <div className="dayOfWeek Thu">Thu</div>
        <div className="dayOfWeek Fri">Fri</div>
        <div className="dayOfWeek Sat">Sat</div>
        <div className="days">
          {days}
        </div>
        <AccountOverview monthName={monthNames[this.props.month - 1]} transactions={this.props.transactions} />
      </div>
    );
  }
}

Month.monthNames = monthNames;

export default Month;