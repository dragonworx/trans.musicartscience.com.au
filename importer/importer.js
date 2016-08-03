const headers = require('./headers.js');

module.exports = function importer(filePath) {
  return new Promise((resolve, reject) => {
    var basicCSV = require("basic-csv");
    var data = [];
    var headerRow;

    basicCSV.readCSV(filePath, {
      //dropHeader: true
    }, (error, rows) => {
      if (error) {
        reject(error);
      }

      rows.forEach((row, i) => {
        if (i === 0) {
          headerRow = row;
        } else {
          var dataRow = {};
          headerRow.forEach((header, j) => {
            dataRow[headers[header]] = row[j];
          });
          data.push(dataRow);
        }
      });
      
      resolve(data);
    });
  });
};