import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => { document.title = 'Cart | Bookstore'; }, []);

  function handleContinueShopping() {
    const lastUrl = sessionStorage.getItem('lastBookListUrl') || '';
    navigate('/' + lastUrl);
  }

  if (items.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h3>Your cart is empty</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">Shopping Cart</h2>
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th style={{ width: '120px' }}>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.book.bookId}>
              <td>
                <strong>{item.book.title}</strong>
                <br />
                <small className="text-muted">by {item.book.author}</small>
              </td>
              <td>${item.book.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.book.bookId, Number(e.target.value))}
                />
              </td>
              <td>${item.subtotal.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromCart(item.book.bookId)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end fw-bold">
              Total:
            </td>
            <td className="fw-bold">${totalPrice.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={handleContinueShopping}>
          Continue Shopping
        </button>
        <button className="btn btn-outline-danger" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default CartPage;
