import React from 'react'
import ReactDOM from 'react-dom'

import App from './jsx/App.jsx'

var app = window['app'] = <App />;

ReactDOM.render(app, document.getElementById('main'));

$.getJSON('/test', {x:1}, function (data) {
  alert(JSON.stringify(data));
});