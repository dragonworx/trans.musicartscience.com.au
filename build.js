const fs = require('fs');
const watch = require('watch-glob');
const cli = require('cli-color');
const sass = require('node-sass');
const webpack = require("webpack");
const webpackConfig = require('./webpack.config');
const log = require('./log.js');

function renderSass() {
  return new Promise(function (resolve, reject) {
    log.begin('Rendering sass file...');
    var result = sass.renderSync({
      file: './src/style.scss'
    });

    fs.writeFileSync('./public/css/style.css', result.css.toString());
    log.ok();
    resolve();
  });
}


function watchForChanges() {
  log.main('Watching...');
  watch(['src/*', 'src/**/*', 'public/*', 'public/**/*', '!public/js/bundle.js', '!public/css/style.css'],
    {callbackArg:'relative'},
    function onAdded(filePath) {
      log.notify('Changed/Added: '+ filePath);
      rebuild();
    }, function onDeleted(filePath) {
      log.notify('Deleted: '+ filePath);
      rebuild();
    }
  );
  return Promise.resolve();
}

function build() {
  log.main('Building...');
  return new Promise(function (resolve, reject) {
    var compiler = webpack(webpackConfig);
    log.begin('Building from src/*...');
    compiler.run(function(err, stats) {
      if (err) {
        log.error(err);
        reject();
      } else {
        log.ok();
        resolve();
      }
    });
  });
}

function serve() {
  log.main('Serving http://localhost:3000');
  return new Promise(function (resolve, reject) {
    require('./bin/www');
    resolve();
  });
}

function rebuild() {
  build().then(renderSass);
}

build()
  .then(renderSass)
  .then(serve)
  .then(watchForChanges);