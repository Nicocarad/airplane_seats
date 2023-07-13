import { Container, Button, Spinner } from "react-bootstrap";

import "../sidebar_styles/Counters.css";

function Counters(props) {
  return (
    <>
      <Container className="legend-cont d-flex flex-column">
        <span className="legend">
          <Button
            variant="outline-primary"
            className="seat-legend available custom-button"
            disabled={true}
          />
          <span className="seat-type">
            Available:{" "}
            {props.loading ? (
              <Spinner
              className="spinner-legend"
              animation="border"
              variant="dark"
              size="sm"
            />
            ) : (
              props.availableSeatsCount
            )}
            /{props.totSeatsCount}
          </span>
        </span>
        <span className="legend">
          <Button className="seat-legend reserved custom-button" variant="warining" disabled = {true}/>
          <span className="seat-type">
            Reserved: {props.reservedSeatsCount || 0}/{props.totSeatsCount}
          </span>
        </span>
        <span className="legend">
          <Button variant="danger"className="seat-legend occupied custom-button" disabled = {true} />
          <span className="seat-type">
            Occupied: {props.occupiedSeatsCount}/{props.totSeatsCount}
          </span>
        </span>
      </Container>
    </>
  );
}

export default Counters;
