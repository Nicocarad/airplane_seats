import {
  Button,
  Container,
  Form,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";
import { useState } from "react";

import "../sidebar_styles/ReservationForm.css";
import "../sidebar_styles/ConfirmationForm.css";

function BookingComponents(props) {

  const [numSeats, setNumSeats] = useState(""); //input in the box cause re-render of the component

  const handleNumSeatsChange = (event) => {
    setNumSeats(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    if (numSeats > 0 && numSeats <= props.availableSeatsCount) {
      props.orderedReservation(numSeats); // assign seats in order according to the availability
    }
    console.log(`Number of reserved seats: ${numSeats}`);
    setNumSeats("");
  };

  const handleConfirmReservation = () => {
    props.handleLoading(); // set loading to true, the confirmed seats need to be saved in the db
    props.handleConfirmReservation(); // swithced
  };

  return (
    <>
      <Container className="reservation-form">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNumSeats">
            <Form.Label>Seats to reserve:</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                type="number"
                value={numSeats}
                min="1"
                max={props.availableSeatsCount}
                onChange={handleNumSeatsChange}
                required
              />
              <Button
                variant="outline-primary"
                type="submit"
                id="button-addon2"
                disabled={props.disableReserveButton}
              >
                Reserve
              </Button>
            </InputGroup>
          </Form.Group>
        </Form>
      </Container>
      <Container className="conf-container">
        <h2>Do you want to confirm your reservation?</h2>

        <ButtonGroup>
          <Button
            className="conf-button"
            variant="outline-success"
            onClick={handleConfirmReservation}
          >
            Confirm
          </Button>
          <Button
            className="conf-button"
            variant="outline-danger"
            onClick={props.handleCancelReservation}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Container>
    </>
  );
}

export default BookingComponents;
