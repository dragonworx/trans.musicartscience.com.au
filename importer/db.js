const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'my_db'
});

module.exports = {
  connect: function () {
    connection.connect(); 
  },
  end: function () {
    connection.end();
  },
  query: function (query) {
    return new Promise((resolve, reject) => {
      connection.query(query, function (err, result) {
        if (err) {
          throw err;
        }
        resolve(result)
      });
    });
  },
  deleteAll: function (tableName) {
    // return Promise.resolve();
    return this.query(`DELETE FROM ${tableName}`);
  }
};