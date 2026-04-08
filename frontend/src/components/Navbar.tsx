import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Bookstore
        </Link>
        <div className="navbar-nav me-auto">
          <Link className="nav-link" to="/">
            Books
          </Link>
          <Link className="nav-link" to="/adminbooks">
            Admin
          </Link>
        </div>
        <Link className="btn btn-outline-light position-relative" to="/cart">
          Cart
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
