"use strict";

const db = require("./db");

// get plane type and number of total seats give plane id
exports.getPlaneInfo = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, type, rows, seats_per_row, tot_seats FROM planes";
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      }
      if (rows == undefined) {
        resolve({ error: "Plane not found" });
      } else {
        resolve(rows.map((e) => e));
      }
    });
  });
};
