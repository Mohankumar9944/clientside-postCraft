import { Link } from 'react-router-dom';
import '../styles/PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="page-not-found">
        <h1>Page Not Found 😔</h1>
        <h3>
          Go to the Home Page 😊
          <Link to="/">Home Page</Link>
        </h3>
    </div>
  );
};

export default PageNotFound;
