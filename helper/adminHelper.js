"user strict";
var sql = require("../config/db.config");
// const path = require("path");

module.exports = {
  funciotnForInsertDataInTR_42: function (params) {
    const sql42 =
      "INSERT INTO tr42_win_slot (tr41_slot_id, tr_block_time, tr41_packtype,tr_transaction_id,tr_price,tr_hashno,tr_overall_hash,tr_digits,tr_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; // Adjust the columns and values as per your table structure
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(sql42, param, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  funciotnForInsertDataInTR_43: function (params) {
    const sql43 =
      "INSERT INTO tr43_win_slot (tr41_slot_id, tr_block_time, tr41_packtype,tr_transaction_id,tr_price,tr_hashno,tr_overall_hash,tr_digits,tr_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; // Adjust the columns and values as per your table structure
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(sql43, param, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  functionToUpdateTheTransId: function (params) {
    const sqlupdatequery = `UPDATE tr_game SET tr_tranaction_id = ?, tr_price = ? WHERE tr_id = 1`;
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(sqlupdatequery, param, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  functionToUpdateTheManualResult: function (params) {
    const query_data = `UPDATE tr41_trx_result  SET tr41_status=2 WHERE tr41_type=1;`;
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(query_data, param, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  },
  functionToGetTheManualResult: function (params) {
    const queryformanualresult = `SELECT tr41_packid FROM tr41_trx_result WHERE tr41_type=1 AND tr41_status=1 LIMIT 1`;
    let param = params;
    return new Promise((resolve, reject) => {
      sql.query(queryformanualresult, param, (err, result) => {
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
