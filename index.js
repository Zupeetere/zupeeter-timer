const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const todoRoutes = require("./routes/todos");
const moment = require("moment");
// const soment = require("moment-timezone");
require("dotenv").config();
const schedule = require("node-schedule");
// const { default: axios } = require("axios");
// const mysql = require("mysql");
// const { queryDb } = require("./helper/adminHelper");
const OneMinTrx = require("./controller/OneMinTrx");
const ThreeMinTrx = require("./controller/ThreeMinTrx");
const FiveMinTrx = require("./controller/FiveMinTrx");
const OneMinWinGo = require("./controller/OneMinWinGo");
const ThreeMinWinGo = require("./controller/ThreeMinWinGo");
const FiveMinWinGo = require("./controller/FiveMinWinGo");
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
  },
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.use("/api/v1", todoRoutes);

io.on("connection", (socket) => {});

let x = true;
let trx = true;

if (x) {
  console.log("Waiting for the next minute to start...");
  const now = new Date();
  const secondsUntilNextMinute = 60 - now.getSeconds();
  console.log(
    "start after ",
    moment(new Date()).format("HH:mm:ss"),
    secondsUntilNextMinute
  );

  setTimeout(() => {
    OneMinTrx.generatedTimeEveryAfterEveryOneMinTRX(io);
    OneMinWinGo.generatedTimeEveryAfterEveryOneMin(io);
    ThreeMinWinGo.generatedTimeEveryAfterEveryThreeMin(io);
    FiveMinWinGo.generatedTimeEveryAfterEveryFiveMin(io);
    x = false;
  }, secondsUntilNextMinute * 1000);
}

const finalRescheduleJob = schedule.scheduleJob(
  "15,30,45,0 * * * *",
  function () {
    ThreeMinTrx.generatedTimeEveryAfterEveryThreeMinTRX(io);
    FiveMinTrx.generatedTimeEveryAfterEveryFiveMinTRX(io);
  }
);

app.get("/", (req, res) => {
  res.send(`<h1>server running at port=====> ${PORT}</h1>`);
});

httpServer.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

// Create the connection pool
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: "S1s5h71k#",
//   database: process.env.DB_NAME,
//   multipleStatements: true,
//   connectTimeout: 10000,
// });

// // Event listener for new connections
// pool.on("connection", function (_conn) {
//   if (_conn) {
//     console.log(`Connected to the database via threadId ${_conn.threadId}!!`);
//     _conn.query("SET SESSION auto_increment_increment=1");
//   }
// });

// // color prediction game time generated every 1 min
// function generatedTimeEveryAfterEveryOneMin() {
//   const job = schedule.scheduleJob("* * * * * *", async function () {
//     const currentTime = new Date();
//     const timeToSend =
//       currentTime.getSeconds() > 0
//         ? 60 - currentTime.getSeconds()
//         : currentTime.getSeconds();
//     io.emit("onemin", timeToSend); // Emit the formatted time
//     if (timeToSend === 0) {
//       try {
//         const res = await axios.get(
//           "https://admin.zupeeter.com/public/api/resultonemin"
//         );
//       } catch (e) {
//         console.log(e);
//       }
//     }
//   });
// }

// // color prediction game time generated every 3 min
// const generatedTimeEveryAfterEveryThreeMin = () => {
//   let min = 2;

//   const job = schedule.scheduleJob("* * * * * *", async function () {
//     const currentTime = new Date().getSeconds(); // Get the current time
//     const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
//     io.emit("threemin", `${min}_${timeToSend}`);
//     if (currentTime === 0) {
//       min--;
//       if (min < 0) {
//         try {
//           const res = await axios.get(
//             "https://admin.zupeeter.com/public/api/resultthreemin"
//           );
//         } catch (e) {
//           console.log(e);
//         }
//         min = 2; // Reset min to 2 when it reaches 0
//       }
//     }
//   });
// };

// const generatedTimeEveryAfterEveryFiveMin = () => {
//   let min = 4;

//   const job = schedule.scheduleJob("* * * * * *", async function () {
//     const currentTime = new Date().getSeconds(); // Get the current time
//     const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
//     io.emit("fivemin", `${min}_${timeToSend}`);
//     if (currentTime === 0) {
//       min--;
//       if (min < 0) {
//         try {
//           const res = await axios.get(
//             "https://admin.zupeeter.com/public/api/resultfivemin"
//           );
//         } catch (e) {
//           console.log(e);
//         }
//         min = 4; // Reset min to 2 when it reaches 0
//       }
//     }
//     if (timeToSend === 0) {
//     }
//   });
// };

// // Function to insert data into trxonetable
// function insertIntoTrxonetable(manual_result, time, obj, callback) {
//   const newString = obj.hash;
//   let num = null;
//   for (let i = newString.length - 1; i >= 0; i--) {
//     if (!isNaN(parseInt(newString[i]))) {
//       num = parseInt(newString[i]);
//       break;
//     }
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting database connection: ", err);
//       return callback(err);
//     }
//     let timee = moment(time).format("HH:mm:ss");
//     let hash = `**${obj.hash.slice(-4)}`;
//     let overall = JSON.stringify(obj);
//     let trdigit = `${obj.hash.slice(-5)}`;
//     let tr_number = obj.number;

//     ///////////////////////  update num /////////////////////

//     // Execute the query
//     const query_id =
//       "SELECT tr_tranaction_id,tr_price FROM tr_game WHERE tr_id = 1";
//     connection.query(query_id, (error, results) => {
//       const sqlupdatequery = `UPDATE tr_game SET tr_tranaction_id = ${
//         Number(results?.[0]?.tr_tranaction_id) + 1
//       }, tr_price = ${Number(results?.[0]?.tr_price) + 1} WHERE tr_id = 1`;
//       connection.query(sqlupdatequery, (error, res) => {
//         if (error) {
//           console.error("Error executing query: ", error);
//           // return callback(error);
//         }
//       });
//       const sql =
//         "INSERT INTO tr42_win_slot (tr41_slot_id, tr_block_time, tr41_packtype,tr_transaction_id,tr_price,tr_hashno,tr_overall_hash,tr_digits,tr_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; // Adjust the columns and values as per your table structure
//       const sql43 =
//         "INSERT INTO tr43_win_slot (tr41_slot_id, tr_block_time, tr41_packtype,tr_transaction_id,tr_price,tr_hashno,tr_overall_hash,tr_digits,tr_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"; // Adjust the columns and values as per your table structure

//       connection.query(
//         sql43,
//         [
//           manual_result > 0 ? manual_result : num + 1,
//           timee,
//           1,
//           Number(results?.[0]?.tr_tranaction_id) + 1,
//           Number(results?.[0]?.tr_price) + 1,
//           hash,
//           overall,
//           trdigit,
//           tr_number,
//         ],
//         (error, res) => {
//           if (error) console.log(err);
//         }
//       );
//       // Release the connection back to the pool
//       connection.query(
//         sql,
//         [
//           manual_result > 0 ? manual_result : num + 1,
//           timee,
//           1,
//           Number(results?.[0]?.tr_tranaction_id) + 1,
//           Number(results?.[0]?.tr_price) + 1,
//           hash,
//           overall,
//           trdigit,
//           tr_number,
//         ],
//         (error, result) => {
//           if (error) {
//             console.error("Error executing query: ", error);
//             return callback(error);
//           }
//         }
//       );

//       connection.release();

//       // Return the results via the callback
//       callback(null, results);
//     });
//   });
// }

// // TRX
// // color prediction game time generated every 1 min
// function generatedTimeEveryAfterEveryOneMinTRX() {
//   let isAlreadyHit = "";
//   let result = "";
//   let manual_result = "";
//   const rule = new schedule.RecurrenceRule();
//   rule.second = new schedule.Range(0, 59);
//   const job = schedule.scheduleJob(rule, async function () {
//     const currentTime = new Date();
//     const timeToSend =
//       currentTime.getSeconds() > 0
//         ? 60 - currentTime.getSeconds()
//         : currentTime.getSeconds();
//     io.emit("onemintrx", timeToSend);
//     if (timeToSend === 0) io.emit("result", result);
//     if (timeToSend === 58) {
//       const query_data = `UPDATE tr41_trx_result  SET tr41_status=2 WHERE tr41_type=1;`;
//       await queryDb(query_data, [])
//         .then(async (result) => {})
//         .catch((e) => {
//           console.log(e);
//         });
//     }
//     if (timeToSend === 12) {
//       const datetoAPISend = parseInt(new Date().getTime().toString());
//       const actualtome = soment.tz("Asia/Kolkata");
//       const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

//       /////////////////////////////
//       const queryformanualresult = `SELECT tr41_packid FROM tr41_trx_result WHERE tr41_type=1 AND tr41_status=1 LIMIT 1`;
//       await queryDb(queryformanualresult, [])
//         .then((result) => {
//           if (result?.length > 0) {
//             manual_result = result?.[0]?.tr41_packid;
//           } else {
//             manual_result = 0;
//           }
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//       /////////////////////////////
//       try {
//         setTimeout(async () => {
//           const res = await axios.get(
//             `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
//           );
//           if (res?.data?.data?.[0]) {
//             const obj = res?.data?.data?.[0];
//             const fd = new FormData();
//             fd.append("hash", `**${obj?.hash.slice(-4)}`);
//             fd.append("digits", `${obj?.hash.slice(-5)}`);
//             fd.append("number", obj?.number);
//             fd.append("time", moment(time).format("HH:mm:ss"));
//             let prevalue = `${moment(time).format("HH:mm:ss")}`;
//             const newString = obj?.hash;
//             let num = null;
//             for (let i = newString?.length - 1; i >= 0; i--) {
//               if (!isNaN(parseInt(newString[i]))) {
//                 num = parseInt(newString[i]);
//                 break;
//               }
//             }
//             fd.append("slotid", num);
//             fd.append("overall", JSON.stringify(obj));
//             //  trx 1
//             console.log(num, moment(time).format("HH:mm:ss"), "result");
//             try {
//               if (String(isAlreadyHit) === String(prevalue)) return;
//               // const response = await axios.post(
//               //   "https://admin.zupeeter.com/Apitrx/insert_one_trx",
//               //   fd
//               // );
//               const newString = obj.hash;
//               let num = null;
//               for (let i = newString.length - 1; i >= 0; i--) {
//                 if (!isNaN(parseInt(newString[i]))) {
//                   num = parseInt(newString[i]);
//                   break;
//                 }
//               }
//               result = num + 1;
//               insertIntoTrxonetable(
//                 manual_result,
//                 time,
//                 obj,
//                 (err, results) => {
//                   if (err) {
//                     console.error("Error inserting data: ", err);
//                   } else {
//                     console.log("Data inserted successfully: ", results);
//                   }
//                 }
//               );
//               isAlreadyHit = prevalue;
//             } catch (e) {
//               console.log(e);
//             }
//           }
//         }, [6000]);
//       } catch (e) {
//         console.log(e);
//       }
//     }
//   });
// }

// const generatedTimeEveryAfterEveryThreeMinTRX = () => {
//   let min = 2;
//   twoMinTrxJob = schedule.scheduleJob("* * * * * *", function () {
//     const currentTime = new Date().getSeconds(); // Get the current time
//     const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
//     io.emit("threemintrx", `${min}_${timeToSend}`);
//     // if (min === 0 && timeToSend === 6) {
//     //   const datetoAPISend = parseInt(new Date().getTime().toString());
//     //   const actualtome = soment.tz("Asia/Kolkata");
//     //   const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
//     //   try {
//     //     setTimeout(async () => {
//     //       const res = await axios.get(
//     //         `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
//     //       );
//     //       if (res?.data?.data[0]) {
//     //         const obj = res.data.data[0];
//     //         const fd = new FormData();
//     //         fd.append("hash", `**${obj.hash.slice(-4)}`);
//     //         fd.append("digits", `${obj.hash.slice(-5)}`);
//     //         fd.append("number", obj.number);
//     //         fd.append("time", moment(time).format("HH:mm:ss"));
//     //         const newString = obj.hash;
//     //         let num = null;
//     //         for (let i = newString.length - 1; i >= 0; i--) {
//     //           if (!isNaN(parseInt(newString[i]))) {
//     //             num = parseInt(newString[i]);
//     //             break;
//     //           }
//     //         }
//     //         fd.append("slotid", num);
//     //         fd.append("overall", JSON.stringify(obj));
//     //         //  trx 3
//     //         try {
//     //           console.log("functoin call for 3 min");
//     //           const response = await axios.post(
//     //             "https://admin.zupeeter.com/Apitrx/insert_three_trx",
//     //             fd
//     //           );
//     //         } catch (e) {
//     //           console.log(e);
//     //         }
//     //       }
//     //     }, [6000]);
//     //   } catch (e) {
//     //     console.log(e);
//     //   }
//     // }
//     if (currentTime === 0) {
//       min--;
//       if (min < 0) min = 2; // Reset min to 2 when it reaches 0
//     }
//   });
// };

// const generatedTimeEveryAfterEveryFiveMinTRX = () => {
//   let min = 4;
//   threeMinTrxJob = schedule.scheduleJob("* * * * * *", function () {
//     const currentTime = new Date().getSeconds(); // Get the current time
//     const timeToSend = currentTime > 0 ? 60 - currentTime : currentTime;
//     io.emit("fivemintrx", `${min}_${timeToSend}`);
//     // if (min === 0 && timeToSend === 6) {
//     //   const datetoAPISend = parseInt(new Date().getTime().toString());
//     //   const actualtome = soment.tz("Asia/Kolkata");
//     //   const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();
//     //   try {
//     //     setTimeout(async () => {
//     //       const res = await axios.get(
//     //         `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`
//     //       );
//     //       if (res?.data?.data[0]) {
//     //         const obj = res.data.data[0];
//     //         const fd = new FormData();
//     //         fd.append("hash", `**${obj.hash.slice(-4)}`);
//     //         fd.append("digits", `${obj.hash.slice(-5)}`);
//     //         fd.append("number", obj.number);
//     //         fd.append("time", moment(time).format("HH:mm:ss"));
//     //         const newString = obj.hash;
//     //         let num = null;
//     //         for (let i = newString.length - 1; i >= 0; i--) {
//     //           if (!isNaN(parseInt(newString[i]))) {
//     //             num = parseInt(newString[i]);
//     //             break;
//     //           }
//     //         }
//     //         fd.append("slotid", num);
//     //         fd.append("overall", JSON.stringify(obj));
//     //         //  trx 3
//     //         try {
//     //           console.log("functoin call for 5 min");
//     //           const response = await axios.post(
//     //             "https://admin.zupeeter.com/Apitrx/insert_five_trx",
//     //             fd
//     //           );
//     //         } catch (e) {
//     //           console.log(e);
//     //         }
//     //       }
//     //     }, [6000]);
//     //   } catch (e) {
//     //     console.log(e);
//     //   }
//     // }
//     if (currentTime === 0) {
//       min--;
//       if (min < 0) min = 4;
//     }
//   });
// };
