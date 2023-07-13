import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <>
      <Alert variant="danger">
        <h1>Page Not Found</h1>
        <p>
          Please go back to the <Link to="/">Home Page</Link>
        </p>
      </Alert>
    </>
  );
}

export default PageNotFound;
