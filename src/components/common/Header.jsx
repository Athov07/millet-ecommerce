import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-green-600 font-semibold border-b-2 border-green-600"
      : "text-gray-700 hover:text-green-600";

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            Milvita <img className="w-[40px] h-[40px]" src="src/assets/logo.png" alt="logo"></img>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/recipes" className={navLinkClass}>Recipes</NavLink>

            {/* CART */}
            {user && (
              <NavLink to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                    {cartCount}
                  </span>
                )}
              </NavLink>
            )}

            {/* AUTH */}
            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                <NavLink to="/register" className={navLinkClass}>Register</NavLink>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name || user.phone}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 pb-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass} onClick={() => setMenuOpen(false)}>Products</NavLink>
            <NavLink to="/recipes" className={navLinkClass} onClick={() => setMenuOpen(false)}>Recipes</NavLink>

            {user && (
              <NavLink to="/cart" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Cart {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
              </NavLink>
            )}

            {!user ? (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
                <NavLink to="/register" className={navLinkClass} onClick={() => setMenuOpen(false)}>Register</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>
                <NavLink to="/orders" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Orders</NavLink>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
