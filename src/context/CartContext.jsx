import { createContext, useContext, useEffect, useState } from "react";
import { getCartAPI } from "../services/cartService";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await getCartAPI();
      setCartCount(res.data.cart.totalQuantity);
    } catch (err) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
