import "bootstrap-icons/font/bootstrap-icons.css";

import {Nav, Navbar, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "../homepage_styles/Navigation.css";

const Navigation = (props) => {
  const loggedIn = props.loggedIn;
  const navigate = useNavigate();

  return (
    <>
      <Navbar
        bg="primary"
        expand="sm"
        variant="dark"
        fixed="top"
        className="navbar-padding justify-content-between"
      >
        <Navbar.Brand>
          <i className="bi-airplane nav-icon" />
        </Navbar.Brand>
        <Navbar.Brand className="title">PoliTO Airwais</Navbar.Brand>
        <Nav className="ml-md-auto">
          {loggedIn === true ? (
            <Button
              variant="outline-light"
              size="mg"
              className="right-btn"
              onClick={props.logout}
            >
              Logout
            </Button>
          ) : typeof loggedIn === "undefined" ? (
            <Button
              variant="outline-light"
              size="mg"
              className="right-btn"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          ) : (
            <Button
              variant="outline-light"
              size="mg"
              className="right-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
          <Navbar.Brand>
            <i className="bi-person-circle nav-icon" />
          </Navbar.Brand>
        </Nav>
      </Navbar>
    </>
  );
};

export default Navigation;
