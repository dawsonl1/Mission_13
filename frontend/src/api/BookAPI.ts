import type { Book } from '../types/Book';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5207/api/bookstore';

export async function fetchBooks(
  pageNum: number,
  pageSize: number,
  category?: string,
  sortBy: string = 'title'
): Promise<{ books: Book[]; totalCount: number }> {
  const params = new URLSearchParams({
    pageNum: pageNum.toString(),
    pageSize: pageSize.toString(),
    sortBy,
  });
  if (category) params.append('category', category);

  const res = await fetch(`${API_BASE}/books?${params}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

export async function fetchBook(id: number): Promise<Book> {
  const res = await fetch(`${API_BASE}/books/${id}`);
  return res.json();
}

export async function createBook(book: Omit<Book, 'bookId'>): Promise<Book> {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  return res.json();
}

export async function updateBook(id: number, book: Book): Promise<void> {
  await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
}

export async function deleteBook(id: number): Promise<void> {
  await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
}
