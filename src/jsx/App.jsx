import React from 'react'
import ReactDOM from 'react-dom'

import Calendar from './calendar/Calendar.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedDay: null,
            selectedMonth: null,
            searchText: null,
            searchMatches: null
        };
    }
    
    getAccount() {
        return this.refs.calendar.getAccount();
    }

    render() {
        return (
            <Calendar ref="calendar" config={this.props.config} app={this}></Calendar>
        );
    }
}

export default App;