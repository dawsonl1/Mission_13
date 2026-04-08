import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import CartPage from './components/CartPage';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/adminbooks" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
