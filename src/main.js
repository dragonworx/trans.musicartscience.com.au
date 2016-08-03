/**
 * @fileOverview Main entry point for build. WebPack will crawl the dependencies used from here on to bundle.
 */
// npm dependencies

// src dependencies
//import './three'; // use custom global shim rather than importing THREE directly
//import GraphicsEngine from './graphics-engine.js';

import React from 'react'
import ReactDOM from 'react-dom'

import ToolBar from './jsx/ToolBar.jsx'
import App from './arena/App.js'
import './layout.js'

console.clear();

// create main jsx component and render into #main element
var app = window['app'] = new App();
window['EVENT'] = App.EVENT;

ReactDOM.render(<ToolBar />, document.getElementById('layout-top'));

//setTimeout(function () {
//    app.newProject('fred');
//}, 2000);

// create graphics engine
//let canvas = document.getElementById('gfx-canvas'); // created in App.jsx
//let gfx = new GraphicsEngine({canvas:canvas});
//window['gfx'] = gfx; // debugging only!!
//gfx.start();