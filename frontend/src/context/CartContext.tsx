import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Book, CartItem } from '../types/Book';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_TO_CART'; book: Book }
  | { type: 'REMOVE_FROM_CART'; bookId: number }
  | { type: 'UPDATE_QUANTITY'; bookId: number; quantity: number }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find((i) => i.book.bookId === action.book.bookId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.book.bookId === action.book.bookId
              ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.book.price }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { book: action.book, quantity: 1, subtotal: action.book.price }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { items: state.items.filter((i) => i.book.bookId !== action.bookId) };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.book.bookId !== action.bookId) };
      }
      return {
        items: state.items.map((i) =>
          i.book.bookId === action.bookId
            ? { ...i, quantity: action.quantity, subtotal: action.quantity * i.book.price }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

function loadCart(): CartState {
  const saved = sessionStorage.getItem('cart');
  return saved ? JSON.parse(saved) : { items: [] };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart: (book) => dispatch({ type: 'ADD_TO_CART', book }),
        removeFromCart: (bookId) => dispatch({ type: 'REMOVE_FROM_CART', bookId }),
        updateQuantity: (bookId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', bookId, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
