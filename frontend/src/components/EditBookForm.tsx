import { useState } from 'react';
import { Book } from '../types/Book';

interface Props {
  book?: Book;
  onSave: (book: Book | Omit<Book, 'bookId'>) => void;
  onCancel: () => void;
}

function EditBookForm({ book, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    title: book?.title || '',
    author: book?.author || '',
    publisher: book?.publisher || '',
    isbn: book?.isbn || '',
    classification: book?.classification || '',
    category: book?.category || '',
    pageCount: book?.pageCount || 0,
    price: book?.price || 0,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (book) {
      onSave({ ...form, bookId: book.bookId });
    } else {
      onSave(form);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Author</label>
          <input name="author" className="form-control" value={form.author} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Publisher</label>
          <input name="publisher" className="form-control" value={form.publisher} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">ISBN</label>
          <input name="isbn" className="form-control" value={form.isbn} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Classification</label>
          <input name="classification" className="form-control" value={form.classification} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Category</label>
          <input name="category" className="form-control" value={form.category} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <label className="form-label">Pages</label>
          <input name="pageCount" type="number" className="form-control" value={form.pageCount} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <label className="form-label">Price</label>
          <input name="price" type="number" step="0.01" className="form-control" value={form.price} onChange={handleChange} required />
        </div>
      </div>
      <div className="mt-3 d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {book ? 'Update' : 'Add'} Book
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditBookForm;
