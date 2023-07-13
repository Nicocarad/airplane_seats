"use strict";

const db = require("./db");

// get all the seats given plane id
exports.getSeats = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM plane_seats WHERE plane_id = ?";
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows.map((e) => e));
    });
  });
};

// given a user_id and an array of seats, set the cod_user associeted to seat_id(s) to user_id
exports.bookSeats = (user_id, seat_id) => {
  const sql = "UPDATE plane_seats SET cod_user = ? WHERE id = ?";
  return new Promise((resolve, reject) => {
    db.run(sql, [user_id, seat_id], (error, result) => {
      if (error) {
        console.error(error); // Log the error for debugging purposes
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// given a user_id and a plane_type, set the cod_user associeted to that seat_id to NULL
exports.deleteSeats = (user_id, plane_id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE plane_seats SET cod_user = NULL WHERE cod_user = ? AND plane_id=?";
    db.run(sql, [user_id, plane_id], (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// given a seat id returns an user_id if it already been booked, NULL otherwise
exports.checkSeats = (seat_id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT cod_user FROM plane_seats WHERE id = ?";
    db.get(sql, [seat_id], (err, row) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
