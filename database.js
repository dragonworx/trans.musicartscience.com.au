const SQL = require('sequelize');
let db = new SQL(process.env.PG, {
  logging: () => {}
});

const schemas = require('./database-schemas');
const config = require('./database-config');

let modelSync = [];
let models = {};

Object.keys(schemas).forEach((modelName) => {
  let model = db.define(modelName, schemas[modelName], {
    freezeTableName: true
  });
  modelSync.push(model.sync({
    force: config.force
  }));
  models[modelName] = model;
});

module.exports = new Promise((resolve, reject) => {
  Promise.all(modelSync).then(() => {
    resolve(models);
  }).catch((err) => {
    reject(err);
  });
});