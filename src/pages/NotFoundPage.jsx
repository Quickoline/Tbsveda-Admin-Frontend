import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="centered">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;
