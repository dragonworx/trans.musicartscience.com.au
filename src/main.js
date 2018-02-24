import React from 'react'
import ReactDOM from 'react-dom'
import './debug.js'
import App from './jsx/App.jsx'
import Transforms from './transforms.js'

json('/js/config.json').then((config) => {
  window.config = Transforms.config = config;
  window['app'] = ReactDOM.render(<App config={config}/>, document.getElementById('main'));

  setTimeout(() => $('#load').trigger('click'), 150);
});