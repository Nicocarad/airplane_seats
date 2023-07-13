import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import API from "./API";

import Home from "./Components/Homepage/homepage_components/Home.jsx";
import LoginPage from "./Components/Login/login";
import Seats from "./Components/Planepage/planepage_components/Seats";
import PageNotFound from "./Components/Utils/PageNotFound";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [planesInfo, setPlanesInfo] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await API.getUserInfo();
        setUser(user);
        setLoggedIn(true);
      } catch (err) {
        setUser(null);
        setLoggedIn(false);
      }
    };
    init();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = async () => {
    try {
      await API.logOut();
      setLoggedIn(false);
      setUser(null);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    API.getPlaneInfo()
      .then((plane_info) => {
        setPlanesInfo(plane_info);
      })
      .catch((err) => {
        console.error("Error fetching plane info:", err);
      });
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                loggedIn={loggedIn}
                planesInfo={planesInfo}
                logout={handleLogout}
              />
            }
          />
          <Route
            path="/login"
            element={
              !loggedIn ? (
                <LoginPage login={handleLogin} loggedIn={loggedIn} />
              ) : (
                <Navigate replace to="/"></Navigate>
              )
            }
          />
          {planesInfo.length > 0 && (
            <>
              <Route
                key={planesInfo[0].id}
                path={"/local_plane"}
                element={
                  <Seats
                    plane_id={planesInfo[0].id}
                    rowNum={planesInfo[0].rows}
                    seatsPerRow={planesInfo[0].seats_per_row}
                    totSeats={planesInfo[0].tot_seats}
                    loggedIn={loggedIn}
                    user={loggedIn ? user : null}
                  />
                }
              />
              <Route
                key={planesInfo.id}
                path={"/regional_plane"}
                element={
                  <Seats
                    plane_id={planesInfo[1].id}
                    rowNum={planesInfo[1].rows}
                    seatsPerRow={planesInfo[1].seats_per_row}
                    totSeats={planesInfo[1].tot_seats}
                    loggedIn={loggedIn}
                    user={loggedIn ? user : null}
                  />
                }
              />
              <Route
                key={planesInfo.id}
                path={"/international_plane"}
                element={
                  <Seats
                    plane_id={planesInfo[2].id}
                    rowNum={planesInfo[2].rows}
                    seatsPerRow={planesInfo[2].seats_per_row}
                    totSeats={planesInfo[2].tot_seats}
                    loggedIn={loggedIn}
                    user={loggedIn ? user : null}
                  />
                }
              />
            </>
          )}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
