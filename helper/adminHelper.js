"user strict";
var sql = require("../config/db.config");
// const path = require("path");

module.exports = {
  getAlredyPlacedBet: function (params) {
    let query_string =
      "SELECT tr_package FROM tr35_retopup_temp WHERE tr_transid = ? AND tr_user_id = ? AND tr_type = 1";
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(query_string, param, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  queryDb: function (query, param) {
    return new Promise((resolve, reject) => {
      sql.query(query, param, (err, result) => {
        if (err) {
          //return reject(err);
          return console.log(err);
        }
        resolve(result);
      });
    });
  },
};
