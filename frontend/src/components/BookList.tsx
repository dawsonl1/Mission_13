import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Book } from '../types/Book';
import { fetchBooks } from '../api/BookAPI';
import { useCart } from '../context/CartContext';
import CategoryFilter from './CategoryFilter';
import Pagination from './Pagination';
import CartSummary from './CartSummary';

function BookList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const { addToCart } = useCart();

  const currentPage = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('size') || '5');
  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'title';

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  useEffect(() => {
    fetchBooks(currentPage, pageSize, selectedCategory || undefined, sortBy).then((data) => {
      setBooks(data.books);
      setTotalCount(data.totalCount);
    });
  }, [currentPage, pageSize, selectedCategory, sortBy]);

  // Save current location for "Continue Shopping"
  useEffect(() => {
    sessionStorage.setItem('lastBookListUrl', window.location.search);
  }, [searchParams]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    setSearchParams(params);
  }

  function handleAddToCart(book: Book) {
    addToCart(book);
    setToastMessage(`"${book.title}" added to cart!`);
    setTimeout(() => setToastMessage(''), 3000);
  }

  return (
    <div className="container">
      <div className="row">
        {/* Category Sidebar */}
        <div className="col-md-3 mb-4">
          <h5>Categories</h5>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => updateParams({ category: cat, page: '1' })}
          />
        </div>

        {/* Book Grid */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Books ({totalCount})</h4>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={sortBy}
              onChange={(e) => updateParams({ sort: e.target.value, page: '1' })}
            >
              <option value="title">Sort by Title</option>
              <option value="author">Sort by Author</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          <div className="row row-cols-1 g-3">
            {books.map((book) => (
              <div key={book.bookId} className="col">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">{book.title}</h5>
                        <p className="card-text text-muted mb-1">by {book.author}</p>
                        <p className="card-text small mb-1">
                          {book.publisher} | {book.pageCount} pages
                        </p>
                        <p className="card-text small mb-1">
                          ISBN: {book.isbn}
                        </p>
                        <span className="badge bg-secondary me-1">{book.classification}</span>
                        <span className="badge bg-info">{book.category}</span>
                      </div>
                      <div className="text-end">
                        <p className="fs-5 fw-bold text-success mb-2">${book.price.toFixed(2)}</p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddToCart(book)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(p) => updateParams({ page: p.toString() })}
            onPageSizeChange={(s) => updateParams({ size: s.toString(), page: '1' })}
          />
        </div>

        {/* Cart Summary Sidebar */}
        <div className="col-md-3 mb-4">
          <h5>Your Cart</h5>
          <CartSummary />
        </div>
      </div>

      {/* Bootstrap Toast Notification (#notcoveredinthevideos) */}
      {toastMessage && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show align-items-center text-bg-success border-0">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToastMessage('')}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
