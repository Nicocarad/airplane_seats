"use strict";

const express = require("express");
const session = require("express-session");
const { check } = require("express-validator");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userDao = require("./dao-users");
const seatsDao = require("./dao-seats");
const planesDao = require("./dao-planes");

const PORT = 3001;

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Cross-Origin Resource Sharing setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Passport setup
passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUser(username, password);
    if (!user) return callback(null, false, "Incorrect username or password");
    return callback(null, user);
  })
);

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  callback(null, user);
});

// Starting from data in the session extract the logged-in user
passport.deserializeUser((user, callback) => callback(null, user));

// Session
app.use(
  session({
    secret: "shhh it's a secret!",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

// Authentication verification middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

// Error handling middleware
const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
};
app.use(handleError);





// returns all the seats for a given plane id
app.get(
  "/api/plane_seats/:plane_id",
  [check("plane_id").isInt({ min: 1, max: 3 })],
  async (req, res, next) => {
    try {
      const seats = await seatsDao.getSeats(req.params.plane_id);
      res.json(seats);
    } catch (err) {
      next(err);
    }
  }
);

//  seat corresponding to the seat_id is updated with the user_id of the user that performed the reservation on that seat
app.put(
  "/api/reserve",
  isLoggedIn,
  [check("seat_id").isInt({ min: 1, max: 310 })],
  async (req, res, next) => {
    try {
      await seatsDao.bookSeats(req.user.id, req.body.seat_id);
      res.json({});
    } catch (err) {
      next(err);
    }
  }
);

//  given the user_id and the plane_type delete all the reserved seats associated to the user
app.delete(
  "/api/delete",
  isLoggedIn,
  [check("plane_id").isInt({ min: 1 })],
  async (req, res, next) => {
    try {
      await seatsDao.deleteSeats(req.user.id, req.body.plane_id);
      res.json({});
    } catch (err) {
      next(err);
    }
  }
);

// Given the seat_id, return the user_id of the user who reserved it
app.get(
  "/api/check/:seat_id",
  isLoggedIn,
  [check("seat_id").isInt({ min: 1, max: 310 })],
  async (req, res, next) => {
    try {
      const result = await seatsDao.checkSeats(req.params.seat_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);



// Planes APIs

// Get all planes info
app.get("/api/plane_info", async (req, res, next) => {
  try {
    const planeInfo = await planesDao.getPlaneInfo();
    res.json(planeInfo);
  } catch (err) {
    next(err);
  }
});



// Users APIs

// Login
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      return res.json(req.user);
    });
  })(req, res, next);
});

// Login status check
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// Logout
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

/////////////////////////////////////////////////////////

// Activating the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
