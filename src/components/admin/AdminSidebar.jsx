import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const baseClass =
    "block px-4 py-2 rounded transition hover:bg-primary/20";

  const activeClass =
    "bg-primary text-white hover:text-black";

  const inactiveClass =
    "text-gray-700 hover:text-black";

  return (
    <aside className="w-64 bg-card border-r min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6 text-primary">
        Admin Panel
      </h2>

      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Orders
        </NavLink>

        <NavLink
          to="/admin/recipes"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Recipes
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
