import { createContext, useContext, useState, useCallback } from "react";

// ──────────────────────────────────────────────────────────────
//  Cart Context
//
//  Client-side shopping cart (not backed by the backend).
//  Stores cart items in state with product details + quantity.
//  When placing an order, the cart items are sent to the API.
// ──────────────────────────────────────────────────────────────

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.product._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
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
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
