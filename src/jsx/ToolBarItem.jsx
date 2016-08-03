import React from 'react'
import ReactDOM from 'react-dom'

class ToolBarItem extends React.Component {
    constructor(props) {
        super(props);
        // set defaults
        this.props = {};
        this.state = {};
    }

    render() {
        var element;
        if (this.props.type === ToolBarItem.BUTTON) {
            element = <button onClick={this.onClick.bind(this)}>{this.props.label}</button>
        }
        return <li>{element}</li>
    }

    onClick() {
        app.publish(EVENT.TOOLBAR.ACTION, {type:this.props.type})
    }
}

ToolBarItem.BUTTON = 'button';

export default ToolBarItem;