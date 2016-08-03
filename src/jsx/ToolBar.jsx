import React from 'react'
import ReactDOM from 'react-dom'
import ToolBarItem from './ToolBarItem.jsx'

class ToolBar extends React.Component {
    constructor(props) {
        super(props);
        // set defaults
        this.props = {};
        this.state = {
            selected: null
        };

        app.on('action', function (data) {
            this.setState({selected:data.type});
        }.bind(this));
    }

    render() {
        return (
            <ul id="toolbar">
                <li>{this.state.selected}</li>
                <ToolBarItem type={ToolBarItem.BUTTON} label="foo" />
            </ul>
        );
    }
}

export default ToolBar;