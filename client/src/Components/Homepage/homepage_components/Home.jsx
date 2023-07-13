import { Container } from "react-bootstrap";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";
import Footer from "./Footer";

import "../homepage_styles/Home.css";


import "../homepage_styles/PlaneBox.css";

function PlaneBox(props) {

  return (
    <div className="card shadow">
      <Link className="plane-link" to={`/${props.type}_plane`}>
        <Container className="image-container">
          <img className="card-img" src="./images/local.jpg" alt="Card image cap" />
        </Container>
        <Container className="card-body">
          <h5 className="card-title">
            {props.type.charAt(0).toUpperCase() + props.type.slice(1)}
          </h5>
          <p className="card-text">Total Seats: {props.tot_seats}</p>
          {props.type === "local" ? (
            <p className="card-description">"Affordable and convenient domestic travel within the country's borders"</p>
          ) : props.type === "regional" ? (
            <p className="card-description">"A medium size plane  connecting nearby cities and destinations within a region"</p>
          ) : (
            <p className="card-description">"Luxurious long-haul travel across continents, where comfort is the priority"</p>
          )}
        </Container>
      </Link>
    </div>
  );
}

function Home(props) {
  return (
    <>
      <Navigation loggedIn={props.loggedIn} logout={props.logout} />
      <Container className="home-page">
        <Container className="cards">
          {props.planesInfo.map((plane) => (
            <PlaneBox
              key={plane.id}
              id={plane.id}
              type={plane.type}
              tot_seats={plane.tot_seats}
            />
          ))}
        </Container>
        <Container className="cont">
          <img
            className="home-img"
            src="./images/valentino.jpg"
            alt="home image cap"
          />
        </Container>
      </Container>

      <Footer />
    </>
  );
}

export default Home;
