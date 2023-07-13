"use strict";

const SERVER_URL = "http://localhost:3001/api/";

// Parse the HTTP response
const getJson = (httpResponsePromise) =>
  new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        response
          .json()
          .then((json) => {
            if (response.ok) {
              resolve(json);
            } else {
              reject(json);
            }
          })
          .catch((err) => {
            reject({ error: "Cannot parse server response: " + err });
          });
      })
      .catch((err) => {
        reject({ error: "Cannot communicate: " + err });
      });
  });


  const logIn = async (credentials) => {
    return getJson(
      fetch(SERVER_URL + "sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      })
    );
  };


  const logOut = async () => {
    return getJson(
      fetch(SERVER_URL + "sessions/current", {
        method: "DELETE",
        credentials: "include",
      })
    );
  };




  const getUserInfo = async () => {
    return getJson(
      fetch(SERVER_URL + "sessions/current", {
        credentials: "include",
      })
    );
  };





// given the seat id, associates a user_id to it
const confirmBooking = async (seat_id) => {
  return getJson(
    fetch(SERVER_URL + "reserve", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        seat_id: seat_id,
      }),
    })
  );
};

// given a plane_id, sets all seats associated to the current user to null
const deleteBooking = async (plane_id) => {
  return getJson(
    fetch(SERVER_URL + "delete" , {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        plane_id: plane_id,
      }),
    })
  );
};


// given a seat id, returns the asscoiated cod_user
const checkSeatBooking = async (seat_id) => {
  return getJson(
    fetch(SERVER_URL + "check/" + seat_id, { credentials: "include" })
  ).then((json) => {
    const seatCodUser = {
      cod_user: json.cod_user,
    };
    return seatCodUser;
  });
};



// gets all the info of planes
const getPlaneInfo = async () => {
  return getJson(fetch(SERVER_URL + "plane_info")).then((json) => {
    return json.map((plane) => {
      const clientPlane = {
        id: plane.id,
        type: plane.type,
        rows: plane.rows,
        seats_per_row: plane.seats_per_row,
        tot_seats: plane.tot_seats,
      };
      return clientPlane;
    });
  });
};


// returns all the seats for a given plane id
const getSeats = async (plane_id) => {
  return getJson(fetch(SERVER_URL + "plane_seats/" + plane_id)).then((json) => {
    return json.map((seat) => {
      const clientSeat = {
        id: seat.id,
        row_n: seat.row_n,
        line: seat.line,
        plane_id: seat.plane_id,
        cod_user: seat.cod_user,
      };
      return clientSeat;
    });
  });
};





const API = {logIn,logOut, getUserInfo, getPlaneInfo, getSeats, confirmBooking, deleteBooking, checkSeatBooking};

export default API;
