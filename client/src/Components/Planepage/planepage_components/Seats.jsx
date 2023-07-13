import "bootstrap-icons/font/bootstrap-icons.css";

import { useEffect, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";

import Sidebar from "../Sidebar/sidebar_components/Sidebar";
import Navbar from "../../Homepage/homepage_components/Navigation";
import Footer from "../../Homepage/homepage_components/Footer";
import SeatsCart from "./SeatsCart.jsx";

import API from "../../../API";

import "../planepage_styles/Seats.css";

function Seats(props) {
  // Seats states
  const [seatsMatrix, setSeatsMatrix] = useState([]);
  const [reservationArray, setReservationArray] = useState([]); 
  const [availableSeats, setAvailableSeats] = useState(0); 

  // flags
  const [disableReserveButton, setDisableReserveButton] = useState(false); //set the reserve button as enabled/disabled
  const [disableVisualSelection, setDisableVisualSelection] = useState(false); //set the grid box selection of seats enabled/disabled
  const [hasBooking, setHasBooking] = useState(false); //show if a user has or not a booking
  const [reloadSeatsBox, setReload] = useState(false); //state used to specify if seats must be reloaded or not
  const [loading, setLoading] = useState(false); // renders spinner components waiting response from database
  const [show, setShow] = useState(false);

  const possibleLines = ["A", "B", "C", "D", "E", "F"];
  const lines = possibleLines.slice(0, props.seatsPerRow);
  const plane_name =
    props.plane_id === 1
      ? "Local"
      : props.plane_id === 2
      ? "Regional"
      : "International";

  const possibleStates = {
    available: "outline-primary",
    reserved: "warning",
    occupied: "danger",
    conflictReserved: "outline-warning",
  };

  // Evaluate AVAILABLE SEATS
  // computed each time a new seat is reserved or cancelled and each time a booking is confirmed or deleted
  useEffect(() => {
    const availableSeatsCount = seatsMatrix
      .flat()
      .filter((s) => s.cod_user === null).length;
    const updatedAvailableSeatsCount = Math.max(
      availableSeatsCount - reservationArray.length,
      0
    );
    setAvailableSeats(updatedAvailableSeatsCount);
  }, [reservationArray.length, seatsMatrix]);





  // Build SEATS GRID with seats status retreived from db
  // computed each time a confirm/delete is executed
  useEffect(() => {
    API.getSeats(props.plane_id)
      .then((seat) => {
        const newMatrix = [];
        let row = [];
        seat.forEach((s) => {
          const obj = {
            ...s, // copy the properties of the object (fields in db)
            state: s.cod_user
              ? possibleStates.occupied
              : possibleStates.available,
          };
          row.push(obj);
          if (row.length >= props.seatsPerRow) {
            newMatrix.push(row);
            row = [];
          }
        });
        newMatrix.push(row);
        setReload(false); // when seats grid is reloaded set to false waiting for a new reload
        if (props.user) {
          // check if the logged in user has or not a previous booking (so after logout->login the state is updated with the correct status)
          setHasBooking(
            newMatrix.flat().filter((s) => s.cod_user === props.user.id)
              .length > 0
              ? true
              : false
          );
        }
        setSeatsMatrix(newMatrix);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.seatsPerRow, props.plane_id, reloadSeatsBox, props.user]); // reloadSeatsBox changes when a Confirmation/Delete operations are made to update the seats grid





  // Click on "RESERVE"
  function handleReserveSeats(reservedSeatsArray) {
    setReservationArray(reservedSeatsArray); // set the reservation state with new reserved seats
    setDisableVisualSelection(true);
    setDisableReserveButton(true);
  }





  // Click on "CANCEL"
  function handleCancelReservation() {
    if (reservationArray.length === 0) {
      console.log("There is no reservation to cancel");
      return;
    }

    setSeatsMatrix((prevSeatsMatrix) =>
      prevSeatsMatrix.map((row) =>
        row.map((seat) => ({
          ...seat,
          state:
            seat.state === possibleStates.reserved
              ? possibleStates.available
              : seat.state,
        }))
      )
    );

    setReservationArray([]);
    setDisableVisualSelection(false);
    setDisableReserveButton(false);
    console.log("Reservation canceled");
  }





  // Click on "CONFIRM"
  async function handleConfirmReservation() {
    if (reservationArray.length > 0) {
      setDisableVisualSelection(true);

      /**/
      // Highlight a seat if it'has been occupied
      const checkSeatPromises = reservationArray.map((seat) => {
        return new Promise((resolve, reject) => {
          API.checkSeatBooking(seat.id)
            .then((check) => {
              if (check.cod_user !== null) {
                setSeatsMatrix((oldSeats) => {
                  const updatedSeats = oldSeats.map((row) =>
                    row.map((s) =>
                      s.id === seat.id
                        ? { ...s, state: possibleStates.conflictReserved }
                        : s
                    )
                  );
                  return updatedSeats;
                });
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        });
      });

      /**/

      // Creates a Promise that is resolved with an array of results when all of the provided Promises resolve or reject.
      try {
        const results = await Promise.all(checkSeatPromises);
        const conflict = results.includes(true);
        // conflict is true if at least one of the previous promises returned true
        if (!conflict) {
          // container of promises
          const reservationPromises = reservationArray.map((el) =>
            API.confirmBooking(el.id).catch((err) => {
              console.log(err);
            })
          );
          await Promise.all(reservationPromises);
          console.log("Booking confirmed");
        } else {
          setShow(true); // if there are conflict on reserved seats
        }

        setTimeout(
          () => {
            setShow(false);
            setReload(true); //after a confirmation of a reservation reload the seats grid
            setReservationArray([]);
            setDisableVisualSelection(false);
            setDisableReserveButton(false);
          },
          conflict ? 5000 : 0
        );
      } catch {
        setShow(false);
        setReload(true); //after a confirmation of a reservation reload the seats grid
        setReservationArray([]);
        setDisableVisualSelection(false);
        setDisableReserveButton(false);
        console.log("Something goes wrong");
      }
    } else {
      //setReload(true);
      setLoading(false);
      console.log("There is no reservation to confirm");
    }
  }





  // Click on "DELETE"
  function handleDeleteBooking() {
    API.deleteBooking(props.plane_id)
      .then(() => {
        setDisableVisualSelection(false);
        setDisableReserveButton(false);
        setReload(true); //when a booking is deleted, reload the seats grid // changes in the database
        setHasBooking(false);
        console.log("Booking deleted");
      })
      .catch((err) => console.log(err));
  }


  

  // Click on a SEAT
  const handleSeatClick = (id) => {
    setSeatsMatrix((SeatsMatrix) => {
      const newSeatsMatrix = SeatsMatrix.map((row) =>
        row.map((seat) => {
          if (seat.id === id && seat.state === possibleStates.available) {
            const updatedSeat = { ...seat, state: possibleStates.reserved };
            return updatedSeat;
          } else if (seat.id === id && seat.state === possibleStates.reserved) {
            return { ...seat, state: possibleStates.available };
          } else {
            return seat;
          }
        })
      );
      // check new reserved seats
      const reservedSeatsArray = newSeatsMatrix
        .flat()
        .filter((seat) => seat.state === possibleStates.reserved);
      setReservationArray(reservedSeatsArray);
      setDisableReserveButton(reservedSeatsArray.length > 0); // set to true if there are some reserved seats
      return newSeatsMatrix;
    });
  };

  function handleLoading() {
    setLoading(true);
  }



  return (
    <>
      <Navbar />
      <Sidebar
        totSeats={props.totSeats}
        seatsMatrix={seatsMatrix}
        availableSeats={availableSeats}
        reservedSeatsCount={reservationArray.length}
        disableReserveButton={disableReserveButton}
        hasBooking={hasBooking}
        loading={loading}
        loggedIn={props.loggedIn}
        handleConfirmReservation={handleConfirmReservation}
        handleReserveSeats={handleReserveSeats}
        handleCancelReservation={handleCancelReservation}
        handleDeleteBooking={handleDeleteBooking}
        handleLoading={handleLoading}
      />
      <Container className="main-seats">
        <Container className="seats-grid">
          <Alert className="conf-alert" show={show} variant="warning">
            {" "}
            Ops.. someone was faster than you and seats have already been
            occupied, try a new reservation!!{" "}
          </Alert>
          {!show && loading && (
            <div className="spinner-overlay">
              <Spinner
                className="spinner-seats"
                animation="border"
                variant="dark"
                size="mg"
              />
            </div>
          )}
          <Container className="plane-border">
            <span className="plane-title">{plane_name} plane</span>
            <Container className="grid-box">
              <Container className="line-row">
                {lines.map((letter, index) => (
                  <Container className="line" key={index}>
                    <span>{letter}</span>
                  </Container>
                ))}
              </Container>
              {seatsMatrix.map((row, rowIndex) => (
                <Container className="seat-row" key={rowIndex}>
                  {row.map((seat, colIndex) => (
                    <Container className="seat-col" key={colIndex}>
                      <Button
                        variant={seat.state}
                        className="seat"
                        key={`${seat.id}`}
                        onClick={() => handleSeatClick(seat.id)}
                        disabled={
                          props.loggedIn
                            ? hasBooking
                              ? true
                              : disableVisualSelection || seat.cod_user
                            : true
                        }
                      >
                        {`${seat.row_n}-${seat.line}`}
                      </Button>
                    </Container>
                  ))}
                </Container>
              ))}
            </Container>
          </Container>
          {props.loggedIn && <SeatsCart reserved={reservationArray} />}
        </Container>
      </Container>
      <Footer />
    </>
  );
}

export default Seats;
