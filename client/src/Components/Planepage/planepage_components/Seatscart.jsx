import { Container, ListGroup } from "react-bootstrap";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

import "../planepage_styles/Seatscart.css";

const SeatsCart = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {props.reserved && props.reserved.length > 0 && (
        <>
          <Button className="btn-cart" variant="primary" onClick={handleShow}>
            Show Cart
          </Button>

          <Offcanvas placement="end" show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Your Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Container className="seat-list">
                <div className="scroll-container">
                  <ListGroup>
                    {props.reserved.map((seat) => (
                      <ListGroup.Item key={seat.id}>
                        Seat: {seat.row_n}-{seat.line}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </Container>
            </Offcanvas.Body>
          </Offcanvas>
        </>
      )}
    </>
  );
};

export default SeatsCart;
