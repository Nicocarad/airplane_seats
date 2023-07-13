import "bootstrap-icons/font/bootstrap-icons.css";

import {
  Container,
  Form,
  Button,
  Alert,
  CloseButton
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Footer from "../Homepage//homepage_components/Footer";

import "./login.css";

function LoginPage(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); // show error message

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props
      .login(credentials)
      .then(() => navigate("/"))
      .catch((err) => {
        console.log(err);
        setShow(true);
      });
  };

  return (
    <>
      <Container className="wrapper">
        <Container className="main">
            <Container className="right-col border">
              <CloseButton 
              onClick={() => navigate("/")}
              />
              <Form className="input-box" onSubmit={handleSubmit}>
                <Alert
                  dismissible
                  show={show}
                  onClose={() => setShow(false)}
                  variant="danger"
                >
                  Username or password incorrect!
                </Alert>
                <header>Login</header>
                <Form.Group className="input-field">
                  <Form.Control
                    type="text"
                    className="input"
                    id="email"
                    required={true}
                    autoComplete="off"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    placeholder="Username"
                  />
                </Form.Group>
                <Form.Group className="input-field">
                  <Form.Control
                    type="password"
                    className="input"
                    id="password"
                    required={true}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Password"
                  />
                </Form.Group>
                <Form.Group className="input-field">
                  <Button type="submit" className="submit">
                    Log In
                  </Button>
                </Form.Group>
              </Form>
              <Container className="sign-in">
                <span>
                  Don&apos;t have an account? <a href="*">Sign up here</a>
                </span>
              </Container>
            </Container>
        </Container>
      </Container>
      <Footer />
    </>
  );
}



export default LoginPage;
