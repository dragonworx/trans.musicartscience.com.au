import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
    }

    onClick(e) {
        console.log(this, e);
    }

    render() {
        return (
            <p onClick={this.onClick.bind(this)}>Hello!</p>
        );
    }
}

export default App;