import { NavLink } from "react-router-dom";

const Header = () => {
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-green-600 font-semibold border-b-2 border-green-600"
      : "text-gray-700 hover:text-green-600";

  return (
    <header className="fixed top-0 w-full bg-white shadow z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-xl font-bold text-green-600">
            MilletMart
          </h1>

          {/* Nav links */}
          <div className="flex gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Recipies
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              Cart
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
