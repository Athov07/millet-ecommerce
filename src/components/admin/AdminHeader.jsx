import { useAuth } from "../../hooks/useAuth";

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-card border-b p-4 flex justify-between items-center">
      <h1 className="font-semibold text-lg">
        Welcome, {user?.name || "Admin"}
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
