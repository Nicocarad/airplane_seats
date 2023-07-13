import BookingComponents from "./BookingComponents";
import Counters from "./Counters";
import { Container, Button } from "react-bootstrap";
import "../sidebar_styles/Sidebar.css";
import "../sidebar_styles/ReservationForm.css";

// Delete booking component
function DeleteBox(props) {
  return (
    <Container className="already-booked container">
      <p>Do you want to cancel your booking?</p>
      <Button variant="danger" onClick={() => props.handleDeleteBooking()}>
        Delete
      </Button>
    </Container>
  );
}

function Sidebar(props) {
  const seatsArray = props.seatsMatrix.flat(); // array of all the seats for plane
  const availableSeatsArray = seatsArray.filter((el) => el.cod_user === null);
  const occupiedSeatsCount = seatsArray.filter((el) => el.cod_user !== null).length;

  // Ordered reservation
  function handleOrderedReservation(num) {
    let reservationArray = [];
    for (let i = 0; i < num; i++) {
      reservationArray.push(availableSeatsArray[i]);
    }
    props.handleReserveSeats(reservationArray);
  }

  return (
    <div className="cont-sidebar">
      <div
        md={3}
        xl={2}
        bg="light"
        className="below-nav border border-2 border-right-4 border-dark"
        id="left-sidebar"
      >
        <h1 className="sidebar-title">Total Seats: {props.totSeats}</h1>
        <Counters
          totSeatsCount={props.totSeats}
          reservedSeatsCount={props.reservedSeatsCount}
          availableSeatsCount={props.availableSeats}
          occupiedSeatsCount={occupiedSeatsCount}
          loading={props.loading}
        />

        {props.loggedIn ? (
          props.hasBooking ? (
            <>
              <section className="separator" />
              <DeleteBox handleDeleteBooking={props.handleDeleteBooking} />
            </>
          ) : (
            <>
              <section className="separator" />
              <BookingComponents
                orderedReservation={handleOrderedReservation}
                availableSeatsCount={props.availableSeats}
                disableReserveButton={props.disableReserveButton}
                handleConfirmReservation={props.handleConfirmReservation}
                handleCancelReservation={props.handleCancelReservation}
                handleLoading={props.handleLoading}
              />
            </>
          )
        ) : null}
      </div>
    </div>
  );
}

export default Sidebar;
