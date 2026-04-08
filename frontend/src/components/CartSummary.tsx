import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartSummary() {
  const { items, totalItems, totalPrice } = useCart();

  if (totalItems === 0) {
    return (
      <div className="card">
        <div className="card-body text-center text-muted">
          <p className="mb-0">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header fw-bold">Cart Summary</div>
      <ul className="list-group list-group-flush">
        {items.map((item) => (
          <li key={item.book.bookId} className="list-group-item d-flex justify-content-between">
            <span>
              {item.book.title} x{item.quantity}
            </span>
            <span>${item.subtotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="card-body">
        <p className="fw-bold mb-2">Total: ${totalPrice.toFixed(2)}</p>
        <Link to="/cart" className="btn btn-primary btn-sm w-100">
          View Cart
        </Link>
      </div>
    </div>
  );
}

export default CartSummary;
