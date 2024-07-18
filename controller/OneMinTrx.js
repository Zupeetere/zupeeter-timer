const schedule = require("node-cron");
const {
  queryDb,
  funciotnForInsertDataInTR_43,
  funciotnForInsertDataInTR_42,
  functionToUpdateTheTransId,
  functionToUpdateTheManualResult,
  functionToGetTheManualResult,
} = require("../helper/adminHelper");
const moment = require("moment");
const soment = require("moment-timezone");
const { default: axios } = require("axios");

exports.generatedTimeEveryAfterEveryOneMinTRX = (io) => {
  let isAlreadyHit = "";
  let result = "";
  let manual_result = "";
  try {
    const job = schedule.schedule("* * * * * *", async function () {
      const currentTime = new Date();
      const timeToSend =
        currentTime.getSeconds() > 0
          ? 60 - currentTime.getSeconds()
          : currentTime.getSeconds();
      io.emit("onemintrx", timeToSend);
      if (timeToSend === 0) io.emit("result", result);
      if (timeToSend === 58) {
        await functionToUpdateTheManualResult([])
          .then((result) => {})
          .catch((e) => {
            console.log(e);
          });
      }
      if (timeToSend === 12) {
        const datetoAPISend = parseInt(new Date().getTime().toString());
        const actualtome = soment.tz("Asia/Kolkata");
        const time = actualtome.add(5, "hours").add(30, "minutes").valueOf();

        /////////////////////////////
        await functionToGetTheManualResult([])
          .then((result) => {
            if (result?.length > 0) {
              manual_result = result?.[0]?.tr41_packid;
            } else {
              manual_result = 0;
            }
          })
          .catch((e) => {
            console.log(e);
          });
        /////////////////////////////
        console.log(datetoAPISend, "Time to send tron api");
        // `https://apilist.tronscanapi.com/api/block?sort=-balance&start=0&limit=20&producer=&number=&start_timestamp=${datetoAPISend}&end_timestamp=${datetoAPISend}`,

        try {
          datetoAPISend &&
            setTimeout(async () => {
              await axios
                .get(
                  `https://apilist.tronscanapi.com/api/block`,
                  {
                    params: {
                      sort: "-balance",
                      start: "0",
                      limit: "20",
                      producer: "",
                      number: "",
                      start_timestamp: datetoAPISend,
                      end_timestamp: datetoAPISend,
                    },
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                .then((res) => {
                  if (res?.data?.data?.[0]) {
                    const obj = res?.data?.data?.[0];
                    const fd = new FormData();
                    fd.append("hash", `**${obj?.hash.slice(-4)}`);
                    fd.append("digits", `${obj?.hash.slice(-5)}`);
                    fd.append("number", obj?.number);
                    fd.append("time", moment(time).format("HH:mm:ss"));
                    let prevalue = `${moment(time).format("HH:mm:ss")}`;
                    const newString = obj?.hash;
                    let num = null;
                    for (let i = newString?.length - 1; i >= 0; i--) {
                      if (!isNaN(parseInt(newString[i]))) {
                        num = parseInt(newString[i]);
                        break;
                      }
                    }
                    fd.append("slotid", num);
                    fd.append("overall", JSON.stringify(obj));
                    try {
                      if (String(isAlreadyHit) === String(prevalue)) return;
                      // const response = await axios.post(
                      //   "https://admin.zupeeter.com/Apitrx/insert_one_trx",
                      //   fd
                      // );
                      const newString = obj.hash;
                      let num = null;
                      for (let i = newString.length - 1; i >= 0; i--) {
                        if (!isNaN(parseInt(newString[i]))) {
                          num = parseInt(newString[i]);
                          break;
                        }
                      }
                      result = num + 1;
                      insertIntoTrxonetable(
                        manual_result,
                        time,
                        obj,
                        (err, results) => {
                          if (err) {
                            console.error("Error inserting data: ", err);
                          } else {
                            console.log(
                              "Data inserted successfully: ",
                              results
                            );
                          }
                        }
                      );
                      isAlreadyHit = prevalue;
                    } catch (e) {
                      console.log(e);
                    }
                  }
                })
                .catch((e) => {
                  console.log("error in tron api");
                  // console.log(e);
                });
            }, [6000]);
        } catch (e) {
          console.log(e);
        }
      }
    });
  } catch (e) {
    console.log(e);
  }
};

async function insertIntoTrxonetable(manual_result, time, obj, callback) {
  const newString = obj.hash;
  let num = null;
  for (let i = newString.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(newString[i]))) {
      num = parseInt(newString[i]);
      break;
    }
  }

  let timee = moment(time).format("HH:mm:ss");
  let hash = `**${obj.hash.slice(-4)}`;
  let overall = JSON.stringify(obj);
  let trdigit = `${obj.hash.slice(-5)}`;
  let tr_number = obj.number;

  ///////////////////////  update num /////////////////////

  // Execute the query
  const query_id =
    "SELECT tr_tranaction_id,tr_price FROM tr_game WHERE tr_id = 1";
  await queryDb(query_id, [])
    .then(async (results) => {
      //////////////// this is the way to update the transactoin id
      await functionToUpdateTheTransId([
        Number(results?.[0]?.tr_tranaction_id) + 1,
        Number(results?.[0]?.tr_price) + 1,
      ])
        .then((result) => {})
        .catch((e) => console.log(e));
      ///////// now insert the data into the tr43

      await funciotnForInsertDataInTR_43([
        manual_result > 0 ? manual_result : num + 1,
        timee,
        1,
        Number(results?.[0]?.tr_tranaction_id) + 1,
        Number(results?.[0]?.tr_price) + 1,
        hash,
        overall,
        trdigit,
        tr_number,
      ])
        .then((result) => {})
        .catch((e) => console.log(e));
      ///////////////// now insert the data into the tr42
      await funciotnForInsertDataInTR_42([
        manual_result > 0 ? manual_result : num + 1,
        timee,
        1,
        Number(results?.[0]?.tr_tranaction_id) + 1,
        Number(results?.[0]?.tr_price) + 1,
        hash,
        overall,
        trdigit,
        tr_number,
      ])
        .then((result) => {})
        .catch((e) => console.log(e));
    })
    .catch((e) => {
      console.log(e);
    });
}
