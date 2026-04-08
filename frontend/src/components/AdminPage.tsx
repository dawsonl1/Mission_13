import { useEffect, useState } from 'react';
import type { Book } from '../types/Book';
import { fetchBooks, deleteBook, createBook, updateBook } from '../api/BookAPI';
import EditBookForm from './EditBookForm';

function AdminPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => { document.title = 'Admin | Bookstore'; }, []);

  function loadBooks() {
    fetchBooks(1, 100).then((data) => setBooks(data.books));
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    await deleteBook(id);
    loadBooks();
  }

  async function handleSaveNew(book: Omit<Book, 'bookId'>) {
    await createBook(book);
    setShowAddForm(false);
    loadBooks();
  }

  async function handleSaveEdit(book: Book) {
    await updateBook(book.bookId, book);
    setEditingBook(null);
    loadBooks();
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Books</h2>
        <button className="btn btn-success" onClick={() => { setShowAddForm(true); setEditingBook(null); }}>
          + Add Book
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">Add New Book</div>
          <div className="card-body">
            <EditBookForm
              onSave={(book) => handleSaveNew(book as Omit<Book, 'bookId'>)}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}

      {editingBook && (
        <div className="card mb-4">
          <div className="card-header">Edit Book</div>
          <div className="card-body">
            <EditBookForm
              book={editingBook}
              onSave={(book) => handleSaveEdit(book as Book)}
              onCancel={() => setEditingBook(null)}
            />
          </div>
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => { setEditingBook(book); setShowAddForm(false); }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(book.bookId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
